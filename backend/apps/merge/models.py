# Coder: Nick
from django.db import models
from apps.comparison.models import ComparisonSession


class MergeSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    comparison = models.ForeignKey(
        ComparisonSession, on_delete=models.CASCADE, related_name="merges"
    )
    merged_path = models.CharField(max_length=512)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"MergeSession({self.id})"
