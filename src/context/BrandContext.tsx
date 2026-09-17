import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandContextType {
  brandName: string;
  setBrandName: (name: string) => void;
  brandTagline: string;
  storeTagline: string;
  pincode: string;
  setPincode: (pin: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const BRAND_NAME_KEY = 'shivangi_brand_name';
const PINCODE_KEY = 'shivangi_user_pincode';

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brandName, setBrandNameState] = useState<string>(() => {
    try {
      return localStorage.getItem(BRAND_NAME_KEY) || 'Shivangi Mobile';
    } catch {
      return 'Shivangi Mobile';
    }
  });

  const [pincode, setPincodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(PINCODE_KEY) || '306902';
    } catch {
      return '306902';
    }
  });

  const setBrandName = (name: string) => {
    setBrandNameState(name);
    try {
      localStorage.setItem(BRAND_NAME_KEY, name);
    } catch {
      // Ignore
    }
  };

  const setPincode = (pin: string) => {
    setPincodeState(pin);
    try {
      localStorage.setItem(PINCODE_KEY, pin);
    } catch {
      // Ignore
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brandName,
        setBrandName,
        brandTagline: 'Wholesaler Dealer in all type Mobiles & Accessories · Sales & Service',
        storeTagline: 'MAIN BAZAR, SUMERPUR (RAJASTHAN)',
        pincode,
        setPincode,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within BrandProvider');
  return context;
};
