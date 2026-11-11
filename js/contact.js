/**
 * CONTACT.JS
 * Validasi Form Klien, Indikator Real-time, Konfigurasi Endpoint, & Toast Feedback (Tanpa alert())
 */

(function () {
  'use strict';

  // Konfigurasi endpoint (dapat diubah ke Webhook / Serverless API)
  const CONTACT_CONFIG = {
    ENDPOINT: 'https://httpbin.org/post', // Endpoint simulasi yang aman
    SIMULATE_DELAY_MS: 900
  };

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
  });

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const topicSelect = document.getElementById('contact-topic');
    const messageTextarea = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');
    const charCounter = document.getElementById('message-char-count');

    // 1. Live Character Counter untuk Pesan
    if (messageTextarea && charCounter) {
      messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCounter.textContent = `${length} / 1000`;
        if (length > 1000) {
          charCounter.style.color = 'var(--status-danger)';
        } else {
          charCounter.style.color = 'var(--ink-soft)';
        }
      });
    }

    // 2. Realtime validation saat blur
    [nameInput, emailInput, topicSelect, messageTextarea].forEach(field => {
      if (!field) return;
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });

    // 3. Submit Handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isTopicValid = validateField(topicSelect);
      const isMessageValid = validateField(messageTextarea);

      if (!isNameValid || !isEmailValid || !isTopicValid || !isMessageValid) {
        if (window.showToast) {
          window.showToast({
            title: 'Incomplete Form',
            message: 'Please review the fields highlighted in red before submitting.',
            type: 'warning'
          });
        }
        return;
      }

      // Enter loading state
      setButtonLoading(submitBtn, true);

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        topic: topicSelect.value,
        message: messageTextarea.value.trim(),
        sentAt: new Date().toISOString()
      };

      try {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, CONTACT_CONFIG.SIMULATE_DELAY_MS));

        // Success
        if (window.showToast) {
          window.showToast({
            title: 'Message Sent Successfully!',
            message: `Thank you ${payload.name}, your message has been received. I will reply to ${payload.email} within 24 hours.`,
            type: 'success',
            duration: 6000
          });
        }

        form.reset();
        if (charCounter) charCounter.textContent = '0 / 1000';
        clearValidationState([nameInput, emailInput, topicSelect, messageTextarea]);

      } catch (err) {
        console.error('Submission error:', err);
        if (window.showToast) {
          window.showToast({
            title: 'Failed to Send Message',
            message: 'A network error occurred. Please contact directly via email at danindra@kolektif.dev.',
            type: 'danger'
          });
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  function validateField(field) {
    if (!field) return true;
    const group = field.closest('.form-group');
    const val = field.value.trim();
    let isValid = true;
    let errorMsg = '';

    if (field.id === 'contact-name') {
      if (!val) {
        isValid = false;
        errorMsg = 'Full name is required.';
      } else if (val.length < 3) {
        isValid = false;
        errorMsg = 'Name must be at least 3 characters.';
      }
    } else if (field.id === 'contact-email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        isValid = false;
        errorMsg = 'Email address is required.';
      } else if (!emailRegex.test(val)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    } else if (field.id === 'contact-topic') {
      if (!val || val === '') {
        isValid = false;
        errorMsg = 'Please select a discussion topic.';
      }
    } else if (field.id === 'contact-message') {
      if (!val) {
        isValid = false;
        errorMsg = 'Message cannot be empty.';
      } else if (val.length < 15) {
        isValid = false;
        errorMsg = 'Message is too short (minimum 15 characters for clarity).';
      } else if (val.length > 1000) {
        isValid = false;
        errorMsg = 'Message exceeds maximum limit of 1000 characters.';
      }
    }

    if (group) {
      let errorEl = group.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        group.appendChild(errorEl);
      }

      if (!isValid) {
        group.classList.add('has-error');
        field.classList.add('is-invalid');
        errorEl.textContent = errorMsg;
      } else {
        group.classList.remove('has-error');
        field.classList.remove('is-invalid');
        errorEl.textContent = '';
      }
    }

    return isValid;
  }

  function clearValidationState(fields) {
    fields.forEach(field => {
      if (!field) return;
      field.classList.remove('is-invalid');
      const group = field.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  }

  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.setAttribute('disabled', 'true');
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = `
        <svg class="icon icon--sm" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"/>
        </svg>
        <span>Sending Message...</span>
      `;
    } else {
      btn.removeAttribute('disabled');
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
    }
  }

  // Inject keyframe animasi spin
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();

