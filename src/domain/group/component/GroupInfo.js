import React from 'react';
import groupRepo from 'infra/repo/group';
import loc from 'infra/service/location';

const selectGroup = groupId => e => {
  e.preventDefault();
  groupRepo.selectGroup(groupId)
    .then(() => loc.push('/group/feed'));
}

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
        <a href={`https://www.facebook.com/groups/${id}/`} target="_blank" className="btn btn-primary">Open in FB</a>
        &nbsp;
        <a href="#" onClick={selectGroup(id)} className="btn btn-primary">Select</a>
      </div>
    </div>
  );
}

export default Card;
