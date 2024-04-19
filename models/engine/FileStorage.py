#!/usr/bin/python3
'''This Module defines file storage class'''

from json import loads, dumps


class FileStorage:
    ''' FileStorage class.

    Attrs:
        __file_path(str): path to the JSON file
        __objects(dictionary): empty but will store all objects
            by <class name>.id
    '''

    __file_path = 'file.json'
    __objects = {}

    def all(self, cls=None):
        '''Returns the dictionary `__objects`'''
        if not cls:
            return self.__objects
        return {k: v for k, v in self.__objects.items()
                if isinstance(v, cls)}

    def new(self, obj):
        '''Sets in __objects the obj with key <obj class name>.id'''
        if not obj:
            return
        key = obj.__class__.__name__ + '.' + obj.id
        self.__objects[key] = obj

    def save(self):
        '''Serializes __objects to the JSON file'''

        with open(self.__file_path, 'w', encoding='utf-8') as file:
            file.write(dumps(self.__objects,
                             default=lambda obj: obj.to_dict()))

    def reload(self):
        '''Deserializes the JSON file to __objects'''
        try:
            with open(self.__file_path, 'r', encoding='utf-8') as file:
                from models.base_model import BaseModel

                cls = {
                        'BaseModel': BaseModel,
                        # 'User': User,
                      }
                for k, v in loads(file.read()).items():
                    self.__objects[k] = cls[v['__class__']](**v)
        except Exception:
            pass

    def delete(self, obj=None):
        """Delete obj from __objects if it’s inside"""
        if not obj:
            return
        key = f"{obj.__class__.__name__}.{obj.id}"
        if key in self.__objects:
            del self.__objects[key]

    def close(self):
        """
        Call reload method for deserializing the JSON file to objects
        """
        self.reload()

    def get(self, cls, id):
        """
        Get an object by class and id
        """
        if cls is None or id is None:
            return None
        key = f"{cls.__name__}.{id}"
        obj = self.__objects.get(key)
        if obj:
            return obj
        return None

    def count(self, cls=None):
        """
        Count the number of objects in storage
        """
        if cls is None:
            return len(self.all())
        return len(self.all(cls))
