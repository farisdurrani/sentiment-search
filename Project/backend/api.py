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


def sql_order(order: str | None, desc: bool | None):
    tag = "DESC" if desc else "ASC"
    if order:
        return f"ORDER BY {order} {tag}"
    else:
        return ""


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

    order_tag = sql_order(query["orderBy"], query["orderDescending"])
    sql_query = f"""
        SELECT * FROM
        {order_tag}
    """


def sql_body_text() -> str:
    query = {
        "postId": as_list_of_int("postId"),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    try:
        post_ids = tuple(query["postId"])
    except TypeError:
        post_ids = tuple(range(1, 11))

    order_tag = sql_order(query["orderBy"], query["orderDescending"])

    return f"""
        SELECT * FROM posts WHERE id IN {str(post_ids)}
        {order_tag}
    """


def sql_bag_of_words() -> str:
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    order_tag = sql_order(query["orderBy"], query["orderDescending"])

    raise NotImplementedError


def sql_platform_freq() -> str:
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    order_tag = sql_order(query["orderBy"], query["orderDescending"])

    raise NotImplementedError
