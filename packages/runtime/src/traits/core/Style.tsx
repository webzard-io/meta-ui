import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

export const StyleTraitPropertiesSpec = Type.Object({
  styles: Type.Array(
    Type.Object({
      styleSlot: Type.String(),
      style: Type.String(),
      cssProperties: Type.Optional(Type.Record(Type.String(), Type.String())),
    })
  ),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Style,
    description: 'add style to component',
  },
  spec: {
    properties: StyleTraitPropertiesSpec,
    methods: [],
    state: {},
  },
})(() => {
  return ({ styles }) => {
    const customStyle = styles.reduce((result, { style, styleSlot, cssProperties }) => {
      if (!result[styleSlot]) {
        result[styleSlot] = '';
      }
      const cssPropertiesStr = convertCssObjToText(cssProperties || {});
      // add a ';' between css texts, in case user forgets to add ';' in the end
      result[styleSlot] = `.App &&& {${result[styleSlot]};${style};${cssPropertiesStr}}`;
      return result;
    }, {} as Record<string, string>);
    return {
      props: {
        customStyle,
      },
    };
  };
});

const regex = /[A-Z]/g;
const kebabCase = (str: string) => str.replace(regex, v => `-${v.toLowerCase()}`);

function convertCssObjToText(style: Record<string, string>): string {
  const finalResult = Object.keys(style).reduce((accumulator, key) => {
    // transform the key from camelCase to kebab-case
    const cssKey = kebabCase(key);
    // remove ' in value
    let cssValue = style[key];
    if (typeof style[key] === 'string') {
      cssValue = style[key].replace("'", '');
    }
    // build the result
    // you can break the line, add indent for it if you need
    return `${accumulator}${cssKey}:${cssValue};`;
  }, '');

  return finalResult;
}
