// import a library to help create a component
import React from 'react';
import { Text, AppRegistry } from 'react-native';

// create a component
const App = () => (
    <Text>Some Text</Text>
);

// render component to devise
AppRegistry.registerComponent('albums', () => App);