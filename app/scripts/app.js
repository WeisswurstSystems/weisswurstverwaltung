/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    app.baseUrl = '/weisswurstverwaltung/';
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled�??it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  window.addEventListener('paper-header-transform', function(e) {
    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    // appName max size when condensed. The smaller the number the smaller the condensed size.
    var maxMiddleScale = 0.50;
    var auxHeight = heightDiff - detail.y;
    var auxScale = heightDiff / (1 - maxMiddleScale);
    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);


(function(){

  var msg = "Weisswurst";
  var size = 25;
  var circleY = 0.75; var circleX = 2;
  var letter_spacing = 5;
  var diameter = 10;
  var rotation = 0.2;
  var speed = 0.4;

  if (!window.addEventListener && !window.attachEvent || !document.createElement) return;

  msg = msg.split('');
  var n = msg.length - 1, a = Math.round(size * diameter * 0.208333), currStep = 20,
    ymouse = a * circleY + 20, xmouse = a * circleX + 20, y = [], x = [], Y = [], X = [],
    o = document.createElement('div'), oi = document.createElement('div'),
    b = document.compatMode && document.compatMode != "BackCompat"? document.documentElement :

      document.body,

    mouse = function(e){
      e = e || window.event;
      ymouse = !isNaN(e.pageY)? e.pageY : e.clientY; // y-position
      xmouse = !isNaN(e.pageX)? e.pageX : e.clientX; // x-position
    },

    makecircle = function(){ // rotation/positioning
      if(init.nopy){
        o.style.top = (b || document.body).scrollTop + 'px';
        o.style.left = (b || document.body).scrollLeft + 'px';
      }
      currStep -= rotation;
      for (var d, i = n; i > -1; --i){ // makes the circle
        d = document.getElementById('iemsg' + i).style;
        d.top = Math.round(y[i] + a * Math.sin((currStep + i) / letter_spacing) * circleY - 15) +

          'px';
        d.left = Math.round(x[i] + a * Math.cos((currStep + i) / letter_spacing) * circleX) + 'px';
      }
    },

    drag = function(){ // makes the resistance
      y[0] = Y[0] += (ymouse - Y[0]) * speed;
      x[0] = X[0] += (xmouse - 20 - X[0]) * speed;
      for (var i = n; i > 0; --i){
        y[i] = Y[i] += (y[i-1] - Y[i]) * speed;
        x[i] = X[i] += (x[i-1] - X[i]) * speed;
      }
      makecircle();
    },

    init = function(){ // appends message divs, & sets initial values for positioning arrays
      if(!isNaN(window.pageYOffset)){
        ymouse += window.pageYOffset;
        xmouse += window.pageXOffset;
      } else init.nopy = true;
      for (var d, i = n; i > -1; --i){
        d = document.createElement('div'); d.id = 'iemsg' + i;
        d.style.height = d.style.width = a + 'px';
        d.appendChild(document.createTextNode(msg[i]));
        oi.appendChild(d); y[i] = x[i] = Y[i] = X[i] = 0;
      }
      o.appendChild(oi); document.body.appendChild(o);
      setInterval(drag, 25);
    },

    ascroll = function(){
      ymouse += window.pageYOffset;
      xmouse += window.pageXOffset;
      window.removeEventListener('scroll', ascroll, false);
    };

  o.id = 'outerCircleText'; o.style.fontSize = size + 'px';

  if (window.addEventListener){
    window.addEventListener('load', init, false);
    document.addEventListener('mouseover', mouse, false);
    document.addEventListener('mousemove', mouse, false);
    if (/Apple/.test(navigator.vendor))
      window.addEventListener('scroll', ascroll, false);
  }
  else if (window.attachEvent){
    window.attachEvent('onload', init);
    document.attachEvent('onmousemove', mouse);
  }

})();
