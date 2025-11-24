# Coder: Nick
from django.urls import path
from .views import compare_files, history_list

urlpatterns = [
    path("compare/", compare_files, name="compare-files"),
    path("history/", history_list, name="comparison-history"),
]
