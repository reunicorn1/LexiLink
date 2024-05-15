#!/usr/bin/env python3
"""
Unittest for the BaseModel
"""
import unittest
import time
from datetime import datetime
import models
import re
import os
from json import load
from io import StringIO
from contextlib import redirect_stdout
from time import sleep
from unittest.mock import patch
from models.StudentModel import StudentModel
import inspect
import pycodestyle as pep8
import models.StudentModel as base_model
from create_n_students import random_student
from tests.test_models.mappings import mappings
from models import db, storage


class TestStudentModelDocPep8(unittest.TestCase):
    """
    unittest class for StudentModel class documentation and pep8 conformaty
    """

    def test_pep8_base(self) -> None:
        """Test that the StudentModel conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['models/StudentModel.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_pep8_test_base(self) -> None:
        """Test that the test_StudentModel conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['tests/test_models/test_StudentModel.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_module_docstring(self) -> None:
        """test module documentation"""
        mod_doc = base_model.__doc__
        self.assertTrue(len(mod_doc) > 0)

    def test_class_docstring(self) -> None:
        """test class documentation"""
        mod_doc = str(StudentModel.__doc__)
        self.assertTrue(len(mod_doc) > 0)

    def test_func_docstrings(self) -> None:
        """Tests for the presence of docstrings in all functions"""
        base_funcs = inspect.getmembers(StudentModel, inspect.isfunction)
        base_funcs.extend(inspect.getmembers(StudentModel, inspect.ismethod))
        for func in base_funcs:
            if func[0] == "get_id":
                continue
            self.assertIsNotNone(func[1].__doc__)
            self.assertTrue(len(str(func[1].__doc__)) > 0)


class TestStudentModel(unittest.TestCase):
    """Test the StudentModel class"""

    def setUp(self) -> None:
        """Set up test methods"""
        self.storage = storage
        self.instances = {}
        self.instances['StudentModel1'] = storage.create("StudentModel",
                                                         **random_student())
        self.instances['StudentModel2'] = storage.create("StudentModel",
                                                         **random_student())
        self.student_mapping = mappings['student_model']
        for instance in self.instances.values():
            instance.save()

    def tearDown(self):
        """Tear down the tests"""
        for instance in self.instances.values():
            instance.delete()

    def test_create_student(self):
        """Test that the student instances were created"""
        for instance in self.instances.values():
            self.assertIsInstance(instance, StudentModel)
            for key, value in self.student_mapping.items():
                if not hasattr(instance, key):
                    print(f"StudentModel is missing key: {key}")
                self.assertTrue(hasattr(instance, key))
                self.assertIsInstance(getattr(instance, key), value)
