#!/usr/bin/env python
"""
This module defines the reverse proxy for the api.
Its purpose is to allow the api to be served from a subdirectory.
This allows access to the docs and other resources from the root of the domain.
"""


MY_PREFIX = '/api'


class ReverseProxied(object):
    '''Wrap the application in this middleware and configure the
    front-end server to add these headers, to let you quietly bind
    this to a URL other than / and to an HTTP scheme that is
    different than what is used locally.

    :param app: the WSGI application
    '''
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        path_info = environ['PATH_INFO']

        # Check if the request path already starts with /api
        environ['SCRIPT_NAME'] = MY_PREFIX
        path_info = path_info[len(MY_PREFIX):]

        environ['PATH_INFO'] = path_info
        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)