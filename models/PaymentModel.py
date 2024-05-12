#!/usr/bin/python3
'''Module defines `PaymentModel` class'''

from sqlalchemy import Column, String, Numeric, Enum, ForeignKey, DateTime
from models.BaseModel import BaseModel, Base, store
import datetime


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
        amount=(Column(Numeric(10, 2), nullable=False, default=0), 0),
        method=(Column(String(60), nullable=False, default='Wallet'),
                'Wallet'),
        status=(Column(Enum(*choices), nullable=False, default='Pending'),
                'Pending'),
        )
class PaymentModel(BaseModel, Base):
    '''PaymentModel class.

    Atrrs:
        __tablename__(str) : table name
        mentor_id(str) : mentor id (FK)
        student_id(str) : student id (FK)
        date(datetime object) : date of payment (default=datetime.datetime.utcnow())
        amount(float) : total amount paid for the session (default=0)
        method(str) : payment method (default='Wallet')
        status(str): payment status (default='Pending')
    '''
    __tablename__ = 'Payment_Model'

#     def __init__(self, **kwargs):
#         super().__init__()
#         if db:
#             __table_args__ = (
#                               ForeignKeyConstraint(['student_id'],
#                                                    ['Student_Model.id']),
#                               ForeignKeyConstraint(['mentor_id'],
#                                                    ['Mentor_Model.id']),
#                               PrimaryKeyConstraint('student_id',
#                                                    'mentor_id',
#                                                    )
#                               )
#         for key, value in kwargs.items():
#                 setattr(self, key, value)

#         self.save()