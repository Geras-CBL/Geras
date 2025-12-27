import { Tabs } from "expo-router";
import { CaretakerTabBar } from "./CaretakerTabBar";

const CaretakerBottomBarLayout = () => {
  return (
    <Tabs
      initialRouteName="HomePage"
      tabBar={(props) => <CaretakerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="SeniorManagement" options={{ title: "Management" }} />
      <Tabs.Screen name="Requests" options={{ title: "Requests" }} />
      <Tabs.Screen name="HomePage" options={{ title: "Home" }} />
      <Tabs.Screen name="Sensors" options={{ title: "Sensors" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default CaretakerBottomBarLayout;
