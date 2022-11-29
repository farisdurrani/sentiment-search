from collections import defaultdict

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

_DF = pd.concat([pd.read_csv(f"{p.lower()}_filtered.csv") for p in _PLATFORMS.values()])
del _DF["country"]


_DF["date"] = _DF["date"].map(lambda s: parser.parse(s).date().isoformat())
_DF["bodyText"] = _DF["bodyText"].str.lower()
_DF.dropna()
_DF["postId"] = range(len(_DF))
print("preprocessing done")
print(_DF)


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
    for (date, data) in converted.items():
        rows.append(
            {
                "date": date,
                "meanSentiment": sum(d["sentiment"] for d in data) / len(data),
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
