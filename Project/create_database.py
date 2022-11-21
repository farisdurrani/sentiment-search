import sqlite3
import pandas as pd
import dropbox
import io
from configparser import ConfigParser
from datetime import datetime

con = sqlite3.connect("dva_database")
cur = con.cursor()
cur = con.execute("DROP TABLE IF EXISTS posts")
cur = con.execute("DROP TABLE IF EXISTS significant_events")
cur = con.execute("CREATE VIRTUAL TABLE posts USING fts4(platform TEXT, bodyText TEXT, sentiment FLOAT, date DATETIME, country TEXT)")
cur = con.execute("CREATE TABLE significant_events (date DATETIME, event TEXT)")

config = ConfigParser()
config.read('dropbox_token.ini')
DROPBOX_TOKEN = config['token']['token']

dbx = dropbox.Dropbox(DROPBOX_TOKEN)

#method to get the share of a file from its path
def getShareLinkFromPath(path):
    try: # if we have already created a sharing link, we can't create a new one, but we can get the old one
        shared_link_metadata = dbx.sharing_create_shared_link_with_settings(path)
    except:
        shared_link_metadata = dbx.sharing_list_shared_links(path).links[0]
    shared_link = shared_link_metadata.url
    shared_link= shared_link[:-1]+'1'
    return shared_link

#method to read a file in from the path
def readDfFromPath(path):
    metadata, file = dbx.files_download(path=path)
    with io.BytesIO(file.content) as stream:
        df = pd.read_csv(stream, encoding='latin-1')
    df = adaptDf(path, df)
    return df

def adaptDf(path, df):
    if "reddit" in str(path).lower():
        return adaptReddit(df)
    elif "cnn" in str(path).lower():
        df['platform'] = 'CNN'
        df['country'] = None
        return df
    elif "facebook" in str(path).lower():
        df['platform'] = "facebook"
        df['country'] = None
        return df
    elif "new york times" in str(path).lower():
        df = adaptNYT(df)
        return df
    elif "the guardian" in str(path).lower():
        df['platform'] = "The Guardian"
        df['country'] = None
        return df
    elif "twitter" in str(path).lower():
        df = adaptTwitter(df)
        return df

    return df


def adaptReddit(df):
    df['platform'] = "reddit"
    df['bodyText'] = df['title']
    df['sentiment'] = df['title-compound']
    df['date'] = df['created_utc']
    df['country'] = None
    return df

def adaptNYT(df):
    df['platform']  = df['source']
    df["country"] = None
    df['bodyText'] = df['lead_paragraph']
    df['date'] = df['pub_date']
    df['sentiment'] = df['sentiment_pos']
    return df

def adaptTwitter(df):
    df['platform'] = "Twitter"
    df['country'] = None
    df['sentiment'] = df['compound']
    df['bodyText'] = df['text']
    return df

#method to get the names of the files in a path
def getFileNames(path):
    files = dbx.files_list_folder(path).entries

    files_list = []
    for file in files:
        if isinstance(file, dropbox.files.FileMetadata):
            files_list.append(file.name)
    return files_list

#method to fill the significant_events table with the data from two files
def insertSigEventsFiles():
    for file_path in sig_events_files:
        df = readDfFromPath(file_path)
        df = df[['date', 'event']]
        df.to_sql('significant_events', con=con, if_exists='append', index="False")
        '''
        for row in df.rows:
            date = row.date
            event = row.event
            query = "INSERT INTO significant_events VALUES (" + date + ", " + event + ")"
            con.execute(query)
        '''


#method to insert the posts of one of the paths to tagged files
def insertPosts(folder_path):
    path = '/DVA_Datasets' + folder_path
    files = getFileNames(path)
    for file_name in files:
        print(file_name)
        df = readDfFromPath(path+ '/' + file_name)
        df = adaptDf(path, df)
        df = df[['platform', 'bodyText', 'sentiment', 'date', 'country']]
        df.to_sql('posts', con=con, if_exists='append', index=False)

sig_events_files = ['/DVA_Datasets/significant_events.csv', '/DVA_Datasets/sig_ev_22.csv']
posts_folder_paths = ['/twitter/sentiments', '/CNN/sentiments', '/Facebook/facebook_posts/sentiments/sentiments/sentiments', '/New York Times', '/Reddit/tagged', '/The Guardian/sentiments']


print("INSERTING POSTS")
for path in posts_folder_paths:
    print(path)
    insertPosts(path)

print('INSERTING SIGNIFICANT EVENTS')
insertSigEventsFiles()

con.execute("CREATE INDEX posts_index ON posts (bodyText)")
con.execute("CREATE INDEX events_index ON significant_events (event)")