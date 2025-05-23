import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native'
import { useState, useEffect, useRef, useMemo} from 'react';
import { Dimensions } from 'react-native';
import {runOnJS} from 'react-native-reanimated'
import axios from 'axios';
import { Buffer } from 'buffer';

import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { Platform, PermissionsAndroid } from 'react-native';
import WellDone from './WellDone';

import RNFS from 'react-native-fs';

const emotions = ['happy', 'sad', 'angry', 'surprise', 'neutral', 'fear', 'disgust']

const tasks = {
  1: {
    title: 'A Sweet Surprise',
    task: 'Someone gave you your favorite snack',
    emotion: 'happy'
  },
  2: {
    title: 'The Lost Toy',
    task: 'Someone gave you your favorite snack2',
    emotion: 'sad'
  },
  3: {
    title: 'An Unexpected Sound',
    task: 'Someone gave you your favorite snack3',
    emotion: 'surprise'
  },
  4: {
    title: 'The Ruined Book',
    task: 'Someone gave you your favorite snack4',
    emotion: 'sad'
  },
  5: {
    title: 'An Unexpected Gift of Time',
    task: 'Someone gave you your favorite snack5',
    emotion: 'happy'
  },
}

const { width: screenWidth } = Dimensions.get('window');

const mistakeDummy = "You feel happy because you received something very tasty that you like! It could be your favorite chocolate, juicy fruit or crispy cookies. When someone gives you such a delicious gift, it is pleasant and unexpected. You feel warm in your heart because you know that they took care of you and wanted to make you happy. That is why you want to smile!"


