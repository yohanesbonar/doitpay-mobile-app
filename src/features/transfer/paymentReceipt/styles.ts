import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 40,
  },
  curveCutout: {
    position: 'absolute',
    width: width * 2.43,
    height: width * 2.25,
    borderRadius: (width * 2.43) / 2,
    bottom: -width * 2.13,
    backgroundColor: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  resultIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontFamily: 'Switzer-Medium',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  resultAmount: {
    fontFamily: 'Switzer-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    zIndex: 1,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Switzer-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    width: '100%',
  },
  detailLabel: {
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    color: '#111827',
    textAlign: 'right',
    flex: 2,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 100,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    color: '#111827',
  },
  homeButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  homeButtonText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
