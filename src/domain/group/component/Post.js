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
        {picture ? <div className="col-md-2"><img src={picture} className="rounded float-left img-responsive" alt="Post pic" /></div> : ''}
        <div className={picture ? 'col-md-10' : 'col-md-12'}>
          {from ? <span><i className="fa fa-user"></i> <b>{from.name}</b> </span> : ''}
          {created_time ? <span className="text-muted"><i className="fa fa-clock-o"></i> {moment(created_time).format('YYYY-MM-DD HH:mm:ss')} </span> : ''}
          <p className="card-text">{message}</p>
          {description ? (
            <blockquote className="blockquote">
              <p className="mb-0">{description}</p>
              {name ? <footer className="blockquote-footer">{name}</footer> : ''}
            </blockquote>
          ) : ''}
          {story ? <p>{story}</p> : ''}
          {type ? <span className="text-muted"><i className="fa fa-tag"></i> {type} </span> : ''}
          {shares ? <span className="text-muted"><i className="fa fa-share"></i> {shares.count} </span> : ''}
          {likes ? <span className="text-muted"><i className="fa fa-thumbs-up"></i> {likes.data.length} </span> : ''}
          <a href={permalink_url} target="_blank" className="btn btn-primary btn-sm">Open in FB</a>
        </div>
      </div>
      {validComments.length > 0 ? (<div className="row">
        <div className="col-md-12">
          <hr />
          <Pagination list={validComments} ChildNode={Comment} hideNavigationOnSinglePage perPage={5} />
        </div>
      </div>) : ''}
    </Card>
  );
}

export default GroupPost;
