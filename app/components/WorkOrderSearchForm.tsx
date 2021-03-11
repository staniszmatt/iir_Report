/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './WorkOrderSearchForm.css';

interface FormProps {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}

interface DispatchProps {
  onSubmit: any | (() => void);
}

const WorkOrderSearchForm = (
  props: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = props;

  function toUpperCase(value: string) {
    return value && value.toUpperCase();
  }

  return (
    <div className={styles['form-container']} data-tid="searchContainer">
      <div>
        <div>Search For Work Order:</div>
      </div>
      <div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="Search For Work Order:"
              component={FormInput}
              name="workOrderSearch"
              format={toUpperCase}
            />
            <Field
              label="Line Item:"
              component={FormInput}
              name="workOrderSearchLineItem"
              format={toUpperCase}
            />
          </form>
          <div>
            <Btn buttonName="SEARCH" ClickHandler={handleSubmit(onSubmit)} />
          </div>
        </div>
      </div>
    </div>
  );
};

function validate(values: FormProps) {
  const { workOrderSearch, workOrderSearchLineItem } = values;
  const errors: any = {};

  if (!workOrderSearch) {
    errors.workOrderSearch = 'Please Enter A Work Order Number!';
  }
  if (workOrderSearch) {
    if (workOrderSearch.length > 5) {
      errors.workOrderSearch =
        'Work Order Number should only be 5 characters long!';
    }
  }
  if (!workOrderSearchLineItem) {
    errors.workOrderSearchLineItem =
      'Please enter the work order number line item number!';
  }
  if (workOrderSearchLineItem) {
    if (workOrderSearchLineItem.length > 2) {
      errors.workOrderSearchLineItem =
        'Line item number should only be 2 characters long!';
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(workOrderSearchLineItem as any)) {
      errors.workOrderSearchLineItem = 'Line item must be a number!';
    }
    if (workOrderSearchLineItem === '0') {
      errors.workOrderSearchLineItem = 'Line item must start with 1 or higher!';
    }
  }

  return errors;
}

export default reduxForm<FormProps, DispatchProps>({
  form: 'workOrderSearchForm',
  validate
})(WorkOrderSearchForm);
