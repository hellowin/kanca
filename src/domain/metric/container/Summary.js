import React from 'react';
import { connect } from 'react-redux';
import postsMetricer from '../service/postsMetric';
import userCount from '../service/userMetric';
import postCount from '../service/postMetric';
import _ from 'lodash';
import moment from 'moment-timezone';
import Post from 'domain/group/component/Post';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
});

class MetricSummary extends React.Component {

  render() {
    const { feeds, members } = this.props;
    const userCounted = userCount((feeds || []));
    const postCounted = postCount((feeds || []));
    const postsMet = postsMetricer((feeds || []), (members || []));

    return (
      <div className="row">

        <div className="col-md-12">
          <h4>Summary</h4>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-block">
              {feeds.length > 0 ? <p>Time range {moment(postsMet.dateStart).format('YYYY-MM-DD HH:mm:ss')} - {moment(postsMet.dateEnd).format('YYYY-MM-DD HH:mm:ss')}</p> : ''}
              <p>Total posts: {postsMet.totalPosts}</p>
              <p>Total posts shares: {postsMet.totalPostsShares}</p>
              <p>Total posts likes: {postsMet.totalPostsLikes}</p>
              <p>Total members: {members.length}</p>
              <p>Total unique member posting: {postsMet.uniqueUserPosts}</p>
              <p>User post engagement: {postsMet.postEngagement} %<br />(total unique user posting / total member)</p>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>User Activity</h4>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Posts Count</h4>
              <p>Top 10 user posts count.</p>
              <ul className="list-group">
                {_.sortBy(userCounted, 'postsCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsCount} - {((user.postsCount/postsMet.totalPosts)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Shares Count</h4>
              <p>Top 10 user posts shares count.</p>
              <ul className="list-group">
                {_.sortBy(userCounted, 'postsSharesCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsSharesCount} - {((user.postsSharesCount/postsMet.totalPostsShares)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Likes Count</h4>
              <p>Top 10 user posts likes count.</p>
              <ul className="list-group">
                {_.sortBy(userCounted, 'postsLikesCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsLikesCount} - {((user.postsLikesCount/postsMet.totalPostsLikes)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>Post Activity</h4>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Shares Count</h4>
              <p>Top 10 posts with most shares count.</p>
              <ul className="list-group">
                {_.sortBy(postCounted, 'sharesCount').reverse().slice(0, 10).map((post, key) => (<Post key={key} {...post} />))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Likes Count</h4>
              <p>Top 10 posts with most likes count.</p>
              <ul className="list-group">
                {_.sortBy(postCounted, 'likesCount').reverse().slice(0, 10).map((post, key) => (<Post key={key} {...post} />))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(MetricSummary);
