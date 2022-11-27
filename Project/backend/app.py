from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from typing import Any, Callable

import api
import dummy
from dotenv import load_dotenv
from flask import Flask, jsonify, request
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


def getJsonFromQuery(query: str):
    res = con.execute(query)
    rows = res.fetchall()
    return jsonify(rows)


@app.route("/")
def hello():
    return "Hello, Backend World!"


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


USE_DUMMY = True

if USE_DUMMY:
    exported = dummy
else:
    exported = api

app.route("/api/getPlatformFrequencies")(exported.get_platform_freq)
app.route("/api/getBagOfWords")(exported.get_bag_of_words)
app.route("/api/getSummary")(exported.get_summary)
app.route("/api/getBodyText")(exported.get_body_text)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)
