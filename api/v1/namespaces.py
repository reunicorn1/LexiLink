#!/usr/bin/env python
"""
This module defines the namespaces for the api.
"""
from api.v1.views.auth import auth
from api.v1.views.student import std
from api.v1.views.mentors import mentor
from api.v1.views.sessions import sessions


def add_namespaces(app, api):
    """
    This function adds the namespaces to the api instance.
    add_namespaces: This function adds the namespaces to the api instance.
                    It returns the api instance.

    Args:
        app (Flask app): The Flask app instance.
        api (Api): The Api instance.

    Returns:
        api: The Api instance with the namespaces added.
    """
    api.add_namespace(auth)
    api.add_namespace(std)
    api.add_namespace(mentor)
    api.add_namespace(sessions)
    return api