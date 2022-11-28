import pandas as pd
from dateutil import parser
import numpy as np


def str_to_date(date_string):
    try:
        return parser.parse(date_string).strftime("%Y-%m-%d")
    except parser.ParserError:
        return np.nan


def run():
    df = pd.read_csv("sig_ev_22.csv")
    df["date"] = df["date"].apply(lambda x: str_to_date(x))
    df["description"] = df["description"].apply(
        lambda x: str(x).strip().replace(" ", " "))
    df.dropna(inplace=True)
    df.to_json("sig_ev_cleaned.json", orient="records")


def main():
    run()


if __name__ == "__main__":
    main()
