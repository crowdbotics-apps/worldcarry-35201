from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from admin_panel.apps.feedback.models import Feedback
from admin_panel.apps.feedback.serializers import FeedbackSerializer
from home.permissions import IsAdmin
from rest_framework.generics import CreateAPIView


class FeedbackViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.filter()


class FeedbackAPIView(CreateAPIView):
    permission_classes = ""
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
