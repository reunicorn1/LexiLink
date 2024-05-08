#!/usr/bin/env python3
"""__init__.py: This file is the entry point of the blueprint"""
from flask_restx import Namespace

auth = Namespace('auth', description='Authentication')
mentor = Namespace('mentor', description='Mentor related operations')
sessions = Namespace('sessions', description='Session related operations')
student = Namespace('student', description='Student related operations')
