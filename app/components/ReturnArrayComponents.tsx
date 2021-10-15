/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface ReturnArrayProps {
  props: any;
}

export default function ReturnArrayComponents(
  returnArrayProps: ReturnArrayProps
) {
  // eslint-disable-next-line react/destructuring-assignment
  const propsArray = returnArrayProps.props;
  let mappedComponents: [] | {};
  if (propsArray === 'N/A') {
    mappedComponents = <div>N/A</div>;
  } else {
    mappedComponents = propsArray.map((objString: string, index: number) => {
      // If used for other than certs, will need to setup check to ignore slice
      if (objString) {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`arrayComponentKey${index}`}>{objString.slice(2)}</div>
        );
      }
      return null;
    });
  }
  return <div>{mappedComponents}</div>;
}
