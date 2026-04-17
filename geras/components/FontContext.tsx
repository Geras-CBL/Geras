import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { PixelRatio } from 'react-native';

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.15;

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
  const systemScale = PixelRatio.getFontScale();
  const clampedSystemScale = Math.min(
    Math.max(systemScale, MIN_SCALE),
    MAX_SCALE,
  );

  const [scale, setScale] = useState(clampedSystemScale);

  const value = useMemo(() => ({ scale, setScale }), [scale, setScale]);

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};
