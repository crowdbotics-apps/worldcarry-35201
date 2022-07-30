from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from allauth.account.models import EmailAddress
from worldcarry_35201.settings import SECRET_KEY

from home.utility import send_invitation_email, send_verification_email, send_verification_phone
from users.models import User
from users.authentication import ExpiringTokenAuthentication
from home.permissions import IsPostOrIsAuthenticated

from home.utility import auth_token, send_otp
from users.serializers import ChangePasswordSerializer, CustomAuthTokenSerializer, OTPSerializer, UserProfileSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = (IsPostOrIsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = User.objects.all()

    # Create User and return Token + Profile
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED, headers=headers) 

    # Update Profile
    def partial_update(self, request, *args, **kwargs):
        partial = True
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Send a OTP
    @action(detail=False, methods=['post'])
    def otp(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"detail": "Invalid Email - Does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        send_otp(user)
        return Response(status=status.HTTP_200_OK)

    # Verify OTP
    @action(detail=False, methods=['post'])
    def verify(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserProfileSerializer(user)
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Set password
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password_1'])
            user.save()
            return Response({'detail': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Login a User
    @action(detail=False, methods=['post'])
    def login(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data, context = {'request':request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserProfileSerializer(user, context = {'request':request})
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Logout a Client
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            return Response({'detail': 'Authentication Token Missing or Invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_200_OK)

    # Admin a User
    @action(detail=False, methods=['post'])
    def admin(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        key = request.data.get('key')
        if key != SECRET_KEY:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_superuser(email, email, password)
        email_address, created = EmailAddress.objects.get_or_create(user=user, email=user.email, verified=True, primary=True)
        return Response(status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def invite_friends(self, request):
        email = request.data.get('email')
        if not email:
            return Response(data={"message":"Email field is missing"},status=status.HTTP_400_BAD_REQUEST)
        response = send_invitation_email(email=email)
        return Response(
            data={"message":"Email successfully connected"},
            status=status.HTTP_200_OK
        )
    

    @action(detail=False, methods=['post', 'get'])
    def verify_email(self, request):
        if request.method == "POST":
            email = request.data.get('email')
            if not email or request.user.profile.is_email_verified:
                return Response(data={"message":"Email field is missing or email already verified"},status=status.HTTP_400_BAD_REQUEST)
            response = send_verification_email(request.user, email=email)
            return Response(
                data=response,
                status=status.HTTP_200_OK
            )
        if request.method == "GET":
            otp = request.GET.get('otp')
            if not otp:
                return Response(
                    data={"message":"OTP field is missing"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if request.user.profile.email_verification_otp == otp:
                request.user.profile.is_email_verified=True
                request.user.profile.save()
                return Response(
                    data={"message": "Email OTP Verified now"},
                    status=status.HTTP_200_OK
                )
            return Response(
                data={"message": "Unable to verify OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )



    @action(detail=False, methods=['post', 'get'])
    def verify_phone(self, request):
        if request.method == "POST":
            try:
                phone = request.data.get('phone')
                if not phone or request.user.profile.is_phone_verified:
                    return Response(data={"message":"Phone field is missing or phone already verified"},status=status.HTTP_400_BAD_REQUEST)
                response = send_verification_phone(request.user, phone=phone)
                return Response(
                    data=response,
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    data={"message": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if request.method == "GET":
            try:
                otp = request.GET.get('otp')
                if not otp:
                    raise Exception("OTP field is missing")
                if request.user.profile.phone_verification_otp == otp:
                    request.user.profile.is_phone_verified=True
                    request.user.profile.save()
                    return Response(
                        data={"message": "Phone OTP Verified now"},
                        status=status.HTTP_200_OK
                    )
                raise Exception("Unable to verify OTP")
            except Exception as e:
                return Response(
                    data={"message": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )




    @action(detail=False, methods=['get'])
    def verify_passport(self, request):
        if request.method == "GET":
            return Response(
                data={"message":"Phone succesfully verified"},
                status=status.HTTP_200_OK
            )
        if request.method == "POST":
            return Response(
                data={"message":"Phone succesfully verified"},
                status=status.HTTP_200_OK
            )

        email = request.data.get('email')
        if not email:
            return Response(data={"message":"Email field is missing"},status=status.HTTP_400_BAD_REQUEST)
        response = send_invitation_email(email=email)
        return Response(
            data={"message":"Email successfully connected"},
            status=status.HTTP_200_OK
        )

        # Verify OTP
    @action(detail=False, methods=['post'])
    def delete(self, request):
        try:
            User.objects.filter(id=request.user.id).delete()
            return Response({'message':"User succesfully deleted now"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message':"Error while deleting user"}, status=status.HTTP_400_BAD_REQUEST)
