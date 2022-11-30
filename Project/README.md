# DVA Project

DVA Project for CS 6456 Spring 2022

#DESCRIPTION
Backend: The backend of our app is a python flask app (app.py with support from api.py) which
converts the csv files containing the data to a pandas dataframe which it uses to return the
value queried by the front end as the user changes parameters like keywords and date ranges.
The queries are as follows:

/ or /test :
Given no parameters, return a simple Hello World message to indicate the backend is alive
Example Response:
{
  "success": true,
  "message": "The backend is working"
}

/api/getSummary :
Given some filter parameters, give the summary of sentiment data.
For each platform of each date, give its mean sentiment, as well as the mean sentiment of
that date and the count of posts on that date.
Request Parameters:
	startDate: DEFAULT “2015-01-01”
	endDate: DEFAULT “2020-01-01”
	platform: DEFAULT “CNN”
	keywords: DEFAULT “Trump election won” (keywords should be separated by spaces)
	orderBy: DEFAULT “date”
	orderDescending: DEFAULT false
Example Response:
{
  "success": true,
  "rows": [
      {
          "date": "2015-01-01",
          "meanSentiment": 0.3793242,
          "count": 7,
          "posts": [
              {
                  "platform": "CNN",
                  "sentiment": 0.35353,
                  "postId": 234
              },
              {
                  "platform": "The Guardian",
                  "sentiment": 0.3353,
                  "postId": 423
              }
          ]
      },
      {
          "date": "2015-01-02",
          "meanSentiment": 0.3242,
          "count": 9,
          "posts": [
              {
                  "platform": "Reddit",
                  "sentiment": 0.435345,
                  "postId": 231
              },
              {
                  "platform": "Facebook",
                  "sentiment": 0.3353,
                  "postId": 5
              }
          ]
      }
  ]
}

/api/getBodyText :
Given a list of post IDs, return the full post data for each post

Request Parameters:
    postId: [324, 325] NOT NULL
    orderBy: DEFAULT “date”
    orderDescending: DEFAULT false
Example Response:
{
  "success": true,
  "count": 2,
  "posts": [
    {
      "postId": 324,
      "sentiment": 0.35,
      "bodyText": "Aliens are alive and real in Area 51",
      "platform": "Reddit",
      "date": "2020-12-09"
    },
    {
      "postId": 325,
      "sentiment": 0.33,
      "bodyText": "Aliens are not alive and real in Area 51",
      "platform": "Facebook",
      "date": "2020-12-08"
    }
  ]
}

/api/getBagOfWords :
Given some filter parameters, return the number of occurrences across all
posts of the most common words, along with the mean sentiment of all posts containing
that word.

Request Parameters (all can be null):
    postId: DEFAULT [] (a list of ids)
    startDate: DEFAULT “2015-01-01”
    endDate: DEFAULT “2020-01-01”
    platform: DEFAULT “CNN”
    keywords: DEFAAULT “Trump election won”
    limitCountOfPostsPerDate: DEFAULT 10
    limitAmountOfWords: DEFAULT 50
    orderBy: DEFAULT count
    orderDescending: DEFAULT true
Example Response:
{
  "success": true,
  "bagOfWords": [
    { "word": "trump", "count": 10, "meanSentiment": 0.435 },
    { "word": "den", "count": 20, "meanSentiment": -0.44 }
  ]
}

/api/getPlatformFrequencies :
Request Params (all can be null):
    postId: DEFAULT [] (a list of ids)
    startDate: DEFAULT “2015-01-01”
    endDate: DEFAULT “2020-01-01”
    keywords: DEFAULT “Trump election won”
    limitCountOfPostsPerDate: DEFAULT 10
    limitAmountOfWords: DEFAULT 50
    orderBy: DEFAULT “count”
    orderDescending: DEFAULT true



#INSTALLATION
## Prerequisites/System Requirements:

1. [NodeJS v18](https://nodejs.org/en/download/)
1. NPM v9: `npm install npm@latest -g`
1. [Python 3.10](https://www.python.org/downloads/release/python-3108/)

## Run the following (note the different install commands for Mac/Linux and Windows:

| Action                                                    | Command                |
| ----------------------------------------------------------| ------------------     |
| Install / Update Frontend Packages (one-time)             | `npm run installf`     |
| Install / Update Backend Packages (one-time) (linux/mac)  | `npm run installb-mac` |
| Install / Update Backend Packages (one-time) (windows)    | `npm run installb-win` |
| Running the Frontend                                      | `npm run startf`       |
| Running the Backend (linux/mac)                           | `npm run startb-mac`   |
| Running the Backend (windows)                             | `npm run startb-win`   |

# Authors

1. Faris Durrani
1. Justin Zandstra
1. Lakshmisree Iyengar
1. Nemath Ahmed
1. RenChu Wang
1. Shuyan Lin

# License

The DVA Project is MIT licensed, as found in the [LICENSE](./LICENSE) file.

The software's documentation is Creative Commons licensed, as found in the [LICENSE-docs](./.github/LICENSE-docs) file.
