#!/usr/bin/env python3
import random
import requests
from faker import Faker
import json

fake = Faker()


def random_proficiency():
    """ proficiency in teaching english """
    return random.choice(["Beginner", "Intermediate", "Advanced"])

def random_language():
    return random.choice(["English", "Mandarin Chinese", "Hindi",
             "Spanish", "French", "Standard Arabic",
             "Bengali", "Portuguese", "Russian", "Urdu",
             "Indonesian", "Standard German", "Japanese",
             "Nigerian Pidgin", "Egyptian Spoken Arabic",
             "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"])

def random_languages():
    languages = set()
    for i in range(random.randint(2, 5)):
        languages.add(random_language())
    return list(languages)
def random_student():
    """
 {
  "email": "string",
  "username": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "country": "string",
  "nationality": "string",
  "first_language": "string",
  "other_languages": "string",
  "profile_picture": "string",
  "proficiency": "string"
}"""
    return {
        "email": fake.email(),
        "username": fake.user_name(),
        "password": "password",
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "country": fake.country(),
        "nationality": fake.country(),
        "first_language": random_language(),
        "other_languages": random_languages(),
        "profile_picture": fake.image_url(),
        "is_verified": True,
        "proficiency": random_proficiency(),
        "is_verified": True,
        "user_type": "student"
        }


def register_student_with_mentor(student_email,
                                 student_password, mentor_username):
    """
    make put request to register a student to a mentor:

    http://127.0.0.1:5000/student/mentors/favorites/
    """
    # login as student
    # url="https://lexilink.pals.com.np/api"
    url="http://127.0.0.1:5000/api"
    response = requests.post(f"{url}/auth/login/",
                             json={"email": student_email,
                                   "password": student_password,
                                   "user_type": "student"})
    if response.status_code == 200:
        access_token = response.json()["access_token"]
        response = requests.post(
                        f"{url}/student/mentors/favorites/",
                        json={"mentor": mentor_username},
                        headers={"Authorization":
                                 f"Bearer {access_token}"})
        if response.status_code == 200:
            print(f"{student_email} registered with {mentor_username}")
        else:
            print(f"Error: {response.json()}")


def create_n_students(n):
    """
    make post request to create 100 students to:
    http://127.0.0.1:5000/mentor/signup/
    content-type: application/json
    """
    # get mentors
    # url="https://lexilink.pals.com.np/api"
    url="http://127.0.0.1:5000/api"
    mentors_response = requests.get(f"{url}/mentor/all?page=1")
    if mentors_response.status_code == 200:
        mentors = mentors_response.json()["mentors"]
    else:
        print(f"Error: {mentors_response.json()}")
        return
    for _ in range(n):
        student = random_student()
        response = requests.post(f"{url}/auth/signup/",
                                 json=student)
        if response.status_code != 201:
            print(f"Error: {response.json()}")
            continue
        register_student_with_mentor(student["email"], student["password"],
                                     random.choice(mentors)["username"])
        if response.status_code == 200:
            with open("student.json", "a+") as f:
                json.dump(student, f)


if __name__ == "__main__":
    from sys import argv
    if len(argv) == 2:
        create_n_students(int(argv[1]))
    else:
        create_n_students(100)
