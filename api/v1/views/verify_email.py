import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from os import getenv
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask import url_for
from api.v1.views import student


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
    except Exception as e:
        print(e.message)
        

def send_session_email(session):
    """
    Send an email to the mentor and student about the scheduled session
        session: the session object
        return: None
    """
    send_mentor_session_email(session)
    send_student_session_email(session)


def send_mentor_session_email(session):
    student = session.student
    mentor = session.mentor
    mentor_msg = f"""Hello <strong>{mentor.first_name} {mentor.last_name}</strong>,
    <br>
    A session has been scheduled for {session.date} at {session.time}UTC with your student {student.first_name} {student.last_name}.
    The student has been notified of the session. You can approve or decline the session from your dashboard.
    All the best on your teaching journey!
    
    <br>
    <br>
    Regards,
    <br>
    Lexilink Team"""
    mentor_message = Mail(
        from_email='mail.lexilink@gmail.com',
        to_emails=mentor.email,
        subject='Verify Your Email Address',
        html_content=mentor_msg)
    try:
        sg = SendGridAPIClient(getenv('SENDGRID_API_KEY'))
        response = sg.send(mentor_message)
    except Exception as e:
        print(e.message)

def send_student_session_email(session):
    student = session.student
    mentor = session.mentor
    student_msg = f"""Hello <strong>{student.first_name} {student.last_name}</strong>,
    <br>
    Your session has been scheduled for {session.date} at {session.time}UTC with your mentor {mentor.first_name} {mentor.last_name}.
    All the best on your learning journey!
    
    <br>
    <br>
    Regards,
    <br>
    Lexilink Team"""
    std_message = Mail(
        from_email='mail.lexilink@gmail.com',
        to_emails=student.email,
        subject='Verify Your Email Address',
        html_content=student_msg)
    try:
        sg = SendGridAPIClient(getenv('SENDGRID_API_KEY'))
        response = sg.send(std_message)
    except Exception as e:
        print(e.message)