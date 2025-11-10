import React from "react";
import { Link } from "react-router-dom";
import "../assets/CSS/style.css";

import logo from "../assets/logo.png";
import profileIcon from "../assets/profile_icon.jpg";
import moon from "../assets/moon.webp";
import learnByDoing from "../assets/learn-by-doing.png";
import encryptionLearning1 from "../assets/encryptionLearning1.png";
import encryptionLearning2 from "../assets/encryptionLearning2.png";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import twitter from "../assets/twitter.png";
import linkedin from "../assets/linkedin.png";

const MvpLandingPage = () => {
  return (
    <div className="container">
      <nav className="pt-5">
        <Link to="/" className="navLeft">
          <img src={logo} alt="Website Logo" className="logo" />
          <h1 className="logo-text">MVP</h1>
        </Link>

        <div className="navRight">
          <Link to="/quiz">
            <button className="glitchBtn" data-text="Quiz">
              Quiz
            </button>
          </Link>

          <Link to="/login">
            <button className="glitchBtn" data-text="Login">
              Login
            </button>
          </Link>

          <Link to="/games">
            <button className="glitchBtn" data-text="Games">
              Games
            </button>
          </Link>

          <Link to="/profile" className="profile-icon" title="Your Profile">
            <img src={profileIcon} alt="Profile Icon" />
          </Link>

          <div className="theme-toggle" id="theme-toggle" title="Toggle Theme">
            <img src={moon} alt="Toggle Theme Icon" id="theme-icon" />
          </div>
        </div>
      </nav>

      <section className="hero">
        <img src={learnByDoing} className="learnByDoing" alt="Learn by Doing" />
      </section>

      <div className="description">
        <p className="descText">
          Master encryption through interactive challenges. Learn, play, and
          sharpen your cyber skills in just minutes a day.
        </p>
        <div className="get-started-btn">
          <Link to="/get-started">
            <button>Get Started</button>
          </Link>
        </div>
      </div>

      <section className="joinOver">
        <div className="bubbles">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <h2 className="joinText">Join over 10,000 learners worldwide</h2>

        <div className="underJoinText">
          <div className="stars">
            ★★★★★ <span>Over 1,000 5-star reviews</span>
          </div>

          <div className="mentions">
            <div>Featured in TechCrunch</div>
            {/* SVGs kept as-is */}
          </div>

          <div className="awards">
            <div>Editors Choice</div>
            <div>No. 1 Learning Platform</div>
          </div>
        </div>
      </section>

      <section className="conceptsSection">
        <div className="conceptsLeft">
          <svg className="polarGraph" viewBox="0 0 500 500">
            <g stroke="#e5e5e5" strokeWidth="1" fill="none">
              {[50, 100, 150, 200].map((r, i) => (
                <circle key={i} cx="250" cy="250" r={r} />
              ))}
            </g>
          </svg>
        </div>
        <div className="conceptsRight">
          <h2 className="conceptsTitle">
            Concepts<br />that click
          </h2>
          <p className="conceptsDescription">
            Interactive lessons make even complex ideas easy to grasp. Instant,
            custom feedback accelerates your understanding.
          </p>
        </div>
      </section>

      <section className="learnSection">
        <div className="learnLeft">
          <h2 className="learnTitle">
            Learn at<br />your level
          </h2>
          <p className="learnDesc">
            Brush up on the basics or learn new skills. Designed for learners
            ages 13 to 113.
          </p>
        </div>
        <div className="learnRight">
          <div className="learnCard highlighted">
            <div className="cardTag">FOR YOU</div>
            <img src={encryptionLearning1} alt="Encryption Fundamentals" />
            <p>Encryption Fundamentals</p>
          </div>
          <div className="learnCard">
            <img src={encryptionLearning2} alt="Gamified Learning" />
            <p>Gamified Learning</p>
          </div>
        </div>
      </section>

      <section className="stayMotivatedSection">
        <div className="leftContent">
          <div className="streakDisplay">
            {["monday", "tuesday", "wednesday", "thursday"].map((day) => (
              <div className="dayStreak" key={day} data-day={day}>
                <div className="streakCircle incomplete">⚡</div>
                <div className="dayLabel">{day[0].toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div className="goalMessage">
            <div className="goalIcon">🏆</div>
            <div className="goalText">
              Reach your daily <strong className="highlightedGoal">GOAL!</strong>
            </div>
          </div>
        </div>

        <div className="motivatedContent">
          <h2 className="motivatedTitle">
            Stay<br />motivated
          </h2>
          <p className="motivatedDesc">
            Finish every day smarter with engaging lessons, competitive
            features, and daily encouragement.
          </p>
        </div>
      </section>

      <section className="effectiveSection">
        <div className="effectiveLeft">
          <div className="encryptionDemo"></div>
        </div>
        <div className="effectiveRight">
          <h2 className="effectiveTitle">More effective.</h2>
          <h2 className="effectiveSubtitle">More fun.</h2>
          <p className="effectiveDesc">
            MVP's interactive approach teaches you to think, not memorize.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo-container">
            <img src={logo} alt="Website Logo" className="logo" />
            <h1 className="footer-logo-text">MVP</h1>
          </div>

          <div className="footer-links-group">
            <div className="footer-links-col">
              <div className="footer-links-title">Product</div>
              <a href="#" className="footer-link">Courses</a>
              <a href="#" className="footer-link">Pricing</a>
              <a href="#" className="footer-link">Gift MVP</a>
              <a href="#" className="footer-link">Help</a>
            </div>

            <div className="footer-links-col">
              <div className="footer-links-title">Company</div>
              <a href="#" className="footer-link">About us</a>
              <a href="#" className="footer-link">Careers</a>
              <a href="#" className="footer-link">Educators</a>
            </div>

            <div className="footer-links-col">
              <div className="footer-links-title">Behind the scenes</div>
              <a href="#" className="footer-link">AI at MVP</a>
              <a href="#" className="footer-link">AI Evals for Learning Games</a>
              <a href="#" className="footer-link">Solving Equations</a>
              <a href="#" className="footer-link">Thinking in Code</a>
              <a href="#" className="footer-link">Visual Algebra</a>
              <a href="#" className="footer-link">Decomposition and Abstraction</a>
            </div>
          </div>

          <div className="footer-socials">
            <a href="#" className="social-icon">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="#" className="social-icon">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="#" className="social-icon">
              <img src={twitter} alt="Twitter" />
            </a>
            <a href="#" className="social-icon">
              <img src={linkedin} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#" className="footer-legal-link">Terms of service</a>
            <a href="#" className="footer-legal-link">Privacy policy</a>
            <a href="#" className="footer-legal-link">California privacy policy</a>
          </div>
          <div className="footer-copyright">
            © 2025 MVP Worldwide, Inc., MVP and the MVP Logo are trademarks of MVP Worldwide, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MvpLandingPage;
