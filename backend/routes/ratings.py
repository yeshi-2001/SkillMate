from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from models import db, Rating, User
from utils.helpers import success_response, error_response, validate_required_fields

ratings_bp = Blueprint('ratings', __name__)

@ratings_bp.route('/add', methods=['POST'])
@jwt_required()
def add_rating():
    """Submit a rating and comment for another user"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    valid, error_msg = validate_required_fields(data, ['reviewed_user_id', 'rating'])
    if not valid:
        return error_response(error_msg, 400)
    
    # Validate rating value
    if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
        return error_response("Rating must be an integer between 1 and 5", 400)
    
    # Prevent self-rating
    if user_id == data['reviewed_user_id']:
        return error_response("Cannot rate yourself", 400)
    
    # Check if reviewed user exists
    if not User.query.get(data['reviewed_user_id']):
        return error_response("User not found", 404)
    
    # Create rating
    rating = Rating(
        reviewer_id=user_id,
        reviewed_user_id=data['reviewed_user_id'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    db.session.add(rating)
    db.session.commit()
    
    return success_response({
        "id": rating.id,
        "reviewer_id": rating.reviewer_id,
        "reviewed_user_id": rating.reviewed_user_id,
        "rating": rating.rating,
        "comment": rating.comment,
        "created_at": rating.created_at.isoformat()
    }, "Rating submitted successfully", 201)

@ratings_bp.route('/user', methods=['GET'])
def get_user_ratings():
    """Get all ratings for a specific user with average"""
    user_id = request.args.get('user_id', type=int)
    
    if not user_id:
        return error_response("user_id parameter required", 400)
    
    # Get all ratings for the user
    ratings = Rating.query.filter_by(reviewed_user_id=user_id).all()
    
    # Calculate average rating
    avg_rating = db.session.query(func.avg(Rating.rating)).filter_by(
        reviewed_user_id=user_id
    ).scalar()
    
    rating_list = []
    for rating in ratings:
        reviewer = User.query.get(rating.reviewer_id)
        rating_list.append({
            "id": rating.id,
            "reviewer": {
                "id": reviewer.id,
                "name": reviewer.name
            },
            "rating": rating.rating,
            "comment": rating.comment,
            "created_at": rating.created_at.isoformat()
        })
    
    return success_response({
        "average_rating": round(float(avg_rating), 2) if avg_rating else 0,
        "total_ratings": len(ratings),
        "ratings": rating_list
    })
