import React, { ReactNode, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes';

export const WebViewContainer: React.FC<{
  source: string;
  isHtml?: boolean;
  title?: string;
  border?: boolean;
  leftButtonOnPress?: () => void;
  /**
   * Custom handling of any web view requests.
   * {@link https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md#onshouldstartloadwithrequest See docs.}
   * @type {OnShouldStartLoadWithRequest}
   */
  onShouldStartLoadWithRequest?: OnShouldStartLoadWithRequest;
  noSafeAreaBottom?: boolean;
  noPaddingBottom?: boolean;
  minHeight?: number;
  header?: ReactNode;
}> = ({
  isHtml,
  source,
  title,
  border,
  onShouldStartLoadWithRequest,
  leftButtonOnPress,
  noSafeAreaBottom,
  noPaddingBottom,
  minHeight = 800,
  header,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View
      style={{
        borderWidth: 1,
        flex: 1,
        minHeight,
        borderColor: border ? '#E5E5E5' : 'transparent',
      }}>
      {header}
      <WebView
        source={isHtml ? { html: source } : { uri: source }}
        originWhitelist={['*']}
        onLoad={() => setLoading(false)}
        javaScriptEnabled
        javaScriptCanOpenWindowsAutomatically
        domStorageEnabled
        cacheEnabled
        cacheMode="LOAD_NO_CACHE"
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        style={{ flex: 1 }}
        nestedScrollEnabled
      />
    </View>
  );
};
