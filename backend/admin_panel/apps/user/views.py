from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from home.api.v1.serializers import UserSerializer
from home.permissions import IsAdmin
from rest_framework.response import Response
from payments.serializers import PaymentSerializer
from payments.models import Payment
from django.contrib.auth import get_user_model

User = get_user_model()


class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['post'])
    def confirm_account(self, request):
        try:
            user_id = request.data.POST('user_id')
            User.objects.filter(id=user_id).update(is_active=True)
        except ObjectDoesNotExist:
            return Response({"message": "Error while activating users"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def status(self, request):
        try:
            User.objects.filter(
                id=request.data.get('user_id')
            ).update(
                is_active=request.data.get('status')
            )
            return Response({'message':"User status successfully updated."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message':"Error while updating user status."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def payments(self, request):
        try:
            queryset = Payment.objects.filter(user__id=self.request.query_params.get("user_id"))
            serializer = PaymentSerializer(
                queryset,
                many=True,
            )
            return Response(
                data=serializer.data,
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({'message':e}, status=status.HTTP_400_BAD_REQUEST)

