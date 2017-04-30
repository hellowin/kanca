// @flow
import React from 'react';
import _ from 'lodash';
import Measure from 'react-measure';
import Cloud from './Cloud';
import Card from 'infra/component/Card';
import { syncToPromise } from 'infra/service/util';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const calculate = (type: string, metric: TimeRangeMetric): Promise<{ word: string, count: number }[]> => {
  let promises = [];

  switch (type) {
    case 'all':
    default:
      promises = [metric.postsMetric.wordCount(), metric.commentsMetric.wordCount()];
  }

  return Promise.all(promises)
    .then(res => syncToPromise(() => {
      const allCount: { [string]: { word: string, count: number } } = {};
      res.reduce((pre, cur) => [...pre, ...cur], []).forEach(wor => {
        if (!allCount[wor.word]) allCount[wor.word] = { word: wor.word, count: 0 };
        allCount[wor.word].count += wor.count;
      });
      return _.values(allCount);
    }));
}

class WordCloud extends React.Component {

  props: {
    title: string,
    metric: TimeRangeMetric,
    type: 'all',
  }

  state : {
    loading: boolean,
    data: { text: string, value: number }[],
  }

  generateData: Function

  constructor(props: Object) {
    super(props);

    this.generateData = this.generateData.bind(this);

    this.state = {
      loading: true,
      data: [],
    };
  }

  componentWillMount() {
    this.generateData(this.props);
  }

  componentWillReceiveProps(nextProps: Object) {
    this.generateData(nextProps);
  }

  generateData(props: Object) {
    this.setState({ loading: true, data: [] });
    const { metric, type } = props;

    const fixType = type || 'all';

    calculate(fixType, metric)
      .then(res => {
        const rawData = res.map(wor => ({ text: wor.word, value: wor.count }));
        const data = _.sortBy(rawData, 'value')
          .reverse()
          .filter(dat => dat.value > 1)
          .slice(0, 500);
        return data;
      })
      .then(data => this.setState({ loading: false, data }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { title } = this.props;
    const { loading, data } = this.state;

   let content;

   if (!loading && data.length > 0) {
      content = (<Measure>
        { dimensions => (
          <Cloud
            width={(dimensions.width || 400)}
            data={data}
          />
        )}
      </Measure>);
    } else if (loading) {
      content = <div>Counting words...</div>
    } else {
      content = <div>Not enough data.</div>
    }

    return (
      <Card>
        <h3>{title}</h3>
        {content}
      </Card>
    );
  };

}

export default WordCloud;
