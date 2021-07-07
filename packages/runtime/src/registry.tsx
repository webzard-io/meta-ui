import React from "react";
import { RuntimeComponent } from "@meta-ui/core";
import { setStore } from "./store";
// components
import PlainButton from "./components/plain/Button";
import CoreText from "./components/core/Text";

type ImplementedRuntimeComponent = RuntimeComponent & {
  impl: Implementation;
};

export type Implementation<T = any> = React.FC<
  T & {
    mergeState: (partialState: Parameters<typeof setStore>[0]) => void;
    subscribeMethods: <U>(
      map: {
        [K in keyof U]: (parameters: U[K]) => void;
      }
    ) => void;
  }
>;

class Registry {
  components: Map<string, Map<string, ImplementedRuntimeComponent>> = new Map();

  registerComponent(c: ImplementedRuntimeComponent) {
    if (this.components.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has component ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.components.has(c.version)) {
      this.components.set(c.version, new Map());
    }
    this.components.get(c.version)!.set(c.metadata.name, c);
  }

  getComponent(version: string, name: string): ImplementedRuntimeComponent {
    const irc = this.components.get(version)?.get(name);
    if (!irc) {
      throw new Error(`Component ${version}/${name} has not registered yet.`);
    }
    return irc;
  }
}

export const registry = new Registry();

registry.registerComponent(PlainButton);
registry.registerComponent(CoreText);
