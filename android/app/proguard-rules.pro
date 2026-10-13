# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native native modules and JNI bridge
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# This app's native modules (accessed via RN bridge/reflection)
-keep class co.doitpay.app.** { *; }

# Firebase / Google (crash reporting, messaging, remote config)
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**

# Notifee
-keep class io.invertase.notifee.** { *; }

# react-native-config (BuildConfig field access via reflection)
-keep class co.doitpay.app.BuildConfig { *; }
