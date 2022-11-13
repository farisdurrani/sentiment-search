import os
import subprocess as sp
import sys

import pandas as pd
from tqdm import tqdm
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

(YEAR, MONTH) = map(int, sys.argv[1:])

YEAR = f"{YEAR:04d}"
MONTH = f"{MONTH:02d}"


analyzer = SentimentIntensityAnalyzer()
# count = [0]


def produce_sentiment(text):
    # print(f"Processing row {count[0]}")
    # count[0] += 1
    return analyzer.polarity_scores(text)


def analyze_one_file(filename):
    df = pd.read_csv(filename)

    selftextSentiment = pd.DataFrame.from_records(
        [
            produce_sentiment(record)
            for record in tqdm(df["selftext"], total=len(df.index))
        ]
    ).add_prefix("selftext-")
    titleSentiment = pd.DataFrame.from_records(
        [produce_sentiment(record) for record in tqdm(df["title"], total=len(df.index))]
    ).add_prefix("title-")
    df = pd.concat([df, selftextSentiment, titleSentiment], axis=1)

    df.to_csv(f"{filename[:-4]}-sentiments.csv")


def run():
    FILE_NAME = f"RS_{YEAR}-{MONTH}.csv"
    sp.call(["dbxcli", "get", f"/DVA_Datasets/Reddit/result/{FILE_NAME}"])

    if not os.path.isfile(FILE_NAME):
        print("### FILE NOT FOUND ###", FILE_NAME)
    else:
        print(f"STARTING: {FILE_NAME}\n")
        analyze_one_file(FILE_NAME)
        print(f"DONE: {FILE_NAME}\n")

    sp.call(
        [
            "dbxcli",
            "put",
            f"RS_{YEAR}-{MONTH}-sentiments.csv",
            f"/DVA_Datasets/Reddit/tagged/RS_{YEAR}-{MONTH}-sentiments.csv",
        ]
    )

    sp.call(
        [
            "rm",
            "-fv",
            f"RS_{YEAR}-{MONTH}.csv",
            f"RS_{YEAR}-{MONTH}-sentiments.csv",
        ]
    )


def main():
    run()


if __name__ == "__main__":
    main()
