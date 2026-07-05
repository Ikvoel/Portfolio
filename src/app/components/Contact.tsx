import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'senomotion@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+62 85890575606' },
  { icon: MapPin, label: 'Location', value: 'Jakarta, Indonesia' }
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/hsno.wy' },
  { icon: Linkedin, label: 'LinkedIn', url: '#' },
  { icon: Youtube, label: 'YouTube', url: '#' }
];

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          {/* Section title - Glamour Absolute font */}
          <h2 className="section-title mb-4 text-white">Let's Create Together</h2>
          
          {/* Minimal secondary text */}
          <p className="body-text text-white/50 text-sm">
            Have a project in mind? Get in touch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="film-title mb-8 text-white text-2xl">Get In Touch</h3>
            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="glass-card p-4 flex items-start gap-4 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <div className="metadata text-white/50 text-xs mb-1">{item.label}</div>
                      <div className="body-text text-white/90">{item.value}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <div className="metadata text-white/50 text-xs mb-4">Follow</div>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      className="glass-card w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5 text-white/80" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form with glassmorphism */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 space-y-6"
          >
            <div>
              <label htmlFor="name" className="metadata text-white/60 text-xs mb-2 block">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 glass-subtle border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 transition-all duration-300 outline-none"
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
                className="w-full px-4 py-3 glass-subtle border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 transition-all duration-300 outline-none"
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
                className="w-full px-4 py-3 glass-subtle border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 transition-all duration-300 resize-none outline-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-8 py-4 glass-card text-white hover:bg-white/20 transition-all duration-300 rounded-full metadata"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 pt-8 border-t border-white/10"
        >
          <p className="body-text text-white/40 text-xs">
            © 2026 Muhammad Nur Husein. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
