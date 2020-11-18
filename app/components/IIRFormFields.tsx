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

interface FormProps {
  customerReasonForRemoval: string;
  evalFindings: string;
  genConditionReceived: string;
  workedPerformed: string;
}

interface DispatchProps {
  onSubmit: any | (() => void);
  props: {
    handleReviewIIRPDF: () => {};
    CustomerNumber: string;
    linkedWorkOrderIfAPE: string;
  };
}

const IIRForm = (
  iirFormProps: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  let btnText = 'UPDATE IIR NOTES';
  const { handleSubmit, onSubmit } = iirFormProps;
  const {
    CustomerNumber,
    linkedWorkOrderIfAPE,
    handleReviewIIRPDF
  } = iirFormProps.props;
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformed
  } = iirFormProps.initialValues;
  let textareaDisabled = false;
  let apeOrderNotLinked = false;

  // If this is an APE work order and the customer work order isn't linked, display warning and hide pdf button.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  CustomerNumber === 'APE' && !linkedWorkOrderIfAPE
    ? (apeOrderNotLinked = true)
    : (apeOrderNotLinked = false);

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

  if (CustomerNumber === 'APE') {
    textareaDisabled = true;
  }

  if (
    customerReasonForRemoval === null &&
    evalFindings === null &&
    genConditionReceived === null &&
    workedPerformed === null
  ) {
    btnText = 'ADD NEW IIR NOTES';
  }

  console.log('edit form props:', iirFormProps);

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
            disabled={textareaDisabled}
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
            disabled={textareaDisabled}
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
            disabled={textareaDisabled}
          />
        </div>
        <div>
          <Field
            label={workPerf}
            component={FormTextInput}
            name="workedPerformed"
            type="textarea"
            aria-multiline
            defaultValue={workedPerformed}
            rows="10"
          />
        </div>
        <div className={styles['form-btn-container']}>
          {!apeOrderNotLinked && (
            <div>
              <Btn buttonName={btnText} ClickHandler={handleSubmit(onSubmit)} />
            </div>
          )}
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

function validate(values: FormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = {};
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformed
  } = values;

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
  validate
})(IIRForm);
