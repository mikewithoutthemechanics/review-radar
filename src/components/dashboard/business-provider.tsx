"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { getBusinessForUser } from "@/lib/db";
import type { Business } from "@/types";

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  reload: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({
  business: null,
  loading: true,
  reload: async () => {},
});

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadBusiness() {
    if (!user) {
      setBusiness(null);
      setLoading(false);
      return;
    }
    try {
      const biz = await getBusinessForUser(user.id);
      setBusiness(biz);
    } catch {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <BusinessContext.Provider value={{ business, loading, reload: loadBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
