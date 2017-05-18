// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import Card from 'infra/component/Card';

const mapStateToProps = state => ({
  posts: state.group.feeds,
});

const goTo = path => e => {
  e.preventDefault();
  loc.push(path);
};

class Dashboard extends React.Component {

  render() {
    const { posts } = this.props;

    const exist = posts.length > 0;

    return (
      <div className="row">
        <div className="col-12">
          <Card>
            <img
              style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
              src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
              alt="Fork me on GitHub"
              data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            />
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
