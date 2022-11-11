import pandas as pd
from argparse import ArgumentParser


parser = ArgumentParser()
parser.add_argument("-y", "--year", type=int)
parser.add_argument("-m", "--month", type=int)
parser.add_argument("-t", "--threshold", type=int)
flags = vars(parser.parse_args())

threshold = flags["threshold"]
input_file = f"RS_{flags['year']:4d}-{flags['month']:02d}.csv"
output_file = f"out-{input_file}"

df = pd.read_csv(input_file)
df = df[pd.to_numeric(df.score, errors='coerce').notnull()]
df = df.astype({"score": "int", "num_comments": "int", "selftext": "str"})
df = df[df.score >= threshold]
df = df[df.selftext != ""]
df = df[df.selftext != "nan"]
df = df[df.selftext != "[deleted]"]
df = df[df.selftext != "[removed]"]
print("Count: {}".format(len(df.index)))
df.to_csv(output_file)
