#!/usr/bin/env python3
import random
import requests
from faker import Faker
import json

fake = Faker()


def random_type():
    return random.choice(["Community", "Professional"])


def random_availability():
    days = set()
    for i in range(random.randint(1, 7)):
        days.add(random.choice(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]))
    days = list(days)
    availability = {
            "days": days,
            "startTime": random.choice(["08:00", "09:00", "10:00", "11:00"]),
            "endTime": random.choice(["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"])
            }
    return availability


def random_expertise():
    """ expertise in teaching english """
    return random.choice(["IELTS", "TOEFL", "TOEIC",
                          "Business English", "General English"])

def random_language():
    return random.choice(["English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic", "Bengali", "Portuguese", "Russian", "Urdu", "Indonesian", "Standard German", "Japanese", "Nigerian Pidgin", "Egyptian Spoken Arabic", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese"])


def random_languages():
    languages = set()
    for i in range(random.randint(1, 5)):
        languages.add(random_language())
    return list(languages)

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
            "first_language": random_language(),
            "other_languages": random_languages(),
            "profile_picture": fake.image_url(),
            "expertise": random_expertise(),
            "price_per_hour": fake.random_int(min=10, max=100),
            "availability": random_availability(),
            "type": random_type(),
            "bio": fake.text(),
            # "demo_video": fake.url(),
            "demo_video": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "user_type": "mentor"
            }


def create_n_mentors(n):
    """
    make post request to create 100 mentors to:
    http://127.0.0.1:5000/mentor/signup/
    content-type: application/json
    """
    url="https://lexilink.pals.com.np/api"
    for _ in range(n):
        mentor = random_mentor()
        response = requests.post(f"{url}/auth/signup/",
                                 json=mentor)
        if response.status_code == 200:
            with open("mentor.json", "a+") as f:
                json.dump(mentor, f)


if __name__ == "__main__":
    from sys import argv
    if len(argv) == 2:
        create_n_mentors(int(argv[1]))
    else:
        create_n_mentors(n=100)
