from __future__ import annotations

import re
from collections import OrderedDict, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Sequence, Set, Tuple

import numpy as np
import pandas as pd
from alive_progress import alive_it
from dateutil import parser
from handler import *
from transformers import BertTokenizerFast

try:
    from rich import print
except ImportError:
    pass

_BATCH = 256
_TOKENIZER = BertTokenizerFast.from_pretrained("bert-base-uncased")
_TOKENIZED_SET: Sequence[Set[str]] | None = None

_PLATFORMS: Sequence[Tuple[str, str]] = (
    ("CNN", "cnn"),
    ("The Guardian", "guardian"),
    ("facebook", "facebook"),
    ("Reddit", "reddit"),
    ("twitter", "twitter"),
    ("The New York Times", "nyt"),
)


def _tokenization_and_save(df: pd.DataFrame, path: Path | None = None):
    """
    Given the dataframe and path,
    perform tokenization on the dataframe's bodyText column,
    and save to path if it's given.
    Returns the tokenized mapping.

    Parameters
    ----------
    df:
        The dataframe whose bodyText will be tokenized.
        It must contain postId column that has continguous range
        i.e. df.postId == range(0, len(df))

    path:
        The path to save if given.

    Returns
    -------
    A list of set of strings.
    Each entry of the list corresponds to the tokenization result of bodyText
    whose postId matches the index in the list.
    """

    print("processing tokenization")
    mapping: List[Set[str]] = [set() for _ in range(len(df))]
    assert set(df["postId"]) == set(range(len(df)))
    for (idx, body_text) in alive_it(zip(df["postId"], df["bodyText"]), total=len(df)):
        tokenized = _TOKENIZER.tokenize(body_text)
        tokenized = [token.lstrip("##") for token in tokenized]
        tokenized = {
            token
            for token in tokenized
            if token not in _STOP_WORDS
            and len(token) >= 3
            and re.match("[A-Za-z]+", token)
        }
        mapping[idx] = tokenized

    if path:
        with open(path, "w+") as f:
            json.dump(obj=[list(tokens) for tokens in mapping], fp=f)

    return mapping


def _get_tokenization():
    """
    Returns the global tokenization_set.

    Creates and set the global tokenization set if not previously set.

    Loads from 'tokenization.json' if one is available.
    """

    global _TOKENIZED_SET

    if _TOKENIZED_SET is not None:
        return _TOKENIZED_SET

    tokenization_cache = Path("tokenization.json")
    if tokenization_cache.exists():
        print("Loading", tokenization_cache)
        with open(tokenization_cache) as f:
            data: List[List[str]] = json.load(f)
            _TOKENIZED_SET = data
        print("tokenization loaded")
        if set(_DF["postId"]) != set(range(len(data))):
            _TOKENIZED_SET = _tokenization_and_save(_DF, tokenization_cache)
    else:
        _TOKENIZED_SET = _tokenization_and_save(_DF, tokenization_cache)
    return _TOKENIZED_SET


def process_df(df: pd.DataFrame):
    """
    Process the dataframe in-place.

    Paramters
    ---------

    df: The dataframe to process.
    Must have 'date', 'bodyText' columns
    If 'country' column is present, it's removed.
    """

    print("processing")

    if "country" in df:
        del df["country"]
    df.dropna(inplace=True)

    df["date"] = df["date"].map(lambda s: parser.parse(str(s)).date().isoformat())

    df["bodyText"] = df["bodyText"].astype("str").str.lower()


# Optionally caching the global dataframe if the file is found.
cache_path = Path("all-platforms.csv")

if cache_path.exists():
    _DF = pd.read_csv(cache_path)
