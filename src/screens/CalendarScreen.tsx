import React, { useEffect, useState } from 'react';
import { View, Text, Platform, Alert, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../../.firebase/firebaseConfig';
import useAuthUser from '../hooks/useAuthUser';
import SafeArea from '../components/SafeArea';
import CustomButton from '../components/CustomButton';

function CalendarScreen() {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showHolidayPicker, setShowHolidayPicker] = useState(false);
  const [holidays, setHolidays] = useState<Array<any>>([]);
  const user = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchUserData(user.uid);
      }
    };
    fetchData();
  }, [user]);

  const fetchUserData = async (uid: string | undefined) => {
    try {
      if (user && uid) {
        const userDocRef = doc(db, 'users', uid as string);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot) {
          const userData = userDocSnapshot.data();
          if (userData && userData.holidays) {
            setHolidays(userData.holidays.sort((a: any, b: any) => Number(a.holiday) - Number(b.holiday)));
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

  const saveHoliday = async (uid: string, holiday: any) => {
    const userDocRef = doc(db, 'users', uid);

    try {
      await updateDoc(userDocRef, {
        holidays: arrayUnion(holiday),
      });
      console.log('Holiday saved successfully!');

      await fetchUserData(user?.uid);
    } catch (error) {
      console.error('Error saving Holiday : ', error);
    }
  };

  const onPressSetHoliday = () => {
    if (user) {
      saveHoliday(user?.uid, {
        email: auth.currentUser?.email,
        startDate: startDate,
        endDate: endDate,
      });
      Alert.alert('Success', 'Your holiday has been set.', [
        {
          text: 'OK',
          onPress: () => {
            setShowHolidayPicker(false);
            setStartDate(() => {
              const today = new Date();
              const nextDay = new Date(today);
              nextDay.setDate(today.getDate() + 1);
              return nextDay;
            });
            setEndDate(undefined);
          },
        },
      ]);
    }
  };

  const onStartDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }

    if (event.type === 'neutralButtonPressed') {
      setStartDate(() => {
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        return nextDay;
      });
    } else {
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    }
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }

    if (event.type === 'neutralButtonPressed') {
      setStartDate(() => {
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        return nextDay;
      });
    } else {
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const renderHolidays = (holidays: Array<any>) => {
    return holidays?.map((holiday: any, index: number) => (
      <Text key={index}>
        {formatDate(new Date(holiday?.startDate.toDate()))} - {formatDate(new Date(holiday?.endDate.toDate()))}
      </Text>
    ));
  };

  function formatDate(date: Date) {
    const year = date.getFullYear();
    // getMonth() is zero-based, so add 1 to get the correct month number
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // prepend 0 if month < 10
    const day = ('0' + date.getDate()).slice(-2); // prepend 0 if day < 10
    return `${year}:${month}:${day}`;
  }

  return (
    <SafeArea>
      <ScrollView>
        <View style={styles.container}>
          {!showHolidayPicker && (
            <View style={styles.singleButtonWrapper}>
              <CustomButton title="Set Holiday" onPress={() => setShowHolidayPicker(true)} />
            </View>
          )}

          {showHolidayPicker && (
            <>
              <View>
                <View style={styles.doubleButtonWrapper}>
                  <CustomButton
                    title="Select start date"
                    onPress={() => setShowStartPicker(true)}
                    marginHorizontal={20}
                  />
                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={onStartDateChange}
                      maximumDate={endDate}
                      minimumDate={startDate}
                    />
                  )}

                  <CustomButton title="Select end date" onPress={() => setShowEndPicker(true)} marginHorizontal={20} />
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onEndDateChange}
                      minimumDate={startDate}
                    />
                  )}
                </View>
                <View style={styles.doubleButtonWrapper}>
                  <Text>Start Date: {startDate.toLocaleDateString()}</Text>
                  <Text>End Date: {endDate?.toLocaleDateString()}</Text>
                </View>
              </View>
              <View style={styles.doubleButtonWrapper}>
                <CustomButton title="Set Holiday" onPress={onPressSetHoliday} marginHorizontal={20} />
                <CustomButton
                  title="Cancel"
                  onPress={() => {
                    setShowHolidayPicker(false);
                    setStartDate(() => {
                      const today = new Date();
                      const nextDay = new Date(today);
                      nextDay.setDate(today.getDate() + 1);
                      return nextDay;
                    });
                    setEndDate(undefined);
                  }}
                  marginHorizontal={20}
                />
              </View>
            </>
          )}
          <ScrollView style={styles.holidays}>
            {holidays?.length > 0 ? (
              renderHolidays(holidays)
            ) : (
              // <Text>Loading holidays...</Text>
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
  doubleButtonWrapper: {
    flexDirection: 'row',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-evenly',
  },
  singleButtonWrapper: {
    flexDirection: 'row',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  holidays: {
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

export default CalendarScreen;
