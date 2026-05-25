"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Customer {
  id: string;
  phone: string;
  name?: string;
}

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  showAuthModal: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  login: (phone: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer]       = useState<Customer | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [showAuthModal, setShowAuth]  = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("osa_customer");
      if (saved) setCustomer(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const openAuth  = useCallback(() => setShowAuth(true),  []);
  const closeAuth = useCallback(() => setShowAuth(false), []);

  const login = useCallback(async (phone: string, name?: string) => {
    // Upsert customer record in Supabase
    const { data, error } = await supabase
      .from("customers")
      .upsert({ phone, name: name ?? null }, { onConflict: "phone" })
      .select("id, phone, name")
      .single();

    if (error || !data) throw new Error(error?.message ?? "Login failed");

    const c: Customer = { id: data.id, phone: data.phone, name: data.name ?? undefined };
    setCustomer(c);
    localStorage.setItem("osa_customer", JSON.stringify(c));
    setShowAuth(false);
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem("osa_customer");
  }, []);

  return (
    <AuthContext.Provider value={{ customer, isLoading, showAuthModal, openAuth, closeAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
