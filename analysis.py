import multiprocessing as mp
import os
import subprocess as sp
import sys

import pandas as pd
from tqdm import tqdm
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

FILE_NAME = sys.argv[1]


analyzer = SentimentIntensityAnalyzer()
# count = [0]


def produce_sentiment(text):
    # print(f"Processing row {count[0]}")
    # count[0] += 1
    return analyzer.polarity_scores(text)


def analyze_one_file(filename):
    df = pd.read_csv(filename)

    p = mp.Pool(mp.cpu_count())
    selftextSentiment = pd.DataFrame.from_records(
        p.map(produce_sentiment, tqdm(df["selftext"], total=len(df.index)))
    ).add_prefix("selftext-")
    titleSentiment = pd.DataFrame.from_records(
        p.map(produce_sentiment, tqdm(df["title"], total=len(df.index)))
    ).add_prefix("title-")
    df = pd.concat([df, selftextSentiment, titleSentiment], axis=1)

    df.to_csv(f"{filename[:-4]}-sentiments.csv")


def run():
    if not os.path.isfile(FILE_NAME):
        print("### FILE NOT FOUND ###", FILE_NAME)
    else:
        print(f"STARTING: {FILE_NAME}\n")
        analyze_one_file(FILE_NAME)
        print(f"DONE: {FILE_NAME}\n")


def main():
    run()


if __name__ == "__main__":
    main()
