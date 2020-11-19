/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './LinkWorkOrderForm.css';

interface FormProps {
  linkWorkOrder: string;
}

interface DispatchProps {
  onSubmit: any | (() => void);
  label: string;
  props?: {
    workOrderSearch: string;
  };
}

const LinkWorkOrderForm = (
  linkWorkOrderProps: DispatchProps &
    InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit, label } = linkWorkOrderProps;

  function toUpperCase(value: string) {
    return value && value.toUpperCase();
  }

  return (
    <div className={styles['link-form-container']} data-tid="container">
      <div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label={label}
              component={FormInput}
              name="linkWorkOrder"
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
  const { linkWorkOrder } = values;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any = {};

  if (!linkWorkOrder) {
    errors.linkWorkOrder = 'Please Enter A Work Order Number!';
  }
  if (linkWorkOrder) {
    if (linkWorkOrder.length > 5 || linkWorkOrder.length < 5) {
      errors.linkWorkOrder =
        'Work Order Number should only be 5 characters long!';
    }
    if (linkWorkOrder === linkWorkOrderProps.props?.workOrderSearch) {
      errors.linkWorkOrder = 'Trying to link APE to itself';
    }
  }
  return errors;
}

export default reduxForm<FormProps, DispatchProps>({
  form: 'linkWorkOrderForm',
  validate
})(LinkWorkOrderForm);
