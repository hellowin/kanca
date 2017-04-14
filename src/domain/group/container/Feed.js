// @flow
import React from 'react';
import groupRepo from 'infra/repo/group';
import { connect } from 'react-redux';
import Post from '../component/Post';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  loading: state.group.loading,
  groupId: state.group.selected.id,
  feeds: state.group.feeds,
});

const fetchFeeds = (loading, groupId, feeds) => {
  if (!groupId) loc.push('/group/selection');
  if (!loading && feeds.length === 0) groupRepo.fetchFeeds(groupId);
}

class GroupFeed extends React.Component {

  componentDidMount() {
    const { loading, groupId, feeds } = this.props;
    fetchFeeds(loading, groupId, feeds);
  }

  componentWillReceiveProps(nextProps) {
    const { loading, groupId, feeds } = nextProps;
    fetchFeeds(loading, groupId, feeds);
  }

  render() {
    const { feeds } = this.props;

    return (
      <div>
        <h1 className="h3">Group Feed</h1>
        {feeds.map((post, id) => (
          <Post key={id} {...post} />
        ))}
      </div>
    )
  }

}

export default connect(mapStateToProps)(GroupFeed);
