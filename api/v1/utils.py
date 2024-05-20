#!/usr/bin/env python
"""
This module utility functions for the api.
"""

def clean_data(data):
    """ clean data """
    if not data:
        return None
    for key, value in data.items():
        if isinstance(value, str):
            data[key] = value.strip()
    return data