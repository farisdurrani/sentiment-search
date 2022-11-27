"""
Schema:

CREATE TABLE significant_events (date DATETIME, event TEXT);
CREATE TABLE data(id int, platform text, sentiment real, date datetime, country text);
CREATE VIRTUAL TABLE posts using fts4(id, bodyText)
/* posts(id,bodyText) */;
CREATE TABLE IF NOT EXISTS 'posts_content'(docid INTEGER PRIMARY KEY, 'c0id', 'c1bodyText');
CREATE TABLE IF NOT EXISTS 'posts_segments'(blockid INTEGER PRIMARY KEY, block BLOB);
CREATE TABLE IF NOT EXISTS 'posts_segdir'(level INTEGER,idx INTEGER,start_block INTEGER,leaves_end_block INTEGER,end_block INTEGER,root BLOB,PRIMARY KEY(level, idx));
CREATE TABLE IF NOT EXISTS 'posts_docsize'(docid INTEGER PRIMARY KEY, size BLOB);
CREATE TABLE IF NOT EXISTS 'posts_stat'(id INTEGER PRIMARY KEY, value BLOB);
CREATE INDEX date_index on data (date);
CREATE INDEX id_index on data (id);
"""
from __future__ import annotations

import os
import sqlite3

from flask import jsonify

DATABASE_LOCATION = "dva.sqlite3"
assert os.path.exists(DATABASE_LOCATION), f"{DATABASE_LOCATION} does not exist"

# set up database connection
con = sqlite3.connect(DATABASE_LOCATION, check_same_thread=False)
cur = con.cursor()


def json_from_query(query: str):
    print(f"query received: {query}")
    res = con.execute(query)
    rows = res.fetchall()
    print("done querying")
    return rows
