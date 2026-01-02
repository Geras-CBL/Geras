import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function RequestCardBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const { width: w, height: h } = dimensions;

  const strokeWidth = 3;

  const p = strokeWidth / 2;

  const cornerRadius = 60;
  const dipWidth = 200;
  const dipDepth = 50;

  if (w === 0 || h === 0) {
    return <View className="absolute inset-0" onLayout={onLayout} />;
  }
  const path = `
    M ${p} ${cornerRadius + p}
    Q ${p} ${p} ${cornerRadius + p} ${p}
    L ${w / 2 - dipWidth / 2} ${p}
    C ${w / 2 - dipWidth / 4} ${p} ${w / 2 - dipWidth / 4} ${dipDepth + p} ${w / 2} ${dipDepth + p}
    C ${w / 2 + dipWidth / 4} ${dipDepth + p} ${w / 2 + dipWidth / 4} ${p} ${w / 2 + dipWidth / 2} ${p}
    L ${w - cornerRadius - p} ${p}
    Q ${w - p} ${p} ${w - p} ${cornerRadius + p}
    L ${w - p} ${h - cornerRadius - p}
    Q ${w - p} ${h - p} ${w - cornerRadius - p} ${h - p}
    L ${cornerRadius + p} ${h - p}
    Q ${p} ${h - p} ${p} ${h - cornerRadius - p}
    Z
  `;

  return (
    <View className="absolute inset-0" onLayout={onLayout}>
      <Svg width={w} height={h}>
        <Path
          d={path}
          fill="white"
          stroke="#1B4D29"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
