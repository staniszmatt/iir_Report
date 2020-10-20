/* eslint-disable @typescript-eslint/camelcase */
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
    Manual: string;
    Manual_Document: string;
    Manual_Section: string;
    Manual_Revision: string;
    Manual_Rev_Date_MMDDYY: string;
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
    workedPerformed,
    Manual,
    Manual_Document,
    Manual_Section,
    Manual_Revision,
    Manual_Rev_Date_MMDDYY
  } = props.props;

  let fixManual_RevisionString = 'N/A';
  let workPerformedString = 'N/A';

  console.log('Tear Down Props: ', props);

  const warningCheck = {
    background: 'none'
  };
  // TODO: Setup for if/else statement
  let workPerformedDefault = `${workedPerformed}\n${workedPerformedNote}`;

  if (workedPerformed === 'N/A' || workedPerformed === '') {
    workPerformedDefault = 'WARNING - NO WORK HAS BEEN SETUP YET!';
    warningCheck.background = 'yellow';
  } else {
    // Removing white space for this specific item in the JobCost DB.
    const fixManual_RevisionString = Manual_Revision.replace(/\s\s+/g, '');
    warningCheck.background = 'none';
  }

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
          disabled={true}
        />
      </div>
      <div>
        <Field
          label="GENERAL CONDITION AS RECEIVED:"
          component={FormTextInput}
          name="genConditionReceived"
          type="textarea"
          aria-multiline
          defaultValue={genConditionReceived}
          rows="10"
          disabled={true}
        />
      </div>
      <div>
        <Field
          label="EVALUATION FINDINGS (HIDDEN DAMAGE):"
          component={FormTextInput}
          name="evalFindings"
          type="textarea"
          aria-multiline
          defaultValue={evalFindings}
          rows="10"
          disabled={true}
        />
      </div>
      <div style={warningCheck}>
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
