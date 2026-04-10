import { useTheme } from '../../../theme/ThemeProvider.tsx';
import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: object;
  textStyle?: object;
  color: string;
  type: 'regular' | 'withIcon';
  textColor: 'white' | 'black';
  borderColor?: string;
  sourceIcon?: string;
}

const Button = ({
  onPress,
  title,
  style,
  textStyle,
  color,
  type,
  textColor,
  borderColor,
  sourceIcon,
}: ButtonProps) => {
  const { colors } = useTheme();
  switch (type) {
    case 'withIcon':
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[
            {
              backgroundColor: color ?? colors.white,
              padding: 10,
              borderRadius: 30,
              borderWidth: borderColor ? 0.2 : 0,
              borderColor: borderColor,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            },
            style,
          ]}>
          {sourceIcon && (
            <Image
              source={sourceIcon}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />
          )}
          <Text
            style={[
              {
                color: textColor === 'white' ? colors.white : colors.black,
                textAlign: 'center',
                fontFamily: 'Switzer',
                paddingVertical: 6,
                fontSize: 16,
              },
              textStyle,
            ]}>
            {title}
          </Text>
        </TouchableOpacity>
      );
    case 'regular':
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[
            {
              backgroundColor: color ?? colors.white,
              padding: 10,
              borderRadius: 30,
            },
            style,
          ]}>
          <Text
            style={[
              {
                color: textColor === 'white' ? colors.white : colors.black,
                textAlign: 'center',
                fontFamily: 'Switzer',
                paddingVertical: 6,
                fontSize: 16,
              },
              textStyle,
            ]}>
            {title}
          </Text>
        </TouchableOpacity>
      );
  }
};

export default Button;
