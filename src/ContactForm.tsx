import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
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
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <form ref={formRef} onSubmit={handleSubmit} className="formContainer">
          <h2>Send me a message. Let's have a chat!</h2>

          <div className="formElement">
            <label htmlFor="from_name">Name</label>
            <input type="text" id="from_name" name="from_name" placeholder="Your name.." required disabled={isSubmitting} />
          </div>

          <div className="formElement">
            <label htmlFor="from_email">E-mail</label>
            <input type="email" id="from_email" name="from_email" placeholder="Your email.." required disabled={isSubmitting} />
          </div>

          <div className="formElement">
            <label htmlFor="message">Message</label>
            <textarea name="message" id="message" rows={8} cols={30} placeholder="Your message.." required disabled={isSubmitting} />
          </div>

          <button type="submit" className="formButton" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>

          {error && <div className="errorText">{error}</div>}
        </form>
      </div>

      {showSuccess && (
        <div className="successToast">Message sent successfully! 🚀</div>
      )}
    </>
  );
};

export default ContactForm;
