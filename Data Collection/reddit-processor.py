from argparse import ArgumentParser
from datetime import datetime
from typing import Callable, Dict

import orjson as json
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
    parser.add_argument("-i", "--inputs", type=str)
    parser.add_argument("-o", "--outputs", type=str)
    flags = vars(parser.parse_args())

    with open(flags["inputs"], "r") as f:
        data = []
        for line in tqdm(f):
            data.append(load_and_filter(line))

    df = DataFrame.from_records(data)

    with open(flags["outputs"], "w+") as f:
        df.to_csv(f)
