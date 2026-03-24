import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Share Your Skills. Learn Something New.</h1>
            <p>SkillShare connects learners and teachers in one place. Share your knowledge, discover new skills, and grow together in our supportive community.</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Get Started</Link>
              <Link to="/matches" className="btn-secondary">Explore Skills</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon share">🎓</div>
            <h3>Share Your Skills</h3>
            <p>Teach what you know and inspire others to learn and grow in their journey.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon match">🤝</div>
            <h3>Find Matches</h3>
            <p>Connect with people who want to learn your skills or teach what you need.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon connect">💬</div>
            <h3>Connect & Learn</h3>
            <p>Collaborate, share knowledge, and build meaningful learning relationships.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon review">⭐</div>
            <h3>Rate & Review</h3>
            <p>Build trust and credibility through honest feedback and community reviews.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
