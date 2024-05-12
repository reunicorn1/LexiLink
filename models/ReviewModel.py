#!/usr/bin/python3
'''Module defines `ReviewModel` class
    currently not in use
'''

from models.BaseModel import BaseModel, Base, store, db
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String,  Numeric, ForeignKey
from sqlalchemy.schema import ForeignKeyConstraint, PrimaryKeyConstraint


@store(
        mentor_id=(Column(String(60), ForeignKey('Mentor_Model.id'),
                   nullable=False), ''),
        student_id=(Column(String(60), ForeignKey('Student_Model.id'),
                    nullable=False), ''),
        review_score=(Column(Numeric(10, 2), nullable=False, default=0), 0),
        description=(Column(String(3000), nullable=False, default=''), ''),
        )
class ReviewModel(BaseModel, Base):
    '''ReviewModel class.

    Atrrs:
        __tablename__ (str): table name
        mentor_id (str): mentor id (FK)
        student_id (str): student id (FK)
        review_score (float): review score (default=0)
        description (str): review description (default='')
    '''
    __tablename__ = 'Review_Model'

    def __init__(self):
        super().__init__()
        if db:
            __table_args__ = (
                              ForeignKeyConstraint(['student_id'],
                                                   ['Student_Model.id']),
                              ForeignKeyConstraint(['mentor_id'],
                                                   ['Mentor_Model.id']),
                              PrimaryKeyConstraint('student_id',
                                                   'mentor_id',
                                                   'date')
                              )
