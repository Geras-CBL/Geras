import TabBar from '@/components/shared/TabBar';
import { Tabs } from 'expo-router';

const VolunteerBottomBarLayout = () => {
  return (
    <Tabs
      initialRouteName="HomePage"
      tabBar={(props) => (
        <TabBar
          visibleTabNames={['RequestsHistory', 'HomePage', 'Vouchers']}
          sidePadding={96}
          {...props}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="RequestsHistory" options={{ title: 'Requests' }} />
      <Tabs.Screen name="HomePage" options={{ title: 'Home' }} />
      <Tabs.Screen name="Vouchers" options={{ title: 'Vouchers' }} />
    </Tabs>
  );
};

export default VolunteerBottomBarLayout;
