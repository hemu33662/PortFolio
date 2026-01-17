document.getElementById('feedback-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var form = this;
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open(form.method, form.action, true);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.success) {
          document.querySelector('.sent-message').style.display = 'block';
          document.querySelector('.error-message').style.display = 'none';
          document.querySelector('.loading').style.display = 'none';
          form.reset();
        } else {
          document.querySelector('.error-message').innerHTML = response.message;
          document.querySelector('.error-message').style.display = 'block';
          document.querySelector('.loading').style.display = 'none';
        }
      } else {
        document.querySelector('.error-message').innerHTML = 'Oops! There was a problem submitting your form';
        document.querySelector('.error-message').style.display = 'block';
        document.querySelector('.loading').style.display = 'none';
      }
    }
  };

  document.querySelector('.loading').style.display = 'block';
  document.querySelector('.error-message').style.display = 'none';
  document.querySelector('.sent-message').style.display = 'none';

  xhr.send(formData);
});
