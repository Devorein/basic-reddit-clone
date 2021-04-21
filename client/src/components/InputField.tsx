import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { name: string, label: string; placeholder: string, textarea?: boolean };

const InputField: React.FC<InputFieldProps> = ({ label, textarea, size: _, ...props }: InputFieldProps) => {
  const [field, { error }] = useField(props);
  let InputComponent: any = Input;
  if (textarea)
    InputComponent = Textarea;
  return <FormControl isInvalid={!!error}>
    <FormLabel htmlFor={field.name}>{label}</FormLabel>
    <InputComponent {...field} {...props} id={field.name} placeholder={props.placeholder} />
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>;
}

export default InputField