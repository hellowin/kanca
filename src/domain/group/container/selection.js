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

  componentWillReceiveProps(nextProps) {
    if (nextProps.features.length === 0) groupRepo.fetchFeatures(groupIds);
  }

  render() {
    const { features } = this.props;

    return (
      <div>
        <h1 className="h3">Featured Groups</h1>
        {features.map((feature, id) => (
          <GroupInfo key={id} {...feature} />
        ))}
      </div>
    )
  }

}

export default connect(mapStateToProps)(GroupSelection);
