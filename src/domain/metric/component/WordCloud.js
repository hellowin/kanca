// @flow
import React from 'react';
import _ from 'lodash';
import Measure from 'react-measure';
import Cloud from './Cloud';
import Card from 'infra/component/Card';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const calculate = (type: string, metric: TimeRangeMetric): Promise<{ word: string, count: number }[]> => {
  const promPostsWordCount = metric.postsMetric.wordCount();
  const promCommsWordCount = metric.commentsMetric.wordCount();

  switch (type) {
    case 'all':
    default:
      const allCount: { [string]: { word: string, count: number } } = {};
      return Promise.all([promPostsWordCount, promCommsWordCount])
        .then(([postsWordCount, commsWordCount]) => {
          [...postsWordCount, ...commsWordCount].forEach(wor => {
            if (!allCount[wor.word]) allCount[wor.word] = { word: wor.word, count: 0 };
            allCount[wor.word].count += wor.count;
          });
          return _.values(allCount);
        });
  }
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
    const { metric, type } = this.props;

    const fixType = type || 'all';

    calculate(fixType, metric)
      .then(res => {
        const rawData = res.map(wor => ({ text: wor.word, value: wor.count }));
        const data = _.sortBy(rawData, 'value').reverse().slice(0, 500);
        return data;
      })
      .then(data => this.setState({ loading: false, data }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { title } = this.props;
    const { loading, data } = this.state;
    
    return (
      <Card>
        <h3>{title}</h3>
        {!loading ? (<Measure>
          { dimensions => (
            <Cloud
              width={dimensions.width - 30}
              data={data}
            />
          )}
        </Measure>) : <div>Counting words...</div>}
      </Card>
    );
  };

}

export default WordCloud;
