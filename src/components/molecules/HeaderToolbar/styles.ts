import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) => {
    return StyleSheet.create({
        container: {
            backgroundColor: colors.headerBackground,
        },
        contentWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 56,
            paddingHorizontal: 16,
        },
        sectionLeft: {
            flex: 1,
            alignItems: 'flex-start',
        },
        sectionCenter: {
            flex: 4,
            alignItems: 'center',
        },
        sectionRight: {
            flex: 1,
            alignItems: 'flex-end',
        },
        title: {
            fontSize: 18,
            color: colors.text,
            fontFamily: 'Switzer-Medium',
            alignSelf: 'center',
        },
        titleLeft: {
            alignSelf: 'flex-start',
            fontSize: 18,
            color: colors.text,
            fontFamily: 'Switzer-Medium',
        },
        backButton: {
            width: 32,
            height: 32,
        },
        closeButton: {
            width: 32,
            height: 32,
        }
    });
};