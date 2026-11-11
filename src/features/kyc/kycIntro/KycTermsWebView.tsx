import React, { useState } from 'react';
import { ActivityIndicator, Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import WebView from 'react-native-webview';
import { KYC_PRIVACY_POLICY_URL } from './termsData';

interface KycTermsWebViewProps {
  html: string;
  style: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  privacyPolicyUrl?: string;
  baseUrl?: string;
}

export const KycTermsWebView = ({
  html,
  style,
  showsVerticalScrollIndicator = true,
  privacyPolicyUrl = KYC_PRIVACY_POLICY_URL,
  baseUrl,
}: KycTermsWebViewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[style, { backgroundColor: '#FFFFFF' }]}>
      <WebView
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        source={
          baseUrl ? { html: createTermsHtml(html), baseUrl } : { html: createTermsHtml(html) }
        }
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url === 'about:blank') return true;
          if (request.url.startsWith(privacyPolicyUrl)) {
            void Linking.openURL(privacyPolicyUrl);
            return false;
          }
          // WebView can report the HTML source's base URL as its initial document request.
          // Allow it so the API-provided HTML can render; keep other navigation external/blocked.
          const normalizedBaseUrl = baseUrl?.replace(/\/$/, '');
          const normalizedRequestUrl = request.url.replace(/\/$/, '');
          return Boolean(normalizedBaseUrl && normalizedRequestUrl === normalizedBaseUrl);
        }}
      />
      {isLoading ? <TermsLoader /> : null}
    </View>
  );
};

const TermsLoader = () => (
  <View
    style={[
      StyleSheet.absoluteFillObject,
      {
        backgroundColor: '#FFFFFF',
        zIndex: 1,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    ]}>
    <View style={{ transform: [{ translateY: -200 }] }}>
      <ActivityIndicator size="large" color="#3929CC" />
    </View>
  </View>
);

const createTermsHtml = (content: string) => `
  <!DOCTYPE html>
  <html lang="id">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <style>
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #ffffff; }
        body {
          color: #000000;
          font-family: -apple-system, BlinkMacSystemFont, "Arial", sans-serif;
          font-size: 15px;
          line-height: 1.58;
          padding: 0 24px 24px;
        }
        h2, h3 { color: #202742; line-height: 1.35; }
        h2 { font-size: 20px; margin: 8px 0 18px; }
        h3 { font-size: 15px; margin: 18px 0 10px; }
        p { margin: 0 0 18px; }
        a { color: #3526c7; font-weight: 600; text-decoration: none; }
      </style>
    </head>
    <body>${content}</body>
  </html>
`;
