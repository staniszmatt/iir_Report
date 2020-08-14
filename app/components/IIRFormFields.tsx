/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps, Form } from 'redux-form';
import FormTextInput from './forms/formTextArea';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './IIRFormFields.css';

interface FormProps {}

interface DispatchProps {
  onSubmit: () => {};
}

const IIRForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  console.log('IIR Form, props', props);
  const { handleSubmit, onSubmit } = props;

  const charCheck = (value: string) => {
    const changeCharString = value
      .replace(/[`]/g, '"')
      .replace(/[']/g, '"')
      .replace(/["]/g, '"');
    return changeCharString;
  };

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

  const workPerformedLabel = `WORK PERFORMED: ${workedPerformedFixString}`;

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
      className={styles['form-container']}
    >
      <div>
        <Field
          label="CUSTOMER REASON FOR REMOVAL:"
          component={FormTextInput}
          name="customerReasonForRemoval"
          type="textarea"
          aria-multiline
          defaultValue={customerReasonForRemoval}
          rows="10"
          normalize={charCheck}
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
          normalize={charCheck}
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
          normalize={charCheck}
        />
      </div>
      <div>
        <Field
          label={workPerformedLabel}
          component={FormTextInput}
          name="workedPerformed"
          type="textarea"
          aria-multiline
          defaultValue={workedPerformedNote}
          rows="10"
          normalize={charCheck}
        />
      </div>
    </form>
  );
};

export default reduxForm<FormProps, DispatchProps>({
  form: 'iirForm',
  destroyOnUnmount: false
})(IIRForm);
