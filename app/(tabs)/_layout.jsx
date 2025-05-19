import { Tabs } from 'expo-router'
import { AntDesign, Ionicons } from '@expo/vector-icons'

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "brown",
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons name='home-outline' size={24} color={focused ? "brown" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <AntDesign name="pluscircleo" size={24} color={focused ? "brown" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-circle-outline" size={26} color={focused ? "brown" : "gray"} />
          ),
        }}
      />
    </Tabs>
  )
}
