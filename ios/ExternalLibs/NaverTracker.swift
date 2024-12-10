import Foundation
import NTrackerSDKExt

@objc(NaverTracker) // React Native 모듈 이름
class NaverTracker: NSObject {

  @objc (configure)
  public static func configure() {
    // 네이버 전환추적 SDK 적용 Debug 모드 확인 용
    // NTrackerExt.enableDebugLog(true)
    NTrackerExt.enableDebugLog(false)
    NTrackerExt.configure(serviceID: "g_4c528f1885cf", phase: .release)
  }

  @objc public static func setInflow(_ url: URL) {
    NTrackerExt.setInflow(url: url)
  }

  @objc
  func trackPurchaseEvent(
      _ amount: NSNumber,
      items: [[String: Any]],
      resolver: @escaping RCTPromiseResolveBlock,
      rejecter: @escaping RCTPromiseRejectBlock
  ) {
      print("Amount: \(amount)")
      print("Items: \(items)")
      
      do {
          // items를 [NTrackerConversionItem]로 변환
          let convertedItems: [NTrackerConversionItem] = try items.map { item in
              guard
                  let quantity = item["quantity"] as? Int,
                  let payAmount = item["payAmount"] as? Double,
                  let id = item["id"] as? String,
                  let name = item["name"] as? String,
                  let category = item["category"] as? String
              else {
                  throw NSError(domain: "InvalidItemFormat", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid item format"])
              }
              return NTrackerConversionItem(
                  quantity: quantity,
                  payAmount: payAmount,
                  id: id,
                  name: name,
                  category: category
              )
          }
          
          // NTrackerExt 호출
          NTrackerExt.trackPurchaseEvent(value: amount.doubleValue, items: convertedItems)
          
          // 성공 응답
          let successResponse = ["status": "success", "amount": amount] as [String: Any]
          resolver(successResponse)
          
      } catch let error {
          // 에러 응답
          rejecter("TRACK_PURCHASE_ERROR", "Failed to track purchase event", error)
      }
  }
    
//    @objc
//    static func requiresMainQueueSetup() -> Bool {
//      return false
//    }
  

}
