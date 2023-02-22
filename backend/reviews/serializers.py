from rest_framework import serializers
from reviews.models import Review
from home.api.v1.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        attrs = super().validate(attrs)
        target_user = attrs.get("target_user", None)
        added_by = attrs.get("added_by", None)
        order = attrs.get("order", None)
        journey = attrs.get("journey", None)

        if target_user is None or added_by is None:
            raise serializers.ValidationError("target user and added by user are required fields")

        if order:
            if Review.objects.filter(target_user=target_user, added_by=added_by, order=order).exists():
                raise serializers.ValidationError("Already added review for this order")

        if journey:
            if Review.objects.filter(target_user=target_user, added_by=added_by, journey=journey).exists():
                raise serializers.ValidationError("Already added review for this journey")

        return attrs

    class Meta:
        model = Review
        exclude = ['id']


class ReviewListSerializer(ReviewSerializer):
    class Meta:
        model = Review
        depth = 2
        fields = '__all__'
