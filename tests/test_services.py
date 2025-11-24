# Coder: Nick
from django.test import TestCase
from django.conf import settings
from pathlib import Path
from services.code_comparator import compare_code_files
from services.merge_engine import merge_code_files


class ServiceTests(TestCase):
    def test_compare_code_files(self):
        left = Path(settings.MEDIA_ROOT) / "test_left.py"
        right = Path(settings.MEDIA_ROOT) / "test_right.py"
        left.write_text("print('a')\n")
        right.write_text("print('b')\n")
        diff = compare_code_files(str(left), str(right))
        self.assertIn("print('a')", diff)
        self.assertIn("print('b')", diff)

    def test_merge_code_files(self):
        left = Path(settings.MEDIA_ROOT) / "test_left2.py"
        right = Path(settings.MEDIA_ROOT) / "test_right2.py"
        left.write_text("print('a')\n")
        right.write_text("print('b')\n")
        merged_path, notes = merge_code_files(str(left), str(right))
        self.assertTrue(Path(merged_path).exists())
        self.assertTrue(notes)
