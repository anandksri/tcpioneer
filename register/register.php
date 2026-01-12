<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form values safely
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $college = htmlspecialchars($_POST['college']);
    $phone = htmlspecialchars($_POST['phone']);
    $type = htmlspecialchars($_POST['type']);
    $message = htmlspecialchars($_POST['message']);

    // (Optional) Store submissions in a text file or database
    $data = "$name,$email,$college,$phone,$type,$message\n";
    file_put_contents("registrations.csv", $data, FILE_APPEND);

    // Send confirmation email (optional)
    $to = $email;
    $subject = "🎉 Pioneer Hackfeast 2025 Registration Confirmed";
    $body = "Hello $name,\n\nThank you for registering for Pioneer Hackfeast 2025!\nWe'll contact you soon with more details.\n\n- The Cyber Pioneer Team";
    $headers = "From: tcpioneer.org@gmail.com";

    mail($to, $subject, $body, $headers);

    // Return success message
    echo "<script>alert('✅ Registration Successful! See you at Pioneer Hackfeast 2025.'); window.location.href='index.html';</script>";
}
?>
