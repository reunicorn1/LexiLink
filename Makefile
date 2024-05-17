# Purpose: Makefile for lexi-app
# Methods: start, stop, setup_database, create_data
# Author: Mohamed Elfadil

.PHONY: start stop
backend:
	tmux new-session -d -s lexi-app -n backend 'source venv/bin/activate && flask run'

start:
	tmux new-session -d -s lexi-app -n frontend 'cd lexi-app && npm run dev'
	tmux new-window -d -t lexi-app: -n backend 'source venv/bin/activate && flask run'

stop:
	tmux kill-session -t lexi-app
setup_database:
	cat sql_utils/lexilink_dev_db.sql | mysql

create_data:
	rm -rf mentor.json student.json
	python3 create_n_mentors.py
	python3 create_n_students.py
