# Coder: Nick
from django.contrib import admin
from .models import ComparisonSession


@admin.register(ComparisonSession)
class ComparisonSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "left_path", "right_path")
    readonly_fields = ("created_at",)
