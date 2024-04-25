'''Module defines `StudentModel` class'''

from models.BaseModel import BaseModel, Base, store
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Integer, ForeignKey




@store(
        jwt=(Column(String(255), nullable=False), ''),
        )
class BlockListModel(BaseModel, Base):
    '''StudentModel class.

    Atrrs:
        proficiency(str):
        completed_lessons(int):
        favorite_mentors(str):
    '''
    __tablename__ = 'BlockList_Model'