else:
    dataframes = []
    for (name, short) in alive_it(_PLATFORMS):
        print("Processing:", name)
        path = Path(f"{short.lower()}_filtered.csv")
        if path.exists():
            df = pd.read_csv(path)
            dataframes.append(df)
            # print(df)
        else:
            print(f"OH NO!! The file {path} is not found. IGNORED.")

    _DF = pd.concat(dataframes)

    print("start processing dataframe")
    process_df(_DF)
    print("preprocessing done")
    _DF["postId"] = range(len(_DF))
    _DF.to_csv(cache_path, encoding="utf-8", index=False)


print(_DF)

# Find the stop_words.txt in the current folder and remove those from search results.
with open("stop_words.txt") as f:
    sw = {x for x in f.read().split()}
    _STOP_WORDS = sw.copy()

    for word in sw:
        for subword in word.split("'"):
            _STOP_WORDS.add(subword)


@dataclass
class CountTotal:
    count: int = 0
    total: float = 0

    @property
    def mean(self):
        return self.total / self.count

    def add(self, value: float):
        self.count += 1
        self.total += value


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
        "platform": as_list_of_str_lower("platform"),
        "keywords": as_list_of_str_lower("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "orderBy": as_str(request_get("orderBy"), "date"),
        "orderDescending": as_bool(request_get("orderDescending"), True),
        "betterToken": as_bool(request_get("betterToken"), False),
    }
    print("Query received:", query)

    start_date = query["startDate"]
    end_date = query["endDate"]
    platform = query["platform"]
    keywords = query["keywords"]
    per_day = query["limitCountOfPostsPerDate"]
    order_by = query["orderBy"]
    order_desc = query["orderDescending"]
    better_token = query["betterToken"]

    df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    if platform:
        for p in platform:
            assert p in [k[0].lower() for k in _PLATFORMS], p
        df = pd.concat([df[df["platform"].str.lower() == plat] for plat in platform])

    if keywords:
        for kw in keywords:
            if better_token:
                tokenization = _get_tokenization()
                has_kw = {idx for idx in df["postId"] if kw in tokenization[idx]}
                df = df[df["postId"].isin(has_kw)]
            else:
                df = df[df["bodyText"].str.contains(kw, na=False)]

    records = df.to_dict("records")
    converted: Dict[str, Dict[str, CountTotal]] = defaultdict(
        lambda: defaultdict(CountTotal)
    )

    for record in records:
        converted[record["date"]][record["platform"]].add(record["sentiment"])

    rows = []
    for (time, data) in converted.items():
        count = sum(d.count for d in data.values())
        mean_sentiment = sum(d.total for d in data.values()) / count

        rows.append(
            {
                "date": time,
                "meanSentiment": mean_sentiment,
                "count": count,
                "posts": [
                    {
                        "platform": platform,
                        "sentiment": sentiment.mean,
                        "count": sentiment.count,
                    }
                    for (platform, sentiment) in data.items()
                ],
            }
        )
    if order_by:
        rows.sort(key=lambda x: x[order_by], reverse=order_desc)

    return {"success": True, "rows": rows}


