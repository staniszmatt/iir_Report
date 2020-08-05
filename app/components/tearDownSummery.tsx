import React from 'react';
import { PDFViewer, PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import TearDownPDF from './tearDowSummeryPDF';
import Btn from './buttonFunctions/buttonClickHandler';
// import styles from './tearDownSummer.css';

interface Props {}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);


export default function TearDownSummery() {
  return (
    <PDFViewer>
      <MyDocument />
    </PDFViewer>
  );

  // const testData = {
  //   test: 'test',
  //   data: {
  //     data1: 'data1',
  //     data2: 'data2'
  //   }
  // };

  // const testBtn = (event: any) => {
  //   console.log('Submit Form Btn Pressed, event:', event);
  // };

  // return (
  //   <div className={styles['form-container']}>
  //     <div className={styles.page}>
  //       <div>
  //         <div>Header Test</div>
  //       </div>
  //       <div>
  //         <div>Body Test</div>
  //       </div>
  //       <div>
  //         <div>Footer Test</div>
  //       </div>
  //     </div>
  //     <div>
  //       <Btn buttonName="Submit Form" ClickHandler={testBtn} />
  //     </div>

  //     <PDFDownloadLink
  //       document={<TearDownPDF data={testData} />}
  //       fileName="new.pdf"
  //       style={{
  //         textDecoration: 'none',
  //         padding: '10px',
  //         color: 'blue',
  //         backgroundColor: '#f2f2f2',
  //         border: '1px solid black',
  //         borderRadius: '5px'
  //       }}
  //     >
  //       Generate
  //     </PDFDownloadLink>
  //   </div>
  // );
}
