from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import or_
from models import db, Session, User
from utils.helpers import success_response, error_response, validate_required_fields

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/create', methods=['POST'])
@jwt_required()
def create_session():
    """Schedule a learning session with another user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['user2_id', 'date', 'time', 'skill'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Validate date and time format
    try:
        session_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        session_time = datetime.strptime(data['time'], '%H:%M').time()
    except ValueError:
        return error_response("Invalid date (YYYY-MM-DD) or time (HH:MM) format", 400)
    
    # Check if user2 exists
    if not User.query.get(data['user2_id']):
        return error_response("User not found", 404)
    
    # Create session
    session = Session(
        user1_id=user_id,
        user2_id=data['user2_id'],
        date=session_date,
        time=session_time,
        skill=data['skill']
    )
    db.session.add(session)
    db.session.commit()
    
    return success_response({
        "id": session.id,
        "user1_id": session.user1_id,
        "user2_id": session.user2_id,
        "date": session.date.isoformat(),
        "time": session.time.isoformat(),
        "skill": session.skill
    }, "Session created successfully", 201)

@sessions_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_sessions():
    """Get all sessions for the logged-in user"""
    user_id = get_jwt_identity()
    
    # Get sessions where user is either user1 or user2
    sessions = Session.query.filter(
        or_(Session.user1_id == user_id, Session.user2_id == user_id)
    ).order_by(Session.date.desc(), Session.time.desc()).all()
    
    session_list = []
    for session in sessions:
        # Determine the other user
        other_user_id = session.user2_id if session.user1_id == user_id else session.user1_id
        other_user = User.query.get(other_user_id)
        
        session_list.append({
            "id": session.id,
            "with_user": {
                "id": other_user.id,
                "name": other_user.name
            },
            "date": session.date.isoformat(),
            "time": session.time.isoformat(),
            "skill": session.skill,
            "created_at": session.created_at.isoformat()
        })
    
    return success_response({"sessions": session_list})
