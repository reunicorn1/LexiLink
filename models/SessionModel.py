#!/usr/bin/python3
'''Module defines `SessionModel` class'''

from models.BaseModel import BaseModel, Base, store, db
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Time, Interval
import datetime
from sqlalchemy.schema import ForeignKeyConstraint, PrimaryKeyConstraint


choices = ('Pending', 'Approved', 'Declined', 'Completed')
@store(
        # 'reviews',
        mentor_id=(Column(String(60), ForeignKey('Mentor_Model.id'),
                    nullable=False), ''),
        student_id=(Column(String(60), ForeignKey('Student_Model.id'),
                    nullable=False), ''),
        date=(Column(DateTime, nullable=False,
                     default=datetime.datetime.utcnow()),
                datetime.datetime.utcnow()),
        time=(Column(Time, nullable=False, default=datetime.time(0, 0)),
                datetime.time(0, 0)),
        duration=(Column(Interval, nullable=False,
                         default=datetime.timedelta(0)),
                    datetime.timedelta(0)),
        status=(Column(Enum(*choices), nullable=False, default='Pending'),
                'Pending'),
        )
class SessionModel(BaseModel, Base):
    '''SessionModel class.

    Atrrs:
        mentor_id: str
        student_id: str
        date: datetime
        time: time
        duration: interval
        status: str
    '''
    __tablename__ = 'Session_Model'

    def __init__(self):
        super().__init__()
        if db:
            __table_args__ = (
                    ForeignKeyConstraint(['student_id'], ['Student_Model.id']),
                    ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id']),
                    PrimaryKeyConstraint('student_id', 'mentor_id', 'date')
                    )
