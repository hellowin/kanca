// @flow
import React from 'react';
import moment from 'moment-timezone';
import MediaQuery from 'react-responsive';
import uuid from 'uuid';
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
      <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
        {(matches) => {
          return (
            <div>
              <div className="row">
                {picture ?
                  <div className={`col-md-2 ${matches && 'd-flex justify-content-center'}`}>
                    <img src={picture} className="rounded float-left img-responsive" alt="Post pic" style={{ maxWidth: '150px' }} />
                  </div> : ''}
                <div className={picture ? 'col-md-10' : 'col-md-12'}>
                  {matches ? <div>
                      <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                          {from ? <span><i className="fa fa-user"></i> <b>{from.name}</b> </span> : ''}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 d-flex justify-content-center">
                          {created_time ? <span className="text-muted"><i className="fa fa-clock-o"></i> {moment(created_time).format('YYYY-MM-DD HH:mm:ss')} </span> : ''}
                        </div>
                      </div>
                    </div>
                    :
                    <div>
                      {from ? <span><i className="fa fa-user"></i> <b>{from.name}</b> </span> : ''}
                      {created_time ? <span className="text-muted"><i className="fa fa-clock-o"></i> {moment(created_time).format('YYYY-MM-DD HH:mm:ss')} </span> : ''}
                    </div>
                  }
                  <div className="row">
                    <div className="col-md-12">
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
                      {matches ? <div className="row pt-1">
                        <div className="col-md-12">
                          <a href={permalink_url} target="_blank" className="btn btn-primary btn-block">Open in FB</a>
                        </div>
                      </div> : <a href={permalink_url} target="_blank" className="btn btn-primary btn-sm">Open in FB</a>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {validComments && validComments.length > 0 ? [
                    <hr key={uuid.v4()} />,
                    <Pagination list={validComments} ChildNode={Comment} hideNavigationOnSinglePage perPage={5} key={uuid.v4()} />
                  ] : <null />}
                </div>
              </div>
            </div>
          );
        }}
      </MediaQuery>
    </Card>
  );
};

export default GroupPost;
