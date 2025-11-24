# Coder: Nick
from django.test import TestCase
from django.urls import reverse
from apps.comparison.models import ComparisonSession


class MergeApiTests(TestCase):
    def test_merge_missing_session(self):
        url = reverse("merge-session", kwargs={"pk": 999})
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 404)

    def test_merge_existing_session_without_files(self):
        session = ComparisonSession.objects.create(
            left_path="", right_path="", diff_summary=""
        )
        url = reverse("merge-session", kwargs={"pk": session.pk})
        resp = self.client.post(url)
        self.assertNotEqual(resp.status_code, 404)
