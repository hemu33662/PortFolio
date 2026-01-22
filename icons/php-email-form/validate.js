document.getElementById('feedback-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  var form = this;
  var formData = new FormData(form);

  // URL points to Netlify Function
  const API_URL = "/.netlify/functions/send-mail";

  // UI Elements
  const button = form.querySelector('button[type="submit"]');
  const errorMsg = document.querySelector('.error-message');
  const sentMsg = document.querySelector('.sent-message');

  // Start Animation
  button.classList.add('animating');
  errorMsg.style.display = 'none';
  sentMsg.style.display = 'none';

  try {
    // Convert FormData to JSON for Node.js
    const object = {};
    formData.forEach((value, key) => object[key] = value);
    const json = JSON.stringify(object);

    // Send data to Netlify Function
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    });

    // Check for Netlify errors (e.g. 500 or 502)
    if (!response.ok) {
      // Try to get error text if json parsing fails
      const text = await response.text();
      let message = 'Server Error';
      try {
        const result = JSON.parse(text);
        message = result.message || message;
      } catch (e) { message = text || response.statusText; }
      throw new Error(message);
    }

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      sentMsg.style.display = 'block';
      form.reset();
    } else {
      throw new Error(result.message || 'Form submission failed');
    }

  } catch (error) {
    console.error(error);
    errorMsg.innerHTML = error.message || 'An error occurred. Please try again.';
    errorMsg.style.display = 'block';
  } finally {
    // Stop Animation
    button.classList.remove('animating');
  }
});
