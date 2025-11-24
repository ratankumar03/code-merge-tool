# Coder: Nick
from django.db import models


class ComparisonSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    left_path = models.CharField(max_length=512)
    right_path = models.CharField(max_length=512)
    diff_summary = models.TextField(blank=True)
    merged_path = models.CharField(max_length=512, blank=True)

    def __str__(self):
        return f"ComparisonSession({self.id})"
