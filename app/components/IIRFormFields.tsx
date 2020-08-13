import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps, Form } from 'redux-form';
import FormInput from './forms/formInput';
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
  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
      className={styles['form-container']}
    >
      <div>
        <Field
          label="CUSTOMER REASON FOR REMOVAL:"
          component={FormInput}
          name="customerReasonForRemoval"
          type="text"
          defaultValue="test"
          disabled={false}
        />
      </div>
      <div>
        <Field
          label="GENERAL CONDITION AS RECEIVED (HIDDEN DAMAGE):"
          component={FormInput}
          name="genConditionReceived"
          type="text"
          defaultValue="test"
          disabled={false}
        />
      </div>
      <div>
        <Field
          label="EVALUATION FINDINGS:"
          component={FormInput}
          name="evalFindings"
          type="text"
          defaultValue="test"
          disabled={false}
        />
      </div>
      <div>
        <Field
          label="WORK PERFORMED:"
          component={FormInput}
          name="workedPerformed"
          type="text"
          defaultValue="test"
          disabled={false}
        />
        <div>
          <div>Manual_Combined: 'OEM       BASF ACMM           21-11-15         3092108'</div>
        </div>
      </div>
    </form>
  );
};

interface Values {}

function validate(values: Values) { }

export default reduxForm<FormProps, DispatchProps>({
  form: 'iirForm',
  validate,
  destroyOnUnmount: false
})(IIRForm);
