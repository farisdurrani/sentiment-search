# Backend API Calls

This document details the usage of the backend Python Flask API for our project, including parameters and sample responses.

Each of these HTTP GET query paths should be appended to the hostname (by default, `http://127.0.0.1:8000`) and added parameters (query strings) as needed.

# /	OR	/test
For `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/test`, given no parameters, return a simple Hello World message to indicate the backend is alive.

## Sample Response:
```
{
  "success": true,
  "message": "The backend is working",
}
```

# /api/getSummary
Given some filter parameters, give the summary of sentiment data. For each platform of each date, give its mean sentiments well as the mean sentiment of that date and the count of posts on that date.

## Request Params (all can be null): 
- startDate: DEFAULT 2015-01-01
- endDate: DEFAULT 2020-01-01
- platform: DEFAULT CNN
- keywords: DEFAULT Trump election won
- orderBy: DEFAULT date
- orderDescending: DEFAULT false

## Sample Response:
```
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
```

# /api/getBodyText
Given a list of post IDs, return the full post data for each post.

## Request Params: 
- postId: [324, 325] NOT NULL
- orderBy: DEFAULT date
- orderDescending: DEFAULT

## Sample Response:
```
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
```

# /api/getBagOfWords
Given some filter parameters, return the number of occurrences across all posts of the most common words, along with the mean sentiment of all posts containing that word

## Request Params (all can be null):
- postId: DEFAULT [] (list of integers)
- startDate: DEFAULT 2015-01-01
- endDate: DEFAULT 2020-01-01
- platform: DEFAULT CNN
- keywords: DEFAULT Trump election won
- limitCountOfPostsPerDate: DEFAULT 10
- limitAmountOfWords: DEFAULT 50
- orderBy: DEFAULT count
- orderDescending: DEFAULT true

## Sample Response:
```
{
  "success": true,
  "bagOfWords": [
    { "word": "trump", "count": 10, "meanSentiment": 0.435 },
    { "word": "den", "count": 20, "meanSentiment": -0.44 }
  ]
}
```

# /api/getPlatformFrequencies
Given filter parameters, return the count and mean sentiment of posts on each platform

## Request Params (all can be null):
- postId: DEFAULT [] (list of integers)
- startDate: DEFAULT 2015-01-01
- endDate: DEFAULT 2020-01-01
- keywords: DEFAULT Trump election won
- limitCountOfPostsPerDate: DEFAULT 10
- limitAmountOfWords: DEFAULT 50
- orderBy: DEFAULT count
- orderDescending: DEFAULT true

## Sample Response:
```
{
  "success": true,
  "frequencies": [
    { "platform": "CNN", "count": 10, "meanSentiment": 0.34 },
    { "platform": "The Guardian", "count": 11, "meanSentiment": -0.34 }
  ]
}
```