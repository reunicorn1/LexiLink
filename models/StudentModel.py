#!/usr/bin/python3
'''Module defines `User` class'''

from models.UserModel import UserModel
from models.BaseModel import Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer


@store(
        # 'reviews',
        proficiency=(Column(String(255), nullable=False), ''),
        completed_lessons=(Column(Integer, nullable=False), 0),
        favorite_mentors=(Column(String(255), nullable=False), ''),
        )
class StudentModel(UserModel, Base):
    '''StudentModel class.

    Atrrs:
        proficiency(str):
        completed_lessons(int):
        favorite_mentors(str):
    '''
    __tablename__ = 'Student_Model'
