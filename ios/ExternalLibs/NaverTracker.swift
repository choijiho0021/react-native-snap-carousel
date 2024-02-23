import Foundation

import NTrackerSDKExt

@objc (NaverTracker)
class NaverTracker: NSObject  {
  @objc (configure)
  public static func configure() {
    
//  네이버 전환추적 SDK 적용 Debug 모드 확인 용
//    NTrackerExt.enableDebugLog(true)
//    NTrackerExt.configure(serviceID: "g_4c528f1885cf", phase: .debug)

    NTrackerExt.enableDebugLog(false)
    NTrackerExt.configure(serviceID: "g_4c528f1885cf", phase: .release)
  }

  @objc public static func setInflow(_ url: URL) {
    NTrackerExt.setInflow(url: url)
  }
}
