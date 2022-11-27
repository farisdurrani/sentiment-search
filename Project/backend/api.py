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


def get_body_text():
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError


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

    raise NotImplementedError


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
    raise NotImplementedError


def sql_summary():
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


def sql_body_text():
    query = {
        "postId": as_list_of_int(request_get("postId")),
        "orderBy": as_str(request_get("orderBy")),
        "orderDescending": as_bool(request_get("orderDescending")),
    }

    raise NotImplementedError


def sql_bag_of_words():
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


def sql_platform_freq():
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
