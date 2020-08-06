import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import TearDownPDF from './tearDowSummeryPDF';

interface Props {}


export default function TearDownSummery(props: Props) {
  console.log("tear down component, props:", props);
  return (
    <div>
      <PDFViewer>
        <TearDownPDF />
      </PDFViewer>
      <PDFDownloadLink document={<TearDownPDF />} fileName="IIR.pdf">
        {({ blob, url, loading, error }) =>
          loading ? <i> Loading document...</i> : <i> Download Pdf </i>}
      </PDFDownloadLink>
    </div>
  );
}

// ReactDOM.render(<TearDownSummery />, document.getElementById('root'));
