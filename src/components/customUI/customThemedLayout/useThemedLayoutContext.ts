import { useContext } from "react";

import { ThemedLayoutContext } from "./IthemeLayoutContext";
//import type { IThemedLayoutContext } from "../../contexts/themedLayoutContext/IThemedLayoutContext";

export interface IThemedLayoutContext {
  siderCollapsed: boolean;
  setSiderCollapsed: (visible: boolean) => void;
  mobileSiderOpen: boolean;
  setMobileSiderOpen: (visible: boolean) => void;
  onSiderCollapsed?: (collapsed: boolean) => void;
}

export type UseThemedLayoutContextType = IThemedLayoutContext;

export const useThemedLayoutContext = (): UseThemedLayoutContextType => {
  const {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  } = useContext(ThemedLayoutContext);

  return {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  };
};
