export default (feeds: {}[]): { sharesCount: number, likesCount: number }[] => {
  // calculate post
  return feeds.map(post => ({
    ...post,
    sharesCount: ((post.shares || {}).count || 0),
    likesCount: (((post.likes || {}).data || []).length || 0),
  }));
};