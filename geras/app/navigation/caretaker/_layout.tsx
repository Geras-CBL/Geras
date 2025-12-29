import TabBar from '@/components/shared/TabBar';
import { Tabs } from 'expo-router';

const CaretakerBottomBarLayout = () => {
  return (
    <Tabs
      initialRouteName="HomePage"
      tabBar={(props) => (
        <TabBar
          visibleTabNames={[
            'SeniorManagement',
            'Requests',
            'HomePage',
            'Sensors',
            'Profile',
          ]}
          sidePadding={46}
          {...props}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="SeniorManagement" options={{ title: 'Management' }} />
      <Tabs.Screen name="Requests" options={{ title: 'Requests' }} />
      <Tabs.Screen name="HomePage" options={{ title: 'Home' }} />
      <Tabs.Screen name="Sensors" options={{ title: 'Sensors' }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
};

export default CaretakerBottomBarLayout;
