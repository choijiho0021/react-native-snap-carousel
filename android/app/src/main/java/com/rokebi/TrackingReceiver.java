package com.rokebi;

import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.microsoft.appcenter.AppCenter;
import com.microsoft.appcenter.analytics.Analytics;
import com.microsoft.appcenter.crashes.Crashes;

import java.util.HashMap;
import java.util.Map;

//PlayStore에서 유입되는 경로 파악
public class TrackingReceiver extends BroadcastReceiver {

    private static String referrer = "";

    @Override
    public void onReceive(Context context, Intent intent) {

        Bundle extras = intent.getExtras();

        if (extras != null) {

            referrer = extras.getString("referrer");

            Map<String, String> properties = new HashMap<>();
            properties.put("유입경로", referrer);

            Analytics.trackEvent("유입경로",properties);
        }
    }
}
