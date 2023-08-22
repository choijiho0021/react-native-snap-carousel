package com.rokebiesim;

import android.app.Activity;
import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.RemoteException;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.reactnativegooglesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.lugg.RNCConfig.RNCConfigPackage;
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
// import com.horcrux.svg.SvgPackage;
import com.adjust.nativemodule.AdjustPackage;
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
import cl.json.RNSharePackage;
//import com.tkporter.sendsms.SendSMSPackage;
import com.adjust.nativemodule.AdjustPackage;
import com.reactnativesimcardsmanager.SimCardsManagerPackage;
import com.github.amarcruz.rnshortcutbadge.RNAppBadgePackage;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.rokebiesim.generated.EuccidManagerAppPackage;
import com.rokebiesim.generated.FetchApiClientFactory;
import com.zoontek.rnpermissions.RNPermissionsPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.rokebiesim.newarchitecture.MainApplicationReactNativeHost;
import com.horcrux.svg.SvgPackage;
import com.microsoft.appcenter.AppCenter;
import com.microsoft.appcenter.analytics.Analytics;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.zoontek.rnlocalize.RNLocalizePackage;
import com.reactnativecommunity.clipboard.ClipboardPackage;
import com.ninty.system.setting.SystemSettingPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import com.zoyi.channel.plugin.android.ChannelIO;
import com.zoyi.channel.rn.RNChannelIOPackage;

//import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
//
//import io.actbase.kakaosdk.channel.ARNKakaoChannelPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.dynamiclinks.ReactNativeFirebaseDynamicLinksPackage;

import com.facebook.flipper.reactnative.FlipperPackage;
//import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.reactnativecommunity.cookies.CookieManagerPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;

import com.reactnativepagerview.PagerViewPackage;

import com.navercorp.ntracker.ntrackersdk.NTrackerExt;
import com.navercorp.ntracker.ntrackersdk.NTrackerPhase;

public class MainApplication extends Application implements ReactApplication {

    public SharedPreferences prefs;

//    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
//            new BasePackageList().getPackageList(), Arrays.<SingletonModule>asList()
//    );


    private final void getReferrer() {
        //referrer 유입경로 확인 코드
        InstallReferrerClient referrerClient;

        referrerClient = InstallReferrerClient.newBuilder(this).build();
        referrerClient.startConnection(new InstallReferrerStateListener() {
            @Override
            public void onInstallReferrerSetupFinished(int responseCode) {

                Map<String, String> properties = new HashMap<>();

                switch (responseCode) {
                    case InstallReferrerClient.InstallReferrerResponse.OK:
                        // Connection established.

                        ReferrerDetails response = null;
                        try {
                            response = referrerClient.getInstallReferrer();
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        }
                        String referrerUrl = response.getInstallReferrer();
//                        long referrerClickTime = response.getReferrerClickTimestampSeconds();
//                        long appInstallTime = response.getInstallBeginTimestampSeconds();

                        properties.put("유입경로", referrerUrl);

                        Analytics.trackEvent("유입경로", properties);

                        break;
                    case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                        // API not available on the current Play Store app.
                        properties.put("유입경로 TEST", "FEATURE_NOT_SUPPORTED");

                        Analytics.trackEvent("유입경로", properties);

                        break;
                    case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                        // Connection couldn't be established.
                        properties.put("유입경로", "SERVICE_UNAVAILABLE");

                        Analytics.trackEvent("유입경로", properties);
                        break;
                }
            }

            @Override
            public void onInstallReferrerServiceDisconnected() {
                // Try to restart the connection on the next request to
                // Google Play by calling the startConnection() method.
            }


        });

        prefs.edit().putBoolean("isFirstRun", false).apply();
    }

    private final ReactNativeHost mReactNativeHost =
            new DefaultReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    return Arrays.<ReactPackage>asList(
                            new MainReactPackage(),
            new RNGoogleSigninPackage(),
            new FBSDKPackage(),
            new RNCConfigPackage(),
            new LottiePackage(),
            new RNChannelIOPackage(),
            // new GoogleFitPackage(BuildConfig.APPLICATION_ID),
            new AdjustPackage(),
            new RNSharePackage(),
            new CameraRollPackage(),
            new RNViewShotPackage(),
                            new LinearGradientPackage(),
                            new SystemSettingPackage(),
                            new RNAppBadgePackage(),
                            new EuccidManagerAppPackage(),
                            new ReactNativeFirebaseAppPackage(),
                            new ReactNativeFirebaseDynamicLinksPackage(),
                            new RNPermissionsPackage(),
                            new RNScreensPackage(),
                            new RNDeviceInfo(),
                            new SafeAreaContextPackage(),
                            new AsyncStoragePackage(),
                            new ClipboardPackage(),
                            new SvgPackage(),
                            new PickerPackage(),
                            new AppCenterReactNativeCrashesPackage(getApplication(), getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
                            new AppCenterReactNativeAnalyticsPackage(getApplication(), getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
                            new AppCenterReactNativePackage(getApplication()),
                            new RNVersionCheckPackage(),
                            new CodePush(getResources().getString(com.rokebiesim.R.string.CodePushDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
//                            new RNCameraPackage(),
                            new ReactVideoPackage(),
                            new RNGestureHandlerPackage(),
                            new RNCWebViewPackage(),
                            new RNLocalizePackage(),
                            new RNFetchBlobPackage(),
                            new SimCardsManagerPackage(),
                            new MyAppPackage(),
                            new ReactNativeFirebaseMessagingPackage(),
                            new FlipperPackage(),
                            new PagerViewPackage(),
                            new RNCPickerPackage(),
                            new ReactNativeFirebaseAnalyticsPackage(),
                            new CookieManagerPackage()

                    );
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected boolean isNewArchEnabled() {
                    return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                }
                @Override
                protected Boolean isHermesEnabled() {
                    return BuildConfig.IS_HERMES_ENABLED;
                }

                @Override
                protected String getJSBundleFile() {
                    return CodePush.getJSBundleFile();
                }
            };
       
    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }



    @Override
    public void onCreate() {
        super.onCreate();
        // If you opted-in for the New Architecture, we enable the TurboModule system
        ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        SoLoader.init(this, /* native exopackage */ false);
        AppCenter.start(this, "ff7d5d5a-8b74-4ec2-99be-4dfd81b4b0fd", Analytics.class);
        createNotificationChannel(this);
        OkHttpClientProvider.setOkHttpClientFactory(new FetchApiClientFactory());
        prefs = getSharedPreferences("Pref", MODE_PRIVATE);

        ChannelIO.initialize(this);

        if (BuildConfig.DEBUG || BuildConfig.NODE_ENV == "development") {
            NTrackerExt.enableDebugLog(true);
            NTrackerExt.configure(getApplicationContext(), "g_88dbc8a6743d5", NTrackerPhase.DEBUG);
        } else {
            NTrackerExt.configure(getApplicationContext(), "g_88dbc8a6743d5", NTrackerPhase.RELEASE);
        }




        boolean isFirstRun = prefs.getBoolean("isFirstRun", true);
        if (isFirstRun) {
            getReferrer();
        }
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel("rokebi-android", "MainChannel", NotificationManager.IMPORTANCE_HIGH);
            notificationChannel.setShowBadge(true);
            notificationChannel.setDescription("AOS Android push noti channel");
            notificationChannel.enableVibration(true);
            notificationChannel.enableLights(true);
            notificationChannel.setVibrationPattern(new long[]{400, 200, 400});
            //notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            NotificationManager manager = getSystemService(NotificationManager.class);

            manager.createNotificationChannel(notificationChannel);
        }
    }
}