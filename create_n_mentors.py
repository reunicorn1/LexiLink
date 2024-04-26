#!/usr/bin/python3
import random
import string
import requests
from faker import Faker
import json

fake = Faker()


def random_type():
    return random.choice(["Community", "Professional"])


def random_availability():
    return random.choice(["Morning", "Afternoon", "Evening", "Night"])


def random_expertise():
    """ expertise in teaching english """
    return random.choice(["IELTS", "TOEFL", "TOEIC",
                          "Business English", "General English"])


def random_mentor():
    """
    {
        "email": "string1",
        "username": "string1",
        "password": "string",
        "first_name": "string",
        "last_name": "string",
        "country": "string",
        "nationality": "string",
        "first_language": "string",
        "other_languages": "string",
        "profile_picture": "string",
        "expertise": "string",
        "price_per_hour": 0,
        "availability": "string",
        "type": "Community",
        "bio": "string",
        "demo_video": "string"
    }
    """
    return {
            "email": fake.email(),
            "username": fake.user_name(),
            "password": "password",
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "country": fake.country(),
            "nationality": fake.country(),
            "first_language": fake.language_code(),
            "other_languages": fake.language_code(),
            "profile_picture": fake.image_url(),
            "expertise": random_expertise(),
            "price_per_hour": fake.random_int(min=10, max=100),
            "availability": random_availability(),
            "type": random_type(),
            "bio": fake.text(),
            "demo_video": fake.url()
            }


def create_n_mentors(n):
    """
    make post request to create 100 mentors to:
    http://127.0.0.1:5000/mentor/signup/
    content-type: application/json
    """
    for _ in range(n):
        mentor = random_mentor()
        response = requests.post("http://127.0.0.1:5000/mentor/signup/",
                                 json=mentor)
        if response.status_code == 200:
            with open("mentor.json", "a+") as f:
                json.dump(mentor, f)


if __name__ == "__main__":
    from sys import argv
    if len(argv) == 2:
        create_n_mentors(int(argv[1]))
    else:
        create_n_mentors(n=2)
