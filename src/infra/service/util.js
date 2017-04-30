// @flow
import _ from 'lodash';

export const syncToPromise = (func: Function) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(func());
    }, 0);
  } catch (e) {
    reject(e);
  }
});

export const wordCounter = (string: string): Promise<{ word: string, count: number }[]> => syncToPromise(() => {
  const count: { [string]: { word: string, count: number } } = {};
  
  const words = _.words(string).map(word => word.toLowerCase()).filter(word => word.length > 3);
  _.each(words, word => {
    if (!count[word]) count[word] = { word, count: 0 };
    count[word].count += 1;
  });
  return _.sortBy(_.values(count), 'count').reverse().slice(0, 500);
});

export default {
  syncToPromise,
  wordCounter,
};
