import React from 'react';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './tearDownSummer.css';

export default function TearDownSummery() {

  const testBtn = (event) => {
    console.log('Submit Form Btn Pressed, event:', event);
  }

  return (
    <div className={styles['form-container']}>
      <div className={styles.page}>
        <div>
          <div>Header Test</div>
        </div>
        <div>
          <div>Body Test</div>
        </div>
        <div>
          <div>Footer Test</div>
        </div>
      </div>
      <div>
        <Btn buttonName="Submit Form" ClickHandler={testBtn} />
      </div>
    </div>
  );
}
