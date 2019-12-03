# rokebi.client

# Android Build

 file name : node_modules/@unimodules/react-native-adapter/android/build.gradle

```
-  compileOnly('com.facebook.react:react-native:+') {
-    exclude group: 'com.android.support'
-  }

+  implementation 'com.facebook.react:react-native:+'
```
