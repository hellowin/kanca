// @flow
import React from 'react';

class Card extends React.Component {

  props: {
    title?: string,
    children?: React.Element<*>
  }

  render() {
    const { title, children } = this.props;

    return (
      <div className="card">
        {title ? (<div className="card-header">
          {title}
        </div>) : ''}
        <div className="card-block">
          {children}
        </div>
      </div>
    )
  }

}

export default Card;
