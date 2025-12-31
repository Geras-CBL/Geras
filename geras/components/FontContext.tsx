import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type FontContextType = {
  scale: number;
  setScale: (scale: number) => void;
};

const FontContext = createContext<FontContextType>({
  scale: 1,
  setScale: () => {},
});

export const useFontScale = () => useContext(FontContext);

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [scale, setScale] = useState(1.0);

  const value = useMemo(() => ({ scale, setScale }), [scale, setScale]);

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};
