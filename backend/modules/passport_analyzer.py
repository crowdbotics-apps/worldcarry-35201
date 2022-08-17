import idanalyzer
from django.conf import settings


def analyze_passport(passport, biometric):
    try:

        passport = passport.path
        biometric = biometric.path

        passport_authentication_score: float = 0
        passport_authentication_remarks: str = ''
        passport_verified: bool = False
        biometric_face_verified: bool = False
        biometric_confidence_score: float = 0
        biometric_error: str = ''

        # Initialize Core API with your api key and region (US/EU)
        # core_api = idanalyzer.CoreAPI("j0BYyP3wkMCzXTtHeAIQeFZ5rQ1fU0m3", "US")
        core_api = idanalyzer.CoreAPI(settings.PASSPORT_VERIFICATION_KEY, "US")

        # Raise exceptions for API level errors
        core_api.throw_api_exception(True)

        # enable document authentication using quick module
        core_api.enable_authentication(True, 'quick')

        # perform scan
        response = core_api.scan(document_primary=passport, biometric_photo=biometric)

        # Parse document authentication results
        if response.get('authentication'):
            passport_authentication_score = response['authentication']['score']

        if passport_authentication_score > 0.5:
            passport_authentication_remarks = "The document uploaded is authentic"
            passport_verified = True
        elif passport_authentication_score > 0.3:
            passport_authentication_remarks = "The document uploaded looks little bit suspicious"
        else:
            passport_authentication_remarks = "The document uploaded is fake"

        # Parse biometric verification results
        face_result = response.get('face', None)
        if face_result:
            if face_result.get('isIdentical', False):
                biometric_face_verified = True
                biometric_confidence_score = face_result.get('confidence', 0)
            else:
                biometric_error = face_result.get('error_message')

        result = {
            'passport_data': response.get('result', None),
            'passport_authentication_score': passport_authentication_score,
            'passport_authentication_remarks': passport_authentication_remarks,
            'passport_valid': passport_verified,
            'biometric_verified': biometric_face_verified,
            'biometric_verification_score': biometric_confidence_score,
            'biometric_error': biometric_error
        }
        return result
    except idanalyzer.APIError as e:
        # If API returns an error, catch it
        details = e.args[0]
        return {
            'passport_data': {},
            'passport_authentication_score': 0,
            'passport_authentication_remarks': details["message"],
            'passport_valid': False,
            'biometric_verified': False,
            'biometric_verification_score': 0,
            'biometric_error': details["message"]
        }

    except Exception as e:
        print(e)
