import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { login } from '../lib/cc-api';
import { multiGet } from '../lib/secure-store';
import { NavigationScreenProps } from 'react-navigation';

export class LoginLoadingScreen extends React.Component<NavigationScreenProps> {
    constructor(props: any) {
      super(props);
      this.bootstrap();
    }

    async bootstrap(){
        const [email, password, autoLogin] = await multiGet(['credentials.email', 'credentials.password', 'credentials.autoLogin']);

        // if autoLogin or credentials are not set,
        // we do not login with saved credentials
        if(!autoLogin || !email || !password){
            this.props.navigation.navigate('Login');
            return;
        }

        // try to retrieve sessionid with given credentials
        try {
            const sessionId = await login(email, password);
            this.props.navigation.navigate('Catalog', { sessionId });
        } catch (e) {
            this.props.navigation.navigate('Login');
        }
    }

    render(){
        return (
            <View style={{ padding: 10 }}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }
}
