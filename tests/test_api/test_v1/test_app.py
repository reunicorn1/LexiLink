#!/usr/bin/env python3
"""
Unittest for the api/v1/app.py
"""
import unittest
import os
import inspect
import pycodestyle as pep8
import api.v1.app as app_module
from api.v1.app import create_app
from flask import Flask
from models import storage
from create_n_mentors import random_mentor
from create_n_students import random_student


class TestAppDocPep8(unittest.TestCase):
    """unittest class for FileStorage class
    documentation and pep8 conformaty"""

    def test_pep8_base(self):
        """Test that the base_module conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['api/v1/app.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_pep8_test_base(self):
        """Test that the test_file_storage conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['tests/test_api/test_v1/test_app.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_module_docstring(self):
        """test module documentation"""
        mod_doc = app_module.__doc__
        self.assertTrue(len(mod_doc) > 0)

    def test_func_docstrings(self):
        """Tests for the presence of docstrings in all functions"""
        base_funcs = inspect.getmembers(app_module, inspect.isfunction)
        base_funcs.extend(inspect.getmembers(app_module, inspect.ismethod))
        for func in base_funcs:
            self.assertTrue(len(str(func[1].__doc__)) > 0)


class TestApp(unittest.TestCase):
    """unittest class for app.py"""
    def setUp(self):
        """Setup for the test"""
        self.app = create_app()
        self.client = self.app.test_client()
        self.client.testing = True
        self.app_context = self.app.app_context()
        self.not_found = {'error': 'Not found'}
        # self.not_found = {'error': '404 Not Found:' +
        #          ' The requested URL was not found on the server.' +
        #          ' If you entered the URL manually please check your'
        #          + ' spelling and try again.'}

    def test_create_app(self):
        """Test create_app"""
        self.assertIsInstance(self.app, Flask)
        self.assertTrue(self.client.testing)
        self.assertFalse(self.app.url_map.strict_slashes)

    def test_close_db(self):
        """Test close_db"""
        with self.app_context:
            self.app_context.push()
            self.assertIsNone(self.app.teardown_appcontext(None))
            self.assertIsNone(storage.close())
            self.assertIsNone(storage.reload())
            self.assertIsNone(storage.rollback())

    def test_teardown_appcontext(self):
        """Test teardown_appcontext"""
        with self.app_context:
            self.app_context.push()
            self.assertIsNone(self.app.teardown_appcontext(None))

    def test_errorhandler(self):
        """Test errorhandler"""
        with self.app_context:
            self.app_context.push()
            response = self.client.get('/nonexistent')
            self.assertEqual(response.status_code, 404)
            self.assertEqual(response.json, self.not_found)

    def test_app_status(self):
        """Test app status"""
        with self.app_context:
            self.app_context.push()
            response = self.client.get('/api/status')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'status': 'OK'})


class TestApi(unittest.TestCase):
    """unittest class for app.py"""
    def setUp(self):
        """Setup for the test"""
        self.app = create_app()
        self.client = self.app.test_client()
        self.client.testing = True
        self.app_context = self.app.app_context()
        self.not_found = {'error': 'Not found'}

    def tearDown(self):
        """Teardown for the test"""
        storage.clear_all_tables()

    def test_app_status(self):
        """Test app status"""
        with self.app_context:
            self.app_context.push()
            response = self.client.get('/api/status')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'status': 'OK'})

    def test_auth_signup(self):
        """Test auth"""
        with self.app_context:
            self.app_context.push()
            self.assertEqual(storage.all('MentorModel'), {})
            mentor = random_mentor()
            response = self.client.post('/api/auth/signup',
                                        json=mentor)
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json['status'], 'success')
            self.assertEqual(mentor.get('email'),
                             storage.find_by('MentorModel',
                                             email=mentor.get('email')).email)


if __name__ == '__main__':
    unittest.main()
