(function (document) {

  function loadScript(scriptSrc) {
    if (!(scriptSrc instanceof Array)) {
      scriptSrc = [scriptSrc];
    }
    return Promise.all(scriptSrc.map(function (src) {
      return new Promise(function (resolve, reject) {
        console.log("Load script", src);
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        head.appendChild(script);
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
        head.appendChild(fileref);
        fileref.onload = resolve;
        fileref.onerror = reject;
      })
    }))
  }


  loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
  loadScript('https://unpkg.com/mithril/mithril.js').then(function () {
    console.log("Mithril loaded");
    var toolbox = undefined;
    var head = document.getElementsByTagName("head")[0];
    var body = document.getElementsByTagName("body")[0];
    // alert("Loaded");
    const toolboxBackgroundColor = "#eee";

    const m = window.m;

    var toolBoxContainer = m("div", {
      style: {
        position: "absolute",
        top: 0 + "px",
        left: 0 + "px",
        "z-index": 1099,
        "background-color": toolboxBackgroundColor,
        "color": "black",
        "text-size": "14px"
      }
    }, createToolBox());

    var d = document.createElement("div");
    m.render(d, toolBoxContainer);
    console.log("Rendered", d);
    toolbox = d.children[0];
    document.body.append(toolbox);
    toolbox.style.display = "none";


    var previousHoverTarget = undefined;
    var selectedTarget = undefined;
    var previousTargetOriginalColor = undefined;
    body.onmousemove = function (ev) {

      if (previousHoverTarget === ev.target || selectedTarget) {
        return;
      }

      if (previousHoverTarget) {
        previousHoverTarget.style.backgroundColor = previousTargetOriginalColor;
      }

      var target = ev.target;
      console.log("Move move event target", target, target.style.top, ev.clientX, ev.clientY);
      previousTargetOriginalColor = target.style.backgroundColor;
      target.style.backgroundColor = "orange";
      previousHoverTarget = target;
      updateToolBoxPosition(toolbox, ev.target);
    };

    function handleToolBoxEvent() {

    }

    body.onclick = function (event) {

      console.log("click target", event.target);
      if (toolbox.contains(event.target)) {
        return false;
      }


      if (selectedTarget) {

        toolbox.style.backgroundColor = toolboxBackgroundColor;
        selectedTarget.style.backgroundColor = previousTargetOriginalColor;
        selectedTarget = undefined;
        return false;
      }

      selectedTarget = event.target;
      selectedTarget.style.backgroundColor = "#ddd";
      toolbox.style.backgroundColor = "#ddd";
      return false
    };


    function updateToolBoxPosition(toolbox, target) {
      var rect = target.getBoundingClientRect();
      console.log("Element x,y", rect.top, rect.left);
      toolbox.style.display = "";

      var toolBoxSide = "top";

      var defaultToolBoxHeight = 200;
      var defaultToolBoxWidth = 30;
      if (rect.top < defaultToolBoxWidth) {
        toolBoxSide = "right"
      }
      if (toolBoxSide == "right" && rect.right > document.body.clientWidth - defaultToolBoxWidth) {
        toolBoxSide = "left"
      }
      if (toolBoxSide == "left" && rect.left < defaultToolBoxWidth) {
        toolBoxSide = "bottom"
      }
      if (toolBoxSide == "bottom" && rect.bottom > window.scrollY + document.body.clientHeight) {
        toolBoxSide = "0"
      }

      var pTop = 0, pLeft = 0;
      var height = defaultToolBoxHeight, width = defaultToolBoxWidth;

      switch (toolBoxSide) {
        case "top":
          pTop = window.scrollY + rect.top - defaultToolBoxWidth;
          pLeft = rect.left;
          height = defaultToolBoxWidth;
          width = defaultToolBoxHeight;
          break;
        case "right":
          pTop = window.scrollY + rect.top;
          pLeft = rect.right;
          height = defaultToolBoxHeight;
          width = defaultToolBoxWidth;
          break;
        case "left":
          pTop = window.scrollY + rect.top;
          pLeft = rect.left - defaultToolBoxWidth;
          height = defaultToolBoxHeight;
          width = defaultToolBoxWidth;
          break;
        case "bottom":
          pTop = window.scrollY + rect.bottom;
          pLeft = rect.left;
          height = defaultToolBoxWidth;
          width = defaultToolBoxHeight;
          break;
        case "0":
          pTop = 0;
          pLeft = 0;
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
      return [
        m("div", {class: "shard-toolbox"}, [
          m("i", {
            class: "fa fa-arrows",
            "aria-hidden": true,
            "style": {
              "cursor": "pointer",
              "margin": "5px",
            },
            onclick: function (e) {
              console.log("enlarge")
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
              console.log("update element", e, selectedTarget)
              if (selectedTarget && selectedTarget.parentElement && selectedTarget.parentElement != document.body) {
                selectedTarget.style.backgroundColor = previousTargetOriginalColor;
                selectedTarget = selectedTarget.parentElement;
                previousTargetOriginalColor = selectedTarget.style.backgroundColor;
                selectedTarget.style.backgroundColor = "#ddd";
                updateToolBoxPosition(toolbox, selectedTarget);
              }
            }
          }),
        ])
      ]
    }

  }, function () {
    alert("Failed to load mithril")
  });


})(document);

