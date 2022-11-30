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
- limitCountOfPostsPerDate: 10
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

/api/getBodyText
Given a list of post IDs, return the full post data for each post.

Request Params: 
postId: [324, 325] NOT NULL
orderBy: DEFAULT “date”
orderDescending: DEFAULT false
Response:
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

/api/getBagOfWords
Given some filter parameters, return the number of occurrences across all posts of the most common words, along with the mean sentiment of all posts containing that word

Request Params (all can be null):
postId: [324, 325]
startDate: “2015-01-01”
endDate: “2020-01-01”
platform: “CNN”
keywords: “Trump election won”
limitCountOfPostsPerDate: 10
limitAmountOfWords: 50
orderBy: DEFAULT count
orderDescending: DEFAULT true
Response:
{
  "success": true,
  "bagOfWords": [
    { "word": "trump", "count": 10, "meanSentiment": 0.435 },
    { "word": "den", "count": 20, "meanSentiment": -0.44 }
  ]
}
/api/getPlatformFrequencies
Request Params (all can be null):
postId: [324, 325]
startDate: “2015-01-01”
endDate: “2020-01-01”
keywords: “Trump election won”
limitCountOfPostsPerDate: 10
limitAmountOfWords: 50
orderBy: DEFAULT “count”
orderDescending: DEFAULT true
Response:
{
  "success": true,
  "frequencies": [
    { "platform": "CNN", "count": 10, "meanSentiment": 0.34 },
    { "platform": "The Guardian", "count": 11, "meanSentiment": -0.34 }
  ]
}