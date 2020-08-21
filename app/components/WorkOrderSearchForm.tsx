/* eslint-disable @typescript-eslint/no-explicit-any */
/* NOTE:
   On the DOM when search is first entered, Ignoreing Warning: Cannot update a component from inside the function body of a different component.
  @hot-loader/react-dom is still on version 16.13.0, it's not compatible with react@16.13.1 but don't want to disable @hot-loader/react-dom.

  If for what ever reason it needs disabled, would need to replace @hot-loader/react-dom with @pmmmwh/react-refresh-webpack-plugin
  and in the configs/webpack.config.renderer.dev.babel.js in resolve: { alias: { 'react-dom': '@hot-loader/react-dom' } }
  change to resolve: { alias: { 'react-dom': 'react-dom' } }
*/
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './WorkOrderSearchForm.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormProps {}

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
        <div>Search For Work Order:</div>
      </div>
      <div>
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
    </div>
  );
};

interface Values {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}

function validate(values: Values) {
  const { workOrderSearch, workOrderSearchLineItem } = values;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
