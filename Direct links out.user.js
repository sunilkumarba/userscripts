// ==UserScript==
// @name        Remove confirm links
// @description Removes all "You are leaving our site" and redirection stuff from links
// @namespace   https://github.com/sunilkumarba/removeConfirmLinks
// @author      Sunil Kumar B A (original: nokeya)
// @version     2.19

// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_getTab
// @grant       GM_getTabs
// @grant       GM_saveTab

//google
// @include     *://google.*
// @include     *://www.google.*
// @include     *://encrypted.google.*

//yandex
// @match       *://yandex.ru/*
// @match       *://yandex.ua/*
// @match       *://yandex.by/*
// @match       *://yandex.kz/*
// @match       *://yandex.com.tr/*
// @match       *://yandex.com/*
// @match       *://*.yandex.ru/*
// @match       *://*.yandex.ua/*
// @match       *://*.yandex.by/*
// @match       *://*.yandex.kz/*
// @match       *://*.yandex.com.tr/*
// @match       *://*.yandex.com/*

//youtube
// @match       *://youtube.com/*
// @match       *://*.youtube.com/*

//wikimapia
// @match       *://wikimapia.org/*

//deviantart
// @match       *://deviantart.com/*
// @match       *://*.deviantart.com/*

//joyreactor
// @match       *://joyreactor.cc/*
// @match       *://*.joyreactor.cc/*
// @match       *://reactor.cc/*
// @match       *://*.reactor.cc/*
// @match       *://joyreactor.com/*
// @match       *://*.joyreactor.com/*

//vk
// @match       *://vk.com/*
// @match       *://*.vk.com/*

//ok
// @match       *://ok.ru/*
// @match       *://*.ok.ru/*

//steam
// @match       *://steamcommunity.com/*
// @match       *://*.steamcommunity.com/*

//fb
// @match       *://facebook.com/*
// @match       *://*.facebook.com/*

//twitter
// @match       *://twitter.com/*
// @match       *://*.twitter.com/*

//4pda
// @match       *://4pda.ru/*
// @match       *://*.4pda.ru/*

//kickass
// @match       *://kat.cr/*
// @match       *://kickassto.co/*
// @match       *://katproxy.is/*
// @match       *://thekat.tv/*
// @match       *://*.kat.cr/*
// @match       *://*.kickassto.co/*
// @match       *://*.katproxy.is/*
// @match       *://*.thekat.tv/*

//AMO
// @match       *://addons.mozilla.org/*

//pixiv
// @match       *://pixiv.net/*
// @match       *://*.pixiv.net/*

//tumblr
// @match       *://tumblr.com/*
// @match       *://*.tumblr.com/*

//danieldefo
// @match       *://danieldefo.ru/*
// @match       *://*.danieldefo.ru/*

//yaplakal
// @match       *://yaplakal.com/*
// @match       *://*.yaplakal.com/*

//soundcloud
// @match       *://soundcloud.com/*
// @match       *://*.soundcloud.com/*

//upwork
// @match       *://upwork.com/*
// @match       *://*.upwork.com/*

//picarto
// @match       *://picarto.tv/*
// @match       *://*.picarto.tv/*

//taker
// @match       *://taker.im/*
// @match       *://*.taker.im/*

//forumavia
// @match       *://*.forumavia.ru/*

//slack
// @match       *://*.slack.com/*

//instagram
// @match       *://instagram.com/*
// @match       *://*.instagram.com/*

