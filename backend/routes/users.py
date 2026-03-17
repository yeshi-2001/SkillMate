from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from utils.helpers import success_response, error_response

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get logged-in user's profile information"""
    user_id = get_jwt_identity()
    print(f"Profile request for user_id: {user_id}")
    
    user = User.query.get(user_id)
    
    if not user:
        print(f"User not found: {user_id}")
        return error_response("User not found", 404)
    
    print(f"Profile found for: {user.email}")
    return success_response({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "location": user.location,
        "profile_image": user.profile_image,
        "created_at": user.created_at.isoformat()
    })

@users_bp.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile (name, location, profile_image)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return error_response("User not found", 404)
    
    data = request.get_json()
    
    # Update allowed fields
    if 'name' in data:
        user.name = data['name']
    if 'location' in data:
        user.location = data['location']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    
    db.session.commit()
    
    return success_response({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "location": user.location,
        "profile_image": user.profile_image
    }, "Profile updated successfully")
