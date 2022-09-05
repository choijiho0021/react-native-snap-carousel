package com.rokebiesim;
import androidx.annotation.NonNull;

        import com.facebook.react.bridge.Promise;
        import com.facebook.react.bridge.ReactApplicationContext;
        import com.facebook.react.bridge.ReactContextBaseJavaModule;
        import com.facebook.react.bridge.ReactMethod;
        import com.kakao.util.exception.KakaoException;
        import com.kakao.plusfriend.PlusFriendService;

public class KakaoChannel extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public KakaoChannel(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "KakaoChannel";
    }

    @ReactMethod
    public void addFriend(final String plusFriendId, final Promise promise) {
        try {
            PlusFriendService.getInstance().addFriend(this.getCurrentActivity(), plusFriendId);
            promise.resolve("SUCCESS");
        } catch (KakaoException e) {
            promise.reject("KakaoChannel", e.toString());
        }
    }

    @ReactMethod
    public void chat(final String plusFriendId, final Promise promise){
        try {
            PlusFriendService.getInstance().chat(this.getCurrentActivity(), plusFriendId);
            promise.resolve("SUCCESS");
        } catch (KakaoException e) {
            promise.reject("KakaoChannel", e.toString());
        }
    }
}
