#!/usr/bin/python3
'''Module defines BaseModel class'''

from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from os import getenv
from dotenv import load_dotenv


load_dotenv()
env = getenv("LEXILINK_TYPE_STORAGE")
db = (False, True)['db' == env]
Base = declarative_base()


class BaseModel:
    '''BaseModel class'''
    id = Column(String(60), primary_key=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow(), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow(), nullable=False)

    def __init__(self, *_, **kwargs):
        '''Instantiate an instance'''
        self.id = str(uuid4())
        if not len(kwargs):
            self.created_at = datetime.utcnow()
            self.updated_at = datetime.utcnow()
            return
        for k, v in kwargs.items():
            if k != '__class__':
                setattr(self, k, v if k not in ('updated_at', 'created_at')
                        else datetime.strptime(v, '%Y-%m-%dT%H:%M:%S.%f'))

    def save(self):
        '''updates the public instance attribute updated_at'''
        from models import storage
        if db:
            self.updated_at = datetime.utcnow()
        else:
            self.updated_at = datetime.utcnow()
        storage.new(self)
        storage.save()

    def to_dict(self):
        '''returns a dictionary containing all keys/values of __dict__

        Return:
            dictionary representaion of class attributes,
                with `__class__` attr to manifest class instance
        '''
        _dict = {k: v.isoformat() if isinstance(v, datetime) else
                 v for k, v in self.__dict__.items()
                 if k != '_sa_instance_state'}
        # _dict['__class__'] = self.__class__.__name__
        if 'password' in _dict:
            del _dict['password']
        return _dict

    def delete(self):
        '''deletes the current instance from the storage'''
        from models import storage
        storage.delete(self)

    def __str__(self):
        '''Instance representaion'''
        return '[{}] ({}) {}'.format(self.__class__.__name__,
                                     self.id, self.__dict__)

    def __repr__(self):
        '''Instance representaion'''
        return self.__str__()

    def update(self, **kwargs):
        '''updates the instance attributes'''
        for k, v in kwargs.items():
            if k not in ('id', 'created_at', 'updated_at'):
                setattr(self, k, v)
        self.save()


def store(*args, **kw):
    '''Decorator to set class attributes base on
    storage type.

    Args:
        args: positional arguments represnent fields to skip
            when it's file storage.
        kw: named arguments represents class attrs

    Returns:
        decorated class.
    '''

    def decorate(cls):
        for k, v in kw.items():
            if not db and k in args:
                continue
            setattr(cls, k, v[0] if db else v[1])
        return cls

    return decorate
