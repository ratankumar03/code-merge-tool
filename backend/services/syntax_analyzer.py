# Coder: Nick
from pathlib import Path


def analyze_syntax(left_path: str, right_path: str) -> list[str]:
    """
    Very simple syntax style checks:
    - Unbalanced brackets
    - Very long lines
    Only for hinting to the developer.
    """
    issues: list[str] = []

    for label, p in [("left", left_path), ("right", right_path)]:
        text = Path(p).read_text(encoding="utf-8", errors="ignore")
        lines = text.splitlines()

        stack = []
        for idx, line in enumerate(lines, start=1):
            if len(line) > 140:
                issues.append(f"{label} file line {idx} is very long.")

            for char in line:
                if char in "([{":
                    stack.append((char, idx))
                elif char in ")]}":
                    if not stack:
                        issues.append(f"{label} file has closing bracket on line {idx}.")
                        continue
                    stack.pop()

        if stack:
            issues.append(f"{label} file has {len(stack)} unclosed brackets.")

    return issues
