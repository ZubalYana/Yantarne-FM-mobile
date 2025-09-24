import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, BookmarkSimpleIcon, GearIcon, HeadsetIcon, SignOut } from 'phosphor-react-native';
import { X } from 'lucide-react-native';
import { useAudioPlayer } from 'expo-audio';
import { Animated, Easing } from 'react-native';
import Logo from './assets/yantarne logo.svg';
const audioSource = 'http://complex.in.ua:80/yantarne';

export default function App() {
  const [radioData, setRadioData] = useState(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [title, setTitle] = useState({ author: '', title: '' });
  const player = useAudioPlayer(audioSource);
  const overlay1Scale = useState(new Animated.Value(1))[0];
  const overlay2Scale = useState(new Animated.Value(1))[0];
  const overlay3Scale = useState(new Animated.Value(1))[0];
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 350,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

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
      <View style={styles.logoContainer}>
        <Logo width={120} height={50} />
      </View>
      <TouchableOpacity style={styles.burger} onPress={() => setVisible(true)}>
        <View style={styles.burgerRow}></View>
        <View style={styles.burgerRow}></View>
        <View style={styles.burgerRow}></View>
      </TouchableOpacity>
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

      {visible && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
      )}
      <Animated.View
        style={[
          styles.sideMenu,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >

        <TouchableOpacity onPress={() => setVisible(false)} style={{ marginTop: 60 }}>
          <X size={32} strokeWidth={2.5} color='#000' />
        </TouchableOpacity>

        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
          <View style={styles.defaultUserIcon}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>U</Text>
          </View>
          <Text style={{ color: "#000000ff", fontSize: 24, fontWeight: 'bold', marginLeft: 14 }}>Username</Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Pressable
            style={({ pressed }) => [
              styles.menuOption,
              {
                backgroundColor: pressed ? "#e00000ff" : "#ff0000ff",
                padding: 10,
                borderRadius: 8,
              },
            ]}
          >
            <BookmarkSimpleIcon
              size={35}
              color="#000"
              weight="fill"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#000000ff", fontSize: 20, fontWeight: 'semi-bold' }}>Збережені</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.menuOption,
              {
                backgroundColor: pressed ? "#e00000ff" : "#ff0000ff",
                padding: 10,
                borderRadius: 8,
              },
            ]}
          >
            <GearIcon
              size={33}
              color="#000"
              weight="fill"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#000000ff", fontSize: 20, fontWeight: 'semi-bold' }}>Налаштування</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.menuOption,
              {
                backgroundColor: pressed ? "#e00000ff" : "#ff0000ff",
                padding: 10,
                borderRadius: 8,
              },
            ]}
          >
            <HeadsetIcon
              size={33}
              color="#000"
              weight="fill"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#000000ff", fontSize: 20, fontWeight: 'semi-bold' }}>Допомога</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.menuOption,
            {
              backgroundColor: pressed ? "#e00000ff" : "#ff0000ff",
              padding: 10,
              borderRadius: 8,
              position: 'absolute',
              bottom: 30,
              left: 15
            },
          ]}
        >
          <SignOut
            size={33}
            color="#000"
            weight="fill"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#000000ff", fontSize: 20, fontWeight: 'semi-bold' }}>Вийти</Text>
        </Pressable>
      </Animated.View>
    </View >
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
    bottom: 215
  },
  burger: {
    width: 32,
    height: 23,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'absolute',
    top: 100,
    right: 20
  },
  burgerRow: {
    width: '100%',
    height: 2,
    backgroundColor: '#ff0000ff',
    borderRadius: 8
  },
  logoContainer: {
    position: 'absolute',
    top: 83,
    left: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '90%',
    height: '100%',
    backgroundColor: '#ff0000',
    padding: 15,
  },
  defaultUserIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuOption: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10
  },
});
