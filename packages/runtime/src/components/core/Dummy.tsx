import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'dummy',
    displayName: 'Dummy',
    description: 'Dummy Invisible component',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
})(() => {
  return null;
});
