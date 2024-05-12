#!/usr/bin/python3
'''Module defines `SessionModel` class'''
import datetime
from sqlalchemy import (
                        Column,
                        String,
                        Enum,
                        ForeignKey,
                        DateTime,
                        Time,
                        )
from sqlalchemy.orm import relationship
from models.BaseModel import BaseModel, Base, store, db

choices = ('Pending', 'Approved', 'Declined', 'Completed', 'Cancelled')


@store(
        # 'reviews',
        'payment',
        mentor_id=(Column(String(60), ForeignKey('Mentor_Model.id'),
                   nullable=False), ''),
        student_id=(Column(String(60), ForeignKey('Student_Model.id'),
                    nullable=False), ''),
        date=(Column(DateTime, nullable=False,
                     default=datetime.datetime.utcnow()),
              datetime.datetime.utcnow()),
        time=(Column(Time, nullable=False, default=datetime.time(0, 0)),
              datetime.time(0, 0)),
        duration=(Column(Time, nullable=False,
                         default=datetime.time(0, 0)),
                   datetime.time(0, 0)),
        status=(Column(Enum(*choices), nullable=False, default='Pending'),
                'Pending'),
        payment=relationship('PaymentModel', backref='session',
                             cascade='all, delete-orphan', uselist=False,
                             lazy='dynamic'),
        mentor_token=(Column(String(255), nullable=True), ''),
        student_token=(Column(String(255), nullable=True), ''),
        )

class SessionModel(BaseModel, Base):
    '''SessionModel class.

    Atrrs:
        __tablename__ (str): table name
        mentor_id (str): mentor id (FK)
        student_id (str): student id (FK)
        date (datetime object): date of session (default=datetime.datetime.utcnow())
        time (time object): time of session (default=datetime.time(0, 0))
        duration (time object): duration of session (default=datetime.time(0, 0))
        status (str): session status (default='Pending')
        payment (relationship): relationship with `PaymentModel`
        mentor_token (str): mentor token
        student_token (str): student token
    '''
    __tablename__ = 'Session_Model'

    # def __init__(self, **kwargs):
    #     super().__init__(**kwargs)
    #     if db:
    #         __table_args__ = (
    #                           ForeignKeyConstraint(['student_id'],
    #                                                ['Student_Model.id']),
    #                           ForeignKeyConstraint(['mentor_id'],
    #                                                ['Mentor_Model.id']),
    #                           PrimaryKeyConstraint('student_id',
    #                                                'mentor_id',
    #                                                )
    #                             )
        # for key, value in kwargs.items():
        #     setattr(self, key, value)
        # self.save()
