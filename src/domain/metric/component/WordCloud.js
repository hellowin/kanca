// @flow
import React from 'react';
import _ from 'lodash';
import Measure from 'react-measure';
import Cloud from 'react-d3-cloud';
import Card from 'infra/component/Card';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const calculate = (type: string, metric: TimeRangeMetric): { word: string, count: number }[] => {
  const postsWordCount = metric.postsMetric.wordCount();
  const commsWordCount = metric.commentsMetric.wordCount();

  switch (type) {
    case 'all':
    default:
      const allCount: { [string]: { word: string, count: number } } = {};
      [...postsWordCount, ...commsWordCount].forEach(wor => {
        if (!allCount[wor.word]) allCount[wor.word] = { word: wor.word, count: 0 };
        allCount[wor.word].count += wor.count;
      });
      return _.values(allCount);
  }
}

class WordCloud extends React.Component {

  props: {
    title: string,
    metric: TimeRangeMetric,
    type: 'all',
  }

  render() {
    const { metric, type, title } = this.props;

    const fixType = type || 'all';

    const rawData = calculate(fixType, metric).map(wor => ({ text: wor.word, value: wor.count }));
    const data = _.sortBy(rawData, 'value').reverse().slice(0, 500);
    
    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;

    return (
      <Measure>
        { dimensions => (
          <Card>
            <h3>{title}</h3>
            <Cloud
              width={dimensions.width - 30}
              data={data}
              fontSizeMapper={fontSizeMapper}
              rotate={rotate}
            />
          </Card>
        )}
      </Measure>
    );
  };

}

export default WordCloud;
