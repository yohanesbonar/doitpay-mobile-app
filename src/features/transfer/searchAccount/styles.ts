import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pageBackground,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      padding: 16,
      borderColor: '#619AFF',
      borderWidth: 1,
      borderRadius: 16, 
      backgroundColor: '#FFF'
    },
    listLogoContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    logo: {
      width: 54,
      height: 54,
    },
    textContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontFamily: 'Switzer-Medium',
      color: colors.black,
    },
    accountInfo: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      color: colors.black,
      marginTop: 4,
    },
    listPadding: {
      paddingBottom: 20,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#999',
      fontFamily: 'Switzer-Regular',
    },
    labelInput: {
      fontSize: 14,
      fontFamily: 'Switzer-Regular', 
      color: colors.black,
      marginBottom: 8, 
    },
  });
