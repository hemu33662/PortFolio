document.getElementById('feedback-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var form = this;
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open(form.method, 'send_feedback.php', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;
      if (response === 'OK') {
        alert('Feedback submitted successfully!');
        form.reset();
      } else {
        alert('Failed to submit feedback. Please try again later.');
      }
    }
  };
  xhr.send(formData);
});
