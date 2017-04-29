// @flow

export type CommentMetric = {
  comment: Comment,
  id: string,
  createdTime: Date,
  text: string,
  from: {
    id: string,
    name: string,
  },
  likesCount: number,
  parent?: string,
  hierarchy?: number,
}

export default (comments: Comment[]): CommentMetric[] => {
  return comments.map((comment: Comment): CommentMetric => {
    return {
      comment,
      id: comment.id,
      parent: comment.parent,
      createdTime: new Date(comment.created_time),
      text: comment.message,
      from: {
        id: comment.from.id,
        name: comment.from.name,
      },
      likesCount: ((comment.likes || {}).data || []).length,
      hierarchy: comment.hierarchy,
    };
  });
};