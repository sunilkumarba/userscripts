// ==UserScript==
// @name         ProjectFreeTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate user tasks
// @author       You
// @match        https://www.projectfreetv.fun/*
// @icon         https://www.google.com/s2/favicons?domain=projectfreetv.fun
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-idle
// @grant unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  $(function () {
    function enableVideoPlayer() {
      $('.splash-image').remove();
      $('#content-embed').css('display', 'block');

      const hdSourceBtn = $("a[href='#tab1']")[0];
      if(hdSourceBtn) {
        // console.log("HD Source button found. Clicking it...");
        hdSourceBtn.click();
      }
    }

    function triggerBotClick() {
      setTimeout(function() {
        let iframe = $('#tab1 .movieplay iframe')[0];
        // iframe = iframe ? iframe[0] : null;

        console.log('triggerBotClick: iframe found...', iframe);

        if(iframe){
          const innerDoc = $(iframe.contentDocument || iframe.contentWindow.document);
          const imgBotClick = innerDoc('img#bot_click');

          console.log('imgBotClick: ', imgBotClick);

          checkbotclick();
        }
      }, 500);
    }

    function initialize() {
      enableVideoPlayer();
      // triggerBotClick();
    }

    setTimeout(function() {initialize();}, 500);
  });
})();