import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

interface IPause {
  pauseType: string;
  start: Date;
  end: Date;
}

function HomeScreen() {
  const [isWorking, setIsWorking] = useState(false);
  const [isOnPause, setIsOnPause] = useState(false);
  const [pauseLogs, setPauseLogs] = useState<IPause[]>([]);
  const [timer, setTimer] = useState(0);
  const [, setCurrentPause] = useState<IPause>({
    pauseType: '',
    start: new Date(),
    end: new Date(),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWork = () => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTimer((prevCounter) => prevCounter + 1);
      }, 1000);
    }
    setIsWorking(true);
  };

  const pauseWork = (pauseType: string) => {
    Alert.alert(
      'Pause Work',
      `Are you sure you want to start ${pauseType} break?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            setCurrentPause((prevState) => ({
              ...prevState,
              pauseType: pauseType,
              start: getCurrentTime(),
            }));

            setIsOnPause(true);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const continueWork = () => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTimer((prevCounter) => prevCounter + 1);
      }, 1000);
    }

    setCurrentPause((prevState) => {
      const updatedPause = {
        ...prevState,
        end: getCurrentTime(),
      };

      addPauseLog(updatedPause);
      return updatedPause;
    });

    setIsOnPause(false);
  };

  const endWork = () => {
    Alert.alert(
      'End Work',
      'Are you sure you want to end your work time?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsWorking(false);
          },
        },
      ],
      { cancelable: false },
    );
  };

  const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const addPauseLog = (pause: IPause) => {
    setPauseLogs((prevState) => [...prevState, pause]);
  };

  const getCurrentTime = (): Date => {
    const currentTime = new Date();
    return currentTime;
  };

  const timeToString = (time: Date): string => {
    return time.toLocaleTimeString('en-US', { hour12: false });
  };

  const logToString = (pause: IPause): string => {
    return pause.pauseType + ' break: ' + timeToString(pause.start) + ' - ' + timeToString(pause.end);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.logs}>
        {pauseLogs.map((pause, index) => (
          <Text key={index}>{logToString(pause)}</Text>
        ))}
      </ScrollView>
      <Text style={styles.counter}>{secondsToTime(timer)}</Text>
      {!isWorking ? (
        <TouchableOpacity style={styles.button} onPress={startWork}>
          <Text style={styles.buttonText}>Start Work</Text>
        </TouchableOpacity>
      ) : (
        <>
          {!isOnPause ? (
            <>
              <TouchableOpacity style={styles.button} onPress={() => pauseWork('lunch')}>
                <Text style={styles.buttonText}>Lunch Break</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => pauseWork('personal')}>
                <Text style={styles.buttonText}>Personal Break</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={continueWork}>
              <Text style={styles.buttonText}>Continue Work</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={endWork}>
            <Text style={styles.buttonText}>Stop Work</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 48,
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'tomato',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  logs: {
    width: '80%',
    textAlign: 'center',
    maxHeight: 300,
    marginBottom: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default HomeScreen;
