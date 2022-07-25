import hashlib
import base64
import json
import requests
import calendar
import hmac
from datetime import datetime
import ast


BASE_URL = 'https://api-sandbox.tazapay.com'
ACCESS_KEY = 'SQ1R4DRMQVFD5FEH8SED'
SECRET_KEY = 'VUfnlojh3PjnSnXG47VZMqiUkOWmzFDcat5IEYMCU59x2rXNADRuu8vkYL8RSDUZ'
SALT = 'salt'  # any salt input


def get_headers(http_method: str, path: str) -> dict:
    current_date = datetime.utcnow()
    timestamp = calendar.timegm(current_date.utctimetuple())
    to_sign = http_method + path + SALT + str(timestamp) + ACCESS_KEY + SECRET_KEY
    h = hmac.new(bytes(SECRET_KEY, 'utf-8'), bytes(to_sign, 'utf-8'), hashlib.sha256)
    signature = base64.urlsafe_b64encode(str.encode(h.hexdigest()))
    return {'accesskey': ACCESS_KEY, 'signature': signature, 'salt': SALT, 'timestamp': str(timestamp) }


def create_user(**kwargs):

    path = '/v1/user'  # This can hold any value of the supported API.
    headers = get_headers(http_method='POST', path=path)
    payload = {"first_name": kwargs.get('first_name', ''),
               "last_name": kwargs.get('last_name', ''),
               "email": kwargs.get('email', ''),
               "country": kwargs.get('country', ''),
               "contact_code": kwargs.get('contact_code', ''),
               "contact_number": kwargs.get('contact_number', ''),
               "ind_bus_type": kwargs.get('ind_bus_type', ''),
               "business_name": kwargs.get('business_name', ''),
               "partners_customer_id": kwargs.get('partners_customer_id', ''),
               }

    response = requests.post(url=BASE_URL + path, json=payload, headers=headers)
    return ast.literal_eval(response.content.decode('utf-8'))


def get_user(email: str) -> dict:
    path = '/v1/user/{}'.format(email)  # This can hold any value of the supported API.

    headers = get_headers(http_method='GET', path=path)
    response = requests.get(url=BASE_URL + path, headers=headers)
    return ast.literal_eval(response.content.decode('utf-8'))


def create_escrow(**kwargs):

    path = '/v1/escrow/'  # This can hold any value of the supported API.
    headers = get_headers(http_method='POST', path=path)
    payload = {
        "release_mechanism": kwargs.get('release_mechanism', 'tazapay'),
        "initiated_by": kwargs.get('initiated_by', ''),  # seller id
        "buyer_id": kwargs.get('buyer_id', ''),
        "seller_id": kwargs.get('seller_id', ''),
        "txn_description": kwargs.get('txn_description', ''),
        "invoice_currency": kwargs.get('invoice_currency', 'USD'),
        "invoice_amount": kwargs.get('invoice_amount', 0),
    }
    response = requests.post(url=BASE_URL + path, json=payload, headers=headers)
    return ast.literal_eval(response.content.decode('utf-8'))


def create_payment(**kwargs):

    path = '/v1/session/payment'  # This can hold any value of the supported API.
    headers = get_headers(http_method='POST', path=path)
    payload = {
        "txn_no": kwargs.get('txn_no', ''),
        "complete_url": kwargs.get('complete_url', ''),  # seller id
        "error_url": kwargs.get('error_url', ''),
        "callback_url": kwargs.get('callback_url', ''),
        "filter": ["Card", "Debit Card"]
    }
    response = requests.post(url=BASE_URL + path, json=payload, headers=headers)
    return ast.literal_eval(response.content.decode('utf-8'))

#
# print(create_user(first_name='first', last_name='last_name', email='2@test.com', country='SG', contact_code='+65',
#                   contact_number='+653212988095', ind_bus_type='Individual'))

print(get_user(email='2@test.com'))
print(get_user(email='1@test.com'))

print(create_escrow(initiated_by='6dd56e36-8376-426e-a1a7-3c313c79c77d',
                    buyer_id='6dd56e36-8376-426e-a1a7-3c313c79c77d',
                    seller_id='b3d1ae96-5570-4dcc-9dc8-d4bc6f209c1b',
                    txn_description='This is test transaction',
                    invoice_currency='SGD',
                    invoice_amount=50))

print(create_payment(txn_no='2207-261479'))


# seller 1@test.com
# 'b3d1ae96-5570-4dcc-9dc8-d4bc6f209c1b'

# buyer 2@test.com
# 6dd56e36-8376-426e-a1a7-3c313c79c77d