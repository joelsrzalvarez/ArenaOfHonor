import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext({
  showLayout: true,
  setShowLayout: () => {}
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [showLayout, setShowLayout] = useState(true);

  return (
    <LayoutContext.Provider value={{ showLayout, setShowLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
