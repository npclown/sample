from rest_framework import serializers

from .models import Banner


class BannerSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    image_url = serializers.CharField(max_length=255)
    title = serializers.CharField(max_length=100, allow_blank=True, default="")
    description = serializers.CharField(max_length=255, allow_blank=True, default="")
    order = serializers.IntegerField()

    class Meta:
        model = Banner
        fields = [
            "id",
            "image_url",
            "title",
            "description",
            "order",
        ]
