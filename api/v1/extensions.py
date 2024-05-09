#!/usr/bin/env python3
"""
This module defines the login manager for the Flask app.
"""
from flask_login import LoginManager
from models import storage

login_manager = LoginManager()


@login_manager.user_loader
def load_user(email, user_type=None):
    """ load user from database """
    if user_type == 'mentor':
        return storage.find_by("MentorModel", email=email)
    return storage.find_by("StudentModel", email=email)

