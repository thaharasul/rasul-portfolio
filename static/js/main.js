/**
 * Main — contact form handling, footer back-to-top, init
 */

(function () {
  'use strict';

  // Render Backend URL
  const API_URL = "";


  /* Contact form */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('formStatus');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      if (
        !name.value.trim() ||
        !email.value.trim() ||
        !subject.value.trim() ||
        !message.value.trim()
      ) {
        showStatus(status, 'Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email.value)) {
        showStatus(status, 'Please enter a valid email address.', 'error');
        return;
      }

      showStatus(status, 'Sending...', 'success');

      try {
        const response = await fetch(`${API_URL}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value
          })
        });


        const result = await response.json();

        if (result.success) {
          showStatus(status, '✅ Message sent successfully!', 'success');
          form.reset();
        } else {
          showStatus(status, '❌ Failed to send message.', 'error');
        }

      } catch (error) {
        console.error("Contact form error:", error);
        showStatus(status, '❌ Unable to connect to the server.', 'error');
      }
    });
  }


  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  function showStatus(el, message, type) {
    if (!el) return;

    el.textContent = message;
    el.className = `form-status form-status--${type} is-visible`;
    el.setAttribute('role', 'alert');

    setTimeout(() => {
      el.classList.remove('is-visible');
    }, 5000);
  }


  /* Footer back-to-top */
  function initFooterBackTop() {
    const btn = document.getElementById('footerBackTop');

    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* Footer year */
  function setYear() {
    const yearEl = document.getElementById('currentYear');

    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initFooterBackTop();
    setYear();
  });

})();
