import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

function Profile({navigation}) {
  const githubUsername = navigation.getParam('github_username');
  return (
    <WebView
      style={styles.webView}
      source={{uri: `https://github.com/${githubUsername}`}}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});

export default Profile;
