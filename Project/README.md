# DVA Project

DVA Project for CS 6456 Spring 2022

# DESCRIPTION

## Backend 
The backend of our app is a python flask app (app.py with support from api.py) which
converts the csv files containing the data to a pandas dataframe which it uses to return the
value queried by the front end as the user changes parameters like keywords and date ranges.

The queries are as follows (a more detailed description can be found in [BACKEND_API](./BACKEND_API.md)

- / or /test :
Given no parameters, return a simple Hello World message to indicate the backend is alive


- /api/getSummary :
Given some filter parameters, give the summary of sentiment data.
For each platform of each date, give its mean sentiment, as well as the mean sentiment of
that date and the count of posts on that date.

- /api/getBodyText :
Given a list of post IDs, return the full post data for each post

- /api/getBagOfWords :
Given some filter parameters, return the number of occurrences across all
posts of the most common words, along with the mean sentiment of all posts containing
that word.


- /api/getPlatformFrequencies :
Given filter parameters, return the count and mean sentiment of posts on each platform



# INSTALLATION
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
