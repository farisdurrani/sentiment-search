from argparse import ArgumentParser
from os import path as os_path
from time import sleep

import pandas as pd
import praw
from tqdm import tqdm

# Get credentials from DEFAULT instance in praw.ini
reddit = praw.Reddit()


class SubredditScraper:
    def __init__(self, sub, sort="new", lim=900, fil="day", mode="w"):
        self.sub = sub
        self.sort = sort
        self.lim = lim
        self.fil = fil
        self.mode = mode
        print(
            f"SubredditScraper instance created with values "
            f"sub = {sub}, sort = {sort}, lim = {lim}, mode = {mode}"
        )

    def set_sort(self):
        if self.sort in {"new", "top", "hot"}:
            fn = getattr(reddit.subreddit(self.sub), self.sort)
            return self.sort, fn(limit=self.lim, time_filter=self.fil)
        else:
            self.sort = "hot"
            print("Sort method was not recognized, defaulting to hot.")
            return self.sort, reddit.subreddit(self.sub).hot(limit=self.lim)

    def get_posts(self):
        """Get unique posts from a specified subreddit."""

        attributes = [
            "selftext",
            "title",
            "id",
            "sorted_by",
            "num_comments",
            "score",
            "ups",
            "downs",
            "created_utc",
        ]
        sub_dict = {key: [] for key in attributes}

        csv = f"{self.sub}_posts.csv"

        # Attempt to specify a sorting method.
        sort, subreddit = self.set_sort()

        # Set csv_loaded to True if csv exists since you can't
        # evaluate the truth value of a DataFrame.
        csv_loaded = os_path.isfile(csv)
        if csv_loaded:
            df = pd.read_csv(csv)
        else:
            df = ""

        print(f"csv = {csv}")
        print(f"After set_sort(), sort = {sort} and sub = {self.sub}")
        print(f"csv_loaded = {csv_loaded}")

        print(f"Collecting information from r/{self.sub}.")

        for post in tqdm(subreddit):
            # Check if post.id is in df and set to True if df is empty.
            # This way new posts are still added to dictionary when df = ''
            unique_id = post.id not in df.id if csv_loaded else True
            # print(unique_id)
            # print(df.id)
            # print(post.id)

            # Save any unique posts to sub_dict.
            if unique_id:
                sub_dict["selftext"].append(post.selftext)
                sub_dict["title"].append(post.title)
                sub_dict["id"].append(post.id)
                sub_dict["sorted_by"].append(sort)
                sub_dict["num_comments"].append(post.num_comments)
                sub_dict["score"].append(post.score)
                sub_dict["ups"].append(post.ups)
                sub_dict["downs"].append(post.downs)
                sub_dict["created_utc"].append(post.created_utc)
            sleep(0.1)

        new_df = pd.DataFrame(sub_dict)

        # Add new_df to df if df exists then save it to a csv.
        if isinstance(df, pd.DataFrame) and self.mode == "w":
            pd.concat([df, new_df], axis=0, sort=0).to_csv(csv, index=False)
            print(f"{len(new_df)} new posts collected and added to {csv}")
        elif self.mode == "w":
            new_df.to_csv(csv, index=False)
            print(f"{len(new_df)} posts collected and saved to {csv}")
        else:
            print(
                f"{len(new_df)} posts were collected but they were not "
                f'added to {csv} because mode was set to "{self.mode}"'
            )


if __name__ == "__main__":

    parser = ArgumentParser()

    parser.add_argument(
        "-s",
        "--subreddit",
        type=str,
        help="Subreddit to collect",
    )
    parser.add_argument(
        "-l",
        "--limit",
        type=int,
        help="Maximum number of posts to scrape",
    )
    parser.add_argument(
        "-o",
        "--order",
        type=str,
        choices="top hot new".split(),
        help="Sort posts according to this method",
    )
    parser.add_argument(
        "-f",
        "--filter",
        type=str,
        choices="hour day week month year all".split(),
        help="Filtering by time",
    )

    flags = vars(parser.parse_args())
    SubredditScraper(
        flags["subreddit"],
        lim=flags["limit"],
        sort=flags["order"],
        fil=flags["filter"],
        mode="w",
    ).get_posts()
