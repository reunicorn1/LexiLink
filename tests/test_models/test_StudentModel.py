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
        student1 = random_student()
        student1.pop('user_type')
        student2 = random_student()
        student2.pop('user_type')

        self.instances['StudentModel1'] = storage.create("StudentModel",
                                                         **student1)
        self.instances['StudentModel2'] = storage.create("StudentModel",
                                                         **student2)
        self.student_mapping = mappings['student_model']
        for instance in self.instances.values():
            instance.save()

    def tearDown(self):
        """Tear down the tests"""
        for instance in self.instances.values():
            instance.delete()

    def test_student_model(self):
        """Test the StudentModel class has the correct attributes"""
        for instance in self.instances.values():
            self.assertIsInstance(instance, StudentModel)
            for key, value in self.student_mapping.items():
                if not hasattr(instance, key):
                    print(f"StudentModel is missing key: {key}")
                self.assertTrue(hasattr(instance, key))
                self.assertIsInstance(getattr(instance, key), value)

    def test_student_model_save(self):
        """Test the StudentModel save method"""
        for instance in self.instances.values():
            created_at = instance.created_at
            updated_at = instance.updated_at
            instance.save()
            self.assertEqual(instance.created_at, created_at)
            self.assertNotEqual(instance.updated_at, updated_at)

    def test_student_model_to_dict(self):
        """Test the StudentModel to_dict method"""
        for instance in self.instances.values():
            instance_dict = instance.to_dict()
            self.assertIsInstance(instance_dict, dict)
            self.assertIsInstance(instance_dict['created_at'], str)
            self.assertIsInstance(instance_dict['updated_at'], str)
            self.assertIsInstance(instance_dict['id'], str)
            for key, value in self.student_mapping.items():
                if key in ['created_at', 'updated_at', 'password',
                           'sessions', 'payments', 'favorite_mentors',
                           ]:
                    continue
                self.assertIn(key, instance_dict)
                self.assertIsInstance(instance_dict[key], value)

    def test_student_model_delete(self):
        """Test the StudentModel delete method"""
        new_instance = random_student()
        new_instance.pop('user_type')
        new_instance = storage.create("StudentModel", **new_instance)
        new_instance.save()
        new_instance_id = new_instance.id
        self.assertIn(f"StudentModel.{new_instance_id}",
                      storage.all("StudentModel"))
        new_instance.delete()
        self.assertNotIn(new_instance_id, storage.all("StudentModel"))
        storage.save()

    def test_student_model_get_id(self):
        """Test the StudentModel get_id method"""
        for instance in self.instances.values():
            instance_id = instance.id
            self.assertEqual(instance, self.storage.get("StudentModel",
                                                        instance_id))

    def test_student_model_get(self):
        """Test the StudentModel get method"""
        for instance in self.instances.values():
            instance_id = instance.id
            self.assertEqual(instance, self.storage.get("StudentModel",
                                                        instance_id))

    def test_student_model_count(self):
        """Test the StudentModel count method"""
        self.assertEqual(len(self.instances),
                         self.storage.count("StudentModel"))
