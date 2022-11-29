from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime
from typing import Any, Callable

import database
import in_memory
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


@app.route("/")
def hello():
    return "Hello, Backend World!"


# route to get avergae sentiments and number of posts grouped by platform and date
# start_date and end_date should be in yyyy-mm-dd format
# if no start date or end date specified by the user, use 2014-12-31 for start_date and 'now()' for end_date
# key_words should be a string of words separated by spaces
# @app.route("/start_date/<start_date>/end_date/<end_date>/key_words/<key_words>")
# def get_sentiments(start_date, end_date, key_words):
#     query = sql_sentiments(start_date, end_date, key_words)
#     return database.json_from_query(query)


# @app.route("/sql/start_date/<start_date>/end_date/<end_date>/key_words/<key_words>")
# def sql_sentiments(start_date, end_date, key_words):
#     if key_words == "":
#         query = (
#             "SELECT count(*) AS num_posts, avg(sentiment) AS avg_sentiment FROM data "
#             "WHERE (date BETWEEN '" + start_date + "' AND '" + end_date + "')"
#         )
#     else:
#         query = (
#             "SELECT * FROM "
#             "(SELECT id, count(*) AS num_posts, avg(sentiment) AS avg_sentiment FROM data "
#             "WHERE (date BETWEEN '" + start_date + "' AND '" + end_date + "')) "
#             "AS a JOIN "
#             f"(SELECT * FROM posts WHERE bodyText MATCH '{key_words}')"
#             "WHERE a.id = posts.id"
#         )
#     query += " GROUP BY platform, date"
#     return query


# API routing

app.route("/events")(in_memory.get_events)
app.route("/start_date/<start_date>/end_date/<end_date>/key_words/<key_words>")(
    in_memory.get_sentiments
)
app.route("/api/getPlatformFrequencies")(in_memory.get_platform_freq)
app.route("/api/getBagOfWords")(in_memory.get_bag_of_words)
app.route("/api/getSummary")(in_memory.get_summary)
app.route("/api/getBodyText")(in_memory.get_body_text)

app.route("/schema")(lambda: database.__doc__)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)
