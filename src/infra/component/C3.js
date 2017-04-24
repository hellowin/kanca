// @flow
import React from 'react';
import c3 from 'c3';
import 'c3/c3.css';

type Props = {
  config: {},
  id: string,
}

class C3 extends React.Component {

  chart: Object

  componentDidMount(){
    const { config, id } = this.props;
    this.chart = c3.generate({ ...config, bindto: `#${id}` });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { config } = nextProps;
    const data = (config || {}).data || {};
    this.chart.load(data);
  }

  render() {
    const { id } = this.props;

    return <div id={id}></div>;
  }

}

export default C3;
