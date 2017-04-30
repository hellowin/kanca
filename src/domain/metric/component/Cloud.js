// @flow
import React from 'react';
import Cloud from 'react-d3-cloud';

class WordCloud extends React.Component {

  props: {
    data: { text: string, value: number }[],
    width: number,
  }

  render() {
    const { data, width } = this.props;

    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;

    return (
      <Cloud
        width={width}
        data={data}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
      />
    );
  };

}

export default WordCloud;
