# Purpose: Makefile for lexi-app
# Methods: start, stop, setup_database, create_data
# Author: Mohamed Elfadil

.PHONY: start stop logs setup_database create_data create_n_mentors create_n_students
frontend:
	tmux new-session -d -s lexi-app -n frontend 'cd lexi-app && npm run dev'

backend:
	tmux new-session -d -s lexi-app -n backend 'source venv/bin/activate && flask run'
	make logs

start:
	tmux new-session -d -s lexi-app -n frontend 'cd lexi-app && npm run dev'
	tmux new-window -d -t lexi-app: -n backend 'source venv/bin/activate && flask run'
	make logs

restart:
	tmux kill-session -t lexi-app
	make start

stop:
	tmux kill-session -t lexi-app

setup_database:
	cat sql_utils/lexilink_dev_db.sql | mysql

# To view the most recent logs using tail -f.
# logs/app_log{}.log is the log file for the backend
# where {} is the date in the format YYYY-MM-DD
# if the session lexi-app is notrunning the logs must not be shown
logs:
	tmux new-window -d -t lexi-app: -n logs 'tail -f logs/app_log_$(shell date +\%Y-\%m-\%d).log'

create_data:
	rm -rf mentor.json student.json
	python3 create_n_mentors.py
	python3 create_n_students.py

create_n_mentors:
	rm -rf mentor.json
	python3 create_n_mentors.py 100

create_n_students:
	rm -rf student.json
	python3 create_n_students.py 100
