// @flow
import React from 'react';
import Card from 'infra/component/Card';
import type { UserMetric } from '../service/userMetric';

const Post = (props: UserMetric) => {
  const {
    picture,
    name,
    url,
    postsCount,
    commentsCount,
    postsLikesCount,
    postsSharesCount,
  } = props;

  return (
    <div style={{ width: '20rem', float: 'left', margin: '0px 10px', height: '10rem' }}>
      <Card>
        <div className="row">
          {picture ? <div className="col-md-4"><img src={picture} className="rounded float-left" alt="Prof pic" style={{ width: '100%' }} /></div> : ''}
          <div className={picture ? 'col-md-6' : 'col-md-12'}>
            <a href={url} target="_blank"><p className="card-text">{name}</p></a>
            <div>Total posts: {postsCount}</div>
            <div>Posts likes: {postsLikesCount}</div>
            <div>Posts shares: {postsSharesCount}</div>
            <div>Total comments: {commentsCount}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Post;
