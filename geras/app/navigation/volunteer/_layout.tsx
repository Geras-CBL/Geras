import { Tabs } from "expo-router";
import { VolunteerTabBar } from "./VolunteerTabBar";

const VolunteerBottomBarLayout = () => {
  return (
    <Tabs
      initialRouteName="HomePage"
      tabBar={(props) => <VolunteerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="RequestsHistory" options={{ title: "Requests" }} />
      <Tabs.Screen name="HomePage" options={{ title: "Home" }} />
      <Tabs.Screen name="Vouchers" options={{ title: "Vouchers" }} />
    </Tabs>
  );
};

export default VolunteerBottomBarLayout;