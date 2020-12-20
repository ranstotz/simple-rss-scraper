import Parser from 'rss-parser';
import { forkJoin, of, from, Observable } from 'rxjs';
import { tap, map, first, take, catchError, concatMap, mergeMap, toArray, filter, mergeAll } from 'rxjs/operators';

const parser = new Parser();

// use from to transform the promise returned by parser into an observable
const targetFeeds = {
  cnn: from(parser.parseURL('http://rss.cnn.com/rss/cnn_topstories.rss')).pipe(catchError(error => of(error))),
  nytimes: from(parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')).pipe(catchError(error => of(error))),
  wapo: from(parser.parseURL('http://feeds.washingtonpost.com/rss/national')).pipe(catchError(error => of(error))),
  npr: from(parser.parseURL('https://feeds.npr.org/1001/rss.xml')).pipe(catchError(error => of(error))),
  foxnews: from(parser.parseURL('http://feeds.foxnews.com/foxnews/national')).pipe(catchError(error => of(error))),
  oann: from(parser.parseURL('https://www.oann.com/category/newsroom/feed/')).pipe(catchError(error => of(error))),
  // error scenario for bad url
  // oann: from(parser.parseURL('https://www.oasdffdnn.com/csfdsaflkjategory/newsroom/feed/')).pipe(catchError(error => of(error))),
}

const feeds = [
  { name: 'cnn', url: 'http://rss.cnn.com/rss/cnn_topstories.rss' },
  { name: 'nytimes', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' },
  // { name: 'wapo', url: 'http://feeds.washingtonpost.com/rss/national' },
  // { name: 'npr', url: 'https://feeds.npr.org/1001/rss.xml' },
  // { name: 'foxnews', url: 'http://feeds.foxnews.com/foxnews/national' },
  // { name: 'oann', url: 'https://www.oann.com/category/newsroom/feed/' },
  // error scenario for bad url
  // { name: 'oann', url: 'https://www.oasdffdnn.com/csfdsaflkjategory/newsroom/feed/' },
]

// I probably want the resulting structure to be: 
const singleStructure = { name: 'cnn', items: [{ myItems: 'hi' }, { myItems: 'hi' }] }

// get data
const feedObs = of(feeds);
const res = feedObs.pipe(
  concatMap((feed) => {
    const networkRequests = feed.map(val => from(parser.parseURL(val.url)).pipe(catchError(error => of(error))))
    return forkJoin(networkRequests)
  }),
  mergeAll(), // unnests the object into an array
  map(val => val.items) // strip unnecessary metadata and get the rss items and return the target rss items
)
// res.subscribe(signal => console.log('signal', signal))
// filter data
res.subscribe(console.log)
// res.subscribe()

// TODO:
// should change data structure for urls to be [{name: 'cnn', observable: 'whatever'}]
// basically follow this: https://stackoverflow.com/questions/58963598/angular-2-subscribed-array-of-object-with-nested-subscribes-in-loop-foreach
// const observable = forkJoin(targetFeeds).pipe(map(res => { console.log(res['wapo']) })); // gets wapo from feeds
// observable.subscribe();

// lesson: https://www.learnrxjs.io/learn-rxjs/operators/transformation/map#signature-map-project-function-thisarg-any-observable
// forkjoin: https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
// flatten object with some nice syntax: 
// https://stackoverflow.com/questions/58963598/angular-2-subscribed-array-of-object-with-nested-subscribes-in-loop-foreach