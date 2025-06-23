import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY!
      )
      .then(() => {
        setShowSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setShowSuccess(false), 4000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error.text);
        alert('Something went wrong while sending your message.');
      });
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
        <form ref={formRef} onSubmit={handleSubmit} className="formContainer">
          <h2>Send me a message. Let's have a chat!</h2>

          <div className="formElement">
            <label htmlFor="from_name">Name</label>
            <input type="text" id="from_name" name="from_name" placeholder="Your name.." required />
          </div>

          <div className="formElement">
            <label htmlFor="from_email">E-mail</label>
            <input type="email" id="from_email" name="from_email" placeholder="Your email.." required />
          </div>

          <div className="formElement">
            <label htmlFor="message">Message</label>
            <textarea name="message" id="message" rows={8} cols={30} placeholder="Your message.." required />
          </div>

          <button type="submit" className="formButton">Submit</button>
        </form>
      </div>

      {showSuccess && (
        <div className="successToast">Message sent successfully! 🚀</div>
      )}
    </>
  );
};

export default ContactForm;
