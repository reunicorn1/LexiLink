#!/usr/bin/env python3
"""
Unittest for the api/v1/app.py
"""
import unittest
import os
import inspect
import pycodestyle as pep8
import api.v1.app as app_module
from flask import Flask, jsonify, request, make_response, abort
from models import storage


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


# class TestApp(unittest.TestCase):
#     """unittest class for app.py"""

#     def setUp(self):
#         """Setup for the test"""
#         print('setUp')
#         self.app = app_module.app.test_client()
#         self.app.testing = True

#     def test_app_status(self):
#         """Test for app.py status"""
#         with app_module.app.app_context():
#             response = self.app.get('/api/v1/status')
#             self.assertEqual(response.status_code, 200)
#             self.assertEqual(response.data, b'{"status":"OK"}\n')

#     def test_app_stats(self):
#         """Test for app.py stats"""
#         with app_module.app.app_context():
#             response = self.app.get('/api/v1/stats')
#             self.assertEqual(response.status_code, 200)
#             self.assertEqual(response.data,
#                              jsonify({"states": storage.count(State),
#                                       "cities": storage.count(City),
#                                       "users": storage.count(User),
#                                       "places": storage.count(Place),
#                                       "reviews": storage.count(Review),
#                                       "amenities":
#                                       storage.count(Amenity)}).data)

#     def test_app_404(self):
#         """Test for app.py 404"""
#         with app_module.app.app_context():
#             response = self.app.get('/api/v1/404')
#             self.assertEqual(response.status_code, 404)
#             self.assertEqual(response.data, b'{"error":"Not found"}\n')


if __name__ == '__main__':
    unittest.main()
