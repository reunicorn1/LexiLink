from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, IntegerField, DecimalField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError, NumberRange
from models import storage


class StudentForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    first_name = StringField('First Name', validators=[DataRequired(), Length(max=128)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(max=128)])
    country = SelectField('Country', validators=[DataRequired(), Length(max=128)])
    nationality = SelectField('Nationality', validators=[DataRequired(), Length(max=128)])
    first_language = StringField('First Language', validators=[DataRequired(), Length(max=128)])
    other_languages = StringField('Other Languages')
    profile_picture = StringField('Profile Picture')
    proficiency = StringField('Proficiency', validators=[DataRequired(), Length(max=255)])

    def validate_email(self, email):
        user = storage.find_by("StudentModel", email=email.data)
        if user:
            raise ValidationError('That email is taken. Please choose a different one.')

    def validate_password(self, password):
        if len(password.data) < 6:
            raise ValidationError('Password must be at least 6 characters long.')

class MentorForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6), EqualTo('confirm_password', message='Passwords must match')])
    first_name = StringField('First Name', validators=[DataRequired(), Length(max=128)])
    last_name = StringField('Last Name', validators=[DataRequired(), Length(max=128)])
    # make country a select field
    country = SelectField('Country', validators=[DataRequired(), Length(max=128)])
    nationality = SelectField('Nationality', validators=[DataRequired(), Length(max=128)])
    first_language = StringField('First Language', validators=[DataRequired(), Length(max=128)])
    other_languages = StringField('Other Languages')
    profile_picture = StringField('Profile Picture')
    expertise = StringField('Expertise', validators=[DataRequired(), Length(max=255)])
    bio = StringField('Bio')
    type = SelectField('Type', choices=['Community', 'Professional'], validators=[DataRequired()])
    price_per_hour = DecimalField('Price Per Hour', validators=[NumberRange(min=0)])
    availability = StringField('Availability')
    demo_video = StringField('Demo Video')

    def validate_email(self, email):
        user = storage.find_by("MentorModel", email=email.data)
        if user:
            raise ValidationError('That email is taken. Please choose a different one.')

    def validate_password(self, password):
        if len(password.data) < 6:
            raise ValidationError('Password must be at least 6 characters long.')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')


    def validate_password(self, password):
        if len(password.data) < 6:
            raise ValidationError('Password must be at least 6 characters long.')
