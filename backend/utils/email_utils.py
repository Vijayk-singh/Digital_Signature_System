import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_ADDRESS = "hi.gatecse@gmail.com"
EMAIL_PASSWORD = "uzxppxifcpgejgrq"  # Use App Password (not normal password)

def send_verification_email(receiver_email, token):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = receiver_email
    msg["Subject"] = "Verify Your DSS Account"

    body = f"Click the link to verify your account: http://localhost:8000/auth/verify/{token}"
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)


def send_private_key_email(receiver_email, private_key):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = receiver_email
    msg["Subject"] = "Your DSS Private Key"

    body = "Your DSS account is verified. Please keep your private key safe:\n\n" + private_key
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
