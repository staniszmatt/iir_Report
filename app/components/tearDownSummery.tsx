import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TearDownPDF from './tearDowSummeryPDF';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './tearDownSummer.css';

interface Props {}

export default function TearDownSummery(props: Props) {
  const testData = {
    test: 'test',
    data: {
      data1: 'data1',
      data2: 'data2'
    }
  };

  const testBtn = (event: any) => {
    console.log('Submit Form Btn Pressed, event:', event);
  };

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

      <PDFDownloadLink
        document={<TearDownPDF data={testData} />}
        fileName="new.pdf"
        style={{
          textDecoration: 'none',
          padding: '10px',
          color: 'blue',
          backgroundColor: '#f2f2f2',
          border: '1px solid black',
          borderRadius: '5px'
        }}
      >
        Generate
      </PDFDownloadLink>
    </div>
  );
}
