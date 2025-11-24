# Coder: Nick
from datetime import datetime


def timestamp() -> str:
    return datetime.utcnow().isoformat()
