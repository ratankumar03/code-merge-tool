# Coder: Nick
from django.contrib import admin
from .models import MergeSession


@admin.register(MergeSession)
class MergeSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "comparison", "merged_path")
    readonly_fields = ("created_at",)
