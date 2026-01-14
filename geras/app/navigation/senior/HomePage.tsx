import BigButton from '@/components/senior/BigButton';
import HelpButton from '@/components/senior/HelpButton';
import {
  ActionButton,
  NotificationCard,
} from '@/components/shared/Notification';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <>
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center gap-12 p-4 px-6 pt-24"
      >
        <SectionTitle title={'Notificações'}>
          <NotificationCard
            variant="info"
            title="Lucas Wiliam"
            imageSource={require('../../../assets/images/hottie.png')}
            description={<ThemedText>A 5 minutos de distância</ThemedText>}
            rightContent={
              <ActionButton
                icon="call"
                onPress={() => {
                  Linking.openURL(`tel:${963744454}`);
                }}
              />
            }
            route="../../navigation/senior/RequestDetails"
          />
          {/* no notification */}
          {/* <ThemedText type="body" className="text-neutralDark text-center py-10">
            Não há notificações novas
          </ThemedText> */}
        </SectionTitle>
        <View className="-m-4 flex-row flex-wrap">
          <View className="aspect-square w-1/2 p-4">
            <BigButton
              iconName={'health-and-safety'}
              label={'Saúde'}
              route={'../../navigation/senior/Health'}
            />
          </View>

          <View className="aspect-square w-1/2 p-4">
            <BigButton
              iconName={'people'}
              label={'Pedir ajuda'}
              route={'../../navigation/senior/RequestHelp'}
            />
          </View>

          <View className="aspect-square w-1/2 p-4">
            <BigButton
              iconName={'shopping-cart'}
              label={'Mercearias'}
              route={'../../navigation/senior/Groceries'}
            />
          </View>

          <View className="aspect-square w-1/2 p-4">
            <BigButton
              iconName={'phone'}
              label={'Ligar a Sofia'}
              onPress={() => {
                Linking.openURL(`tel:${963744454}`);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      <View className="absolute bottom-4 left-0 right-0 z-50 items-center">
        <HelpButton />
      </View>
    </>
  );
}
