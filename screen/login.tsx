import * as React from 'react';
import { Text, View, TextInput, Switch, Button, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import bind from 'bind-decorator';
import { login } from '../lib/cc-api';
import { multiGet, multiSet, multiRemove } from '../lib/secure-store';
import { NavigationScreenProps } from 'react-navigation';

export class LoginScreen extends React.Component<NavigationScreenProps> {
    state = {
        email: '',
        password: '',
        isLoading: false,
        emailError: false,
        passwordError: false,
        rememberCredentials: true,
        errorMessage: ''
    };
    static navigationOptions = {
        title: 'Login',
    };
    constructor(props: any) {
      super(props);
      this.bootstrap();
    }

    async bootstrap(){
        const [email, password] = await multiGet(['credentials.email', 'credentials.password']);

        // only set the field-values if the user hasn't entered one himself yet
        if(email && !this.state.email){
            this.setState({ email });
        }
        if(password && !this.state.password){
            this.setState({ password });
        }
    }

    render(){
        return (
            <View style={{ padding: 10 }}>
                <Text>
                    Login with your coaster-count.com credentials.
                </Text>
                <Text>
                    Don't worry, your device only sends data to the official server.
                </Text>

                {
                    this.state.isLoading ?
                    <ActivityIndicator size="large"/> :
                    <View>
                        <TextInput style={{ height: 40, backgroundColor: this.state.emailError ? 'red' : 'transparent' }} placeholder="Email" keyboardType="email-address" value={this.state.email} onChangeText={email => this.setState({email})} onSubmitEditing={this.submitLogin} autoCorrect={false} autoCapitalize='none'/>
                        <TextInput style={{ height: 40, backgroundColor: this.state.passwordError ? 'red' : 'transparent' }} placeholder="Password" secureTextEntry value={this.state.password} onChangeText={password => this.setState({password})} onSubmitEditing={this.submitLogin} autoCorrect={false} autoCapitalize='none'/>
                        <Switch value={this.state.rememberCredentials} onValueChange={rememberCredentials => this.setState({ rememberCredentials })}/>
                        <Text>Remember Login Credentials</Text>
                        {this.state.errorMessage ? <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text> : null}
                        <View style={{ marginBottom: 20 }}>
                            <Button title="Login" onPress={this.submitLogin}/>
                        </View>
                        <TouchableOpacity onPress={this.openRegistration}>
                            <Text style={{ color: 'blue' }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    @bind
    openRegistration(){
        Linking.openURL('https://coaster-count.com/account/register');
    }

    @bind
    async submitLogin(){
        this.setState({
            isLoading: true,
            emailError: false,
            passwordError: false,
            errorMessage: ''
        });

        try {
            const sessionId = await login(this.state.email, this.state.password);
            if(this.state.rememberCredentials){
                await multiSet([
                    ['credentials.email', this.state.email],
                    ['credentials.password', this.state.password],
                    ['credentials.autoLogin', '1']
                ]);
            } else {
                multiRemove(['credentials.email', 'credentials.password', 'credentials.autoLogin']);
            }
            this.props.navigation.navigate('App', { sessionId });
        } catch (ex) {
            if(ex.code === 'auth.email'){
                this.setState({
                    emailError: true,
                    errorMessage: 'Given email is not registered.'
                });
            } else if(ex.code === 'auth.password'){
                this.setState({
                    passwordError: true,
                    errorMessage: 'Given password is incorrect.'
                });
            } else {
                this.setState({ errorMessage: ex.message });
            }

            this.setState({ isLoading: false });
        }
    }
}
