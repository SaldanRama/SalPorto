import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Main Statement */}
          <div className="footer-statement" data-reveal="fade-up">
            <h2 className="footer-heading">
              Let’s craft something <span className="font-serif-italic">meaningful</span> together.
            </h2>
            <p className="footer-desc">
              Whether you have a specific project inquiry, an internship opportunity, or just want to discuss design and code, my inbox is open.
            </p>
            <Button to="/contact" variant="primary" size="lg">
              <span>Start Conversation</span>
              <ArrowUpRight size={16} />
            </Button>
          </div>

          {/* Links Grid */}
          <div className="footer-links-grid" data-reveal="fade-up" data-reveal-delay="200">
            <div>
              <div className="footer-col-title">Navigation</div>
              <ul className="footer-link-list">
                <li>
                  <Link to="/" className="footer-link">Home</Link>
                </li>
                <li>
                  <Link to="/work" className="footer-link">Work</Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">About</Link>
                </li>
                <li>
                  <Link to="/experience" className="footer-link">Experience</Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Connect</div>
              <ul className="footer-link-list">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@saldanrama.dev"
                    className="footer-link"
                  >
                    <span>Email</span>
                    <ArrowUpRight size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" data-reveal="fade-up" data-reveal-delay="100">
          <div className="footer-meta-tag">
            <span className="footer-pulse-dot" aria-hidden="true"></span>
            <span>Based in Makassar, Indonesia • Open to opportunities</span>
          </div>
          <div>
            © {currentYear} Saldan Rama. Built with React & Vite.
          </div>
        </div>
      </div>
    </footer>
  );
}
