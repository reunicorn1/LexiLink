#!/usr/bin/python3
"""
Unittest for the DBStorage Class
"""
import unittest
import os
import inspect
import pycodestyle as pep8
import MySQLdb
from datetime import datetime
from models import storage, db
from models.engine import DBStorage as db_storage
from models.engine.DBStorage import DBStorage
from models.StudentModel import StudentModel
from models.MentorModel import MentorModel
from models.PaymentModel import PaymentModel
from models.SessionModel import SessionModel
from create_n_students import random_student
from create_n_mentors import random_mentor
from tests.test_models.mappings import mappings


class TestBaseModelDocPep8(unittest.TestCase):
    """unittest class for FileStorage class
    documentation and pep8 conformaty"""

    def test_pep8_base(self):
        """Test that the base_module conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['models/engine/DBStorage.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_pep8_test_base(self):
        """Test that the test_file_storage conforms to PEP8."""
        style = pep8.StyleGuide()
        result = style.check_files(['tests/test_models/test_engine/' +
                                    'test_DBStorage.py'])
        self.assertEqual(result.total_errors, 0,
                         "Found code style errors (and warnings).")

    def test_module_docstring(self):
        """test module documentation"""
        mod_doc = db_storage.__doc__
        self.assertTrue(len(mod_doc) > 0)

    def test_class_docstring(self):
        """test class documentation"""
        mod_doc = str(DBStorage.__doc__)
        self.assertTrue(len(mod_doc) > 0)

    def test_func_docstrings(self):
        """Tests for the presence of docstrings in all functions"""
        base_funcs = inspect.getmembers(DBStorage, inspect.isfunction)
        base_funcs.extend(inspect.getmembers(DBStorage, inspect.ismethod))
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
class TestDBStorage(unittest.TestCase):
    """Test for the DBStorage class"""

    def setUp(self):
        self.storage = storage
        self.instances = {}
        self.instances['StudentModel'] = storage.create("StudentModel",
                                                        **random_student())
        self.instances['MentorModel'] = storage.create("MentorModel",
                                                       **random_mentor())
        for instance in self.instances.values():
            instance.save()
        self.storage.save()
        self.cursor = create_cursor()

    def tearDown(self):
        """Tear down the tests"""
        ignore = ['SessionModel', 'PaymentModel']
        # for i in ignore:
        #     if i in self.instances:
        #         self.instances[i].delete()
        for k, instance in self.instances.items():
            if k not in ignore:
                instance.delete()
        self.cursor.close()

    def test_methods_exist(self):
        '''Test the db storage has certain methods'''
        methods = [
                   'save', 'all', 'new', 'reload', 'delete', 'close',
                   'rollback', 'drop', 'drop_all', 'get', 'count',
                   'get_uri', 'find_by', 'create', 'query', 'query_all'
                   ]

        self.assertIsInstance(storage, DBStorage)
        funcs = [f[0] for f in inspect.getmembers(DBStorage,
                                                  inspect.isfunction)]
        for m in methods:
            self.assertIn(m, funcs)

    def test_all(self):
        """Test the all method"""
        all_objs = self.storage.all()
        self.assertIsInstance(all_objs, dict)
        self.assertEqual(len(all_objs), len(self.instances))

    def test_new(self):
        """Test the new method"""
        all_objs = self.storage.all(StudentModel)
        self.cursor.execute("SELECT * FROM Student_Model")
        self.assertEqual(len(all_objs), self.cursor.rowcount)
        new_student = StudentModel(**random_student())
        new_student.save()
        self.instances['StudentModel2'] = new_student
        all_objs = self.storage.all(StudentModel)
        self.assertIn(new_student, all_objs.values())
        self.cursor.execute("SELECT * FROM Student_Model")
        self.assertEqual(len(all_objs) - self.cursor.rowcount, 1)

    def test_save(self):
        """Test the save method"""
        self.instances['StudentModel'].first_name = "New Name"
        self.instances['StudentModel'].save()
        self.cursor.execute("SELECT * FROM Student_Model")
        self.cursor.fetchall()
        self.assertEqual(self.cursor.rowcount, 1)
        self.cursor.execute("SELECT * FROM Student_Model WHERE id='{}'"
                            .format(self.instances['StudentModel'].id))
        self.assertEqual(self.cursor.rowcount, 1)
        self.cursor.execute("SELECT * FROM Student_Model WHERE first_name='{}'"
                            .format(self.instances['StudentModel'].first_name))
        self.assertEqual(self.cursor.rowcount, 1)

    def test_delete(self):
        """Test the delete method"""
        self.instances['del_student'] = StudentModel(**random_student())
        self.instances['del_student'].save()
        del_id = self.instances['del_student'].id
        self.cursor.close()
        self.cursor = create_cursor()
        self.cursor.execute("SELECT * FROM Student_Model WHERE id='{}'"
                            .format(del_id))
        self.assertEqual(self.cursor.rowcount, 1)
        self.storage.delete(self.instances['del_student'])
        self.storage.save()
        self.cursor.close()
        self.cursor = create_cursor()
        self.cursor.execute("SELECT * FROM Student_Model WHERE id='{}'"
                            .format(del_id))
        self.assertEqual(self.cursor.rowcount, 0)
        self.assertNotIn(self.instances['del_student'],
                         self.storage.all(StudentModel).values())
        del self.instances['del_student']

    def test_reload(self):
        """Test the reload method"""
        all_objs = self.storage.all()
        self.assertIsInstance(all_objs, dict)
        self.assertEqual(len(all_objs), len(self.instances))

    def test_get(self):
        """Test the get method"""
        pass
    #     state = self.storage.get(State, self.instances['State'].id)
    #     self.assertEqual(state, self.instances['State'])

    def test_count(self):
        """Test the count method"""
        count = self.storage.count(StudentModel)
        self.assertEqual(count, len([student for student in
                                     self.instances.values()
                                     if isinstance(student, StudentModel)]))
        count = self.storage.count()
        self.assertEqual(count, len(self.instances))


@unittest.skipIf(not db, "not db")
class TestDBStorageRelations(unittest.TestCase):
    '''Test relations between classes that
    mpas to tables in SQLAlchemy.
    '''

    def setUp(self):
        self.storage = storage
        self.instances = {}
        self.instances['StudentModel'] = storage.create("StudentModel",
                                                        **random_student())
        self.instances['MentorModel'] = storage.create("MentorModel",
                                                       **random_mentor())
        self.payment_data = {
            'student_id': self.instances['StudentModel'].id,
            'mentor_id': self.instances['MentorModel'].id,
            'date': datetime.now().date().isoformat(),
            'time': datetime.now().time().isoformat(),
            'duration': "00:30:00",
            'status': 'Pending',  # 'Approved', 'Declined', 'Pending'
            'amount': 55.00,
            'method': 'Paypal',
        }
        self.session_data = {
            'mentor_id': self.instances['MentorModel'].id,
            'student_id': self.instances['StudentModel'].id,
            'date': datetime.now().date().isoformat(),
            'time': datetime.now().time().isoformat(),
            'duration': "00:30:00",
            'status': 'Pending',  # 'Approved', 'Declined', 'Pending'
        }
        self.instances['PaymentModel'] = storage.create("PaymentModel",
                                                        **self.payment_data)
        self.session_data['payment_id'] = self.instances['PaymentModel'].id
        self.instances['SessionModel'] = storage.create("SessionModel",
                                                        **self.session_data)
        self.instances['SessionModel'].payment = self.instances['PaymentModel']
        for instance in self.instances.values():
            instance.save()
        self.cursor = create_cursor()

    def tearDown(self):
        """Tear down the tests"""
        ignore = ['SessionModel', 'PaymentModel']
        # for i in ignore:
        #     self.instances[i].delete()
        for k, instance in self.instances.items():
            if k not in ignore:
                instance.delete()
        self.cursor.close()

    def test_relation_Student_Mentor(self):
        """Test relations between Student and Mentor tables"""
        self.instances['StudentModel'].mentors.\
            append(self.instances['MentorModel'])
        self.instances['StudentModel'].save()
        for mentor in self.instances['StudentModel'].mentors:
            self.assertEqual(mentor, self.instances['MentorModel'])
            self.assertIn(self.instances['StudentModel'],
                          mentor.students)
        for student in self.instances['MentorModel'].students:
            self.assertEqual(student, self.instances['StudentModel'])
            self.assertIn(self.instances['MentorModel'],
                          student.mentors)

    def test_relation_Student_Mentor_Session(self):
        """Test relations between Student, Mentor and Session tables"""
        for session in self.instances['StudentModel'].sessions:
            self.assertEqual(session, self.instances['SessionModel'])
        for session in self.instances['MentorModel'].sessions:
            self.assertEqual(session, self.instances['SessionModel'])
        self.assertEqual(self.instances['SessionModel'].mentor,
                         self.instances['MentorModel'])
        self.assertEqual(self.instances['SessionModel'].student,
                         self.instances['StudentModel'])

    def test_relation_Session_Payment(self):
        """Test relations between Session and Payment tables"""
        self.instances['SessionModel'].save()

        self.assertEqual(self.instances['SessionModel'].payment,
                         self.instances['PaymentModel'])

    def test_student_favorites(self):
        """Test the student favorite mentors relationship"""
        self.instances['StudentModel'].favorite_mentors.\
            append(self.instances['MentorModel'])
        self.instances['StudentModel'].save()
        for mentor in self.instances['StudentModel'].favorite_mentors:
            self.assertEqual(mentor, self.instances['MentorModel'])


if __name__ == '__main__':
    unittest.main()
