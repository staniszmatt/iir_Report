/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styles from './formInput.css';

interface Props {
  checkedValue: boolean;
  defaultValue: string;
  disabled: boolean;
  input: {
    name: string;
    value: string;
  };
  label: string;
  name: string;
  meta: {
    error: {};
    touched: {};
  };
}
interface ValueState {
  inputValue: string | number;
}

export default function FormField(props: Props) {
  const {
    checkedValue,
    defaultValue,
    disabled,
    input,
    name,
    label,
    meta: { error, touched }
  } = props;
  // IF a default value isn't passed, set initialState to empty string.
  // This helps resolve error where state change is through redux-form rather than
  // inside this component.
  let initialDefaultValue = defaultValue;
  if (!defaultValue) {
    initialDefaultValue = '';
  }
  const [valueState, setValueState] = useState<ValueState>({
    inputValue: initialDefaultValue
  });

  const valueChange = (event: { currentTarget: { value: string } }) => {
    const changeCharString = event.currentTarget.value
      .toUpperCase()
      .replace(/  +/g, '')
      .replace(/[^a-zA-Z-0-9-.-: ]/g, '');

    setValueState({
      ...valueState,
      inputValue: changeCharString
    });
  };

  return (
    <div className={styles['form-container']}>
      <label htmlFor={props.input.name}>{label}</label>
      <input
        {...input}
        onChange={valueChange}
        type="text"
        checked={checkedValue}
        value={valueState.inputValue}
        disabled={disabled}
        id={name}
      />
      {error && touched && <p className="red-text darken-2">{error}</p>}
    </div>
  );
}
