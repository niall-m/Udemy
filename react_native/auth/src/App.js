import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './components/common';
import LoginForm from './components/LoginForm';

class App extends Component {
    state = { loggedIn: null }

    componentWillMount() {
        firebase.initializeApp({
            apiKey: 'AIzaSyBHRL7EXWy6Mg4MCAkgEQqixo3x8qS2-rg',
            authDomain: 'authentication-78eed.firebaseapp.com',
            databaseURL: 'https://authentication-78eed.firebaseio.com',
            projectId: 'authentication-78eed',
            storageBucket: 'authentication-78eed.appspot.com',
            messagingSenderId: '157127907897'
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ loggedIn: true });
            } else { 
                this.setState({ loggedIn: false });
            }
        });
    }

    renderContent() {
        switch (this.state.loggedIn) {
            case true:
                return (
                    <View style={styles.logOutButtonStyle}>
                        <Button onPress={() => firebase.auth().signOut()}>
                            Log Out
                        </Button>
                    </View>
                );
            case false:
                return <LoginForm />;
            default:
                return <Spinner />;
        }
    }

    render() {
        return (
            <View>
                <Header headerText="Authentication" />
                {this.renderContent()}
            </View>
        );
    }
}

const styles = {
    logOutButtonStyle: {
        padding: 5,
        flexDirection: 'row'
    }
};

export default App;