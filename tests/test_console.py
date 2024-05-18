#!/usr/bin/python3
"""
Unittest for the console including the class LEXILINKCommand
"""

import unittest
import models
import os
import json
import pycodestyle as pep8
import console
import inspect
from console import LEXILINKCommand
from unittest.mock import patch
from io import StringIO
from models import db, storage
import MySQLdb
from create_n_students import random_student


class TestConsoleDocPep8(unittest.TestCase):
    """unittest class for LEXILINKCommand class
    documentation and pep8 conformaty
    """

    def test_pep8_base(self):
        """Test that the base_module conforms to PEP8.
        """
        style = pep8.StyleGuide()
        result = style.check_files(['console.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_pep8_test_base(self):
        """Test that the test_console conforms to PEP8.
        """
        style = pep8.StyleGuide()
        result = style.check_files(['tests/test_console.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_module_docstring(self):
        """test module documentation
        """
        mod_doc = console.__doc__
        self.assertTrue(len(mod_doc) > 0)

    def test_class_docstring(self):
        """test class documentation
        """
        mod_doc = str(LEXILINKCommand.__doc__)
        self.assertTrue(len(mod_doc) > 0)

    def test_func_docstrings(self):
        """Tests for the presence of docstrings in all functions
        """
        base_funcs = inspect.getmembers(LEXILINKCommand, inspect.isfunction)
        base_funcs.extend(inspect.getmembers(LEXILINKCommand,
                                             inspect.ismethod))
        for func in base_funcs:
            self.assertTrue(len(str(func[1].__doc__)) > 0)


def create_cursor():
    """Create a cursor"""
    conn = MySQLdb.connect(host=os.getenv('LEXILINK_MYSQL_HOST'),
                           port=3306,
                           user=os.getenv('LEXILINK_MYSQL_USER'),
                           passwd=os.getenv('LEXILINK_MYSQL_PWD'),
                           db=os.getenv('LEXILINK_MYSQL_DB'))
    return conn.cursor()


@unittest.skipIf(not db, "not db")
class TestConsoleDB(unittest.TestCase):
    """This class defines unittests for the console when using db"""

    def setUp(self):
        """This function sets up the environment for testing"""
        self.cursor = create_cursor()
        self.instances = {}

    def tearDown(self):
        """This function removes the environment for testing"""
        ignore = ['SessionModel', 'PaymentModel']
        # for i in ignore:
        #     if i in self.instances:
        #         self.instances[i].delete()
        for k, instance in self.instances.items():
            if k not in ignore:
                instance.delete()
        self.cursor.close()


class TestConsole_Base(unittest.TestCase):
    """This class defines unittests for the basic usage of the console"""

    def test_docstr(self):
        """Test class documentaion"""
        self.assertTrue(len(str(LEXILINKCommand.__doc__)) > 2)

    def test_prompt(self):
        """This function tests having the correct prompt"""
        self.assertEqual("(Lexilink) ", LEXILINKCommand.prompt)

    def test_quit_return(self):
        """This function tests the return of onecmd function during quitting"""
        # with patch('sys.stdout', new=StringIO()) as f:
        self.assertTrue(LEXILINKCommand().onecmd("quit"))

    def test_eof_return(self):
        """This function tests the return of onecmd function during eof"""
        # with patch('sys.stdout', new=StringIO()) as f:
        self.assertTrue(LEXILINKCommand().onecmd("EOF"))

    def test_invalid_cmd(self):
        """This function tests the output when the class recieves
        invalid cmd"""
        invalid_output = "*** Unknown syntax: arg"
        with patch('sys.stdout', new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("arg"))
            self.assertEqual(invalid_output, f.getvalue().strip())

    def test_empty_line(self):
        """This function tests recieving an empty line"""
        with patch('sys.stdout', new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd(""))
            self.assertEqual("", f.getvalue().strip())

    def test_help(self):
        """This function tests the expected output of the command help"""
        cmds = ['EOF', 'all', 'count', 'create', 'destroy', 'drop', 'drop_all',
                'help', 'quit', 'show', 'update']
        expected = ("Documented commands (type help <topic>):\n",
                    "========================================\n",
                    '  '.join(cmds))
        with patch('sys.stdout', new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help"))
            self.assertEqual(''.join(expected), f.getvalue().strip())


class TestConsole_help(unittest.TestCase):
    """This class defines unittests for the help method of the console"""

    def test_help_EOF(self):
        """This function tests the <help EOF> message content"""
        expected = "End-of-file"
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help EOF"))
            self.assertEqual(expected, f.getvalue().strip())

    def test_help_all(self):
        """This function tests the <help all> message content"""
        out = ["Prints all string representation of all instances based or\n",
               "        not on the class name"]
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help all"))
            self.assertEqual(''.join(out), f.getvalue().strip())

    def test_help_count(self):
        """This function tests the <help count> message content"""
        out = "Retrives the number of instances of a class"
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help count"))
            self.assertEqual(out, f.getvalue().strip())

    def test_help_create(self):
        """This function tests the <help create> message content"""
        out = ["Creates a new instance of the class provided, save it into\n",
               "        a JSON file, and prints the id"]
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help create"))
            self.assertEqual(''.join(out), f.getvalue().strip())

    def test_help_update(self):
        """This function tests the <help update> message content"""
        o = ["Updates an instance based on the class name and id by adding\n",
             "        or updating attributes"]
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help update"))
            self.assertEqual(''.join(o), f.getvalue().strip())

    def test_help_destroy(self):
        """This function tests the <help destroy> message content"""
        out = "Deletes an instance based on class name and id"
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help destroy"))
            self.assertEqual(out, f.getvalue().strip())

    def test_help_help(self):
        """This function tests the <help help> message content"""
        out = ['List available commands with "help" or detailed',
               'help with "help cmd".']
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help help"))
            self.assertEqual(" ".join(out), f.getvalue().strip())

    def test_help_quit(self):
        """This function tests the <help quit> message content"""
        out = "Quit command to exit the program"
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help quit"))
            self.assertEqual(out, f.getvalue().strip())

    def test_help_show(self):
        """This function tests the <help show> message content"""
        out = ["Prints the string representation of an instance based on\n",
               "        the class and id values"]
        with patch("sys.stdout", new=StringIO()) as f:
            self.assertFalse(LEXILINKCommand().onecmd("help show"))
            self.assertEqual(''.join(out), f.getvalue().strip())
