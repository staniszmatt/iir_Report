/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-useless-escape */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormTextInput from './forms/formTextArea';
import styles from './IIRFormFields.css';

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
  console.log('IIR Form, props', props);
  const { handleSubmit, onSubmit } = props;

  const {
    customerReasonForRemoval,
    evalFindings,
    genConditionReceived,
    workedPerformedNote,
    workedPerformed
  } = props.props;

  const workedPerformedFixString = workedPerformed
    .replace('       ', ' ', 'g')
    .replace('           ', ' ', 'g')
    .replace('         ', ' ', 'g');

  const workPerformedDefault = `${workedPerformedFixString}\n${workedPerformedNote}`;

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
      <div className={styles['form-disabled']}>
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
