#!/usr/bin/env python3
from flask import Blueprint, render_template, redirect, url_for, request, session, jsonify
from models import storage
from models.StudentModel import StudentModel
from flask_login import login_user, logout_user, login_required
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.v1.views import app, login_manager, jwt, db
from api.v1.forms import StudentForm, LoginForm
import requests

auth = Blueprint('auth', __name__)



@login_manager.user_loader
def load_user(email):
    from models.StudentModel import StudentModel
    return storage.find_by(StudentModel, email=email)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # Perform user authentication and obtain JWT token
    error = None
    form = LoginForm()
    print("we are here")
    print(form.email.data)
    print(form.password.data)

    user = load_user(form.email.data)
    if user and user.password == form.password.data:
        jwt_token = create_access_token(identity=user.email)
        login_user(user)
        print("valid:" + jwt_token)
        return jsonify(access_token=jwt_token), 200
    else:
        error = 'Invalid email or password. Please try again.'
    return render_template('login.html', form=form, error=error)


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    form = StudentForm()
    response = requests.get("https://restcountries.com/v3.1/all?fields=name,demonyms")
    countries = response.json()
    # make list of sorted countries
    country_list = sorted([country['name']['common'] for country in countries])
    nationality_list = sorted([country['demonyms']['eng']['m'] for country in countries])
    form.country.choices = country_list
    form.nationality.choices = nationality_list

    if form.validate_on_submit():
        user = StudentModel(
            email=form.email.data,
            password=form.password.data,
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            country=form.country.data,
            nationality=form.nationality.data,
            first_language=form.first_language.data,
            other_languages=form.other_languages.data,
            profile_picture=form.profile_picture.data,
            proficiency=form.proficiency.data
        )
        user.save()
        login_user(user)
        return redirect(url_for('auth.login'), 200)
    return render_template('signup.html', form=form)

@auth.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@auth.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@auth.route('/profile/', methods=['GET', 'POST'])
@login_required
@jwt_required()
def profile():
    jwt_token = request.args.get('jwt_token')
    print(jwt_token)
    headers = {
            'Authorization': f'Bearer {jwt_token}'
    }
    response = requests.get('http://localhost:5000/verify-token', headers=headers)
    if response.status_code != 200:
        return redirect(url_for('auth.login'))
    return render_template('profile.html')
