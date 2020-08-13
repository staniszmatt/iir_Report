import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LoadingScreen from './LoadingDisplay';
import TearDownPDF from './tearDownSummeryPDF';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import styles from './tearDownSummer.css';
import logo from '../img/logo.png';

interface Props {
  getWorkOrderData: () => {};
  postIIRReport: () => {};
  iir: {
    loadingScreen: boolean;
    loadPDF: boolean;
  }
}

export default function TearDownSummery(props: Props) {

  console.log('tear down component, props:', props);

  const { getWorkOrderData, postIIRReport } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { loadingScreen, loadPDF } = props.iir;

  return (
    <div className={styles['form-container']}>
      <div>
        <WorkOrderSearchForm onSubmit={getWorkOrderData} />
      </div>
      {loadingScreen && <LoadingScreen />}
      {loadPDF && (
        <div>
          <div className={styles['form-page']}>
            <div>
              <div className={styles['form-header']}>
                <div>
                  <img src={logo} alt="Aero Parts Logo" />
                </div>
                <div>TEARDOWN REPORT</div>
                {/** Filler for centering as seen below */}
                <div />
              </div>
              <div className={styles['form-body']}>
                <div />
                <div>
                  <div>
                    <div>
                      <div>First Line of inputs</div>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div />
              </div>
              <div className={styles['form-footer']}>
                <div>FORM-X-XX-XXXX Rev.X</div>
                <div>PRINT DATE: XX-XX-XXXX</div>
              </div>
            </div>
          </div>

          <div>
            <button type="button">
              <PDFDownloadLink document={<TearDownPDF />} fileName="IIR.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? <i> Loading document...</i> : <i> Download Pdf </i>}
              </PDFDownloadLink>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
