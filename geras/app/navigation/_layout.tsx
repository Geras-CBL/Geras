import { Tabs } from "expo-router";
import { VolunteerTabBar } from "./VolunteerTabBar";

const seniorBottomBarLayout = () => {
  return (
    <Tabs tabBar={(props) => <VolunteerTabBar {...props} />}>
      <Tabs.Screen
        name="HomePage"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "Vouchers History",
        }}
      />
      <Tabs.Screen
        name="Vouchers"
        options={{
          title: "Vouchers",
        }}
      />
    </Tabs>
  );
};
export default seniorBottomBarLayout;
