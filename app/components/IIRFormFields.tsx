/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-useless-escape */
import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import routes from '../constants/routes.json';
import FormTextInput from './forms/formTextArea';
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
  };
}

const IIRForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  let btnText = 'UPDATE IIR NOTES';
  const { handleSubmit, onSubmit } = props;
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformedNote,
    handleReviewIIRPDF
  } = props.props;

  // Setup of label text to include some new line editing here.
  const custRemoval = `(INCOMING INSPECTION)
  CUSTOMER REASON FOR REMOVAL:`;
  const genCondition = `(INCOMING INSPECTION)
  GENERAL CONDITION AS RECEIVED:
  (OUT OF BOX VIEW EX: CLEAN, DIRTY, MISSING PARTS, DENTED, SCRATCHES)`;
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
  tsnValue: any;
  tsoValue: any;
  tsrValue: any;
}

// Remove Colon Option for input to verify if its a number
function testColonNumber(value: any) {
  const removeColon = value.replace(/:/g, '');
  return isNaN(removeColon);
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
  // Check if value exists before testing
  if (tsnValue) {
    const testValue: boolean = testColonNumber(tsnValue);
    if (testValue) {
      errors.tsnValue = 'Must be a number!';
    }
  }

  if (tsrValue) {
    const testValue: boolean = testColonNumber(tsrValue);
    if (testValue) {
      errors.tsrValue = 'Must be a number!';
    }
  }

  if (tsoValue) {
    const testValue: boolean = testColonNumber(tsoValue);
    if (testValue) {
      errors.tsoValue = 'Must be a number!';
    }
  }

  if (customerReasonForRemoval) {
    if (customerReasonForRemoval.length > 700) {
      errors.customerReasonForRemoval = 'Over max character limit!';
    }
  }

  if (evalFindings) {
    if (evalFindings.length > 700) {
      errors.evalFindings = 'Over max character limit!';
    }
  }

  if (genConditionReceived) {
    if (genConditionReceived.length > 700) {
      errors.genConditionReceived = 'Over max character limit!';
    }
  }

  if (workedPerformed) {
    if (workedPerformed.length > 616) {
      errors.workedPerformed = 'Over max character limit!';
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
    tsnValue: null,
    tsrValue: null,
    tsoValue: null
  }
})(IIRForm);
