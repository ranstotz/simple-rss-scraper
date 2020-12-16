import Parser from 'rss-parser';
import { forkJoin, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

const parser = new Parser();

// use from to transform the promise returned by parser into an observable
const targetFeeds = {
  cnn: from(parser.parseURL('http://rss.cnn.com/rss/cnn_topstories.rss')).pipe(catchError(error => of(error))),
  nytimes: from(parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')).pipe(catchError(error => of(error))),
  wapo: from(parser.parseURL('http://feeds.washingtonpost.com/rss/national')).pipe(catchError(error => of(error))),
  npm: from(parser.parseURL('https://feeds.npr.org/1001/rss.xml')).pipe(catchError(error => of(error))),
  foxnews: from(parser.parseURL('http://feeds.foxnews.com/foxnews/national')).pipe(catchError(error => of(error))),
  oann: from(parser.parseURL('https://www.oann.com/category/newsroom/feed/')).pipe(catchError(error => of(error))),
  // error scenario for bad url
  // oann: from(parser.parseURL('https://www.oasdffdnn.com/csfdsaflkjategory/newsroom/feed/')).pipe(catchError(error => of(error))),
}

// TODO:
// use pipe on forkjoin, then filter the data we want into a format that can be sent to firestore
// potentially store any error data elsewhere (or filter it entirely, or just say 'error')
const observable = forkJoin(targetFeeds);
observable.subscribe(console.log);


// lesson: https://www.learnrxjs.io/learn-rxjs/operators/transformation/map#signature-map-project-function-thisarg-any-observable
// forkjoin: https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
