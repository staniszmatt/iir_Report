/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';

interface Props {
  props: {} | any;
}

function arrayObjectComponentsReturn(arrayOfObjects: []) {
  const returnComponents = arrayOfObjects.map((arrayValue: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let subComponents: any;
    if (typeof arrayValue !== 'object') {
      return (
        <div key="unknownError">
          <p>Unknown Additional Error!</p>
          <p>Was part of the error but of unknown type.</p>
        </div>
      );
      // eslint-disable-next-line no-else-return
    } else if (typeof arrayValue === 'object') {
      subComponents = Object.keys(arrayValue).map(objKey => {
        return (
          <div key={objKey}>
            <p>{`Error Key: ${objKey}`}</p>
            <p>{`Description: ${arrayValue[objKey]}`}</p>
          </div>
        );
      });
    }
    return subComponents;
  });
  return returnComponents;
}

export default function AlarmModal(props: Props) {
  const objectList = props.props;
  let mappedComponents: [] | {};

  if (typeof objectList !== 'object') {
    mappedComponents = (
      <div>
        <p>ERROR</p>
        <p>Error happened but not sure what it was!</p>
      </div>
    );
  } else {
    mappedComponents = Object.keys(objectList).map((key: string) => {
      if (Array.isArray(objectList[key])) {
        const objArrayList = arrayObjectComponentsReturn(objectList[key]);
        return (
          <div key={key}>
            <div>{`Error Key: ${key}`}</div>
            <div>{objArrayList}</div>
          </div>
        );
        // eslint-disable-next-line no-useless-return
      }
      return (
        <div key={key}>
          <p>{`Error Key: ${key}`}</p>
          <p>{`Description: ${objectList[key]}`}</p>
        </div>
      );
    });
  }

  // const errorKey = Object.keys(props.props)[0];
  return (
    <div className={styles['error-modal-container']}>
      <div>
        <p>ERROR!</p>
      </div>
      <div>{mappedComponents}</div>
    </div>
  );
}
