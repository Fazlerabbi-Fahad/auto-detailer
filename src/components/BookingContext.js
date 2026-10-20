"use client";

import { createContext, useCallback, useContext, useState } from "react";
import brand from "@/brand.config";
import { scrollToId } from "@/lib/motion";

const Ctx = createContext(null);

export function BookingProvider({ children }) {
  const [size, setSize] = useState(brand.vehicleSizes[0].id);
  // `pick` changes whenever someone presses "Book this", so the form can react to it.
  const [pick, setPick] = useState(null);

  const bookPackage = useCallback((pkgId, sizeId) => {
    setPick({ pkg: pkgId, size: sizeId, at: Date.now() });
    scrollToId("book");
  }, []);

  return <Ctx.Provider value={{ size, setSize, pick, bookPackage }}>{children}</Ctx.Provider>;
}

export function useBooking() {
  return useContext(Ctx);
}
