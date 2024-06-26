#!/usr/bin/python3
"""db_storage module"""
from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker, scoped_session
from os import getenv
from models.BaseModel import Base
from models.StudentModel import StudentModel
from models.MentorModel import MentorModel
from models.PaymentModel import PaymentModel
from models.SessionModel import SessionModel
from models.ReviewModel import ReviewModel
from models.BlockList import BlockListModel


env = ['LEXILINK_MYSQL_USER', 'LEXILINK_MYSQL_PWD',
       'LEXILINK_MYSQL_HOST', 'LEXILINK_MYSQL_DB',
       'LEXILINK_TYPE_STORAGE', 'LEXILINK_MYSQL_ENV',
       'LEXILINK_MYSQL_DIALECT', 'LEXILINK_MYSQL_DRIVER']

classes = {'StudentModel': StudentModel, 'MentorModel': MentorModel,
           'PaymentModel': PaymentModel, 'SessionModel': SessionModel,
           'BlockListModel': BlockListModel}


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
        rollback(self)
        close(self)
        drop(self, cls=None)
        drop_all(self)
        get(self, cls, id)
        count(self, cls=None)
        get_uri(self)
        find_by(self, cls, **kwargs)
        create(self, cls, **kwargs)
        query(self, cls, page=1, per_page=10, **kwargs)
        query_all(self, cls, **kwargs)
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
        self.__engine = create_engine('{}+{}://{}:{}@{}/{}'
                                      .format(MYSQL['DIALECT'],
                                              MYSQL['DRIVER'],
                                              MYSQL['USER'], MYSQL['PWD'],
                                              MYSQL['HOST'], MYSQL['DB']),
                                      pool_pre_ping=True)
        if MYSQL['ENV'] == 'test':
            Base.metadata.drop_all(self.__engine)

    def reload(self):
        """create all tables in the database
        """
        Base.metadata.create_all(self.__engine)
        self.__session = scoped_session(sessionmaker(bind=self.__engine,
                                        expire_on_commit=False))

    def all(self, cls=None):
        """query on the current database session
        """
        res = {}
        objs = []
        if isinstance(cls, str):
            cls = classes[cls]
        if cls:
            objs = self.__session.query(cls).all()
        else:
            for c in classes.values():
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

    def rollback(self):
        """rollback all changes of the current db session
        """
        self.__session.rollback()

    def close(self):
        """call remove method on the private session attribute
        """
        self.__session.remove()

    def drop(self, cls=None):
        """drop all tables
        """
        if cls:
            self.__session.query(cls).delete()

    def drop_all(self):
        """drop all tables
        """
        Base.metadata.drop_all(self.__engine)

    def clear_all_tables(self):
        """clear all tables
        """
        for table in reversed(Base.metadata.sorted_tables):
            self.__session.execute(table.delete())
        self.__session.commit()
        Base.metadata.create_all(self.__engine)

    def get(self, cls, id):
        """get an object by class and id
        """
        if cls is None or id is None:
            return None
        if isinstance(cls, str):
            cls = classes[cls]
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

    def get_uri(self):
        """get the uri
        """
        return self.__engine.url

    def find_by(self, cls, **kwargs):
        """find by key value pair
        Usage: find_by('StudentModel', email='email')
        """
        if cls is None or not kwargs:
            return None
        if isinstance(cls, str):
            cls = classes[cls]
        obj = self.__session.query(cls).filter_by(**kwargs).first()
        if obj:
            return obj
        return None

    def create(self, cls, **kwargs):
        """create an object
        Usage: create('StudentModel', **kwargs)
        """
        if cls is None or not kwargs:
            return None
        if isinstance(cls, str):
            cls = classes[cls]

        obj = cls(**kwargs)
        if 'password' in kwargs:
            obj.hashed_password = obj.password
        obj.save()

        return obj

    def query(self, cls, page=1, per_page=10, **kwargs):
        """Query by key-value pair with pagination.
        Usage: query('StudentModel', page=1, per_page=10, email='email')
        """
        if cls is None:
            return None
        if isinstance(cls, str):
            cls = classes[cls]
        if not kwargs:
            query_result = (
                self.__session.query(cls)
                .limit(per_page)  # Limit the number of results per page
                .offset((page - 1) * per_page)  # Offset for pagination
                .all()
            )
            return query_result
        query_result = (
            self.__session.query(cls)
            .filter_by(**kwargs)
            .limit(per_page)  # Limit the number of results per page
            .offset((page - 1) * per_page)  # Offset for pagination
            .all()
        )
        return query_result

    def query_all(self, cls, **kwargs):
        """Query by key-value pair with pagination.
        Usage: query('StudentModel', page=1, per_page=10, email='email')
        """
        if cls is None:
            return None
        if isinstance(cls, str):
            cls = classes[cls]
        if not kwargs:
            query_result = (
                self.__session.query(cls)
                .all()
            )
            return query_result
        min_price = kwargs.pop('min_price', None)
        max_price = kwargs.pop('max_price', None)

        query = self.__session.query(cls).filter_by(**kwargs)
        if min_price is not None and max_price is not None:
            query = query.filter(and_(cls.price_per_hour >= min_price,
                                      cls.price_per_hour <= max_price))
        query_result = query.all()

        return query_result
