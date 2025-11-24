# Coder: Nick
from pathlib import Path
import difflib
from django.conf import settings


def merge_code_files(left_path: str, right_path: str) -> tuple[str, str]:
    """
    A simple two way merge strategy:
    preference is given to the right file.
    Conflict lines are annotated.
    """
    left_lines = Path(left_path).read_text(
        encoding="utf-8", errors="ignore"
    ).splitlines(keepends=True)
    right_lines = Path(right_path).read_text(
        encoding="utf-8", errors="ignore"
    ).splitlines(keepends=True)

    matcher = difflib.SequenceMatcher(a=left_lines, b=right_lines)
    result_lines = []

    for op, a0, a1, b0, b1 in matcher.get_opcodes():
        if op == "equal":
            result_lines.extend(left_lines[a0:a1])
        elif op == "replace":
            result_lines.append("# CONFLICT: choosing right version\n")
            result_lines.extend(right_lines[b0:b1])
        elif op == "delete":
            result_lines.append("# REMOVED by merge\n")
        elif op == "insert":
            result_lines.extend(right_lines[b0:b1])

    merged_code = "".join(result_lines)

    merged_dir = Path(settings.MEDIA_ROOT) / "merged_output"
    merged_dir.mkdir(parents=True, exist_ok=True)
    merged_path = merged_dir / f"merged_{Path(right_path).name}"

    merged_path.write_text(merged_code, encoding="utf-8")

    notes = (
        "Simple two way merge completed. Conflicts are marked in comments where replace operations occurred."  # noqa: E501
    )
    return str(merged_path), notes
