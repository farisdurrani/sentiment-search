from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import multiprocessing as mp

CSV_FILES = [
    "cnn_articles-2015-6805.csv",
    "cnn_articles-2016-1610.csv",
    "cnn_articles-2017-3555.csv",
    "cnn_articles-2018-7011.csv",
    "cnn_articles-2019-2682.csv",
    "cnn_articles-2020-5418.csv",
    "cnn_articles-2021-8194.csv",
    "cnn_articles-2022-3264.csv"
]
ORIGINAL_SAMPLES_DIR = "outputs/"
SENTIMENTS_DIR = "outputs/sentiments/"
TARGET_COLUMN = "bodyContent"
analyzer = SentimentIntensityAnalyzer()
count = [0]


def produce_sentiment(text):
    print(f"Processing row {count[0]}")
    count[0] += 1
    return analyzer.polarity_scores(text)


def analyze_one_file(filename):
    df = pd.read_csv(ORIGINAL_SAMPLES_DIR + filename)

    p = mp.Pool(mp.cpu_count())
    sentimentColumns = p.map(produce_sentiment, df[TARGET_COLUMN])
    df = pd.concat([df, pd.DataFrame(sentimentColumns)], axis=1)

    df.to_csv(f"{SENTIMENTS_DIR}{filename[:-4]}-sentiments.csv")

def run():
    for filename in CSV_FILES:
        print(f"STARTING: {filename}\n")
        analyze_one_file(filename)
        print(f"DONE: {filename}\n")


def main():
    run()


if __name__ == "__main__":
    main()
