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
        backgroundColor: '#FFFFFF',
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
        flex: 0,
      }}
      text1Style={{
        fontSize: 15,
        fontFamily: 'Switzer-Regular',
        fontWeight: '400',
        color: '#1A1A1A',
        textAlign: 'center',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
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
        backgroundColor: '#e63946',
      }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingVertical: 12,
        flex: 0,
      }}
      text1Style={{
        fontSize: 15,
        fontFamily: 'Switzer-Regular',
        color: '#FFFFFF',
        fontWeight: '400',
        textAlign: 'center',
        flexWrap: 'wrap',
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: 12,
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
