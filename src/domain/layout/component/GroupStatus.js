// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import groupRepo from 'infra/repo/group';
import Loading from 'infra/component/Loading';

const mapStateToProps = state => ({
  loading: state.group.loading,
  group: state.group.selected,
  updatedTime: state.group.updatedTime,
});

class GroupStatus extends React.Component {

  state: {
    deltaTime: string,
    diffTime: number,
  }

  getTime: Function
  intervalTime: any

  constructor(props) {
    super(props);

    this.getTime = this.getTime.bind(this);
    const { updatedTime } = props;

    this.state = this.refresh(updatedTime);
  }

  refresh(updatedTime) {
    const deltaTime = moment(new Date(updatedTime)).toNow();
    const diffTime = moment(new Date(updatedTime)).diff(moment());
    return { deltaTime, diffTime };
  }

  getTime(updatedTime) {
    this.setState(this.refresh(updatedTime));
    this.intervalTime = setInterval(() => {
      this.setState(this.refresh(updatedTime));
    }, 5000);
  }

  componentWillReceiveProps(nextProps) {
    const { updatedTime } = nextProps;
    this.getTime(updatedTime);
  }

  componentWillUnmount() {
    clearInterval(this.intervalTime);
  }

  render() {
    const { loading, group, updatedTime } = this.props;
    const { deltaTime, diffTime } = this.state;
    const refreshTime = diffTime + 15 * 60000 < 0; // 15 minutes
    const validTime = moment(updatedTime).isValid();

    const elements = (
      <span>
        Selected Group: <b>{group.name}</b>
        {validTime ? <span>&nbsp;|&nbsp;Updated {deltaTime} ago</span> : ''}
        {validTime && refreshTime ? (
          <span>&nbsp;|&nbsp;
            <button className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }} onClick={() => groupRepo.refreshGroup()}>Refresh</button>
          </span>
        ) : ''}
      </span>
    )

    const content = !loading? elements : <Loading size={30} />;

    return content;
  }
}

export default connect(mapStateToProps)(GroupStatus);
