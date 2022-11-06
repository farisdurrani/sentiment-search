import json
from argparse import ArgumentParser

from pandas import DataFrame

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("-i", "--inputs", type=str)
    parser.add_argument("-o", "--outputs", type=str)
    flags = vars(parser.parse_args())

    with open(flags["inputs"], "r") as f:
        parsed = f.readlines()
        data = list(map(json.loads, parsed))

    df = DataFrame.from_records(data)

    with open(flags["outputs"], "w+") as f:
        df.to_csv(f)
