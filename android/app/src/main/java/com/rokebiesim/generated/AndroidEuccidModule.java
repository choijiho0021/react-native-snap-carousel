package com.rokebiesim.generated;

import android.content.Context;
import android.content.pm.FeatureInfo;
import android.os.Build;
import android.telephony.euicc.EuiccManager;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Arrays;

import static android.content.pm.PackageManager.FEATURE_TELEPHONY_EUICC;

public class AndroidEuccidModule extends ReactContextBaseJavaModule {

    AndroidEuccidModule(ReactApplicationContext context){
        super(context);
    }

    @Override
    public String getName() {
        return "AndroidEuccidModule";
    }

    @ReactMethod
    public void isEnableEsim(final Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            EuiccManager mgr = (EuiccManager) getReactApplicationContext().getSystemService(Context.EUICC_SERVICE);
            promise.resolve(mgr.isEnabled());
            return;
        }
        promise.reject("API Version too low : you need to above api version 28");
        return;
    }

    @ReactMethod
    public void getTelephonyFeature(final Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            promise.resolve(getReactApplicationContext().getPackageManager().hasSystemFeature(FEATURE_TELEPHONY_EUICC));
            return;
        }
        promise.reject("API Version too low : you need to above api version 28");
        return;
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void getSystemAvailableFeatures(final Promise promise) {
        FeatureInfo[] featureInfos = getReactApplicationContext().getPackageManager().getSystemAvailableFeatures();

        WritableNativeArray resultData = new WritableNativeArray();
        Arrays.stream(featureInfos).forEach(s->resultData.pushString(s.name));
        promise.resolve(resultData);
        return;
    }
}
