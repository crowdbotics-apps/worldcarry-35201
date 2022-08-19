from rest_framework import serializers

from users.serializers import UserProfileSerializer

from .models import Journey, JourneyOrder
from orders.models import Order


class JourneySerializer(serializers.ModelSerializer):
    """
    A data serialization of a Carrier User's Journey
    """
    offers = serializers.SerializerMethodField()

    class Meta:
        model = Journey
        fields = ('id', 'user', 'type', 'departure_city', 'departure_state', 'departure_country', 'arrival_city',
                  'arrival_state', 'arrival_country', 'date_of_journey', 'date_of_return', 'willing_to_carry',
                  'total_weight', 'status', 'offers')

        extra_kwargs = {
            'user': {
                'required': False
            }
        }

    def get_offers(self, journey):
        journey_orders = Order.objects.filter(pickup_address_city=journey.departure_city,
                                              arrival_address_city=journey.arrival_city,
                                              deliver_before_date__lte=journey.date_of_journey,
                                              status__in=['Unpaid', 'Requested']).count()
        return journey_orders

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = UserProfileSerializer(
            instance.user
        ).data
        return rep


class JourneyOrderSerializer(serializers.Serializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)
    journey = serializers.PrimaryKeyRelatedField(queryset=Journey.objects.all(), required=True)
    user = serializers.ChoiceField(choices=("sender", "carrier"), required=True)   # sender/carrier
