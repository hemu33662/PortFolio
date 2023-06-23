<!-- Add the necessary JavaScript library -->
<script src="icons/php-email-form/validate.js"></script>

<!-- HTML form -->
<form id="contact-form" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="text" name="subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Send</button>
</form>

<!-- JavaScript code -->
<script>
  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Validate the form inputs
    if (validateForm()) {
      // If the form is valid, proceed with sending the email
      sendEmail();
    } else {
      // If the form is not valid, display error messages or handle accordingly
      // You can customize this part based on your specific requirements
      alert('Please fill in all the required fields.');
    }
  }

  // Function to validate the form inputs
  function validateForm() {
    var form = document.getElementById('contact-form');
    return validate(form);
  }

  // Function to send the email
  function sendEmail() {
    // Get the form data
    var form = document.getElementById('contact-form');
    var formData = new FormData(form);

    // Perform AJAX request or submit the form to the server for email processing
    // You can customize this part based on your specific server-side implementation
    // Example using fetch API:
    fetch('path/to/email-processing.php', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      // Handle the response from the server
      if (response.ok) {
        alert('Email sent successfully!');
        form.reset(); // Reset the form after successful submission
      } else {
        alert('Failed to send email. Please try again later.');
      }
    })
    .catch(function(error) {
      console.log(error);
      alert('An error occurred. Please try again later.');
    });
  }

  // Attach the form submission handler
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', handleSubmit);
</script>
