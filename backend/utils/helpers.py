from functools import wraps
from flask import jsonify
from email_validator import validate_email, EmailNotValidError

def success_response(data=None, message="Success", status_code=200):
    """Return standardized success response"""
    response = {"status": "success", "message": message}
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code

def error_response(message="Error occurred", status_code=400):
    """Return standardized error response"""
    return jsonify({"status": "error", "message": message}), status_code

def validate_email_format(email):
    """Validate email format"""
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

def validate_required_fields(data, required_fields):
    """Check if all required fields are present in request data"""
    missing = [field for field in required_fields if field not in data or not data[field]]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None
