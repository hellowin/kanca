// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import groupRepo from 'infra/repo/group';
import Card from 'infra/component/Card';

const mapStateToProps = state => ({
  posts: state.group.feeds,
});

const goTo = path => e => {
  e.preventDefault();
  loc.push(path);
}

class Dashboard extends React.Component {

  componentDidMount() {
    groupRepo.restoreGroup();
  }

  render() {
    const { posts } = this.props;

    const exist = posts.length > 0;

    return (
      <div className="row">
        <div className="col-12">
          <Card>
            <div className="col-md-12" style={{ textAlign: 'center' }}>
              <h2>Welcome to Kanca</h2>
              <hr />
            </div>
            <div className="col-md-8 offset-md-2">
              <p>Kanca is an open sourced application to analyze Facebook Group.</p>
              <p>Start analyzing group by selecting a group in <a href="#" onClick={goTo('/group/selection')}>Group Selection</a> page.</p>
              {exist ? <p>We found you have selected a group from the past, you can directly go analyze it.<br />Go to <a href="#" onClick={goTo('/metric/summary')}>Summary Metric</a>.</p> : <null />}
              <p>If you found this project is interesting, don't forget to give star on our <a href="https://github.com/hellowin/kanca" target="_blank">GitHub Repo</a>.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Dashboard);
