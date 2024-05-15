#!/usr/bin/python3
'''Module creates a unique FileStorage instance for the application

Attrs:
    storage: an instance of FileStorage
'''

from models.engine.FileStorage import FileStorage
from models.engine.DBStorage import DBStorage
from os import getenv
from os.path import join, dirname
from dotenv import load_dotenv

if getenv("test") != "test":
    load_dotenv()
else:
    dotenv_path = join(dirname(__file__), '.env.test')
    load_dotenv(dotenv_path)

env = getenv("LEXILINK_TYPE_STORAGE")
db = (False, True)['db' == env]

if db:
    storage = DBStorage()
else:
    storage = FileStorage()
storage.reload()
