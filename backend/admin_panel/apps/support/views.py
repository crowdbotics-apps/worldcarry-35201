from orders.models import Order
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
import itertools
from admin_panel.apps.support.models import FAQ, SupportRequest, Feedback
from admin_panel.apps.support.serializers import DashboardSerializer, FaqSerializer, FeedbackSerializer, SupportRequestSerializer
from home.permissions import IsAdmin
from rest_framework.generics import CreateAPIView, ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count


User = get_user_model()


class FeedbackViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.filter().order_by('-created_at')
    http_method_names = ['get', 'post', 'put', 'delete']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_read"]


class FeedbackAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class FAQViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FaqSerializer
    queryset = FAQ.objects.filter(is_visible=True)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['categories']

    def get_queryset(self):
        queryset = self.queryset.distinct("categories")
        return queryset


class FAQListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FaqSerializer
    queryset = FAQ.objects.filter(is_visible=True)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['categories']

    def get_queryset(self):
        queryset = self.queryset.distinct('categories')
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SupportRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SupportRequestSerializer
    queryset = SupportRequest.objects.filter()


class SupportCreateAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SupportRequestSerializer
    queryset = SupportRequest.objects.filter()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DashboardSerializer
    
    def get(self, request):
        data = {
            "total_users": User.objects.all().count(),
            "active_users": User.objects.filter(is_active=True).count(),
            "inactive_users": User.objects.filter(is_active=False).count(),
            "total_orders": Order.objects.all().count(),
            "revenue_amount": sum(item['total'] for item in Order.objects.all().values('total')),
            "feedback_emails": Feedback.objects.values('email').annotate(count=Count('email')).count(),
            "unread_feedbacks": Feedback.objects.filter(is_read=False).count(),
            "read_feedbacks": Feedback.objects.filter(is_read=True).count(),
        }
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors)