import * as React from 'react';
import { View, Text, AsyncStorage, Button } from 'react-native';
import { bind } from 'bind-decorator';
import { NavigationScreenProps } from 'react-navigation';

export class CatalogScreen extends React.Component<NavigationScreenProps> {
    render(){
        const sessionId = this.props.navigation.getParam('sessionId');

        return (
            <View style={{ padding: 10 }}>
                <Text>Hello, world!</Text>
                <Text>SessionID: {sessionId}</Text>
                <Button title="Logout" onPress={this.logout}/>
            </View>
        );
    }

    @bind
    async logout(){
        await AsyncStorage.removeItem('credentials.autoLogin');
        this.props.navigation.navigate('LoginLoading');
        // TODO send logout request
    }
}
