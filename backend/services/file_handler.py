# Coder: Nick
import os
from pathlib import Path
from django.conf import settings


def save_uploaded_file(upload, sub_folder: str) -> str:
    """
    Saves an uploaded file under media/uploads/<sub_folder>/ and returns the path.
    """
    base_dir = Path(settings.MEDIA_ROOT) / "uploads" / sub_folder
    base_dir.mkdir(parents=True, exist_ok=True)

    file_path = base_dir / upload.name
    with open(file_path, "wb+") as destination:
        for chunk in upload.chunks():
            destination.write(chunk)

    return str(file_path)
