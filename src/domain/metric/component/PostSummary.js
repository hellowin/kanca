// @flow
import React from 'react';
import moment from 'moment-timezone';
import Card from 'infra/component/Card';
import type { PostMetric } from '../service/postMetric';

const Post = (props: PostMetric) => {
  const {
    createdTime,
    text,
    from,
    sharesCount,
    url,
    likesCount,
    commentsCount,
  } = props;
  
  return (
    <Card>
      <div className="row">
        <div className='col-12'>
          <p className="card-text">{text.split(/\s+/).slice(0,10).join(" ")} ...</p>
          {from ? <span><i className="fa fa-user"></i> <b>{from.name}</b> </span> : ''}
          <span><i className="fa fa-clock-o"></i> {moment(createdTime).format('YYYY-MM-DD HH:mm:ss')} </span>
          <span><i className="fa fa-share"></i> {sharesCount} </span>
          <span><i className="fa fa-thumbs-up"></i> {likesCount} </span>
          <span><i className="fa fa-comments"></i> {commentsCount} </span>
          <a href={url} target="_blank" className="btn btn-primary btn-sm ml-1">Open in FB</a>
        </div>
      </div>
    </Card>
  );
}

export default Post;
