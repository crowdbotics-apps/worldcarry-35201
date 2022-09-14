from reviews.serializers import ReviewSerializer, ReviewListSerializer
from rest_framework.permissions import IsAuthenticated
from users.authentication import ExpiringTokenAuthentication
from reviews.models import Review
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.response import Response


class ReviewViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = ReviewSerializer
    queryset = Review.objects.filter()
    filterset_fields = ['target_user', 'added_by', 'order', 'journey']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = ReviewListSerializer(queryset, many=True)
        return Response(serializer.data)

