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
    <div style={{ width: '20rem', float: 'left', margin: '0px 10px 10px 0px', height: '15rem' }}>
      <Card>
        <div className="row">

          <div className="col-12 mb-1">
            <a href={url} target="_blank"><p className="card-text">{(name || '').length > maxName ? name.slice(0, maxName) + '...' : name}</p></a>
          </div>

          {picture ? <div className="col-md-4"><img src={picture} className="rounded" alt="Prof pic" style={{ width: '100%' }} /></div> : ''}

          <div className={picture ? 'col-md-6' : 'col-md-12'}>
            <dl>
              <dt><i className="fa fa-pencil-square-o mr-1" />Posts</dt>
              <dd>
                Total: {postsCount}<br />
                Likes: {postsLikesCount}<br />
                Shares: {postsSharesCount}<br />
              </dd>

              <dt><i className="fa fa-commenting mr-1" />Comments</dt>
              <dd>
                Total: {commentsCount}
              </dd>
            </dl>
          </div>

        </div>
      </Card>
    </div>
  );
}

export default Post;
