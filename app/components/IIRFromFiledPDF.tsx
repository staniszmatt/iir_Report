/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import FormTextInput from './forms/formTextArea';
import styles from './IIRFormFields.css';

// Not using any validation or using any of the form props but need to pass typescript
// error when calling (IIRForm)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormProps {}

interface DispatchProps {
  onSubmit: any | (() => void);
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
  iirFormProps: DispatchProps & InjectedFormProps<FormProps, DispatchProps>
) => {
  const { handleSubmit, onSubmit } = iirFormProps;
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
  } = iirFormProps.props;
  const disableTextArea = true;
  let fixManual_RevisionString = 'N/A';
  let workPerformedDefault = 'N/A';

  const warningCheck = {
    background: 'none'
  };
  // TODO: Setup for if/else statement

  // if (workedPerformed === 'N/A' || workedPerformed === '') {
  //   workPerformedDefault =
  //     'WARNING - Verify work order has a 01 traveler and that a cert is associated to the work order!';
  //   warningCheck.background = 'yellow';
  // } else {
    // Removing white space for this specific item in the JobCost DB.
    fixManual_RevisionString = Manual_Revision.replace(/\s/g, '');
    const updatedWorkPerformed = `Manual:${Manual}  Document:${Manual_Document}-${Manual_Section}  Rev:${fixManual_RevisionString}  Dated:${Manual_Rev_Date_MMDDYY}`;
    workPerformedDefault = `${updatedWorkPerformed}\n${workedPerformedNote}`;
    warningCheck.background = 'none';
  // }

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
          disabled={disableTextArea}
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
          disabled={disableTextArea}
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
          disabled={disableTextArea}
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
          disabled={disableTextArea}
        />
      </div>
    </form>
  );
};

export default reduxForm<FormProps, DispatchProps>({
  form: 'iirFormDisabled'
})(IIRForm);
