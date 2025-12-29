import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const COLORS = {
  background: "#FFFFFF",
  inactive: "#1E5128",
  activeIcon: "#FFFFFF",
};

const BAR_HEIGHT = 64;
const CIRCLE_SIZE = 64;
const CORNER_RADIUS = 36;
const CURVE_WIDTH = 88;
const CURVE_DEPTH = 34;

interface CustomTabBarProps extends BottomTabBarProps {
  visibleTabNames: string[];
  sidePadding?: number;
}
export default function TabBar({
  state,
  navigation,
  visibleTabNames,
  sidePadding = 12,
}: Readonly<CustomTabBarProps>) {
  const [width, setWidth] = useState(0);

  // Filter the raw state.routes to only include our 3 visible tabs
  const visibleRoutes = state.routes.filter((route) =>
    visibleTabNames.includes(route.name)
  );

  // If the user is on a hidden page (like "MapRequests"), this will be -1
  const currentRoute = state.routes[state.index];
  const activeIndex = visibleRoutes.findIndex(
    (r) => r.name === currentRoute.name
  );

  // Calculate width based on visible items (3) instead of all items (7+)
  const tabWidth = width > 0 ? width / visibleRoutes.length : 0;
  const translateX = useSharedValue(0);

  // New: Control visibility of the bubble (hide it if we are on a hidden page)
  const isBubbleVisible = activeIndex !== -1;

  useEffect(() => {
    if (width > 0 && activeIndex !== -1) {
      translateX.value = withSpring(activeIndex * tabWidth, {
        stiffness: 300,
        damping: 30,
        mass: 1,
      });
    }
  }, [activeIndex, width, tabWidth, translateX]);

  const animatedPathProps = useAnimatedProps(() => {
    const currentPos = width > 0 ? translateX.value : 0;
    const center = currentPos + tabWidth / 2;

    const idealStart = center - CURVE_WIDTH / 2;
    const idealEnd = center + CURVE_WIDTH / 2;

    const drawStart = Math.max(CORNER_RADIUS, idealStart);
    const drawEnd = Math.min(width - CORNER_RADIUS, idealEnd);

    const c1 = drawStart + 15;
    const c2 = center - 30;
    const c3 = center + 30;
    const c4 = drawEnd - 15;

    if (width === 0) return { d: "M0,0" };

    const d = `
      M${CORNER_RADIUS},0
      L${drawStart},0
      C${c1},0 ${c2},${CURVE_DEPTH} ${center},${CURVE_DEPTH}
      C${c3},${CURVE_DEPTH} ${c4},0 ${drawEnd},0
      L${width - CORNER_RADIUS},0
      Q${width},0 ${width},${CORNER_RADIUS}
      L${width},${BAR_HEIGHT - CORNER_RADIUS}
      Q${width},${BAR_HEIGHT} ${width - CORNER_RADIUS},${BAR_HEIGHT}
      L${CORNER_RADIUS},${BAR_HEIGHT}
      Q0,${BAR_HEIGHT} 0,${BAR_HEIGHT - CORNER_RADIUS}
      L0,${CORNER_RADIUS}
      Q0,0 ${CORNER_RADIUS},0
      Z
    `;
    return { d };
  });

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: withTiming(isBubbleVisible ? 1 : 0),
    };
  });

  return (
    <View
      style={{ left: sidePadding, right: sidePadding }}
      className="absolute bottom-10 bg-transparent shadow-lg shadow-black/10"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View className="absolute top-0 bottom-0 left-0 right-0">
        {width > 0 && (
          <Svg width={width} height={BAR_HEIGHT}>
            <AnimatedPath
              animatedProps={animatedPathProps}
              fill={COLORS.background}
            />
          </Svg>
        )}
      </View>

      {width > 0 && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -24,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              backgroundColor: "#1E5128",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              left: tabWidth / 2 - CIRCLE_SIZE / 2,
            },
            circleStyle,
          ]}
        >
          {isBubbleVisible && (
            <IconRenderer
              routeName={visibleRoutes[activeIndex].name}
              color={COLORS.activeIcon}
              size={32}
            />
          )}
        </Animated.View>
      )}

      <View className="flex-row" style={{ height: BAR_HEIGHT }}>
        {visibleRoutes.map((route, index) => {
          const isFocused = activeIndex === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className="flex-1 justify-center items-center"
              activeOpacity={1}
            >
              {!isFocused && (
                <IconRenderer
                  routeName={route.name}
                  color={COLORS.inactive}
                  size={30}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function IconRenderer({
  routeName,
  color,
  size,
}: Readonly<{
  routeName: string;
  color: string;
  size: number;
}>) {
  let iconName: keyof typeof MaterialIcons.glyphMap;

  switch (routeName) {
    case "SeniorManagement":
      iconName = "elderly";
      break;
    case "Requests":
      iconName = "confirmation-number";
      break;
    case "HomePage":
      iconName = "home";
      break;
    case "Sensors":
      iconName = "sensors";
      break;
    case "Profile":
      iconName = "person";
      break;
    case "RequestsHistory":
      iconName = "alarm-on";
      break;
    case "Vouchers":
      iconName = "confirmation-number";
      break;
    default:
      iconName = "circle";
  }

  return <MaterialIcons name={iconName} size={size} color={color} />;
}
