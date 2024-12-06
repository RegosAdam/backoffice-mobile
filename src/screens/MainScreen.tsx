import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Timestamp, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../../.firebase/firebaseConfig';
import SafeArea from '../components/SafeArea';
import useAuthUser from '../hooks/useAuthUser';
import CustomButton from '../components/CustomButton';

interface LogType {
  email: string;
  action: string;
  state: string;
  timestamp: Timestamp;
}

function MainScreen() {
  const [workTime, setWorkTime] = useState(0);
  const [lunchTime, setLunchTime] = useState(0);
  const [privateTime, setPrivateTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseType, setPauseType] = useState('');
  const [logs, setLogs] = useState<Array<LogType>>([]);
  const user = useAuthUser();

  const fetchUserData = async (uid: string | undefined) => {
    try {
      if (user && uid) {
        const userDocRef = doc(db, 'users', uid as string);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot) {
          const userData = userDocSnapshot.data();
          if (userData && userData.logs) {
            setLogs(userData.logs.sort((a: LogType, b: LogType) => Number(a.timestamp) - Number(b.timestamp)));
          }
          console.log('UserData fetched successfully!');
        } else {
          console.log('No data found for this user!');
        }
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const saveUserLog = async (uid: string, log: any) => {
    const userDocRef = doc(db, 'users', uid);

    try {
      await updateDoc(userDocRef, {
        logs: arrayUnion(log),
      });
      console.log('Log saved successfully!');

      await fetchUserData(user?.uid);
    } catch (error) {
      console.error('Error saving log : ', error);
    }
  };

  const setLogAction = (action: string, state: string) => {
    return {
      email: auth.currentUser?.email,
      action: action,
      state: state,
      timestamp: new Date(),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchUserData(user.uid);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const calcTime = () => {
      if (logs) {
        calculateTimes(filterLogsByToday(logs));
        setWorkState(filterLogsByToday(logs));
      } else {
        console.error('Logs are not fetched');
      }
    };
    calcTime();
  }, [logs]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const calcTime = () => {
        if (logs) {
          calculateTimes(filterLogsByToday(logs));
        } else {
          console.error('Logs are not fetched');
        }
      };
      calcTime();
      console.log('Timed refresh happened!');
    }, 300000); // every 5 minutes (300000 milliseconds)

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [logs]);

  const renderLogs = (logs: Array<LogType>) => {
    return logs?.map((log: LogType, index: number) => (
      <Text key={index}>
        {log?.state}-{log?.action}: {new Date(log?.timestamp?.toDate()).toLocaleTimeString()}
      </Text>
    ));
  };

  function setWorkState(logs: Array<LogType>) {
    const lastLog = logs[logs.length - 1];
    if (lastLog) {
      if (lastLog.action === 'private' || lastLog.action === 'lunch') {
        if (lastLog.state === 'start') {
          setIsActive(true);
          setIsPaused(true);
        } else {
          setIsActive(true);
          setIsPaused(false);
        }
      } else {
        if (lastLog.state === 'start') {
          setIsActive(true);
          setIsPaused(false);
        } else {
          setIsActive(false);
          setIsPaused(false);
        }
      }
    }
  }

  function calculateTimes(logs: Array<LogType>) {
    let workT = 0;
    let lunchT = 0;
    let privateT = 0;
    let startT: any = null;

    logs.map((log: LogType) => {
      if (log.state === 'start') {
        startT = new Date(log.timestamp.seconds * 1000); // converting Firestore timestamp to JavaScript Date
      } else if (log.state === 'end') {
        const endTime = new Date(log.timestamp.seconds * 1000);
        const elapsedTime = (endTime.getTime() - startT.getTime()) / 60000; // difference in minutes

        switch (log.action) {
          case 'work':
            workT += elapsedTime;
            break;
          case 'lunch':
            lunchT += elapsedTime;
            break;
          case 'private':
            privateT += elapsedTime;
            break;
          default:
            console.error(`Unknown action: ${log.action}`);
        }
      }
    });

    // Check if the last log was a 'start' without a matching 'end'
    const lastLog = logs[logs.length - 1];
    if (lastLog) {
      if (lastLog.state === 'start') {
        const now = new Date();
        const elapsedTime = (now.getTime() - startT.getTime()) / 60000; // difference in minutes

        switch (lastLog.action) {
          case 'work':
            workT += elapsedTime;
            break;
          case 'lunch':
            lunchT += elapsedTime;
            break;
          case 'private':
            privateT += elapsedTime;
            break;
          default:
            console.error(`Unknown action: ${lastLog.action}`);
        }
      }
    }
    console.log(`Total work time: ${workT.toFixed(2)} minutes`);
    console.log(`Total lunch time: ${lunchT.toFixed(2)} minutes`);
    console.log(`Total private time: ${privateT.toFixed(2)} minutes`);

    setLunchTime(Math.floor(lunchT));
    setPrivateTime(Math.floor(privateT));
    setWorkTime(Math.floor(workT));

    return { workTime: workT, lunchTime: lunchT, privateTime: privateT };
  }

  // function diffInMinutes(date1: Date, date2: Date) {
  //   const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  //   return diffInMs / (1000 * 60);
  // }

  function filterLogsByToday(logs: Array<LogType>) {
    // get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to 00:00:00 to only compare date

    // filter logs
    const filteredLogs = logs.filter((log: LogType) => {
      const logDate = new Date(log?.timestamp?.toDate());
      logDate.setHours(0, 0, 0, 0); // set time to 00:00:00 to only compare date
      return logDate.getTime() === today.getTime();
    });

    return filteredLogs;
  }

  function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }

  const startWork = async () => {
    setIsActive(true);
    setIsPaused(false);

    if (user) {
      saveUserLog(user?.uid, setLogAction('work', 'start'));
    }
  };

  const pauseWork = async (pause: string) => {
    Alert.alert(
      'Pause Work',
      `Are you sure you want to start a ${pause} break?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsActive(false);
            setIsPaused(true);
            if (user) {
              if (pause === 'lunch') {
                setPauseType('lunch');
                saveUserLog(user?.uid, setLogAction('work', 'end'));
                saveUserLog(user?.uid, setLogAction('lunch', 'start'));
              } else {
                setPauseType('private');
                saveUserLog(user?.uid, setLogAction('work', 'end'));
                saveUserLog(user?.uid, setLogAction('private', 'start'));
              }
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const continueWork = async () => {
    setIsActive(true);
    setIsPaused(false);

    if (user) {
      if (pauseType === 'lunch') {
        saveUserLog(user?.uid, setLogAction('lunch', 'end'));
        saveUserLog(user?.uid, setLogAction('work', 'start'));
      } else {
        saveUserLog(user?.uid, setLogAction('private', 'end'));
        saveUserLog(user?.uid, setLogAction('work', 'start'));
      }
    }
  };

  const endWork = async () => {
    Alert.alert(
      'End Work',
      'Are you sure you want to end your work session?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsActive(false);
            if (user) {
              saveUserLog(user?.uid, setLogAction('work', 'end'));
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeArea>
      <ScrollView>
        <View style={styles.container}>
          <CustomButton title="Refresh" onPress={() => calculateTimes(filterLogsByToday(logs))} />
          <>
            <Text style={styles.counter}>Private: {formatMinutes(privateTime)}</Text>
            <Text style={styles.counter}>Lunch: {formatMinutes(lunchTime)}</Text>
            <Text style={styles.counter}>Work: {formatMinutes(workTime)}</Text>
          </>
          <View style={styles.buttonContainer}>
            {!isActive && !isPaused ? (
              <CustomButton title="Start Work" onPress={startWork} />
            ) : (
              <>
                {isPaused ? (
                  <CustomButton title="Continue Work" onPress={continueWork} />
                ) : (
                  <>
                    <CustomButton title="Lunch" onPress={() => pauseWork('lunch')} />
                    <CustomButton title="Private" onPress={() => pauseWork('private')} />
                  </>
                )}
                {isActive && !isPaused ? <CustomButton title="End Work" onPress={endWork} /> : <></>}
              </>
            )}
          </View>

          <ScrollView style={styles.logs}>
            {logs?.length > 0 ? (
              renderLogs(filterLogsByToday(logs))
            ) : (
              // <Text>Loading logs...</Text>
              <Text></Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  counter: {
    fontSize: 32,
    marginTop: 5,
  },
  logs: {
    width: '80%',
    textAlign: 'center',
    maxHeight: 300,
    margin: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default MainScreen;
