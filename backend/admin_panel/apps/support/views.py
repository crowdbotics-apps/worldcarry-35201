from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from admin_panel.apps.support.models import FAQ, SupportRequest, Feedback
from admin_panel.apps.support.serializers import FaqSerializer, FeedbackSerializer, SupportRequestSerializer
from home.permissions import IsAdmin
from rest_framework.generics import CreateAPIView, ListAPIView


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



class FAQListAPIView(ListAPIView):
    permission_classes = ""
    serializer_class = FaqSerializer
    queryset = FAQ.objects.filter(is_visible=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SupportRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = SupportRequestSerializer
    queryset = SupportRequest.objects.filter()


class SupportCreateAPIView(CreateAPIView):
    permission_classes = ""
    serializer_class = SupportRequestSerializer
    queryset = SupportRequest.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)