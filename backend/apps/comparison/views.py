# Coder: Ratan
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from services.file_handler import save_uploaded_file
from services.code_comparator import compare_code_files, similarity_ratio
from services.ai_assistant import build_ai_summary
from services.syntax_analyzer import analyze_syntax

from .models import ComparisonSession
from .serializers import ComparisonSessionSerializer


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def compare_files(request):
    left = request.FILES.get("left_file")
    right = request.FILES.get("right_file")

    if not left or not right:
        return Response(
            {"detail": "Both left_file and right_file are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    left_path = save_uploaded_file(left, "code_files")
    right_path = save_uploaded_file(right, "code_files")

    diff = compare_code_files(left_path, right_path)
    syntax_issues = analyze_syntax(left_path, right_path)
    similarity = similarity_ratio(left_path, right_path)
    ai_summary = build_ai_summary(diff, syntax_issues)

    session = ComparisonSession.objects.create(
        left_path=left_path,
        right_path=right_path,
        diff_summary=ai_summary,
    )

    serializer = ComparisonSessionSerializer(session)
    return Response(
        {
            "session": serializer.data,
            "diff": diff,
            "similarity": similarity * 100,
            "syntax_issues": syntax_issues,
            "ai_summary": ai_summary,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def history_list(request):
    sessions = ComparisonSession.objects.order_by("-created_at")[:50]
    serializer = ComparisonSessionSerializer(sessions, many=True)
    return Response(serializer.data)
