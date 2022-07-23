import Foundation
import KakaoSDKCommon
import KakaoSDKLink
import KakaoSDKTemplate

@objc(KakaoShareLink)
class KakaoShareLink: NSObject {

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    public override init() {
        let appKey: String? = Bundle.main.object(forInfoDictionaryKey: "KAKAO_APP_KEY") as? String
   //     KakaoSDKCommon.initSDK(appKey: appKey!)
    }

    private func createExecutionParams(dict: NSDictionary, key: String) -> Dictionary<String, String>? {
        if let dictArr = dict[key] {
            var returnDict: [String: String] = [:]
            for item in (dictArr as! NSArray) {
                if let returnKey = (item as! NSDictionary)["key"], let returnValue = (item as! NSDictionary)["value"] {
                    returnDict[returnKey as! String] = (returnValue as! String)
                }
            }
            return returnDict
        }
        return nil
    }

    private func createURL(dict: NSDictionary, key: String) -> URL? {
        if let value = dict[key] {
            return URL(string: (value as! String))
        }
        return nil
    }

    private func createLink(dict: NSDictionary, key: String) -> Link {
        if let linkDict = dict[key] {
            let lDict = (linkDict as! NSDictionary)
            let webUrl = createURL(dict: lDict, key: "webUrl")
            let mobileWebUrl = createURL(dict: lDict, key: "mobileWebUrl")
            let iosExecutionParams = createExecutionParams(dict: lDict, key: "iosExecutionParams")
            let androidExecutionParams = createExecutionParams(dict: lDict, key: "androidExecutionParams")
            return Link(webUrl: webUrl, mobileWebUrl: mobileWebUrl, androidExecutionParams: androidExecutionParams, iosExecutionParams: iosExecutionParams)
        }
        return Link(webUrl: nil, mobileWebUrl: nil, androidExecutionParams: nil, iosExecutionParams: nil)
    }

    private func createButton(dict: NSDictionary) -> Button {
        let title = dict["title"] != nil ? dict["title"] : ""
        let link = createLink(dict: dict, key: "link")
        return Button(title: (title as! String), link: link)
    }

    private func createButtons(dict: NSDictionary) -> Array<Button>? {
        if let dictArr = dict["buttons"] {
            var buttons: [Button] = []
            for item in (dictArr as! NSArray) {
                buttons.append(createButton(dict: (item as! NSDictionary)))
            }
            return buttons
        }
        return nil
    }

    private func createSocial(dict: NSDictionary) -> Social? {
        if let socialDict = dict["social"] {
            let sDict = socialDict as! NSDictionary
            let commentCount = (sDict["commentCount"] as? Int)
            let likeCount = (sDict["likeCount"] as? Int)
            let sharedCount = (sDict["sharedCount"] as? Int)
            let subscriberCount = (sDict["subscriberCount"] as? Int)
            let viewCount = (sDict["viewCount"] as? Int)
            return Social(likeCount: likeCount, commentCount: commentCount, sharedCount: sharedCount, viewCount: viewCount, subscriberCount: subscriberCount)
        }
        return nil
    }

    private func createContent(dict: NSDictionary) -> Content {
        let title = dict["title"] != nil ? (dict["title"] as! String) : ""
        let imageUrl = dict["imageUrl"] != nil ? createURL(dict: dict, key: "imageUrl")! : URL(string: "http://monthly.chosun.com/up_fd/Mdaily/2017-09/bimg_thumb/2017042000056_0.jpg")!
        let link = createLink(dict: dict, key: "link")
        let description = (dict["description"] as? String)
        let imageWidth = (dict["imageWidth"] as? Int)
        let imageHeight = (dict["imageHeight"] as? Int)
        return Content(title: title, imageUrl: imageUrl, imageWidth: imageWidth, imageHeight: imageHeight, description: description, link: link)
    }

    private func createContents(dictArr: NSArray) -> Array<Content> {
        var contents: [Content] = []
        for item in dictArr {
            contents.append(createContent(dict: (item as! NSDictionary)))
        }
        return contents
    }

    private func createCommerce(dict: NSDictionary) -> CommerceDetail {
        let regularPrice = (dict["regularPrice"] as! Int)
        let discountPrice = (dict["discountPrice"] as? Int)
        let discountRate = (dict["discountRate"] as? Int)
        let fixedDiscountPrice = (dict["fixedDiscountPrice"] as? Int)
        return CommerceDetail(regularPrice: regularPrice, discountPrice: discountPrice, discountRate: discountRate, fixedDiscountPrice: fixedDiscountPrice)
    }

    @objc(sendCustom:withResolver:withRejecter:)
    func sendCustom(dict:NSDictionary,resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
        let templateId = Int64(dict["templateId"] as! Int)
        let templateArgs = createExecutionParams(dict: dict, key: "templateArgs")
        if LinkApi.isKakaoLinkAvailable() == true {
            LinkApi.shared.customLink(templateId: templateId, templateArgs: templateArgs) {(linkResult, error) in
                if let error = error {
                    reject("E_Kakao_Link", error.localizedDescription, nil)
                }
                else {
                    //do something
                    guard let linkResult = linkResult else { return }
                    UIApplication.shared.open(linkResult.url, options: [:], completionHandler: nil)
                    resolve(["result": true])
                }
            }
        } else {
            if let url = LinkApi.shared.makeSharerUrlforCustomLink(templateId: templateId, templateArgs:templateArgs) {
                if UIApplication.shared.canOpenURL(url) {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    resolve(["result": true])
                } else {
                    reject("E_KAKAO_BROWSER_ERROR", "", nil)
                    return
                }
            }

        }
    }
}
