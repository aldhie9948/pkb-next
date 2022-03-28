import { useState } from 'react';

export const useField = (type, isRequired = true, isAutoCompleted = false) => {
  const [value, setValue] = useState(null);
  const required = isRequired && isRequired;
  const autoComplete = isAutoCompleted ? 'on' : 'off';
  const onChange = (event) => {
    console.log('input value has changed to', event.target.value);
    setValue(event.target.value);
  };
  const reset = () => setValue('');

  const attr = { value, type, onChange, required, autoComplete };

  return { reset, attr, value, setValue };
};
