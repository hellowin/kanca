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

type Props = {
  size?: number,
}

const Load = (props: Props) => {
  const { size } = props;
  const fixSize = size || 64;

  return (
    <div className="row">
      <div className="col-md-12" style={style.container}>
        <div style={style.center}>
          <Loading type="bars" color="#3b5998" height={fixSize} width={fixSize} delay={0} />
        </div>
      </div>
    </div>
  );
};

export default Load;
