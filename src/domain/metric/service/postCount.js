// @flow
import _ from 'lodash';

export default (feeds: {}[]): { sharesCount: number, likesCount: number }[] => {
  // calculate post
  _.each(feeds, post => {
    post.sharesCount = ((post.shares || {}).count || 0);
    post.likesCount = (((post.likes || {}).data || []).length || 0);
  });
  return feeds;
};