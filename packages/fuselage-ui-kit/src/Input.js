import {
  Field,
  TextAreaInput,
  TextInput,
} from '@rocket.chat/fuselage';
import {
  BLOCK_CONTEXT,
} from '@rocket.chat/ui-kit';
import React from 'react';

import { Block } from './Block';
import { useBlockContext } from './hooks';

export const Input = React.memo(({ label, element, parser, index, hint, context }) => {
  const [{ error }] = useBlockContext(element, context);
  return (
    <Block>
      <Field>
        {label && <Field.Label>{label}</Field.Label>}
        <Field.Row>
          {parser.renderInputs(element, BLOCK_CONTEXT.FORM, parser, index)}
        </Field.Row>
        {error && <Field.Error>{error}</Field.Error>}
        {hint && <Field.Hint>{hint}</Field.Hint>}
      </Field>
    </Block>
  );
});

export const PlainInput = React.memo(({ element, context, index, parser }) => {
  const [{ loading, value, error }, action] = useBlockContext(element, context);
  const { multiline, actionId, placeholder } = element;
  const Component = multiline ? TextAreaInput : TextInput;
  return (
    <Component
      key={index}
      disabled={loading}
      id={actionId}
      name={actionId}
      rows={6}
      error={error}
      value={value}
      // onInput={action}
      onChange={action}
      placeholder={parser.plainText(placeholder)}
    />
  );
});
