from django_filters import FilterSet, CharFilter, DateFilter

from journeys.models import Journey

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
        'arrival_max_time']
