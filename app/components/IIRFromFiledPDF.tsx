/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-useless-escape */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormTextInput from './forms/formTextArea';
import styles from './IIRFormFields.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormProps {}

interface DispatchProps {
  onSubmit: () => {};
  props: {
    customerReasonForRemoval: string;
    evalFindings: string;
    genConditionReceived: string;
    workedPerformedNote: string;
    workedPerformed: string;
  };
}

const IIRForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = props;
  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformedNote,
    workedPerformed
  } = props.props;
  // Removing white space for this specific item in the JobCost DB.
  const workedPerformedFixString = workedPerformed
    .replace('       ', ' ')
    .replace('           ', ' ')
    .replace('         ', ' ');
  const warningCheck = {
    background: 'none'
  };

  let workPerformedDefault = `${workedPerformedFixString}\n${workedPerformedNote}`;

  if (workedPerformed === 'N/A' || workedPerformed === '') {
    workPerformedDefault = 'WARNING - NO WORK HAS BEEN SETUP YET!';
    warningCheck.background = 'yellow';
  } else {
    warningCheck.background = 'none';
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['form-container']}
    >
      <div className={styles['form-disabled']}>
        <Field
          label="CUSTOMER REASON FOR REMOVAL:"
          component={FormTextInput}
          name="customerReasonForRemoval"
          type="textarea"
          aria-multiline
          defaultValue={customerReasonForRemoval}
          rows="10"
          disabled={true}
        />
      </div>
      <div className={styles['form-disabled']}>
        <Field
          label="GENERAL CONDITION AS RECEIVED (HIDDEN DAMAGE):"
          component={FormTextInput}
          name="genConditionReceived"
          type="textarea"
          aria-multiline
          defaultValue={genConditionReceived}
          rows="10"
          disabled={true}
        />
      </div>
      <div className={styles['form-disabled']}>
        <Field
          label="EVALUATION FINDINGS:"
          component={FormTextInput}
          name="evalFindings"
          type="textarea"
          aria-multiline
          defaultValue={evalFindings}
          rows="10"
          disabled={true}
        />
      </div>
      <div className={styles['form-disabled']} style={warningCheck}>
        <Field
          label="WORK PERFORMED:"
          component={FormTextInput}
          name="workedPerformed"
          type="textarea"
          aria-multiline
          defaultValue={workPerformedDefault}
          rows="10"
          disabled={true}
        />
      </div>
    </form>
  );
};

export default reduxForm<FormProps, DispatchProps>({
  form: 'iirFormDisabled'
})(IIRForm);
