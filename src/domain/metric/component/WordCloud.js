// @flow
import React from 'react';
import _ from 'lodash';
import Measure from 'react-measure';
import Cloud from './Cloud';
import Card from 'infra/component/Card';
import { syncToPromise } from 'infra/service/util';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

export const WordCloudTypes = {
  POSTS: 'POSTS',
  COMMENTS: 'COMMENTS',
  ALL: 'ALL',
};

export type WordCloudType = $Keys<typeof WordCloudTypes>

const calculate = (type: WordCloudType, metric: TimeRangeMetric): Promise<{ word: string, count: number }[]> => {
  let promises = [];

  switch (type) {
    case WordCloudTypes.POSTS:
      promises = [metric.postsMetric.wordCount()];
      break;
    case WordCloudTypes.COMMENTS:
      promises = [metric.commentsMetric.wordCount()];
      break;
    case WordCloudTypes.ALL:
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
};

const generateWidth = (rawWidth?: number): number => {
  if (!rawWidth) return 400;
  if (rawWidth === 400) return 273;
  return rawWidth;
};

const generateHeight = (data: any[]): number => {
  const length = data.length;

  let height = 400;
  if (length < 30) {
    height = 200;
  } else if (length < 50) {
    height = 250;
  } else if (length < 80) {
    height = 300;
  } else if (length < 120) {
    height = 350;
  }

  return height;
};

const generateTitle = (type: WordCloudType): string => {
  switch (type) {
    case WordCloudTypes.ALL:
      return 'Word Cloud from Posts and Comments';
    case WordCloudTypes.POSTS:
      return 'Word Cloud from Posts';
    case WordCloudTypes.COMMENTS:
      return 'Word Cloud from Comments';
    default:
      return 'Word Cloud';
  }
};

class WordCloud extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: WordCloudType,
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
    const { metric, type } = {
      type: WordCloudTypes.ALL,
      ...props,
    };

    calculate(type, metric)
      .then(res => {
        const rawData = res.map(wor => ({ text: wor.word, value: wor.count }));
        const data = _.sortBy(rawData, 'value')
          .reverse()
          .filter(dat => dat.value > 1)
          .slice(0, 300);
        return data;
      })
      .then(data => this.setState({ loading: false, data }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { type } = this.props;
    const { loading, data } = this.state;

   let content;

   if (!loading && data.length > 0) {
      content = (<Measure>
        { dimensions => (
          <Cloud
            width={generateWidth(dimensions.width)}
            height={generateHeight(data)}
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
      <Card title={generateTitle(type)}>
        {content}
      </Card>
    );
  };

}

export default WordCloud;
