from rest_framework import serializers

from users.serializers import UserProfileSerializer

from .models import Journey


class JourneySerializer(serializers.ModelSerializer):
    """
    A data serialization of a Carrier User's Journey
    """
    class Meta:
        model = Journey
        fields = '__all__'
        extra_kwargs = {
            'user': {
                'required': False
            }
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = UserProfileSerializer(
            instance.user
        ).data
        return rep
