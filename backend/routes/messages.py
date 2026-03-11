from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from models import db, Message, Match, User
from utils.helpers import success_response, error_response, validate_required_fields

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send a message to a matched user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['receiver_id', 'message'])
    if not valid:
        return error_response(error_msg, 400)
    
    receiver_id = data['receiver_id']
    
    # Verify users are matched
    match = Match.query.filter(
        and_(
            or_(
                and_(Match.user1_id == user_id, Match.user2_id == receiver_id),
                and_(Match.user1_id == receiver_id, Match.user2_id == user_id)
            ),
            Match.status == 'accepted'
        )
    ).first()
    
    if not match:
        return error_response("Can only message matched users", 403)
    
    # Create message
    message = Message(
        sender_id=user_id,
        receiver_id=receiver_id,
        message=data['message']
    )
    db.session.add(message)
    db.session.commit()
    
    return success_response({
        "id": message.id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "message": message.message,
        "timestamp": message.timestamp.isoformat()
    }, "Message sent", 201)

@messages_bp.route('/history', methods=['GET'])
@jwt_required()
def get_message_history():
    """Get chat history between current user and another user"""
    user_id = get_jwt_identity()
    other_user_id = request.args.get('user_id', type=int)
    
    if not other_user_id:
        return error_response("user_id parameter required", 400)
    
    # Get messages between the two users
    messages = Message.query.filter(
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == user_id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
    message_list = []
    for msg in messages:
        message_list.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "message": msg.message,
            "timestamp": msg.timestamp.isoformat()
        })
    
    return success_response({"messages": message_list})
