#!/usr/bin/env python3
"""Entry point of the command interpreter
Defines `LEXILINKCommand` class that inherits from
`cmd.Cmd`
"""

import re
import cmd
import shlex
from json import loads
from json.decoder import JSONDecodeError
from models import storage
from models import db
from models.StudentModel import StudentModel
from models.MentorModel import MentorModel


class LEXILINKCommand(cmd.Cmd):
    """class LEXILINKCommand which acts as the console of the Lexilink project
    which is a command interpreter to manipulate data without visual
    interface.

    Attrs:
        prompt(str): prompt string
        cls(dict): dictionary of all the instances.
    """
    prompt = "(Lexilink) "
    cls = {'StudentModel': StudentModel,
           'MentorModel': MentorModel
           }

    patterns = {"all": re.compile(r'(.*)\.(.*)\((.*)\)'),
                # id, attribute, value
                "update": [re.compile(r'^(.+)\,(.+)\,(.+)$'),
                           re.compile(r'^[\'\"]?([^"]+)[\'\"]?\,\s*(\{.+\})$'),
                           re.compile(r"[\'\"](.*?)[\'\"]")]}

    def precmd(self, line) -> str:
        """parse command line and determine if reformatting is needed.
        Helps handle call to commands using Class.command("values"),
        By splitting it to match the format of the do_cmd
        Ex:
        $ update User <ID> <attribute> <value>
        $ User.update(<ID>, <attribute>, <value>)
        $ User.update(<ID>, {<attribute1>: <value1>, <attribute2>: <value2>})
        """
        # class.command(data)
        pattern = self.patterns
        args = pattern["all"].match(line)
        if args:
            arg_list = []
            arg_list.append(args.group(2))  # command
            arg_list.append(args.group(1))  # class
            arg_list.append(args.group(3))  # rest
            if arg_list[0] == "count":
                self.count(args.group(1))
                return ""
            if arg_list[0] == "update":
                # id, attribute, value
                uvp = pattern["update"][0]
                # id, {dict}
                udict = pattern["update"][1]
                clean = args.group(3).replace("'", '"')
                # id, {dict}
                uvp_match = udict.match(clean)
                res = arg_list[:2]
                if uvp_match and len(uvp_match.groups()) == 2:
                    try:
                        my_dict = loads(uvp_match.group(2))
                        for k, v in my_dict.items():
                            # command class id attribute value
                            self.onecmd(" ".join(res +
                                                 [uvp_match.group(1),
                                                  '"' + str(k) + '"',
                                                  '"' + str(v) + '"']))
                        return ""
                    except JSONDecodeError:
                        pass
                else:
                    # id, attribute, value
                    uvp_match = uvp.match(clean)
                    if uvp_match and len(uvp_match.groups()) == 3:
                        res.extend(uvp_match.group().split(','))
                    else:
                        res.append(clean)
                    return " ".join(res)
            else:
                return " ".join(arg_list)
        return line

    def emptyline(self):
        """Handle empty line by doing nothing"""
        return False

    def do_quit(self, _):
        """Quit command to exit the program"""
        return True

    def do_EOF(self, _):
        """End-of-file"""
        return True

    def do_create(self, line):
        """
        Creates a new instance of the class provided, save it into
        a JSON file, and prints the id
        """

        line = line.split(" ")
        print(line)

        if not line[0]:
            print("** class name missing **")
            return
        if line[0] not in self.cls:
            print("** class doesn't exist **")
            return
        obj = self.cls[line[0]]()
        for i in range(1, len(line)):
            if '=' not in line[i]:
                continue
            k, v = line[i].split('=')
            if hasattr(obj, k) and not db:
                cast = type(getattr(obj, k))
                v = cast(v)
            if isinstance(v, str) and v[0] == '"':
                v = v.replace('_', ' ').replace('"', '')
            if "password" in k:
                setattr(obj, "hashed_password", v)
            else:
                setattr(obj, k, v)
        obj.save()
        print(obj.id)

    def do_show(self, line):
        """
        Prints the string representation of an instance based on
        the class and id values
        """

        line = line.split(" ")
        if not len(line[0]):
            print("** class name missing **")
            return
        elif line[0] not in self.cls:
            print("** class doesn't exist **")
            return
        elif len(line) == 1:
            print("** instance id missing **")
            return
        key = "{}.{}".format(line[0], line[1])
        obj_dict = storage.all()
        if key not in obj_dict:
            print("** no instance found **")
            return
        print(obj_dict[key])

    def do_destroy(self, line):
        """Deletes an instance based on class name and id"""
        line = line.split(" ")
        if not len(line[0]):
            print("** class name missing **")
            return
        elif line[0] not in self.cls:
            print("** class doesn't exist **")
            return
        elif len(line) == 1:
            print("** instance id missing **")
            return
        key = "{}.{}".format(line[0], line[1])
        obj_dict = storage.all()
        if key not in obj_dict:
            print("** no instance found **")
            return
        obj_dict.pop(key)
        storage.save()

    def do_all(self, line):
        """
        Prints all string representation of all instances based or
        not on the class name
        """
        #
        line = line.split(" ")
        if len(line[0]) and line[0] not in self.cls:
            print("** class doesn't exist **")
            return
        if line[0] in self.cls:
            obj_dict = storage.all(self.cls[line[0]])
        else:
            obj_dict = storage.all()
        if not len(line[0]):
            print(list(map(lambda x: str(x), obj_dict.values())))
            return
        cls_list = [str(v) for k, v in obj_dict.items() if line[0] in k]
        print(cls_list)

    def do_update(self, line):
        """
        Updates an instance based on the class name and id by adding
        or updating attributes
        """
        line = shlex.split(line)
        if not line:
            print("** class name missing **")
            return
        elif line[0] not in self.cls:
            print("** class doesn't exist **")
            return
        elif len(line) == 1:
            print("** instance id missing **")
            return
        key = "{}.{}".format(line[0], line[1])
        obj_dict = storage.all()
        if key not in obj_dict:
            print("** no instance found **")
            return
        if len(line) == 2:
            print("** attribute name missing **")
            return
        if len(line) == 3:
            print("** value missing **")
            return
        obj = obj_dict[key]
        if hasattr(obj, line[2]):
            type_attr = type(getattr(obj, line[2]))
            import sqlalchemy.orm as orm
            if type_attr is orm.dynamic.AppenderQuery:
                if line[0] == 'StudentModel':
                    getattr(obj, line[2]).append(storage.get(MentorModel,
                                                             line[3]))
                elif line[0] == 'MentorModel':
                    getattr(obj, line[2]).append(storage.get(StudentModel,
                                                             line[3]))
            else:
                line[3] = type_attr(line[3])
                setattr(obj, line[2], line[3])
        obj.save()
        storage.save()

    def do_count(self, line):
        """Retrives the number of instances of a class"""
        count = 0
        obj_dict = storage.all()
        for key in obj_dict:
            if line in key:
                count += 1
        print(count)

    def do_drop(self, line):
        """Drops all instances of a class"""
        obj_dict = storage.all()
        for key in obj_dict:
            if line in key:
                storage.delete(obj_dict[key])
        storage.save()

    def count(self, arg) -> None:
        """Count all occurences of class instances
        Ex:
        $ count BaseModel
        $ BaseModel.count()
        """
        args = shlex.split(arg)

        if not self.validate_cls(args):
            return
        res = 0
        if len(args) > 0:
            for k in storage.all():
                if args[0] == k.split(".")[0]:
                    res += 1
        print(res)

    def do_drop_all(self):
        """Drops all instances of all classes"""
        if db:
            storage.drop_all()
            storage.save()

    def validate_cls(self, args) -> bool:
        """validate class creation
        Checks if class name is provide and it exists
        """
        if len(args) < 1:
            print("** class name missing **")
            return False
        if args[0] not in self.cls:
            print("** class doesn't exist **")
            return False
        return True

    def validate_id(self, args) -> bool:
        """validate id of class instance
        Checks if id is provide and it exists
        """
        if len(args) < 2:
            print("** instance id missing **")
            return False
        instance_id = args[0] + "." + args[1]
        if instance_id not in storage.all():
            print("** no instance found **")
            return False
        return True


if __name__ == '__main__':
    LEXILINKCommand().cmdloop()
