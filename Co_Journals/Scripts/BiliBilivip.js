// ==UserScript==
// @name         Bilibili VIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不给叔叔送钱
// @author       You
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/video/*
// @connect      api.bilibili.com
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==


// 尽早将 __playinfo__ 覆盖, 使 B 站重新请求 playurl API, 不要使用随 HTML 返回的内容
Object.defineProperty(unsafeWindow, '__playinfo__', {
  get: () => undefined
});

Object.defineProperty(unsafeWindow, 'playurlSSRData', {
  get: () => undefined
});

let dataProxy = undefined

Object.defineProperty(unsafeWindow, '__NEXT_DATA__', {
  get: () => dataProxy,
  set: (d) => {
      dataProxy = d
      if (dataProxy.props?.pageProps?.dehydratedState?.queries) {
          dataProxy.props.pageProps.dehydratedState.queries = []
          console.log("queries in __NEXT_DATA__ removed")
      }
      console.log(d)
  }
});


(function() {
  'use strict'
  // 虽然未观察到相关的风控行为, 但推荐同时安装 Adblock 类插件屏蔽跟踪器
  const vip_cookie = GM_getValue("vip_cookie")
  console.log("Use Cookie: " + vip_cookie)

  const promptCookieInput = () => {
      const cookie = prompt("Bilibili 大会员共享:\n请输入一个大会员账号的 Cookie\n(只需要 SESSDATA 部分, 直接复制全部 Cookie 也行)\n" +
                            "该 Cookie 只会用于解析视频的播放地址\n目前已经支持普通视频帧率&画质解锁 + 大会员番剧解锁\n" +
                            "初次设置后可以在油猴插件选项中设置新的 Cookie\n(一般 Cookie 有效期比较久)")
      if (cookie) {
          GM_setValue("vip_cookie", cookie)
      }
      location.reload()
  }

  if (!vip_cookie) {
      promptCookieInput()
      return;
  }

  GM_registerMenuCommand("重设大会员 Cookie", promptCookieInput)

  if (location.href.includes("bangumi/play")) {
      // 隐藏 playerPop 遮盖
      setInterval(() => {
          const node = document.querySelector('div[class^="playerPop"]');
          if (node && node.style.display == '') {
              node.style.display = 'none'
              console.log("Patched playerPop display to none")
          }
      }, 2000)

      // 番剧页面多次切换有 bug, 刷新一下清除状态
      window.addEventListener('locationchange', function (event) {
          // 同一页面不再刷新
          if (event.detail?.origin && event.detail?.origin.match(/bangumi\/play\/ep\d+/)?.[0] !== location.href.match(/bangumi\/play\/ep\d+/)?.[0]) {
              console.log("Refresh page")
              location.reload()
          }
      });
  }

  // 替换 XHR, Hook 相关请求
  const oriGetAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders
  XMLHttpRequest.prototype.getAllResponseHeaders = function(args) {
      return this._headers === undefined ? oriGetAllResponseHeaders.apply(this, args): this._headers
  }

  const oriSend = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function() {
      if (this._url && this._url.includes("playurl") && this._url.startsWith("https://api.bilibili.com")) {
          // 获取播放地址 API, 需要使用大会员 Cookie 进行请求
          console.log('Hook: playurl request')
          console.log(this)
          GM_xmlhttpRequest({
              method: this._method,
              url: this._url,
              anonymous: true, // 不携带原有 Cookie
              headers: {
                  "Cookie": vip_cookie, // 使用大会员 Cookie
                  "Referer": location.href
              },
              onload: (args) => {
                  console.log("Hooked response: ")
                  console.log(args)
                  // 解锁只有大会员才能选择的清晰度选项
                  console.log("Patched response text: " + args.response.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false'))

                  this._headers = args.responseHeaders
                  Object.defineProperty(this, 'readyState', {
                      get: () => args.readyState
                  })
                  Object.defineProperty(this, 'status', {
                      get: () => args.status
                  })
                  Object.defineProperty(this, 'statusText', {
                      get: () => args.statusText
                  })
                  Object.defineProperty(this, 'response', {
                      get: () => args.response.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false')
                  })
                  Object.defineProperty(this, 'responseText', {
                      get: () => args.responseText.replaceAll('"need_login":true', '"need_login":false').replaceAll('"need_vip":true', '"need_vip":false')
                  })

                  console.log(this)

                  this.onloadend?.(args); // 新版页面
                  this.onreadystatechange?.(args); // 旧版页面
              }

          })
      } else if (this._url && this._url.includes("x/player/wbi/v2") && this._url.startsWith("https://api.bilibili.com")) {
          // 获取当前用户 vip 状态的接口, 替换 response 中的 status, 否则普通视频页面不能切换清晰度
          console.log('Hook: wbi request')
          console.log(this)

          const oriLoadEnd = this.onloadend;
          this.onloadend = (args) => {
              console.log('Hooked response:')

              let response = JSON.parse(this.response);
              let responseText = JSON.parse(this.responseText);

              response.data.vip.status = 1;
              responseText.data.vip.status = 1;

              response = JSON.stringify(response)
              responseText = JSON.stringify(responseText)
              console.log(response)

              Object.defineProperty(this, 'response', {
                  get: () => response
              })
              Object.defineProperty(this, 'responseText', {
                  get: () => responseText
              })
              console.log(this)

              oriLoadEnd.apply(this, args)
          }
          oriSend.apply(this, arguments);
      } else {
          oriSend.apply(this, arguments);
      }
  };

  const oriOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function() {
      this._method = arguments[0]
      this._url = arguments[1].startsWith("//") ? ("https:" + arguments[1]) : arguments[1]
      oriOpen.apply(this, arguments)
  };
})();

(() => {
  let oldPushState = history.pushState;
  history.pushState = function pushState() {
      let origin = location.href;
      let ret = oldPushState.apply(this, arguments);
      window.dispatchEvent(new CustomEvent('pushstate', { detail: { origin: origin } }));
      window.dispatchEvent(new CustomEvent('locationchange', { detail: { origin: origin } }));
      return ret;
  };

  let oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
      let origin = location.href;
      let ret = oldReplaceState.apply(this, arguments);
      window.dispatchEvent(new CustomEvent('replacestate', { detail: { origin: origin } }));
      window.dispatchEvent(new CustomEvent('locationchange', { detail: { origin: origin } }));
      return ret;
  };

  window.addEventListener('popstate', () => {
      window.dispatchEvent(new CustomEvent('locationchange'));
  });
})();
