// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from 'infra/component/Card';
import Pagination from 'infra/component/Pagination';
import Form, { FormTypes, withForm } from 'infra/component/Form';

import Member from '../component/Member';
import usersMetricer from '../service/usersMetric';

const mapStateToProps = state => ({
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const setDefaultData = props => {
  return {
    sort: 'score',
  };
};

class MembersMetricPage extends React.Component {

  onFormChange: Function

  state: {
    data: {
      sort: string,
    },
  }

  render() {
    const { members, posts, comments } = this.props;
    const { data } = this.state;

    const metric = usersMetricer(members, posts, comments);

    const forms = [
      { type: FormTypes.SELECT, label: 'Sort by', value: data.sort, model: 'sort', col: 12, selectOptions: [
        { text: 'Name', value: 'name' },
        { text: 'Score', value: 'score' },
        { text: 'Posts count', value: 'postsCount' },
        { text: 'Comments count', value: 'commentsCount' },
      ] },
    ];

    let list;
    switch (data.sort) {
      case 'commentsCount':
        list = _.sortBy(metric.userMetrics, user => user.commentsCount).reverse();
        break;
      case 'postsCount':
        list = _.sortBy(metric.userMetrics, user => user.postsCount).reverse();
        break;
      case 'score':
        list = _.sortBy(metric.userMetrics, user => user.getScore()).reverse();
        break;
      case 'name':
      default:
        list = _.sortBy(metric.userMetrics, user => user.name);
    }

    return (
      <div className="row">

        <div className="col-md-6">
          <Card>
            <Form forms={forms} onChange={this.onFormChange} />
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <h1 className="h3 mb-1">Members Summary</h1>
            <div>Total members: {metric.totalMembers()}</div>
            <div>Total members who posts: {metric.uniqueUsersPosts().length}</div>
            <div>Total members who comments: {metric.uniqueUsersComments().length}</div>
          </Card>
        </div>

        <div className="col-12">
          <h1 className="h3 mb-1">Group Members</h1>
          <Pagination list={list.filter(li => li.name)} perPage={9} ChildNode={Member} />
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(withForm(MembersMetricPage, setDefaultData));
