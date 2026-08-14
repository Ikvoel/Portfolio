import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '6285890575606';
const EMAIL_ADDRESS = 'husen.seino@gmail.com';

const contactInfo = [
  { icon: Mail, label: 'Email', value: EMAIL_ADDRESS, href: `mailto:${EMAIL_ADDRESS}` },
  { icon: Phone, label: 'Phone', value: '+62 85890575606', href: `https://wa.me/${WHATSAPP_NUMBER}` },
  { icon: MapPin, label: 'Location', value: 'Jakarta, Indonesia' }
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/stayinthebluu' },
  { icon: Linkedin, label: 'LinkedIn', url: '' },
  { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@senomotion' }
];

function buildWhatsAppUrl(name: string, email: string, message: string) {
  const text = [
    `Hi, I'm *${name || 'someone'}*`,
    email ? `📧 ${email}` : '',
    '',
    message || "I'd like to discuss a project with you.",
  ].filter(Boolean).join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function buildMailtoUrl(name: string, email: string, message: string) {
  const subject = `Project Inquiry from ${name || 'Portfolio Visitor'}`;
  const body = [
    `Hi Muhammad Nur Husein,`,
    '',
    message || "I'd like to discuss a project with you.",
    '',
    '---',
    `Name: ${name || '-'}`,
    `Email: ${email || '-'}`,
  ].join('\n');

  return `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(buildWhatsAppUrl(name, email, message), '_blank');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = buildMailtoUrl(name, email, message);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4 text-white">Let's Create Together</h2>
          <p className="body-text text-white/50 text-sm">
            Have a project in mind? Get in touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="film-title mb-8 text-white text-2xl">Get In Touch</h3>
            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const Wrapper = item.href ? 'a' : 'div';
                const wrapperProps = item.href
                  ? { href: item.href, target: '_blank' as const, rel: 'noopener noreferrer' }
                  : {};
                return (
                  <div
                    key={item.label}
                    className="liquid-glass-card p-4 transition-all duration-300 hover:translate-x-2.5"
                  >
                    <Wrapper {...wrapperProps} className="flex items-start gap-4 no-underline">
                      <div className="liquid-glass-floating w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white/90" />
                      </div>
                      <div>
                        <div className="metadata text-white/50 text-xs mb-1">{item.label}</div>
                        <div className="body-text text-white/90">{item.value}</div>
                      </div>
                    </Wrapper>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="metadata text-white/50 text-xs mb-4">Follow</div>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="liquid-glass-floating w-12 h-12 rounded-full flex items-center justify-center text-white/90 transition-all duration-300 hover:scale-115 hover:rotate-[5deg] active:scale-95"
                    >
                      <Icon className="w-5 h-5 text-white/90" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            className="liquid-glass-card p-8 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="name" className="metadata text-white/60 text-xs mb-2 block">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 liquid-glass-input rounded-lg text-white placeholder:text-white/30 outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="metadata text-white/60 text-xs mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 liquid-glass-input rounded-lg text-white placeholder:text-white/30 outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="metadata text-white/60 text-xs mb-2 block">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 liquid-glass-input rounded-lg text-white placeholder:text-white/30 resize-none outline-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 px-6 py-4 liquid-glass-button text-white rounded-full metadata flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </button>

              <button
                type="button"
                onClick={handleEmail}
                className="flex-1 px-6 py-4 liquid-glass-button text-white rounded-full metadata flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Send via Email
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="body-text text-white/40 text-xs">
            © 2026 Muhammad Nur Husein. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}