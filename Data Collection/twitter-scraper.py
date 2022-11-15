import csv
import os

import pandas as pd
from rich import print

import tweepy
from tweepy import API, Client, OAuth2AppHandler, OAuth2BearerHandler

####input your credentials here
bearer_token = os.environ.get("TWITTER_BEARER")
access_token = os.environ.get("TWITTER_ACCESS_KEY")
access_token_secret = os.environ.get("TWITTER_ACCESS_SECRET")

auth = OAuth2AppHandler(consumer_key=access_token, consumer_secret=access_token_secret)
# auth.set_access_token(access_token, access_token_secret)
api = API(auth, wait_on_rate_limit=True)

client = Client(bearer_token=bearer_token)
out = client.search_recent_tweets(query="#politics lang:en", max_results=100)

print(out.data)
#####United Airlines
# Open/Create a file to append data
# with open("ua.csv", "a") as csvFile:
#     # Use csv Writer
#     csvWriter = csv.writer(csvFile)

#     for tweet in tweepy.Cursor(
#         api.search_tweets, q="#unitedAIRLINES", count=100, lang="en"
#     ).items():
#         print(tweet.created_at, tweet.text)
#         csvWriter.writerow([tweet.created_at, tweet.text.encode("utf-8")])
