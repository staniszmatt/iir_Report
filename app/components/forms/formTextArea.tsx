/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import styles from './formInput.css';

interface Props {
  defaultValue: string;
  disabled: boolean;
  input: {
    name: string;
    value: string;
  };
  rows: number;
  label: string;
}

interface ValueState {
  inputValue: string;
}

export default function FormTextArea(props: Props) {
  const { defaultValue, disabled, input, rows, label } = props;

  const [valueState, setValueState] = useState<ValueState>({
    inputValue: defaultValue
  });

  const valueChange = (event: { currentTarget: { value: string } }) => {
    const changeCharString = event.currentTarget.value
      .replace(/[`]/g, '"')
      .replace(/[']/g, '"')
      .replace(/["]/g, '"');

    setValueState({
      ...valueState,
      inputValue: changeCharString
    });
  };

  return (
    <div className={styles['textarea-container']}>
      <div>
        <label htmlFor={props.input.name}>{label}</label>
      </div>
      <div>
        <textarea
          {...input}
          value={valueState.inputValue}
          onChange={valueChange}
          disabled={disabled}
          id={props.input.name}
          aria-multiline
          rows={rows}
        />
      </div>
    </div>
  );
}
