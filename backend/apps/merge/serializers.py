# Coder: Nick
from rest_framework import serializers
from .models import MergeSession


class MergeSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MergeSession
        fields = ["id", "created_at", "comparison", "merged_path", "notes"]
