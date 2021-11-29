// ==UserScript==
// @name         Bask Learn
// @namespace    basklearn.me
// @version      0.1
// @description  Learning userscript
// @author       Sunil Kumar B A
// @match        *://greasyfork.org/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://kit.fontawesome.com/36cdf20281.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// ==/UserScript==

(function () {
  "use strict";

  class DataStore {
    get(prop, defaultValue=null) {
      return GM_getValue(prop, defaultValue);
    }

    getAll(){
      const data = {},
            self = this;

      GM_listValues().forEach( (v) => {data[v] = self.get(v);});
      return data;
    }

    set(prop, value) {
      GM_setValue(prop, value);
    }

    setAll(data) {
      if(!data || (data && typeof data !== 'object'))
        return;

      for(let key in data) {
        GM_setValue(key, data[key]);
      }
    }
  }

  $(function () {
    // CSS HERE...
    GM_addStyle(`
      #baskBox,#baskBox::before,#baskBox::after,#baskBox *,#baskBox *::before,#baskBox *::after{box-sizing: border-box; margin: 0; padding: 0;}#baskBox{background-color: #f4f1de; position: fixed; bottom: 10px; right: 10px; height: 290px; width: 260px; border: 1px solid gray; box-shadow: 1px 1px 7px 3px rgba(0, 0, 0, 0.2);}#baskBox.minimized{height: auto;}#baskBox .header{padding: 3px 6px; overflow: auto; border: 0px solid blue; background-color: #3d405b; color: #f4f1de;}#baskBox .header h1{font-size: 18px; float: left;}#baskBox .header #bb_btnMinimize{float: right; font-size: 13px; padding: 1px 5px; margin: 0; vertical-align: middle;border: 0;cursor: pointer;display:inline-block;background: #585d88; height: 24px; width: 24px; text-align: center; color: white;}#baskBox #contentContainer{display: flex; justify-content: center; align-items: flex-start; border: 0px solid green; height: 238px; overflow: hidden; overflow-y: auto;}#baskBox.minimized #contentContainer{display: none;}#baskBox #contentContainer .content{padding: 8px 8px;}#baskBox #contentContainer .content #content_settings{display: none;}#baskBox .footer{display: flex; justify-content: right; align-self: stretch; height: 24px; border: 0px solid red; background-color: #81b29a; color: #3d405b;}#baskBox.minimized .footer{display: none;}#baskBox .footer .toolbar{display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-start; align-items: stretch;}#baskBox .footer .toolbar .btn{display: flex; align-self: stretch; align-items: center; justify-content: center; margin: 0; text-align: center; width: 24px; height: 24px; border: 0; cursor: pointer; color: #3e6552;}.sep{display: flex; align-self: stretch; width: 0.5px; background: linear-gradient( to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100% );}
    `);

    // HTML HERE...
    const baskBoxHtml = `<div id="baskBox"> <div class="header"> <h1>Bask Box</h1> <button id="bb_btnMinimize" title="Maximize"> <i class="fas fa-angle-down"></i> </button> </div><div id="contentContainer"> <div class="content"> <div id="content_main"> Your Content Here... </div><div id="content_settings"> Settings Here... </div></div></div><div class="footer"> <div class="toolbar"> <div class="sep"></div><div class="btn" id="bb_btnNotify"> <i class="fas fa-bell"></i> </div><div class="sep"></div><div class="btn" id="bb_btnSettings"> <i class="fas fa-cog"></i> </div><div class="sep"></div></div></div></div>`;

    function stopEvent(e){if (!e) return; e.stopPropagation(); e.preventDefault();}

    const baskBox = $(baskBoxHtml),
          dataStore = new DataStore();

    $("body").append(baskBox);

    function initView() {
      const settingsMeta = {
        view : {defaultValue:'main', setFn:displayView},
        notify : {defaultValue:false, setFn:enableNotification},
        isMinimized: {defaultValue:false, setFn:minimizeView}
      };

      const config = dataStore.getAll();

      /*console.log("config - ", config);*/

      for(let key in config) {
        const meta = settingsMeta[key];

        if(!meta) continue;

        const value = (key in config ) ? config[key] : meta.defaultValue;
        meta.setFn(value);
      }
    }

    // JS HERE...
    const btnMin = $(document.getElementById("bb_btnMinimize"));
    const btnSettings = $(document.getElementById("bb_btnSettings"));
    const btnNotify = $(document.getElementById("bb_btnNotify"));

    const views = {
      settings: "content_settings",
      main: "content_main"
    };

    initView();

    btnMin.on("click", function (e) {
      stopEvent(e);

      const isMinimized = baskBox.hasClass("minimized");

      dataStore.set("isMinimized", !isMinimized);
      minimizeView(!isMinimized);
    });

    btnSettings.on("click", function (e) {
      stopEvent(e);
      const visibleView = $(".content").find(":visible")[0];
      let viewToDisplay = "main";

      if (visibleView) {
        const viewDisplayed = visibleView.id.split("_")[1];
        viewToDisplay = viewDisplayed == "main" ? "settings" : "main";
      }

      dataStore.set("view", viewToDisplay);
      displayView(viewToDisplay);
    });

    btnNotify.on("click", function (e) {
      stopEvent(e);

      const isNotifyEnabled = $(btnNotify.find("i")[0]).hasClass("fa-bell");

      dataStore.set("notify", !isNotifyEnabled);
      enableNotification(!isNotifyEnabled);
    });

    function minimizeView(shouldMinimize = false) {
      baskBox.toggleClass("minimized", shouldMinimize);

      btnMin.attr("title", !shouldMinimize ? "Minimize" : "Maximize");
      const btnIco = $(btnMin.find("i")[0]);

      const minClass = "angle-down",
            maxClass = "angle-up";

      btnIco.toggleClass(`fa-${maxClass}`, shouldMinimize);
      btnIco.toggleClass(`fa-${minClass}`, !shouldMinimize);
    }

    function displayView(viewName = "main") {
      for (let v in views) $(`.content #${views[v]}`).toggle(false);
      $(`.content #${views[viewName]}`).toggle(true);
    }

    function enableNotification(isEnabled = false) {
      const icon = $(btnNotify.find("i")[0]);
      icon.toggleClass("fa-bell", isEnabled);
      icon.toggleClass("fa-bell-slash", !isEnabled);
    }
  });
})();
