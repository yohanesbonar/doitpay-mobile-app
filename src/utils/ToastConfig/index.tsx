import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#DCFCE7',
        borderRadius: 100,
        height: 'auto',
        minHeight: 50,

        width: undefined,
        maxWidth: '85%',
        alignSelf: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 45,
      }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        flex: 1,
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Switzer-Regular',
        fontWeight: '400',
        color: '#16A34A',
        textAlign: 'center',
        width: '100%',
      }}
      text1NumberOfLines={3}
      text2Style={{
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Switzer-Regular',
        fontWeight: '400',
        width: '100%',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        borderRadius: 100,
        height: 'auto',
        minHeight: 50,

        width: undefined,
        maxWidth: '85%',
        alignSelf: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 45,
        backgroundColor: '#FFE2E2',
      }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        flex: 1,
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Switzer-Regular',
        color: '#DC2626',
        fontWeight: '400',
        textAlign: 'center',
        width: '100%',
      }}
      text1NumberOfLines={3}
      text2Style={{
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Switzer-Regular',
        fontWeight: '400',
        width: '100%',
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  //   tomatoToast: ({ text1, props }) => (
  //     <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
  //       <Text>{text1}</Text>
  //       <Text>{props.uuid}</Text>
  //     </View>
  //   ),
};
