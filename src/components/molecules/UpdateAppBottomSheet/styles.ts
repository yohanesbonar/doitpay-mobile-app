import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 99999,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    marginBottom: 42,
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 999,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Switzer-Medium',
  },
});
