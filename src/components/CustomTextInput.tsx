import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import React from 'react';

const CustomTextInput = ({ label = 'TextInput', color = 'black', ...props }) => (
  <TextInput
    style={styles.textInput}
    selectionColor={color}
    outlineColor={color}
    activeOutlineColor={color}
    placeholderTextColor={color}
    textColor="black"
    mode="outlined"
    label={label}
    secureTextEntry={props.secureTextEntry}
    onChangeText={props.onChangeText}
  />
);

const styles = StyleSheet.create({
  textInput: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 32,
    marginRight: 32,
  },
});

export default CustomTextInput;
