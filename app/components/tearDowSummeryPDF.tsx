import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import moment from 'moment';
import aeroPartsLogo from '../img/logo.png';

const styles = StyleSheet.create({
  image: {
    height: '100px',
    width: '200px'
  },
  flex: {
    display: 'flex',
    width: '100%'
  },
  middle: {
    margin: 'auto'
  }
});

export default function TearDownPDF(props) {
  console.log("pdf props", props);

  return (
    <Document>
      <Page style={styles.page}>
        <View>
          <View style={styles.flex}>
            <View style={styles.middle}>
              <Image src={aeroPartsLogo} style={styles.image} />
            </View>
            <View style={styles.middle}>
              <Text>Image Above</Text>
            </View>
          </View>
          <Text>TEARDOWN REPORT</Text>
        </View>
        <View>
          <Text>Testing 3</Text>
          <Text>Testing 4</Text>
        </View>
      </Page>
    </Document>
  );
}
