// @flow
import moment from 'moment-timezone';

export class PostMetric {
  post: Post
  id: string
  createdTime: Date
  text: string
  from: {
    id: string,
    name: string,
  } | void
  picture: string | void
  url: string
  sharesCount: number
  likesCount: number
  commentsCount: number
  getScore: () => number

  constructor(post: Post) {
    const sharesCount: number = ((post.shares || {}).count || 0);
    const likesCount: number = (((post.likes || {}).data || []).length || 0);
    const preCommentsCount: number = (((post.comments || {}).data || []).length || 0);
    const subCommentsCount: number = ((post.comments || {}).data || []).reduce((pre, cur: Comment) => pre + (((cur.comments || {}).data || []).length), 0);
    const commentsCount = preCommentsCount + subCommentsCount;

    const text = post.message || post.story || post.message || '';

    this.post = post;
    this.id = post.id;
    this.createdTime = moment(post.created_time).toDate();
    this.text = text;
    this.from = post.from;
    this.picture = post.picture;
    this.url = post.permalink_url;
    this.sharesCount = sharesCount;
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.getScore = () => {
      return likesCount + sharesCount + commentsCount;
    }
  }
}

export default (posts: Post[]): PostMetric[] => {
  // calculate post
  return posts.map((post: Post) => new PostMetric(post));
};
