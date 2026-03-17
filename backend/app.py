from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from extensions import bcrypt

def create_app():
    """Application factory pattern for Flask app"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    jwt = JWTManager(app)
    
    # Import and register blueprints
    from routes.auth import auth_bp, token_blacklist
    from routes.users import users_bp
    from routes.skills import skills_bp
    from routes.matches import matches_bp
    from routes.messages import messages_bp
    from routes.sessions import sessions_bp
    from routes.ratings import ratings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api/user')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(matches_bp, url_prefix='/api/matches')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(ratings_bp, url_prefix='/api/ratings')
    
    # JWT token blacklist checker
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return jti in token_blacklist
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"status": "error", "message": "Token has expired"}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"status": "error", "message": "Invalid token"}, 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"status": "error", "message": "Authorization token is missing"}, 401
    
    # Database initialization function
    def db_init():
        """Create all database tables"""
        with app.app_context():
            db.create_all()
            print("Database tables created successfully!")
    
    # Register db_init command
    app.db_init = db_init
    
    @app.route('/')
    def index():
        return {"status": "success", "message": "SkillMate API is running"}
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Initialize database on first run
    app.db_init()
    
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5001)
