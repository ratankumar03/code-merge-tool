# Coder: Nick
from pathlib import Path

ALLOWED_EXTENSIONS = {".py", ".js", ".ts", ".java", ".cs", ".php", ".html", ".css"}


def is_allowed_code_file(path: str) -> bool:
    return Path(path).suffix.lower() in ALLOWED_EXTENSIONS
