from rest_framework import serializers

from ..models import Board, Category, CategoryPoint


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ["id", "name", "label", "description", "type", "order", "is_main"]


class CategorySerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())
    category_point = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "board", "name", "label", "description", "order", "category_point"]

    def create(self, validated_data):
        category = Category.objects.create(**validated_data)

        category_point = self.context.get("request").data.get("category_point")

        CategoryPoint.objects.create(
            category=category,
            write_point=category_point.get("write_point"),
            like_point=category_point.get("like_point"),
            like_count=category_point.get("like_count"),
        )

        return category

    def get_category_point(self, category):
        category_point = category.categorypoint

        return CategoryPointSerializer(category_point).data


class CategoryPointSerializer(serializers.ModelSerializer):
    write_point = serializers.IntegerField()
    like_point = serializers.IntegerField()
    like_count = serializers.IntegerField()

    class Meta:
        model = CategoryPoint
        fields = [
            "write_point",
            "like_point",
            "like_count",
        ]
