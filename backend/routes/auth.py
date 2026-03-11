from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from extensions import bcrypt
from models import db, User
from utils.helpers import success_response, error_response, validate_email_format, validate_required_fields

auth_bp = Blueprint('auth', __name__)

# Token blacklist for logout functionality
token_blacklist = set()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with validation and password hashing"""
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['name', 'email', 'password'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Validate email format
    if not validate_email_format(data['email']):
        return error_response("Invalid email format", 400)
    
    # Check password length
    if len(data['password']) < 6:
        return error_response("Password must be at least 6 characters", 400)
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return error_response("Email already registered", 409)
    
    # Hash password and create user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        location=data.get('location'),
        profile_image=data.get('profile_image')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate JWT token
    access_token = create_access_token(identity=new_user.id)
    
    return success_response({
        "token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }, "User registered successfully", 201)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token"""
    data = request.get_json()
    print(f"Login attempt for email: {data.get('email')}")
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['email', 'password'])
    if not valid:
        print(f"Validation failed: {error_msg}")
        return error_response(error_msg, 400)
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        print(f"User not found: {data['email']}")
        return error_response("Invalid email or password", 401)
    
    print(f"User found: {user.email}, checking password...")
    
    # Verify credentials
    password_match = bcrypt.check_password_hash(user.password, data['password'])
    print(f"Password match: {password_match}")
    
    if not password_match:
        print("Password verification failed")
        return error_response("Invalid email or password", 401)
    
    # Generate JWT token
    access_token = create_access_token(identity=user.id)
    print(f"Login successful for user: {user.email}")
    
    return success_response({
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }, "Login successful")

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Invalidate JWT token by adding to blacklist"""
    jti = get_jwt()['jti']
    token_blacklist.add(jti)
    return success_response(message="Logged out successfully")
