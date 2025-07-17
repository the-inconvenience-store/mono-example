/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { HomeScreen } from './src/screens/HomeScreen'
import { BlogPostScreen } from './src/screens/BlogPostScreen'
import { RootStackParamList } from './src/types'

const Stack = createNativeStackNavigator<RootStackParamList>()

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#1a1a1a',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'My Blog',
              headerLargeTitle: true
            }}
          />
          <Stack.Screen
            name="BlogPost"
            component={BlogPostScreen}
            options={{
              title: 'Blog Post',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
