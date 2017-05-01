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

  const maxName = 40;

  return (
    <div style={{ width: '20rem', float: 'left', margin: '0px 10px 15px 0px', height: '10rem' }}>
      <Card>
        <div className="row">

          <div className="col-12 mb-1">
            <a href={url} target="_blank"><p className="card-text">{(name || '').length > maxName ? name.slice(0, maxName) + '...' : name}</p></a>
          </div>

          {picture ? <div className="col-md-4"><img src={picture} className="rounded" alt="Prof pic" style={{ width: '100%' }} /></div> : ''}

          <div className={picture ? 'col-md-6' : 'col-md-12'}>
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
