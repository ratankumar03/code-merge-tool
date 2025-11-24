# Coder: Nick
from pathlib import Path

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from apps.comparison.models import ComparisonSession
from .models import MergeSession
from .serializers import MergeSessionSerializer

from services.merge_engine import merge_code_files


@api_view(["POST"])
def merge_session(request, pk: int):
    """
    Merge the two files of a comparison session.
    """
    try:
        comparison = ComparisonSession.objects.get(pk=pk)
    except ComparisonSession.DoesNotExist:
        return Response(
            {"detail": "Comparison session not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    merged_path, notes = merge_code_files(
        comparison.left_path, comparison.right_path
    )

    merged_url = settings.MEDIA_URL + Path(merged_path).relative_to(
        settings.MEDIA_ROOT
    ).as_posix()

    merge_obj = MergeSession.objects.create(
        comparison=comparison,
        merged_path=merged_path,
        notes=notes,
    )
    serializer = MergeSessionSerializer(merge_obj)
    merge_data = serializer.data
    merge_data["merged_url"] = merged_url
    merge_data["merged_filename"] = Path(merged_path).name

    return Response(
        {"merge": merge_data},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def merge_history(request):
    merges = MergeSession.objects.order_by("-created_at")[:50]
    serializer = MergeSessionSerializer(merges, many=True)
    return Response(serializer.data)
