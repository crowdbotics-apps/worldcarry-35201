from rest_framework import serializers
from reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        attrs = super().validate(attrs)
        target_user = attrs.get("target_user", None)
        added_by = attrs.get("added_by", None)
        order = attrs.get("order", None)
        journey = attrs.get("journey", None)

        if target_user is None or added_by is None:
            raise serializers.ValidationError("target user and added by user are required fields")

        if Review.objects.filter(target_user=target_user, added_by=added_by, order=order).exists():
            raise serializers.ValidationError("Already added review for this order")

        if Review.objects.filter(target_user=target_user, added_by=added_by, journey=journey).exists():
            raise serializers.ValidationError("Already added review for this journey")

        return attrs

    class Meta:
        model = Review
        exclude = ['id', 'created_at']

