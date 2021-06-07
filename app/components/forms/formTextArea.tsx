/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, CSSProperties, useEffect, useRef } from 'react';
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
    label,
    meta: { error, touched }
  } = textareaProps;

  const { name } = input;

  const [valueState, setValueState] = useState<ValueState>({
    inputValue: defaultValue
  });

  // Setup for auto height for textarea box
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
  const [parentHeight, setParentHeight] = useState('auto');

  const parentStyle: CSSProperties = {
    minHeight: parentHeight
  };

  const textAreaStyle: CSSProperties = {
    height: textAreaHeight
  };
  // onChange handler
  const valueChange = (event: {
    currentTarget: { value: string };
    target: { value: string };
  }) => {
    // Limiting input text
    const changeCharString = event.currentTarget.value
      .replace(/  +/g, ' ')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');

    setValueState({
      ...valueState,
      inputValue: changeCharString
    });
    // textarea auto height setup
    setTextAreaHeight('auto');
    setParentHeight(
      `${textAreaRef.current && textAreaRef.current.scrollHeight}px`
    );
    setText(event.target.value);
  };

  useEffect(() => {
    setParentHeight(
      `${textAreaRef.current && textAreaRef.current.scrollHeight}px`
    );
    setTextAreaHeight(
      `${textAreaRef.current && textAreaRef.current.scrollHeight}px`
    );
  }, [text]);

  return (
    <div className={styles['textarea-container']}>
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      <div style={parentStyle}>
        <textarea
          {...input}
          ref={textAreaRef}
          style={textAreaStyle}
          value={valueState.inputValue}
          onChange={valueChange}
          disabled={disabled}
          id={name}
          aria-multiline
          rows={1}
        />
      </div>
      {error && touched && <p className="red-text darken-2">{error}</p>}
    </div>
  );
}
