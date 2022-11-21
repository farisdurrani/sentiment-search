FROM python:3.7
ADD . /code
WORKDIR /code
RUN apt-get install build-essential python3 python3-dev
RUN pip install -r requirements.txt
CMD uwsgi --socket 0.0.0.0:8000 --protocol=http -w app:app
