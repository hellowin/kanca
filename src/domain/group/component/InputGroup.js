import React from 'react';
import MediaQuery from 'react-responsive';
import uuid from 'uuid';
import graph from 'infra/service/graph';
import groupRepo from 'infra/repo/group';

class InputGroup extends React.Component {

  constructor(props) {
    super(props);

    this.onFormChange = this.onFormChange.bind(this);
    this.lookUpGroup = this.lookUpGroup.bind(this);

    this.state = {
      data: {
        groupId: '',
      },
      error: null,
    };
  }

  onFormChange(model) {
    return e => {
      const value = e.target.value;
      const { data } = this.state;
      data[model] = value;
      this.setState({ data });
    }
  }

  lookUpGroup(groupId) {
    return e => {
      this.setState({ error: null });
      e.preventDefault();
      graph.getGroup(groupId)
        .then(res => {
          // validate group object
          const name = res.name;
          const privacy = res.privacy;

          if (!name || ! privacy) throw new Error('ID is not a valid Facebook Group ID.');

          groupRepo.addInput(res);

          this.setState({ error: null, data: { groupId: '' } });
        })
        .catch(err => {
          this.setState({ error: err });
        });
    }
  }

  render() {
    const { data, error } = this.state;
    const onFormChange = this.onFormChange;
    const lookUpGroup = this.lookUpGroup;

    return (
      <div className="row">
        <div className="col-md-12 mb-1 mt-1">
          <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
            {(matches, key) => {
              return (
                <form className="form-inline" key={key}>
                  {matches ? [
                    <label style={{ marginBottom: '0', marginRight: '.5rem' }} key={uuid.v4()}>Group ID</label>,
                    <input
                      type="text"
                      className="form-control mr-sm-2 mb-1 col-4"
                      style={{ marginRight: '.5rem' }}
                      placeholder="example: 1920036621597031"
                      value={data.groupId}
                      onChange={onFormChange('groupId')}
                      key={uuid.v4()}
                    />
                  ] : [
                    <label className="mr-sm-2" key={uuid.v4()}>Group ID</label>,
                    <input
                      type="text"
                      className="form-control mr-sm-2 mb-1 col-4"
                      placeholder="example: 1920036621597031"
                      value={data.groupId}
                      onChange={onFormChange('groupId')}
                      key={uuid.v4()}
                    />
                  ]}
                  <button type="submit" className="btn btn-primary" onClick={lookUpGroup(data.groupId)}>Look Up</button>
                </form>
              );
            }}
          </MediaQuery>
        </div>
        {error ? (<div className="col-md-12">
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error.message}
          </div>
        </div>) : ''}
      </div>
    );
  }

}

export default InputGroup;
