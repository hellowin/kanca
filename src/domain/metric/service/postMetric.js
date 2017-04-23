export default (posts: {
  created_time: string,
}[]): { sharesCount: number, likesCount: number }[] => {
  // calculate post
  return posts.map(post => ({
    ...post,
    sharesCount: ((post.shares || {}).count || 0),
    likesCount: (((post.likes || {}).data || []).length || 0),
  }));
};