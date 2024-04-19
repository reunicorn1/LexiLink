#!/usr/bin/python3
'''Module creates a unique FileStorage instance for the application

Attrs:
    storage: an instance of FileStorage
'''

from models.engine.FileStorage import FileStorage
from models.engine.DBStorage import DBStorage
from os import getenv


db = (False, True)['db' == getenv("HBNB_TYPE_STORAGE")]

if db:
    storage = DBStorage()
else:
    storage = FileStorage()
storage.reload()
