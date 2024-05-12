#!/usr/bin/python3
'''Module defines `StudentModel` class'''

from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey
from models.UserModel import UserModel
from models.BaseModel import Base, store


class StudentFavoriteMentors(Base):
    '''StudentFavoriteMentors class Association Table.
        Relates students to their favorite mentors.
        Atrrs:
        __tablename__(str): table name
        student_id(str): student id (FK)
        mentor_id(str): mentor id (FK)
    '''
    __tablename__ = 'Student_Favorite_Mentors'

    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    mentor_id = Column(String(60), ForeignKey('Mentor_Model.id'),
                       primary_key=True)


class StudentSession(Base):
    '''StudentMentorSession class Association Table.
        Relates students to their sessions.
        Atrrs:
        __tablename__(str): table name
        student_id(str): student id (FK)
        session_id(str): session id (FK)
    '''
    __tablename__ = 'Student_Session'
    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    session_id = Column(String(60), ForeignKey('Session_Model.id'),
                        primary_key=True)




@store(
       'favorite_mentors', 'sessions',
       proficiency=(Column(String(255), nullable=False), ''),
       completed_lessons=(Column(Integer, nullable=False, default=0), 0),
       role=(Column(String(10), nullable=False, default='student'),
             'student'),
       favorite_mentors=(relationship('MentorModel',
                                      secondary='Student_Favorite_Mentors',
                                      cascade='all',
                                      single_parent=True,
                                      lazy='dynamic'), []),
        sessions=(relationship('SessionModel',
                                      secondary='Student_Session',
                                      cascade='all, delete-orphan',
                                      single_parent=True,
                                      lazy='dynamic'), []),
       )
class StudentModel(UserModel, Base):
    '''StudentModel class.

    Atrrs:
        __tablename__(str): table name
        proficiency(str): student proficiency
        completed_lessons(int): number of completed lessons (default=0)
        role(str): user role (default='student')
        favorite_mentors(relationship): relationship with `MentorModel`. 
                    Student's list of favorite mentors
        sessions(relationship): relationship with `SessionModel`
                    Student's list of sessions
    '''
    __tablename__ = 'Student_Model'
