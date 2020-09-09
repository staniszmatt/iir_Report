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
  let btnText = 'Update IIR Notes';
  const { handleSubmit, onSubmit } = props;

  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformedNote,
    handleReviewIIRPDF
  } = props.props;

  if (
    customerReasonForRemoval === undefined &&
    evalFindings === undefined &&
    genConditionReceived === undefined &&
    workedPerformedNote === undefined
  ) {
    btnText = 'Add New IIR Notes';
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form-container']}
    >
      <div>
        <div>
          <Field
            label="CUSTOMER REASON FOR REMOVAL:"
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
            label="GENERAL CONDITION AS RECEIVED (HIDDEN DAMAGE):"
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
            label="EVALUATION FINDINGS:"
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
            label="Worked Performed:"
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
}

function validate(values: Values) {
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
    workedPerformed: null
  }
})(IIRForm);
