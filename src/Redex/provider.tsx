"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { loadFromStorage } from "@/Redex/features/authSlice";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
