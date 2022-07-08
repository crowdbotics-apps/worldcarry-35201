from rest_framework import serializers

from .models import Location


class LocationSerializer(serializers.ModelSerializer):
    """
    A data serialization of the location history of a User
    """
    class Meta:
        model = Location
        fields = '__all__'
        extra_kwargs = {
            'user': {
                'required': False
            }
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.coordinates:
            rep['coords'] = instance.coordinates.coords
        return rep
