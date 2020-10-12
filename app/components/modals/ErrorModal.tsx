/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';

interface Props {
  props: {} | any;
}

function arrayObjectComponentsReturn(arrayOfObjects: []) {
  const returnComponents = arrayOfObjects.map((arrayValue: any) => {
    if (typeof arrayValue !== 'object') {
      return (
        <div key="unknownError">
          <p>Unkown Additional Error!</p>
          <p>Was part of the error but of uknown type.</p>
        </div>
      );
      // eslint-disable-next-line no-else-return
    } else {
      const keyName: any = Object.keys(arrayValue);
      console.log('array Value: ', arrayValue)
      console.log('KeyName: ', Object.keys(arrayValue));
      console.log('KeyValue: ', arrayValue[keyName]);
      debugger;

      return (
        <div key={keyName}>
          <p>{`Error Key: ${keyName}`}</p>
          <p>{`Description: ${arrayValue[keyName]}`}</p>
        </div>
      );
    }
  });
  return returnComponents;
}

export default function AlarmModal(props: Props) {
  // const objectList = props.props;

  // TODO: Testing only objectList
  const objectList: any = {
    test1: 'test1',
    test2: 'test2',
    test3: [
      {
        testA: 'testA',
        testB: 'testB'
      }
    ]
  };

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

      console.log(`Key: ${key}, Value: ${objectList[key]}`);

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
