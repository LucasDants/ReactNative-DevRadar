import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

type ParamList = {
  Profile: {
    github_username: string;
  };
};

function Profile() {
  const route = useRoute<RouteProp<ParamList, 'Profile'>>();
  const {github_username} = route.params;
  console.log(route.params);
  return (
    <WebView
      style={styles.webView}
      source={{uri: `https://github.com/${github_username}`}}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});

export default Profile;
