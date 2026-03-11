from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_, or_
from models import db, User, UserSkill, Match, Skill
from utils.helpers import success_response, error_response, validate_required_fields

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/find', methods=['GET'])
@jwt_required()
def find_matches():
    """Find users where skills match (A teaches what B learns AND B teaches what A learns)"""
    user_id = get_jwt_identity()
    
    # Subquery for user's teach skills
    user_teaches = db.session.query(UserSkill.skill_id).filter(
        and_(UserSkill.user_id == user_id, UserSkill.type == 'teach')
    ).subquery()
    
    # Subquery for user's learn skills
    user_learns = db.session.query(UserSkill.skill_id).filter(
        and_(UserSkill.user_id == user_id, UserSkill.type == 'learn')
    ).subquery()
    
    # Find matching users using efficient JOIN
    matches = db.session.query(User, Skill).join(
        UserSkill, UserSkill.user_id == User.id
    ).join(
        Skill, Skill.id == UserSkill.skill_id
    ).filter(
        and_(
            User.id != user_id,
            or_(
                # Other user teaches what current user wants to learn
                and_(
                    UserSkill.type == 'teach',
                    UserSkill.skill_id.in_(user_learns)
                ),
                # Other user learns what current user teaches
                and_(
                    UserSkill.type == 'learn',
                    UserSkill.skill_id.in_(user_teaches)
                )
            )
        )
    ).distinct().all()
    
    # Format results
    match_list = []
    seen_users = set()
    
    for user, skill in matches:
        if user.id not in seen_users:
            seen_users.add(user.id)
            match_list.append({
                "id": user.id,
                "name": user.name,
                "location": user.location,
                "profile_image": user.profile_image
            })
    
    return success_response({"matches": match_list})

@matches_bp.route('/request', methods=['POST'])
@jwt_required()
def send_match_request():
    """Send a match request to another user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['user2_id'])
    if not valid:
        return error_response(error_msg, 400)
    
    user2_id = data['user2_id']
    
    # Prevent self-matching
    if user_id == user2_id:
        return error_response("Cannot match with yourself", 400)
    
    # Check if user2 exists
    if not User.query.get(user2_id):
        return error_response("User not found", 404)
    
    # Check if match already exists (either direction)
    existing = Match.query.filter(
        or_(
            and_(Match.user1_id == user_id, Match.user2_id == user2_id),
            and_(Match.user1_id == user2_id, Match.user2_id == user_id)
        )
    ).first()
    
    if existing:
        return error_response("Match request already exists", 409)
    
    # Create match request
    match = Match(user1_id=user_id, user2_id=user2_id, status='pending')
    db.session.add(match)
    db.session.commit()
    
    return success_response({
        "id": match.id,
        "user1_id": match.user1_id,
        "user2_id": match.user2_id,
        "status": match.status
    }, "Match request sent", 201)

@matches_bp.route('/list', methods=['GET'])
@jwt_required()
def list_matches():
    """List all matches for the logged-in user with status"""
    user_id = get_jwt_identity()
    
    # Get matches where user is either user1 or user2
    matches = Match.query.filter(
        or_(Match.user1_id == user_id, Match.user2_id == user_id)
    ).all()
    
    match_list = []
    for match in matches:
        # Determine the other user
        other_user_id = match.user2_id if match.user1_id == user_id else match.user1_id
        other_user = User.query.get(other_user_id)
        
        match_list.append({
            "id": match.id,
            "user": {
                "id": other_user.id,
                "name": other_user.name,
                "location": other_user.location,
                "profile_image": other_user.profile_image
            },
            "status": match.status,
            "created_at": match.created_at.isoformat()
        })
    
    return success_response({"matches": match_list})

@matches_bp.route('/respond', methods=['PUT'])
@jwt_required()
def respond_to_match():
    """Accept or reject a match request"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['match_id', 'status'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Validate status
    if data['status'] not in ['accepted', 'rejected']:
        return error_response("Status must be 'accepted' or 'rejected'", 400)
    
    # Find match where current user is user2 (receiver)
    match = Match.query.filter_by(id=data['match_id'], user2_id=user_id).first()
    
    if not match:
        return error_response("Match request not found", 404)
    
    match.status = data['status']
    db.session.commit()
    
    return success_response({
        "id": match.id,
        "status": match.status
    }, f"Match request {data['status']}")
