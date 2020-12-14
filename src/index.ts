import axios from 'axios';
import cheerio from 'cheerio';
import Parser from 'rss-parser';


type CustomFeed = { foo: string };
type CustomItem = { bar: number };
// // example of using types to ensure accurate data
// const parser: Parser<CustomFeed, CustomItem> = new Parser({
//   customFields: {
//     feed: ['foo', 'baz'],
//     //            ^ will error because `baz` is not a key of CustomFeed
//     item: ['bar']
//   }
// });

const parser = new Parser();
type NewsFeed = {
  name: string;
  rss: string;
}

const newsFeeds: NewsFeed[] = [
  {
    name: 'CNN',
    rss: 'http://rss.cnn.com/rss/cnn_topstories.rss'
  },
  {
    name: 'New_York_Times',
    rss: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
  },
  {
    name: 'Washington_Post',
    rss: 'http://feeds.washingtonpost.com/rss/national'
  },
  {
    name: 'NPR',
    rss: 'https://feeds.npr.org/1001/rss.xml'
  },
  {
    name: 'Fox_News',
    rss: 'http://feeds.foxnews.com/foxnews/national'
  },
  {
    name: 'OANN',
    rss: 'https://www.oann.com/category/newsroom/feed/'
    // contentSnippet appears to contain description
  },


]
// const cnnUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss'
const cnnUrl = 'http://feeds.foxnews.com/foxnews/national'
const cnnRssData = async () => {

  // const feed = await parser.parseURL('https://www.reddit.com/.rss');
  const feed = await parser.parseURL(cnnUrl);
  console.log("feed: ")
  console.log(feed)
  console.log("first element: ")
  console.log(feed.items[0].contentSnippet)
  // console.log(feed.title); // feed will have a `foo` property, type as a string

  // feed.items.forEach(item => {
  // console.log(item.title + ':' + item.link) // item will have a `bar` property type as a number
  // });
}
cnnRssData();



// scraper for soccer stuff demo
// get data from the soccer feed
const getData = async () => {
  const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1'; // URL we're scraping
  // This is the structure of the player data we receive
  interface PlayerData {
    rank: number; // 1 - 20 rank
    name: string;
    nationality: string;
    goals: number;
  }
  try {
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html); // Load the HTML string into cheerio
    const statsTable = $('.statsTableContainer > tr'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
    console.log(statsTable); // Log the number of captured elements

    const topScorers: PlayerData[] = [];
    statsTable.each((i, elem) => {
      const rank: number = parseInt($(elem).find('.rank > strong').text()); // Parse the rank
      const name: string = $(elem).find('.playerName > strong').text(); // Parse the name
      const nationality: string = $(elem).find('.playerCountry').text(); // Parse the country
      const goals: number = parseInt($(elem).find('.mainStat').text()); // Parse the number of goals
      topScorers.push({
        rank,
        name,
        nationality,
        goals
      })
    })
    console.log(topScorers);
  } catch (err) {
    console.error(err);
  }
}

// getData();