from __future__ import annotations

import json
import math
import random
import sqlite3
from datetime import datetime
from typing import Dict, List

import database
import numpy as np
from flask import Flask
from handler import *


def get_summary():
    query = sql_summary()
    return database.json_from_query(query)


def get_body_text():
    query = sql_body_text()
    return database.json_from_query(query)


def get_bag_of_words():
    query = sql_bag_of_words()
    return database.json_from_query(query)


def get_platform_freq():
    query = sql_platform_freq()
    return database.json_from_query(query)


def sql_summary() -> str:
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError


def sql_body_text() -> str:
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError


def sql_bag_of_words() -> str:
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError


def sql_platform_freq() -> str:
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError
