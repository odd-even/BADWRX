"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartItemCount, cartSubtotalCents } from "@/lib/merch/shipping";
import type { MerchCartLine, MerchItem } from "@/lib/types";

const STORAGE_KEY = "badwrx-merch-cart";

interface AddToCartOptions {
  size: string;
  color?: string;
  quantity?: number;
}

interface MerchCartContextValue {
  items: MerchCartLine[];
  itemCount: number;
  subtotalCents: number;
  addItem: (product: MerchItem, options: AddToCartOptions) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
}

const MerchCartContext = createContext<MerchCartContextValue | null>(null);

function loadStoredCart(): MerchCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MerchCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildLine(product: MerchItem, options: AddToCartOptions): MerchCartLine {
  return {
    lineId: crypto.randomUUID(),
    slug: product.slug,
    title: product.title,
    size: options.size,
    color: options.color,
    quantity: options.quantity ?? 1,
    priceCents: product.priceCents,
    imageUrl: product.image.url,
  };
}

function mergeLine(existing: MerchCartLine[], next: MerchCartLine): MerchCartLine[] {
  const match = existing.find(
    (line) =>
      line.slug === next.slug &&
      line.size === next.size &&
      line.color === next.color,
  );

  if (!match) return [...existing, next];

  return existing.map((line) =>
    line.lineId === match.lineId
      ? { ...line, quantity: Math.min(10, line.quantity + next.quantity) }
      : line,
  );
}

export function MerchCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MerchCartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: MerchItem, options: AddToCartOptions) => {
    const line = buildLine(product, options);
    setItems((current) => mergeLine(current, line));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((line) => line.lineId !== lineId));
      return;
    }
    setItems((current) =>
      current.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.min(10, quantity) } : line,
      ),
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: cartItemCount(items),
      subtotalCents: cartSubtotalCents(items),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart],
  );

  return (
    <MerchCartContext.Provider value={value}>{children}</MerchCartContext.Provider>
  );
}

export function useMerchCart() {
  const context = useContext(MerchCartContext);
  if (!context) {
    throw new Error("useMerchCart must be used within MerchCartProvider");
  }
  return context;
}
