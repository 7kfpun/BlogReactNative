import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';
import SafariView from 'react-native-safari-view';
import SearchBar from 'react-native-material-design-searchbar';

import fuzzy from 'fuzzy';

import data from './data';
import { config } from './config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nameText: {
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 36,
  },
});


export default class Blog extends Component {
  state = {
    data,
    matches: data,
  }

  onSearch(text) {
    console.log('onSearch', text);
    if (!text || typeof text !== 'string') {
      this.setState({ matches: this.state.data });
    } else {
      const options = {
        extract: item => item.key,
      };
      const results = fuzzy.filter(text, this.state.data, options);
      this.setState({ matches: results.map(item => item.original) });
    }
  }

  openUrl(url) {
    SafariView.show({ url });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <SearchBar
            onSearchChange={item => this.onSearch(item)}
            height={50}
            onFocus={() => console.log('On Focus')}
            onBlur={() => console.log('On Blur')}
            placeholder={'Search...'}
            autoCorrect={false}
            // padding={5}
            returnKeyType={'search'}
          />
        </View>
        <FlatList
          data={this.state.matches}
          renderItem={({ item }) => (<TouchableOpacity onPress={() => this.openUrl(item.url)}>
            <View style={styles.row}>
              <Text style={styles.nameText}>{item.key}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </TouchableOpacity>)}
        />
        <AdMobBanner
          bannerSize="smartBannerPortrait"
          adUnitID={config.admob.ios.banner}
        />
      </View>
    );
  }
}
