import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { HStack as BaseHStack } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import {
  DirectionSchema,
  FlexWrapSchema,
  AlignItemsSchema,
  JustifyContentSchema,
  SpacingSchema,
} from './Stack';

const PropsSchema = Type.Object({
  direction: DirectionSchema,
  wrap: FlexWrapSchema,
  align: AlignItemsSchema,
  justify: JustifyContentSchema,
  spacing: SpacingSchema,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'hstack',
    description: 'chakra-ui hstack',
    displayName: 'HStack',
    exampleProperties: {
      spacing: '24px',
    },
    exampleSize: [6, 6],
    isDraggable: true,
    isResizable: true,
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    slots: ['content', 'body', 'header'],
    styleSlots: ['content'],
    methods: {},
    events: [],
  },
})(({ direction, wrap, align, justify, spacing, slotsElements, customStyle, $ref }) => {
  return (
    <BaseHStack
      height="full"
      width="full"
      padding="4"
      background="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="4"
      className={css`
        ${customStyle?.content}
      `}
      ref={$ref}
      {...{ direction, wrap, align, justify, spacing }}
    >
      {slotsElements.content}
    </BaseHStack>
  );
});
