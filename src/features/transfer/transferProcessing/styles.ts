import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    alignContent: 'center',
    alignItems: 'center', 
    alignSelf: 'center'
  },
  topInfo: {
    alignItems: 'center',
    width: '100%',
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bankLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  bankNameText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    color: '#111827',
  },
  sendToText: {
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 6,
  },
  sendToName: {
    fontFamily: 'Switzer-Bold',
    color: '#000',
  },
  amountText: {
    fontFamily: 'Switzer-Bold',
    fontSize: 40, 
    color: '#000',
  },
  iconVisualContainer: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
    minHeight: 120, 
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  progressLineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2, 
  },
  segmentActive: {
    backgroundColor: '#3475E8', 
  },
  segmentInactive: {
    backgroundColor: '#E5E7EB',
  },
  labelContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  stepLabel: {
    fontFamily: 'Switzer-Medium',
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
  },
  labelActive: {
    color: '#3475E8',
  },
  labelInactive: {
    color: '#9CA3AF',
  },
  statusBadgeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3475E8',
    marginRight: 8,
  },
  statusBadgeText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    color: '#374151',
  },
});