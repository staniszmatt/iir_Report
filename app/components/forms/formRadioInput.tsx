/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styles from './formInput.css';

interface Props {
  checkedValue: boolean;
  defaultValue: string;
  disabled: boolean;
  input: string;
  label: string;
  type: string;
  name: string;
  meta: {
    error: {};
    touched: {};
  };
}

export default function FormField(props: Props) {
  const {
    checkedValue,
    defaultValue,
    disabled,
    input,
    name,
    label,
    type = 'text'
  } = props;

  return (
    <div className={styles['radio-input']}>
      <label htmlFor={name}>{label}</label>
      <input
        {...input}
        type={type || 'text'}
        checked={checkedValue}
        defaultValue={defaultValue}
        disabled={disabled}
        id={name}
      />
    </div>
  );
}
