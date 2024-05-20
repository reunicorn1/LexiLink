#!/usr/bin/env python3
"""WSGI module for running the Flask app.
"""
from api.v1.app import create_app
from api.v1.config import DevelopmentConfig, ProductionConfig, TestingConfig

# config = ProductionConfig
config = DevelopmentConfig
#config = TestingConfig

print("CONFIG: ", config.__class__.__name__)
app=create_app(config)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
