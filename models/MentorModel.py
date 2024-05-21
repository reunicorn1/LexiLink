#!/usr/bin/python3
'''Module defines `MentorModel` class'''

from models.UserModel import UserModel
from models.BaseModel import Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Numeric, Enum, ForeignKey, JSON


class StudentMentors(Base):
    '''StudentFavoriteMentors class Association Table.'''
    __tablename__ = 'Student_Mentors'
    student_id = Column(String(60), ForeignKey('Student_Model.id'),
                        primary_key=True)
    mentor_id = Column(String(60), ForeignKey('Mentor_Model.id'),
                       primary_key=True)


choices = ('Community', 'Professional')


@store(
        'students', 'sessions',
        expertise=(Column(String(3000), nullable=False), ''),
        bio=(Column(String(3000), nullable=True), ''),
        type=(Column(Enum(*choices), nullable=False, default='Community'),
              'Community'),
        price_per_hour=(Column(Numeric(precision=10, scale=2), nullable=True,
                        default=0), 0),
        availability=(Column(JSON, nullable=True, default=dict({
            "days": [],
            "startTime": "",
            "endTime": ""
            })), {}),
        demo_video=(Column(String(255), nullable=True), ''),
        role=(Column(String(10), nullable=False, default='mentor'), 'mentor'),
        students=(relationship('StudentModel',
                  secondary='Student_Mentors',
                  cascade='all, delete-orphan',
                  single_parent=True,
                  backref='mentors',
                  lazy='dynamic'), []),
        sessions=(relationship('SessionModel',
                                      backref='mentor',
                                      lazy='dynamic'), []),
        payments=(relationship('PaymentModel', backref='mentor',
                               lazy='dynamic'), []),
                  )

class MentorModel(UserModel, Base):
    '''MentorModel class.

    Atrrs:
        __tablename__(str): table name
        expertise(str): expertise of the mentor
        bio(str): personal bio of the mentor
        type(str): type of mentor (Community, Professional)
        price_per_hour(float): price per hour of the mentor's session
        availability(str): availability of the mentor,
                            days of the week, start and end time
        demo_video(str): embeded video link of the mentor
        role(str): role of the user (mentor)
        students(list): list of students associated with the mentor
        sessions(list): list of sessions associated with the mentor



    '''
    __tablename__ = 'Mentor_Model'
