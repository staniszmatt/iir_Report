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
  const [valueState, setValueState] = useState<ValueState>({
    inputValue: defaultValue
  });

  const valueChange = (event: { currentTarget: { value: string } }) => {
    console.log('value change input form', event);

    const changeCharString = event.currentTarget.value.toUpperCase();
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
      <p className="red-text darken-2">{touched && error}</p>
    </div>
  );
}
