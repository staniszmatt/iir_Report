/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styles from './formInput.css';

interface TextareaProps {
  defaultValue: string;
  disabled: boolean;
  input: {
    name: string;
    value: string;
  };
  rows: number;
  label: string;
  meta: {
    error: {};
    touched: {};
  };
}

interface ValueState {
  inputValue: string;
}

export default function FormTextArea(textareaProps: TextareaProps) {
  const {
    defaultValue,
    disabled,
    input,
    rows,
    label,
    meta: { error, touched }
  } = textareaProps;

  const [valueState, setValueState] = useState<ValueState>({
    inputValue: defaultValue
  });

  const valueChange = (event: { currentTarget: { value: string } }) => {
    const changeCharString = event.currentTarget.value
      .replace(/  +/g, ' ')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');

    setValueState({
      ...valueState,
      inputValue: changeCharString
    });
  };

  return (
    <div className={styles['textarea-container']}>
      <div>
        <label htmlFor={textareaProps.input.name}>{label}</label>
      </div>
      <div>
        <textarea
          {...input}
          value={valueState.inputValue}
          onChange={valueChange}
          disabled={disabled}
          id={textareaProps.input.name}
          aria-multiline
          rows={rows}
        />
      </div>
      {error && touched && <p className="red-text darken-2">{error}</p>}
    </div>
  );
}
