import { Platform, StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    outerContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    tabBarContainer: {
      flexDirection: 'row',
      height: 90,
      paddingBottom: Platform.OS === 'ios' ? 28 : 16,
      borderTopWidth: 1,
      borderTopColor: '#F2F2F2',
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      paddingHorizontal: 10,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      flex: 1,
    },
    label: {
      fontSize: 15,
      marginTop: 4,
      fontFamily: 'Switzer-Regular',
    },
    fabButton: {
      position: 'absolute',
      top: -34,
      alignSelf: 'center',
      elevation: Platform.OS === 'ios' ? 8 : 0,
      // shadowColor: '#2F6BFF',
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.3,
      // shadowRadius: 6,
      zIndex: 99,
    },
    fabInner: {
      width: 67,
      height: 67,
      borderRadius: 44,
      backgroundColor: '#3981FF',
      justifyContent: 'center',
      alignItems: 'center',
      // elevation: 1,
      // shadowColor: '#2F6BFF',
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.3,
      // shadowRadius: 6,
    },
    fabText: {
      color: '#FFF',
      fontSize: 15,
      marginTop: 2,
      fontFamily: 'Switzer-Medium',
    },
  });
};
