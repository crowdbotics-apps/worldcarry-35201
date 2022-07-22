from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token
import pyotp
from django.contrib.auth import get_user_model

User = get_user_model()
def generateOTP(email=None, user=None):
    if email and user:
        secret = pyotp.random_base32()
        totp = pyotp.TOTP(secret)
        otp = totp.now()
        user.activation_key = secret
        user.otp = otp
        user.save()
        sliced_otp = str(otp)[:4]
        email = EmailMessage('World Carry - OTP Verification', 'Your OTP is {}'.format(sliced_otp), from_email='admin@worldcarry.com', to=[email])
        email.send()
        return user

def verifyOTP(otp=None, activation_key=None, user=None):
    if otp and activation_key and user:
        totp = pyotp.TOTP(activation_key)
        sliced_otp = user.otp[:4]
        if otp == sliced_otp:
            return totp.verify(user.otp, valid_window=6)
        return False
    else:
        return False

def send_otp(user):
    email = user.email
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otp = totp.now()
    user.activation_key = secret
    user.otp = otp
    user.save()
    sliced_otp = str(otp)[:4]
    email_body = """\
            <html>
            <head></head>
            <body>
            <p>
            Hi,<br>
            Your OTP is %s<br>
            Regards,<br>
            Team World Carry
            </p>
            </body>
            </html>
            """ % (sliced_otp)
    email_msg = EmailMessage("Password Reset - World Carry", email_body, from_email='admin@worldcarry.com', to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()

def auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token


def send_invitation_email(email):
    user = User.objects.filter(email=email)
    if not user.exists():
        email_body = """\
                <html>
                <head></head>
                <body>
                <p>
                Hi,<br>
                Your friend have invited to you platform is %s<br>
                Regards,<br>
                Team World Carry
                </p>
                </body>
                </html>
                """
        email_msg = EmailMessage("Invitation Email - World Carry", email_body, from_email='admin@worldcarry.com', to=[email])
        email_msg.content_subtype = "html"
        email_msg.send()
        response = {"message":"Email successfully connected"},
    response = {"message":"This user already invited in the system."},
    return response