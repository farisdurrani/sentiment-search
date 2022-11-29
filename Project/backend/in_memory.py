import numpy as np
import pandas as pd
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

_DF["date"] = _DF["date"].map(lambda s: datetime.fromisoformat(s).date().isoformat())
_DF["bodyText"] = _DF["bodyText"].str.lower()
_DF.index = range(len(_DF))


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
        df = df[df["date"] >= start_date]

    if end_date:
        df = df[df["date"] <= end_date]

    df = pd.concat([df[df["platform"] == plat] for plat in platform])

    if keywords:
        for kw in keywords:
            df = df[df["bodyText"].str.contains(kw)]

    if order_by:
        df.sort_values(order_by, ascending=not order_desc)

    converted = df.tolist()
    return {"success": True, "rows": converted}


def get_body_text():
    query = {
        "postId": as_list_of_int("postId"),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    post_ids = query["postId"]
    order_by = query.get("orderBy", "date")
    order_desc = query["orderDescending"]

    df = _DF.iloc[post_ids]
    if order_by:
        df.sort_values(order_by, ascending=not order_desc)

    converted = df.to_dict("records")
    return {"success": True, "count": len(converted), "posts": converted}


def get_bag_of_words():
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
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
        df = _DF.iloc[post_ids]
    else:
        df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date]

    if end_date:
        df = df[df["date"] <= end_date]

    if platform:
        df = pd.concat([df[df["platform"] == plat] for plat in platform])

    bag_of_words = []
    for kw in keywords:
        has_kw = df[df["bodyText"].str.contains(kw)]
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
        df = _DF.iloc[post_ids]
    else:
        df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date]

    if end_date:
        df = df[df["date"] <= end_date]

    platform_info = []
    for platform in _PLATFORMS.keys():
        plat_df = df[df["platform"] == platform]
        for kw in keywords:
            plat_df = plat_df[plat_df["bodyText"].str.contains(kw)]
        count = len(plat_df)
        mean_sentiment = np.mean(plat_df["sentiments"])
        platform_info.append(
            {"platform": platform, "count": count, "meanSentiment": mean_sentiment}
        )

    if order_by:
        platform_info.sort(key=lambda x: x[order_by], reverse=order_desc)
    return {"success": True, "frequencies": platform_info}
