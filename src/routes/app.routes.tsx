import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppointmentCreate from '../pages/AppointmentCreate';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import CreateAppointment from '../pages/CreateAppointment';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreate} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
