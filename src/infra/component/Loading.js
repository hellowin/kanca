// @flow
import React from 'react';
import Loading from 'react-loading';

const style = {
  container: {
    minHeight: '64px',
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Load = () => (
  <div className="row">
    <div className="col-md-12" style={style.container}>
      <div style={style.center}>
        <Loading type="bars" color="#3b5998" />
      </div>
    </div>
  </div>
);

export default Load;
