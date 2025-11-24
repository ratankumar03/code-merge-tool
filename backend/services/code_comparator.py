# Coder: Nick
import difflib
from pathlib import Path


def read_file(path: str) -> list[str]:
    p = Path(path)
    if not p.exists():
        return []
    return p.read_text(encoding="utf-8", errors="ignore").splitlines(keepends=True)


def compare_code_files(left_path: str, right_path: str) -> str:
    """
    Returns unified diff string between two code files.
    """
    left_lines = read_file(left_path)
    right_lines = read_file(right_path)

    diff = difflib.unified_diff(
        left_lines,
        right_lines,
        fromfile=left_path,
        tofile=right_path,
        lineterm="",
    )
    return "\n".join(diff)


def similarity_ratio(left_path: str, right_path: str) -> float:
    """
    Returns a similarity ratio (0-1) based on line-by-line comparison.
    """
    left_lines = read_file(left_path)
    right_lines = read_file(right_path)
    if not left_lines and not right_lines:
        return 1.0

    matcher = difflib.SequenceMatcher(a=left_lines, b=right_lines)
    return matcher.ratio()
