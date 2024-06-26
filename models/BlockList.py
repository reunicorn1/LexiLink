'''Module defines `StudentModel` class'''

from models.BaseModel import BaseModel, Base, store
from sqlalchemy import Column, String


@store(
       jwt=(Column(String(1000), nullable=False), ''),
       type=(Column(String(1000), nullable=False), ''),
       )
class BlockListModel(BaseModel, Base):
    '''StudentModel class.

    Atrrs:
        __tablename__ (str): table name
        jwt (str): jwt_token value
        type (str): type of token (access, refresh)
    '''
    __tablename__ = 'BlockList_Model'
