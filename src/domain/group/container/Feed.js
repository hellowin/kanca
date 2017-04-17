// @flow
import React from 'react';
import groupRepo from 'infra/repo/group';
import { connect } from 'react-redux';
import Post from '../component/Post';
import loc from 'infra/service/location';
import Loading from 'infra/component/Loading';
import config from 'config';

const mapStateToProps = state => ({
  loading: state.group.loading,
  groupId: state.group.selected.id,
  feeds: state.group.feeds,
  comments: state.group.comments[state.group.selected.id],
});

const fetchFeeds = (loading, groupId, feeds) => {
  if (!groupId) loc.push('/group/selection');
  if (!loading && feeds.length === 0) groupRepo.fetchFeeds(groupId, config.feedPages);
};

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
    const { loading, feeds, comments } = this.props;

    return !loading ? (
      <div>
        <h1 className="h3">Group Feed</h1>
        {comments && feeds.map((post, id) => (
          <Post key={id} {...post} comments={comments[post.id]} />
        ))}
      </div>
    ) : (
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'center' }}>
          <p>Please wait. The engine is fetching {config.feedPages} {config.feedPages > 1 ? 'pages' : 'page'} of group feed.</p>
          <Loading />
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(GroupFeed);
