import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity /*Keyboard*/,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs} from '../services/socket';
import {useNavigation} from '@react-navigation/native';

interface PositionProps {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Dev {
  _id: number;
  name: string;
  avatar_url: string;
  github_username: string;
  bio: string;
  techs: string[];
  location: {
    coordinates: number[];
  };
}

function Main() {
  const navigation = useNavigation();
  const [devs, setDevs] = useState<Dev[]>([] as Dev[]);
  // eslint-disable-next-line prettier/prettier
  const [currentRegion, setCurrentRegion] = useState<PositionProps>({} as PositionProps);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Acesso a localização',
          message:
            'Precisamos de acesso a localização para' +
            'podemos encontrar outros devs próximo a você.',
          buttonNeutral: 'Depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setCurrentRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            });
          },
          () => {
            setCurrentRegion({
              latitude: -23.6821604,
              longitude: -46.875492,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            });
          },
          {enableHighAccuracy: true},
        );
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs((dev) => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    disconnect();

    const {latitude, longitude} = currentRegion;

    connect(String(latitude), String(longitude), techs);
  }

  async function loadDevs() {
    const {latitude, longitude} = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      },
    });
    setDevs(response.data.devs);
    setupWebsocket();
  }

  function handleRegionChanged(region: PositionProps) {
    console.log('region', region);
    setCurrentRegion(region);
  }

  if (!currentRegion.latitude) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}>
        {devs.map((dev) => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0],
            }}>
            <Image style={styles.avatar} source={{uri: dev.avatar_url}} />
            <Callout
              onPress={() => {
                navigation.navigate('Profile', {
                  github_username: dev.github_username,
                });
              }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <Icon name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  callout: {
    width: 260,
  },

  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  devBio: {
    color: '#666',
    marginTop: 5,
  },

  devTechs: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4Dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});

export default Main;
