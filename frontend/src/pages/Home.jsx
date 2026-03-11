import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Exchange Skills, Not Money</h1>
          <p>Connect with people who want to learn what you teach, and teach what you want to learn.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/matches" className="btn-secondary">Explore Matches</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Share Your Skills</h3>
            <p>List the skills you can teach and what you want to learn</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Find Matches</h3>
            <p>Get matched with people who complement your skills</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Connect & Learn</h3>
            <p>Chat, schedule sessions, and exchange knowledge</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate & Review</h3>
            <p>Build your reputation through ratings and reviews</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of learners exchanging skills every day</p>
        <Link to="/register" className="btn-cta">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default Home;
