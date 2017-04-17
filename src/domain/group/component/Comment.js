import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

const Comment = ({ children, style }) => {
  if (!(((children || {}).comments || {}).data || []).length) {
    return <null />;
  }
  
  return (
    <div>
      {children.comments.data.map(comment => {
        return (
          <div key={comment.id} style={style ? Object.assign({}, style) : {}}>
            <span><b>{comment.from.name}</b> {comment.message}</span><br/>
            <p className="text-muted">{moment(comment.created_time).format('YYYY-MM-DD HH:mm:ss')} {' '} <i className="fa fa-thumbs-up"></i> {' '} {comment.likes ? comment.likes.data.length : 0}</p>
            {(comment.comments && comment.comments.data.length)
              ? <Comment children={comment} style={{ paddingLeft: '10px' }} />
              : <null />}
          </div>
        );
      })}
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
