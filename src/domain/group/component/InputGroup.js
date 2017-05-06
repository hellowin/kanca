import React from 'react';
import MediaQuery from 'react-responsive';
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
          const owner = res.owner;

          if (!name || ! privacy || !owner) throw new Error('ID is not a valid Facebook Group ID.');

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
          <MediaQuery minDeviceWidth={320} maxDeviceWidth={480}>
            {(match) => {
              return (
                <form className="form-inline">
                  {match ? [
                    <label style={{ marginBottom: '0', marginRight: '.5rem' }}>Group ID</label>,
                    <input
                      type="text"
                      className="form-control mr-sm-2 mb-sm-0 col-4"
                      style={{ marginRight: '.5rem' }}
                      placeholder="example: 1920036621597031"
                      value={data.groupId}
                      onChange={onFormChange('groupId')}
                    />
                  ] : [
                    <label className="mr-sm-2">Group ID</label>,
                    <input type="text" className="form-control mr-sm-2 mb-sm-0 col-4" placeholder="example: 1920036621597031" value={data.groupId} onChange={onFormChange('groupId')} />
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
