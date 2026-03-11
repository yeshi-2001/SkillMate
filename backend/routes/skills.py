from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Skill, UserSkill
from utils.helpers import success_response, error_response, validate_required_fields

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/add', methods=['POST'])
@jwt_required()
def add_skill():
    """Add a skill to teach or learn for the logged-in user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['skill_name', 'type'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Validate type field
    if data['type'] not in ['teach', 'learn']:
        return error_response("Type must be 'teach' or 'learn'", 400)
    
    # Get or create skill
    skill = Skill.query.filter_by(skill_name=data['skill_name'].lower()).first()
    if not skill:
        skill = Skill(skill_name=data['skill_name'].lower())
        db.session.add(skill)
        db.session.commit()
    
    # Check if user already has this skill with same type
    existing = UserSkill.query.filter_by(
        user_id=user_id,
        skill_id=skill.id,
        type=data['type']
    ).first()
    
    if existing:
        return error_response("Skill already added", 409)
    
    # Add user skill
    user_skill = UserSkill(user_id=user_id, skill_id=skill.id, type=data['type'])
    db.session.add(user_skill)
    db.session.commit()
    
    return success_response({
        "id": user_skill.id,
        "skill_name": skill.skill_name,
        "type": user_skill.type
    }, "Skill added successfully", 201)

@skills_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_skills():
    """Get all skills of the logged-in user"""
    user_id = get_jwt_identity()
    
    user_skills = db.session.query(UserSkill, Skill).join(
        Skill, UserSkill.skill_id == Skill.id
    ).filter(UserSkill.user_id == user_id).all()
    
    skills_data = {
        "teach": [],
        "learn": []
    }
    
    for user_skill, skill in user_skills:
        skill_info = {
            "id": user_skill.id,
            "skill_name": skill.skill_name
        }
        skills_data[user_skill.type].append(skill_info)
    
    return success_response(skills_data)

@skills_bp.route('/remove', methods=['DELETE'])
@jwt_required()
def remove_skill():
    """Remove a skill by UserSkill ID"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['id'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Find and verify ownership
    user_skill = UserSkill.query.filter_by(id=data['id'], user_id=user_id).first()
    
    if not user_skill:
        return error_response("Skill not found", 404)
    
    db.session.delete(user_skill)
    db.session.commit()
    
    return success_response(message="Skill removed successfully")
