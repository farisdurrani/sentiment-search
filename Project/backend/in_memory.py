from __future__ import annotations


from collections import defaultdict
from pathlib import Path

import numpy as np
import pandas as pd
from dateutil import parser
from handler import *

_PLATFORMS = {
    "CNN": "cnn",
    "The Guardian": "guardian",
    "facebook": "facebook",
    "Reddit": "reddit",
    "twitter": "twitter",
    "The New York Times": "nyt",
}

cache_path = Path("all-platforms.csv")

if cache_path.exists():
    _DF = pd.read_csv(cache_path)
else:
    dataframes = [pd.read_csv(f"{p.lower()}_filtered.csv") for p in _PLATFORMS.values()]

    for df in dataframes:
        del df["country"]
        df = df.dropna()

        df["date"] = (
            df["date"].astype("str").map(lambda s: parser.parse(s).date().isoformat())
        )
        df["bodyText"] = df["bodyText"].astype("str").str.lower()

    _DF = pd.concat(dataframes)

    _DF = _DF.dropna()
    _DF["postId"] = range(len(_DF))
    _DF.to_csv(cache_path, encoding="utf-8")
    print("preprocessing done")

print(_DF)


def get_events():
    df = pd.read_csv("significant-events.csv")
    return df.to_dict("records")


# route to get avergae sentiments and number of posts grouped by platform and date
# start_date and end_date should be in yyyy-mm-dd format
# if no start date or end date specified by the user, use 2014-12-31 for start_date and 'now()' for end_date
# key_words should be a string of words separated by spaces
def get_sentiments(start_date, end_date, key_words):
    df = _DF.copy()

    if key_words:
        df = df[df["bodyText"].str.contains(key_words, na=False)]

    if start_date:
        df = df[df["date"] >= parser.parse(start_date).date().isoformat()]

    if end_date:
        df = df[df["date"] <= parser.parse(end_date).date().isoformat()]

    return df.to_dict("records")


def get_summary():
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_list_of_str("platform"),
        "keywords": as_list_of_str("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    start_date = query["startDate"]
    end_date = query["endDate"]
    platform = query["platform"]
    keywords = query["keywords"]
    per_day = query["limitCountOfPostsPerDate"]
    order_by = query.get("orderBy", "date")
    order_desc = query["orderDescending"]

    df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    df = pd.concat([df[df["platform"] == plat] for plat in platform])

    if keywords:
        for kw in keywords:
            df = df[df["bodyText"].str.contains(kw, na=False)]

    records = df.to_dict("records")
    converted = defaultdict(list)

    for record in records:
        converted[record["date"]].append(
            {
                "sentiment": record["sentiment"],
                "platform": record["platform"],
                "postId": record["postId"],
            }
        )

    rows = []
    for (time, data) in converted.items():
        mean_sentiment = (
            sum(d["sentiment"] for d in data) / len(data) if len(data) else None
        )
        rows.append(
            {
                "date": time,
                "meanSentiment": mean_sentiment,
                "count": len(data),
                "posts": data,
            }
        )
    if order_by:
        rows.sort(key=lambda x: x[order_by], reverse=order_desc)

    return {"success": True, "rows": rows}


def get_body_text():
    query = {
        "postId": as_list_of_int("postId"),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    post_ids = query["postId"]
    order_by = query.get("orderBy", "date")
    order_desc = query["orderDescending"]

    print(_DF["postId"], post_ids)
    df = _DF[_DF["postId"].isin(post_ids)]
    converted = df.to_dict("records")

    if order_by:
        converted.sort(key=lambda x: x[order_by], reverse=order_desc)

    return {"success": True, "count": len(converted), "posts": converted}


def get_bag_of_words():
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_list_of_str("platform"),
        "keywords": as_list_of_str("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    post_ids = query["postId"]
    order_by = query.get("orderBy", "count")
    order_desc = query.get("orderDescending", True)
    start_date = query["startDate"]
    end_date = query["endDate"]
    platform = query["platform"]
    keywords = query["keywords"]
    per_day = query["limitCountOfPostsPerDate"]
    per_word = query["limitAmountOfWords"]

    if post_ids:
        df = _DF[_DF["postId"].isin(post_ids)]
    else:
        df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    if platform:
        df = pd.concat([df[df["platform"] == plat] for plat in platform])

    bag_of_words = []
    for kw in keywords:
        has_kw = df[df["bodyText"].str.contains(kw, na=False)]
        mean_sentiment = np.mean(has_kw["sentiment"])
        count = len(has_kw)
        bag_of_words.append(
            {"word": kw, "count": count, "meanSentiment": mean_sentiment}
        )

    if order_by:
        bag_of_words.sort(key=lambda x: x[order_by], reverse=order_desc)

    return {"success": True, "bagOfWords": bag_of_words}


def get_platform_freq():
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "keywords": as_list_of_str("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    post_ids = query["postId"]
    order_by = query.get("orderBy", "count")
    order_desc = query.get("orderDescending", True)
    start_date = query["startDate"]
    end_date = query["endDate"]
    keywords = query["keywords"]

    if post_ids:
        df = _DF[_DF["postId"].isin(post_ids)]
    else:
        df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    platform_info = []
    for platform in _PLATFORMS.keys():
        plat_df = df[df["platform"] == platform]
        for kw in keywords:
            plat_df = plat_df[plat_df["bodyText"].str.contains(kw, na=False)]
        count = len(plat_df)
        mean_sentiment = np.mean(plat_df["sentiment"])
        platform_info.append(
            {"platform": platform, "count": count, "meanSentiment": mean_sentiment}
        )

    if order_by:
        platform_info.sort(key=lambda x: x[order_by], reverse=order_desc)
    return {"success": True, "frequencies": platform_info}
