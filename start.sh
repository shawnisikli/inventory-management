#!/bin/bash
pip install -r requirements.txt
gunicorn backend:app
