// @flow
import { wordCounter } from './util';
import _ from 'lodash';

describe('word counting', () => {

  type WordCount = { word: string, count: number }
  const pick = (count: WordCount[], word: string) => (_.find(count, co => co.word === word) || {});

  test('able to count words', () => {
    const string = 'aku kamu kami react native react redux , (*&( &*yu 8989';

    return wordCounter(string)
      .then(count => {
        // check should skipped words
        expect(pick(count, 'aku').count).toEqual(undefined);
        expect(pick(count, ',').count).toEqual(undefined);
        expect(pick(count, '(*&(').count).toEqual(undefined);
        expect(pick(count, '&*yu').count).toEqual(undefined);

        // test valid words
        expect(pick(count, 'kamu').count).toEqual(1);
        expect(pick(count, '8989').count).toEqual(1);
        expect(pick(count, 'kami').count).toEqual(1);
        expect(pick(count, 'react').count).toEqual(2);
        expect(pick(count, 'redux').count).toEqual(1);
        expect(pick(count, 'native').count).toEqual(1);
      });
  });

});