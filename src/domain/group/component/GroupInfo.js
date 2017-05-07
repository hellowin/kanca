import React from 'react';
import MediaQuery from 'react-responsive';
import groupRepo from 'infra/repo/group';
import loc from 'infra/service/location';

const selectGroup = groupId => e => {
  e.preventDefault();
  groupRepo.selectGroup(groupId)
    .then(() => loc.push('/group/feed'));
}

const Card = props => {
  const { id, name, cover, owner, privacy } = props;
  return (
    <div>
      <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
        {(matches) => {
          const cardStyleOnMobile = matches ? { width: '100%', float: 'left' } : { width: '20rem', float: 'left' };
          return (
            <div className={`card ${matches ? '' : 'mr-1'}`} style={cardStyleOnMobile}>
              <div className="card-img-top" style={{
                height: '100px',
                backgroundImage: `url("${cover}")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 50%',
              }}></div>
              <div className="card-block">
                <p><b>{name}</b></p>
                <span className="mr-1"><i className="fa fa-lock"></i> {privacy}</span>
                {owner ? <span className="mr-1"><i className="fa fa-user"></i> {owner.name}</span> : ''}
              </div>
              <div className="card-block pt-0" style={{ textAlign: 'right' }}>
                <a href={`https://www.facebook.com/groups/${id}/`} target="_blank" className="btn btn-primary btn-sm">Open in FB</a>
                &nbsp;
                <a href="#" onClick={selectGroup(id)} className="btn btn-primary btn-sm">Select</a>
              </div>
            </div>
          );
        }}
      </MediaQuery>
    </div>
  );
}

export default Card;
