// @flow
import { syncToPromise, wordCounter } from './util';
import _ from 'lodash';

describe('sync to promise', () => {

  it('able to generate promise from sync operation', () =>
    syncToPromise(() => {
      return 1 + 1;
    })
      .then(res => expect(res).toEqual(2))
  );

  it('able to generate promise from promise operation', () =>
    syncToPromise(() => Promise.resolve(1 + 1))
      .then(res => expect(res).toEqual(2))
  );

  it('able to catch error from sync operation', () =>
    syncToPromise(() => {
      throw new Error('ERROR');
    })
      .catch(err => expect(err.message).toEqual('ERROR'))
  );

  it('able to catch error from promise operation', () =>
    syncToPromise(() => Promise.reject(new Error('ERROR')))
      .catch(err => expect(err.message).toEqual('ERROR'))
  );

});

describe('word counting', () => {

  type WordCount = { word: string, count: number }
  const pick = (count: WordCount[], word: string) => (_.find(count, co => co.word === word) || {});

  it('able to count words', () => {
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