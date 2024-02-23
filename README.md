# rokebi.client

# iOS Build

1. Build main.jsbundle

```
% npm run build_ios
```

2. Archive in XCode

# Android Build

file name : node_modules/@unimodules/react-native-adapter/android/build.gradle

```
-  compileOnly('com.facebook.react:react-native:+') {
-    exclude group: 'com.android.support'
-  }

+  implementation 'com.facebook.react:react-native:+'
```
