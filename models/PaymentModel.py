#!/usr/bin/python3
'''Module defines `PaymentModel` class'''

from models.BaseModel import BaseModel, Base, store, db
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Numeric, Enum, ForeignKey, DateTime
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
        amount=(Column(Numeric(10, 2), nullable=False, default=0), 0),
        method=(Column(String(60), nullable=False, default='Wallet'),
                'Wallet'),
        status=(Column(Enum(*choices), nullable=False, default='Pending'),
                'Pending'),
        )
class PaymentModel(BaseModel, Base):
    '''PaymentModel class.

    Atrrs:
        mentor_id: str
        student_id: str
        date: datetime
        amount: float
        method: str
        status: str
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