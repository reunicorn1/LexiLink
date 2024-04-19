#!/usr/bin/python3
"""db_storage module"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from os import getenv
from models.BaseModel import Base

env = ['LEXILINK_MYSQL_USER', 'LEXILINK_MYSQL_PWD',
       'LEXILINK_MYSQL_HOST', 'LEXILINK_MYSQL_DB',
       'LEXILINK_TYPE_STORAGE', 'LEXILINK_ENV']

classes = [
        #User
        ]


class DBStorage:
    """DBStorage class

    Attributes:
        __engine: None
        __session: None


    Methods:
        __init__(self)
        reload(self)
        all(self, cls=None)
        new(self, obj)
        save(self)
        delete(self, obj=None)
    """
    __engine = None
    __session = None

    def __init__(self):
        """initialize engine
        """
        MYSQL = {}
        for e in env:
            MYSQL[e.split('_')[-1]] = getenv(e)
        # dialect+driver://username:password@host:port/database
        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'
                                      .format(MYSQL['USER'], MYSQL['PWD'],
                                              MYSQL['HOST'], MYSQL['DB']),
                                      pool_pre_ping=True)
        if MYSQL['ENV'] == 'test':
            Base.metadata.drop_all(self.__engine)

    def reload(self):
        """create all tables in the database
        """
        Base.metadata.create_all(self.__engine)
        self.__session = scoped_session(sessionmaker(bind=self.__engine,
                                        expire_on_commit=False))()

    def all(self, cls=None):
        """query on the current database session
        """
        res = {}
        objs = []
        if cls:
            objs = self.__session.query(cls).all()
        else:
            for c in classes:
                objs.extend(self.__session.query(c).all())

        if objs:
            for obj in objs:
                key = f"{obj.__class__.__name__}.{obj.id}"
                res[key] = obj
        return res

    def new(self, obj):
        """add object to the current database session
        """
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current db session
        """
        self.__session.commit()

    def delete(self, obj=None):
        """delete from current db session if obj is not none
        """
        if obj:
            self.__session.delete(obj)

    def close(self):
        """call remove method on the private session attribute
        """
        self.__session.close()

    def drop(self, cls=None):
        """drop all tables
        """
        if cls:
            self.__session.query(cls).delete()

    def drop_all(self):
        """drop all tables
        """
        Base.metadata.drop_all(self.__engine)

    def rollback(self):
        """rollback all changes
        """
        self.__session.rollback()

    def get(self, cls, id):
        """get an object by class and id
        """
        if cls is None or id is None:
            return None
        obj = self.__session.get(cls, id)
        if obj:
            return obj
        return None

    def count(self, cls=None):
        """count the number of objects in storage
        """
        if cls is None:
            return len(self.all())
        return len(self.all(cls))
