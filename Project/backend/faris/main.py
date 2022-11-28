import pandas as pd


def run():
    cnn = pd.read_csv("cnn.csv")
    thegu = pd.read_csv("thegu.csv")
    thegu["date"] = thegu["date"].str[:10]
    appended = cnn[["platform", "sentiment", "date"]] \
        .append(thegu[["platform", "sentiment", "date"]])
    mean = appended.groupby("date")["sentiment"].mean()
    mean = mean.to_frame().reset_index()
    mean = mean.rename({'sentiment': 'meanSentiment'}, axis="columns")
    mean.to_json(path_or_buf="data.json", orient="records")


def main():
    run()


if __name__ == "__main__":
    main()