const MistakePanel: React.FC<{mistakeText: string; setShowMistakePanel: any}> = ({mistakeText, setShowMistakePanel}) => {
  return (
    <View style={styles.mistakePanel}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', marginBottom: 30 }}>
        <Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          Why should this be the{'\n'}answer?
        </Text>
        <TouchableOpacity onPress={() => {setShowMistakePanel(false)}}>
          <Image
            source={require('../assets/cross.png')}
            style={{ width: 16, height: 16 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.mistakeText}>{mistakeText}</Text>
    </View>
  )
}

const Module2Camera: React.FC<{navigation:any, route:any}> = ({navigation, route}) => {
  const {storyIndex, storyTitle, moduleIndex, moduleTitle} = route.params
  const [localStoryIndex, setLocalStoryIndex] = useState<number>(storyIndex)
  const [answerState, setAnswerState] = useState<"correct" | "wrong" | "neutral">("neutral")
  const [showMistakePanel, setShowMistakePanel] = useState<boolean>(false)
  
  const [camEnabled, setCamEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  

  const getFrontCamera = () => {
    for (let i = 0; i < devices.length; i++){
      if (devices[i].position === 'front'){
        return devices[i]
      }
    }
    return devices[devices.length-1]
  }
  
  const device = getFrontCamera()

  const correctColor = '#83DA40';
  const wrongColor = '#E85E40'
  const neautralColor = '#C5C5C5'

  const PROCESSING_INTERVAL = 300;
  const lastProcessedRef = useRef(0);
  const isProcessing = useRef(false); // mutable ref

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
  if (!camEnabled) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    return;
  }

  const ws = new WebSocket('wss://romaniabackws-production.up.railway.app/ws');

  ws.onopen = () => {
    console.log('WebSocket open');
    ws.send(JSON.stringify({
      emotion: tasks[localStoryIndex].emotion,
      confidence: 0.05
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.status === 'detected') {
      console.log('Detected emotion:', data.emotion, data.confidence);
      setAnswerState('correct');
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  wsRef.current = ws;

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}, [camEnabled, storyIndex]);

// JPEG photo + send to server
const takeAndSendPhoto = async () => {
  const now = Date.now();
  if (now - lastProcessedRef.current < PROCESSING_INTERVAL || isProcessing.current) return;

  lastProcessedRef.current = now;
  isProcessing.current = true;

  try {
    const photo = await cameraRef.current?.takePhoto();

    if (!photo?.path) throw new Error('Photo path not found');

    const base64 = await RNFS.readFile(photo.path, 'base64');
    
    const buffer = Buffer.from(base64, 'base64');

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(buffer);
    }
  } catch (err) {
    console.error('Failed to capture/send photo:', err);
  } finally {
    isProcessing.current = false;
  }
};

// Schedule automatic photo sending
useEffect(() => {
  if (!camEnabled) return;
  const interval = setInterval(() => {
    takeAndSendPhoto();
  }, PROCESSING_INTERVAL);
  return () => clearInterval(interval);
}, [camEnabled]);

// Request permissions
useEffect(() => {
  const requestCamPermission = async () => {
    console.log('requestCamPermission was called');
    if (!camEnabled) return;

    const status = await Camera.getCameraPermissionStatus();
    if (status !== 'granted') {
      const newStatus = await Camera.requestCameraPermission();
      if (newStatus === 'granted') {
        setHasPermission(true);
        setCamEnabled(true);
      }
    } else {
      setHasPermission(true);
      setCamEnabled(true);
    }
  };

  requestCamPermission();
}, [camEnabled]);

  const handleCameraToggle = async () => {
    if (!hasPermission) {
      const newStatus = await Camera.requestCameraPermission();
      if (newStatus === 'granted') {
        setHasPermission(true);
      }
      setCamEnabled(!camEnabled);
    } else {
      setCamEnabled(!camEnabled);
    }
  }

  const openWebSocket = () => {
  if (wsRef.current && 
      (wsRef.current.readyState === WebSocket.OPEN || 
       wsRef.current.readyState === WebSocket.CONNECTING)) {
    console.log("WebSocket already open or connecting");
    return;
  }

  const ws = new WebSocket('wss://romaniabackws-production.up.railway.app/ws');

  ws.onopen = () => {
    console.log('✅ WebSocket connected');
    ws.send(JSON.stringify({ emotion: tasks[localStoryIndex].emotion, confidence: 0.3 }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.status === 'detected') {
      console.log('Detected emotion:', data.emotion, data.confidence);
      setAnswerState('correct');
    }
  };

  ws.onerror = (err) => {
    console.error('❌ WebSocket error:', err);
  };

  ws.onclose = () => {
    console.log('🔌 WebSocket closed');
  };

  wsRef.current = ws;
};


  const handleContinue = () => {
    if (localStoryIndex === 5){
      navigation.navigate('WellDone', {moduleIndex: moduleIndex, moduleTitle: moduleTitle})
    }
    setLocalStoryIndex(localStoryIndex+1);
    setAnswerState('neutral'); 
    openWebSocket()
  }


  return (
    <View>
      <View style={styles.wrapper}>
        <View style={{flex: 1}}>
          <View style={{ flexDirection: 'row', marginBottom: 10, gap: 13, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/arrow-left.png')}
                resizeMode="contain"
                style={{ height: 18, width: 16 }}
              />
            </TouchableOpacity>
            <Text style={styles.moduleTitle}>{tasks[localStoryIndex].title}</Text>
          </View>

          {/* Camera */}
          <Text style={styles.description} >Read the situation and show the emotion</Text>
          <View style={[styles.cameraContainer, {
            borderColor:
              answerState === 'correct' ? correctColor :
              answerState === 'wrong' ? wrongColor :
              neautralColor
          }]}>
            {device && hasPermission && camEnabled && (
              <Camera
                ref={cameraRef}
                device={device}
                isActive={true}
                style={StyleSheet.absoluteFill}
                photo={true}
              />
            )}
          </View>


          {/* Hide Camera Button */}
          <TouchableOpacity style={styles.cameraButton} onPress={()=>{handleCameraToggle()}}>
            <Image source={camEnabled ? require('../assets/camera.png') : require('../assets/crossed_camera.png')} resizeMode='contain' style={{width: 22, height: 22}}></Image>
          </TouchableOpacity>

          {/* Task */}
          <View style={styles.taskContainer}>
            <Text style={{textAlign: 'center'}}>{tasks[localStoryIndex].task}</Text>
          </View>
          <View style={{flex:1}}></View>

          {/* Row */}
          <View style={[{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }, answerState==='wrong' && {justifyContent: 'space-between'}]}>
            {answerState==='wrong' && (
            
            //Mistake Circle
            <TouchableOpacity style={styles.questionCircle} onPress={()=>{setShowMistakePanel(true)}}>
              <Text style={{textAlign: 'center', alignSelf: 'center', fontSize: 16}}>?</Text>
            </TouchableOpacity>)}
            
            {/* Continue Button */}
            <TouchableOpacity
              style={answerState==='correct' ? styles.activeContinueButton : styles.continueButton}
              disabled={answerState==='wrong'}
              onPress={() => {Object.keys(tasks).length === localStoryIndex ? navigation.navigate('WellDone', {moduleIndex: moduleIndex, moduleTitle: moduleTitle}) : handleContinue()}}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tint */}
      {showMistakePanel && (
        <View style={{height: "100%", width: "100%", position: "absolute", zIndex: 1, backgroundColor: "rgba(0, 0, 0, 0.42)"}}></View>
      )}

      {/* Panels */}
      {showMistakePanel && (
        <MistakePanel mistakeText={mistakeDummy} setShowMistakePanel={setShowMistakePanel}></MistakePanel>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
    height: '100%',
    backgroundColor: '#FFF'
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  pageIndicator: {
    marginLeft: 'auto',
    fontWeight: '500',
    fontSize: 14,
    color: 'gray',
  },
  description: {
    fontWeight: 500,
    marginBottom: 30
  },
  cameraContainer: {
  width: "100%",
  height: 200,
  borderRadius: 20,
  backgroundColor: 'rgb(117, 117, 117)',
  borderWidth: 6,
  borderColor: '#C5C5C5',
  marginBottom: 7,
  overflow: 'hidden',
  position: 'relative', // << needed for absoluteFill camera to work
},

  taskContainer: {
    backgroundColor: '#DCECFC',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 50
  },
  continueButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 10,
    borderColor: '#545454',
    borderWidth: 1,
  },
  activeContinueButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: '#DCECFC'
  },
  continueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  questionCircle: {
    backgroundColor: '#D9D9D9',
    borderRadius: '100%',
    justifyContent: 'center',
    height: 45,
    width: 45
  },
  mistakePanel: {
    width: screenWidth*0.8,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 22,
    backgroundColor: '#fff',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -screenWidth*0.4 }], 
    top: '15%',
    zIndex: 2,
    borderRadius: 15,
  },
  mistakeText: {
    fontSize: 15,
    lineHeight: 23
  },
  cameraButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 24,
    marginBottom: 24
  }
})


export default Module2Camera