from __future__ import annotations

import json
import math
import random
from datetime import datetime

import numpy as np
from faker import Faker
from handler import *

fake = Faker()

_PLATFORMS = ["CNN", "The Guardian", "facebook", "Reddit", "twitter", "Reddit"]
_MAX_POST_ID = int(1e9)
_DEFAULT_POST_COUNT = 15


def _fake_date_in_range(
    start: str | datetime | None, end: str | datetime | None
) -> datetime:
    if start is None:
        start = "2000-01-01"

    if end is None:
        end = "2022-11-20"

    if isinstance(start, str):
        start = as_date(start)

    if isinstance(end, str):
        end = as_date(end)

    return fake.date_between(start_date=start, end_date=end)


def _fake_post_count():
    return math.ceil(random.expovariate(1 / 3))


def _fake_sentiment():
    return random.random() * 2 - 1


def fake_platform():
    return _PLATFORMS[random.randrange(0, len(_PLATFORMS))]


def _fake_post():
    return {
        "platform": fake_platform(),
        "sentiment": _fake_sentiment(),
        "postId": random.randint(0, _MAX_POST_ID),
    }


def _fake_summary_row(day: datetime):
    post_count = _fake_post_count()
    fake_posts = [_fake_post() for _ in range(post_count)]

    return {
        "date": day,
        "count": post_count,
        "posts": fake_posts,
        "meanSentiment": np.mean([fp["sentiment"] for fp in fake_posts]),
    }


def get_summary():
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    random_dates = [
        _fake_date_in_range(query["startDate"], query["endDate"])
        for _ in range(_DEFAULT_POST_COUNT)
    ]
    return {
        "success": True,
        "rows": [_fake_summary_row(date) for date in random_dates],
    }


def get_body_text():
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    print(query)

    with open("./getBodyTextDummy.json") as f:
        dummy = json.load(f)

    return dummy


def get_bag_of_words():
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

    print(query)

    with open("./getBagOfWordsDummy.json") as f:
        dummy = json.load(f)

    return dummy


def get_platform_freq():
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

    print(query)

    with open("./getPlatformFrequenciesDummy.json") as f:
        dummy = json.load(f)

    return dummy
