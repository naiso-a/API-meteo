import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Api from '../models/Api';
import weatherCode from '../services/weatherCode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MeteoCity = ({ navigation, route }) => {
  const meteoAPI = new Api();

  const [meteoCityFor5Days, setMeteoCityFor5Days] = useState({});
  const [meteoCity, setMeteoCity] = useState({
    city: { name: '' },
    forecast: [[]],
  });
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('celsius');

  useEffect(() => {
    getMeteoForCity(route.params.insee);
    getMeteoForCity5days(route.params.insee);
  }, []);

  const getMeteoForCity = async (insee) => {
    const result = await meteoAPI.getMeteoForCityForNextHour(insee);
    setMeteoCity(result);
    setLoading(false);
  };

  const getMeteoForCity5days = async (insee) => {
    const result = await meteoAPI.getMeteoForCityFor5Days(insee);
    setMeteoCityFor5Days(result);
  };

  const dateFormat = (dateISO) => {
    const date = new Date(dateISO);
    const dateFormat = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    return dateFormat;
  };

  const weatherIcons = [
    { codes: [0], icon: 'weather-sunny' },
    { codes: [1, 2, 3, 4, 5], icon: 'weather-cloudy' },
    { codes: [6, 7], icon: 'weather-fog' },
    { codes: [10, 11, 12, 13, 14, 15, 16, 40, 41, 42, 43, 44, 45, 46, 47, 48, 120, 121, 122, 123, 124, 125, 126, 127, 128, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 141, 142, 210, 211, 212], icon: 'weather-rainy' },
    { codes: [20, 21, 22, 30, 31, 32, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 120, 121, 122, 123, 124, 125, 126, 127, 128], icon: 'weather-snowy' },
    { codes: [30, 31, 32, 130, 131, 132], icon: 'weather-snowy-rainy' },
    { codes: [100, 101, 102, 103, 104, 105, 106, 107, 108, 140, 141, 142], icon: 'weather-lightning' },
  ];
  
  const mapWeatherIcon = (weatherCode) => {
    const matchedIcon = weatherIcons.find(entry => entry.codes.includes(weatherCode));
    return matchedIcon ? matchedIcon.icon : 'weather-sunny';
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.previsionView} key={item.datetime}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
        <Icon name={mapWeatherIcon(item.weather)} size={60} color="#000" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.previsionTitle}>{dateFormat(item.datetime)}</Text>
          <Text>
            T°Max : {item.tmax} T°Min : {item.tmin}
          </Text>
          <Text>
            Rafale de vent à 10 mètres : {item.wind10m}
            {' km/h '}
          </Text>
        </View>
      </View>
    </View>
  );

  const convertTemperature = (temperature) => {
    return unit === 'celsius' ? temperature : (temperature * 9) / 5 + 32;
  };

  return (
    <>
      {!loading && (
        <>
          <View style={styles.weatherContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.tempText}>
                {meteoCity.city.name} {convertTemperature(meteoCity.forecast[0][3].temp2m)}
                {unit === 'celsius' ? '°C' : '°F'}
              </Text>
              <Text style={styles.subtitle}>
                {weatherCode[meteoCity.forecast[0][3].weather]}
              </Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
              >
                <Text style={styles.toggleButtonText}>Changer l'unité</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.weatherContainer}>
              <FlatList
                data={meteoCityFor5Days}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    backgroundColor: '#add8e6',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 48,
    color: '#fff',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
  },
  previsionView: {
    backgroundColor: '#98D7DC',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previsionTitle: {
    fontSize: 20,
    marginBottom: 3,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MeteoCity;
