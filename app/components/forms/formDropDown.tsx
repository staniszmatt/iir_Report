/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styles from './formInput.css';

interface Props {
  checkedValue: boolean;
  defaultValue: string;
  disabled: boolean;
  input: string;
  data: {} | any;
  label: string;
  type: string;
  name: string;
  meta: {
    error: {};
    touched: {};
  };
}

export default function FormDropDown(props: Props) {
  const {
    checkedValue,
    defaultValue,
    input,
    data,
    name,
    label,
    type = 'text',
    meta: { error, touched }
  } = props;

  const renderOptions = (option: string) => {
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  };

  const test = (e) => {
    console.log('test', e);
  }

  return (
    <div className={styles['form-container']}>
      <label htmlFor={name}>{label}</label>
      <select
        type={type || 'select'}
        checked={checkedValue}
        defaultValue={defaultValue}
        onBlur={test}
        id={name}
        {...input}
      >
        <option key="blankOption">{defaultValue}</option>
        {data.map(renderOptions)}
      </select>
      <p className="red-text darken-2">{touched && error}</p>
    </div>
  );
}
