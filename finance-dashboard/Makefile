# Shortcuts. DATA is your private workspace folder (default ./data).
DATA ?= data
PY ?= python3

setup:            ## install dependencies
	$(PY) -m pip install -e ".[dev]"
init:             ## create the workspace folders and config files
	$(PY) -m finance --data $(DATA) init
update:           ## import new statements and rebuild the dashboard
	$(PY) -m finance --data $(DATA) ingest && $(PY) -m finance --data $(DATA) build --open
review:           ## what is still uncategorized
	$(PY) -m finance --data $(DATA) review
demo:             ## build a dashboard from fake data
	$(PY) -m finance demo --open
test:
	$(PY) -m pytest -q
.PHONY: setup init update review demo test
