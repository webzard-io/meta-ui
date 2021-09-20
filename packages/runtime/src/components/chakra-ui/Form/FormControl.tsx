import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { watch } from '@vue-reactivity/watch';
import { ComponentImplementation } from 'src/registry';
import { stateStore } from 'src/store';
import { CheckboxStateSchema } from '@components/chakra-ui/Checkbox';
import Slot from '@components/_internal/Slot';
import {
  FormControlContentCSS,
  FormControlCSS,
  FormItemCSS,
  FormLabelCSS,
} from './FormCSS';

const FormControlImpl: ComponentImplementation<{
  label: string;
  fieldName: string;
  isRequired: boolean;
  helperText: string;
}> = ({ label, fieldName, isRequired, helperText, slotsMap, mergeState }) => {
  const [inputValue, setInputValue] = useState('');
  // don't show Invalid state on component mount
  const [hideInvalid, setHideInvalid] = useState(true);
  const inputId = useMemo(
    () => _.first(slotsMap?.get('content'))?.id || '',
    []
  );
  const [validResult, setValidResult] = useState({
    isInvalid: false,
    errorMsg: '',
  });
  const { isInvalid, errorMsg } = validResult;

  useEffect(() => {
    const stop = watch(
      () => {
        if (stateStore[inputId].checked !== undefined) {
          // special treatment for checkbox
          return (stateStore[inputId] as Static<typeof CheckboxStateSchema>)
            .checked;
        } else {
          return stateStore[inputId].value;
        }
      },
      newV => {
        setInputValue(newV);
      }
    );
    setInputValue(stateStore[inputId].value);
    return stop;
  }, [slotsMap, setInputValue]);

  useEffect(() => {
    const stop = watch(
      () => {
        return stateStore[inputId].validResult;
      },
      newV => {
        setValidResult(newV);
      }
    );
    if (stateStore[inputId].validResult) {
      setValidResult(stateStore[inputId].validResult);
    }
    return stop;
  }, [slotsMap, setValidResult]);

  useEffect(() => {
    if (inputValue) {
      // After inputValue first change, begin to show Invalid state
      setHideInvalid(false);
    }
    mergeState({
      inputId: inputId,
      fieldName,
      isInvalid: !!(isInvalid || (!inputValue && isRequired)),
      value: inputValue,
    });
  }, [slotsMap, inputId, fieldName, isInvalid, isRequired, inputValue]);

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!hideInvalid && (isInvalid || (!inputValue && isRequired))}
      css={FormControlCSS}>
      <div css={FormControlContentCSS}>
        <FormLabel css={FormLabelCSS}>{label}</FormLabel>
        <Slot css={FormItemCSS} slotsMap={slotsMap} slot="content" />
      </div>
      {errorMsg ? (
        <FormErrorMessage css={FormItemCSS}>{errorMsg}</FormErrorMessage>
      ) : undefined}
      {helperText ? (
        <FormHelperText css={FormItemCSS}>{helperText}</FormHelperText>
      ) : undefined}
    </FormControl>
  );
};

const PropsSchema = Type.Object({
  label: Type.String(),
  fieldName: Type.String(),
  isRequired: Type.Boolean(),
  helperText: Type.String(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'formControl',
      description: 'chakra-ui formControl',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: Type.Object({
        inputId: Type.String(),
        fieldName: Type.String(),
        isInvalid: Type.Boolean(),
        value: Type.Any(),
      }),
      methods: [],
    },
  }),
  impl: FormControlImpl,
};
