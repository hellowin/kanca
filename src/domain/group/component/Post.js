// @flow
import React from 'react';
import moment from 'moment-timezone';
import Comment from './Comment';
import Pagination from 'infra/component/Pagination';
import Card from 'infra/component/Card';

const GroupPost = (props: Post) => {
  const {
    created_time,
    message,
    description,
    from,
    name,
    picture,
    type,
    shares,
    permalink_url,
    likes,
    story,
    comments,
  } = props;

  const validComments = ((comments || {}).data || []);
  
  return (
    <Card>
      <div className="row">
        {picture ? <div className="col-md-2"><img src={picture} className="rounded float-left" alt="Post pic" style={{ width: '100%' }} /></div> : ''}
        <div className={picture ? 'col-md-10' : 'col-md-12'}>
          <p className="card-text">{message}</p>
          {description ? (
            <blockquote className="blockquote">
              <p className="mb-0">{description}</p>
              {name ? <footer className="blockquote-footer">{name}</footer> : ''}
            </blockquote>
          ) : ''}
          {story ? <p>{story}</p> : ''}
          {from ? <span><i className="fa fa-user"></i> <b>{from.name}</b> </span> : ''}
          {created_time ? <span><i className="fa fa-clock-o"></i> {moment(created_time).format('YYYY-MM-DD HH:mm:ss')} </span> : ''}
          {type ? <span><i className="fa fa-tag"></i> {type} </span> : ''}
          {shares ? <span><i className="fa fa-share"></i> {shares.count} </span> : ''}
          {likes ? <span><i className="fa fa-thumbs-up"></i> {likes.data.length} </span> : ''}
        </div>
      </div>
      {validComments.length > 0 ? (<div className="card-block row">
        <div className="col-md-12">
          <Pagination list={validComments} ChildNode={Comment} hideNavigationOnSinglePage />
        </div>
      </div>) : ''}
      <div className="card-block" style={{ textAlign: 'right' }}>
        <a href={permalink_url} target="_blank" className="btn btn-primary btn-sm">Open in FB</a>
      </div>
    </Card>
  );
}

export default GroupPost;
