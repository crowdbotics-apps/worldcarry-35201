from django.db.models import Q
from orders.models import Order


def get_onround_orders(journey):
    order_statuses = ['Unpaid', 'Requested', "Accepted"]

    if journey.type == 'Round Trip':
        orders = Order.objects.filter((Q(status__in=order_statuses) &
                                       (Q(pickup_address_country=journey.departure_country) &
                                        Q(arrival_address_country=journey.arrival_country))
                                       |
                                       Q(Q(pickup_address_country=journey.arrival_country) &
                                         Q(arrival_address_country=journey.departure_country))))
    else:
        orders = Order.objects.filter(status__in=order_statuses,
                                      pickup_address_country=journey.departure_country,
                                      arrival_address_country=journey.arrival_country)

    return orders
