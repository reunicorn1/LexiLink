.PHONY: start stop

start:
	tmux new-session -d -s lexi-app -n frontend 'cd lexi-app && npm run dev'
	tmux new-window -d -t lexi-app: -n backend 'source venv/bin/activate && flask run'

stop:
	tmux kill-session -t lexi-app

