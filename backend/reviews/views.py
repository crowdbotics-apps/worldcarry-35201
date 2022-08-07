from reviews.serializers import ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from users.authentication import ExpiringTokenAuthentication
from reviews.models import Review
from rest_framework.viewsets import ModelViewSet, ViewSet


class ReviewViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = ReviewSerializer
    queryset = Review.objects.filter()
    filterset_fields = ['target_user', 'added_by', 'order', 'journey']
