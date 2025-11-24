# Coder: Ratan
from rest_framework import serializers
from .models import ComparisonSession


class ComparisonSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparisonSession
        fields = [
            "id",
            "created_at",
            "left_path",
            "right_path",
            "diff_summary",
            "merged_path",
        ]


class ComparisonRequestSerializer(serializers.Serializer):
    left_file = serializers.FileField()
    right_file = serializers.FileField()
