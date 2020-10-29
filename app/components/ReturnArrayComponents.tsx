/* eslint-disable react/destructuring-assignment */
import React from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
}

export default function ReturnArrayComponents(props: Props) {
  const propsArray = props.props;
  let mappedComponents: [] | {};
  if (propsArray === 'N/A') {
    mappedComponents = <div>N/A</div>;
  } else {
    mappedComponents = propsArray.map((objString: string, index: number) => {
      // If used for other than certs, will need to setup check to ignore slice
      // eslint-disable-next-line react/no-array-index-key
      return <div key={`arrayComponentKey${index}`}>{objString.slice(3)}</div>;
    });
  }
  return <div>{mappedComponents}</div>;
}
