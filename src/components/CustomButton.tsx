import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({
  title = 'Title',
  bgColor = 'white',
  borderColor = 'black',
  textColor = 'black',
  fontSize = 16,
  padding = 10,
  marginHorizontal = 10,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor: bgColor,
        borderColor: borderColor,
        paddingHorizontal: 2 * padding,
        paddingVertical: padding,
        marginHorizontal: marginHorizontal,
      },
    ]}
    onPress={props.onPress}
  >
    <Text style={[styles.text, { color: textColor, fontSize: fontSize }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default CustomButton;
