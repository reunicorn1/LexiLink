#!/usr/bin/python3
'''Module creates a unique FileStorage instance for the application

Attrs:
    storage: an instance of FileStorage
'''

from models.engine.FileStorage import FileStorage
from models.engine.DBStorage import DBStorage
from os import getenv
from dotenv import load_dotenv


load_dotenv()
env = getenv("LEXILINK_TYPE_STORAGE")
db = (False, True)['db' == env]

if db:
    storage = DBStorage()
else:
    storage = FileStorage()
storage.reload()
