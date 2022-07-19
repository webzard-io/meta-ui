import { ComponentSchema } from '@sunmao-ui/core';
import { RegistryInterface } from '@sunmao-ui/runtime';
import WidgetManager from '../models/WidgetManager';
import type { Operations } from '../types/operation';

export interface EditorServices {
  registry: RegistryInterface;
  editorStore: {
    components: ComponentSchema[];
  };
  appModelManager: {
    appModel: any;
  };
  stateManager: {
    store: Record<string, any>;
    maskedEval: Function;
  };
  widgetManager: WidgetManager;
  doOperations: (operations: Operations) => void;
}
