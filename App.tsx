import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';

import Home from './pages/Home';
import Module from './pages/Module';
import Module1Tale from './pages/Module1Tale'
import Module2Camera from './pages/Module2Camera'
import Module3Novel from './pages/Module3Novel'
import WellDone from './pages/WellDone'


LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Module" component={Module} options={{ headerShown: false }} />
      <Stack.Screen name="Module1Tale" component={Module1Tale} options={{ headerShown: false }} />
      <Stack.Screen name="Module2Camera" component={Module2Camera} options={{ headerShown: false }} />
      <Stack.Screen name="Module3Novel" component={Module3Novel} options={{ headerShown: false }} />
      <Stack.Screen name="WellDone" component={WellDone} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const AppContent = () => {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <AppContent />
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default App;
