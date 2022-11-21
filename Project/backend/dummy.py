import json

from handler import (
    as_bool,
    as_date,
    as_float,
    as_int,
    as_list_of_int,
    as_list_of_str,
    as_str,
    request_get,
)


def getSummary():
    query = {
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "platform": as_str(request_get("platform")),
        "keywords": as_list_of_str(request_get("keywords")),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    print(query)

    with open("./getSummaryDummy.json") as f:
        dummy = json.load(f)

    return dummy


def getBodyText():
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    print(query)

    with open("./getBodyTextDummy.json") as f:
        dummy = json.load(f)

    return dummy


def getBagOfWords():
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


def getPlatformFrequencies():
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
