/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './LinkWorkOrderForm.css';

interface FormProps {
  linkWorkOrderToAPE: string;
  linkWorkOrderToAPELineItem: string;
}

interface DispatchProps {
  onSubmit: any | (() => void);
  props?: {
    workOrderSearch: string;
  };
}

const LinkWorkOrderForm = (
  linkWorkOrderProps: DispatchProps &
    InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = linkWorkOrderProps;

  function toUpperCase(value: string) {
    return value && value.toUpperCase();
  }

  return (
    <div className={styles['link-form-container']} data-tid="container">
      <div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="REQUIRED TO LINK CUSTOMER WORK ORDER TO APE:"
              component={FormInput}
              name="linkWorkOrderToAPE"
              format={toUpperCase}
            />
            <Field
              label="Line Item"
              component={FormInput}
              name="linkWorkOrderToAPELineItem"
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

function validate(values: FormProps, linkWorkOrderProps: DispatchProps) {
  const { linkWorkOrderToAPE, linkWorkOrderToAPELineItem } = values;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = {};

  if (!linkWorkOrderToAPE) {
    errors.linkWorkOrder = 'Please Enter A Work Order Number!';
  }
  if (linkWorkOrderToAPE) {
    if (linkWorkOrderToAPE.length > 5 || linkWorkOrderToAPE.length < 5) {
      errors.linkWorkOrder =
        'Work Order Number should only be 5 characters long!';
    }
    if (linkWorkOrderToAPE === linkWorkOrderProps.props?.workOrderSearch) {
      errors.linkWorkOrder = 'Trying to link APE to itself';
    }
  }

  if (!linkWorkOrderToAPELineItem) {
    errors.workOrderSearchLineItem =
      'Please enter the work order number line item number!';
  }
  if (linkWorkOrderToAPELineItem) {
    if (linkWorkOrderToAPELineItem.length > 2) {
      errors.workOrderSearchLineItem =
        'Line item number should only be 2 characters long!';
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(linkWorkOrderToAPELineItem as any)) {
      errors.workOrderSearchLineItem = 'Line item must be a number!';
    }
    if (linkWorkOrderToAPELineItem === '0') {
      errors.workOrderSearchLineItem = 'Line item must start with 1 or higher!';
    }
  }

  return errors;
}

export default reduxForm<FormProps, DispatchProps>({
  form: 'linkWorkOrderForm',
  validate
})(LinkWorkOrderForm);
