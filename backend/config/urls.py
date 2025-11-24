# Coder: Nick
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Root path: serve frontend/index.html as a template
    path(
        "",
        TemplateView.as_view(template_name="index.html"),
        name="home",
    ),

    path("admin/", admin.site.urls),
    path("api/core/", include("apps.core.urls")),
    path("api/comparison/", include("apps.comparison.urls")),
    path("api/merge/", include("apps.merge.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
