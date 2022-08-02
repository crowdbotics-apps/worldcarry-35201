from rest_framework import serializers

from admin_panel.apps.faq.models import FAQ


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        exclude = [
            'id', 'created_at'
        ]