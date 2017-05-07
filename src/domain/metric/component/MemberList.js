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

    const parsedList = list.map((li: UserMetric) => ({
      profile: (<div>
        <img src={li.picture} alt="user avatar" className="mr-1" />{li.name}
      </div>),
      score: li.getScore(),
      posts: (
        <dd>
          Total: {li.postsCount}<br />
          Likes: {li.postsLikesCount}<br />
          Shares: {li.postsSharesCount}<br />
        </dd>
      ),
      comments: (
        <dd>
          Total: {li.commentsCount}
        </dd>
      ),
    }));

    const columns = [
      { key: 'profile', label: 'Profile' },
      { key: 'posts', label: <span><i className="fa fa-pencil-square-o mr-1" />Posts</span> },
      { key: 'comments', label: <span><i className="fa fa-commenting mr-1" />Comments</span> },
      { key: 'score', label: <span><i className="fa fa-star mr-1" />Score</span> },
    ];

    return (
      <Card title="Member List">
        <Table data={parsedList} columns={columns} />
      </Card>
    );
  }

}

export default MemberList;
