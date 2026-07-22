import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inkSoft,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        children={({ navigation, route }) => (
          <HomeScreen navigation={navigation} route={route as any} />
        )}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={styles.icon}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: () => <Text style={styles.icon}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="SettingTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: () => <Text style={styles.icon}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.paperDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.rule,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  icon: {
    fontSize: 22,
  },
});