import React from 'react';
import { Field, reduxForm, InjectedArrayProps } from 'redux-form';
import FormInput from './forms/formInput';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './Home.css';

interface FormProps {
  props: any;
}

interface DispatchProps {
  onSubmit: () => {};
}

const Home = (
  props: DispatchProps & InjectedArrayProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = props;

  function toUpperCase(value:string) {
    return value && value.toUpperCase();
  }

  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.backgroundImageContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Search For Work Order"
            component={FormInput}
            name="workOrderSearch"
            type="text"
            format={toUpperCase}
          />
          <Btn

          />
        </form>
      </div>
    </div>
  );
};

export default reduxForm<FormProps, DispatchProps>({
  form: 'workOrderSearchForm'
})(Home);
