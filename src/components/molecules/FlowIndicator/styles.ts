import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      width: '100%',
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      height: 4, 
    },
    segmentBase: {
      flex: 1, 
      height: '100%',
      backgroundColor: '#E0E0E0', 
      marginHorizontal: 2, 
      borderRadius: 2,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
    },
    stepText: {
      marginLeft: 12,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      fontFamily: "Switzer-Medium",
    },
  });
};
