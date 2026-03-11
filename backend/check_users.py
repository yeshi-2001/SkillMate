from app import create_app
from models import db, User
from extensions import bcrypt

app = create_app()

with app.app_context():
    print("=== Checking Users in Database ===\n")
    
    users = User.query.all()
    
    if not users:
        print("No users found in database!")
        print("\nCreating a test user...")
        test_user = User(
            name="Test User",
            email="test@test.com",
            password=bcrypt.generate_password_hash("password123").decode('utf-8'),
            location="Test City"
        )
        db.session.add(test_user)
        db.session.commit()
        print("✓ Test user created!")
        print("  Email: test@test.com")
        print("  Password: password123")
    else:
        print(f"Found {len(users)} user(s):\n")
        for user in users:
            print(f"ID: {user.id}")
            print(f"Name: {user.name}")
            print(f"Email: {user.email}")
            print(f"Location: {user.location}")
            print(f"Created: {user.created_at}")
            print("-" * 40)
        
        # Test password verification
        print("\n=== Testing Password Verification ===")
        test_email = input("\nEnter email to test: ")
        test_password = input("Enter password to test: ")
        
        user = User.query.filter_by(email=test_email).first()
        if user:
            is_valid = bcrypt.check_password_hash(user.password, test_password)
            print(f"\nPassword valid: {is_valid}")
            if is_valid:
                print("✓ Login should work!")
            else:
                print("✗ Password is incorrect")
        else:
            print(f"✗ User with email '{test_email}' not found")
