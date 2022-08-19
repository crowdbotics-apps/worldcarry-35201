from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.authentication import ExpiringTokenAuthentication
from users.serializers import PassportAuthenticationSerializer
from modules.passport_analyzer import analyze_passport
from rest_framework.views import APIView
from users.models import UserPassportImage
from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
)

from django.conf import settings
from django.core.files import File
import os
from django.core.files.storage import default_storage


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class ValidatePassport(APIView):
    serializer_class = PassportAuthenticationSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    # permission_classes = []

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_passport_old = UserPassportImage.objects.filter(user=request.user)
        if user_passport_old:
            user_passport_old.delete()

        user_passport_new = UserPassportImage.objects.create(user=request.user, passport_photo=data['passport_photo'],
                                                             current_photo=data['selfie_photo'])

        passport = request.build_absolute_uri(user_passport_new.passport_photo.url)
        photo = request.build_absolute_uri(user_passport_new.passport_photo.url)

        result = analyze_passport(passport=passport, biometric=photo)

        user_passport_new.passport_data = result.get('passport_data', None)
        user_passport_new.is_passport_valid = result.get('passport_valid')
        user_passport_new.passport_score = result.get('passport_authentication_score')
        user_passport_new.is_valid_biometric = result.get('biometric_verified')
        user_passport_new.biometric_score = result.get('biometric_verification_score')
        user_passport_new.biometric_error = result.get('biometric_error')
        user_passport_new.save()

        if not result.get('passport_valid', False):
            return Response({'success': False, 'message': 'Fake Passport', 'api_response': result,
                             "photos_url": [passport, photo]})

        if result.get('passport_valid', False) and result.get('biometric_verified', False):
            return Response({'success': True, 'message': 'Passport is verified Successfully', 'api_response': result,
                             "photos_url": [passport, photo]})

        if result.get('passport_valid', False) and not result.get('biometric_verified', False):
            return Response({'success': False, 'message': result.get('biometric_error'), 'api_response': result,
                             "photos_url": [passport, photo]})
