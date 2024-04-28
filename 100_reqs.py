#!/usr/bin/python3
import requests

url = 'http://127.0.0.1:5000/mentor/all'

for i in range(100):
    response = requests.get(url)

