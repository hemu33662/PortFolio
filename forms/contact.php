<?php
$receiving_email_address = 'hemanth.nitm@gmail.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  $subject = 'Feedback from '.$name;
  $body = "Name: $name\nEmail: $email\n\n$message";

  $headers = "From: $name <$email>";

  if (mail($receiving_email_address, $subject, $body, $headers)) {
    echo 'OK';
  } else {
    echo 'Error';
  }
} else {
  echo 'Method Not Allowed';
}
?>
