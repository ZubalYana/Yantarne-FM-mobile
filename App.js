import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';


export default function App() {
  const [radioData, setRadioData] = useState(null);

  useEffect(() => {
    fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRadioData(data);
      });
  }, []);

  return (
    <View style={styles.container}>

      <Text>{radioData.icestats.source.title}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
