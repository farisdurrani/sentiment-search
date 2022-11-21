from __future__ import annotations

import json
import math
import random
from datetime import datetime
from typing import Dict, List

import numpy as np
from faker import Faker
from handler import *

fake = Faker()

_PLATFORMS = ["CNN", "The Guardian", "facebook", "Reddit", "twitter", "Reddit"]
_MAX_POST_ID = int(1e9)
_DEFAULT_POST_COUNT = 15


def _fake_date_in_range(
    start: str | datetime | None = None, end: str | datetime | None = None
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


def _fake_id():
    return random.randint(0, _MAX_POST_ID)


def _fake_platform():
    return _PLATFORMS[random.randrange(0, len(_PLATFORMS))]


def _fake_post():
    return {
        "platform": _fake_platform(),
        "sentiment": _fake_sentiment(),
        "postId": _fake_id(),
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


def _sort_if_key_present(query: Dict[str, Any], rows: List[Any]) -> List[Any]:
    sort_key = query.get("orderBy", None)
    if sort_key is not None:
        reverse = query.get("orderDescending", False)
        rows = sorted(rows, reverse=reverse, key=lambda data: data[sort_key])

    return rows


def _fake_post():
    post_id = _fake_id()
    sentiment = _fake_sentiment()
    fake_text = (
        f"Sample text that is fake with post id: {post_id} and sentiment: {sentiment}"
    )
    return {
        "postId": post_id,
        "sentiment": sentiment,
        "bodyText": fake_text,
        "platform": _fake_platform(),
        "date": _fake_date_in_range(),
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

    rows = [_fake_summary_row(date) for date in random_dates]
    rows = _sort_if_key_present(query, rows)

    return {"success": True, "rows": rows}


def get_body_text():
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    post_count = _fake_post_count()
    posts = [_fake_post() for _ in range(post_count)]
    posts = _sort_if_key_present(query, posts)

    return {"success": True, "count": post_count, "posts": posts}


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

    keywords = query["keywords"]
    if keywords is None:
        keywords = ["dummy", "provided", "keywords"]
    bow = [
        {"word": kw, "count": _fake_post_count(), "meanSentiment": _fake_sentiment()}
        for kw in keywords
    ]
    bow = _sort_if_key_present(query, bow)

    return {"success": True, "bagOfWords": bow}


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

    platforms = [pl for pl in _PLATFORMS if bool(random.randint(0, 1))]
    frequencies = [
        {
            "platform": pl,
            "count": _fake_post_count(),
            "meanSentiment": _fake_sentiment(),
        }
        for pl in platforms
    ]
    frequencies = _sort_if_key_present(query, frequencies)

    return {"success": True, "frequencies": frequencies}
