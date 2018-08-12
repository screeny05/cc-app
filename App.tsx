import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { LoginScreen } from './screen/login';
import { LoginLoadingScreen } from './screen/login-loading';
import { CatalogScreen } from './screen/catalog';
import { SettingsScreen } from './screen/settings';

const LoginStack = createStackNavigator({
    Login: { screen: LoginScreen }
});

const AppStack = createBottomTabNavigator({
    Catalog: CatalogScreen,
    Settings: SettingsScreen
}, {
    initialRouteName: 'Catalog'
});

export const App = createSwitchNavigator({
    LoginLoading: LoginLoadingScreen,
    App: AppStack,
    Login: LoginStack
}, {
    initialRouteName: 'LoginLoading'
});
