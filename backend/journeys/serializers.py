from rest_framework import serializers
from django.db.models import Q
from users.serializers import UserProfileSerializer

from .models import Journey, DeclineJourneyOrder
from orders.models import Order
from orders.utils import get_onround_orders
from reviews.models import Review


class JourneySerializer(serializers.ModelSerializer):
    """
    A data serialization of a Carrier User's Journey
    """
    offers = serializers.SerializerMethodField()
    reviewed = serializers.SerializerMethodField()

    class Meta:
        model = Journey
        fields = ('id', 'user', 'type', 'departure_city', 'departure_state', 'departure_country', 'arrival_city',
                  'arrival_state', 'arrival_country', 'date_of_journey', 'date_of_return', 'willing_to_carry',
                  'total_weight', 'status', 'offers', 'created_at', 'reviewed')

        extra_kwargs = {
            'user': {
                'required': False
            }
        }

    def get_offers(self, journey):
        order_statuses = ['Unpaid', 'Requested', "Accepted"]
        if journey.type == 'Round Trip':
            orders = Order.objects.filter((Q(status__in=order_statuses) &
                                       (Q(pickup_address_country=journey.departure_country) &
                                        Q(arrival_address_country=journey.arrival_country))
                                       |
                                       Q(Q(pickup_address_country=journey.arrival_country) &
                                         Q(arrival_address_country=journey.departure_country)))).count()
        else:
            orders = Order.objects.filter(status__in=order_statuses,
                                          pickup_address_country=journey.departure_country,
                                          arrival_address_country=journey.arrival_country).count()

        return orders

    @staticmethod
    def get_reviewed(obj):
        return True if Review.objects.filter(journey=obj).exists() else False

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = UserProfileSerializer(
            instance.user
        ).data
        return rep

    def create(self, validated_data):
        journey = super().create(validated_data)
        orders = get_onround_orders(journey=journey)
        for order in orders:
            # TODO add notification to each journey user
            user = order.user
            message = "A new journey created that you can take along with you"
            # data = journey.id  # this need to send in notification
        return journey


class JourneyOrderSerializer(serializers.Serializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=True)
    journey = serializers.PrimaryKeyRelatedField(queryset=Journey.objects.all(), required=True)
    user = serializers.ChoiceField(choices=("sender", "carrier"), required=True)   # sender/carrier


class MyJourneySerilaizer(serializers.Serializer):
    completed = JourneySerializer(many=True)
    ongoing = JourneySerializer(many=True)
    upcoming = JourneySerializer(many=True)


class DeclineJourneyOrderSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = DeclineJourneyOrder
