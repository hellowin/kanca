// @flow
import React from 'react';
import groupRepo from 'infra/repo/group';
import { connect } from 'react-redux';
import GroupInfo from '../component/GroupInfo';
import InputGroup from '../component/InputGroup';
import Loading from 'infra/component/Loading';
import config from 'config';

const groupIds = config.groupIds.split(',');

const mapStateToProps = state => ({
  loading: state.group.loading,
  inputs: state.group.inputs,
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
    const { loading, inputs, features } = this.props;

    return !loading? (
      <div>
        <h1 className="h3">Input Group ID</h1>
        <InputGroup />
        {inputs.length > 0 ? <h1 className="h3">Recently Input Groups</h1> : ''}
        {inputs.map((input, id) => (
          <GroupInfo key={id} {...input} />
        ))}
        <h1 className="h3 mb-1">Featured Groups</h1>
        {features.map((feature, id) => (
          <GroupInfo key={id} {...feature} />
        ))}
      </div>
    ) : <Loading />;
  }

}

export default connect(mapStateToProps)(GroupSelection);
