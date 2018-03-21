import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { Header } from './components/common';
import LoginForm from './components/LoginForm';

class App extends Component {
    componentWillMount() {
        firebase.initializeApp({
            apiKey: 'AIzaSyBHRL7EXWy6Mg4MCAkgEQqixo3x8qS2-rg',
            authDomain: 'authentication-78eed.firebaseapp.com',
            databaseURL: 'https://authentication-78eed.firebaseio.com',
            projectId: 'authentication-78eed',
            storageBucket: 'authentication-78eed.appspot.com',
            messagingSenderId: '157127907897'
        });
    }

    render() {
        return (
            <View>
                <Header headerText="Authentication" />
                <LoginForm />
            </View>
        );
    }
}

export default App;