import React, { useState } from 'react';
import { Mail, MapPin, Send, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end state handling for initial phase
    setSubmitted(true);
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="section-label">Initiate Contact</span>
          <h1 className="font-serif" style={{ fontSize: 'var(--text-h1)', marginBottom: '1.25rem' }}>
            Let’s start a <span className="font-serif-italic">conversation</span>.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '650px' }}>
            Whether you have an upcoming project, an internship opening, or want to discuss design and code, feel free to reach out directly.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
          }}
        >
          {/* Direct Channels */}
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.65rem', marginBottom: '1.5rem' }}>
              Direct Channels
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <Mail size={22} style={{ color: 'var(--accent-strong)', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                    Email
                  </div>
                  <a
                    href="mailto:contact@saldanrama.dev"
                    style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}
                  >
                    contact@saldanrama.dev
                  </a>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                }}
              >
                <MapPin size={22} style={{ color: 'var(--accent-strong)', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                    Location
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>
                    Makassar, South Sulawesi, Indonesia
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
              Social & Network
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm btn-pill"
              >
                <span>LinkedIn</span>
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm btn-pill"
              >
                <span>GitHub</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '1.25rem' }} />
                <h3 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                  Message Received
                </h3>
                <p style={{ color: 'var(--muted)', marginBottom: '1.75rem' }}>
                  Thank you for reaching out! I will review your message and respond shortly.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  <span>Send another message</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.65rem', marginBottom: '0.5rem' }}>
                  Send a Note
                </h2>

                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text)' }}>
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text)' }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text)' }}>
                    Message / Inquiry
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, idea, or role..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-md btn-pill"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  <span>Submit Message</span>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
