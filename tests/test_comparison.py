# Coder: Nick
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile


class ComparisonApiTests(TestCase):
    def test_compare_requires_two_files(self):
        url = reverse("compare-files")
        resp = self.client.post(url, {})
        self.assertEqual(resp.status_code, 400)

    def test_compare_two_small_files(self):
        url = reverse("compare-files")
        left = SimpleUploadedFile("left.py", b"print('left')")
        right = SimpleUploadedFile("right.py", b"print('right')")
        resp = self.client.post(
            url,
            {"left_file": left, "right_file": right},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertIn("diff", resp.data)
