import React, { createContext, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

// Create Context
const NonceContext = createContext();

// Provider Component
export const NonceProvider = ({ children }) => {
  // Generate nonce once
  const nonce = useMemo(() => `nonce-${uuidv4()}`, []);
  console.log("Generated Nonce:", nonce);

  return (
    <NonceContext.Provider value={nonce}>
      {children}
    </NonceContext.Provider>
  );
};

// Custom Hook to Use Nonce
export const useNonce = () => useContext(NonceContext);
