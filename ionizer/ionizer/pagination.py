from django.http import JsonResponse
from rest_framework import pagination


class IonizerPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return JsonResponse(
            {
                "status": "success",
                "links": {"next": self.get_next_link(), "previous": self.get_previous_link()},
                "count": self.page.paginator.count,
                "data": data,
            }
        )