// ==/UserScript==
(function () {
  // anchors and functions
  var anchor = null,
    after = null,
    matchName = "Unknown",
    rwLink = function () {},
    rwAll = function () {},
    retTrue = function () {
      return true;
    }; //dummy function to always return true

  // simple rewrite link -  based on anchors
  function rwSimple(link) {
    if (anchor) {
      var ndx = link.href.indexOf(anchor);
      if (ndx != -1) {
        var newlink = link.href.substring(ndx + anchor.length);
        if (after) {
          ndx = newlink.indexOf(after);
          if (ndx != -1) newlink = newlink.substring(0, ndx);
        }
        link.href = unescape(newlink);
      }
    }
  }
  function rwaSimple(node) {
    var links = (node || document).getElementsByTagName("a");
    for (var i = 0; i < links.length; ++i) rwLink(links[i]);
  }
  // vk
  function rwVK(link) {
    if (link.className === "page_media_link_thumb") {
      var parent = link.parentNode;
      link.href = parent.getAttribute("href");
      parent.removeAttribute("href");
      parent.removeAttribute("onclick");
      link.removeAttribute("onclick");
    }

    var ndx = link.href.indexOf(anchor);
    if (ndx != -1) {
      var newlink = link.href.substring(ndx + anchor.length);
      var afterArr = ["&post=", "&el=snippet", "&cc_key="];
      for (var i = 0; i < afterArr.length; ++i) {
        ndx = newlink.indexOf(afterArr[i]);
        if (ndx != -1) newlink = newlink.substring(0, ndx);
      }
      link.href = unescape(newlink);
    }
  }
  // twitter
  function rwTwitter(link) {
    if (link.hasAttribute("data-expanded-url")) {
      link.href = link.getAttribute("data-expanded-url");
      link.removeAttribute("data-expanded-url");
    }
  }
  function rwaTwitter() {
    var links = document.getElementsByClassName("twitter-timeline-link");
    for (var i = 0; i < links.length; ++i) rwLink(links[i]);
  }
  // kickass
  function rwKickass(link) {
    var ndx = link.href.indexOf(anchor);
    if (ndx != -1) {
      link.href = window.atob(
        unescape(link.href.substring(ndx + anchor.length, link.href.length - 1))
      );
      link.className = "";
    }
  }
  // youtube
  function rwYoutube(link) {
    if (/redirect/i.test(link.className)) {
      link.setAttribute("data-redirect-href-updated", "true");
    }

    rwSimple(link);
  }
  // facebook
  function rwFacebook(link) {
    if (/referrer_log/i.test(link.onclick)) {
      link.removeAttribute("onclick");
      link.removeAttribute("onmouseover");
    }
    rwSimple(link);
  }
  // google
  function rwGoogle(link) {
    // replace global rwt script
    if (window.rwt && window.rwt != retTrue) {
      delete window.rwt;
      Object.defineProperty(window, "rwt", { value: retTrue, writable: false });
    }

    // main search
    if (link.hasAttribute("onmousedown")) link.removeAttribute("onmousedown");
    // images
    if (link.hasAttribute("jsaction")) {
      var tmp = link.getAttribute("jsaction");
      if (tmp) {
        link.setAttribute(
          "jsaction",
          tmp.replace(/(mousedown:irc.rl|keydown:irc.rlk)/g, "")
        );
      }
    }
  }

  // yandex
  function rwYandex(link) {
    // main search
    if (link.hasAttribute("onmousedown")) link.removeAttribute("onmousedown");
    // images
    anchor = "&img_url=";
    after = "&pos=";
    rwSimple(link);
  }
  //mozilla addons store
  function rwAMO(link) {
    if (/outgoing.prod.mozaws.net/i.test(link.href)) {
      var tmp = link.href;
      link.href = "#";
      // we have to fight mozilla's replacing of direct redirect string with jquery events
      setTimeout(function () {
        link.href = unescape(
          tmp.replace(
            /(http|https):\/\/outgoing.prod.mozaws.net\/v1\/[0-9a-zA-Z]+\//i,
            ""
          )
        );
      }, 100);
    }
  }

  // danieldefo
  function rwDanielDefo(link) {
    if (link.hasAttribute("data-proxy-href")) {
      link.removeAttribute("data-proxy-href");
    }
  }

  // slack
  function rwSlack(link) {
    link.removeAttribute("onclick");
    link.removeAttribute("onmouseover");
  }

  var confirmationLinkMetas = [
    {
      name: "Google",
      pMatch: /google/i,
      anchor: null,
      after: null,
      replacer: rwGoogle,
    },
    {
      name: "Youtube",
      pMatch: /youtube/i,
      anchor: "redirect?q=",
      after: "&redir_token=",
      replacer: rwYoutube,
    },
    {
      name: "Facebook",
      pMatch: /facebook/i,
      anchor: "u=",
      after: "&h=",
      replacer: rwFacebook,
    },
    {
      name: "Instagram",
      pMatch: /instagram/i,
      anchor: "u=",
      after: "&e=",
      replacer: null,
    },
    {
      name: "Twitter",
      pMatch: /twitter/i,
      anchor: null,
      after: null,
      replacer: rwTwitter,
      replacerAll: rwaTwitter,
    },
    {
      name: "Yandex",
      pMatch: /yandex/i,
      anchor: null,
      after: null,
      replacer: rwYandex,
    },
    {
      name: "VK",
      pMatch: /vk/i,
      anchor: "to=",
      after: null,
      replacer: rwVK,
    },
    {
      name: "OK",
      pMatch: /ok/i,
      anchor: "st.link=",
      after: "&st.name=",
      replacer: null,
    },
    {
      name: "Pixiv",
      pMatch: /pixiv/i,
      anchor: "jump.php?",
      after: null,
      replacer: null,
    },
    {
      name: "Tumblr",
      pMatch: /tumblr/i,
      anchor: "redirect?z=",
      after: "&t=",
      replacer: null,
    },
    {
      name: "Deviantart",
      pMatch: /deviantart/i,
      anchor: "outgoing?",
      after: null,
      replacer: null,
    },
    {
      name: "Steam/Reactor",
      pMatch: /(steam|reactor)/i,
      anchor: "url=",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Kat/Kickass",
      pMatch: /kat|Kickass/i,
      anchor: "confirm/url/",
      after: null,
      replacer: rwKickass,
      replacerAll: null,
    },
    {
      name: "Soundcloud",
      pMatch: /soundcloud/i,
      anchor: "exit.sc/?url=",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Upwork",
      pMatch: /upwork/i,
      anchor: "leaving-odesk?ref=",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "4PDA",
      pMatch: /4pda/i,
      anchor: "go/?u=",
      after: "&e=",
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Mozilla",
      pMatch: /mozilla/i,
      anchor: null,
      after: null,
      replacer: rwAMO,
      replacerAll: null,
    },
    {
      name: "Daniel Defo",
      pMatch: /danieldefo/i,
      anchor: null,
      after: null,
      replacer: rwDanielDefo,
      replacerAll: null,
    },
    {
      name: "Yaplakal",
      pMatch: /yaplakal/i,
      anchor: "go/?",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Wikimapia",
      pMatch: /wikimapia.org/i,
      anchor: "external_link?url=",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Forumavia",
      pMatch: /forumavia.ru/i,
      anchor: "/e/?l=",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Picarto",
      pMatch: /picarto/i,
      anchor: "referrer?go=",
      after: "&ref=",
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Taker",
      pMatch: /taker/i,
      anchor: "phpBB2/goto/",
      after: null,
      replacer: null,
      replacerAll: null,
    },
    {
      name: "Slack",
      pMatch: /slack/i,
      anchor: null,
      after: null,
      replacer: rwSlack,
      replacerAll: null,
    },
  ];

  // determine anchors, functions and listeners
  (function () {
    rwLink = rwSimple;
    rwAll = rwaSimple;

    var loc = window.location.hostname;

    for (
      var clmIdx = 0, clmLen = confirmationLinkMetas.length;
      clmIdx < clmLen;
      clmIdx++
    ) {
      var meta = confirmationLinkMetas[clmIdx];

      if (!meta.pMatch.test(loc)) continue;

      matchName = meta.name;
      anchor = meta.anchor;
      after = meta.after;

      rwLink = meta.replacer || rwLink;
      rwAll = meta.replacerAll || rwAll;
    }

    document.addEventListener(
      "DOMNodeInserted",
      function (event) {
        if (!event || !event.target || !(event.target instanceof HTMLElement)) {
          return;
        }

        var node = event.target;
        if (node instanceof HTMLAnchorElement) rwLink(node);

        rwaSimple(node);
      },
      false
    );

    GM_getTab(function (tab) {
      console.log("GM_getTab: ", tab);

      if (!tab.id)
        GM_saveTab({
          id: parseInt(Math.random() * 100000000),
          name: "Direct links out",
        });
    });

    GM_getTabs(function (tabs) {
      console.log("GM_getTabs: ", tabs);
    });

    GM_registerMenuCommand("More Info", function () {
      GM_getTab(function (tab) {
        console.log("More Info > GM_getTab: ", tab);
      });
    });

    GM_registerMenuCommand("About", function () {
      var ntfCtrl = GM_notification({
        text: "Nothing interesting",
        title: "Direct Links Out",
        image:
          "https://cdn4.iconfinder.com/data/icons/miscellaneous-148-solid/128/link_hyperlink_redirect_attach_separation_connect_join_linkage-512.png",
        silent: false,
        ondone: function () {
          console.log("Notification done.");
        },

        onclick: function () {
          GM_openInTab(
            "https://steamcommunity.com/workshop/browse/?appid=255710",
            false
          );
        },
      });
    });

    GM_registerMenuCommand("Help", function () {
      alert("You have been helped");
    });
  })();

  rwAll();
})();
