# Coder: Nick
import difflib


def build_ai_summary(diff_text: str, syntax_issues: list[str]) -> str:
    """
    Very lightweight "AI" style summary of differences.
    In a real project this would call a trained ML model.
    """
    lines = diff_text.splitlines()
    added = sum(1 for l in lines if l.startswith("+") and not l.startswith("+++"))
    removed = sum(1 for l in lines if l.startswith("-") and not l.startswith("---"))

    ratio = difflib.SequenceMatcher(
        None,
        "\n".join(l for l in lines if l.startswith("-")),
        "\n".join(l for l in lines if l.startswith("+")),
    ).ratio()

    summary_parts = [
        f"Estimated similarity between versions: {ratio:.2f}.",
        f"Lines added: {added}, lines removed: {removed}.",
    ]

    if syntax_issues:
        summary_parts.append(
            f"Syntax style issues detected in {len(syntax_issues)} places."
        )
    else:
        summary_parts.append("No syntax style issues detected.")

    return " ".join(summary_parts)
