const action = {

  userSet: (data) => ({
    type: 'USER_SET',
    data,
  }),

  groupSet: (data) => ({
    type: 'GROUP_SET',
    data,
  }),
  
  commentSet: (data) => ({
    type: 'GROUP_COMMENT_SET',
    data,
  }),

};

export default action;
