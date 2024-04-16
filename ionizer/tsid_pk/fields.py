from django.db.models import fields
from tsidpy import TSID

from .utils import generate_tsid


class TSIDField(fields.Field):
    def __init__(self, *args, **kwargs):
        kwargs["max_length"] = 13
        kwargs["default"] = generate_tsid
        kwargs["db_index"] = True
        super().__init__(*args, **kwargs)

    def to_python(self, value):
        if isinstance(value, TSID):
            return value
        if value is None:
            return value
        if len(value) != 13:
            return value
        return TSID.from_string(value, "s").to_string("s")

    def from_db_value(self, value, *args, **kwargs):
        return self.to_python(value)

    def get_internal_type(self):
        return "CharField"
