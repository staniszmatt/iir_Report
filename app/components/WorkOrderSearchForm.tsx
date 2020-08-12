import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './WorkOrderSearchForm.css';

interface FormProps {
  props: any;
}

interface DispatchProps {
  onSubmit: () => {};
}

const WorkOrderSearchForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = props;

  function toUpperCase(value: string) {
    return value && value.toUpperCase();
  }

  return (
    <div className={styles['form-container']} data-tid="container">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Search For Work Order:"
            component={FormInput}
            name="workOrderSearch"
            type="text"
            format={toUpperCase}
          />
          <Field
            label="Line Item:"
            component={FormInput}
            name="workOrderSearchLineItem"
            type="text"
            format={toUpperCase}
          />
        </form>
        <div>
          <Btn buttonName="Submit" ClickHandler={handleSubmit(onSubmit)} />
        </div>
      </div>
    </div>
  );
};

export default reduxForm<FormProps, DispatchProps>({
  form: 'workOrderSearchForm'
})(WorkOrderSearchForm);
