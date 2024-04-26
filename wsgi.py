#!/usr/bin/env python3
from api.v1.app import create_app
# from api.v1.config import DevelopmentConfig


if __name__ == "__main__":
    app = create_app()
    app.run()
