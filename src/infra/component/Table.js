// @flow
import React from 'react';
import _ from 'lodash';
import Pagination from 'infra/component/Pagination';

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

    const Row = dt => (
      <tr>
        {columns.map((col, key) => 
          <td key={key}>{dt[col.key]}</td>
        )}
      </tr>
    );

    const Wrapper = props => (
      <table className="table table-striped">
        <thead><tr>
          {columns.map((col, key) => <th key={key}>{col.label}</th>)}
        </tr></thead>
        <tbody>
          {props.children}
        </tbody>
      </table>
    );

    return (
      <Pagination list={data} ChildNode={Row} Wrapper={Wrapper} />
    );
  }

}

export default Table;
