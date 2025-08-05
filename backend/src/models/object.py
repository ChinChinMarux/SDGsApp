from bson import ObjectId
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler) -> JsonSchemaValue:
        # Gantikan __modify_schema__ dengan ini (untuk Pydantic v2)
        return {'type': 'string'}
