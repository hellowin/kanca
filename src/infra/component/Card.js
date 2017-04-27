// @flow
import React from 'react';

class Card extends React.Component {

  render() {
    const { children } = this.props;

    return (
      <div className="card">
        <div className="card-block">
          {children}
        </div>
      </div>
    )
  }

}

export default Card;
