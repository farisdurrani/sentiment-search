import sqlite3

from flask import jsonify

# set up database connection
con = sqlite3.connect("dva.sqlite3")
cur = con.cursor()


def getJsonFromQuery(query: str):
    res = con.execute(query)
    rows = res.fetchall()
    return jsonify(rows)
