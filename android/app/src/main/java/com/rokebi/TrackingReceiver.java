package com.rokebi;

import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.microsoft.appcenter.AppCenter;
import com.microsoft.appcenter.analytics.Analytics;
import com.microsoft.appcenter.crashes.Crashes;

import java.util.HashMap;
import java.util.Map;

//PlayStore에서 유입되는 경로 파악
public class TrackingReceiver extends BroadcastReceiver implements InstallReferrerStateListener {

    protected static final String LOG_TAG = TrackingReceiver.class.getSimpleName();

    private InstallReferrerClient referrerClient;

    @Override
    public void onReceive(Context context, Intent intent) {

        if(intent.getAction() != null) {
            if(intent.getAction().equals(Intent.ACTION_PACKAGE_FIRST_LAUNCH)) {
                this.referrerClient = InstallReferrerClient.newBuilder(context).build();
                this.referrerClient.startConnection(this);
            }
        }
    }

    @Override
    public void onInstallReferrerSetupFinished(int responseCode) {
        switch (responseCode) {
            case InstallReferrerClient.InstallReferrerResponse.OK:
                Log.d(LOG_TAG, "InstallReferrer Response.OK");
                try {
                    ReferrerDetails response = referrerClient.getInstallReferrer();
                    String referrer = response.getInstallReferrer();

                    Map<String, String> properties = new HashMap<>();
                    properties.put("유입경로", referrer);

                    Analytics.trackEvent("유입경로",properties);

                    Log.d(LOG_TAG, "InstallReferrer " + referrer);
                    referrerClient.endConnection();
                } catch (RemoteException e) {
                    Log.e(LOG_TAG, "" + e.getMessage());
                }
                break;
            case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                Log.w(LOG_TAG, "InstallReferrer Response.FEATURE_NOT_SUPPORTED");
                break;
            case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                Log.w(LOG_TAG, "InstallReferrer Response.SERVICE_UNAVAILABLE");
                break;
            case InstallReferrerClient.InstallReferrerResponse.SERVICE_DISCONNECTED:
                Log.w(LOG_TAG, "InstallReferrer Response.SERVICE_DISCONNECTED");
                break;
            case InstallReferrerClient.InstallReferrerResponse.DEVELOPER_ERROR:
                Log.w(LOG_TAG, "InstallReferrer Response.DEVELOPER_ERROR");
                break;
        }
    }

    @Override
    public void onInstallReferrerServiceDisconnected() {
        Log.w(LOG_TAG, "InstallReferrer onInstallReferrerServiceDisconnected()");
    }
}
