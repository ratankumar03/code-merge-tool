# Coder: Nick
from django.urls import path
from .views import merge_session, merge_history

urlpatterns = [
    path("<int:pk>/", merge_session, name="merge-session"),
    path("history/", merge_history, name="merge-history"),
]
