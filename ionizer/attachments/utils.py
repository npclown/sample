import pathlib
from uuid import uuid4

import boto3
from django.conf import settings


def get_s3_client():
    return boto3.client(
        service_name="s3",
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS,
        aws_secret_access_key=settings.S3_SECRET,
        region_name=settings.S3_REGION,
    )


def upload(original_name, data):
    s3 = get_s3_client()

    extension = pathlib.Path(original_name).suffix
    name = f"{uuid4().hex}{extension}"

    s3.put_object(Body=data, Bucket=settings.S3_BUCKET, Key=f"attachments/{name}")
    return f"{settings.S3_PUBLIC_URL}/attachments/{name}"


def remove(key):
    if key is None:
        return

    s3 = get_s3_client()

    return s3.delete_object(Bucket=settings.S3_BUCKET, Key=key)
