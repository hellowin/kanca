const action = {

  userSet: (data) => ({
    type: 'USER_SET',
    data,
  }),

  groupSet: (data) => ({
    type: 'GROUP_SET',
    data,
  })

};

export default action;
