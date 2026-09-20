import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserSession {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface SessionContextType {
  session: UserSession | null;
  setSession: (session: UserSession) => void;
  updateSession: (partial: Partial<UserSession>) => void;
  clearSession: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

export interface Order {
  id: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  shippingCost: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  trackingNumber?: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  address: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const updateSession = (partial: Partial<UserSession>) => {
    setSession(prev => prev ? { ...prev, ...partial } : null);
  };

  const clearSession = () => setSession(null);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <SessionContext.Provider value={{ session, setSession, updateSession, clearSession, orders, addOrder }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
