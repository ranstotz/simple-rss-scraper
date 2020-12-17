import Parser from 'rss-parser';
import { forkJoin, of, from } from 'rxjs';
import { map, first, take, catchError, concatMap } from 'rxjs/operators';

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

// TODO:

// should change data structure for urls to be [{name: 'cnn', observable: 'whatever'}]
// basically follow this: https://stackoverflow.com/questions/58963598/angular-2-subscribed-array-of-object-with-nested-subscribes-in-loop-foreach
const observable = forkJoin(targetFeeds).pipe(map(res => { console.log(res['wapo']) })); // gets wapo from feeds

observable.subscribe();

// observable.subscribe(console.log);




// lesson: https://www.learnrxjs.io/learn-rxjs/operators/transformation/map#signature-map-project-function-thisarg-any-observable
// forkjoin: https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin

// flatten object with some nice syntax: 
// https://stackoverflow.com/questions/58963598/angular-2-subscribed-array-of-object-with-nested-subscribes-in-loop-foreach