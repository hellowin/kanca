// @flow

export type PostMetric = {
  post: Post,
  id: string,
  createdTime: Date,
  text: string,
  from?: {
    id: string,
    name: string,
  },
  picture?: string,
  url: string,
  sharesCount: number,
  likesCount: number,
  commentsCount: number,
}

export default (posts: Post[]): PostMetric[] => {
  // calculate post
  return posts.map((post: Post): PostMetric => {
    const sharesCount: number = ((post.shares || {}).count || 0);
    const likesCount: number = (((post.likes || {}).data || []).length || 0);
    const preCommentsCount: number = (((post.comments || {}).data || []).length || 0);
    const subCommentsCount: number = ((post.comments || {}).data || []).reduce((pre, cur: Comment) => pre + (((cur.comments || {}).data || []).length), 0);
    const commentsCount = preCommentsCount + subCommentsCount;

    const text = post.message || post.story || post.message || '';
    
    return {
      post,
      id: post.id,
      createdTime: new Date(post.created_time),
      text,
      from: post.from,
      picture: post.picture,
      url: post.permalink_url,
      sharesCount,
      likesCount,
      commentsCount,
    };
  });
};