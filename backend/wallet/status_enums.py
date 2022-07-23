from enum import Enum

TRANSACTION_TYPES = (("d", "Debit"), ("c", "Credit"),)
PAYMENT_OPTIONS = (("ST", "Stripe"), ("TZ", "Tazapay"))


class PaymentOption(Enum):
    STRIPE = "ST"
    TAZAPAY = 'TZ'

    def __str__(self):
        return self.type.value


PaymentOption.STRIPE.label = 'Stripe'
PaymentOption.TAZAPAY.label = 'Tazapay'


class TransactionType(Enum):
    debit = "d"
    credit = "c"

    def __str__(self):
        return self.type.value


TransactionType.debit.label = "Debit"
TransactionType.credit.label = "Credit"
