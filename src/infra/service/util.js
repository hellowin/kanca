// @flow
import _ from 'lodash';
import moment from 'moment-timezone';

export const syncToPromise = <T>(func: Function): Promise<T> => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      resolve(func());
    } catch (e) {
      reject(e);
    }
  }, 0);
});

export const wordCounter = (string: string): Promise<{ word: string, count: number }[]> => syncToPromise(() => {
  const count: { [string]: { word: string, count: number } } = {};
  
  const words = _.words(string).map(word => word.toLowerCase()).filter(word => word.length > 3);
  _.each(words, word => {
    if (!count[word]) count[word] = { word, count: 0 };
    count[word].count += 1;
  });
  return _.sortBy(_.values(count), 'count').reverse().slice(0, 300);
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
  wordCounter,
  timeRangeToString,
  githubStar,
};
