import { useTheme } from '../../../theme/ThemeProvider.tsx';
import React from 'react';
import { TouchableOpacity, Text, Image, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: object;
  textStyle?: object;
  color: string;
  type: 'regular' | 'withIcon';
  textColor: 'white' | 'black';
  borderColor?: string;
  sourceIcon?: any;
  disable?: boolean;
  loading?: boolean;
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
  disable,
  loading,
}: ButtonProps) => {
  const { colors } = useTheme();

  const loaderColor = disable
    ? colors.disableText
    : textColor === 'white'
      ? colors.white
      : colors.black;

  const isButtonDisabled = disable || loading;

  const renderContent = (content: React.ReactNode) => {
    if (loading) {
      return <ActivityIndicator size="small" color={loaderColor} style={{ paddingVertical: 6 }} />;
    }
    return content;
  };

  switch (type) {
    case 'withIcon':
      return (
        <TouchableOpacity
          onPress={!isButtonDisabled ? onPress : undefined}
          disabled={isButtonDisabled}
          style={[
            {
              backgroundColor: isButtonDisabled ? colors.disableButton : (color ?? colors.white),
              padding: 10,
              borderRadius: 30,
              borderWidth: borderColor ? 0.2 : 0,
              borderColor: borderColor,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              opacity: loading ? 0.8 : 1,
            },
            style,
          ]}>
          {renderContent(
            <>
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
                    color: isButtonDisabled
                      ? colors.disableText
                      : textColor === 'white'
                        ? colors.white
                        : colors.black,
                    textAlign: 'center',
                    fontFamily: 'Switzer',
                    paddingVertical: 6,
                    fontSize: 16,
                  },
                  textStyle,
                ]}>
                {title}
              </Text>
            </>,
          )}
        </TouchableOpacity>
      );
    case 'regular':
      return (
        <TouchableOpacity
          onPress={!isButtonDisabled ? onPress : undefined}
          disabled={isButtonDisabled}
          style={[
            {
              backgroundColor: isButtonDisabled ? colors.disableButton : (color ?? colors.white),
              padding: 10,
              borderRadius: 30,
              justifyContent: 'center',
              minHeight: 48,
            },
            style,
          ]}>
          {renderContent(
            <Text
              style={[
                {
                  color: isButtonDisabled
                    ? colors.disableText
                    : textColor === 'white'
                      ? colors.white
                      : colors.black,
                  textAlign: 'center',
                  fontFamily: 'Switzer',
                  paddingVertical: 6,
                  fontSize: 16,
                },
                textStyle,
              ]}>
              {title}
            </Text>,
          )}
        </TouchableOpacity>
      );
  }
};

export default Button;
