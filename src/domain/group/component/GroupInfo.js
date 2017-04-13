import React from 'react';

const Card = props => {
  const { id, name, cover, description, owner, privacy } = props;
  return (
    <div className="card" style={{ width: '20rem' }}>
      <div className="card-img-top" style={{
        height: '120px',
        backgroundImage: `url("${cover}")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 50%',
      }}></div>
      <div className="card-block">
        <h4 className="card-title">{name}</h4>
        <p className="card-text">{description.split(/\s+/).slice(0,50).join(" ")} ...</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Privacy: {privacy}</li>
        <li className="list-group-item">Owner: {owner.name}</li>
      </ul>
      <div className="card-block" style={{ textAlign: 'right' }}>
        <a href={`https://www.facebook.com/groups/${id}/`} target="_blank" className="btn btn-primary">Go To</a>
      </div>
    </div>
  );
}

export default Card;
