// @flow
import React from 'react';
import groupRepo from 'infra/repo/group';
import { connect } from 'react-redux';

const groupIds = [
  '1920036621597031',
];

const mapStateToProps = state => ({
  features: state.group.features,
});

class GroupSelection extends React.Component {

  componentDidMount() {
    groupRepo.fetchFeatures(groupIds);
  }

  render() {
    const { features } = this.props;

    return (
      <div>
        {features.map((feature, id) => (
          <div key={id}>{feature.name}</div>
        ))}
      </div>
    )
  }

}

export default connect(mapStateToProps)(GroupSelection);
