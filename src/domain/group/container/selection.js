// @flow
import React from 'react';
import groupRepo from 'infra/repo/group';
import { connect } from 'react-redux';
import GroupInfo from '../component/GroupInfo';

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
          <GroupInfo key={id} {...feature} />
        ))}
      </div>
    )
  }

}

export default connect(mapStateToProps)(GroupSelection);
