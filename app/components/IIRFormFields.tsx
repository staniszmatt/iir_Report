/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-useless-escape */
import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import routes from '../constants/routes.json';
import FormTextInput from './forms/formTextArea';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './IIRFormFields.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormProps {}

interface DispatchProps {
  onSubmit: () => {};
  props: {
    handleReviewIIRPDF: () => {};
    customerReasonForRemoval: string;
    evalFindings: string;
    genConditionReceived: string;
    workedPerformedNote: string;
    tso: string;
    tsn: string;
    tsr: string;
  };
  initialValues: {
    tso: null;
    tsn: null;
    tsr: null;
  }
}

const IIRForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {

  console.log('form props', props);

  let btnText = 'UPDATE IIR NOTES';
  const { handleSubmit, onSubmit } = props;
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformedNote,
    handleReviewIIRPDF,
    tso,
    tsn,
    tsr
  } = props.props;
  props.initialValues.tso = tso;
  props.initialValues.tsn = tsn;
  props.initialValues.tsr = tsr;

  // Setup of label text to include some new line editing here.
  const custRemoval = `(INCOMING INSPECTION)
  CUSTOMER REASON FOR REMOVAL:`;
  const genCondition = `(INCOMING INSPECTION)
  GENERAL CONDITION AS RECEIVED:
  (OUT OF BOX VIEW EX: CLEAN, DIRTY, MISSING PARTS, DENTED, SCARTCHES)`;
  const evalCondition = `(INCOMING INSPECTION)
  EVALUATION FINDINGS:
  (HIDDEN DAMAGE:  N/A, DENTED, DAMAGED FLANGE, LEAKS, CORRODED, CRACKED)`;
  const workPerf = `(FINAL TABLE)
  Worked Performed:`;

  if (
    customerReasonForRemoval === null &&
    evalFindings === null &&
    genConditionReceived === null &&
    workedPerformedNote === null
  ) {
    btnText = 'ADD NEW IIR NOTES';
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form-container']}
    >
      <div>
        <div>
          <div>(FINAL TABLE)</div>
          <div>
            <Field
              label="TSO"
              component={FormInput}
              defaultValue={tso}
              name="tsoValue"
              type="text"
            />
          </div>
          <div>
            <Field
              label="TSR"
              component={FormInput}
              defaultValue={tsr}
              name="tsrValue"
              type="text"
            />
          </div>
          <div>
            <Field
              label="TSN"
              component={FormInput}
              defaultValue={tsn}
              name="tsnValue"
              type="text"
            />
          </div>
        </div>
        <div>
          <Field
            label={custRemoval}
            component={FormTextInput}
            name="customerReasonForRemoval"
            type="textarea"
            aria-multiline
            defaultValue={customerReasonForRemoval}
            rows="10"
          />
        </div>
        <div>
          <Field
            label={genCondition}
            component={FormTextInput}
            name="genConditionReceived"
            type="textarea"
            aria-multiline
            defaultValue={genConditionReceived}
            rows="10"
          />
        </div>
        <div>
          <Field
            label={evalCondition}
            component={FormTextInput}
            name="evalFindings"
            type="textarea"
            aria-multiline
            defaultValue={evalFindings}
            rows="10"
          />
        </div>
        <div>
          <Field
            label={workPerf}
            component={FormTextInput}
            name="workedPerformed"
            type="textarea"
            aria-multiline
            defaultValue={workedPerformedNote}
            rows="10"
          />
        </div>
        <div className={styles['form-btn-container']}>
          <div>
            <Btn buttonName={btnText} ClickHandler={handleSubmit(onSubmit)} />
          </div>
          <div>
            <Link to={routes.IIRFORM}>
              <Btn buttonName="Review PDF" ClickHandler={handleReviewIIRPDF} />
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

interface Values {
  customerReasonForRemoval: string;
  evalFindings: string;
  genConditionReceived: string;
  workedPerformed: string;
  tsn: any;
  tso: any;
  tsr: any;
}

function validate(values: Values) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = {};
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformed,
    tsnValue,
    tsrValue,
    tsoValue
  } = values;

  console.log('tsn, tsr, tso values: ', tsnValue, tsrValue, tsoValue);
  console.log('customerReasonForRemoval ', customerReasonForRemoval);

  if (isNaN(tsnValue)) {
    errors.tsnValue = 'Must be a number!';
  }

  if (isNaN(tsrValue)) {
    errors.tsrValue = 'Must be a number!';
  }

  if (isNaN(tsoValue)) {
    errors.tsoValue = 'Must be a number!';
  }

  if (customerReasonForRemoval) {
    if (customerReasonForRemoval.length > 700) {
      errors.customerReasonForRemoval = 'Over max charictor limit!';
    }
  }

  if (evalFindings) {
    if (evalFindings.length > 700) {
      errors.evalFindings = 'Over max charictor limit!';
    }
  }

  if (genConditionReceived) {
    if (genConditionReceived.length > 700) {
      errors.genConditionReceived = 'Over max charictor limit!';
    }
  }

  if (workedPerformed) {
    if (workedPerformed.length > 616) {
      errors.workedPerformed = 'Over max charictor limit!';
    }
  }
  return errors;
}

export default reduxForm<FormProps, DispatchProps>({
  form: 'iirForm',
  validate,
  // Set Initial values to null so returns null if no changes are made.
  initialValues: {
    customerReasonForRemoval: null,
    genConditionReceived: null,
    evalFindings: null,
    workedPerformed: null,
    tso: null,
    tsn: null,
    tsr: null
  }
})(IIRForm);
