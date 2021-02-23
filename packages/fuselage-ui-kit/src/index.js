import {
  Divider,
  Margins,
  InputBox,
  Box,
} from '@rocket.chat/fuselage';
import {
  uiKitMessage,
  uiKitModal,
  BLOCK_CONTEXT,
  UiKitParserMessage,
  ELEMENT_TYPES,
  UiKitParserModal,
  UiKitParserText,
} from '@rocket.chat/ui-kit';
import React from 'react';

import { Actions as ActionsLayoutBlock } from './Actions';
import { Block } from './Block';
import { MessageImage, ModalImage } from './Image';
import { Input as InputLayoutBlock, PlainInput } from './Input';
import { Overflow } from './Overflow';
import { Section as SectionLayoutBlock } from './Section';
import { StaticSelect, MultiStaticSelect } from './StaticSelect';
import { UIKitButton } from './UIKitButton';
import { useBlockContext } from './hooks';

export * from './hooks';

export const version = process.env.VERSION;

console.log(`fuselage-ui-kit version: ${ version }`);

function mrkdwn({ text/* , type = 'plain_text'*/ } = { text: '' }) {
  return text;
}

function plainText({ text /* , type = 'plain_text'*/ } = { text: '' }) {
  return text;
}

function text({ text /* , type = 'plain_text'*/ } = { text: '' }) {
  return text;
}

class TextParser extends UiKitParserText {
  mrkdwn(...args) { return mrkdwn(...args); }

  plainText(...args) { return plainText(...args); }

  text(...args) { return text(...args); }
}

class MessageParser extends UiKitParserMessage {
  mrkdwn(...args) { return mrkdwn(...args); }

  plainText(...args) { return plainText(...args); }

  text(...args) { return text(...args); }

  overflow(element, context) {
    return <Overflow context={context} {...element} parser={this}/>;
  }

  button(element, context, key) {
    return <UIKitButton element={element} context={context} key={key} parser={this}/>;
  }

  divider(_, __, key) {
    return <Divider mb='x24' key={key}/>;
  }

  section(args, context, index) {
    return (
      <SectionLayoutBlock key={index} {...args} parser={this} />
    );
  }

  actions(args, _, key) {
    return <ActionsLayoutBlock {...args} key={key} parser={this} />;
  }

  datePicker(element, context, key) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ loading, value, error }, action] = useBlockContext(element, context);
    const { actionId, placeholder } = element;
    return (
      <InputBox
        key={key}
        error={error}
        value={value}
        disabled={loading}
        id={actionId}
        name={actionId}
        rows={6}
        onInput={action}
        placeholder={this.plainText(placeholder)}
        type='date'
      />
    );
  }

  image(element, context, key) {
    return <MessageImage key={key} element={element} context={context}/>;
  }

  context({ elements }, context, key) {
    return (
      <Block key={key}>
        <Box display='flex' alignItems='center' m='neg-x4'>
          {elements.map((element, i) => (
            <Margins all='x4' key={i}>
              {[
                ELEMENT_TYPES.PLAIN_TEXT,
                ELEMENT_TYPES.MARKDOWN,
              ].includes(element.type) ? (
                  <Box is='span' fontScale='c1' color='info'>
                    {this.renderContext(element, BLOCK_CONTEXT.CONTEXT, this)}
                  </Box>
                )
                : this.renderContext(element, BLOCK_CONTEXT.CONTEXT, this)
              || element.type
              }
            </Margins>
          ))}
        </Box>
      </Block>
    );
  }

  multiStaticSelect(element, context, key) {
    return (
      <MultiStaticSelect
        {...element}
        key={key}
        parser={this}
        context={context}
      />
    );
  }

  staticSelect(element, context, key) {
    return <StaticSelect key={key} context={context} {...element} parser={this} />;
  }

  // selectInput(element, context, key) {
  //   const [{ loading, value }, action] = useBlockContext(element, context);
  //   return (
  //     <SelectInput key={key} value={value} onChange={action} mod-loading={loading} placeholder={element.type} disabled />
  //   );
  // }
}

class ModalParser extends UiKitParserModal {
  constructor() {
    super();
    Object.getOwnPropertyNames(MessageParser.prototype).forEach((method) => {
      ModalParser.prototype[method] = ModalParser.prototype[method] || MessageParser.prototype[method];
    });
  }

  input({ element, label, blockId, appId }, context, index) {
    return (
      <InputLayoutBlock
        key={index}
        index={index}
        parser={this}
        context={context}
        element={{ ...element, appId, blockId }}
        label={this.plainText(label)}
      />
    );
  }

  image(element, context, index) {
    return <ModalImage key={index} element={element} context={context}/>;
  }

  plainInput(element, context, index) {
    return <PlainInput parser={this} element={element} context={context} index={index}/>;
  }
}

export const textParser = new TextParser();
export const messageParser = new MessageParser();
export const modalParser = new ModalParser();

export const UiKitMessage = uiKitMessage(messageParser);
export const UiKitModal = uiKitModal(modalParser);

export const UiKitComponent = ({ render, blocks }) => render(blocks);
