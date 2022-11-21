from __future__ import annotations

from datetime import datetime
import json
import os
import sqlite3
from typing import Any, Callable

from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
PORT = os.getenv("PORT")
if PORT is not None:
    PORT = int(PORT)
else:
    PORT = 8000
CORS(app)

# set up database connection
con = sqlite3.connect("dva_database")
cur = con.cursor()


def getJsonFromQuery(query):
    res = con.execute(query)
    rows = res.fetchall()
    return jsonify(rows)


@app.route("/")
def hello():
    return "Hello, Backend World!"


def process_if_not_none(function: Callable[[str | None], Any], argument: str | None):
    if argument is None:
        return None

    return function(argument)


def handle_null(function: Callable[[str], Any]):
    def _func(argument: str | None):
        return process_if_not_none(function, argument)

    return _func


def request_get(arg: str):
    return request.args.get(arg, None)


@handle_null
def as_str(arg: str):
    return arg


@handle_null
def as_date(arg: str):
    return datetime.fromisoformat(arg)


@handle_null
def as_bool(arg: str):
    return bool(int(arg))


@handle_null
def as_int(arg: str):
    return int(arg)


@handle_null
def as_float(arg: str):
    return float(arg)


@handle_null
def as_list(arg: str):
    return arg.split(" ")


@app.route("/api/getSummary")
def getSummary():
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    print(query)

    with open("./getSummaryDummy.json") as f:
        dummy = json.load(f)

    return dummy


# route to get avergae sentiments and number of posts grouped by platform and date
# start_date and end_date should be in yyyy-mm-dd format
# if no start date or end date specified by the user, use 2014-12-31 for start_date and 'now()' for end_date
# key_words should be a string of words separated by spaces
@app.route("/start_date/<start_date>/end_date/<end_date>/key_words/<key_words>")
def getSentiments(start_date, end_date, key_words):
    query = (
        "SELECT count(*) as num_posts, avg(sentiment) as avg_sentiment FROM posts where (date between "
        + start_date
        + " AND "
        + end_date
        + ")"
    )
    if key_words != "":
        query += " AND bodyText MATCH '" + key_words + "'"
    query += " GROUP BY platform, date"
    return getJsonFromQuery(query)


# route to get all of the significant_events table
@app.route("/events")
def getEvents():
    query = "SELECT * FROM significant_events"
    return getJsonFromQuery(query)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)
