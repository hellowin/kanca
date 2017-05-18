// @flow
import _ from 'lodash';
import moment from 'moment-timezone';
import stopWordsId from './stopwords.id';
import stopWordsEn from './stopwords.en';

export const syncToPromise = <T>(func: Function): Promise<T> => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      resolve(func());
    } catch (e) {
      reject(e);
    }
  }, 0);
});

export const cancelablePromise = <T>(promise: Promise<T>): { promise: Promise<T>, cancel: Function } => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => (hasCanceled ? reject(new Error('cancelled')) : resolve(val)));
    promise.catch((error) => (hasCanceled ? reject(new Error('cancelled')) : reject(error)));
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

export const wordCounter = (string: string): Promise<{ word: string, count: number }[]> => syncToPromise(() => {
  const count: { [string]: { word: string, count: number } } = {};
  
  const words = _.words(string).map(word => word.toLowerCase()).filter(word => word.length > 3);
  _.each(words, word => {
    if (!count[word]) count[word] = { word, count: 0 };
    count[word].count += 1;
  });

  // remove stopwords
  const stopWords = [...stopWordsId.split('\n'), ...stopWordsEn.split('\n')].filter(word => word.length > 3);
  const cleanCount = _.filter(_.values(count), ({ word }) => !_.includes(stopWords, word));
  return _.sortBy(cleanCount, 'count').reverse().slice(0, 300);
});

export const timeRangeToString = (dateStart: Date, dateEnd: Date): string => {
    const end = moment(dateEnd);
    const start = moment(dateStart);
    let fixDateStart;

    if (end.isSame(start, 'd') && end.isSame(start, 'M') && end.isSame(start, 'y')) {
      fixDateStart = null;
    } else if (end.isSame(start, 'M') && end.isSame(start, 'y')) {
      fixDateStart = start.clone().format('ddd, DD');
    } else if (end.isSame(start, 'y')) {
      fixDateStart = start.clone().format('ddd, DD MMM');
    } else {
      fixDateStart = start.clone().format('ddd, DD MMM YYYY');
    }
    const fixDateEnd = end.clone().format('ddd, DD MMM YYYY');

    return fixDateStart ? `${fixDateStart} - ${fixDateEnd}` : fixDateEnd;
};

export const githubStar = () => {
  return fetch('https://api.github.com/repos/hellowin/kanca')
    .then(response => response.json())
    .then(json => {
      return json;
    });
};

export default {
  syncToPromise,
  cancelablePromise,
  wordCounter,
  timeRangeToString,
  githubStar,
};
