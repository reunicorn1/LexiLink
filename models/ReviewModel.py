#!/usr/bin/python3
'''Module defines `ReviewModel` class'''

from models.BaseModel import BaseModel, Base, store, db
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String,  Numeric, ForeignKey
from sqlalchemy.schema import ForeignKeyConstraint, PrimaryKeyConstraint


@store(
        # 'reviews',
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
        mentor_id: str
        student_id: str
        review_score: float
        description: str
    '''
    __tablename__ = 'Review_Model'


    def __init__(self):
        super().__init__()
        if db:
            __table_args__ = (
                    ForeignKeyConstraint(['student_id'], ['Student_Model.id']),
                    ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id']),
                    PrimaryKeyConstraint('student_id', 'mentor_id', 'date')
                    )
