(function (document) {

  class RadialMenu {
    constructor({
                  fontFamily, fontSize, innerCircle, outerCircle,
                  rotation, shadowBlur, shadowColor, shadowOffsetX,
                  shadowOffsetY, backgroundColor, borderColor, textColor,
                  textBorderColor, textShadowColor, textShadowBlur,
                  textShadowOffsetX, textShadowOffsetY, buttons,
                  posX, posY, isFixed, zIndex, onShow, onHide
                } = {}) {
      this.TWOPI = 2 * Math.PI;
      this.fontFamily = fontFamily || 'FontAwesome';
      this.fontSize = fontSize || 14;
      if (isNaN(this.fontSize))
        throw "Font size must be a number";
      this.innerCircle = !isNaN(innerCircle) ? innerCircle : 50;
      this.outerCircle = !isNaN(outerCircle) ? outerCircle : 100;
      if (this.innerCircle > this.outerCircle)
        throw "Inner circle can't be larger than outer circle";
      if (this.innerCircle < 0)
        throw "Inner circle can't be negative";
      this.rotation = Math.abs(rotation % this.TWOPI) || 0;
      this.shadowColor = shadowColor || 'rgba(0,0,0,0.2)';
      this.shadowBlur = !isNaN(shadowBlur) ? shadowBlur : 10;
      this.shadowOffsetX = !isNaN(shadowOffsetX) ? shadowOffsetX : 3;
      this.shadowOffsetY = !isNaN(shadowOffsetY) ? shadowOffsetY : 3;
      this.backgroundColor = backgroundColor || "#EEE";
      this.borderColor = borderColor || "#FFF";
      this.textColor = textColor || "#000";
      this.textBorderColor = textBorderColor || "transparent";
      this.textShadowColor = textShadowColor || "transparent";
      this.textShadowBlur = !isNaN(textShadowBlur) ? textShadowBlur : 10;
      this.textShadowOffsetX = !isNaN(textShadowOffsetX) ? textShadowOffsetX : 3;
      this.textShadowOffsetY = !isNaN(textShadowOffsetY) ? textShadowOffsetY : 3;
      this.onShow = onShow || function () {

      };
      this.onHide = onHide || function () {

      };
      this.buttons = buttons || [
        {
          'text': '\uF000', 'action': (e) => {
            alert(1)
          }
        },
        {
          'text': '\uF001', 'action': (e) => {
            alert(2)
          }
        },
        {
          'text': '\uF002', 'action': (e) => {
            alert(3)
          }
        },
      ];
      this.checkButtons();
      this.posX = posX || 0;
      this.posY = posY || 0;
      this.isFixed = isFixed || false;
      this.zIndex = zIndex || 9999;
      this.canvas = document.createElement('canvas');
      document.body.append(this.canvas);
      this.init();
      this.draw();
      this.addEvent();
    }

    init() {
      this.step = this.TWOPI / this.buttons.length;
      this.canvas.width = (this.outerCircle * 2) + (this.shadowBlur * 2) + (this.shadowOffsetX * 2);
      this.canvas.height = (this.outerCircle * 2) + (this.shadowBlur * 2) + (this.shadowOffsetY * 2);
      this.c = this.canvas.getContext('2d');
      this.c.font = this.fontSize + "px " + this.fontFamily;
      this.canvas.style.display = "none";
      this.canvas.style.position = "fixed";
      this.canvas.style.zIndex = this.zIndex;
      this.w2 = this.canvas.width >> 1;
      this.h2 = this.canvas.height >> 1;
      if (this.backgroundColor instanceof Object)
        this.backgroundColor = this.createGradient(this.backgroundColor);
      if (this.borderColor instanceof Object)
        this.borderColor = this.createGradient(this.borderColor);
      if (this.shadowColor instanceof Object)
        this.shadowColor = this.createGradient(this.shadowColor);
      if (this.textColor instanceof Object)
        this.textColor = this.createGradient(this.textColor);
      if (this.textBorderColor instanceof Object)
        this.textBorderColor = this.createGradient(this.textBorderColor);
      if (this.textShadowColor instanceof Object)
        this.textShadowColor = this.createGradient(this.textShadowColor);
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i]["ini"] = (i * this.step + this.rotation) % this.TWOPI;
        this.buttons[i]["fin"] = (this.buttons[i]["ini"] + this.step) % this.TWOPI;
        if (this.buttons[i]["ini"] > this.buttons[i]["fin"])
          this.rest = i;
        const a = (this.buttons[i]["ini"] + this.step / 2);
        this.buttons[i]["centerX"] = Math.cos(a) * (this.innerCircle + (this.outerCircle - this.innerCircle) / 2) - this.fontSize / 2;
        this.buttons[i]["centerY"] = Math.sin(a) * (this.innerCircle + (this.outerCircle - this.innerCircle) / 2) + this.fontSize / 4;
      }
    }

    draw() {
      this.c.imageSmoothingEnabled = true;
      this.c.imageSmoothingQuality = "high";
      this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.c.shadowColor = this.shadowColor;
      this.c.shadowBlur = this.shadowBlur;
      this.c.shadowOffsetX = this.shadowOffsetX;
      this.c.shadowOffsetY = this.shadowOffsetY;
      this.c.beginPath();
      this.c.arc(this.w2, this.h2, this.outerCircle, 0, this.TWOPI);
      this.c.arc(this.w2, this.h2, this.innerCircle, this.TWOPI, 0, true);
      this.c.fillStyle = this.shadowColor;
      this.c.fill();
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i];
        this.c.shadowBlur = 0;
        this.c.shadowColor = 'transparent';
        this.c.fillStyle = "backgroundColor" in button ? button["backgroundColor"] : this.backgroundColor;
        this.c.strokeStyle = "borderColor" in button ? button["borderColor"] : this.borderColor;
        this.c.beginPath();
        this.c.arc(this.w2, this.h2, this.outerCircle, button["ini"], button["fin"]);
        this.c.arc(this.w2, this.h2, this.innerCircle, button["fin"], button["ini"], true);
        this.c.closePath();
        this.c.fill();
        this.c.stroke();
        this.c.fillStyle = "textColor" in button ? button["textColor"] : this.textColor;
        this.c.strokeStyle = "textBorderColor" in button ? button["textBorderColor"] : this.textBorderColor;
        this.c.shadowColor = "textShadowColor" in button ? button["textShadowColor"] : this.textShadowColor;
        this.c.shadowBlur = "textShadowBlur" in button ? button["textShadowBlur"] : this.textShadowBlur;
        this.c.shadowOffsetX = "textShadowOffsetX" in button ? button["textShadowOffsetX"] : this.textShadowOffsetX;
        this.c.shadowOffsetY = "textShadowOffsetY" in button ? button["textShadowOffsetY"] : this.textShadowOffsetY;
        this.c.save();
        this.c.translate(this.w2, this.h2);
        this.c.fillText(button["text"], button["centerX"], button["centerY"]);
        this.c.strokeText(button["text"], button["centerX"], button["centerY"]);
        this.c.restore();
      }
    }

    addEvent() {
      this.canvas.addEventListener('click', e => {
        const rect = this.canvas.getBoundingClientRect();
        const d = this.distance(e.clientX, e.clientY, rect.left + this.w2, rect.top + this.h2);
        let a = Math.atan2(e.clientY - (rect.top + this.h2), e.clientX - (rect.left + this.w2));
        a = a > 0 ? a : this.TWOPI + a;
        if (d > this.innerCircle && d < this.outerCircle) {
          for (let i = 0; i < this.buttons.length; i++) {
            if (a >= this.buttons[i]["ini"] && a <= this.buttons[i]["fin"]) {
              this.buttons[i].action(e);
              return
            }
          }
          this.buttons[this.rest].action(e);
        }
      });
      if (this.isFixed) {
        this.setPos(this.posX, this.posY);
        this.show();
        return;
      }
      document.addEventListener("click", e => {
        this.hide();
      });
      document.oncontextmenu = e => {
        e.preventDefault();
        this.setPos(e.clientX - this.w2, e.clientY - this.h2);
        this.show({x: e.clientX - this.w2, y: e.clientY - this.h2});
      };
      const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      /* possible fix for iPhone where it doesn't translate long press into a context menu */
      if (iOS) {
        document.addEventListener("touchstart", (e) => {
          this.timer = setTimeout(() => {
            this.setPos(e.touches[0].clientX - this.w2, e.touches[0].clientY - this.h2);
            this.show();
          }, 500);
        });
        document.addEventListener("touchend", () => {
          if (this.timer)
            clearTimeout(this.timer);
        });
      }
    }

    distance(x1, y1, x2, y2) {
      return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
    }

    hide() {
      this.canvas.style.display = "none";
      this.onHide();
    }

    show(pos) {
      this.onShow(pos);
      this.draw();
      this.canvas.style.display = "block";
    }

    quit() {
      this.canvas.remove();
      document.oncontextmenu = null;
    }

    setPos(x, y) {
      if (isNaN(x) || isNaN(y))
        throw "X and Y must be numbers";
      this.canvas.style.left = x + "px";
      this.canvas.style.top = y + "px";
    }

    createGradient(obj) {
      if (!("gradient" in obj))
        throw "Invalid gradient object";
      let gradient;
      switch (obj["gradient"]) {
        case "radial" :
          gradient = this.c.createRadialGradient(this.w2, this.h2, this.innerCircle, this.w2, this.h2, this.outerCircle);
          break;
        case "linear1" :
          gradient = this.c.createLinearGradient(0, 0, 0, this.canvas.height);
          break;
        case "linear2" :
          gradient = this.c.createLinearGradient(0, 0, this.canvas.width, 0);
          break;
        case "linear3" :
          gradient = this.c.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
          break;
        case "linear4" :
          gradient = this.c.createLinearGradient(0, this.canvas.height, this.canvas.width, 0);
          break;
        default :
          throw "Invalid gradient value";
      }
      for (const key in obj['colors']) {
        if (isNaN(key) || key < 0 || key > 1)
          throw "Invalid color position";
        gradient.addColorStop(key, obj['colors'][key]);
      }
      return gradient;
    }

    checkButtons() {
      if (!(this.buttons instanceof Array))
        throw "Buttons must be an Array of button objects";
      for (let i = 0; i < this.buttons.length; i++) {
        const button = this.buttons[i];
        if (!("text" in button) || !("action" in button))
          throw "Button must have a text and an action value";
      }
    }

    addButtons(buttons) {
      this.buttons = buttons;
      this.checkButtons();
      this.init();
    }
  }


  const selfAddressBase = "http://localhost:8000";
  const templateSearchBase = "http://localhost:8089";

  function getTemplateQueryResults(query) {
    return axios({
      url: templateSearchBase + "/find?query=" + query
    })
  }

  function loadScript(scriptSrc) {
    if (!(scriptSrc instanceof Array)) {
      scriptSrc = [scriptSrc];
    }
    return Promise.all(scriptSrc.map(function (src) {
      return new Promise(function (resolve, reject) {

        console.log("Load script", src);
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        // script.type = 'text/javascript';
        script.src = src;
        head.append(script);
        script.onload = resolve;
        script.onerror = reject;

      })
    }))
  }

  function loadCss(scriptSrc) {
    if (!(scriptSrc instanceof Array)) {
      scriptSrc = [scriptSrc];
    }
    return Promise.all(scriptSrc.map(function (src) {
      return new Promise(function (resolve, reject) {
        var head = document.getElementsByTagName('head')[0];
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", src);
        head.append(fileref);
        fileref.onload = resolve;
        fileref.onerror = reject;
      })
    }))
  }


  const Config = {
    CssSelectors: {
      "containers": ["container", "layout"],
      "columns": ["col-1", "col",]
    }
  };

  loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
  loadScript([
    'https://unpkg.com/mithril/mithril.js',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    "https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"
  ]).then(function () {
    const m = window.m;
    console.log("Mithril loaded");
    var toolbox = undefined;
    var head = document.getElementsByTagName("head")[0];
    var body = document.getElementsByTagName("body")[0];
    // alert("Loaded");
    const toolboxBackgroundColor = "#eee";

    var previousHoverTarget = undefined;
    var selectedTarget = undefined;
    var selectedTargetTagName = undefined;
    var previousTargetOriginalColor = undefined;
    var draggable = undefined;
    var componentSelector = undefined;
    var availableFuzzyComponents = [];
    var availablePrefixComponents = [];
    var availableShardsComponents = {};
    var importedScripts = {};
    var cssMap = {};

    function getDisplayHeight() {
      return window.innerHeight || document.documentElement.clientHeight ||
          document.body.clientHeight;
    }

    function getDisplayWidth() {
      return window.innerWidth || document.documentElement.clientWidth ||
          document.body.clientWidth;
    }

    function getCurrentScrollHeight() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }


    function getDomPath(el) {
      var stack = [];
      while (el.parentNode != null) {
        // console.log(el.nodeName);
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
          var sib = el.parentNode.childNodes[i];
          if (sib.nodeName === el.nodeName) {
            if (sib === el) {
              sibIndex = sibCount;
            }
            sibCount++;
          }
        }
        if (el.hasAttribute('id') && el.id !== '') {
          stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if (sibCount > 1) {
          stack.unshift(el.nodeName.toLowerCase());
        } else {
          stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
      }

      const name = stack.slice(1).join(" > ");
      const subName = name.substring(name.length > 40 ? name.length - 40 : 0, name.length);
      return subName.substring(subName.indexOf(">")); // removes the html element
    }

    function getDomPathFullName(el) {
      var stack = [];
      while (el.parentNode != null) {
        // console.log(el.nodeName);
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
          var sib = el.parentNode.childNodes[i];
          if (sib.nodeName === el.nodeName) {
            if (sib === el) {
              sibIndex = sibCount;
            }
            sibCount++;
          }
        }
        if (el.hasAttribute('id') && el.id !== '') {
          stack.unshift(el.nodeName.toLowerCase());
        } else if (sibCount > 1) {
          stack.unshift(el.nodeName.toLowerCase());
        } else {
          stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
      }

      return "<" + stack.join("<"); // removes the html element
    }

    function handleRadialEvent(eventName) {
      console.log("handle radial event", eventName);
      switch (eventName) {
        default:
          console.log("no handler for radial event", eventName);
          break;
        case "quit":
          body.onmousemove = null;
          body.onscroll = null;
          body.onclick = null;
          if (selectedTarget && selectedTarget.tagName !== "BODY") {
            selectedTarget.style.backgroundColor = previousTargetOriginalColor;
            selectedTarget = null;
          } else {
            previousHoverTarget.style.backgroundColor = previousTargetOriginalColor;
            previousHoverTarget = null;
          }

          toolbox.remove();
          if (componentSelector) {
            componentSelector.remove();
          }
          radial.quit();
          radial = null;
          toolbox = null;
          break;
      }
    }

    function handleToolBoxEvent(eventName, context) {
      console.log("handle event", eventName);
      switch (eventName) {
        case "drag-drop":
          break;
        case "connect-data":
          break;
        case "change-component":
          availablePrefixComponents = [];
          availableFuzzyComponents = [];
          availableShardsComponents = {};
          cssMap = {};
          console.log("get components for ", selectedTargetTagName);
          const fullPath = getDomPathFullName(selectedTarget);
          const fullPathParts = fullPath.split("<");

          for (var i = 0; i < fullPathParts.length; i++) {
            const subPath = "<" + fullPathParts.slice(i, fullPathParts.length).join("<");
            console.log("Query sub path ", subPath);
            getTemplateQueryResults(subPath).then(function (response) {
              var prefix = response.data.prefix;
              var fuzzy = response.data.fuzzy;
              var shards = response.data.shards;
              var css = response.data.css;
              var imported = response.data.imported;
              importedScripts = imported;
              if (prefix) {
                availablePrefixComponents.push(...prefix)
              }
              if (fuzzy) {
                availableFuzzyComponents.push(...fuzzy)
              }
              if (css) {
                var cssHashs = Object.keys(css);
                for (var i = 0; i < cssHashs.length; i++) {
                  var hash = cssHashs[i];
                  cssMap[hash] = css[hash];
                }
              }
              if (shards) {
                const shardNames = Object.keys(shards);
                for (var shardId in shardNames) {
                  var tag = shardNames[shardId];
                  const shard = response.data.shards[tag];
                  if (!shard) {
                    continue
                  }
                  availableShardsComponents[tag] = shard;
                }
              }
              console.log("prefix", prefix);
              console.log("fuzzy", fuzzy);
              if (!componentSelector) {
                // componentSelector.remove()
                componentSelector = document.createElement("div");
                document.body.append(componentSelector);
              }
              const componentSelectorBody = createComponentSelector(availablePrefixComponents, availableFuzzyComponents, availableShardsComponents, cssMap, importedScripts);
              m.mount(componentSelector, componentSelectorBody);
            })
          }


          var results = getTemplateQueryResults(fullPath);
          results.then(function (response) {
            console.log("results", response)
          });
          break;
        case "show-config":
          break;
        case "select-parent":
          var localTarget = context.target;
          console.log("update element", localTarget);
          if (localTarget && localTarget.parentElement && selectedTarget.parentElement !== document.body) {
            selectedTarget.style.backgroundColor = previousTargetOriginalColor;
            selectedTarget = localTarget.parentElement;
            previousTargetOriginalColor = selectedTarget.style.backgroundColor;
            selectedTarget.style.backgroundColor = "#ddd";
          }
          break;

        default:
          console.log("nothing to do for ", eventName)
      }
    }

    function onTargetSelected(target) {
      updateToolBoxPosition(selectedTarget);
    }

    function onTargetUnselected(target) {
      if (document.body.contains(componentSelector)) {
        document.body.removeChild(componentSelector)
      }
    }


    var radial = new RadialMenu({
      rotation: Math.PI / 2,
      fontSize: 18,
      onShow: function () {
      },
      onHide: function () {
      },
      buttons: [
        {
          text: '\uf1c0',
          action: function (e) {
            console.log("Configure data source")
          }
        },
        {
          text: '\uf1f8',
          action: function (e) {
            console.log("Delete element");
            handleRadialEvent("delete-element")
          }
        },
        {
          text: '\uf247',
          action: function (e) {
            console.log("Move element");
            handleRadialEvent("quit");
          }
        },
        {
          text: '\uf011',
          action: function () {
            console.log("Resize element");
            handleRadialEvent("quit");
          }
        },
      ]
    });


    radial.onShow = function (pos) {
      var element = document.elementFromPoint(pos.x, pos.y);
      selectedTarget = document.body;
      // console.log("selected element", selectedTarget)
      toolbox.style.display = "none";
    };

    radial.onHide = function () {
      // toolbox.style.display = "";
    };

    body.onmousemove = function (ev) {
      if (previousHoverTarget === ev.target || selectedTarget || ev.target.tagName === "BODY") {
        return;
      }
      if (body.contains(componentSelector)) {
        return
      }
      if (previousHoverTarget) {
        previousHoverTarget.style.backgroundColor = previousTargetOriginalColor;
      }
      var target = ev.target;
      // console.log("Move move event target", target, target.style.top, ev.clientX, ev.clientY);
      previousTargetOriginalColor = target.style.backgroundColor;
      target.style.backgroundColor = "orange";
      previousHoverTarget = target;
      updateToolBoxPosition(ev.target);
    };

    body.onscroll = function (ev) {
      if (previousHoverTarget === ev.target || selectedTarget || ev.target.tagName === "BODY") {
        updateToolBoxPosition(selectedTarget);

      }

    };

    body.onclick = function (event) {
      if (event.target.tagName == "CANVAS" || (draggable && draggable.dragging)) {
        return
      }
      // console.log("click target", event.target);
      if (toolbox.contains(event.target)) {
        updateToolBoxPosition(selectedTarget);
        return false;
      }
      if (document.body.contains(componentSelector) && componentSelector.contains(event.target)) {
        return false;
      }


      if (selectedTarget) {
        toolbox.style.backgroundColor = toolboxBackgroundColor;
        selectedTarget.style.backgroundColor = previousTargetOriginalColor;
        onTargetUnselected(selectedTarget);
        selectedTarget = undefined;
        return false;
      }
      selectedTarget = event.target;
      selectedTarget.style.backgroundColor = "#ddd";
      toolbox.style.backgroundColor = "#ddd";
      onTargetSelected(selectedTarget);
      event.cancelBubble = true;
      return false
    };

    function updateToolBoxPosition(target) {
      if (toolbox) {
        // console.log("remove existing toolbox");
        document.body.removeChild(toolbox)
      }
      selectedTargetTagName = getDomPath(target);
      var toolBoxContainer = createToolBox();
      var d = document.createElement("div");
      m.mount(d, toolBoxContainer);
      // console.log("Rendered", d);
      toolbox = d.children[0];
      document.body.append(toolbox);

      var rect = target.getBoundingClientRect();
      // console.log("Element x,y", rect.top, rect.left, selectedTargetTagName);
      toolbox.style.display = "";
      var toolBoxSide = "top";
      var defaultToolBoxHeight = 400;
      var defaultToolBoxWidth = 30;
      if (rect.top < defaultToolBoxWidth) {
        toolBoxSide = "bottom"
      }
      if (toolBoxSide === "right" && rect.right > getDisplayWidth() - defaultToolBoxWidth) {
        toolBoxSide = "left"
      }
      if (toolBoxSide === "left" && rect.left < defaultToolBoxWidth) {
        toolBoxSide = "bottom"
      }
      if (toolBoxSide === "bottom" && rect.bottom > getCurrentScrollHeight() + getDisplayHeight()) {
        toolBoxSide = "0"
      }
      var pTop = 0, pLeft = 0;
      var height = defaultToolBoxHeight, width = defaultToolBoxWidth;
      switch (toolBoxSide) {
        case "top":
          pTop = getCurrentScrollHeight() + rect.top - defaultToolBoxWidth;
          pLeft = rect.left;
          height = defaultToolBoxWidth;
          width = defaultToolBoxHeight;
          break;
        case "right":
          pTop = getCurrentScrollHeight() + rect.top;
          pLeft = rect.right;
          height = defaultToolBoxHeight;
          width = defaultToolBoxWidth;
          break;
        case "left":
          pTop = getCurrentScrollHeight() + rect.top;
          pLeft = rect.left - defaultToolBoxWidth;
          height = defaultToolBoxHeight;
          width = defaultToolBoxWidth;
          break;
        case "bottom":
          pTop = rect.bottom < getCurrentScrollHeight() ? rect.bottom : getCurrentScrollHeight();
          pLeft = rect.left;
          height = defaultToolBoxWidth;
          width = defaultToolBoxHeight;
          break;
        case "0":
          pTop = getCurrentScrollHeight();
          pLeft = rect.left;
          height = defaultToolBoxWidth;
          width = defaultToolBoxHeight;
          break;
      }
      toolbox.style.top = pTop + "px";
      toolbox.style.left = pLeft + "px";
      toolbox.style.height = height + "px";
      toolbox.style.width = width + "px";
    }

    function createToolBox() {
      const m = window.m;

      return {
        view: function () {
          return m("div", {
                style: {
                  position: "absolute",
                  top: 0 + "px",
                  left: 0 + "px",
                  "z-index": 2099,
                  "background-color": toolboxBackgroundColor,
                  "color": "black",
                  "text-size": "14px"
                }
              }, [
                m("div", {class: "shard-toolbox"}, [
                  m("i", {
                    class: "fa fa-wrench",
                    "aria-hidden": true,
                    "style": {
                      "cursor": "pointer",
                      "margin": "5px",
                    },
                    onclick: function (e) {
                      handleToolBoxEvent("change-component", {
                        target: selectedTarget
                      })
                    }
                  }),
                  m("i", {
                    class: "fa fa-arrows-alt",
                    "aria-hidden": true,
                    "style": {
                      "cursor": "pointer",
                      "margin": "5px",
                    },
                    onclick: function (e) {

                      handleToolBoxEvent("select-parent", {
                        target: selectedTarget
                      })
                    }
                  }),
                  m("i", {
                    class: "fa  fa-plug",
                    "aria-hidden": true,
                    "style": {
                      "cursor": "pointer",
                      "margin": "5px",
                    },
                    onclick: function (e) {
                      console.log("connect data");
                      handleToolBoxEvent("connect-data", {
                        target: selectedTarget
                      })
                    }
                  }),
                  m("span", {
                    onclick: function (e) {
                      console.log("update element", e, selectedTarget);
                    }
                  }, selectedTargetTagName),
                  m("i", {
                    class: "fa fa-cog",
                    "aria-hidden": true,
                    "style": {
                      "cursor": "pointer",
                      "margin": "5px",
                    },
                    onclick: function (e) {
                      handleToolBoxEvent("show-config", {
                        target: selectedTarget
                      })
                    }
                  }),
                ])
              ]
          )
        }
      }
    }

    function buildHtmlFromPrefix(tagStruct, outerHtml, cssMap, importedScripts) {
      console.log("Build html ", tagStruct, outerHtml, cssMap);
      var tags = tagStruct.split("<");
      var container = document.createElement("div");
      container.innerHTML = outerHtml;
      container = container.childNodes[0];
      if (container.style && container.style.display && container.style.display == "none") {
        container.style.display = "";
      }
      if (container.style && container.style.top && container.style.top != "") {
        container.style.top = "";
      }
      var hasBody = false;
      var hasHtml = false;
      var cssItems = [];
      var head = document.createElement("head");
      for (var i = tags.length - 2; i > 0; i--) {
        var tagParts = tags[i].split(".");
        var tagName = tagParts[0];
        var className = tagParts[1];
        var css = cssMap[className];

        if (tagName == "body") {
          hasBody = true;
        } else if (tagName == "html") {
          hasHtml = true;
        }

        var newElement = undefined;
        if (tagName === ":text") {
          continue;
        }
        newElement = document.createElement(tagName);
        if (className && css) {
          cssItems.push(tagName + "." + className + " {" + css + "}");
          newElement.setAttribute("class", className);
        }
        newElement.append(container);
        container = newElement
      }

      var cssNode = document.createElement("script");
      cssNode.type = 'text/css';
      cssNode.innerText = cssItems.join("");
      if (!hasBody) {
        var body = document.createElement("body");
        body.append(container);
        container = body;
      }

      if (!hasHtml) {
        var html = document.createElement("html");
        html.append(container);
        container = html;
      }
      for (var i = 0; i < importedScripts.length; i++) {
        var src = importedScripts[i];
        var element = undefined;
        if (src.indexOf(".css") > -1 || true) {
          element = document.createElement("link");
          element.href = src;
          element.setAttribute("rel", "stylesheet");
          element.setAttribute("type", "text/css")
        } else if (src.indexOf(".js") > -1) {
          element = document.createElement("script");
          element.src = src;
          element.setAttribute("type", "text/javascript")
        }
        if (element) {
          head.append(element);
        }
      }

      head.append(cssNode);

      container.append(head);

      console.log("Final html", container.outerHTML);


      return container.outerHTML;
    }

    function createComponentSelector(prefixComponents, fuzzyComponents, shardsMap, cssMap, importedScripts) {
      const m = window.m;
      var pageNumber = 0;
      var pageSize = 5;

      var allComponents = prefixComponents;

      for (var i = 0; i < fuzzyComponents.length; i++) {
        var f = fuzzyComponents[i];
        if (allComponents.indexOf(f) === -1) {
          allComponents.push(f);
        }
      }

      var done = {};
      var startPos = (pageNumber * pageSize);
      var endPos = (pageNumber + 1) * pageSize;
      console.log("start and end pos", startPos, endPos);
      const htmlGenerator = function (prefix) {
        // if (done[prefix]) {
        //   return null;
        // }
        // done[prefix] = true;
        var htmls = shardsMap[prefix];
        if (!htmls) {
          return null
        }
        console.log("Identified ", htmls.length, " htmls for ", prefix)
        for (const htmlPath of htmls) {
          console.log()
        }
        return Object.keys(htmls).map(function (tagStruct) {
          console.log("Build html for ", tagStruct);
          var html = htmls[tagStruct];
          return m("iframe", {
            height: "300px",
            "width": "100%",
            "border": "1px solid black",
            "src": "data:text/html;charset=utf-8," + escape(buildHtmlFromPrefix(tagStruct, html[0], cssMap, importedScripts))
          })
        }).filter(function (e) {
          return !!e
        })
      };
      const skipNull = function (e) {
        return !!e
      };
      var iframes = allComponents.slice(startPos, endPos).map(htmlGenerator).filter(skipNull);
      return {
        view: function () {


          return m("div", {
                style: {
                  position: "fixed",
                  top: 0 + "px",
                  left: 0 + "px",
                  height: "100vh",
                  width: "300px",
                  "overflow-y": "scroll",
                  "z-index": 2099,
                  "background-color": toolboxBackgroundColor,
                  "color": "black",
                  "text-size": "14px"
                }
              }, [
                m("div", {class: "component-toolbox"}, [
                      m("i", {
                        class: "fa fa-wrench",
                        "aria-hidden": true,
                        "style": {
                          "cursor": "pointer",
                          "margin": "5px",
                        },
                        onclick: function (e) {
                          handleToolBoxEvent("change-component", {
                            target: selectedTarget
                          })
                        }
                      }),
                      m("i", {
                        class: "fa fa-arrows-alt",
                        "aria-hidden": true,
                        "style": {
                          "cursor": "pointer",
                          "margin": "5px",
                        },
                        onclick: function (e) {

                          handleToolBoxEvent("select-parent", {
                            target: selectedTarget
                          })
                        }
                      }),
                      m("i", {
                        class: "fa  fa-plug",
                        "aria-hidden": true,
                        "style": {
                          "cursor": "pointer",
                          "margin": "5px",
                        },
                        onclick: function (e) {
                          console.log("connect data");
                          handleToolBoxEvent("connect-data", {
                            target: selectedTarget
                          })
                        }
                      }),
                      m("i", {
                        class: "fa fa-cog",
                        "aria-hidden": true,
                        "style": {
                          "cursor": "pointer",
                          "margin": "5px",
                        },
                        onclick: function (e) {
                          handleToolBoxEvent("show-config", {
                            target: selectedTarget
                          })
                        }
                      }),
                      m("br"),
                      m("span", {
                        onclick: function (e) {
                          console.log("update element", e, selectedTarget);
                        }
                      }, selectedTargetTagName),
                      m("br"),
                      m("div", {
                        style: {
                          position: "fixed",
                          top: 0,
                          width: "290px",
                          background: "white",
                          "text-align": "center",
                          "cursor": "pointer",
                          height: "25px",
                          left: "5px",
                          right: 0,
                        },
                        onclick: function () {
                          pageNumber = pageNumber - 1;
                          console.log("Previous ", pageNumber);
                          if (pageNumber < 0) {
                            pageNumber = 0;
                          }
                        },
                      }, "Previous"),
                      m("div", {
                            style: {
                              "padding": "10px",
                            }
                          }, [
                            ...iframes,
                          ]
                      ),
                      m("div", {
                        style: {
                          position: "fixed",
                          bottom: 0,
                          width: "290px",
                          "text-align": "center",
                          "cursor": "pointer",
                          background: "white",
                          height: "25px",
                          left: "5px",
                          right: 0,
                        },
                        onclick: function () {
                          pageNumber = pageNumber + 1;
                          console.log("Next ", pageNumber);
                          if (pageNumber > (allComponents.length / pageSize) + 1) {
                            pageNumber = allComponents.length / pageSize - 1;
                          }
                          iframes.splice(0, iframes.length);
                          startPos = (pageNumber * pageSize) + 1;
                          endPos = (pageNumber + 1) * pageSize;

                          iframes.push(...allComponents.slice(startPos, endPos).map(htmlGenerator).filter(skipNull))

                        },
                      }, "Next")
                    ]
                )
              ]
          )
        }
      }
    }
  }, function () {
    alert("Failed to load mithril")
  });

})(document);
