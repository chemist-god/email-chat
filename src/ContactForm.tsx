import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Validate environment variables
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const adminTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN;
    const autoReplyTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_AUTOREPLY;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !adminTemplateId || !autoReplyTemplateId || !publicKey) {
      console.error("EmailJS environment variables are not configured.");
      setError("Sorry, the contact form is currently unavailable.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    try {
      // 1. Send email to Admin
      await emailjs.sendForm(serviceId, adminTemplateId, formRef.current, publicKey);
      console.log("Admin alert sent ✅");

      // 2. Send auto-reply to User (only if admin email was successful)
      await emailjs.sendForm(serviceId, autoReplyTemplateId, formRef.current, publicKey);
      console.log("Auto-reply sent ✅");

      // 3. Show success state
      setShowSuccess(true);
      formRef.current?.reset();
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err: any) {
      console.error("Failed to send email:", err.text || err);
      setError("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* The main container for the form, centered on the page.
          Using motion.div for potential future page-level animations or just as a wrapper. */}
      <motion.div
        className="page-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="formContainer"
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          whileHover={{ scale: 1.005, boxShadow: "12px 12px 0 rgba(0, 0, 0, 0.35)" }}
        >
          <h2>Send me a message. Let's have a chat!</h2>

          <div className="formElement">
            <label htmlFor="from_name">Name</label>
            <motion.input
              type="text"
              id="from_name"
              name="from_name"
              placeholder="Your name.."
              required
              disabled={isSubmitting}
              whileFocus={{ scale: 1.01, borderColor: '#007bff', boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}
            />
          </div>

          <div className="formElement">
            <label htmlFor="from_email">E-mail</label>
            <motion.input
              type="email"
              id="from_email"
              name="from_email"
              placeholder="Your email.."
              required
              disabled={isSubmitting}
              whileFocus={{ scale: 1.01, borderColor: '#007bff', boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}
            />
          </div>

          <div className="formElement">
            <label htmlFor="message">Message</label>
            <motion.textarea
              name="message"
              id="message"
              rows={8}
              cols={30}
              placeholder="Your message.."
              required
              disabled={isSubmitting}
              whileFocus={{ scale: 1.01, borderColor: '#007bff', boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}
            />
          </div>

          <motion.button
            type="submit"
            className="formButton"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, boxShadow: "12px 12px 0 rgba(0, 0, 0, 0.35)" }}
            whileTap={{ scale: 0.95, boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.25)" }}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                className="errorText"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="successToast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            Message sent successfully! 🚀
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactForm;
