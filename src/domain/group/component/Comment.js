import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

const Comment = props => {
  const { message, from, created_time, likes, comments, order } = props;
  const validComments = ((comments || {}).data || []);
  const validOrder = order || 0;

  return (
    <div style={{ paddingLeft: `${validOrder * 10}px`}}>
      <span><b>{from.name}</b> {message}</span><br/>
      <p className="text-muted">{moment(created_time).format('YYYY-MM-DD HH:mm:ss')} {' '} <i className="fa fa-thumbs-up"></i> {' '} {likes ? likes.data.length : 0}</p>
      {validComments.map((comment, key) => <Comment key={key} {...comment} order={1} />)}
    </div>
  );
};

Comment.propTypes = {
  children: PropTypes.object.isRequired,
  style: PropTypes.object,
};

Comment.defaultProps = {
  style: {},
};

export default Comment;
