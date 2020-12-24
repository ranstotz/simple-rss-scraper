import feedparser
import pprint
import re

pp = pprint.PrettyPrinter(indent=4)


def sanitize_input(input: str) -> str:
    ''' Removes html tags and strips whitespace chars (' ', \n, \r, tab). '''
    return re.sub('<[^<]+?>', '', input).strip()


feeds = [
    {'name': 'cnn', 'url': 'http://rss.cnn.com/rss/cnn_topstories.rss'},
    {'name': 'nytimes', 'url': 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'},
    {'name': 'wapo', 'url': 'http://feeds.washingtonpost.com/rss/national'},
    {'name': 'npr', 'url': 'https://feeds.npr.org/1001/rss.xml'},
    {'name': 'foxnews', 'url': 'http://feeds.foxnews.com/foxnews/national'},
    {'name': 'oann', 'url': 'https://www.oann.com/category/newsroom/feed/'},
    # error scenario for bad url
    # { name: 'oann', url: 'https://www.oasdffdnn.com/csfdsaflkjategory/newsroom/feed/' },
]

max_articles = 3

# not all feeds provide these, need to account for that
target_keys = ['author', 'link', 'published', 'title', 'summary']


def get_articles(target_rss_feed: str, max_articles: int) -> list:
    ''' gets articles for the specific rss feed '''
    rss_data = feedparser.parse(target_rss_feed)
    articles = rss_data.entries[0:max_articles]
    # print('type', type(articles))
    # pp.pprint(articles)
    return articles


returned_articles = get_articles(feeds[0]['url'], max_articles)


def filter_article(article: dict, filter_fields: list) -> dict:
    ''' takes full article and filters the fields based on filter_field list provided. '''
    def field_getter(_article: dict, _field: str) -> str:
        ''' return empty field if dict key doesn't exist. '''
        res = ''
        try:
            res = _article[_field]
        except:
            res = ''
        return res

    filtered_dict = {field: field_getter(
        article, field) for field in filter_fields}
    return filtered_dict


# gather all returned articles and filter them
filtered_articles = [filter_article(article, target_keys)
                     for article in returned_articles]

pp.pprint(filtered_articles)
