import Parser from 'rss-parser';
import { forkJoin } from 'rxjs';



const targetFeeds = [
  // contentSnippet appears to contain description
  'http://rss.cnn.com/rss/cnn_topstories.rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  'http://feeds.washingtonpost.com/rss/national',
  'https://feeds.npr.org/1001/rss.xml',
  'http://feeds.foxnews.com/foxnews/national',
  'https://www.oann.com/category/newsroom/feed/',
]
const parser = new Parser();
const feedArray = targetFeeds.map((feed) => {
  return parser.parseURL(feed);
})

console.log(feedArray)

const observable = forkJoin(feedArray);
observable.subscribe((resArray) => {
  resArray.map((item) => {
    console.log(item.title)
  })
})

// the observable pattern below works well
// implement this with RxJS style pipes to collect all necessary data. 

// const firstUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss';
// const secondUrl = 'http://feeds.foxnews.com/foxnews/national';
// const observable = forkJoin([parser.parseURL(firstUrl), parser.parseURL(secondUrl)]);
// observable.subscribe(([resA, resB]) => {
//   console.log(resA.title)
//   console.log(resB.title)
// })



// rss-parser types example
// type CustomFeed = { foo: string };
// type CustomItem = { bar: number };
// // example of using types to ensure accurate data
// const parser: Parser<CustomFeed, CustomItem> = new Parser({
//   customFields: {
//     feed: ['foo', 'baz'],
//     //            ^ will error because `baz` is not a key of CustomFeed
//     item: ['bar']
//   }
// });


