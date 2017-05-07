// @flow
import React from 'react';
import _ from 'lodash';

class Table extends React.Component {
  props: {
    data: { [string]: any }[],
    columns: { key: string, label: any }[],
  }

  render() {
    const { data, columns } = {
      data: [],
      columns: [],
      ...this.props,
    };

    return (
      <table className="table table-striped">
        <thead><tr>
          {columns.map((col, key) => <th key={key}>{col.label}</th>)}
        </tr></thead>
        <tbody>
          {data.map((dt, rec) =>
            (<tr key={rec}>
              {columns.map((col, key) => 
                <td key={key}>{dt[col.key]}</td>
              )}
            </tr>)
          )}
        </tbody>
      </table>
    );
  }

}

export default Table;
