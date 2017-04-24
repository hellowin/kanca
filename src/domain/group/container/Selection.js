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
  manages: state.group.manages,
  features: state.group.features,
});

class GroupSelection extends React.Component {

  componentDidMount() {
    groupRepo.fetchFeatures(groupIds);
  }

  componentWillReceiveProps(nextProps) {
    const { loading, features } = nextProps;
    if (!loading && features.length === 0) groupRepo.fetchFeatures(groupIds);
  }

  render() {
    const { loading, inputs, manages, features } = this.props;

    return !loading? (
      <div className="row">
        <div className="col-12">
          <h1 className="h3">Input Group ID</h1>
        </div>

        <div className="col-12">
          <InputGroup />
        </div>

        <div className="col-12">
          {inputs.length > 0 ? <h1 className="h3">Recently Input Groups</h1> : ''}
          {inputs.map((input, id) => (
            <GroupInfo key={id} {...input} />
          ))}
        </div>

        {manages.length > 0 ? (<div className="col-12">
          <h1 className="h3 mb-1">Managed Groups</h1>
          {manages.map((group, id) => (
            <GroupInfo key={id} {...group} />
          ))}
        </div>) : ''}

        {features.length > 0 ? (<div className="col-12">
          <h1 className="h3 mb-1">Featured Groups</h1>
          {features.map((group, id) => (
            <GroupInfo key={id} {...group} />
          ))}
        </div>) : ''}

      </div>
    ) : (
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'center' }}>
          <p>Please wait. The engine is fetching {config.feedPages} {config.feedPages > 1 ? 'pages' : 'page'} of group feed and members.</p>
          <Loading />
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(GroupSelection);
