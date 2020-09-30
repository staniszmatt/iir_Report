/* eslint-disable react/destructuring-assignment */
import React from 'react';

interface Props {
  props: [];
}

export default function ReturnArrayComponents(props: Props) {
  const propsArray = props.props;
  let mappedComponents = [];
  mappedComponents = propsArray.map((objString: string, index: number) => {
    // eslint-disable-next-line react/no-array-index-key
    return <div key={`arrayComponentKey${index}`}>{objString}</div>;
  });

  return <div>{mappedComponents}</div>;
}
