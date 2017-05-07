// @flow
import React from 'react';
import Card from 'infra/component/Card';
import Table from 'infra/component/Table';
import type { UserMetric } from '../service/userMetric';

class MemberList extends React.Component {

  prop: {
    list: UserMetric[],
  }

  render() {
    const { list } = this.props;

    const columns = [
      { key: 'name', label: 'Name' },
    ];

    return (
      <Card title="Member List">
        <Table data={list} columns={columns} />
      </Card>
    );
  }

}

export default MemberList;
