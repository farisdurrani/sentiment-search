from os.path import isfile
from time import sleep

import pandas as pd
import praw

# Get credentials from DEFAULT instance in praw.ini
reddit = praw.Reddit()


class SubredditScraper:
    def __init__(self, sub, sort="new", lim=900, mode="w"):
        self.sub = sub
        self.sort = sort
        self.lim = lim
        self.mode = mode
        print(
            f"SubredditScraper instance created with values "
            f"sub = {sub}, sort = {sort}, lim = {lim}, mode = {mode}"
        )

    def set_sort(self):
        if self.sort in {"new", "top", "hot"}:
            fn = getattr(reddit.subreddit(self.sub), self.sort)
            return self.sort, fn(limit=self.lim)
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
            "new_comments",
            "score",
            "ups",
            "downs",
        ]
        sub_dict = {key: [] for key in attributes}

        csv = f"{self.sub}_posts.csv"

        # Attempt to specify a sorting method.
        sort, subreddit = self.set_sort()

        # Set csv_loaded to True if csv exists since you can't
        # evaluate the truth value of a DataFrame.
        csv_loaded = isfile(csv)
        if csv_loaded:
            df = pd.read_csv(csv)
        else:
            df = ""

        print(f"csv = {csv}")
        print(f"After set_sort(), sort = {sort} and sub = {self.sub}")
        print(f"csv_loaded = {csv_loaded}")

        print(f"Collecting information from r/{self.sub}.")

        for post in subreddit:

            # Check if post.id is in df and set to True if df is empty.
            # This way new posts are still added to dictionary when df = ''
            unique_id = post.id not in tuple(df.id) if csv_loaded else True

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
    SubredditScraper("polictics", lim=997, mode="w", sort="new").get_posts()
