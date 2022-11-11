from django.utils import timezone
from django.db.models import Q, Subquery
from journeys.models import Journey, DeclineJourneyOrder


def get_on_rout_journeys(order):
    today = timezone.now()

    journeys = Journey.objects.filter(
        Q(
            Q(date_of_journey__lt=order.deliver_before_date) &
            Q(date_of_journey__gt=today)
        ) &
        (
                Q(type="Round Trip") &
                (
                        Q(departure_country=order.pickup_address_country) &
                        Q(arrival_country=order.arrival_address_country)
                ) |
                (
                        Q(departure_country=order.arrival_address_country) &
                        Q(arrival_country=order.pickup_address_country)
                )
        ) |
        (
                Q(type="One Way") &
                Q(departure_country=order.pickup_address_country) &
                Q(arrival_country=order.arrival_address_country)
        )
    )
    # Excluding already reject offers
    journeys = journeys.exclude(id__in=Subquery(DeclineJourneyOrder.objects.filter(order=order).values_list(
            'journey', flat=True)))
    return journeys
