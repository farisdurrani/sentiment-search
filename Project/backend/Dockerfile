FROM python:3.7
ADD . /code
WORKDIR /code
RUN apt-get install build-essential python3 python3-dev
RUN pip install -r requirements.txt
CMD gunicorn -w 4 app:app --reload -t 9999999
