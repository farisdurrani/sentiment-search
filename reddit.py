from argparse import ArgumentParser
from datetime import datetime
from typing import Callable, Dict

import orjson as json
import pandas as pd
from pandas import DataFrame
from tqdm import tqdm

KEY_MAPPING: Dict[str, Callable] = {
    "id": str,
    "created_utc": lambda x: datetime.utcfromtimestamp(int(x)),
    "author": str,
    "num_comments": int,
    "score": int,
    "selftext": str,
    "title": str,
    "subreddit": str,
    "subreddit_id": str,
    "url": str,
}


def load_and_filter(line: str):
    parsed = json.loads(line)

    result = {}
    for (key, mapping) in KEY_MAPPING.items():
        try:
            result[key] = mapping(parsed[key])
        except KeyError:
            continue
        except TypeError:
            print(key, parsed[key], mapping, type(parsed[key]))
            raise SystemError
    return result


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("-y", "--year", type=int, required=True)
    parser.add_argument("-m", "--month", type=int, required=True)
    parser.add_argument("-t", "--threshold", type=int, required=True)
    flags = vars(parser.parse_args())

    threshold = flags["threshold"]
    input_file = f"RS_{flags['year']:4d}-{flags['month']:02d}.csv"
    output_file = f"out-{input_file}"

    with open(input_file, "r") as f:
        data = []
        for line in tqdm(f):
            data.append(load_and_filter(line))

    df = DataFrame.from_records(data)

    df = df[pd.to_numeric(df.score, errors="coerce").notnull()]
    df.score = df.score.astype(int)

    df = df[df.score >= threshold]
    df = df[df.selftext != ""]
    df = df[df.selftext != "nan"]
    df = df[df.selftext != "[deleted]"]
    df = df[df.selftext != "[removed]"]
    print("Count: {}".format(len(df.index)))

    df.to_csv(output_file)
