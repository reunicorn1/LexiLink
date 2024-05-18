import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from os import getenv
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask import url_for


s = URLSafeTimedSerializer(getenv('SECRET_KEY'))
def send_verification_email(email, name, user_type):
    """
    Send a verification email to the user
        email: the user's email address
        name: the user's name
        user_type: the user's type
        return: None
    """
    token = s.dumps(email, salt='email-confirm') 
    link = url_for('auth_confirm_email', token=token, _external=True, user_type=user_type)
    print(link)
    html_msg = f"""Hello <strong>{name}</strong>,
    <br>Click on the link below to verify your email address.
    <br>
    <a href='{link}' style='background-color: #4CAF50;
    display: block; margin: 0 auto; border: none;
    color: white; text-align: center; text-decoration: none;
    display: inline-block; font-size: 16px; cursor: pointer;
    padding: 15px 32px; border-radius: 4px;'>Verify Email
    </a>"""
    message = Mail(
        from_email='mail.lexilink@gmail.com',
        to_emails=email,
        subject='Verify Your Email Address',
        html_content=html_msg)
    try:
        sg = SendGridAPIClient(getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)