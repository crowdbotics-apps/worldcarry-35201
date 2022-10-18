import pyotp
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.conf import settings

def get_otp():
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    return totp.now()


def send_sms(num: str, message: str) -> tuple:
    account = settings.TWILIO_ACCOUNT_ID
    token = settings.TWILIO_TOKEN
    client = Client(account, token)

    try:
        message = client.messages.create(to=num, from_=settings.TWILIO_DEFAULT_NUMBER,
                                         body=message)
        return message, 200
    except TwilioRestException as e:
        print(e)
        return str(e.msg), 400
