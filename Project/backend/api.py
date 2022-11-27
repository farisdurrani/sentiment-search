from __future__ import annotations

import json
import math
import random
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List

import database
import numpy as np
from flask import Flask
from handler import *


def get_summary():
    query = sql_summary()
    return database.json_from_query(query)


def get_body_text():
    query = {
        "postId": as_list_of_int("postId"),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    try:
        post_ids = tuple(query["postId"])
    except TypeError:
        post_ids = tuple(range(1, 11))

    posts_sql = f"SELECT bodyText FROM posts WHERE id IN {post_ids};"
    posts = database.json_from_query(posts_sql)

    others_sql = (
        f"SELECT platform, sentiment, date, country FROM data WHERE id IN {post_ids};"
    )
    others = database.json_from_query(others_sql)
    # print(posts, others)
    count = len(posts)
    assert len(posts) == len(others) == len(post_ids)

    result = []
    for (id, (text,), (platform, sentiment, date, _)) in zip(post_ids, posts, others):
        result.append(
            {
                "postId": id,
                "sentiment": sentiment,
                "bodyText": text,
                "platform": platform,
                "date": date,
            }
        )

    return {"success": True, "count": count, "posts": result}


def get_bag_of_words():
    query = sql_bag_of_words()
    return database.json_from_query(query)


def get_platform_freq():
    query = sql_platform_freq()
    return database.json_from_query(query)


def _sql_order(order: str | None, desc: bool | None):
    tag = "DESC" if desc else "ASC"
    if order:
        return f"ORDER BY {order} {tag}"
    else:
        return ""


def _sql_start(start: datetime | None):
    if start is not None:
        f"date >= {start.date().isoformat()}"
    else:
        return None


def _sql_end(end: datetime | None):
    if end is not None:
        return f"date < {(end + timedelta(day=1)).date().isoformat()}"
    else:
        return ""


def _sql_platform(platform: str | None):
    if platform:
        return f"platform = {platform}"
    else:
        return ""


def _sql_keywords(keywords: List[str]):
    return f"SELECT id WHERE bodyText MATCH {keywords}"


def sql_summary() -> str:
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    order_tag = _sql_order(query["orderBy"], query["orderDescending"])
    start_tag = _sql_start(query["startDate"])
    end_tag = _sql_end(query["endDate"])

    sql_query = f"""
        SELECT * FROM
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

    order_tag = _sql_order(query["orderBy"], query["orderDescending"])
    start_tag = _sql_start(query["startDate"])
    end_tag = _sql_end(query["endDate"])

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

    order_tag = _sql_order(query["orderBy"], query["orderDescending"])
    start_tag = _sql_start(query["startDate"])
    end_tag = _sql_end(query["endDate"])

    raise NotImplementedError