def get_body_text():
    query = {
        "postId": as_list_of_int("postId"),
        "orderBy": as_str(request_get("orderBy"), "date"),
        "orderDescending": as_bool(request_get("orderDescending"), True),
    }
    print("Query received:", query)

    post_ids = query["postId"]
    order_by = query["orderBy"]
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
        "platform": as_list_of_str_lower("platform"),
        "keywords": as_list_of_str_lower("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy"), "count"),
        "orderDescending": as_bool(request_get("orderDescending"), True),
        "betterToken": as_bool(request_get("betterToken"), False),
        "sampleRate": as_float(request_get("sampleRate"), 1),
    }
    print("Query received:", query)

    post_ids = query["postId"]
    order_by = query["orderBy"]
    order_desc = query["orderDescending"]
    start_date = query["startDate"]
    end_date = query["endDate"]
    platform = query["platform"]
    keywords = query["keywords"]
    better_token = query["betterToken"]
    per_day = query["limitCountOfPostsPerDate"]
    per_word = query["limitAmountOfWords"]
    sample_rate = query["sampleRate"]

    if post_ids:
        df = _DF[_DF["postId"].isin(post_ids)]
    else:
        df = _DF.copy()

    if 0 <= sample_rate < 1:
        df = df.iloc[np.random.random([len(df)]) < sample_rate]

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    if platform:
        for p in platform:
            assert p in [k[0].lower() for k in _PLATFORMS], p
        df = pd.concat([df[df["platform"].str.lower() == plat] for plat in platform])

    bag_of_words = []

    if keywords:
        for kw in keywords:
            if better_token:
                tokenization = _get_tokenization()
                has_kw = {idx for idx in df["postId"] if kw in tokenization[idx]}
                stmt = df[df["postId"].isin(has_kw)]["sentiment"]
                mean_sentiment = np.mean(stmt) if len(stmt) else None
                count = len(stmt)
            else:
                has_kw = df[df["bodyText"].str.contains(kw, na=False)]
                mean_sentiment = np.mean(has_kw["sentiment"]) if len(has_kw) else None
                count = len(has_kw)
            bag_of_words.append(
                {"word": kw, "count": count, "meanSentiment": mean_sentiment}
            )
    else:
        word_count: Dict[str, CountTotal] = defaultdict(CountTotal)

        tokenization = _get_tokenization()
        for (sentiment, post_id) in zip(df["sentiment"], df["postId"]):
            cleaned = tokenization[post_id]

            for word in cleaned:
                word_count[word].add(sentiment)

        for (word, ct) in word_count.items():
            bag_of_words.append(
                {
                    "word": word,
                    "count": ct.count,
                    "meanSentiment": ct.mean,
                }
            )

    if order_by:
        bag_of_words.sort(key=lambda x: x[order_by], reverse=order_desc)

    if per_word:
        bag_of_words = bag_of_words[:per_word]

    return {"success": True, "bagOfWords": bag_of_words}


def get_platform_freq():
    query = {
        "postId": as_list_of_int("postId"),
        "startDate": as_date(request_get("startDate")),
        "endDate": as_date(request_get("endDate")),
        "keywords": as_list_of_str_lower("keywords"),
        "limitCountOfPostsPerDate": as_int(request_get("limitCountOfPostsPerDate")),
        "limitAmountOfWords": as_int(request_get("limitAmountOfWords")),
        "orderBy": as_str(request_get("orderBy"), "count"),
        "orderDescending": as_bool(request_get("orderDescending"), True),
        "betterToken": as_bool(request_get("betterToken"), False),
    }
    print("Query received:", query)

    post_ids = query["postId"]
    order_by = query["orderBy"]
    order_desc = query["orderDescending"]
    start_date = query["startDate"]
    end_date = query["endDate"]
    keywords = query["keywords"]
    better_token = query["betterToken"]

    if post_ids:
        df = _DF[_DF["postId"].isin(post_ids)]
    else:
        df = _DF.copy()

    if start_date:
        df = df[df["date"] >= start_date.isoformat()]

    if end_date:
        df = df[df["date"] <= end_date.isoformat()]

    platform_info = []
    for platform in [k[0] for k in _PLATFORMS]:
        plat_df = df[df["platform"].str.lower() == platform.lower()]
        for kw in keywords:
            if better_token:
                tokenization = _get_tokenization()
                has_kw = {idx for idx in df["postId"] if kw in tokenization[idx]}
                plat_df = plat_df[plat_df["postId"].isin(has_kw)]
            else:
                plat_df = plat_df[plat_df["bodyText"].str.contains(kw, na=False)]
        count = len(plat_df)
        mean_sentiment = np.mean(plat_df["sentiment"]) if len(plat_df) else None
        platform_info.append(
            {"platform": platform, "count": count, "meanSentiment": mean_sentiment}
        )

    if order_by:
        platform_info.sort(key=lambda x: x[order_by], reverse=order_desc)
    return {"success": True, "frequencies": platform_info}
