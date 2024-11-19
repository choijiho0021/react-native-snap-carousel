package com.rokebiesim;

import android.content.Context;
import android.media.AudioManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AudioStreamModule extends ReactContextBaseJavaModule {

    private final AudioManager audioManager;

    // ReactApplicationContext를 생성자로 받음
    public AudioStreamModule(ReactApplicationContext reactContext) {
        super(reactContext); // 상위 클래스 생성자 호출
        audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
    }

    @Override
    public String getName() {
        return "AudioStreamModule";
    }

    @ReactMethod
    public void setMediaStream() {
        audioManager.setMode(AudioManager.MODE_NORMAL); // 일반 모드 설정
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC,
                audioManager.getStreamVolume(AudioManager.STREAM_MUSIC),
                0);
    }
}
