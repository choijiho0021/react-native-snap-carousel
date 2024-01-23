/* eslint-disable react-native/no-unused-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {unescape} from 'underscore';
import {View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

type BodyHtmlProps = {
  body: string;
  onMessage: (event: WebViewMessageEvent) => void;
};

const injectedJavaScript = `
  window.ReactNativeWebView.postMessage(
    document.body.scrollHeight.toString()
  );
`;

const BodyHtml: React.FC<BodyHtmlProps> = ({body, onMessage}) => {
  const ref = useRef<WebView>(null);
  const injected = useRef(false);
  const [webviewHeight, setWebviewHeight] = useState(300);

  const unescapedBody = useMemo(
    () => unescape(body?.replace(/<br \/>/g, '')),
    [body],
  );

  const html = useMemo(
    () => `
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
    <style>

    html,
    body {
      position: static;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -webkit-text-size-adjust: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
    }
    body {
      color: #2c2c2c;
      font-weight: 400;
      font-size: 14px;
      font-family: Pretendard, sans-serif;
      word-break: keep-all;
    }
    body,
    div,
    p,
    dl,
    dt,
    dd,
    ul,
    ol,
    li,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    table,
    th,
    td,
    pre,
    form,
    fieldset,
    legend,
    input,
    textarea,
    button,
    select,
    blockquote,
    strong {
      margin: 0;
      padding: 0;
      font-weight: 400;
      font-family: Pretendard, sans-serif;
    }
    input,
    textarea,
    select,
    button,
    td,
    th,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #2c2c2c;
      font-size: 14px;
      font-family: Pretendard, sans-serif;
      outline: none;
    }
    img,
    fieldset,
    button,
    iframe {
      border: 0 none;
    }
    dl,
    ul,
    ol,
    menu,
    li {
      list-style: none;
    }
    blockquote,
    q {
      quotes: none;
    }
    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
      content: '';
      content: none;
    }
    address,
    caption,
    cite,
    code,
    dfn,
    em,
    var {
      font-style: normal;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }
    hr {
      display: none;
    }
    caption {
      width: 0;
      height: 0;
      font-size: 0;
      line-height: 0;
      visibility: hidden;
    }
    legend {
      position: absolute;
      top: -1000em;
      left: 0;
      display: block;
      overflow: hidden;
      visibility: hidden;
    }
    button {
      background-color: transparent;
      border: 0 none;
    }
    img {
      vertical-align: top;
    }
    a {
      display: inline-block;
      color: #2c2c2c;
      text-decoration: none;
    }
    a:hover,
    a:link,
    a:visited,
    a:active,
    a:focus {
      text-decoration: none;
    }
    input[type='text'],
    input[type='password'],
    input[type='submit'],
    input[type='search'],
    input {
      border-radius: 0;
      -webkit-appearance: none !important;
    }
    input:checked[type='checkbox'] {
      -webkit-appearance: checkbox;
    }
    button,
    input[type='button'],
    input[type='submit'],
    input[type='reset'],
    input[type='file'] {
      border-radius: 0;
      -webkit-appearance: button;
    }

    .wrap_data .txt_dot {
      padding-left: 18px;
      color: #777;
      font-size: 14px;
      line-height: 18px;
    }
    .wrap_data .txt_dot:before {
      display: inline-block;
      clear: both;
      width: 12px;
      margin-left: -12px;
      color: #2c2c2c;
      content: '•';
    }
    .wrap_data .txt_dot em {
      color: #2c2c2c;
      font-weight: 500;
    }
    
    .wrap_data .apn_box {
      background-color: #fff;
    }
    .wrap_data .box_info_frame {
      padding: 48px 12px 10px;
      background-color: #f4f9fe;
    }
    
    .wrap_data .box_info_frame .box_info {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
    .wrap_data .box_info_frame .charge_empty {
      width: 100%;
      height: 38px;
    }
    
    .wrap_data .box_info_frame .box_info .box_icon_text {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      width: 107px;
    }
    .wrap_data .box_info_frame .box_info .box_icon_text .box_icon {
      width: 32px;
      height: 32px;
    }
    .wrap_data .box_info_frame .box_info .box_icon_text .box_text {
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      text-align: center;
    }
    
    .wrap_data .box_info_frame .box_info .box_charge_icon_text {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      width: 107px;
      cursor: pointer;
    }
    
    .wrap_data .box_info_frame .box_info .box_charge_icon_text .box_icon {
      width: 32px;
      height: 32px;
    }
    
    .wrap_data .box_info_frame .box_info .box_charge_icon_text .charge_text_info .charge_text {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }
    
    .wrap_data .box_info_frame .box_info .box_charge_icon_text .charge_text_info .charge_info {
      width: 21px;
      height: 20px;
      margin-left: 4px;
    }
    
    .wrap_data .box_info_frame .box_info .box_charge_icon_text .charge_info_open {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px 8px;
      background-color: #ffffff;
      border: 1px solid #daeeff;
      border-radius: 3px;
    }
    .wrap_data .box_info_frame .box_info .box_charge_icon_text .charge_info_open .charge_info_detail {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;
    }
    
    .wrap_data
      .box_info_frame
      .box_info
      .box_charge_icon_text
      .charge_info_open
      .charge_info_detail
      .charge_info_detail_icon {
      width: 12px;
      height: 12px;
      margin-left: 4px;
    }
    .wrap_data .box_info2 {
      padding: 48px 20px 0 20px;
    }
    .wrap_data .box_info2 .stit {
      margin-bottom: 16px;
      font-weight: 500;
      font-size: 20px;
      line-height: 22px;
    }
    .wrap_data .box_info2 .info {
      box-sizing: border-box;
      margin-bottom: 16px;
      padding: 20px 20px 18px 20px;
      border: 1px solid #d8d8d8;
      border-radius: 3px;
    }
    .wrap_data .box_info2 .info:after {
      display: block;
      clear: both;
      content: '';
    }
    .wrap_data .box_info2 .info dt {
      margin-bottom: 4px;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
    }
    .wrap_data .box_info2 .info dd {
      float: left;
      margin-right: 8px;
      color: #2a7ff6;
      font-size: 16px;
      line-height: 22px;
    }
    .wrap_data .box_info2 .info2 {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 80px;
      margin-bottom: 16px;
      padding: 18px 20px 18px 20px;
      font-weight: 600;
      font-size: 16px;
      text-align: left;
      border: 1px solid #d8d8d8;
      border-radius: 3px;
    }
    .wrap_data .box_info2 .info2 .txt_detail {
      float: right;
      color: #2a7ff6;
      font-weight: 500;
      font-size: 14px;
    }
    .wrap_data .box_info2 .info2 .txt_detail:hover {
      cursor: pointer;
    }
    .wrap_data .box_info2 .info2 .txt_detail:after {
      display: inline-block;
      clear: both;
      width: 10px;
      height: 10px;
      margin-left: 4px;
      background: url('https://esim.rokebi.com/sites/default/files/webViewImg/icon_arrow_right_blue.png') no-repeat 50% 50%;
      background-size: cover;
      content: '';
    }
    .wrap_data .box_info2 .txt_dot {
      margin-bottom: 6px;
    }
    .wrap_data .box_set {
      margin: 56px 20px 0 20px;
      overflow: hidden;
      border-radius: 3px;
    }
    .wrap_data .box_set .stit {
      height: 50px;
      color: #fff;
      font-weight: 400;
      font-size: 18px;
      line-height: 50px;
      background-color: #4455f5;
    }
    .wrap_data .box_set .stit:before {
      display: inline-block;
      clear: both;
      width: 18px;
      height: 18px;
      margin: 0 8px 0 20px;
      vertical-align: middle;
      background: url('https://esim.rokebi.com/sites/default/files/webViewImg/icon_apn.png') no-repeat 0 0;
      background-size: cover;
      content: '';
    }
    .wrap_data .box_set .code_area {
      margin-bottom: 16px;
      padding: 5px 20px 5px 0px;
      background-color: white;
      border: 1px solid #d8d8d8;
      border-top: 0 none;
    }
    .wrap_data .box_set .code_area:has(> div.item) {
      background-color: #f5f5f5;
    }
    .wrap_data .box_set .code_area .item {
      position: relative;
      margin-bottom: 10px;
      margin-left: 20px;
    }
    .wrap_data .box_set .code_area .item .code {
      display: flex;
      margin-top: 15px;
    }
    .wrap_data .box_set .code_area .btn_copy {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      width: 62px;
      height: 40px;
      color: #2c2c2c;
      font-weight: 500;
      font-size: 14px;
      line-height: 38px;
      text-align: center;
      background-color: #fff;
      border: 1px solid #d8d8d8;
      border-radius: 3px;
    }
    .wrap_data .box_set .code_area .btn_copy:hover {
      cursor: pointer;
    }
    .wrap_data .box_set .code_area .btn_copy:active,
    .wrap_data .box_set .code_area .btn_copy.select {
      color: #2a7ff6;
      border-color: #2a7ff6;
    }
    .wrap_data .box_set .code {
      position: relative;
      padding: 9px 0 16px 0;
      font-size: 16px;
    }
    .wrap_data .box_set .code:after {
      display: block;
      clear: both;
      content: '';
    }
    .wrap_data .box_set .code dt {
      color: #777;
    }
    .wrap_data .box_set .code dd {
      margin-left: 4px;
      color: #2c2c2c;
      font-weight: bold;
      font-size: 16px;
      word-break: break-all;
    }
    .wrap_data .box_set .code dd .txt {
      float: left;
      box-sizing: border-box;
      height: 100%;
      border-bottom: 1px solid #2c2c2c;
    }
    .wrap_data .set_type2 .stit {
      background-color: #8f1ff1;
    }
    .wrap_data .code_area .btn_apn {
      display: block;
      padding: 20px;
      color: #2c2c2c;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    }
    .wrap_data .code_area .btn_apn:hover {
      cursor: pointer;
    }
    .wrap_data .code_area .btn_apn:after {
      position: absolute;
      top: calc(50% - 5px);
      right: 20px;
      display: block;
      clear: both;
      width: 10px;
      height: 10px;
      background: url('https://esim.rokebi.com/sites/default/files/webViewImg/icon_arrow_right_black.png') no-repeat 50% 50%;
      background-size: cover;
      content: '';
    }
    .wrap_data .code_area {
      position: relative;
      background-color: #fff;
    }
    .box_notandum {
      margin-top: 56px;
      padding: 0 20px 56px 20px;
      background-color: #f5f5f5;
    }
    .box_notandum .stit {
      padding: 40px 0 24px 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 22px;
    }
    .box_notandum dl {
      margin-bottom: 26px;
      color: #777;
      font-size: 14px;
      line-height: 20px;
    }
    .box_notandum dl dt {
      margin-bottom: 2px;
      color: #2c2c2c;
      font-weight: 500;
    }
    .box_notandum dl em {
      color: #2c2c2c;
      font-weight: 600;
    }
    .btn_bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #fff;
    }
    .btn_bottom a {
      float: left;
      width: 50%;
      height: 52px;
      font-weight: 500;
      font-size: 18px;
      line-height: 52px;
      text-align: center;
      border-top: 1px solid #d8d8d8;
    }
    .btn_bottom a:active {
      background-color: #f5f5f5;
    }
    .btn_bottom a:nth-child(2) {
      color: #fff;
      background-color: #2a7ff6;
      border-top: 1px solid #2a7ff6;
    }
    .btn_bottom a:nth-child(2):active {
      background-color: #4f99ff;
    }
    .modal_title {
      margin-bottom: 40px;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
    }
    .modal_text {
      overflow: scroll;
      font-size: 14px;
    }
    
    </style>
    </head>
    
    <body>
    <div class="wrap_data">
    ${unescapedBody}
    </div>
    </body>
    </html>
`,
    [unescapedBody],
  );

  const calcHeight = useCallback((event: WebViewMessageEvent) => {
    const height = parseInt(event.nativeEvent.data, 10);
    setWebviewHeight(height);
  }, []);

  const onLoadEnd = useCallback(() => {
    if (!injected.current) {
      ref.current?.injectJavaScript(injectedJavaScript);
      injected.current = true;
    }
  }, []);

  return (
    <View style={{height: webviewHeight}} renderToHardwareTextureAndroid>
      <WebView
        ref={ref}
        javaScriptEnabled
        scrollEnabled={false}
        onMessage={(e) => {
          if (webviewHeight === 300) {
            calcHeight(e);
          }
          onMessage(e);
        }}
        onLoadEnd={onLoadEnd}
        originWhitelist={['*']}
        source={{html}}
        style={{flex: 1}}
      />
    </View>
  );
};

export default BodyHtml;
