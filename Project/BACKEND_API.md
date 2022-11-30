This document details the usage of the api for out project, including parameters and sample responses.

# /	OR	/test
</br>Given no parameters, return a simple Hello World message to indicate the backend is alive

## Sample Response:
</br>{</br>
  "success": true,</br>
  "message": "The backend is working",</br>
}

# /api/getSummary
</br>Given some filter parameters, give the summary of sentiment data. For each platform of each date, give its mean sentiments well as the mean sentiment of that date and the count of posts on that date.

## Request Params (all can be null): 
- startDate: DEFAULT “2015-01-01”
- endDate: DEFAULT “2020-01-01”
- platform: DEFAULT “CNN”
- keywords: DEFAULT “Trump election won”
- orderBy: DEFAULT “date”
- orderDescending: DEFAULT false

## Sample Response:
</br>{</br>
  "success": true,</br>
  "rows": [</br>
      {</br>
          "date": "2015-01-01",</br>
          "meanSentiment": 0.3793242,</br>
          "count": 7,</br>
          "posts": [</br>
              {</br>
                  "platform": "CNN",</br>
                  "sentiment": 0.35353,</br>
                  "postId": 234</br>
              },</br>
              {</br>
                  "platform": "The Guardian",</br>
                  "sentiment": 0.3353,</br>
                  "postId": 423</br>
              }</br>
          ]</br>
      },</br>
      {</br>
          "date": "2015-01-02",</br>
          "meanSentiment": 0.3242,</br>
          "count": 9,</br>
          "posts": [</br>
              {</br>
                  "platform": "Reddit",</br>
                  "sentiment": 0.435345,</br>
                  "postId": 231</br>
              },</br>
              {</br>
                  "platform": "Facebook",</br>
                  "sentiment": 0.3353,</br>
                  "postId": 5</br>
              }</br>
          ]</br>
      }</br>
  ]</br>
}</br>

# /api/getBodyText
Given a list of post IDs, return the full post data for each post.

## Request Params: 
- postId: [324, 325] NOT NULL
- orderBy: DEFAULT “date”
- orderDescending: DEFAULT false

## Sample Response:
</br>{</br>
  "success": true,</br>
  "count": 2,</br>
  "posts": [</br>
    {</br>
      "postId": 324,</br>
      "sentiment": 0.35,</br>
      "bodyText": "Aliens are alive and real in Area 51",</br>
      "platform": "Reddit",</br>
      "date": "2020-12-09"</br>
    },</br>
    {</br>
      "postId": 325,</br>
      "sentiment": 0.33,</br>
      "bodyText": "Aliens are not alive and real in Area 51",</br>
      "platform": "Facebook",</br>
      "date": "2020-12-08"</br>
    }</br>
  ]</br>
}</br>

# /api/getBagOfWords
Given some filter parameters, return the number of occurrences across all posts of the most common words, along with the mean sentiment of all posts containing that word

## Request Params (all can be null):
- postId: DEFAULT [] (list of integers)
- startDate: DEFAULT “2015-01-01”
- endDate: DEFAULT “2020-01-01”
- platform: DEFAULT “CNN”
- keywords: DEFAULT “Trump election won”
- limitCountOfPostsPerDate: DEFAULT 10
- limitAmountOfWords: DEFAULT 50
- orderBy: DEFAULT count
- orderDescending: DEFAULT true

## Sample Response:
</br>{</br>
  "success": true,</br>
  "bagOfWords": [</br>
    { "word": "trump", "count": 10, "meanSentiment": 0.435 },</br>
    { "word": "den", "count": 20, "meanSentiment": -0.44 }</br>
  ]</br>
}</br>

# /api/getPlatformFrequencies
Given filter parameters, return the count and mean sentiment of posts on each platform

## Request Params (all can be null):
- postId: DEFAULT [] (list of integers)
- startDate: DEFAULT “2015-01-01”
- endDate: DEFAULT “2020-01-01”
- keywords: DEFAULT “Trump election won”
- limitCountOfPostsPerDate: DEFAULT 10
- limitAmountOfWords: DEFAULT 50
- orderBy: DEFAULT “count”
- orderDescending: DEFAULT true

# Sample Response:
</br>{</br>
  "success": true,</br>
  "frequencies": [</br>
    { "platform": "CNN", "count": 10, "meanSentiment": 0.34 },</br>
    { "platform": "The Guardian", "count": 11, "meanSentiment": -0.34 }</br>
  ]</br>
}</br>