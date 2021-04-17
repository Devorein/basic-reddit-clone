import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string, label: string; placeholder: string };

const InputField: React.FC<InputFieldProps> = (props: InputFieldProps) => {
  const [field, { error }] = useField(props);

  return <FormControl isInvalid={!!error}>
    <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
    <Input {...field} id={field.name} placeholder={props.placeholder} />
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>;
}

export default InputField