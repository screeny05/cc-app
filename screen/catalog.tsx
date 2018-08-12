import * as React from 'react';
import { View, Text, AsyncStorage, Button, SectionList } from 'react-native';
import { bind } from 'bind-decorator';
import { NavigationScreenProps } from 'react-navigation';

import { getCoasterTable } from '../lib/cc-api/coaster-table';

class CoasterTableSectionHeader extends React.Component<{ park: any }> {
    shouldComponentUpdate(nextProps){
        return nextProps.park.ccId !== this.props.park.ccId;
    }

    render(){
        return (
            <Text style={{fontWeight: 'bold'}}>{this.props.park.name}</Text>
        );
    }
};

class CoasterTableItem extends React.Component<{ coaster: any }> {
    shouldComponentUpdate(nextProps){
        console.log('update',nextProps.coaster.ccId !== this.props.coaster.ccId)
        return nextProps.coaster.ccId !== this.props.coaster.ccId;
    }

    render(){
        return (
            <Text>{this.props.coaster.name}</Text>
        );
    }
};

class CoasterTable extends React.PureComponent<{ coasters: any[] }> {
    render(){
        const data = this.props.coasters.map(park => ({
            name: park.name,
            ccId: park.ccId,
            data: park.coasters.map((coaster: any) => ({
                ccId: coaster.ccId,
                name: coaster.name
            }))
        }));

        return (
            <SectionList
                renderItem={({ item, index }) => <CoasterTableItem coaster={item} key={index}/>}
                renderSectionHeader={({ section }) => <CoasterTableSectionHeader park={section} key={section.ccId}/>}
                sections={data}
                keyExtractor={(item) => item.ccId}
                removeClippedSubviews
            />
        )
    }
}

export class CatalogScreen extends React.Component<NavigationScreenProps> {
    static navigationOptions = {
        title: 'Catalog',
    };

    state = {
        coasters: []
    };

    constructor(props: NavigationScreenProps){
        super(props);
        this.bootstrap();
    }

    async bootstrap(){
        const coasters = await getCoasterTable('catalogue/europe/germany/parks', this.props.navigation.getParam('sessionId'));
        this.setState({ coasters });
    }

    render(){
        const sessionId = this.props.navigation.getParam('sessionId');

        return (
            <View>
                <CoasterTable coasters={this.state.coasters}></CoasterTable>
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
