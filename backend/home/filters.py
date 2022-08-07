from django_filters import FilterSet, CharFilter, DateFilter
from rest_framework.filters import OrderingFilter
from django_filters import rest_framework as filters

from journeys.models import Journey, JourneyOrder


class JourneyFilter(FilterSet):
    departure_min_time = DateFilter(field_name='date_of_journey', lookup_expr='gte')
    departure_max_time = DateFilter(field_name='date_of_journey', lookup_expr='lte')
    arrival_min_time = DateFilter(field_name='date_of_return', lookup_expr='gte')
    arrival_max_time = DateFilter(field_name='date_of_return', lookup_expr='lte')

    class Meta:
        model = Journey
        fields = ['user', 'type', 'departure_country', 'departure_state',
                  'departure_city', 'arrival_country', 'arrival_state', 'arrival_city',
                  'departure_min_time', 'departure_max_time', 'arrival_min_time',
                  'arrival_max_time', 'status']


class CustomOrdering(OrderingFilter):

    allowed_custom_filters = ['date_of_journey', "created_at"]

    def get_ordering(self, request, queryset, view):
        """
        Ordering is set by a comma delimited ?ordering=... query parameter.

        The `ordering` query parameter can be overridden by setting
        the `ordering_param` value on the OrderingFilter or by
        specifying an `ORDERING_PARAM` value in the API settings.
        """
        params = request.query_params.get(self.ordering_param)

        if params:
            fields = [param.strip() for param in params.split(',')]
            # care with that - this will alow only custom ordering!
            ordering = [f for f in fields if f in self.allowed_custom_filters]
            if ordering:
                return ordering

        # No ordering was included, or all the ordering fields were invalid
        return self.get_default_ordering(view)

    def filter_queryset(self, request, queryset, view):

        ordering = self.get_ordering(request, queryset, view)
        if ordering:
            # implement a custom ordering here
            ordering = ['-id']

        if ordering:
            return queryset.order_by(*ordering)

        return queryset