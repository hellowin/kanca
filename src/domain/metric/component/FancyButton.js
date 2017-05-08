// @flow
import React from 'react';
import loc from 'infra/service/location';

type FancyButtonProps = {
  title: string,
  subTitle: string,
  icon: string,
  target: string,
}

const FancyButton = (props: FancyButtonProps) => {
  const { title, subTitle, icon, target } = props;
  return (
    <div className="card" onClick={() => loc.push(target)} style={{ cursor: 'pointer' }}>
      <div className="card-block p-0 clearfix">
        <i className={`${icon} bg-primary p-4 font-2xl mr-3 float-left`}></i>
        <div className="h5 text-primary mb-0 pt-3">{title}</div>
        <div className="text-muted font-xs">{subTitle}</div>
      </div>
    </div>
  );
};

export default FancyButton;
