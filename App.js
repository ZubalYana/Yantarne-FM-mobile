import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Play, Pause } from 'phosphor-react-native';
import { useAudioPlayer } from 'expo-audio';
import { Animated, Easing } from 'react-native';
const audioSource = 'http://complex.in.ua:80/yantarne';

export default function App() {
  const [radioData, setRadioData] = useState(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [title, setTitle] = useState({ author: '', title: '' });
  const player = useAudioPlayer(audioSource);
  const overlay1Scale = useState(new Animated.Value(1))[0];
  const overlay2Scale = useState(new Animated.Value(1))[0];
  const overlay3Scale = useState(new Animated.Value(1))[0];

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

  useEffect(() => {
    if (radioData?.icestats?.source?.title) {
      const [author, track] = radioData.icestats.source.title.split('-').map(str => str.trim());
      setTitle({ author, title: track });
    }
  }, [radioData]);

  const pulseAnimation1 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.15,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const pulseAnimation2 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const pulseAnimation3 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (isRadioPlaying) {
      pulseAnimation1(overlay1Scale);
      pulseAnimation2(overlay2Scale, 100);
      pulseAnimation3(overlay3Scale, 200);
    } else {
      overlay1Scale.setValue(1);
      overlay2Scale.setValue(1);
      overlay3Scale.setValue(1);
    }
  }, [isRadioPlaying]);


  return (
    <View style={styles.container}>
      <View style={styles.playContainer}>
        <Animated.View
          style={[
            styles.playBtnBorderedOverlays,
            styles.playBtnBorderedOverlay3,
            { transform: [{ scale: overlay3Scale }] }
          ]}
        />
        <Animated.View
          style={[
            styles.playBtnBorderedOverlays,
            styles.playBtnBorderedOverlay2,
            { transform: [{ scale: overlay2Scale }] }
          ]}
        />
        <Animated.View
          style={[
            styles.playBtnBorderedOverlays,
            styles.playBtnBorderedOverlay1,
            { transform: [{ scale: overlay1Scale }] }
          ]}
        />

        <TouchableOpacity style={styles.playBtnOverlay}>
          <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
            {isRadioPlaying
              ? <Pause color="#fff" size={52} style={styles.playIcon} weight="fill" />
              : <Play color="#fff" size={52} style={styles.playIcon} weight="fill" />}
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.songInfoContainer}>
          <Text style={styles.songAuthor}>{title.author ?? "Loading..."}</Text>
          <Text style={styles.songName}>{title.title ?? "Loading..."}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 30
  },
  playContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  playBtnBorderedOverlays: {
    borderRadius: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
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
    borderWidth: 3,
    position: 'absolute'
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
  songAuthor: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  songName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'semibold',
    textAlign: 'center',
    marginTop: 10
  },
  playIcon: {
    width: 70,
    height: 70,
  },
  songInfoContainer: {
    position: 'absolute',
    bottom: 220
  },
});
