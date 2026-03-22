import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import '../styles/Homepage.css'
import img1 from '../assets/pexels-artempodrez-5716006.jpg'
import img2 from '../assets/pexels-artempodrez-5716031.jpg'
import img3 from '../assets/pexels-gustavo-fring-4975355.jpg'
import img4 from '../assets/pexels-gustavo-fring-6050268.jpg'
import img5 from '../assets/pexels-ketut-subiyanto-4623329.jpg'
import img6 from '../assets/pexels-olly-3860811.jpg'
import img7 from '../assets/pexels-olly-3931866.jpg'
import img8 from '../assets/pexels-tima-miroshnichenko-5439438.jpg'

export default function Homepage() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="homepage">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div 
            className="gradient-orb orb-1"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          ></div>
          <div 
            className="gradient-orb orb-2"
            style={{
              transform: `translate(-${mousePosition.x * 0.5}px, -${mousePosition.y * 0.5}px)`
            }}
          ></div>
        </div>

        <div className="hero-content">
          <div 
            className="hero-text"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: 1 - scrollY / 500
            }}
          >
            <h1 className="hero-title">Connect with Experts</h1>
            <p className="hero-subtitle">Book one-on-one sessions with professionals who can transform your goals</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>

          <div 
            className="hero-image-wrapper"
            style={{
              transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`
            }}
          >
            <div className="hero-card">
              <img src={img1} alt="Expert consultation" className="hero-image" />
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="mouse-wheel"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item" style={{ animationDelay: '0s' }}>
            <div className="stat-number">10K+</div>
            <div className="stat-label">Expert Professionals</div>
          </div>
          <div className="stat-item" style={{ animationDelay: '0.2s' }}>
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Consultees</div>
          </div>
          <div className="stat-item" style={{ animationDelay: '0.4s' }}>
            <div className="stat-number">100K+</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
          <div className="stat-item" style={{ animationDelay: '0.6s' }}>
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="section-title">Why Choose Practo?</h2>
          <p className="section-subtitle">The most comprehensive platform for expert consultations</p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-card-1">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z"></path>
              </svg>
            </div>
            <h3>Instant Booking</h3>
            <p>Reserve sessions with experts in seconds. Choose your preferred time and start your journey.</p>
          </div>

          <div className="feature-card feature-card-2">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3>HD Video Calls</h3>
            <p>Crystal-clear video quality with secure, encrypted one-on-one sessions.</p>
          </div>

          <div className="feature-card feature-card-3">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Live Chat Support</h3>
            <p>Get assistance from our support team anytime, anywhere you need help.</p>
          </div>

          <div className="feature-card feature-card-4">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m6.66-1.31l-4.24 4.24m0 0l4.24 4.24m-10.9-4.24l-4.24-4.24m4.24 0L1.1 4.93"></path>
              </svg>
            </div>
            <h3>Verified Experts</h3>
            <p>All professionals are thoroughly verified and rated by the community.</p>
          </div>

          <div className="feature-card feature-card-5">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
              </svg>
            </div>
            <h3>Flexible Pricing</h3>
            <p>Affordable rates with transparent pricing. Pay only for the sessions you book.</p>
          </div>

          <div className="feature-card feature-card-6">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>100% Secure</h3>
            <p>Your data is encrypted and protected. Privacy and security are our top priority.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-title">How It Works</div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Account</h3>
              <p>Sign up and complete your profile in minutes</p>
            </div>
            <div className="step-arrow">→</div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Browse Experts</h3>
              <p>Find the perfect expert for your needs</p>
            </div>
            <div className="step-arrow">→</div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Book Session</h3>
              <p>Select your preferred date and time</p>
            </div>
            <div className="step-arrow">→</div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Connect & Learn</h3>
              <p>Start your HD video call session</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"Practo connected me with an amazing mentor who helped me advance my career. Highly recommended!"</p>
            <div className="testimonial-author">
              <img src={img3} alt="Sarah Johnson" className="author-avatar" />
              <div>
                <p className="author-name">Sarah Johnson</p>
                <p className="author-role">Career Coach Seeker</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"As an expert, I found the platform easy to use and a great way to help others while earning well."</p>
            <div className="testimonial-author">
              <img src={img4} alt="Michael Chen" className="author-avatar" />
              <div>
                <p className="author-name">Michael Chen</p>
                <p className="author-role">Business Consultant</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"The video quality is excellent and the booking process is seamless. Best investment I made!"</p>
            <div className="testimonial-author">
              <img src={img5} alt="Emma Williams" className="author-avatar" />
              <div>
                <p className="author-name">Emma Williams</p>
                <p className="author-role">Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Future?</h2>
          <p>Join thousands of satisfied users on Practo today</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">Start as Consultee</button>
            <button className="btn btn-secondary btn-large">Become an Expert</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Practo</h4>
            <p>Connecting expertise with opportunity</p>
          </div>
          <div className="footer-section">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Legal</h5>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Practo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
