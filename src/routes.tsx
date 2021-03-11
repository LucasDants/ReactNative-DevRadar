/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './pages/Main';
import Profile from './pages/Profile';

const Stack = createStackNavigator();

function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerTintColor: '#FFF',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#7D40e7',
        },
      }}>
      <Stack.Screen
        name="Main"
        options={{title: 'DevRadar'}}
        component={Main}
      />
      <Stack.Screen
        name="Profile"
        options={{title: 'Perfil no Github'}}
        component={Profile}
      />
    </Stack.Navigator>
  );
}

export default Routes;
