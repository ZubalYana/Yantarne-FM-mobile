import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Play, Pause } from 'phosphor-react-native';
import { useAudioPlayer } from 'expo-audio';
const audioSource = 'http://complex.in.ua:80/yantarne'

export default function App() {
  const [radioData, setRadioData] = useState(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  // const [title, setTitle] = useState({ author: '', title: '' });
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRadioData(data);
      })
  }, []);

  const handlePlay = () => {
    setRadioData(null);
    fetch('https://complex.in.ua/status-json.xsl?mount=/yantarne')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRadioData(data);
      })
    if (isRadioPlaying) {
      player.pause();
      setIsRadioPlaying(false);
    } else {
      player.play();
      setIsRadioPlaying(true);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.playBtnBorderedOverlays, styles.playBtnBorderedOverlay3
        ]}
      >
        <TouchableOpacity
          style={[
            styles.playBtnBorderedOverlays, styles.playBtnBorderedOverlay2
          ]}
        >
          <TouchableOpacity
            style={[
              styles.playBtnBorderedOverlays, styles.playBtnBorderedOverlay1
            ]}
          >
            <TouchableOpacity style={styles.playBtnOverlay}>
              <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
                {isRadioPlaying ? <Pause color="#fff" size={52} style={styles.playIcon} weight="fill" /> : <Play color="#fff" size={52} style={styles.playIcon} weight="fill" />}
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
      <Text style={styles.songName} >{radioData?.icestats?.source?.title ?? "Loading..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  playBtnBorderedOverlays: {
    borderRadius: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnBorderedOverlay1: {
    width: 225,
    height: 225,
    borderColor: '#fff',
    borderWidth: 3,
  },
  playBtnBorderedOverlay2: {
    width: 270,
    height: 270,
    borderColor: '#ffffffd4',
    borderWidth: 2,
  },
  playBtnBorderedOverlay3: {
    width: 310,
    height: 310,
    borderColor: '#ffffffd4',
    borderWidth: 1,
  },
  playBtnOverlay: {
    width: 180,
    height: 180,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff90',
    borderColor: '#fff',
    borderWidth: 3
  },
  playBtn: {
    width: 115,
    height: 115,
    borderRadius: 75,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff0000ff',
  },
  songName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20
  },
  playIcon: {
    width: 70,
    height: 70,
  }
});
