package com.rokebiesim;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.navercorp.ntracker.ntrackersdk.NTrackerConversionItem;
import com.navercorp.ntracker.ntrackersdk.NTrackerExt;

import java.util.ArrayList;
import java.util.List;

class NTrackerModule extends ReactContextBaseJavaModule {

    public NTrackerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "NaverTracker";
    }

    @ReactMethod
    public void trackPurchaseEvent(int amount, ReadableArray items, Promise promise) {
        try {
            // ReadableArray -> List<NTrackerConversionItem> 변환
            List<NTrackerConversionItem> conversionItems = new ArrayList<>();
            for (int i = 0; i < items.size(); i++) {
                ReadableMap itemMap = items.getMap(i);
                if (itemMap != null) {
                    // 필요한 필드 추출
                    String id = itemMap.getString("id");
                    String name = itemMap.getString("name");
                    int quantity = itemMap.getInt("quantity");
                    double payAmount = itemMap.getDouble("payAmount");

                    // NTrackerConversionItem 생성
                    NTrackerConversionItem item = new NTrackerConversionItem(
                            quantity, payAmount, id, name,
                            itemMap.getString("category"),
                            itemMap.getString("option"),
                            itemMap.getString("ext1"),
                            itemMap.getString("ext2")
                    );
                    conversionItems.add(item);
                }
            }

            // List<NTrackerConversionItem> -> NTrackerConversionItem[] 변환
            NTrackerConversionItem[] conversionItemsArray = conversionItems.toArray(new NTrackerConversionItem[0]);

            // NTrackerExt 호출: NTrackerConversionItem[] 배열 전달
            NTrackerExt.trackPurchaseEvent(amount, conversionItemsArray);

            // 성공 시 resolve
            promise.resolve("Event tracked successfully");
        } catch (Exception e) {
            // 실패 시 reject
            promise.reject("TRACK_ERROR", e.getMessage());
        }
    }
}
