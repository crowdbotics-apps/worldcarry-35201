from django.contrib.auth import get_user_model, authenticate
from django.db.models import Q, Sum, Count, When, Case

from rest_framework import serializers

from home.utility import verifyOTP
from orders.models import Order
from users.models import Profile, User

from allauth.account.models import EmailAddress
from djstripe.models import PaymentMethod


class ProfileSerializer(serializers.ModelSerializer):
    """
    A data serialization of the non-authenitcation related fields
    of a User
    """
    class Meta:
        model = Profile
        exclude = ('user',)


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a User
    """
    profile = ProfileSerializer(required=False)
    is_admin = serializers.SerializerMethodField()
    has_payment_method = serializers.SerializerMethodField()
    transactions = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'email', 'password', 'is_admin',
                  'phone', 'profile', 'has_payment_method', 'transactions')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5},
                        'email': {'required': True},
                        'name': {'required': True},
                        # 'email_verified': {'read_only': True},
                        # 'phone_verified': {'read_only': True}
                        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.get('email')
        validated_data['username'] = email
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        email_address, created = EmailAddress.objects.get_or_create(user=user, email=user.email, verified=True, primary=True)
        return user

    def update(self, instance, validated_data):
        email = validated_data.get('email', None)
        if email:
            validated_data['username'] = email
        if 'profile' in validated_data:
            nested_serializer = self.fields['profile']
            nested_instance = instance.profile
            nested_data = validated_data.pop('profile')
            nested_serializer.update(nested_instance, nested_data)
        user = super().update(instance, validated_data)
        return user

    def get_is_admin(self, obj):
        return obj.is_superuser

    def get_has_payment_method(self, obj):
        if not obj.account:
            return False
        return PaymentMethod.objects.filter(customer=obj.account).exists()

    def get_transactions(self, obj):
        totals = Order.objects.filter(
            Q(
                user=obj
            ) | 
            Q(
                carrier=obj
            )
        ).aggregate(
            orders_delivered =
                Count(Case(
                    When(carrier=obj, then=1)
                )
            ),
            amount_rewarded = 
                Sum(Case(
                    When(carrier=obj, then='carrier_reward')
                )
            ),
            orders_created =
                Count(Case(
                    When(user=obj, then=1)
                )
            ),
            amount_paid =
                Sum(Case(
                    When(user=obj, then='total')
                )
            )
        )
        if totals['orders_delivered'] is None:
            totals['orders_delivered'] = 0
        if totals['amount_rewarded'] is None:
            totals['amount_rewarded'] = 0
        if totals['orders_created'] is None:
            totals['orders_created'] = 0
        if totals['amount_paid'] is None:
            totals['amount_paid'] = 0
        return totals


class OTPSerializer(serializers.Serializer):
    """
    Custom serializer to verify an OTP and Activate a User
    """
    otp = serializers.CharField(max_length=4, required=True)
    email = serializers.CharField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid Email'})
        else:
            if verifyOTP(otp=otp, activation_key=user.activation_key, user=user):
                user.is_active = True
                user.activation_key = ''
                user.otp = ''
                user.save()
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError({'detail': 'Invalid or Expired OTP, please try again'})


class ChangePasswordSerializer(serializers.Serializer):
    """
    Custom serializer used to set the password for a User
    """
    password_1 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_2 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        pass1 = attrs.get('password_1')
        pass2 = attrs.get('password_2')
        if pass1 != pass2:
            raise serializers.ValidationError({'detail': 'Passwords do not match'})
        return super().validate(attrs)


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Serializer for returning an authenticated User and Token
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if not user:
            raise serializers.ValidationError({'detail': 'Unable to authenticate with provided credentials'})
        attrs['user'] = user
        return attrs


class PassportAuthenticationSerializer(serializers.Serializer):
    passport_photo = serializers.ImageField(required=True)
    selfie_photo = serializers.ImageField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    passport_number = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)
    meeting_datetime = serializers.DateTimeField(required=False, format="%Y-%m-%d %H:%M:%S")


class UserNotificationSerializer(serializers.Serializer):
    target_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    title = serializers.CharField(required=True, allow_blank=True, allow_null=False)
    description = serializers.CharField(required=True, allow_blank=True, allow_null=False)
