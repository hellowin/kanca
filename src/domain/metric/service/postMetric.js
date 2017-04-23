// @flow

export type PostMetric = {
  id: string,
  sharesCount: number,
  likesCount: number,
}

export default (posts: Post[]): PostMetric[] => {
  // calculate post
  return posts.map((post: Post): PostMetric => {
    const sharesCount: number = ((post.shares || {}).count || 0);
    const likesCount: number = (((post.likes || {}).data || []).length || 0);
    
    return {
      id: post.id,
      sharesCount,
      likesCount,
    };
  });
};