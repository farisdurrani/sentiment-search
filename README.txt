# Sentiment Search: Make the Internet your Focus Group

Visualizing the sentiment of the Internet across multiple media platforms.

> **GitHub repo**: https://github.com/farisdurrani/sentiment-search <br/> **Implemented**: Fall 2022

# INSTALLATION & EXECUTION

## Prerequisites:

1. [NodeJS v18](https://nodejs.org/en/download/)
1. NPM v9: `npm install npm@latest -g`
1. [Python 3.10](https://www.python.org/downloads/release/python-3108/)
1. Download the `reduced_data` dataset from [Kaggle](https://www.kaggle.com/datasets/farisdurrani/sentimentsearch), unzipping it, and putting all the files inside [/backend](./Project/backend)

## Start both the backend and frontend apps once inside [/Project](./Project):

> **Note** the different backend commands for Mac/Linux and Windows

| Action                                                   | Command                |
| -------------------------------------------------------- | ---------------------- |
| Install / Update Frontend Packages (one-time)            | `npm run installf`     |
| Install / Update Backend Packages (one-time) (linux/mac) | `npm run installb-mac` |
| Install / Update Backend Packages (one-time) (windows)   | `npm run installb-win` |
| Running the Frontend                                     | `npm run startf`       |
| Running the Backend (linux/mac)                          | `npm run startb-mac`   |
| Running the Backend (windows)                            | `npm run startb-win`   |

> **Note** It may take a minute for the app to show the graphs to start showing on each page load, and a few minutes for the backend to fully start. The message `None of PyTorch, TensorFlow >= 2.0, or Flax have been found...` can be safely ignored in anticipation of `* Debugger PIN: ...` which indicates the backend has fully started. If the frontend starts first before the backend, refresh the page so the frontend calls the backend again.

# DESCRIPTION & ARCHITECTURE

Using D3.js and Apexcharts, we compared the changing sentiments over time on over 2.3 million posts from multiple media platforms ranging from January 2015 to November 2022.

## Data Collection

We collected over 2.3 million posts, amounting to 190 GB before being processed down to 1.8 GB, from **Facebook, Reddit, The New York Times, The Guardian, CNN, and Twitter** ranging from January 2015 to November 2022 including by using the platforms' API and web scraping.

Some of those data collection scripts are located in [/Data Collection](./Data%20Collection), while the scripts for collecting posts from CNN and The Guardian are located in:

1. [The Guardian News Article Collector](https://github.com/farisdurrani/TheGuardianArticlesCollector) by @farisdurrani
1. [CNN Web Scraper](https://github.com/farisdurrani/CNNWebScraper) by @farisdurrani

The sentiments were calculated using [vaderSentiment~=3.3.2](https://pypi.org/project/vaderSentiment/), run by the script [make_sentiment.py](./Data%20Collection/make_sentiment.py).

## Frontend

Implemented in [/frontend](./Project/frontend/), the frontend is created on **React.JS**, and the visualizations by D3.js and Apexcharts.

### Demo video:

https://youtu.be/GgrfiH9w2js

https://user-images.githubusercontent.com/40067313/205411066-8f68f98e-1cb8-4cb1-bde3-85a4c2e68fcb.mp4

### Search bar

The page (`localhost:3000` by default) opens with a comfortable search bar where you can type in any search terms to find out the sentiment of those keywords, along with optional options like start and end dates as well as the media platform.

### Sentiment Legend

A simple legend shows up underneath, denoting that bars and areas colored red have negative sentiment posts, i.e., posts that are unpleasant, depressing, or harmful. Positive sentiments are blue.

### Timeline

The main graph is the Timeline, which shows the count of posts per day over time, and the color of the bars denoting the sentiments. The user can hover over each bar to find out the sentiment and count of posts of that date.

We also show several "significant events" (of our own choosing from Wikipedia) that contain those keywords in circles. These circles have the same height and color as the bar on that date. This allows the user to correlate certain significant change in sentiment with a significant event.

As an example, 1/12/2021 has a great deal of fairly negative posts which correlates with President Trump's second impeachment.

### Frequency Chart

As the user hovers over the Timeline above, this frequency chart also updates to show the breakdown of posts on that date.

### Bag of Words

We also provide a bubble chart to show the most frequent words in the time period as well as the mean sentiment of the posts containing those words.

### Fraction of Sentiment Polarities

The last pie chart derives from the bubble chart above to show the percentage of words that are positve negative (sentiment < 1), neutral (0), and (sentiment > 1).

## Backend

Implemented in [/backend](./Project/backend/), the backend of our app is a **Python** Flask app (`app.py` with support from `api.py`, live at `localhost:8000` by default) that converts the CSV files containing the data to a pandas dataframe which it uses to return the value queried by the front end as the user changes parameters like keywords and date ranges.

The queries are as follows (a more detailed description can be found in [BACKEND_API](./.github/BACKEND_API.md):

- `/ OR /test`:
  Given no parameters, return a simple Hello World message to indicate the backend is alive

- `/api/getSummary`:
  Given some filter parameters, give the summary of sentiment data.
  For each platform of each date, give its mean sentiment, as well as the mean sentiment of
  that date and the count of posts on that date.

- `/api/getBodyText`:
  Given a list of post IDs, return the full post data for each post

- `/api/getBagOfWords`:
  Given some filter parameters, return the number of occurrences across all
  posts of the most common words, along with the mean sentiment of all posts containing
  that word.

- `/api/getPlatformFrequencies`:
  Given filter parameters, return the count and mean sentiment of posts on each platform

# Next Steps
Our project could be improved in the future by making it update in real time as people post to the sites that we have analyzed. Another limitation to achieving this is the speed at which we wanted the tool to update. Our method of collecting the bag of words for the bubble chart is inefficient compared to perhaps using a vectorized approach.

# Authors

1. Faris Durrani [@farisdurrani](https://github.com/farisdurrani)
1. Justin Zandstra [@justinzandstra](https://github.com/justinzandstra)
1. Lakshmisree Iyengar [@lakshmisree-iitk](https://github.com/lakshmisree-iitk)
1. Nemath Ahmed [@nemathahmed](https://github.com/nemathahmed)
1. RenChu Wang [@rentruewang](https://github.com/rentruewang)
1. Shuyan Lin [@shuyanl915](https://github.com/shuyanl915)

# License

Sentiment Search is MIT licensed, as found in the [LICENSE](./LICENSE) file.

The software's documentation is Creative Commons licensed, as found in the [LICENSE-docs](./.github/LICENSE-docs) file.
