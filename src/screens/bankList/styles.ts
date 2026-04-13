import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pageBackground,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      margin: 16,
      paddingHorizontal: 12,
      height: 50,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 16,
      marginBottom: 15,
      fontFamily: "Switzer-Regular"
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
    },
    gridBox: {
      width: '21%',
      aspectRatio: 1,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: "#FFF",
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      margin: '2%',
    },
    selectedBox: { borderColor: '#4A80F0', borderWidth: 2 },
    logoGrid: { width: '80%', height: '80%' },
    listPadding: { paddingBottom: 100 },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    listLogoContainer: {
      width: 64,
      height: 64,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: "#FFF",
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    logoList: { width: 30, height: 30 },
    listText: { fontSize: 16, fontWeight: '400', fontFamily: "Switzer-Regular" },
    footer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingBottom: 22,
      paddingTop: 22, 
      paddingHorizontal: 24,
      backgroundColor: "#FFF"
    },
    skipButton: {
      height: 55,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    skipText: { fontSize: 16, fontWeight: '600', color: '#000' },
  });
};
