from enum import Enum


class FAQCategoriesEnum(Enum):
    ORDER = "ORDER"
    BASIC = "BASIC"
    JOURNEY = "JOURNEY"
    PAYMENT = "PAYMENT"
    VERIFICATION = "VERIFICATION"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)