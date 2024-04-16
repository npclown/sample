from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Attachment
from .utils import remove, upload


class AttachmentViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        name = request.FILES.get("file").name
        data = request.FILES.get("file").read()

        url = upload(name, data)

        attachment = Attachment.objects.create(content_object=self.request.user, url=url)

        return JsonResponse({"status": "success", "data": {"url": attachment.url}}, status=status.HTTP_201_CREATED)


class AttachmentRemoveViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["delete"], url_path="delete")
    def remove_file(self, request, *args, **kwargs):
        attachment = Attachment.objects.filter(url=request.data["url"]).first()

        remove(attachment.url)
        attachment.delete()
        return JsonResponse({"status": "success"}, status=status.HTTP_200_OK)
