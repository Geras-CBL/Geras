import { Tabs } from "expo-router";
import { VolunteerTabBar } from "./VolunteerTabBar";

const seniorBottomBarLayout = () => {
  return (
    <Tabs
      initialRouteName="HomePage"
      tabBar={(props) => <VolunteerTabBar {...props} />}
    >
      <Tabs.Screen
        name="History"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="HomePage"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Vouchers"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default seniorBottomBarLayout;
