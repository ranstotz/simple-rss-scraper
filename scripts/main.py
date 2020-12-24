import feedparser
import pprint
import re

pp = pprint.PrettyPrinter(indent=4)

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

max_articles = 5

# not all feeds provide these, need to account for that
target_keys = ['author', 'link', 'published', 'title', 'summary']


def sanitize_input(input: str) -> str:
    ''' Removes html tags and strips whitespace chars (' ', \n, \r, tab). '''
    res = re.sub('<[^<]+?>', '', input).strip()
    res = res.replace(u'\xa0', u' ')
    res = res.replace('\n', '')
    res = res.replace('\r', '')
    return res


def get_articles(target_rss_feed: str, max_articles: int) -> list:
    ''' gets articles for the specific rss feed '''
    rss_data = feedparser.parse(target_rss_feed)
    articles = rss_data.entries[0:max_articles]
    # print('type', type(articles))
    # pp.pprint(articles)
    return articles


articles = get_articles(feeds[1]['url'], max_articles)


def filter_article(article: dict, filter_fields: list) -> dict:
    ''' takes full article and filters the fields based on filter_field list provided. '''
    def field_sanitizer(_article: dict, _field: str) -> str:
        ''' sanitizes field and returns empty field if dict key doesn't exist. '''
        res = ''
        try:
            res = sanitize_input(_article[_field])
        except:
            res = ''
        return res

    filtered_dict = {field: field_sanitizer(
        article, field) for field in filter_fields}
    return filtered_dict


# gather all returned articles and filter them
filtered_articles = [filter_article(article, target_keys)
                     for article in articles]

pp.pprint(filtered_articles)

feed_data = []
for item in feeds:
    articles = get_articles(item['url'], max_articles)
    res = {
        item['name']: [filter_article(article, target_keys)
                       for article in articles]
    }
    feed_data.append(res)

pp.pprint(feed_data)
# do something with feed_data
# restructure script to be more friendly
