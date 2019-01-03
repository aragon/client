'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var styled = require('styled-components');
var styled__default = _interopDefault(styled);
var ReactDOM = _interopDefault(require('react-dom'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();



var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};









var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Add = function Add(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M11 4.744c1.216 0 2.341.304 3.376.912a6.308 6.308 0 0 1 2.368 2.368 6.546 6.546 0 0 1 .912 3.376 6.546 6.546 0 0 1-.912 3.376 6.308 6.308 0 0 1-2.368 2.368 6.546 6.546 0 0 1-3.376.912 6.546 6.546 0 0 1-3.376-.912 6.428 6.428 0 0 1-2.368-2.384 6.517 6.517 0 0 1-.912-3.36c0-1.205.304-2.325.912-3.36A6.55 6.55 0 0 1 7.64 5.656 6.517 6.517 0 0 1 11 4.744z",
        stroke: "currentColor"
      }),
      React.createElement("path", {
        fill: "currentColor",
        d: "M11.656 8.056v2.688h2.688v1.312h-2.688v2.688h-1.312v-2.688H7.656v-1.312h2.688V8.056z"
      })
    )
  );
};

var Apps = function Apps(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M4.157 3.07C3.523 3.07 3 3.592 3 4.226v5.012c0 .635.523 1.157 1.157 1.157h5.012c.634 0 1.156-.522 1.156-1.157V4.226c0-.634-.522-1.156-1.156-1.156H4.157zm8.482 0c-.635 0-1.157.522-1.157 1.156v5.012c0 .635.522 1.157 1.157 1.157h5.012c.634 0 1.156-.522 1.156-1.157V4.226c0-.634-.522-1.156-1.156-1.156h-5.012zm-8.482.77h5.012c.22 0 .385.166.385.386v5.012c0 .22-.165.386-.385.386H4.157a.377.377 0 0 1-.386-.386V4.226c0-.22.165-.385.386-.385zm8.482 0h5.012c.22 0 .385.166.385.386v5.012c0 .22-.165.386-.385.386h-5.012a.377.377 0 0 1-.386-.386V4.226c0-.22.165-.385.386-.385zm2.463 7.706a.386.386 0 0 0-.343.391v2.892h-2.892a.386.386 0 1 0 0 .77h2.892v2.893a.386.386 0 1 0 .771 0V15.6h2.892a.386.386 0 1 0 0-.771H15.53v-2.892a.386.386 0 0 0-.428-.391zm-10.945.006c-.634 0-1.157.522-1.157 1.156v5.012c0 .635.523 1.157 1.157 1.157h5.012c.634 0 1.156-.522 1.156-1.157v-5.012c0-.634-.522-1.156-1.156-1.156H4.157zm0 .77h5.012c.22 0 .385.166.385.386v5.012c0 .22-.165.386-.385.386H4.157a.377.377 0 0 1-.386-.386v-5.012c0-.22.165-.385.386-.385z",
        fill: "currentColor",
        fillRule: "nonzero"
      })
    )
  );
};

var Attention = function Attention(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { transform: "translate(4 4)", fill: "none", fillRule: "evenodd" },
      React.createElement("rect", { fill: "#DAEAEF", width: 14, height: 14, rx: 7 }),
      React.createElement("path", {
        d: "M6.155 8.547h1.298V3.3H6.155v5.247zM6.045 11h1.529V9.537H6.045V11z",
        fill: "#6D777B"
      })
    )
  );
};

var Error$1 = function Error(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { transform: "translate(4 4)", fill: "none", fillRule: "evenodd" },
      React.createElement("rect", { fill: "#FF445D", width: 14, height: 14, rx: 7 }),
      React.createElement("path", {
        d: "M6.155 8.547h1.298V3.3H6.155v5.247zM6.045 11h1.529V9.537H6.045V11z",
        fill: "#FFF"
      })
    )
  );
};

var Blank = function Blank(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement("path", {
      d: "M17.155 2.375H4.845a.357.357 0 0 0-.345.345v16.559c0 .181.163.345.345.345h9.768c.09 0 .2-.037.254-.11l2.542-2.85a.345.345 0 0 0 .091-.236V2.72a.357.357 0 0 0-.345-.345zm-11.965.69h11.62v12.637h-2.25a.69.69 0 0 0-.69.69v2.542H5.19V3.064v.001zm9.369 15.742v-2.433h2.16l-2.16 2.433z",
      fill: "currentColor"
    })
  );
};

var Check = function Check(props) {
  return React.createElement(
    "svg",
    _extends({ width: 14, height: 10, viewBox: "0 0 14 10" }, props),
    React.createElement("path", {
      d: "M4.176 7.956L12.114 0l1.062 1.062-9 9L0 5.886l1.044-1.062z",
      fill: "#21D48E",
      fillRule: "evenodd"
    })
  );
};

var Cross = function Cross(props) {
  return React.createElement(
    "svg",
    _extends({ width: 11, height: 11, viewBox: "0 0 11 11" }, props),
    React.createElement("path", {
      d: "M10.476 1.524L6.3 5.7l4.176 4.176-1.062 1.062-4.176-4.176-4.176 4.176L0 9.876 4.176 5.7 0 1.524 1.062.462l4.176 4.176L9.414.462z",
      fill: "#FB7777",
      fillRule: "evenodd"
    })
  );
};

var Fundraising = function Fundraising(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement(
        "g",
        { stroke: "currentColor" },
        React.createElement("path", {
          d: "M6 12.26C6.402 13.75 9.137 15 12.475 15 16.089 15 19 13.534 19 11.875c0-.886-1.07-1.903-2.967-2.357",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        React.createElement("path", { d: "M16 6.88C16 8.536 13.1 10 9.5 10S3 8.536 3 6.88C3 5.224 5.9 4 9.5 4S16 5.224 16 6.88" }),
        React.createElement("path", {
          d: "M6 12v2c0 1.667 2.9 3 6.5 3s6.5-1.333 6.5-3v-2c0 1.643-2.9 3.095-6.5 3.095S6 13.643 6 12z",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        React.createElement("path", { d: "M9.5 10.095C5.9 10.095 3 8.643 3 7v2c0 1.667 2.9 3 6.5 3S16 10.667 16 9V7c0 1.643-2.9 3.095-6.5 3.095" })
      )
    )
  );
};

var Groups = function Groups(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M14.928 16.169l.395.22c.264.146.396.337.396.571v1.186a.753.753 0 0 1-.235.564.773.773 0 0 1-.556.227H4.79a.773.773 0 0 1-.557-.227.753.753 0 0 1-.234-.564V16.96c0-.215.132-.4.396-.557l.395-.234 3.032-1.64c-.556-.44-.942-1.026-1.157-1.758-.215-.733-.322-1.314-.322-1.744V9.05c0-.332.102-.662.307-.989.205-.327.474-.623.806-.886.332-.264.71-.479 1.135-.645a3.497 3.497 0 0 1 1.282-.249c.44 0 .87.083 1.29.25.419.165.793.38 1.12.644.327.263.59.559.79.886.2.327.301.657.301.989v1.977c0 .479-.095 1.075-.286 1.787-.19.713-.559 1.29-1.106 1.729l2.945 1.626zM14.78 18v-.835a.391.391 0 0 0-.102-.073l-.117-.059a.071.071 0 0 1-.037-.014.479.479 0 0 0-.051-.03l-2.945-1.626a.99.99 0 0 1-.337-.315.863.863 0 0 1-.146-.432.856.856 0 0 1 .066-.454.913.913 0 0 1 .285-.366c.4-.313.674-.76.82-1.34.147-.581.22-1.058.22-1.429V9.05c0-.342-.256-.733-.769-1.172a2.672 2.672 0 0 0-1.794-.66c-.664 0-1.262.22-1.794.66-.533.44-.799.83-.799 1.172v1.977c0 .371.088.848.264 1.429.176.58.464 1.027.864 1.34.117.098.208.22.271.366a.856.856 0 0 1 .066.454.863.863 0 0 1-.146.432.865.865 0 0 1-.337.3L5.23 17.005a.06.06 0 0 0-.029.007.115.115 0 0 0-.03.022.432.432 0 0 0-.124.059l-.11.073V18h9.844zm3.428-4.16l.395.22c.264.146.396.336.396.57v1.173a.753.753 0 0 1-.234.564.773.773 0 0 1-.557.227h-1.553a5.372 5.372 0 0 0-.183-.542.952.952 0 0 0-.3-.396h1.89v-.835a4.202 4.202 0 0 0-.103-.066.408.408 0 0 0-.117-.05.092.092 0 0 0-.037-.023.402.402 0 0 1-.051-.022l-2.988-1.626a.99.99 0 0 1-.337-.315.863.863 0 0 1-.147-.432.856.856 0 0 1 .066-.454.913.913 0 0 1 .286-.366c.4-.322.68-.774.842-1.355.161-.581.242-1.052.242-1.414V6.721c0-.352-.264-.747-.791-1.187a2.756 2.756 0 0 0-1.817-.659 2.981 2.981 0 0 0-1.787.6 2.301 2.301 0 0 0-.586-.102l-.6-.03c.341-.4.78-.737 1.318-1.01a3.608 3.608 0 0 1 1.655-.41c.44 0 .872.085 1.297.256a4.52 4.52 0 0 1 1.135.652c.332.264.6.562.806.894.205.332.307.664.307.996v1.977c0 .469-.102 1.062-.307 1.78-.205.718-.581 1.292-1.128 1.721l2.988 1.64z",
        fill: "currentColor"
      })
    )
  );
};

var Home = function Home(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement("path", {
      d: "M17.884 9.993c.08.085.121.198.115.314a.484.484 0 0 1-.129.312.667.667 0 0 1-.143.09.375.375 0 0 1-.157.033c-.06 0-.12-.01-.176-.033a.338.338 0 0 1-.137-.103l-.586-.614v6.53a.419.419 0 0 1-.13.307.419.419 0 0 1-.307.13h-3.052a.419.419 0 0 1-.307-.13.419.419 0 0 1-.13-.307V12.16H9.268l-.014 4.362a.419.419 0 0 1-.13.307.419.419 0 0 1-.307.13H5.78a.43.43 0 0 1-.437-.437V9.993l-.586.613a.484.484 0 0 1-.314.13.428.428 0 0 1-.312-.117.484.484 0 0 1-.13-.312.428.428 0 0 1 .116-.314L10.7 3.135a.463.463 0 0 1 .15-.102.456.456 0 0 1 .34 0 .339.339 0 0 1 .137.102l6.557 6.858zM15.8 9.147c0-.019.003-.036.013-.054l-4.799-5.016-4.81 5.016a.26.26 0 0 0 .005.054.223.223 0 0 1 .007.055v6.885h2.168l.014-4.363a.419.419 0 0 1 .129-.307.419.419 0 0 1 .307-.13h4.348a.419.419 0 0 1 .307.13c.083.08.13.191.13.307v4.363h2.18v-6.94z",
      fill: "currentColor"
    })
  );
};

var Identity = function Identity(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M4.04 16.984V18h11.44v1H4.04a1.02 1.02 0 0 1-.731-.297A.943.943 0 0 1 3 18v-1.5c0-.281.173-.518.52-.71l.52-.29 4.566-2.078a3.891 3.891 0 0 1-.926-1.008 6.536 6.536 0 0 1-.61-1.21 6.431 6.431 0 0 1-.333-1.212A6.209 6.209 0 0 1 6.64 9V6.5c0-.417.135-.833.406-1.25a4.43 4.43 0 0 1 1.073-1.125 5.961 5.961 0 0 1 1.503-.813A4.82 4.82 0 0 1 11.32 3c.574 0 1.14.104 1.698.313a5.819 5.819 0 0 1 1.495.812c.439.333.796.708 1.073 1.125.276.417.414.833.414 1.25V9c0 .302-.032.651-.098 1.047a6.59 6.59 0 0 1-.324 1.21 5.86 5.86 0 0 1-.602 1.188 4.13 4.13 0 0 1-.91.992l1.381.61-.26 1-1.56-.703a1.045 1.045 0 0 1-.406-.32.958.958 0 0 1-.195-.477c-.01-.177.016-.344.082-.5a1.03 1.03 0 0 1 .308-.406c.564-.417.962-1.008 1.195-1.774.233-.765.349-1.388.349-1.867V6.5c0-.27-.108-.552-.325-.844a3.757 3.757 0 0 0-.837-.804 4.941 4.941 0 0 0-1.162-.61A3.744 3.744 0 0 0 11.32 4c-.444 0-.883.08-1.316.242a4.932 4.932 0 0 0-1.17.617 3.65 3.65 0 0 0-.837.813c-.211.292-.317.568-.317.828V9c0 .49.127 1.115.382 1.875.254.76.653 1.349 1.194 1.766a.969.969 0 0 1 .195 1.367c-.108.14-.243.247-.406.32l-4.566 2.078a1.041 1.041 0 0 0-.268.157c-.114.083-.171.223-.171.421zM18.5 16a.48.48 0 0 1 .352.148.48.48 0 0 1 .148.352.48.48 0 0 1-.148.352.48.48 0 0 1-.352.148H17v1.5a.48.48 0 0 1-.148.352.48.48 0 0 1-.352.148.48.48 0 0 1-.352-.148A.48.48 0 0 1 16 18.5V17h-1.5a.48.48 0 0 1-.352-.148A.48.48 0 0 1 14 16.5a.48.48 0 0 1 .148-.352A.48.48 0 0 1 14.5 16H16v-1.5a.48.48 0 0 1 .148-.352A.48.48 0 0 1 16.5 14a.48.48 0 0 1 .352.148.48.48 0 0 1 .148.352V16h1.5z",
        fill: "currentColor"
      })
    )
  );
};

var Notifications = function Notifications(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M17.271 13.367c.254.313.455.591.601.835a.731.731 0 0 1 .044.733.718.718 0 0 1-.571.424c-.264.04-.469.059-.616.059H13.99c0 .693-.244 1.284-.732 1.772a2.414 2.414 0 0 1-1.773.733 2.414 2.414 0 0 1-1.772-.733 2.414 2.414 0 0 1-.733-1.772H6.3c-.225 0-.457-.027-.696-.08a.732.732 0 0 1-.52-.403c-.117-.245-.107-.496.03-.755a6.56 6.56 0 0 1 .556-.857c.264-.342.552-.73.864-1.164.313-.435.469-.887.469-1.355V7.742c0-.664.115-1.286.344-1.867.23-.582.545-1.09.945-1.524.4-.434.874-.776 1.42-1.025a4.191 4.191 0 0 1 1.759-.374c.634 0 1.225.125 1.772.374a4.46 4.46 0 0 1 1.428 1.025c.406.435.723.942.953 1.524a5.04 5.04 0 0 1 .344 1.867v3.062c0 .478.149.942.447 1.391.297.45.583.84.856 1.172zm-5.786 3.574c.42 0 .78-.149 1.077-.446.298-.298.447-.657.447-1.077H9.962c0 .42.149.779.447 1.077.298.297.656.446 1.076.446zm5.347-2.52a8.139 8.139 0 0 0-.337-.425c-.322-.39-.657-.856-1.003-1.398a3.262 3.262 0 0 1-.52-1.794V7.742c0-.527-.09-1.02-.271-1.48a3.85 3.85 0 0 0-.74-1.2 3.511 3.511 0 0 0-1.106-.813c-.425-.2-.886-.3-1.384-.3-.489 0-.945.1-1.37.3-.425.2-.793.47-1.106.813a3.744 3.744 0 0 0-.732 1.2 4.102 4.102 0 0 0-.264 1.48v3.062c0 .634-.183 1.218-.55 1.75a46.606 46.606 0 0 1-1.157 1.619c-.063.088-.12.17-.168.249h10.708z",
        fill: "currentColor"
      })
    )
  );
};

var Permissions = function Permissions(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement(
        "g",
        { stroke: "currentColor" },
        React.createElement("path", {
          d: "M11.036 3.143L3.578 6.357V7.43h14.916V6.357l-7.458-3.214zm6.88 12.393H4.071c-.318 0-.577.242-.577.535v1.072h15V16.07c0-.293-.26-.535-.578-.535z",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        React.createElement("path", { d: "M5 7v8.034M8 7v8.275M11 7v8.034M14 7v8.275M17 7v8.275" })
      )
    )
  );
};

var Remove = function Remove(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M11 4.744c1.216 0 2.341.304 3.376.912a6.308 6.308 0 0 1 2.368 2.368 6.546 6.546 0 0 1 .912 3.376 6.546 6.546 0 0 1-.912 3.376 6.308 6.308 0 0 1-2.368 2.368 6.546 6.546 0 0 1-3.376.912 6.546 6.546 0 0 1-3.376-.912 6.428 6.428 0 0 1-2.368-2.384 6.517 6.517 0 0 1-.912-3.36c0-1.205.304-2.325.912-3.36A6.55 6.55 0 0 1 7.64 5.656 6.517 6.517 0 0 1 11 4.744z",
        stroke: "currentColor"
      }),
      React.createElement("path", { fill: "currentColor", d: "M14.344 10.744v1.312H7.656v-1.312z" })
    )
  );
};

var Settings = function Settings(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M18.063 9.08c.224.038.437.148.637.329.2.18.3.403.3.666v.938c0 .254-.1.459-.3.615-.2.156-.413.264-.637.322l-1.216.293a6.84 6.84 0 0 1-.154.418 4.008 4.008 0 0 1-.183.388l.644 1.084c.127.195.205.42.235.674a.766.766 0 0 1-.235.659l-.659.659a.847.847 0 0 1-.674.256 1.38 1.38 0 0 1-.688-.212l-1.055-.674a7.697 7.697 0 0 1-.41.19 4.595 4.595 0 0 1-.44.162l-.263 1.216a1.29 1.29 0 0 1-.33.637c-.18.2-.403.3-.666.3h-.938a.743.743 0 0 1-.615-.3 1.749 1.749 0 0 1-.322-.637L9.8 15.86a6.001 6.001 0 0 1-.469-.168 4.816 4.816 0 0 1-.454-.213l-1.084.689a1.308 1.308 0 0 1-.681.212.813.813 0 0 1-.667-.256l-.674-.66a.785.785 0 0 1-.22-.658c.03-.254.103-.479.22-.674l.689-1.143a8.068 8.068 0 0 1-.169-.359 3.029 3.029 0 0 1-.139-.388l-1.215-.293a1.749 1.749 0 0 1-.638-.322.743.743 0 0 1-.3-.615v-.938c0-.263.1-.486.3-.666.2-.181.413-.29.638-.33l1.2-.264a3.44 3.44 0 0 1 .147-.41c.059-.136.117-.268.176-.395l-.689-1.143a1.664 1.664 0 0 1-.22-.674.785.785 0 0 1 .22-.659l.674-.659a.813.813 0 0 1 .667-.256c.268.014.495.085.68.212l1.085.689a5.325 5.325 0 0 1 .908-.381l.308-1.202a1.58 1.58 0 0 1 .307-.637.76.76 0 0 1 .63-.3h.938c.263 0 .483.1.659.3.176.2.288.408.337.623l.264 1.23a6.533 6.533 0 0 1 .85.352l1.054-.674a1.38 1.38 0 0 1 .688-.212.847.847 0 0 1 .674.256l.66.66a.766.766 0 0 1 .234.658 1.55 1.55 0 0 1-.235.674l-.644 1.084c.068.137.134.276.198.418.063.141.114.29.153.446l1.201.264zm0 1.86l.014-.836a.515.515 0 0 0-.205-.102l-1.743-.396-.161-.512a2.474 2.474 0 0 0-.117-.352 4.109 4.109 0 0 0-.176-.366l-.235-.469.923-1.538a.474.474 0 0 0 .066-.117.28.28 0 0 0 .022-.088l-.615-.6a.348.348 0 0 0-.19.058l-1.51.967-.483-.25a11.505 11.505 0 0 0-.351-.168 1.904 1.904 0 0 0-.366-.124l-.513-.176-.381-1.772a.431.431 0 0 0-.044-.11l-.03-.051h-.864a.34.34 0 0 0-.058.087.52.52 0 0 0-.044.147l-.425 1.7-.498.16a4.51 4.51 0 0 0-.762.322l-.483.25-1.567-.997-.074-.036a.671.671 0 0 0-.088-.037l-.615.615c0 .03.008.064.022.103a.898.898 0 0 0 .066.132l.952 1.582-.234.454a8.76 8.76 0 0 0-.154.351 2.79 2.79 0 0 0-.11.323l-.16.512-1.773.396a.537.537 0 0 0-.096.044.199.199 0 0 1-.066.03v.863c.02.02.05.037.088.052a.81.81 0 0 0 .147.036l1.714.44.16.498a3.144 3.144 0 0 0 .265.615l.22.454-.953 1.597a.474.474 0 0 0-.066.117.298.298 0 0 0-.022.103l.615.6c.03 0 .062-.007.096-.022a.59.59 0 0 0 .095-.051l1.538-.982.483.25a4.51 4.51 0 0 0 .762.322l.498.16.44 1.73c.01.048.022.09.036.124a.254.254 0 0 0 .051.08h.85a.515.515 0 0 0 .103-.19l.38-1.743.513-.176a5.14 5.14 0 0 0 .703-.293l.484-.249 1.538.982.073.036a.72.72 0 0 0 .088.037l.615-.615a.298.298 0 0 0-.022-.103.826.826 0 0 0-.066-.132l-.923-1.523.235-.469c.058-.107.11-.217.154-.33.044-.112.085-.227.124-.344l.161-.483 1.743-.44a.635.635 0 0 0 .125-.036.254.254 0 0 0 .08-.052zM11.5 7.687c.781 0 1.448.273 2 .82a2.7 2.7 0 0 1 .827 1.992 2.7 2.7 0 0 1-.827 1.992 2.737 2.737 0 0 1-2 .82 2.72 2.72 0 0 1-1.985-.82 2.7 2.7 0 0 1-.828-1.992 2.7 2.7 0 0 1 .828-1.992 2.72 2.72 0 0 1 1.985-.82zm0 4.687c.518 0 .96-.183 1.326-.55.366-.366.549-.807.549-1.325 0-.518-.183-.96-.55-1.326a1.806 1.806 0 0 0-1.325-.549c-.518 0-.96.183-1.326.55a1.804 1.804 0 0 0-.549 1.325c0 .518.183.96.55 1.326.366.366.807.549 1.325.549z",
        fill: "currentColor"
      })
    )
  );
};

var Share = function Share(props) {
  return React.createElement(
    "svg",
    _extends({ width: 16, height: 14, viewBox: "0 0 16 14" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M-3-4h22v22H-3z" }),
      React.createElement("path", {
        d: "M.531 13.719a.44.44 0 0 1-.312-.117.522.522 0 0 1-.157-.305c0-.042-.018-.3-.054-.774-.037-.474-.013-1.054.07-1.742.083-.687.258-1.43.524-2.226A6.74 6.74 0 0 1 1.89 6.313 6.89 6.89 0 0 1 3.125 5.18a7.514 7.514 0 0 1 1.523-.836 9.899 9.899 0 0 1 1.797-.54c.64-.13 1.326-.205 2.055-.226L8.516.781a.48.48 0 0 1 .078-.273.52.52 0 0 1 .203-.18.537.537 0 0 1 .281-.047c.094.01.177.047.25.11l6.485 5.312a.513.513 0 0 1 .187.39.498.498 0 0 1-.188.391L9.329 11.86a.453.453 0 0 1-.25.11.537.537 0 0 1-.281-.047.501.501 0 0 1-.203-.188.493.493 0 0 1-.078-.265L8.5 8.594c-1.75 0-3.125.234-4.125.703s-1.75.99-2.25 1.562c-.5.573-.815 1.107-.945 1.602-.13.495-.196.763-.196.805a.538.538 0 0 1-.132.32.387.387 0 0 1-.305.133H.53zm8.485-6.125c.062 0 .125.013.187.039a.72.72 0 0 1 .172.101.777.777 0 0 1 .102.164.473.473 0 0 1 .039.196v2.312l5.203-4.312-5.203-4.266v2.25a.48.48 0 0 1-.149.352.48.48 0 0 1-.351.148c-.709 0-1.375.05-2 .149a8.793 8.793 0 0 0-1.743.453 7.012 7.012 0 0 0-1.46.75 5.65 5.65 0 0 0-1.157 1.039 6.162 6.162 0 0 0-1.148 1.89 8.291 8.291 0 0 0-.492 1.922c.27-.375.604-.752 1-1.133.395-.38.903-.72 1.523-1.023.62-.302 1.375-.55 2.266-.742.89-.193 1.96-.29 3.21-.29z",
        fill: "currentColor"
      })
    )
  );
};

var Time = function Time(props) {
  return React.createElement(
    "svg",
    _extends({ width: 13, height: 13, viewBox: "0 0 13 13" }, props),
    React.createElement("path", {
      d: "M6.5 11.76c.8 0 1.535-.2 2.205-.6.66-.39 1.185-.92 1.575-1.59.39-.67.585-1.405.585-2.205S10.67 5.83 10.28 5.16a4.403 4.403 0 0 0-1.575-1.575A4.305 4.305 0 0 0 6.5 3c-.8 0-1.535.195-2.205.585-.66.39-1.185.915-1.575 1.575a4.305 4.305 0 0 0-.585 2.205c0 .8.195 1.535.585 2.205.39.67.915 1.2 1.575 1.59.67.4 1.405.6 2.205.6zm0-10.02c1.03 0 1.98.255 2.85.765.85.49 1.52 1.16 2.01 2.01.51.87.765 1.82.765 2.85s-.255 1.98-.765 2.85c-.49.85-1.16 1.52-2.01 2.01-.87.51-1.82.765-2.85.765s-1.98-.255-2.85-.765a5.386 5.386 0 0 1-2.01-2.01 5.535 5.535 0 0 1-.765-2.85c0-1.03.255-1.98.765-2.85.49-.85 1.16-1.52 2.01-2.01.87-.51 1.82-.765 2.85-.765zm.33 2.52v3.315L9.32 9.06l-.51.765L5.885 8.01V4.26h.945zM3.95 1.395l-2.895 2.37L.26 2.82 3.125.45l.825.945zm8.79 1.425l-.795.945-2.895-2.46.825-.945 2.865 2.46z",
      fill: "#6D777B",
      fillRule: "evenodd",
      opacity: 0.75
    })
  );
};

var Wallet = function Wallet(props) {
  return React.createElement(
    "svg",
    _extends({ width: 22, height: 22, viewBox: "0 0 22 22" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M0 0h22v22H0z" }),
      React.createElement("path", {
        d: "M19 7.186v8.642c0 .39-.137.723-.41.996-.274.274-.606.41-.996.41H5.406c-.39 0-.722-.136-.996-.41a1.356 1.356 0 0 1-.41-.996v-7.5c0-.38.137-.708.41-.981.274-.274.6-.415.982-.425h.468V5.047c0-.39.14-.723.418-.996a1.36 1.36 0 0 1 .989-.41l10.59 2.109c.528.146.85.38.967.703.117.322.176.567.176.733zM6.798 5.046v1.876h10.327c.186.01.308-.03.366-.117l.088-.132L7.237 4.578a.467.467 0 0 0-.44.469zm11.264 10.782V7.391c0 .156-.1.273-.3.351-.2.078-.412.117-.637.117H5.406a.45.45 0 0 0-.33.14.45.45 0 0 0-.138.33v7.5a.45.45 0 0 0 .139.329.45.45 0 0 0 .33.139h12.187a.45.45 0 0 0 .33-.14.45.45 0 0 0 .139-.329zm-11.25-4.687c.254 0 .474.092.66.278a.901.901 0 0 1 .278.66.894.894 0 0 1-.278.666.913.913 0 0 1-.66.27.906.906 0 0 1-.666-.27.906.906 0 0 1-.271-.667c0-.254.09-.474.271-.66a.894.894 0 0 1 .667-.277z",
        fill: "currentColor"
      })
    )
  );
};

/* eslint-disable prettier/prettier */

var aragon = {
  Grey: {
    'Black Ash': '#3B3B3B',
    'Dim Grey': '#707070',
    'Dust Grey': '#969696',
    'Light Grey': '#B3B3B3',
    Gainsboro: '#E6E6E6',
    Alabaster: '#F2F2F2'
  },
  Rain: {
    Shark: '#1F2323',
    Atomic: '#455559',
    Slate: '#6D8088',
    'Aqua Island': '#9ECDDB',
    'Rain Sky': '#DCEAEF',
    'Aqua Blue': '#F7FBFD'
  },
  Blue: {
    Lochmara: '#028BCF',
    Danube: '#7FADDC',
    Spindle: '#B3CFEA',
    Solitude: '#ECF8FE'
  },
  Sea: {
    'Light Sea': '#21B7C4',
    Turquoise: '#50E2C3',
    'Blizzard Blue': '#ACECE7'
  },
  Purple: {
    Indigo: '#4A2DBE',
    Portage: '#A684F5',
    Lavender: '#EDE5FF'
  },
  Eagle: {
    'Dark Cerulean': '#00A4D1',
    Cerulean: '#00B4E6',
    'Dark Turquoise': '#00CBE6',
    'Dark Opal': '#00DBCD',
    Opal: '#00F0E0'
  },
  Gold: {
    Brandy: '#DAC08B',
    Beige: '#FFF9EB'
  },
  Red: {
    'Salmon Red': '#FB7979'
  },
  Green: {
    'Spring Green': '#21D48F'
  },
  Black: {
    Black: '#000000'
  },
  White: {
    White: '#FFFFFF'
  },
  'Aragon Brand': {
    Primary: '=Purple.Indigo',
    Secondary: '=Sea.Turquoise',
    'Black Ash': '=Grey.Black Ash',
    'Gradient Start': '=Eagle.Cerulean',
    'Gradient End': '=Eagle.Opal'
  },
  'Aragon UI': {
    gradientStart: '=Eagle.Cerulean',
    gradientEnd: '=Eagle.Opal',
    gradientStartActive: '=Eagle.Dark Cerulean',
    gradientEndActive: '=Eagle.Dark Opal',
    gradientText: '=White.White',
    mainBackground: '=Rain.Aqua Blue',
    mainBgGradientStart: '=Rain.Rain Sky',
    mainBgGradientEnd: '=Rain.Aqua Blue',
    secondaryBackground: '=Rain.Rain Sky',
    contentBackground: '=White.White',
    contentBackgroundActive: '=Grey.Alabaster',
    contentBorder: '=Grey.Gainsboro',
    contentBorderActive: '=Grey.Light Grey',
    disabled: '=Grey.Gainsboro',
    disabledText: '=White.White',
    infoBackground: '=Blue.Solitude',
    infoPermissionsBackground: '=Gold.Beige',
    infoPermissionsIcon: '=Gold.Brandy',
    shadow: '=Grey.Alabaster',
    text: '=Black.Black',
    textPrimary: '=Aragon UI.text',
    textDimmed: '=Grey.Black Ash',
    textSecondary: '=Grey.Dim Grey',
    textTertiary: '=Grey.Light Grey',
    accent: '=Eagle.Dark Turquoise',
    positive: '=Green.Spring Green',
    positiveText: '=White.White',
    negative: '=Red.Salmon Red',
    negativeText: '=White.White',
    badgeAppBackground: '=Purple.Lavender',
    badgeAppForeground: '=Purple.Portage',
    badgeIdentityBackground: '=Rain.Rain Sky',
    badgeIdentityForeground: '=Rain.Slate',
    badgeNotificationBackground: '=Aragon UI.positive',
    badgeNotificationForeground: '=Aragon UI.positiveText',
    badgeInfoBackground: '=Rain.Rain Sky',
    badgeInfoForeground: '=Rain.Slate'
  },
  'Aragon UI Dark': {
    gradientStart: '=Eagle.Cerulean',
    gradientEnd: '=Eagle.Opal',
    gradientStartActive: '=Eagle.Dark Cerulean',
    gradientEndActive: '=Eagle.Dark Opal',
    gradientText: '=White.White',
    mainBackground: '=Rain.Aqua Blue',
    mainBgGradientStart: '=Rain.Rain Sky',
    mainBgGradientEnd: '=Rain.Aqua Blue',
    secondaryBackground: '=Rain.Rain Sky',
    contentBackground: '=Rain.Shark',
    contentBackgroundActive: '=Grey.Alabaster',
    contentBorder: '=Grey.Gainsboro',
    contentBorderActive: '=Grey.Light Grey',
    disabled: '=Grey.Light Grey',
    disabledText: '=Grey.Dim Grey',
    infoBackground: '=Blue.Solitude',
    infoPermissionsBackground: '=Gold.Beige',
    infoPermissionsIcon: '=Gold.Brandy',
    shadow: '=Grey.Alabaster',
    text: '=White.White',
    textPrimary: '=Aragon UI Dark.text',
    textDimmed: '=Grey.Alabaster',
    textSecondary: '=Grey.Dust Grey',
    textTertiary: '=Grey.Dim Grey',
    accent: '=Eagle.Dark Turquoise',
    positive: '=Green.Spring Green',
    positiveText: '=White.White',
    negative: '=Red.Salmon Red',
    negativeText: '=White.White',
    badgeAppBackground: '=Purple.Lavender',
    badgeAppForeground: '=Purple.Portage',
    badgeIdentityBackground: '=Rain.Rain Sky',
    badgeIdentityForeground: '=Rain.Slate',
    badgeNotificationBackground: '=Aragon UI Dark.positive',
    badgeNotificationForeground: '=Aragon UI Dark.positiveText',
    badgeInfoBackground: '=Rain.Rain Sky',
    badgeInfoForeground: '=Rain.Slate'
  }
};

// These need to match the names in the Open Color palettes

var THEME_NAME = 'Aragon UI';
var THEME_DARK_NAME = 'Aragon UI Dark';
var BRAND_NAME = 'Aragon Brand';

// Name of the group a given palette belong to
var getGroupName = function getGroupName(name) {
  if (name === THEME_NAME) return 'theme';
  if (name === THEME_DARK_NAME) return 'themeDark';
  if (name === BRAND_NAME) return 'brand';
  return 'colors';
};

// Resolve a single color
var resolveColor = function resolveColor(value, palettes) {
  // already resolved color
  if (!value.startsWith('=')) {
    return value;
  }

  var _value$slice$split = value.slice(1).split('.'),
      _value$slice$split2 = slicedToArray(_value$slice$split, 2),
      paletteName = _value$slice$split2[0],
      key = _value$slice$split2[1];

  var color = palettes[paletteName] && palettes[paletteName][key];

  if (!color) {
    throw new Error('resolveColor: ' + value + ' doesn\u2019t seem to exist');
  }

  // follow the references until we find one
  if (color.startsWith('=')) {
    return resolveColor(color, palettes);
  }
  return color;
};

// Resolve all the colors in a palette
var resolveColors = function resolveColors(palette, palettes) {
  return Object.entries(palette).reduce(function (pal, _ref) {
    var _ref2 = slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    if (typeof value === 'string') {
      pal[name] = resolveColor(value, palettes);
    }
    return pal;
  }, {});
};

// Prepare groups from the palettes: theme, themeDark, brand and colors.
var groups = function groups(palettes) {
  return Object.entries(palettes).reduce(function (groups, _ref3) {
    var _ref4 = slicedToArray(_ref3, 2),
        paletteName = _ref4[0],
        palette = _ref4[1];

    var groupName = getGroupName(paletteName);

    if (groupName === 'colors') {
      groups.colors[paletteName] = resolveColors(palette, palettes);
    } else {
      groups[groupName] = resolveColors(palette, palettes);
    }

    return groups;
  }, { colors: {} });
};

var _groups = groups(aragon);
var themeDark = _groups.themeDark;
var theme = _groups.theme;
var brand = _groups.brand;
var colors = _groups.colors;

function toInteger (dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number)
}

var MILLISECONDS_IN_MINUTE$1 = 60000;

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds (dirtyDate) {
  var date = new Date(dirtyDate.getTime());
  var baseTimezoneOffset = date.getTimezoneOffset();
  date.setSeconds(0, 0);
  var millisecondsPartOfTimezoneOffset = date.getTime() % MILLISECONDS_IN_MINUTE$1;

  return baseTimezoneOffset * MILLISECONDS_IN_MINUTE$1 + millisecondsPartOfTimezoneOffset
}

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var DEFAULT_ADDITIONAL_DIGITS = 2;

var patterns = {
  dateTimeDelimeter: /[T ]/,
  plainTime: /:/,
  timeZoneDelimeter: /[Z ]/i,

  // year tokens
  YY: /^(\d{2})$/,
  YYY: [
    /^([+-]\d{2})$/, // 0 additional digits
    /^([+-]\d{3})$/, // 1 additional digit
    /^([+-]\d{4})$/ // 2 additional digits
  ],
  YYYY: /^(\d{4})/,
  YYYYY: [
    /^([+-]\d{4})/, // 0 additional digits
    /^([+-]\d{5})/, // 1 additional digit
    /^([+-]\d{6})/ // 2 additional digits
  ],

  // date tokens
  MM: /^-(\d{2})$/,
  DDD: /^-?(\d{3})$/,
  MMDD: /^-?(\d{2})-?(\d{2})$/,
  Www: /^-?W(\d{2})$/,
  WwwD: /^-?W(\d{2})-?(\d{1})$/,

  HH: /^(\d{2}([.,]\d*)?)$/,
  HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
  HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,

  // timezone tokens
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-])(\d{2})$/,
  timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
};

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If an argument is a string, the function tries to parse it.
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 * If the function cannot parse the string or the values are invalid, it returns Invalid Date.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 * All *date-fns* functions will throw `RangeError` if `options.additionalDigits` is not 0, 1, 2 or undefined.
 *
 * @param {Date|String|Number} argument - the value to convert
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - the additional number of digits in the extended year format
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * var result = toDate('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * var result = toDate('+02014101', {additionalDigits: 1})
 * //=> Fri Apr 11 2014 00:00:00
 */
function toDate (argument, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  if (argument === null) {
    return new Date(NaN)
  }

  var options = dirtyOptions || {};

  var additionalDigits = options.additionalDigits == null ? DEFAULT_ADDITIONAL_DIGITS : toInteger(options.additionalDigits);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError('additionalDigits must be 0, 1 or 2')
  }

  // Clone the date
  if (argument instanceof Date ||
    (typeof argument === 'object' && Object.prototype.toString.call(argument) === '[object Date]')
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime())
  } else if (typeof argument === 'number' || Object.prototype.toString.call(argument) === '[object Number]') {
    return new Date(argument)
  } else if (!(typeof argument === 'string' || Object.prototype.toString.call(argument) === '[object String]')) {
    return new Date(NaN)
  }

  var dateStrings = splitDateString(argument);

  var parseYearResult = parseYear(dateStrings.date, additionalDigits);
  var year = parseYearResult.year;
  var restDateString = parseYearResult.restDateString;

  var date = parseDate(restDateString, year);

  if (isNaN(date)) {
    return new Date(NaN)
  }

  if (date) {
    var timestamp = date.getTime();
    var time = 0;
    var offset;

    if (dateStrings.time) {
      time = parseTime(dateStrings.time);

      if (isNaN(time)) {
        return new Date(NaN)
      }
    }

    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone);
      if (isNaN(offset)) {
        return new Date(NaN)
      }
    } else {
      // get offset accurate to hour in timezones that change offset
      offset = getTimezoneOffsetInMilliseconds(new Date(timestamp + time));
      offset = getTimezoneOffsetInMilliseconds(new Date(timestamp + time + offset));
    }

    return new Date(timestamp + time + offset)
  } else {
    return new Date(NaN)
  }
}

function splitDateString (dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimeter);
  var timeString;

  if (patterns.plainTime.test(array[0])) {
    dateStrings.date = null;
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimeter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimeter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }

  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], '');
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings
}

function parseYear (dateString, additionalDigits) {
  var patternYYY = patterns.YYY[additionalDigits];
  var patternYYYYY = patterns.YYYYY[additionalDigits];

  var token;

  // YYYY or ±YYYYY
  token = patterns.YYYY.exec(dateString) || patternYYYYY.exec(dateString);
  if (token) {
    var yearString = token[1];
    return {
      year: parseInt(yearString, 10),
      restDateString: dateString.slice(yearString.length)
    }
  }

  // YY or ±YYY
  token = patterns.YY.exec(dateString) || patternYYY.exec(dateString);
  if (token) {
    var centuryString = token[1];
    return {
      year: parseInt(centuryString, 10) * 100,
      restDateString: dateString.slice(centuryString.length)
    }
  }

  // Invalid ISO-formatted year
  return {
    year: null
  }
}

function parseDate (dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) {
    return null
  }

  var token;
  var date;
  var month;
  var week;

  // YYYY
  if (dateString.length === 0) {
    date = new Date(0);
    date.setUTCFullYear(year);
    return date
  }

  // YYYY-MM
  token = patterns.MM.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;

    if (!validateDate(year, month)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, month);
    return date
  }

  // YYYY-DDD or YYYYDDD
  token = patterns.DDD.exec(dateString);
  if (token) {
    date = new Date(0);
    var dayOfYear = parseInt(token[1], 10);

    if (!validateDayOfYearDate(year, dayOfYear)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, 0, dayOfYear);
    return date
  }

  // YYYY-MM-DD or YYYYMMDD
  token = patterns.MMDD.exec(dateString);
  if (token) {
    date = new Date(0);
    month = parseInt(token[1], 10) - 1;
    var day = parseInt(token[2], 10);

    if (!validateDate(year, month, day)) {
      return new Date(NaN)
    }

    date.setUTCFullYear(year, month, day);
    return date
  }

  // YYYY-Www or YYYYWww
  token = patterns.Www.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;

    if (!validateWeekDate(year, week)) {
      return new Date(NaN)
    }

    return dayOfISOWeekYear(year, week)
  }

  // YYYY-Www-D or YYYYWwwD
  token = patterns.WwwD.exec(dateString);
  if (token) {
    week = parseInt(token[1], 10) - 1;
    var dayOfWeek = parseInt(token[2], 10) - 1;

    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN)
    }

    return dayOfISOWeekYear(year, week, dayOfWeek)
  }

  // Invalid ISO-formatted date
  return null
}

function parseTime (timeString) {
  var token;
  var hours;
  var minutes;

  // hh
  token = patterns.HH.exec(timeString);
  if (token) {
    hours = parseFloat(token[1].replace(',', '.'));

    if (!validateTime(hours)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR
  }

  // hh:mm or hhmm
  token = patterns.HHMM.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseFloat(token[2].replace(',', '.'));

    if (!validateTime(hours, minutes)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR +
      minutes * MILLISECONDS_IN_MINUTE
  }

  // hh:mm:ss or hhmmss
  token = patterns.HHMMSS.exec(timeString);
  if (token) {
    hours = parseInt(token[1], 10);
    minutes = parseInt(token[2], 10);
    var seconds = parseFloat(token[3].replace(',', '.'));

    if (!validateTime(hours, minutes, seconds)) {
      return NaN
    }

    return (hours % 24) * MILLISECONDS_IN_HOUR +
      minutes * MILLISECONDS_IN_MINUTE +
      seconds * 1000
  }

  // Invalid ISO-formatted time
  return null
}

function parseTimezone (timezoneString) {
  var token;
  var absoluteOffset;

  // Z
  token = patterns.timezoneZ.exec(timezoneString);
  if (token) {
    return 0
  }

  var hours;

  // ±hh
  token = patterns.timezoneHH.exec(timezoneString);
  if (token) {
    hours = parseInt(token[2], 10);

    if (!validateTimezone(hours)) {
      return NaN
    }

    absoluteOffset = hours * MILLISECONDS_IN_HOUR;
    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
  }

  // ±hh:mm or ±hhmm
  token = patterns.timezoneHHMM.exec(timezoneString);
  if (token) {
    hours = parseInt(token[2], 10);
    var minutes = parseInt(token[3], 10);

    if (!validateTimezone(hours, minutes)) {
      return NaN
    }

    absoluteOffset = hours * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
  }

  return 0
}

function dayOfISOWeekYear (isoWeekYear, week, day) {
  week = week || 0;
  day = day || 0;
  var date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date
}

// Validation functions

var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex (year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
}

function validateDate (year, month, date) {
  if (month < 0 || month > 11) {
    return false
  }

  if (date != null) {
    if (date < 1) {
      return false
    }

    var isLeapYear = isLeapYearIndex(year);
    if (isLeapYear && date > DAYS_IN_MONTH_LEAP_YEAR[month]) {
      return false
    }
    if (!isLeapYear && date > DAYS_IN_MONTH[month]) {
      return false
    }
  }

  return true
}

function validateDayOfYearDate (year, dayOfYear) {
  if (dayOfYear < 1) {
    return false
  }

  var isLeapYear = isLeapYearIndex(year);
  if (isLeapYear && dayOfYear > 366) {
    return false
  }
  if (!isLeapYear && dayOfYear > 365) {
    return false
  }

  return true
}

function validateWeekDate (year, week, day) {
  if (week < 0 || week > 52) {
    return false
  }

  if (day != null && (day < 0 || day > 6)) {
    return false
  }

  return true
}

function validateTime (hours, minutes, seconds) {
  if (hours != null && (hours < 0 || hours >= 25)) {
    return false
  }

  if (minutes != null && (minutes < 0 || minutes >= 60)) {
    return false
  }

  if (seconds != null && (seconds < 0 || seconds >= 60)) {
    return false
  }

  return true
}

function validateTimezone (hours, minutes) {
  if (minutes != null && (minutes < 0 || minutes > 59)) {
    return false
  }

  return true
}

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds (dirtyDate, dirtyAmount, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var timestamp = toDate(dirtyDate, dirtyOptions).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount)
}

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Number} the number of milliseconds
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * var result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds (dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var dateLeft = toDate(dirtyDateLeft, dirtyOptions);
  var dateRight = toDate(dirtyDateRight, dirtyOptions);
  return dateLeft.getTime() - dateRight.getTime()
}

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param {Date|String|Number} dateLeft - the later date
 * @param {Date|String|Number} dateRight - the earlier date
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Number} the number of seconds
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * var result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds (dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight, dirtyOptions) / 1000;
  return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
}

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {*} date - the date to check
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the date is valid
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // For the valid date:
 * var result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * var result = isValid('2014-02-31')
 * //=> true
 *
 * @example
 * // For the invalid date:
 * var result = isValid(new Date(''))
 * //=> false
 */
function isValid (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  return !isNaN(date)
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },

  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },

  halfAMinute: 'half a minute',

  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },

  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },

  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },

  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },

  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },

  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },

  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },

  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },

  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },

  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },

  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};

function formatDistance (token, count, options) {
  options = options || {};

  var result;
  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token];
  } else if (count === 1) {
    result = formatDistanceLocale[token].one;
  } else {
    result = formatDistanceLocale[token].other.replace('{{count}}', count);
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      return result + ' ago'
    }
  }

  return result
}

function buildFormatLongFn (args) {
  return function (dirtyOptions) {
    var options = dirtyOptions || {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format
  }
}

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};

var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};

var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};

var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full'
  }),

  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full'
  }),

  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};

var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};

function formatRelative (token, date, baseDate, options) {
  return formatRelativeLocale[token]
}

function buildLocalizeFn (args) {
  return function (dirtyIndex, dirtyOptions) {
    var options = dirtyOptions || {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var context = options.context ? String(options.context) : 'standalone';

    var valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      valuesArray = args.formattingValues[width] || args.formattingValues[args.defaultFormattingWidth];
    } else {
      valuesArray = args.values[width] || args.values[args.defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index]
  }
}

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};

var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};

function ordinalNumber (dirtyNumber, dirtyOptions) {
  var number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`:
  //
  //   var options = dirtyOptions || {}
  //   var unit = String(options.unit)
  //
  // where `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'

  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st'
      case 2:
        return number + 'nd'
      case 3:
        return number + 'rd'
    }
  }
  return number + 'th'
}

var localize = {
  ordinalNumber: ordinalNumber,

  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: 'wide'
  }),

  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function (quarter) {
      return Number(quarter) - 1
    }
  }),

  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: 'wide'
  }),

  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: 'wide'
  }),

  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaulFormattingWidth: 'wide'
  })
};

function buildMatchPatternFn (args) {
  return function (dirtyString, dirtyOptions) {
    var string = String(dirtyString);
    var options = dirtyOptions || {};

    var matchResult = string.match(args.matchPattern);
    if (!matchResult) {
      return null
    }
    var matchedString = matchResult[0];

    var parseResult = string.match(args.parsePattern);
    if (!parseResult) {
      return null
    }
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;

    return {
      value: value,
      rest: string.slice(matchedString.length)
    }
  }
}

function buildMatchFn (args) {
  return function (dirtyString, dirtyOptions) {
    var string = String(dirtyString);
    var options = dirtyOptions || {};
    var width = options.width;

    var matchPattern = (width && args.matchPatterns[width]) || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null
    }
    var matchedString = matchResult[0];

    var parsePatterns = (width && args.parsePatterns[width]) || args.parsePatterns[args.defaultParseWidth];

    var value;
    if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
      value = parsePatterns.findIndex(function (pattern) {
        return pattern.test(string)
      });
    } else {
      value = findKey(parsePatterns, function (pattern) {
        return pattern.test(string)
      });
    }

    value = args.valueCallback ? args.valueCallback(value) : value;
    value = options.valueCallback ? options.valueCallback(value) : value;

    return {
      value: value,
      rest: string.slice(matchedString.length)
    }
  }
}

function findKey (object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key
    }
  }
}

var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;

var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};

var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};

var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};

var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};

var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};

var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function (value) {
      return parseInt(value, 10)
    }
  }),

  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),

  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function (index) {
      return index + 1
    }
  }),

  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),

  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),

  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};

/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
 */
var locale = {
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1
  }
};

var MILLISECONDS_IN_DAY$1 = 86400000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCDayOfYear (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY$1) + 1
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCISOWeek (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var weekStartsOn = 1;

  var date = toDate(dirtyDate, dirtyOptions);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCISOWeekYear (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var year = date.getUTCFullYear();

  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear, dirtyOptions);

  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear, dirtyOptions);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year
  } else {
    return year - 1
  }
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCISOWeekYear (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var year = getUTCISOWeekYear(dirtyDate, dirtyOptions);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary, dirtyOptions);
  return date
}

var MILLISECONDS_IN_WEEK$2 = 604800000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCISOWeek (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var diff = startOfUTCISOWeek(date, dirtyOptions).getTime() - startOfUTCISOWeekYear(date, dirtyOptions).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK$2) + 1
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCWeek (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
  }

  var date = toDate(dirtyDate, options);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCWeekYear (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var year = date.getUTCFullYear();

  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale &&
    locale.options &&
    locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate =
    localeFirstWeekContainsDate == null
      ? 1
      : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate =
    options.firstWeekContainsDate == null
      ? defaultFirstWeekContainsDate
      : toInteger(options.firstWeekContainsDate);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively')
  }

  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);

  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year
  } else {
    return year - 1
  }
}

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function startOfUTCWeekYear (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale &&
    locale.options &&
    locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate =
    localeFirstWeekContainsDate == null
      ? 1
      : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate =
    options.firstWeekContainsDate == null
      ? defaultFirstWeekContainsDate
      : toInteger(options.firstWeekContainsDate);

  var year = getUTCWeekYear(dirtyDate, dirtyOptions);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, dirtyOptions);
  return date
}

var MILLISECONDS_IN_WEEK$3 = 604800000;

// This function will be a part of public API when UTC function will be implemented.
// See issue: https://github.com/date-fns/date-fns/issues/376
function getUTCWeek (dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
  }

  var date = toDate(dirtyDate, dirtyOptions);
  var diff = startOfUTCWeek(date, dirtyOptions).getTime() - startOfUTCWeekYear(date, dirtyOptions).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK$3) + 1
}

var dayPeriodEnum = {
  am: 'am',
  pm: 'pm',
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
};

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

var formatters = {
  // Era
  G: function (date, token, localize) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, {width: 'abbreviated'})
      // A, B
      case 'GGGGG':
        return localize.era(era, {width: 'narrow'})
      // Anno Domini, Before Christ
      case 'GGGG':
      default:
        return localize.era(era, {width: 'wide'})
    }
  },

  // Year
  y: function (date, token, localize, options) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    var signedYear = date.getUTCFullYear();

    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    var year = signedYear > 0 ? signedYear : 1 - signedYear;

    // Two digit year
    if (token === 'yy') {
      var twoDigitYear = year % 100;
      return addLeadingZeros(twoDigitYear, 2)
    }

    // Ordinal number
    if (token === 'yo') {
      return localize.ordinalNumber(year, {unit: 'year'})
    }

    // Padding
    return addLeadingZeros(year, token.length)
  },

  // Local week-numbering year
  Y: function (date, token, localize, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === 'YY') {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2)
    }

    // Ordinal number
    if (token === 'Yo') {
      return localize.ordinalNumber(weekYear, {unit: 'year'})
    }

    // Padding
    return addLeadingZeros(weekYear, token.length)
  },

  // ISO week-numbering year
  R: function (date, token, localize, options) {
    var isoWeekYear = getUTCISOWeekYear(date, options);

    // Padding
    return addLeadingZeros(isoWeekYear, token.length)
  },

  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function (date, token, localize, options) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length)
  },

  // Quarter
  Q: function (date, token, localize, options) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'Q':
        return String(quarter)
      // 01, 02, 03, 04
      case 'QQ':
        return addLeadingZeros(quarter, 2)
      // 1st, 2nd, 3rd, 4th
      case 'Qo':
        return localize.ordinalNumber(quarter, {unit: 'quarter'})
      // Q1, Q2, Q3, Q4
      case 'QQQ':
        return localize.quarter(quarter, {width: 'abbreviated', context: 'formatting'})
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'QQQQQ':
        return localize.quarter(quarter, {width: 'narrow', context: 'formatting'})
      // 1st quarter, 2nd quarter, ...
      case 'QQQQ':
      default:
        return localize.quarter(quarter, {width: 'wide', context: 'formatting'})
    }
  },

  // Stand-alone quarter
  q: function (date, token, localize, options) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'q':
        return String(quarter)
      // 01, 02, 03, 04
      case 'qq':
        return addLeadingZeros(quarter, 2)
      // 1st, 2nd, 3rd, 4th
      case 'qo':
        return localize.ordinalNumber(quarter, {unit: 'quarter'})
      // Q1, Q2, Q3, Q4
      case 'qqq':
        return localize.quarter(quarter, {width: 'abbreviated', context: 'standalone'})
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'qqqqq':
        return localize.quarter(quarter, {width: 'narrow', context: 'standalone'})
      // 1st quarter, 2nd quarter, ...
      case 'qqqq':
      default:
        return localize.quarter(quarter, {width: 'wide', context: 'standalone'})
    }
  },

  // Month
  M: function (date, token, localize, options) {
    var month = date.getUTCMonth();
    switch (token) {
      // 1, 2, ..., 12
      case 'M':
        return String(month + 1)
      // 01, 02, ..., 12
      case 'MM':
        return addLeadingZeros(month + 1, 2)
      // 1st, 2nd, ..., 12th
      case 'Mo':
        return localize.ordinalNumber(month + 1, {unit: 'month'})
      // Jan, Feb, ..., Dec
      case 'MMM':
        return localize.month(month, {width: 'abbreviated', context: 'formatting'})
      // J, F, ..., D
      case 'MMMMM':
        return localize.month(month, {width: 'narrow', context: 'formatting'})
      // January, February, ..., December
      case 'MMMM':
      default:
        return localize.month(month, {width: 'wide', context: 'formatting'})
    }
  },

  // Stand-alone month
  L: function (date, token, localize, options) {
    var month = date.getUTCMonth();
    switch (token) {
      // 1, 2, ..., 12
      case 'L':
        return String(month + 1)
      // 01, 02, ..., 12
      case 'LL':
        return addLeadingZeros(month + 1, 2)
      // 1st, 2nd, ..., 12th
      case 'Lo':
        return localize.ordinalNumber(month + 1, {unit: 'month'})
      // Jan, Feb, ..., Dec
      case 'LLL':
        return localize.month(month, {width: 'abbreviated', context: 'standalone'})
      // J, F, ..., D
      case 'LLLLL':
        return localize.month(month, {width: 'narrow', context: 'standalone'})
      // January, February, ..., December
      case 'LLLL':
      default:
        return localize.month(month, {width: 'wide', context: 'standalone'})
    }
  },

  // Local week of year
  w: function (date, token, localize, options) {
    var week = getUTCWeek(date, options);

    if (token === 'wo') {
      return localize.ordinalNumber(week, {unit: 'week'})
    }

    return addLeadingZeros(week, token.length)
  },

  // ISO week of year
  I: function (date, token, localize, options) {
    var isoWeek = getUTCISOWeek(date, options);

    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, {unit: 'week'})
    }

    return addLeadingZeros(isoWeek, token.length)
  },

  // Day of the month
  d: function (date, token, localize, options) {
    var dayOfMonth = date.getUTCDate();

    if (token === 'do') {
      return localize.ordinalNumber(dayOfMonth, {unit: 'date'})
    }

    return addLeadingZeros(dayOfMonth, token.length)
  },

  // Day of year
  D: function (date, token, localize, options) {
    var dayOfYear = getUTCDayOfYear(date, options);

    if (token === 'Do') {
      return localize.ordinalNumber(dayOfYear, {unit: 'dayOfYear'})
    }

    return addLeadingZeros(dayOfYear, token.length)
  },

  // Day of week
  E: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      // Tue
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {width: 'abbreviated', context: 'formatting'})
      // T
      case 'EEEEE':
        return localize.day(dayOfWeek, {width: 'narrow', context: 'formatting'})
      // Tu
      case 'EEEEEE':
        return localize.day(dayOfWeek, {width: 'short', context: 'formatting'})
      // Tuesday
      case 'EEEE':
      default:
        return localize.day(dayOfWeek, {width: 'wide', context: 'formatting'})
    }
  },

  // Local day of week
  e: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = ((dayOfWeek - options.weekStartsOn + 8) % 7) || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case 'e':
        return String(localDayOfWeek)
      // Padded numerical value
      case 'ee':
        return addLeadingZeros(localDayOfWeek, 2)
      // 1st, 2nd, ..., 7th
      case 'eo':
        return localize.ordinalNumber(localDayOfWeek, {unit: 'day'})
      case 'eee':
        return localize.day(dayOfWeek, {width: 'abbreviated', context: 'formatting'})
      // T
      case 'eeeee':
        return localize.day(dayOfWeek, {width: 'narrow', context: 'formatting'})
      // Tu
      case 'eeeeee':
        return localize.day(dayOfWeek, {width: 'short', context: 'formatting'})
      // Tuesday
      case 'eeee':
      default:
        return localize.day(dayOfWeek, {width: 'wide', context: 'formatting'})
    }
  },

  // Stand-alone local day of week
  c: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = ((dayOfWeek - options.weekStartsOn + 8) % 7) || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case 'c':
        return String(localDayOfWeek)
      // Padded numberical value
      case 'cc':
        return addLeadingZeros(localDayOfWeek, token.length)
      // 1st, 2nd, ..., 7th
      case 'co':
        return localize.ordinalNumber(localDayOfWeek, {unit: 'day'})
      case 'ccc':
        return localize.day(dayOfWeek, {width: 'abbreviated', context: 'standalone'})
      // T
      case 'ccccc':
        return localize.day(dayOfWeek, {width: 'narrow', context: 'standalone'})
      // Tu
      case 'cccccc':
        return localize.day(dayOfWeek, {width: 'short', context: 'standalone'})
      // Tuesday
      case 'cccc':
      default:
        return localize.day(dayOfWeek, {width: 'wide', context: 'standalone'})
    }
  },

  // ISO day of week
  i: function (date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case 'i':
        return String(isoDayOfWeek)
      // 02
      case 'ii':
        return addLeadingZeros(isoDayOfWeek, token.length)
      // 2nd
      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, {unit: 'day'})
      // Tue
      case 'iii':
        return localize.day(dayOfWeek, {width: 'abbreviated', context: 'formatting'})
      // T
      case 'iiiii':
        return localize.day(dayOfWeek, {width: 'narrow', context: 'formatting'})
      // Tu
      case 'iiiiii':
        return localize.day(dayOfWeek, {width: 'short', context: 'formatting'})
      // Tuesday
      case 'iiii':
      default:
        return localize.day(dayOfWeek, {width: 'wide', context: 'formatting'})
    }
  },

  // AM or PM
  a: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = (hours / 12) >= 1 ? 'pm' : 'am';

    switch (token) {
      case 'a':
      case 'aa':
      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'abbreviated', context: 'formatting'})
      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'narrow', context: 'formatting'})
      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'wide', context: 'formatting'})
    }
  },

  // AM, PM, midnight, noon
  b: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = (hours / 12) >= 1 ? 'pm' : 'am';
    }

    switch (token) {
      case 'b':
      case 'bb':
      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'abbreviated', context: 'formatting'})
      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'narrow', context: 'formatting'})
      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'wide', context: 'formatting'})
    }
  },

  // in the morning, in the afternoon, in the evening, at night
  B: function (date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'abbreviated', context: 'formatting'})
      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'narrow', context: 'formatting'})
      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {width: 'wide', context: 'formatting'})
    }
  },

  // Hour [1-12]
  h: function (date, token, localize, options) {
    var hours = date.getUTCHours() % 12;

    if (hours === 0) {
      hours = 12;
    }

    if (token === 'ho') {
      return localize.ordinalNumber(hours, {unit: 'hour'})
    }

    return addLeadingZeros(hours, token.length)
  },

  // Hour [0-23]
  H: function (date, token, localize, options) {
    var hours = date.getUTCHours();

    if (token === 'Ho') {
      return localize.ordinalNumber(hours, {unit: 'hour'})
    }

    return addLeadingZeros(hours, token.length)
  },

  // Hour [0-11]
  K: function (date, token, localize, options) {
    var hours = date.getUTCHours() % 12;

    if (token === 'Ko') {
      return localize.ordinalNumber(hours, {unit: 'hour'})
    }

    return addLeadingZeros(hours, token.length)
  },

  // Hour [1-24]
  k: function (date, token, localize, options) {
    var hours = date.getUTCHours();

    if (hours === 0) {
      hours = 24;
    }

    if (token === 'ko') {
      return localize.ordinalNumber(hours, {unit: 'hour'})
    }

    return addLeadingZeros(hours, token.length)
  },

  // Minute
  m: function (date, token, localize, options) {
    var minutes = date.getUTCMinutes();

    if (token === 'mo') {
      return localize.ordinalNumber(minutes, {unit: 'minute'})
    }

    return addLeadingZeros(minutes, token.length)
  },

  // Second
  s: function (date, token, localize, options) {
    var seconds = date.getUTCSeconds();

    if (token === 'so') {
      return localize.ordinalNumber(seconds, {unit: 'second'})
    }

    return addLeadingZeros(seconds, token.length)
  },

  // Fraction of second
  S: function (date, token, localize, options) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, numberOfDigits)
  },

  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return 'Z'
    }

    switch (token) {
      // Hours and optional minutes
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)

      // Hours, minutes and optional seconds without `:` delimeter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case 'XXXX':
      case 'XX': // Hours and minutes without `:` delimeter
        return formatTimezone(timezoneOffset)

      // Hours, minutes and optional seconds with `:` delimeter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case 'XXXXX':
      case 'XXX': // Hours and minutes with `:` delimeter
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },

  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Hours and optional minutes
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)

      // Hours, minutes and optional seconds without `:` delimeter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case 'xxxx':
      case 'xx': // Hours and minutes without `:` delimeter
        return formatTimezone(timezoneOffset)

      // Hours, minutes and optional seconds with `:` delimeter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case 'xxxxx':
      case 'xxx': // Hours and minutes with `:` delimeter
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },

  // Timezone (GMT)
  O: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Short
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
      // Long
      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':')
    }
  },

  // Timezone (specific non-location)
  z: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      // Short
      case 'z':
      case 'zz':
      case 'zzz':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
      // Long
      case 'zzzz':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':')
    }
  },

  // Seconds timestamp
  t: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1000);
    return addLeadingZeros(timestamp, token.length)
  },

  // Milliseconds timestamp
  T: function (date, token, localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length)
  }
};

function addLeadingZeros (number, targetLength) {
  var sign = number < 0 ? '-' : '';
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return sign + output
}

function formatTimezone (offset, dirtyDelimeter) {
  var delimeter = dirtyDelimeter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimeter + minutes
}

function formatTimezoneWithOptionalMinutes (offset, dirtyDelimeter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? '-' : '+';
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2)
  }
  return formatTimezone(offset, dirtyDelimeter)
}

function formatTimezoneShort (offset, dirtyDelimeter) {
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours)
  }
  var delimeter = dirtyDelimeter || '';
  return sign + String(hours) + delimeter + addLeadingZeros(minutes, 2)
}

function dateLongFormatter (pattern, formatLong, options) {
  switch (pattern) {
    case 'P':
      return formatLong.date({width: 'short'})
    case 'PP':
      return formatLong.date({width: 'medium'})
    case 'PPP':
      return formatLong.date({width: 'long'})
    case 'PPPP':
    default:
      return formatLong.date({width: 'full'})
  }
}

function timeLongFormatter (pattern, formatLong, options) {
  switch (pattern) {
    case 'p':
      return formatLong.time({width: 'short'})
    case 'pp':
      return formatLong.time({width: 'medium'})
    case 'ppp':
      return formatLong.time({width: 'long'})
    case 'pppp':
    default:
      return formatLong.time({width: 'full'})
  }
}

function dateTimeLongFormatter (pattern, formatLong, options) {
  var matchResult = pattern.match(/(P+)(p+)?/);
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong, options)
  }

  var dateTimeFormat;

  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({width: 'short'});
      break
    case 'PP':
      dateTimeFormat = formatLong.dateTime({width: 'medium'});
      break
    case 'PPP':
      dateTimeFormat = formatLong.dateTime({width: 'long'});
      break
    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({width: 'full'});
      break
  }

  return dateTimeFormat
    .replace('{{date}}', dateLongFormatter(datePattern, formatLong, options))
    .replace('{{time}}', timeLongFormatter(timePattern, formatLong, options))
}

var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

/**
 * @name subMilliseconds
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * @param {Date|String|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be subtracted
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Date} the new date with the milliseconds subtracted
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */
function subMilliseconds (dirtyDate, dirtyAmount, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount, dirtyOptions)
}

const protectedTokens = ['D', 'DD', 'YY', 'YYYY'];

function isProtectedToken(token) {
  return protectedTokens.indexOf(token) !== -1
}

function throwProtectedError(token) {
  throw new RangeError(
    '`options.awareOfUnicodeTokens` must be set to `true` to use `' +
      token +
      '` token; see: https://git.io/fxCyr'
  )
}

// This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

var escapedStringRegExp = /^'(.*?)'?$/;
var doubleQuoteRegExp = /''/g;

/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://git.io/fxCyr
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 8     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 8     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Su            |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Su            | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Su, Sa        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Su            |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Su            |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
 * | AM, PM                          | a..aaa  | AM, PM                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bbb  | AM, PM, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 1, 2, ..., 11, 0                  |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 0001, ..., 999               |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 05/29/1453                        | 7     |
 * |                                 | PP      | May 29, 1453                      | 7     |
 * |                                 | PPP     | May 29th, 1453                    | 7     |
 * |                                 | PPPP    | Sunday, May 29th, 1453            | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 05/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | May 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | May 29th, 1453 at ...             | 7     |
 * |                                 | PPPPpppp| Sunday, May 29th, 1453 at ...     | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
 *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. These tokens are often confused with others. See: https://git.io/fxCyr
 *
 * @param {Date|String|Number} date - the original date
 * @param {String} format - the string of tokens
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {Boolean} [options.awareOfUnicodeTokens=false] - if true, allows usage of Unicode tokens causes confusion:
 *   - Some of the day of year tokens (`D`, `DD`) that are confused with the day of month tokens (`d`, `dd`).
 *   - Some of the local week-numbering year tokens (`YY`, `YYYY`) that are confused with the calendar year tokens (`yy`, `yyyy`).
 *   See: https://git.io/fxCyr
 * @returns {String} the formatted date string
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 * @throws {RangeError} `options.locale` must contain `localize` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
 * @throws {RangeError} `options.awareOfUnicodeTokens` must be set to `true` to use `XX` token; see: https://git.io/fxCyr
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * var result = format(
 *   new Date(2014, 1, 11),
 *   'MM/dd/yyyy'
 * )
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * var result = format(
 *   new Date(2014, 6, 2),
 *   "do 'de' MMMM yyyy",
 *   {locale: eoLocale}
 * )
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * var result = format(
 *   new Date(2014, 6, 2, 15),
 *   "h 'o''clock'"
 * )
 * //=> "3 o'clock"
 */
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError(
      '2 arguments required, but only ' + arguments.length + ' present'
    )
  }

  var formatStr = String(dirtyFormatStr);
  var options = dirtyOptions || {};

  var locale$$1 = options.locale || locale;

  var localeFirstWeekContainsDate =
    locale$$1.options && locale$$1.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate =
    localeFirstWeekContainsDate == null
      ? 1
      : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate =
    options.firstWeekContainsDate == null
      ? defaultFirstWeekContainsDate
      : toInteger(options.firstWeekContainsDate);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError(
      'firstWeekContainsDate must be between 1 and 7 inclusively'
    )
  }

  var localeWeekStartsOn = locale$$1.options && locale$$1.options.weekStartsOn;
  var defaultWeekStartsOn =
    localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn =
    options.weekStartsOn == null
      ? defaultWeekStartsOn
      : toInteger(options.weekStartsOn);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
  }

  if (!locale$$1.localize) {
    throw new RangeError('locale must contain localize property')
  }

  if (!locale$$1.formatLong) {
    throw new RangeError('locale must contain formatLong property')
  }

  var originalDate = toDate(dirtyDate, options);

  if (!isValid(originalDate, options)) {
    return 'Invalid Date'
  }

  // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset, options);

  var formatterOptions = {
    firstWeekContainsDate: firstWeekContainsDate,
    weekStartsOn: weekStartsOn,
    locale: locale$$1,
    _originalDate: originalDate
  };

  var result = formatStr
    .match(longFormattingTokensRegExp)
    .map(function(substring) {
      var firstCharacter = substring[0];
      if (firstCharacter === 'p' || firstCharacter === 'P') {
        var longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale$$1.formatLong, formatterOptions)
      }
      return substring
    })
    .join('')
    .match(formattingTokensRegExp)
    .map(function(substring) {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return "'"
      }

      var firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return cleanEscapedString(substring)
      }

      var formatter = formatters[firstCharacter];
      if (formatter) {
        if (!options.awareOfUnicodeTokens && isProtectedToken(substring)) {
          throwProtectedError(substring);
        }
        return formatter(utcDate, substring, locale$$1.localize, formatterOptions)
      }

      return substring
    })
    .join('');

  return result
}

function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'")
}

/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param {*} value - the value to check
 * @param {Options} [options] - the object with options. Unused; present for FP submodule compatibility sake. See [Options]{@link https://date-fns.org/docs/Options}
 * @returns {boolean} true if the given value is a date
 * @throws {TypeError} 1 arguments required
 *
 * @example
 * // For a valid date:
 * var result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * var result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * var result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * var result = isDate({})
 * //=> false
 */

/**
 * @name isEqual
 * @category Common Helpers
 * @summary Are the given dates equal?
 *
 * @description
 * Are the given dates equal?
 *
 * @param {Date|String|Number} dateLeft - the first date to compare
 * @param {Date|String|Number} dateRight - the second date to compare
 * @param {Options} [options] - the object with options. See [Options]{@link https://date-fns.org/docs/Options}
 * @param {0|1|2} [options.additionalDigits=2] - passed to `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * @returns {Boolean} the dates are equal
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `options.additionalDigits` must be 0, 1 or 2
 *
 * @example
 * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
 * var result = isEqual(
 *   new Date(2014, 6, 2, 6, 30, 45, 0)
 *   new Date(2014, 6, 2, 6, 30, 45, 500)
 * )
 * //=> false
 */
function isEqual (dirtyLeftDate, dirtyRightDate, dirtyOptions) {
  if (arguments.length < 2) {
    throw new TypeError('2 arguments required, but only ' + arguments.length + ' present')
  }

  var dateLeft = toDate(dirtyLeftDate, dirtyOptions);
  var dateRight = toDate(dirtyRightDate, dirtyOptions);
  return dateLeft.getTime() === dateRight.getTime()
}

// This file is generated automatically by `scripts/build/indices.js`. Please, don't change it.

var MINUTE_IN_SECONDS = 60;
var HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60;
var DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;

var difference = function difference(date1, date2) {
  var totalInSeconds = differenceInSeconds(date1, date2);

  var seconds = totalInSeconds;

  var days = Math.floor(seconds / DAY_IN_SECONDS);
  seconds = seconds % DAY_IN_SECONDS;

  var hours = Math.floor(seconds / HOUR_IN_SECONDS);
  seconds = seconds % HOUR_IN_SECONDS;

  var minutes = Math.floor(seconds / MINUTE_IN_SECONDS);
  seconds = seconds % MINUTE_IN_SECONDS;

  return { days: days, hours: hours, minutes: minutes, seconds: seconds, totalInSeconds: totalInSeconds };
};

var formatHtmlDatetime = function formatHtmlDatetime(date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

var formatIntegerRange = function formatIntegerRange() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 99;
  var maxSuffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  count = parseInt(count, 10);
  if (count <= min) {
    return '' + parseInt(min, 10);
  }
  if (count > max) {
    return '' + parseInt(max, 10) + maxSuffix;
  }
  return count.toString();
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};

  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning$1(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning$1(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction$1 = function emptyFunction() {};

emptyFunction$1.thatReturns = makeEmptyFunction;
emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
emptyFunction$1.thatReturnsThis = function () {
  return this;
};
emptyFunction$1.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1;

if (process.env.NODE_ENV !== 'production') {
  var printWarning$2 = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning$2.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable$1 = Object.prototype.propertyIsEnumerable;

function toObject$1(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative$1() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign$2 = shouldUseNative$1() ? Object.assign : function (target, source) {
	var from;
	var to = toObject$1(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty$1.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols$1) {
			symbols = getOwnPropertySymbols$1(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable$1.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$3 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1$2 = ReactPropTypesSecret$3;

if (process.env.NODE_ENV !== 'production') {
  var invariant$1 = invariant_1;
  var warning$1 = warning_1;
  var ReactPropTypesSecret$1$1 = ReactPropTypesSecret_1$2;
  var loggedTypeFailures$1 = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes$2(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant$1(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1$1);
        } catch (ex) {
          error = ex;
        }
        warning$1(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures$1)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures$1[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning$1(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

var checkPropTypes_1$2 = checkPropTypes$2;

var factoryWithTypeCheckers$2 = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1$2) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant_1(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning_1(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1$2);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning_1(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction_1.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1$2) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign$2({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1$2);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1$2;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var factoryWithThrowingShims$2 = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1$2) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes$1 = createCommonjsModule$1(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers$2(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims$2();
}
});

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant$3 = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1$2 = invariant$3;

var camel2hyphen = function (str) {
  return str
          .replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
          })
          .toLowerCase();
};

var camel2hyphen_1 = camel2hyphen;

var isDimension = function (feature) {
  var re = /[height|width]$/;
  return re.test(feature);
};

var obj2mq = function (obj) {
  var mq = '';
  var features = Object.keys(obj);
  features.forEach(function (feature, index) {
    var value = obj[feature];
    feature = camel2hyphen_1(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length-1) {
      mq += ' and ';
    }
  });
  return mq;
};

var json2mq = function (query) {
  var mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length-1) {
        mq += ', ';
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
};

var json2mq_1 = json2mq;

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits$1 = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn$1 = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Conditionally renders based on whether or not a media query matches.
 */

var Media = function (_React$Component) {
  inherits$1(Media, _React$Component);

  function Media() {
    var _temp, _this, _ret;

    classCallCheck$1(this, Media);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn$1(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      matches: _this.props.defaultMatches
    }, _this.updateMatches = function () {
      return _this.setState({ matches: _this.mediaQueryList.matches });
    }, _temp), possibleConstructorReturn$1(_this, _ret);
  }

  Media.prototype.componentWillMount = function componentWillMount() {
    if ((typeof window === "undefined" ? "undefined" : _typeof$1(window)) !== "object") return;

    var targetWindow = this.props.targetWindow || window;

    invariant_1$2(typeof targetWindow.matchMedia === "function", "<Media targetWindow> does not support `matchMedia`.");

    var query = this.props.query;

    if (typeof query !== "string") query = json2mq_1(query);

    this.mediaQueryList = targetWindow.matchMedia(query);
    this.mediaQueryList.addListener(this.updateMatches);
    this.updateMatches();
  };

  Media.prototype.componentWillUnmount = function componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches);
  };

  Media.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        render = _props.render;
    var matches = this.state.matches;


    return render ? matches ? render() : null : children ? typeof children === "function" ? children(matches) : !Array.isArray(children) || children.length // Preact defaults to empty children array
    ? matches ? React.Children.only(children) : null : null : null;
  };

  return Media;
}(React.Component);

Media.propTypes = {
  defaultMatches: propTypes$1.bool,
  query: propTypes$1.oneOfType([propTypes$1.string, propTypes$1.object, propTypes$1.arrayOf(propTypes$1.object.isRequired)]).isRequired,
  render: propTypes$1.func,
  children: propTypes$1.oneOfType([propTypes$1.node, propTypes$1.func]),
  targetWindow: propTypes$1.object
};
Media.defaultProps = {
  defaultMatches: true
};

// These breakpoints values represent minimum screen sizes.
// Small screen sizes should be targetted by default (mobile first).
var BREAKPOINTS = {
  medium: 768,
  large: 1170

  // CSS breakpoints
};var breakpoint = function breakpoint(name, styles) {
  return styled.css(['@media (min-width:', 'px){', ';}'], BREAKPOINTS[name], styles);
};

// Rendering breakpoints
var BreakPoint = function BreakPoint(_ref) {
  var from = _ref.from,
      to = _ref.to,
      children = _ref.children,
      props = objectWithoutProperties(_ref, ['from', 'to', 'children']);

  var names = ['medium', 'large'];
  var query = {};
  if (from && names.includes(from)) {
    query.minWidth = BREAKPOINTS[from];
  }
  if (to && names.includes(to)) {
    query.maxWidth = BREAKPOINTS[to] - 1;
  }
  return React.createElement(
    Media,
    _extends({ query: query, defaultMatches: false }, props),
    function (ok) {
      return ok ? children : null;
    }
  );
};

var BreakPointName = propTypes.oneOf([].concat(toConsumableArray(Object.keys(BREAKPOINTS)), ['']));

BreakPoint.propTypes = {
  from: BreakPointName,
  to: BreakPointName,
  children: propTypes.node
};

BreakPoint.defaultProps = {
  to: '',
  from: ''
};

var FONT_SIZES = {
  xxsmall: '11px',
  xsmall: '12px',
  small: '14px',
  normal: '15px',
  large: '16px',
  xlarge: '20px',
  xxlarge: '22px',
  great: '37px'
};

var FONT_WEIGHTS = {
  normal: '400',
  bold: '600',
  bolder: '800'
};

var fontSizeCss = function fontSizeCss(size) {
  var fontSize = FONT_SIZES[size];
  return fontSize !== undefined ? '\n      line-height: 1.5;\n      font-size: ' + fontSize + '\n    ' : '';
};

var weightCss = function weightCss(weight) {
  var fontWeight = FONT_WEIGHTS[weight];
  return fontWeight !== undefined ? 'font-weight: ' + fontWeight : '';
};

var smallcapsCss = function smallcapsCss(smallcaps) {
  return smallcaps ? '\n      text-transform: lowercase;\n      font-variant: small-caps;\n    ' : '';
};

var font = function font(_ref) {
  var size = _ref.size,
      weight = _ref.weight,
      _ref$smallcaps = _ref.smallcaps,
      smallcaps = _ref$smallcaps === undefined ? false : _ref$smallcaps,
      _ref$inherit = _ref.inherit,
      inherit = _ref$inherit === undefined ? false : _ref$inherit;

  return '\n    ' + fontSizeCss(size, inherit) + ';\n    ' + weightCss(weight, inherit) + ';\n    ' + smallcapsCss(smallcaps, inherit) + ';\n  ';
};

var GRID = {
  columns: 12,
  gutterWidth: 30,
  columnWidth: 68
};

var grid = function grid(cols) {
  var gutters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : cols - 1;
  return GRID.columnWidth * cols + GRID.gutterWidth * gutters;
};

// This module exports a `springs` object and a `spring()` function:
//
//   - `spring()` is deprecated and will be removed in the future (react-motion).
//   - `springs` should be used from now on (react-spring).

var springs = {
  // Super slow spring, for debugging purposes
  debug: { tension: 10, friction: 40 },

  // Slow spring, can be used to move large things (e.g. a side panel).
  lazy: { tension: 50, friction: 10 },

  // Medium speed spring, can be used to move small objects.
  smooth: { tension: 120, friction: 12 },

  // Fast speed spring, for actions that need to feel almost instant.
  swift: { tension: 400, friction: 28 },

  // These springs (slow, normal, fast) were originally created for
  // react-motion. While they can be used with react-spring, their use is not
  // recommended. New springs will be added later as we move everything to
  // use react-spring.
  slow: { tension: 150, friction: 18 },
  normal: { tension: 190, friction: 22 },
  fast: { tension: 220, friction: 24 }

  // Convert to react-motion springs:
  //
  //   stiffness => tension
  //   damping => friction
  //
};var reactMotionSprings = Object.entries(springs).reduce(function (springs, _ref) {
  var _ref2 = slicedToArray(_ref, 2),
      name = _ref2[0],
      spring = _ref2[1];

  return _extends({}, springs, defineProperty({}, name, {
    stiffness: spring.tension,
    damping: spring.friction,
    precision: 0.001
  }));
}, {});

// Deprecated, see above
var spring = function spring(name) {
  // TODO: propagate process.env.NODE_ENV to Aragon UI
  if (process.env.NODE_ENV === 'development') {
    console.warn('spring(name) is deprecated. Please use springs[name] instead.');
  }
  return reactMotionSprings[name] || reactMotionSprings.normal;
};

var unselectable = function unselectable() {
  return '\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n';
};

var ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
var ETHERSCAN_NETWORK_TYPES = ['main', 'kovan', 'rinkeby', 'ropsten'];
var ETHERSCAN_TYPES = ['block', 'transaction', 'address', 'token'];

/**
 * Check address equality without checksums
 * @param {string} first First address
 * @param {string} second Second address
 * @returns {boolean} Address equality
 */
function addressesEqual(first, second) {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
}

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
function shortenAddress(address) {
  var charsLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  var prefixLength = 2; // "0x"
  if (!address) {
    return '';
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address;
  }
  return address.slice(0, charsLength + prefixLength) + '…' + address.slice(-charsLength);
}

/**
 *
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {string} address the given HEX address
 * @return {boolean}
 */
function isAddress(address) {
  return ADDRESS_REGEX.test(address);
}

/**
 * Generates an etherscan URL
 *
 * @param {string} type The type of URL (block, transaction, address or token).
 * @param {string} value Identifier of the object, depending on the type (block number, transaction hash, …).
 * @param {object} options The optional parameters.
 * @param {string} options.networkType The Ethereum network type (main, kovan, rinkeby, or ropsten).
 * @param {string} options.provider The explorer provider (e.g. etherscan).
 * @return {string} The generated URL, or an empty string if the parameters are invalid.
 */
function blockExplorerUrl(type, value) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$networkType = _ref.networkType,
      networkType = _ref$networkType === undefined ? 'main' : _ref$networkType,
      _ref$provider = _ref.provider,
      provider = _ref$provider === undefined ? 'etherscan' : _ref$provider;

  // Only Etherscan is supported for now.
  if (provider !== 'etherscan') {
    warn('blockExplorerUrl(): provider not supported.');
    return '';
  }

  if (!ETHERSCAN_NETWORK_TYPES.includes(networkType)) {
    warn('blockExplorerUrl(): network type not supported.');
    return '';
  }

  if (!ETHERSCAN_TYPES.includes(type)) {
    warn('blockExplorerUrl(): type not supported.');
    return '';
  }

  var subdomain = networkType === 'main' ? '' : networkType + '.';

  return 'https://' + subdomain + 'etherscan.io/' + type + '/' + value;
}

// Forward some props of an instance to a child element.
//
// Usage example:
//
//   <Child {...forwardProps(this, ['name', 'style'])}>
//
function forwardProps(instance, names) {
  return names.reduce(function (props, name) {
    if (instance.props[name]) {
      props[name] = instance.props[name];
    }
    return props;
  }, {});
}

// Forward the props useful to extend the styles  of the main child of a
// component, using either styled() or the style attribute. Additionnal names
// can be passed as a second parameter.
function stylingProps(instance) {
  var names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return forwardProps(instance, ['style', 'className'].concat(toConsumableArray(names)));
}

/* eslint-disable prettier/prettier */
function noop() {}

// Return a function that executes `cb` when on the dev environment
function devOnly(cb) {
  return process.env.NODE_ENV === 'development' ? cb : noop;
}

var log = devOnly(function () {
  var _console;

  (_console = console).log.apply(_console, arguments);
});

var warn = devOnly(function () {
  var _console2;

  (_console2 = console).warn.apply(_console2, arguments);
});

var getDisplayName_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDisplayName;
function getDisplayName(Component) {
  return Component.displayName || Component.name || (typeof Component === 'string' && Component.length > 0 ? Component : 'Unknown');
}
});

var getDisplayName = unwrapExports(getDisplayName_1);

// Higher-order component for convenient subscriptions to RxJS observables
var observe = function observe(_observe) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (Component) {
    var _class, _temp2;

    return _temp2 = _class = function (_React$Component) {
      inherits(_class, _React$Component);

      function _class() {
        var _ref;

        var _temp, _this, _ret;

        classCallCheck(this, _class);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.state = initialState, _this.subscribe = function (observable) {
          if (observable) {
            _this.setState({
              subscription: _observe(observable).subscribe(function (state) {
                _this.setState(state);
              })
            });
          }
        }, _this.unsubscribe = function () {
          _this.state.subscription && _this.state.subscription.unsubscribe();
        }, _temp), possibleConstructorReturn(_this, _ret);
      }

      createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.subscribe(this.props.observable);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref2) {
          var nextObservable = _ref2.observable;
          var observable = this.props.observable;
          // If a new observable gets passed in, unsubscribe from the old and subscribe to the new

          if (nextObservable !== observable) {
            this.unsubscribe();
            this.subscribe(nextObservable);
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.unsubscribe();
        }
      }, {
        key: 'render',
        value: function render() {
          var props = objectWithoutProperties(this.props, []);
          // Don't pass down the given observable

          delete props.observable;

          return React.createElement(Component, _extends({}, this.state, props));
        }
      }]);
      return _class;
    }(React.Component), _class.displayName = 'Observe(' + getDisplayName(Component) + ')', _class.propTypes = {
      observable: function observable(_ref3, _, componentName) {
        var _observable = _ref3.observable;

        if (_observable && typeof _observable.subscribe !== 'function') {
          throw new Error('Invalid prop `observable` supplied to `' + componentName + '` ' + '(wrapped by `observe()`). ' + '`observable` must be an RxJS Observable-like object. ' + ('Given ' + _observable + ' instead.'));
        }
      }
    }, _temp2;
  };
};

// prefix helper
var prefixUrl = function prefixUrl(url, publicUrl) {
  return url.startsWith('data:') ? url : publicUrl + url;
};

// trailing slash helper
var ensureTrailingSlash = function ensureTrailingSlash(path) {
  return path.endsWith('/') ? path : path + '/';
};

var DEFAULT_URL = '';

var _React$createContext = React.createContext(DEFAULT_URL);
var Provider = _React$createContext.Provider;
var PublicUrl = _React$createContext.Consumer;

var PublicUrlProvider = function PublicUrlProvider(_ref) {
  var url = _ref.url,
      children = _ref.children;

  return React.createElement(
    Provider,
    { value: url },
    children
  );
};
PublicUrlProvider.propTypes = {
  url: propTypes.string,
  children: propTypes.node

  // HOC wrapper
};var hocWrap = function hocWrap(Component) {
  var HOC = function HOC(props) {
    return React.createElement(
      PublicUrl,
      null,
      function (publicUrl) {
        return React.createElement(Component, _extends({}, props, { publicUrl: publicUrl }));
      }
    );
  };
  HOC.displayName = 'PublicUrlProvider(' + getDisplayName(Component) + ')';
  return HOC;
};

// styled-components utility for URLs
var styledUrl = function styledUrl(url) {
  return function (_ref2) {
    var publicUrl = _ref2.publicUrl;
    return prefixUrl(url, publicUrl);
  };
};

PublicUrl.Provider = PublicUrlProvider;
PublicUrl.hocWrap = hocWrap;
PublicUrl.styledUrl = styledUrl;

// Render prop component and HOC for re-rendering.
// For a discussion on pitfalls, see
// https://gist.github.com/staltz/08bf613199092eeb41ac8137d51eb5e6

var Redraw = function (_React$Component) {
  inherits(Redraw, _React$Component);

  function Redraw() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Redraw);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Redraw.__proto__ || Object.getPrototypeOf(Redraw)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lastDraw: -1
    }, _this.draw = function () {
      _this.raf = requestAnimationFrame(_this.draw);

      var interval = _this.props.interval;
      var lastDraw = _this.state.lastDraw;

      var now = Date.now();
      var delta = now - lastDraw;
      if (lastDraw === -1 || delta > interval) {
        _this.setState({ lastDraw: now - delta % interval });
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Redraw, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.raf = null;
      this.draw();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.raf && cancelAnimationFrame(this.raf);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children();
    }
  }]);
  return Redraw;
}(React.Component);

Redraw.propTypes = {
  interval: propTypes.number,
  children: propTypes.func.isRequired
};
Redraw.defaultProps = {
  interval: 1000
};

var hocWrap$1 = function hocWrap(Component, interval) {
  var HOC = function HOC(props) {
    return React.createElement(
      Redraw,
      { interval: interval },
      function () {
        return React.createElement(Component, props);
      }
    );
  };
  HOC.displayName = 'Redraw(' + getDisplayName(Component) + ')';
  return HOC;
};

Redraw.hocWrap = hocWrap$1;

// Render prop component for re-rendering based on a given date. Automatically
// adjusts the re-render timer to be one second, minute, or hour based on the
// fromDate prop.
// For a discussion on pitfalls, see
// https://gist.github.com/staltz/08bf613199092eeb41ac8137d51eb5e6

var EVERY_SECOND = 1000;
var EVERY_MINUTE = EVERY_SECOND * 60;
var EVERY_HOUR = EVERY_MINUTE * 60;

var getRedrawTime = function getRedrawTime(fromDate) {
  var _difference = difference(new Date(), fromDate),
      days = _difference.days,
      hours = _difference.hours,
      minutes = _difference.minutes;

  return hours || days ? EVERY_HOUR : minutes > 1 ? EVERY_MINUTE : EVERY_SECOND;
};

var RedrawFromDate = function (_React$Component) {
  inherits(RedrawFromDate, _React$Component);

  function RedrawFromDate() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, RedrawFromDate);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = RedrawFromDate.__proto__ || Object.getPrototypeOf(RedrawFromDate)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      redrawTime: EVERY_HOUR,
      lastDraw: -1
    }, _this.clearInterval = function () {
      _this.interval && clearInterval(_this.interval);
    }, _this.restartDrawInterval = function (redrawTime) {
      _this.clearInterval();

      _this.interval = setInterval(function () {
        _this.setState({ lastDraw: Date.now() });

        var newRedrawTime = getRedrawTime(_this.props.fromDate);
        if (newRedrawTime !== redrawTime) {
          _this.restartDrawInterval(newRedrawTime);
        }
      }, redrawTime);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(RedrawFromDate, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var fromDate = this.props.fromDate;

      if (fromDate) {
        this.restartDrawInterval(getRedrawTime(fromDate));
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref2) {
      var fromDate = _ref2.fromDate;

      if (!fromDate && this.props.fromDate) {
        this.clearInterval();
      } else if (!isEqual(fromDate, this.props.fromDate)) {
        this.restartDrawInterval(getRedrawTime(this.props.fromDate));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearInterval();
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children();
    }
  }]);
  return RedrawFromDate;
}(React.Component);

RedrawFromDate.propTypes = {
  children: propTypes.func.isRequired,
  fromDate: propTypes.oneOfType([propTypes.string, propTypes.number, propTypes.instanceOf(Date)]).isRequired
};


var hocWrap$2 = function hocWrap(Component) {
  var HOC = function HOC(props) {
    return React.createElement(
      RedrawFromDate,
      { fromDate: props.fromDate },
      function () {
        return React.createElement(Component, props);
      }
    );
  };
  HOC.propTypes = {
    fromDate: RedrawFromDate.propTypes.fromDate
  };
  HOC.displayName = 'RedrawFromDate(' + getDisplayName(Component) + ')';
  return HOC;
};

RedrawFromDate.hocWrap = hocWrap$2;

var Text = styled__default.span.withConfig({
  displayName: 'Text',
  componentId: 'yxw4o9-0'
})(['', ';', ';'], function (_ref) {
  var size = _ref.size,
      weight = _ref.weight,
      smallcaps = _ref.smallcaps;
  return font({ size: size, weight: weight, smallcaps: smallcaps });
}, function (_ref2) {
  var color = _ref2.color;
  return color ? 'color: ' + color : '';
});

var Block = Text.withComponent('div');
var Paragraph = Text.withComponent('p');

Text.propTypes = Block.propTypes = Paragraph.propTypes = {
  children: propTypes.node,
  color: propTypes.string,
  size: propTypes.string,
  smallcaps: propTypes.bool,
  weight: propTypes.string
};

Text.Block = Block;
Text.Paragraph = Paragraph;

var chevronSvg = "data:image/svg+xml,%3Csvg%20width%3D%227%22%20height%3D%2212%22%20viewBox%3D%220%200%207%2012%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M.446%2012a.512.512%200%200%201-.172-.03.422.422%200%200%201-.146-.087A.37.37%200%200%201%200%2011.6a.37.37%200%200%201%20.128-.281l5.826-5.361L.217.692A.376.376%200%200%201%20.089.405.378.378%200%200%201%20.217.117.444.444%200%200%201%20.529%200c.123%200%20.228.04.313.117l6.03%205.56A.37.37%200%200%201%207%205.96a.37.37%200%200%201-.128.281l-6.12%205.643A.477.477%200%200%201%20.446%2012z%22%20fill%3D%22%2300CBE6%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var StyledAppBar = styled__default.div.withConfig({
  displayName: 'AppBar__StyledAppBar',
  componentId: 'sc-1861a4z-0'
})(['display:flex;align-items:center;justify-content:flex-start;width:100%;height:64px;background:', ';border-bottom:1px solid ', ';', ';'], theme.contentBackground, theme.contentBorder, unselectable());

var StyledAppBarStart = styled__default.div.withConfig({
  displayName: 'AppBar__StyledAppBarStart',
  componentId: 'sc-1861a4z-1'
})(['display:flex;align-items:center;padding-left:30px;']);
var StyledAppBarEnd = styled__default.div.withConfig({
  displayName: 'AppBar__StyledAppBarEnd',
  componentId: 'sc-1861a4z-2'
})(['margin-left:auto;padding-right:30px;']);

var StyledAppBarTitle = PublicUrl.hocWrap(styled__default.h1.withConfig({
  displayName: 'AppBar__StyledAppBarTitle',
  componentId: 'sc-1861a4z-3'
})(['padding-right:20px;margin-right:calc(20px - 7px);white-space:nowrap;background-image:', ';background-position:100% 50%;background-repeat:no-repeat;cursor:', ';'], function (_ref) {
  var chevron = _ref.chevron;
  return chevron ? styled.css(['url(', ')'], PublicUrl.styledUrl(chevronSvg)) : 'none';
}, function (_ref2) {
  var clickable = _ref2.clickable;
  return clickable ? 'pointer' : 'default';
}));

var AppBar = function AppBar(_ref3) {
  var children = _ref3.children,
      endContent = _ref3.endContent,
      title = _ref3.title,
      onTitleClick = _ref3.onTitleClick,
      props = objectWithoutProperties(_ref3, ['children', 'endContent', 'title', 'onTitleClick']);
  return React.createElement(
    StyledAppBar,
    props,
    title && React.createElement(
      StyledAppBarStart,
      null,
      React.createElement(
        StyledAppBarTitle,
        {
          chevron: Boolean(children),
          clickable: Boolean(onTitleClick),
          onClick: onTitleClick
        },
        typeof title === 'string' ? React.createElement(
          Text,
          { size: 'xxlarge' },
          title
        ) : title
      )
    ),
    children,
    endContent && React.createElement(
      StyledAppBarEnd,
      null,
      endContent
    )
  );
};

AppBar.propTypes = {
  children: propTypes.node,
  title: propTypes.node,
  endContent: propTypes.node,
  onTitleClick: propTypes.func
};

AppBar.defaultProps = {
  title: '',
  onTitleClick: function onTitleClick() {}
};

var AppView = function (_React$Component) {
  inherits(AppView, _React$Component);

  function AppView() {
    classCallCheck(this, AppView);
    return possibleConstructorReturn(this, (AppView.__proto__ || Object.getPrototypeOf(AppView)).apply(this, arguments));
  }

  createClass(AppView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          appBar = _props.appBar,
          title = _props.title,
          children = _props.children,
          padding = _props.padding;

      return React.createElement(
        Main,
        stylingProps(this),
        React.createElement(
          Header,
          null,
          appBar || React.createElement(AppBar, { title: title })
        ),
        React.createElement(
          ScrollWrapper,
          null,
          React.createElement(
            Content,
            { padding: padding },
            children
          )
        )
      );
    }
  }]);
  return AppView;
}(React.Component);

AppView.defaultProps = {
  title: '',
  padding: 30
};
AppView.propTypes = {
  appBar: propTypes.element,
  title: propTypes.string,
  children: propTypes.node,
  padding: propTypes.number
};


var Main = styled__default.div.withConfig({
  displayName: 'AppView__Main',
  componentId: 'bz2dbk-0'
})(['display:flex;height:100%;flex-direction:column;align-items:stretch;justify-content:stretch;']);

var Header = styled__default.div.withConfig({
  displayName: 'AppView__Header',
  componentId: 'bz2dbk-1'
})(['position:relative;z-index:2;flex-shrink:0;']);

var ScrollWrapper = styled__default.div.withConfig({
  displayName: 'AppView__ScrollWrapper',
  componentId: 'bz2dbk-2'
})(['position:relative;z-index:1;height:100%;overflow:auto;']);

var Content = styled__default.div.withConfig({
  displayName: 'AppView__Content',
  componentId: 'bz2dbk-3'
})(['display:flex;flex-direction:column;min-height:100%;padding:', ';'], function (_ref) {
  var padding = _ref.padding;
  return padding + 'px';
});

var overpassLightWoff = "fd48a701d84ebf69.woff";

var overpassLightWoff2 = "cf790334a5a6d45c.woff2";

var overpassRegularWoff = "860b19d3e10736e7.woff";

var overpassRegularWoff2 = "32a3f11e7740ce58.woff2";

var overpassSemiBoldWoff = "f8ba2d7a9af0db1f.woff";

var overpassSemiBoldWoff2 = "5cfe62515c2f9b42.woff2";

var _templateObject = taggedTemplateLiteral(['\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 400;\n    font-style: normal;\n  }\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 600;\n    font-style: normal;\n  }\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 800;\n    font-style: normal;\n  }\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n  html {\n    min-height: 100%;\n  }\n  body {\n    font-family: overpass, sans-serif;\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 1.5;\n    color: ', ';\n    background: ', ';\n  }\n  body,\n  ul,\n  p,\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    margin: 0;\n    padding: 0;\n  }\n  button,\n  select,\n  input,\n  textarea,\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-size: inherit;\n    font-family: inherit;\n    font-weight: inherit;\n    line-height: inherit;\n  }\n  a,\n  button,\n  select,\n  input,\n  textarea {\n    color: inherit;\n  }\n  strong,\n  b {\n    font-weight: 600;\n  }\n'], ['\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 400;\n    font-style: normal;\n  }\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 600;\n    font-style: normal;\n  }\n  @font-face {\n    font-family: \'overpass\';\n    src: ', ';\n    font-weight: 800;\n    font-style: normal;\n  }\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n  html {\n    min-height: 100%;\n  }\n  body {\n    font-family: overpass, sans-serif;\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 1.5;\n    color: ', ';\n    background: ', ';\n  }\n  body,\n  ul,\n  p,\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    margin: 0;\n    padding: 0;\n  }\n  button,\n  select,\n  input,\n  textarea,\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-size: inherit;\n    font-family: inherit;\n    font-weight: inherit;\n    line-height: inherit;\n  }\n  a,\n  button,\n  select,\n  input,\n  textarea {\n    color: inherit;\n  }\n  strong,\n  b {\n    font-weight: 600;\n  }\n']);

var BaseStyles = function (_React$Component) {
  inherits(BaseStyles, _React$Component);

  function BaseStyles() {
    classCallCheck(this, BaseStyles);
    return possibleConstructorReturn(this, (BaseStyles.__proto__ || Object.getPrototypeOf(BaseStyles)).apply(this, arguments));
  }

  createClass(BaseStyles, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          publicUrl = _props.publicUrl,
          enableLegacyFonts = _props.enableLegacyFonts;

      injectStyles(function (url) {
        return publicUrl + url;
      }, enableLegacyFonts);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);
  return BaseStyles;
}(React.Component);

BaseStyles.propTypes = {
  publicUrl: propTypes.string,
  enableLegacyFonts: propTypes.bool
};
BaseStyles.defaultProps = {
  publicUrl: '/',
  enableLegacyFonts: false
};


var fontSrc = function fontSrc(sources) {
  return sources.filter(function (_ref) {
    var enable = _ref.enable;
    return enable;
  }).map(function (_ref2) {
    var url = _ref2.url,
        format = _ref2.format;
    return 'url(' + url + ') format(\'' + format + '\')';
  }).join(', ');
};

var injectStyles = function injectStyles(asset, legacyFonts) {
  return styled.injectGlobal(_templateObject, fontSrc([{ url: asset(overpassLightWoff2), format: 'woff2', enable: true }, { url: asset(overpassLightWoff), format: 'woff', enable: legacyFonts }]), fontSrc([{ url: asset(overpassRegularWoff2), format: 'woff2', enable: true }, { url: asset(overpassRegularWoff), format: 'woff', enable: legacyFonts }]), fontSrc([{ url: asset(overpassSemiBoldWoff2), format: 'woff2', enable: true }, { url: asset(overpassSemiBoldWoff), format: 'woff', enable: legacyFonts }]), theme.textPrimary, theme.mainBackground);
};

var BaseStyles$1 = PublicUrl.hocWrap(BaseStyles);

var logo = "data:image/svg+xml,%3Csvg%20width%3D%221129%22%20height%3D%22792%22%20viewBox%3D%220%200%201129%20792%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3ClinearGradient%20x1%3D%2258.303%25%22%20y1%3D%2229.305%25%22%20x2%3D%22-20.356%25%22%20y2%3D%2289.584%25%22%20id%3D%22a%22%3E%3Cstop%20stop-color%3D%22%23E9F2F4%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22%23FFF%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20x1%3D%2250%25%22%20y1%3D%22125.887%25%22%20x2%3D%2250%25%22%20y2%3D%2227.419%25%22%20id%3D%22b%22%3E%3Cstop%20stop-color%3D%22%23E9F2F4%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22%23FFF%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20x1%3D%2238.76%25%22%20y1%3D%2240.284%25%22%20x2%3D%2227.198%25%22%20y2%3D%224.898%25%22%20id%3D%22c%22%3E%3Cstop%20stop-color%3D%22%23E9F2F4%22%20offset%3D%220%25%22%2F%3E%3Cstop%20stop-color%3D%22%23FFF%22%20offset%3D%22100%25%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20opacity%3D%22.7%22%3E%3Cpath%20d%3D%22M474.223%2064.24c-.503%200-231.685%2073.873-231.685%20275.905%200%20202.033%20223.146%20300.029%20387.48%20300.029%2089.383%200%20162.808-26.013%20211.24-49.744%206.242-28.642%2028.943-96.473%20104.047-96.981%2013.393-.523%2025.958%201.99%2036.517%208.021%2050.256%2027.144%2017.59%2077.898%2017.59%2077.898%201.894-.307%203.809-.663%205.724-1.075%201.91-.413%203.83-.89%205.764-1.408%2060.404-16.268%20128.467-85.36%20116.661-201.057-9.463-92.774-95.09-151.58-136.743-174.94-13.64-7.648-22.566-11.513-22.566-11.513%201.508-9.423%201.995-16.71%201.995-22.309%200-1.05-.02-2.035-.05-2.96v-10.86C751.617%2020.65%20566.645.223%20475.414.223c-39.412%200-61.5%203.704-61.5%203.704l60.309%2060.313zm461.86%20125.638s-29.652-9.55-59.8-13.57c-15.083%2015.58-28.15%2022.113-32.17%2024.129-.503.497-1.005%201-1.005%201-87.95-18.595-119.612-63.827-119.612-63.827%2082.93-.497%20157.812%2019.098%20212.587%2052.268z%22%20fill%3D%22url%28%23a%29%22%20opacity%3D%22.779%22%2F%3E%3Cpath%20d%3D%22M1018.002%20315.017c0%2065.842-27.134%20126.647-73.375%20175.899l-2.197%202.528%203.704-.01c12.564-.508%2025.129%202.005%2035.688%208.036%2050.256%2027.144%2017.59%2077.898%2017.59%2077.898%2062.82-10.051%20140.719-80.406%20128.15-203.54-9.464-92.774-95.092-151.58-136.744-174.94%2017.901%2035.357%2027.184%2074.19%2027.184%20114.13%22%20fill%3D%22url%28%23b%29%22%20opacity%3D%22.374%22%2F%3E%3Cpath%20d%3D%22M.808%20545.696c0%208.152.317%2015.911.769%2023.495%2062.198%20119.616%20137.015%20224.115%20222.588%20310.653%20106.72%20107.685%20230.9%20187.578%20369.166%20237.539%20137.764-49.785%20261.949-129.854%20369.182-238.057%2031.792-32.144%2062.112-66.887%2090.915-104.012-229.272-16.479-215.346-155.74-215.346-155.74%200-5.524%200-11.057%201.005-16.585%200%200%20.508-4.89%202.176-12.564-48.432%2023.736-121.857%2049.749-211.244%2049.749-164.335%200-387.48-97.996-387.48-300.029%200-202.032%20231.181-275.905%20231.181-275.905l-.12-.035c-5.86-.452-12.143-.472-17.973-.472C202.836%2072.784.808%20284.863.808%20545.696%22%20fill%3D%22url%28%23c%29%22%20opacity%3D%22.557%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

var StyledAragonApp = styled__default.main.withConfig({
  displayName: 'AragonApp__StyledAragonApp',
  componentId: 'sc-156qg0-0'
})(['min-width:320px;min-height:100vh;background-color:', ';background-image:', ';background-position:50% 50%;background-repeat:no-repeat;'], theme.mainBackground, function (_ref) {
  var backgroundLogo = _ref.backgroundLogo;
  return backgroundLogo ? styled.css(['url(', ')'], PublicUrl.styledUrl(logo)) : 'none';
});

var AragonApp = function (_React$Component) {
  inherits(AragonApp, _React$Component);

  function AragonApp() {
    classCallCheck(this, AragonApp);
    return possibleConstructorReturn(this, (AragonApp.__proto__ || Object.getPrototypeOf(AragonApp)).apply(this, arguments));
  }

  createClass(AragonApp, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { publicUrl: ensureTrailingSlash(this.props.publicUrl) };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          backgroundLogo = _props.backgroundLogo,
          className = _props.className,
          publicUrl = _props.publicUrl,
          supportLegacyAgents = _props.supportLegacyAgents;

      var styledProps = { backgroundLogo: backgroundLogo, className: className, publicUrl: publicUrl };
      return React.createElement(
        PublicUrl.Provider,
        { url: ensureTrailingSlash(publicUrl) },
        React.createElement(
          StyledAragonApp,
          styledProps,
          React.createElement(BaseStyles$1, { legacyFonts: supportLegacyAgents }),
          children
        )
      );
    }
  }]);
  return AragonApp;
}(React.Component);

AragonApp.propTypes = {
  className: propTypes.string,
  backgroundLogo: propTypes.bool,
  publicUrl: propTypes.string,
  children: propTypes.node,
  supportLegacyAgents: propTypes.bool
};
AragonApp.defaultProps = {
  backgroundLogo: false
};
AragonApp.childContextTypes = {
  publicUrl: propTypes.string
};
AragonApp.Styled = StyledAragonApp;

var Info = function Info(_ref) {
  var children = _ref.children,
      label = _ref.label,
      small = _ref.small,
      props = objectWithoutProperties(_ref, ['children', 'label', 'small']);
  return React.createElement(
    Badge,
    _extends({
      shape: small ? 'smalldisc' : 'disc',
      background: theme.badgeInfoBackground,
      foreground: theme.badgeInfoForeground
    }, props),
    children || (typeof label === 'number' ? formatIntegerRange(label) : label)
  );
};

Info.defaultProps = {
  small: false
};

Info.propTypes = {
  children: propTypes.node,
  label: propTypes.oneOfType([propTypes.number, propTypes.string]),
  small: propTypes.bool
};

var Notification = function Notification(_ref) {
  var children = _ref.children,
      label = _ref.label,
      small = _ref.small,
      props = objectWithoutProperties(_ref, ['children', 'label', 'small']);
  return React.createElement(
    Badge,
    _extends({
      shape: small ? 'smalldisc' : 'disc',
      background: theme.badgeNotificationBackground,
      foreground: theme.badgeNotificationForeground
    }, props),
    children || (typeof label === 'number' ? formatIntegerRange(label) : label)
  );
};

Notification.defaultProps = {
  small: false
};

Notification.propTypes = {
  children: propTypes.node,
  label: propTypes.oneOfType([propTypes.number, propTypes.string]),
  small: propTypes.bool
};

var Identity$2 = function Identity(props) {
  return React.createElement(Badge, _extends({
    shape: 'compact',
    background: theme.badgeIdentityBackground,
    foreground: theme.badgeIdentityForeground
  }, props));
};

var App = function App(props) {
  return React.createElement(Badge, _extends({
    shape: 'round',
    background: theme.badgeAppBackground,
    foreground: theme.badgeAppForeground
  }, props));
};

var shapeStyles = function shapeStyles(shape) {
  if (shape === 'disc') {
    return styled.css(['overflow:hidden;padding-top:2px;letter-spacing:-0.5px;justify-content:center;align-items:center;width:18px;height:18px;border-radius:9px;', ';line-height:20px;'], font({ size: 'xsmall', weight: 'bold' }));
  }
  if (shape === 'smalldisc') {
    return styled.css(['overflow:hidden;padding-top:1px;letter-spacing:-1px;justify-content:center;align-items:center;width:14px;height:14px;border-radius:7px;', ';line-height:14px;'], font({ size: 'xxsmall', weight: 'bold' }));
  }
  if (shape === 'compact') {
    return styled.css(['padding:1px 3px 0;border-radius:3px;', ';'], font({ size: 'xxsmall' }));
  }
  // round shape
  return styled.css(['padding:1px 8px 0;border-radius:9px;', ';'], font({ size: 'xsmall' }));
};

var Badge = styled__default.span.withConfig({
  displayName: 'Badge',
  componentId: 'akcx9j-0'
})(['display:inline-flex;font-weight:600;white-space:nowrap;color:', ';background:', ';', ';'], function (_ref) {
  var foreground = _ref.foreground;
  return foreground;
}, function (_ref2) {
  var background = _ref2.background;
  return background;
}, function (_ref3) {
  var shape = _ref3.shape;
  return shapeStyles(shape);
});

Badge.defaultProps = {
  shape: 'round',
  foreground: colors.Purple.Portage,
  background: colors.Purple.Lavender
};

Badge.propTypes = {
  shape: propTypes.oneOf(['disc', 'smalldisc', 'compact', 'round']),
  background: propTypes.string,
  foreground: propTypes.string
};

Badge.Info = Info;
Badge.Notification = Notification;
Badge.Identity = Identity$2;
Badge.App = App;

var BadgeNumber = function BadgeNumber(_ref) {
  var number = _ref.number,
      small = _ref.small,
      background = _ref.background,
      color = _ref.color,
      props = objectWithoutProperties(_ref, ['number', 'small', 'background', 'color']);
  return React.createElement(
    Badge,
    _extends({
      shape: small ? 'smalldisc' : 'disc',
      background: background,
      foreground: color
    }, props),
    number
  );
};

BadgeNumber.propTypes = {
  number: propTypes.number,
  small: propTypes.bool,
  color: propTypes.string,
  background: propTypes.string
};

BadgeNumber.defaultProps = {
  number: 0,
  small: false,
  color: theme.positiveText,
  background: theme.positive
};

var SafeLink = styled__default.a.attrs({
  // See https://mathiasbynens.github.io/rel-noopener
  rel: 'noopener noreferrer'
}).withConfig({
  displayName: 'SafeLink',
  componentId: 'ff844y-0'
})(['']);

var cross = "data:image/svg+xml,%3Csvg%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10.476%201.524L6.3%205.7l4.176%204.176-1.062%201.062-4.176-4.176-4.176%204.176L0%209.876%204.176%205.7%200%201.524%201.062.462l4.176%204.176L9.414.462z%22%20fill%3D%22%23FB7777%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var check = "data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2210%22%20viewBox%3D%220%200%2014%2010%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M4.176%207.956L12.114%200l1.062%201.062-9%209L0%205.886l1.044-1.062z%22%20fill%3D%22%2321D48E%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var crossWhite = "data:image/svg+xml,%3Csvg%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10.476%201.062L6.3%205.238l4.176%204.176-1.062%201.062L5.238%206.3l-4.176%204.176L0%209.414l4.176-4.176L0%201.062%201.062%200l4.176%204.176L9.414%200z%22%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var checkWhite = "data:image/svg+xml,%3Csvg%20width%3D%2214%22%20height%3D%2210%22%20viewBox%3D%220%200%2014%2010%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M4.176%207.956L12.114%200l1.062%201.062-9%209L0%205.886l1.044-1.062z%22%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var gradientStart = theme.gradientStart;
var gradientEnd = theme.gradientEnd;
var gradientStartActive = theme.gradientStartActive;
var gradientEndActive = theme.gradientEndActive;
var gradientText = theme.gradientText;
var contentBackground = theme.contentBackground;
var contentBorder = theme.contentBorder;
var contentBorderActive = theme.contentBorderActive;
var secondaryBackground = theme.secondaryBackground;
var textPrimary = theme.textPrimary;
var textSecondary = theme.textSecondary;
var disabledColor = theme.disabled;
var disabledText = theme.disabledText;

// Plain button = normal or strong

var plainButtonStyles = styled.css(['position:relative;overflow:hidden;box-shadow:0 1px 1px rgba(0,0,0,0);&:after{content:\'\';opacity:0;position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;}', ';'], function (_ref) {
  var disabled = _ref.disabled;
  return disabled ? '' : styled.css(['&:hover,&:focus{box-shadow:', ';}&:active{transform:translateY(1px);box-shadow:0 1px 1px rgba(0,0,0,0);&:after{opacity:1;}}'], function (_ref2) {
    var disabled = _ref2.disabled;
    return disabled ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.2)';
  });
});

var modeNormal = styled.css(['', ';&:active{color:', ';}'], plainButtonStyles, textPrimary);

var modeSecondary = styled.css(['', ';background:', ';&:hover,&:focus{box-shadow:none;}'], plainButtonStyles, secondaryBackground);

var modeStrong = styled.css(['', ';', ';', ';'], plainButtonStyles, font({ size: 'small', weight: 'bold' }), function (_ref3) {
  var disabled = _ref3.disabled;
  return disabled ? styled.css(['color:', ';background-color:', ';background-image:none;'], disabledText, disabledColor) : styled.css(['color:', ';background-color:transparent;background-image:linear-gradient( 130deg,', ',', ' )};&:after{background-image:linear-gradient( 130deg,', ',', ' );}'], gradientText, gradientStart, gradientEnd, gradientStartActive, gradientEndActive);
});

var modeOutline = styled.css(['background:transparent;padding-top:9px;padding-bottom:9px;border:1px solid ', ';&:hover,&:focus{border-color:', ';}&:active{color:', ';border-color:', ';}'], contentBorder, contentBorderActive, textPrimary, textPrimary);

var modeText = styled.css(['padding:10px;background:transparent;&:active,&:focus{color:', ';}'], textPrimary);

var smallStyle = styled.css(['padding:', ';'], function (_ref4) {
  var mode = _ref4.mode;
  return mode === 'outline' ? '4px 14px' : '5px 15px';
});

var miniStyle = styled.css(['padding:', ';', ';'], function (_ref5) {
  var mode = _ref5.mode;
  return mode === 'outline' ? '1px 11px' : '2px 12px';
}, font({ size: 'small' }));

var getEmphasisStyle = function getEmphasisStyle(_ref6) {
  var emphasisColor = _ref6.emphasisColor,
      icon = _ref6.icon,
      iconLight = _ref6.iconLight,
      _ref6$iconX = _ref6.iconX,
      iconX = _ref6$iconX === undefined ? '12px' : _ref6$iconX,
      _ref6$iconY = _ref6.iconY,
      iconY = _ref6$iconY === undefined ? 'calc(50% - 1px)' : _ref6$iconY,
      _ref6$iconWidth = _ref6.iconWidth,
      iconWidth = _ref6$iconWidth === undefined ? '34px' : _ref6$iconWidth;
  return styled.css(['padding-left:', ';background-image:url(', ');background-position:', ' ', ';background-repeat:no-repeat;', ';'], iconWidth, styledUrl(icon), iconX, iconY, function (_ref7) {
    var mode = _ref7.mode;

    if (mode === 'normal') {
      return styled.css(['&,&:active{background-image:url(', ');}'], styledUrl(icon));
    }
    if (mode === 'strong') {
      return styled.css(['&,&:active{background-image:url(', ');background-color:', ';}&:after{background:none;}'], styledUrl(iconLight), emphasisColor);
    }
    return '';
  });
};

var positiveStyle = getEmphasisStyle({
  emphasisColor: theme.positive,
  icon: check,
  iconLight: checkWhite
});

var negativeStyle = getEmphasisStyle({
  emphasisColor: theme.negative,
  icon: cross,
  iconLight: crossWhite,
  iconX: '10px',
  iconWidth: '30px'
});

var StyledButton = styled__default.button.attrs({ type: 'button' }).withConfig({
  displayName: 'Button__StyledButton',
  componentId: 'sc-8npd5h-0'
})(['width:', ';padding:10px 15px;white-space:nowrap;', ';color:', ';background:', ';border:0;border-radius:3px;outline:0;cursor:', ';&,&:after{transition-property:all;transition-duration:100ms;transition-timing-function:ease-in-out;}&::-moz-focus-inner{border:0;}', ';', ';', ';'], function (_ref8) {
  var wide = _ref8.wide;
  return wide ? '100%' : 'auto';
}, font({ size: 'small', weight: 'normal' }), textSecondary, contentBackground, function (_ref9) {
  var disabled = _ref9.disabled;
  return disabled ? 'default' : 'pointer';
}, function (_ref10) {
  var mode = _ref10.mode;

  if (mode === 'secondary') return modeSecondary;
  if (mode === 'strong') return modeStrong;
  if (mode === 'outline') return modeOutline;
  if (mode === 'text') return modeText;
  return modeNormal;
}, function (_ref11) {
  var compact = _ref11.compact,
      size = _ref11.size;

  if (size === 'small' || compact) return smallStyle;
  if (size === 'mini') return miniStyle;
  return '';
}, function (_ref12) {
  var emphasis = _ref12.emphasis;

  if (emphasis === 'positive') return positiveStyle;
  if (emphasis === 'negative') return negativeStyle;
  return '';
});

var Button = PublicUrl.hocWrap(StyledButton);
var Anchor = PublicUrl.hocWrap(styled__default(StyledButton.withComponent(SafeLink)).withConfig({
  displayName: 'Button__Anchor',
  componentId: 'sc-8npd5h-1'
})(['', ';display:inline-block;text-decoration:none;'], unselectable));

Button.Anchor = Anchor;

var StyledCard = styled__default.div.withConfig({
  displayName: 'Card__StyledCard',
  componentId: 'sc-13r75gj-0'
})(['width:', ';height:', ';background:', ';border:1px solid ', ';border-radius:3px;'], function (_ref) {
  var width = _ref.width;
  return width || '282px';
}, function (_ref2) {
  var height = _ref2.height;
  return height || '322px';
}, theme.contentBackground, theme.contentBorder);

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var bugfixes = undefined;
var applyAnimatedValues = undefined;
var colorNames = [];
var requestFrame = function requestFrame(cb) {
  return global.requestAnimationFrame(cb);
};
var cancelFrame = function cancelFrame(cb) {
  return global.cancelAnimationFrame(cb);
};
var interpolation = undefined;
var now = function now() {
  return Date.now();
};
var defaultElement = undefined;
var injectApplyAnimatedValues = function injectApplyAnimatedValues(fn, transform) {
  return applyAnimatedValues = {
    fn: fn,
    transform: transform
  };
};
var injectColorNames = function injectColorNames(names) {
  return colorNames = names;
};
var injectBugfixes = function injectBugfixes(fn) {
  return bugfixes = fn;
};
var injectInterpolation = function injectInterpolation(cls) {
  return interpolation = cls;
};
var injectFrame = function injectFrame(raf, caf) {
  var _ref;

  return _ref = [raf, caf], requestFrame = _ref[0], cancelFrame = _ref[1], _ref;
};
var injectNow = function injectNow(nowFn) {
  return now = nowFn;
};
var injectDefaultElement = function injectDefaultElement(el) {
  return defaultElement = el;
};

var Globals = /*#__PURE__*/Object.freeze({
  get bugfixes () { return bugfixes; },
  get applyAnimatedValues () { return applyAnimatedValues; },
  get colorNames () { return colorNames; },
  get requestFrame () { return requestFrame; },
  get cancelFrame () { return cancelFrame; },
  get interpolation () { return interpolation; },
  get now () { return now; },
  get defaultElement () { return defaultElement; },
  injectApplyAnimatedValues: injectApplyAnimatedValues,
  injectColorNames: injectColorNames,
  injectBugfixes: injectBugfixes,
  injectInterpolation: injectInterpolation,
  injectFrame: injectFrame,
  injectNow: injectNow,
  injectDefaultElement: injectDefaultElement
});

var colors$1 = {
  transparent: 0x00000000,
  // http://www.w3.org/TR/css3-color/#svg-color
  aliceblue: 0xf0f8ffff,
  antiquewhite: 0xfaebd7ff,
  aqua: 0x00ffffff,
  aquamarine: 0x7fffd4ff,
  azure: 0xf0ffffff,
  beige: 0xf5f5dcff,
  bisque: 0xffe4c4ff,
  black: 0x000000ff,
  blanchedalmond: 0xffebcdff,
  blue: 0x0000ffff,
  blueviolet: 0x8a2be2ff,
  brown: 0xa52a2aff,
  burlywood: 0xdeb887ff,
  burntsienna: 0xea7e5dff,
  cadetblue: 0x5f9ea0ff,
  chartreuse: 0x7fff00ff,
  chocolate: 0xd2691eff,
  coral: 0xff7f50ff,
  cornflowerblue: 0x6495edff,
  cornsilk: 0xfff8dcff,
  crimson: 0xdc143cff,
  cyan: 0x00ffffff,
  darkblue: 0x00008bff,
  darkcyan: 0x008b8bff,
  darkgoldenrod: 0xb8860bff,
  darkgray: 0xa9a9a9ff,
  darkgreen: 0x006400ff,
  darkgrey: 0xa9a9a9ff,
  darkkhaki: 0xbdb76bff,
  darkmagenta: 0x8b008bff,
  darkolivegreen: 0x556b2fff,
  darkorange: 0xff8c00ff,
  darkorchid: 0x9932ccff,
  darkred: 0x8b0000ff,
  darksalmon: 0xe9967aff,
  darkseagreen: 0x8fbc8fff,
  darkslateblue: 0x483d8bff,
  darkslategray: 0x2f4f4fff,
  darkslategrey: 0x2f4f4fff,
  darkturquoise: 0x00ced1ff,
  darkviolet: 0x9400d3ff,
  deeppink: 0xff1493ff,
  deepskyblue: 0x00bfffff,
  dimgray: 0x696969ff,
  dimgrey: 0x696969ff,
  dodgerblue: 0x1e90ffff,
  firebrick: 0xb22222ff,
  floralwhite: 0xfffaf0ff,
  forestgreen: 0x228b22ff,
  fuchsia: 0xff00ffff,
  gainsboro: 0xdcdcdcff,
  ghostwhite: 0xf8f8ffff,
  gold: 0xffd700ff,
  goldenrod: 0xdaa520ff,
  gray: 0x808080ff,
  green: 0x008000ff,
  greenyellow: 0xadff2fff,
  grey: 0x808080ff,
  honeydew: 0xf0fff0ff,
  hotpink: 0xff69b4ff,
  indianred: 0xcd5c5cff,
  indigo: 0x4b0082ff,
  ivory: 0xfffff0ff,
  khaki: 0xf0e68cff,
  lavender: 0xe6e6faff,
  lavenderblush: 0xfff0f5ff,
  lawngreen: 0x7cfc00ff,
  lemonchiffon: 0xfffacdff,
  lightblue: 0xadd8e6ff,
  lightcoral: 0xf08080ff,
  lightcyan: 0xe0ffffff,
  lightgoldenrodyellow: 0xfafad2ff,
  lightgray: 0xd3d3d3ff,
  lightgreen: 0x90ee90ff,
  lightgrey: 0xd3d3d3ff,
  lightpink: 0xffb6c1ff,
  lightsalmon: 0xffa07aff,
  lightseagreen: 0x20b2aaff,
  lightskyblue: 0x87cefaff,
  lightslategray: 0x778899ff,
  lightslategrey: 0x778899ff,
  lightsteelblue: 0xb0c4deff,
  lightyellow: 0xffffe0ff,
  lime: 0x00ff00ff,
  limegreen: 0x32cd32ff,
  linen: 0xfaf0e6ff,
  magenta: 0xff00ffff,
  maroon: 0x800000ff,
  mediumaquamarine: 0x66cdaaff,
  mediumblue: 0x0000cdff,
  mediumorchid: 0xba55d3ff,
  mediumpurple: 0x9370dbff,
  mediumseagreen: 0x3cb371ff,
  mediumslateblue: 0x7b68eeff,
  mediumspringgreen: 0x00fa9aff,
  mediumturquoise: 0x48d1ccff,
  mediumvioletred: 0xc71585ff,
  midnightblue: 0x191970ff,
  mintcream: 0xf5fffaff,
  mistyrose: 0xffe4e1ff,
  moccasin: 0xffe4b5ff,
  navajowhite: 0xffdeadff,
  navy: 0x000080ff,
  oldlace: 0xfdf5e6ff,
  olive: 0x808000ff,
  olivedrab: 0x6b8e23ff,
  orange: 0xffa500ff,
  orangered: 0xff4500ff,
  orchid: 0xda70d6ff,
  palegoldenrod: 0xeee8aaff,
  palegreen: 0x98fb98ff,
  paleturquoise: 0xafeeeeff,
  palevioletred: 0xdb7093ff,
  papayawhip: 0xffefd5ff,
  peachpuff: 0xffdab9ff,
  peru: 0xcd853fff,
  pink: 0xffc0cbff,
  plum: 0xdda0ddff,
  powderblue: 0xb0e0e6ff,
  purple: 0x800080ff,
  rebeccapurple: 0x663399ff,
  red: 0xff0000ff,
  rosybrown: 0xbc8f8fff,
  royalblue: 0x4169e1ff,
  saddlebrown: 0x8b4513ff,
  salmon: 0xfa8072ff,
  sandybrown: 0xf4a460ff,
  seagreen: 0x2e8b57ff,
  seashell: 0xfff5eeff,
  sienna: 0xa0522dff,
  silver: 0xc0c0c0ff,
  skyblue: 0x87ceebff,
  slateblue: 0x6a5acdff,
  slategray: 0x708090ff,
  slategrey: 0x708090ff,
  snow: 0xfffafaff,
  springgreen: 0x00ff7fff,
  steelblue: 0x4682b4ff,
  tan: 0xd2b48cff,
  teal: 0x008080ff,
  thistle: 0xd8bfd8ff,
  tomato: 0xff6347ff,
  turquoise: 0x40e0d0ff,
  violet: 0xee82eeff,
  wheat: 0xf5deb3ff,
  white: 0xffffffff,
  whitesmoke: 0xf5f5f5ff,
  yellow: 0xffff00ff,
  yellowgreen: 0x9acd32ff
};

var linear = function linear(t) {
  return t;
};

var Interpolation =
/*#__PURE__*/
function () {
  function Interpolation() {}

  Interpolation.create = function create(config) {
    if (typeof config === 'function') return config;
    if (interpolation && config.output && typeof config.output[0] === 'string') return interpolation(config);
    var outputRange = config.output;
    var inputRange = config.range;
    var easing = config.easing || linear;
    var extrapolateLeft = 'extend';
    var map = config.map;

    if (config.extrapolateLeft !== undefined) {
      extrapolateLeft = config.extrapolateLeft;
    } else if (config.extrapolate !== undefined) {
      extrapolateLeft = config.extrapolate;
    }

    var extrapolateRight = 'extend';

    if (config.extrapolateRight !== undefined) {
      extrapolateRight = config.extrapolateRight;
    } else if (config.extrapolate !== undefined) {
      extrapolateRight = config.extrapolate;
    }

    return function (input) {
      var range = findRange(input, inputRange);
      return interpolate(input, inputRange[range], inputRange[range + 1], outputRange[range], outputRange[range + 1], easing, extrapolateLeft, extrapolateRight, map);
    };
  };

  return Interpolation;
}();

function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map) {
  var result = map ? map(input) : input; // Extrapolate

  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result;
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin;
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result;
    } else if (extrapolateRight === 'clamp') {
      result = inputMax;
    }
  }

  if (outputMin === outputMax) return outputMin;

  if (inputMin === inputMax) {
    if (input <= inputMin) return outputMin;
    return outputMax;
  } // Input Range


  if (inputMin === -Infinity) {
    result = -result;
  } else if (inputMax === Infinity) {
    result = result - inputMin;
  } else {
    result = (result - inputMin) / (inputMax - inputMin);
  } // Easing


  result = easing(result); // Output Range

  if (outputMin === -Infinity) {
    result = -result;
  } else if (outputMax === Infinity) {
    result = result + outputMin;
  } else {
    result = result * (outputMax - outputMin) + outputMin;
  }

  return result;
}

function findRange(input, inputRange) {
  for (var i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) break;
  }

  return i - 1;
}

// const INTEGER = '[-+]?\\d+';
var NUMBER = '[-+]?\\d*\\.?\\d+';
var PERCENTAGE = NUMBER + '%';

function call() {
  return '\\(\\s*(' + Array.prototype.slice.call(arguments).join(')\\s*,\\s*(') + ')\\s*\\)';
}

var rgb = new RegExp('rgb' + call(NUMBER, NUMBER, NUMBER));
var rgba = new RegExp('rgba' + call(NUMBER, NUMBER, NUMBER, NUMBER));
var hsl = new RegExp('hsl' + call(NUMBER, PERCENTAGE, PERCENTAGE));
var hsla = new RegExp('hsla' + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
var hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex6 = /^#([0-9a-fA-F]{6})$/;
var hex8 = /^#([0-9a-fA-F]{8})$/;

/*
https://github.com/react-community/normalize-css-color

BSD 3-Clause License

Copyright (c) 2016, React Community
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function normalizeColor(color) {
  var match;

  if (typeof color === 'number') {
    return color >>> 0 === color && color >= 0 && color <= 0xffffffff ? color : null;
  } // Ordered based on occurrences on Facebook codebase


  if (match = hex6.exec(color)) return parseInt(match[1] + 'ff', 16) >>> 0;
  if (colors$1.hasOwnProperty(color)) return colors$1[color];

  if (match = rgb.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    0x000000ff) >>> // a
    0;
  }

  if (match = rgba.exec(color)) {
    return (parse255(match[1]) << 24 | // r
    parse255(match[2]) << 16 | // g
    parse255(match[3]) << 8 | // b
    parse1(match[4])) >>> // a
    0;
  }

  if (match = hex3.exec(color)) {
    return parseInt(match[1] + match[1] + // r
    match[2] + match[2] + // g
    match[3] + match[3] + // b
    'ff', // a
    16) >>> 0;
  } // https://drafts.csswg.org/css-color-4/#hex-notation


  if (match = hex8.exec(color)) return parseInt(match[1], 16) >>> 0;

  if (match = hex4.exec(color)) {
    return parseInt(match[1] + match[1] + // r
    match[2] + match[2] + // g
    match[3] + match[3] + // b
    match[4] + match[4], // a
    16) >>> 0;
  }

  if (match = hsl.exec(color)) {
    return (hslToRgb(parse360(match[1]), // h
    parsePercentage(match[2]), // s
    parsePercentage(match[3]) // l
    ) | 0x000000ff) >>> // a
    0;
  }

  if (match = hsla.exec(color)) {
    return (hslToRgb(parse360(match[1]), // h
    parsePercentage(match[2]), // s
    parsePercentage(match[3]) // l
    ) | parse1(match[4])) >>> // a
    0;
  }

  return null;
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  var p = 2 * l - q;
  var r = hue2rgb(p, q, h + 1 / 3);
  var g = hue2rgb(p, q, h);
  var b = hue2rgb(p, q, h - 1 / 3);
  return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
}

function parse255(str) {
  var int = parseInt(str, 10);
  if (int < 0) return 0;
  if (int > 255) return 255;
  return int;
}

function parse360(str) {
  var int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}

function parse1(str) {
  var num = parseFloat(str);
  if (num < 0) return 0;
  if (num > 1) return 255;
  return Math.round(num * 255);
}

function parsePercentage(str) {
  // parseFloat conveniently ignores the final %
  var int = parseFloat(str);
  if (int < 0) return 0;
  if (int > 100) return 1;
  return int / 100;
}

function colorToRgba(input) {
  var int32Color = normalizeColor(input);
  if (int32Color === null) return input;
  int32Color = int32Color || 0;
  var r = (int32Color & 0xff000000) >>> 24;
  var g = (int32Color & 0x00ff0000) >>> 16;
  var b = (int32Color & 0x0000ff00) >>> 8;
  var a = (int32Color & 0x000000ff) / 255;
  return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
} // Problem: https://github.com/animatedjs/animated/pull/102
// Solution: https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly/658662


var stringShapeRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g; // Covers rgb, rgba, hsl, hsla
// Taken from https://gist.github.com/olmokramer/82ccce673f86db7cda5e

var colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi; // Covers color names (transparent, blue, etc.)

var colorNamesRegex = new RegExp("(" + Object.keys(colors$1).join('|') + ")", 'g');
/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *   rgba(123, 42, 99, 0.36)           // colors
 *   -45deg                            // values with units
 *   0 2px 2px 0px rgba(0, 0, 0, 0.12) // box shadows
 */

function createInterpolation(config) {
  // Replace colors with rgba
  var outputRange = config.output.map(function (rangeValue) {
    return rangeValue.replace(colorRegex, colorToRgba);
  }).map(function (rangeValue) {
    return rangeValue.replace(colorNamesRegex, colorToRgba);
  }); // ->
  // [
  //   [0, 50],
  //   [100, 150],
  //   [200, 250],
  //   [0, 0.5],
  // ]

  var outputRanges = outputRange[0].match(stringShapeRegex).map(function () {
    return [];
  });
  outputRange.forEach(function (value) {
    value.match(stringShapeRegex).forEach(function (number, i) {
      return outputRanges[i].push(+number);
    });
  });
  var interpolations = outputRange[0].match(stringShapeRegex).map(function (value, i) {
    return Interpolation.create(_extends({}, config, {
      output: outputRanges[i]
    }));
  });
  var shouldRound = /^rgb/.test(outputRange[0]);
  return function (input) {
    var i = 0;
    return outputRange[0] // 'rgba(0, 100, 200, 0)'
    // ->
    // 'rgba(${interpolations[0](input)}, ${interpolations[1](input)}, ...'
    .replace(stringShapeRegex, function () {
      return interpolations[i++](input);
    }) // rgba requires that the r,g,b are integers.... so we want to round them, but we *dont* want to
    // round the opacity (4th column).
    .replace(/rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, function (_, p1, p2, p3, p4) {
      return "rgba(" + Math.round(p1) + ", " + Math.round(p2) + ", " + Math.round(p3) + ", " + p4 + ")";
    });
  };
}

var Animated =
/*#__PURE__*/
function () {
  function Animated() {}

  var _proto = Animated.prototype;

  _proto.__attach = function __attach() {};

  _proto.__detach = function __detach() {};

  _proto.__getValue = function __getValue() {};

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    return this.__getValue();
  };

  _proto.__addChild = function __addChild(child) {};

  _proto.__removeChild = function __removeChild(child) {};

  _proto.__getChildren = function __getChildren() {
    return [];
  };

  return Animated;
}();

var AnimatedTracking =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedTracking, _Animated);

  function AnimatedTracking(value, parent, animationClass, animationConfig, callback) {
    var _this;

    _this = _Animated.call(this) || this;
    _this.update = throttle(function () {
      _this._value.animate(new _this._animationClass(_extends({}, _this._animationConfig, {
        to: _this._animationConfig.to.__getValue()
      })), _this._callback);
    }, 1000 / 30);
    _this._value = value;
    _this._parent = parent;
    _this._animationClass = animationClass;
    _this._animationConfig = animationConfig;
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedTracking.prototype;

  _proto.__getValue = function __getValue() {
    return this._parent.__getValue();
  };

  _proto.__attach = function __attach() {
    this._parent.__addChild(this);
  };

  _proto.__detach = function __detach() {
    this._parent.__removeChild(this);
  };

  return AnimatedTracking;
}(Animated);

function throttle(func, wait) {
  var timeout = null;
  var previous = 0;

  var later = function later() {
    return func(previous = Date.now(), timeout = null);
  };

  return function () {
    var now = Date.now();
    var remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) void (clearTimeout(timeout), timeout = null);
      func(previous = now);
    } else if (!timeout) timeout = setTimeout(later, remaining);
  };
}

var AnimatedWithChildren =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedWithChildren, _Animated);

  function AnimatedWithChildren() {
    var _this;

    _this = _Animated.call(this) || this;
    _this._children = [];
    return _this;
  }

  var _proto = AnimatedWithChildren.prototype;

  _proto.__addChild = function __addChild(child) {
    if (this._children.length === 0) this.__attach();

    this._children.push(child);
  };

  _proto.__removeChild = function __removeChild(child) {
    var index = this._children.indexOf(child);

    if (index === -1) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Trying to remove a child that doesn't exist");
      }

      return;
    }

    this._children.splice(index, 1);

    if (this._children.length === 0) this.__detach();
  };

  _proto.__getChildren = function __getChildren() {
    return this._children;
  };

  return AnimatedWithChildren;
}(Animated);

var AnimatedInterpolation =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedInterpolation, _AnimatedWithChildren);

  function AnimatedInterpolation(parents, config) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    _this._parents = parents._values ? parents._values : Array.isArray(parents) ? parents : [parents];
    _this._interpolation = Interpolation.create(config);
    return _this;
  }

  var _proto = AnimatedInterpolation.prototype;

  _proto.__getValue = function __getValue() {
    return this._interpolation.apply(this, this._parents.map(function (value) {
      return value.__getValue();
    }));
  };

  _proto.__attach = function __attach() {
    for (var i = 0; i < this._parents.length; ++i) {
      if (this._parents[i] instanceof Animated) this._parents[i].__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var i = 0; i < this._parents.length; ++i) {
      if (this._parents[i] instanceof Animated) this._parents[i].__removeChild(this);
    }
  };

  _proto.__update = function __update(config) {
    this._interpolation = Interpolation.create(config);
    return this;
  };

  _proto.interpolate = function interpolate(config) {
    return new AnimatedInterpolation(this, config);
  };

  return AnimatedInterpolation;
}(AnimatedWithChildren);
var _uniqueId = 0;
/**
 * Animated works by building a directed acyclic graph of dependencies
 * transparently when you render your Animated components.
 *
 *               new Animated.Value(0)
 *     .interpolate()        .interpolate()    new Animated.Value(1)
 *         opacity               translateY      scale
 *          style                         transform
 *         View#234                         style
 *                                         View#123
 *
 * A) Top Down phase
 * When an Animated.Value is updated, we recursively go down through this
 * graph in order to find leaf nodes: the views that we flag as needing
 * an update.
 *
 * B) Bottom Up phase
 * When a view is flagged as needing an update, we recursively go back up
 * in order to build the new value that it needs. The reason why we need
 * this two-phases process is to deal with composite props such as
 * transform which can receive values from multiple parents.
 */

function findAnimatedStyles(node, styles) {
  if (typeof node.update === 'function') styles.add(node);else node.__getChildren().forEach(function (child) {
    return findAnimatedStyles(child, styles);
  });
}
/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 */


var AnimatedValue =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedValue, _AnimatedWithChildren);

  function AnimatedValue(_value) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;

    _this._updateValue = function (value) {
      _this._value = value;

      _this._flush();

      for (var key in _this._listeners) {
        _this._listeners[key]({
          value: value
        });
      }
    };

    _this._value = _value;
    _this._animation = null;
    _this._animatedStyles = new Set();
    _this._listeners = {};
    return _this;
  }

  var _proto = AnimatedValue.prototype;

  _proto.__detach = function __detach() {
    this.stopAnimation();
  };

  _proto.__getValue = function __getValue() {
    return this._value;
  };

  _proto._update = function _update() {
    findAnimatedStyles(this, this._animatedStyles);
  };

  _proto._flush = function _flush() {
    if (this._animatedStyles.size === 0) this._update();

    this._animatedStyles.forEach(function (animatedStyle) {
      return animatedStyle.update();
    });
  };

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   */
  _proto.setValue = function setValue(value) {
    if (this._animation) {
      this._animation.stop();

      this._animation = null;
    }

    this._animatedStyles.clear();

    this._updateValue(value);
  };
  /**
   * Stops any running animation or tracking.  `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   */


  _proto.stopAnimation = function stopAnimation(callback) {
    this.stopTracking();
    this._animation && this._animation.stop();
    this._animation = null;
    callback && callback(this.__getValue());
  };
  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */


  _proto.interpolate = function interpolate(config) {
    return new AnimatedInterpolation(this, config);
  };
  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   */


  _proto.animate = function animate(animation, callback) {
    var _this2 = this;

    var previousAnimation = this._animation;
    this._animation && this._animation.stop();
    this._animation = animation;

    this._animatedStyles.clear();

    animation.start(this._value, this._updateValue, function (result) {
      _this2._animation = null;
      callback && callback(result);
    }, previousAnimation);
  };
  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to
   * synchronously read the value because it might be driven natively.
   */


  _proto.addListener = function addListener(callback) {
    var id = String(_uniqueId++);
    this._listeners[id] = callback;
    return id;
  };

  _proto.removeListener = function removeListener(id) {
    delete this._listeners[id];
  };

  _proto.removeAllListeners = function removeAllListeners() {
    this._listeners = {};
  };
  /**
   * Typically only used internally.
   */


  _proto.stopTracking = function stopTracking() {
    this._tracking && this._tracking.__detach();
    this._tracking = null;
  };
  /**
   * Typically only used internally.
   */


  _proto.track = function track(tracking) {
    this.stopTracking();
    this._tracking = tracking;
  };

  return AnimatedValue;
}(AnimatedWithChildren);

function shallowEqual(a, b) {
  for (var i in a) {
    if (!(i in b)) return false;
  }

  for (var _i in b) {
    if (a[_i] !== b[_i]) return false;
  }

  return true;
}
function callProp(obj, state) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return typeof obj === 'function' ? obj.apply(void 0, [state].concat(args)) : obj;
}
function getValues(object) {
  return Object.keys(object).map(function (k) {
    return object[k];
  });
}
function getForwardProps(props) {
  var to = props.to,
      from = props.from,
      config = props.config,
      native = props.native,
      onRest = props.onRest,
      onFrame = props.onFrame,
      children = props.children,
      render = props.render,
      reset = props.reset,
      reverse = props.reverse,
      force = props.force,
      immediate = props.immediate,
      impl = props.impl,
      inject = props.inject,
      delay = props.delay,
      attach = props.attach,
      destroyed = props.destroyed,
      forward = _objectWithoutPropertiesLoose(props, ["to", "from", "config", "native", "onRest", "onFrame", "children", "render", "reset", "reverse", "force", "immediate", "impl", "inject", "delay", "attach", "destroyed"]);

  return forward;
}
function renderChildren(props, componentProps) {
  var forward = _extends({}, componentProps, getForwardProps(props));

  return props.render ? props.render(_extends({}, forward, {
    children: props.children
  })) : props.children(forward);
}
function convertToAnimatedValue(acc, _ref) {
  var _extends2;

  var name = _ref[0],
      value = _ref[1];
  return _extends({}, acc, (_extends2 = {}, _extends2[name] = new AnimatedValue(value), _extends2));
}
function convertValues(props) {
  var from = props.from,
      to = props.to,
      native = props.native;
  var allProps = Object.entries(_extends({}, from, to));
  return native ? allProps.reduce(convertToAnimatedValue, {}) : _extends({}, from, to);
}

var check$1 = function check(value) {
  return value === 'auto';
};

var overwrite = function overwrite(width, height) {
  return function (acc, _ref) {
    var _extends2;

    var name = _ref[0],
        value = _ref[1];
    return _extends({}, acc, (_extends2 = {}, _extends2[name] = value === 'auto' ? ~name.indexOf('height') ? height : width : value, _extends2));
  };
};

function fixAuto(props, callback) {
  var from = props.from,
      to = props.to; // Dry-route props back if nothing's using 'auto' in there
  // TODO: deal with "null"

  if (!(getValues(to).some(check$1) || getValues(from).some(check$1))) return; // Fetch render v-dom

  var element = renderChildren(props, convertValues(props)); // A spring can return undefined/null, check against that (#153)

  if (!element) return;
  var elementStyles = element.props.style; // Return v.dom with injected ref

  return React.createElement(element.type, _extends({
    key: element.key
  }, element.props, {
    style: _extends({}, elementStyles, {
      position: 'absolute',
      visibility: 'hidden'
    }),
    ref: function ref(_ref2) {
      if (_ref2) {
        // Once it's rendered out, fetch bounds (minus padding/margin/borders)
        var node = ReactDOM.findDOMNode(_ref2);
        var width, height;
        var cs = getComputedStyle(node);

        if (cs.boxSizing === 'border-box') {
          width = node.offsetWidth;
          height = node.offsetHeight;
        } else {
          var paddingX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
          var paddingY = parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);
          var borderX = parseFloat(cs.borderLeftWidth || 0) + parseFloat(cs.borderRightWidth || 0);
          var borderY = parseFloat(cs.borderTopWidth || 0) + parseFloat(cs.borderBottomWidth || 0);
          width = node.offsetWidth - paddingX - borderX;
          height = node.offsetHeight - paddingY - borderY;
        }

        var convert = overwrite(width, height);
        callback(_extends({}, props, {
          from: Object.entries(from).reduce(convert, from),
          to: Object.entries(to).reduce(convert, to)
        }));
      }
    }
  }));
}

var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

var prefixKey = function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
};

var prefixes = ['Webkit', 'Ms', 'Moz', 'O'];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce(function (acc, prop) {
  prefixes.forEach(function (prefix) {
    return acc[prefixKey(prefix, prop)] = acc[prop];
  });
  return acc;
}, isUnitlessNumber);

function dangerousStyleValue(name, value, isCustomProperty) {
  if (value == null || typeof value === 'boolean' || value === '') return '';
  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers

  return ('' + value).trim();
}

injectDefaultElement('div');
injectInterpolation(createInterpolation);
injectColorNames(colors$1);
injectBugfixes(fixAuto);
injectApplyAnimatedValues(function (instance, props) {
  if (instance.nodeType && instance.setAttribute !== undefined) {
    var style = props.style,
        children = props.children,
        scrollTop = props.scrollTop,
        scrollLeft = props.scrollLeft,
        attributes = _objectWithoutPropertiesLoose(props, ["style", "children", "scrollTop", "scrollLeft"]);

    if (scrollTop) instance.scrollTop = scrollTop;
    if (scrollLeft) instance.scrollLeft = scrollLeft; // Set textContent, if children is an animatable value

    if (children) instance.textContent = children; // Set styles ...

    for (var styleName in style) {
      if (!style.hasOwnProperty(styleName)) continue;
      var isCustomProperty = styleName.indexOf('--') === 0;
      var styleValue = dangerousStyleValue(styleName, style[styleName], isCustomProperty);
      if (styleName === 'float') styleName = 'cssFloat';
      if (isCustomProperty) instance.style.setProperty(styleName, styleValue);else instance.style[styleName] = styleValue;
    } // Set attributes ...


    for (var name in attributes) {
      var dashCase = name.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase();
      });
      if (typeof instance.getAttribute(dashCase) !== 'undefined') instance.setAttribute(dashCase, attributes[name]);
    }
  } else return false;
}, function (style) {
  return style;
});

// Important note: start() and stop() will only be called at most once.
// Once an animation has been stopped or finished its course, it will
// not be reused.
var Animation =
/*#__PURE__*/
function () {
  function Animation() {}

  var _proto = Animation.prototype;

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation) {};

  _proto.stop = function stop() {}; // Helper function for subclasses to make sure onEnd is only called once.


  _proto.__debouncedOnEnd = function __debouncedOnEnd(result) {
    var onEnd = this.__onEnd;
    this.__onEnd = null;
    onEnd && onEnd(result);
  };

  return Animation;
}();

var withDefault = function withDefault(value, defaultValue) {
  return value === undefined || value === null ? defaultValue : value;
};

var tensionFromOrigamiValue = function tensionFromOrigamiValue(oValue) {
  return (oValue - 30) * 3.62 + 194;
};

var frictionFromOrigamiValue = function frictionFromOrigamiValue(oValue) {
  return (oValue - 8) * 3 + 25;
};

var fromOrigamiTensionAndFriction = function fromOrigamiTensionAndFriction(tension, friction) {
  return {
    tension: tensionFromOrigamiValue(tension),
    friction: frictionFromOrigamiValue(friction)
  };
};

var SpringAnimation =
/*#__PURE__*/
function (_Animation) {
  _inheritsLoose(SpringAnimation, _Animation);

  function SpringAnimation(config) {
    var _this;

    _this = _Animation.call(this) || this;

    _this.startAsync = function () {
      _this._lastTime = now();

      if (typeof _this._startPosition === 'string' || typeof _this._to === 'string') {
        _this._onUpdate(_this._to);

        return _this.__debouncedOnEnd({
          finished: true
        });
      }

      if (_this.__previous instanceof SpringAnimation) {
        var internalState = _this.__previous.getInternalState();

        _this._lastPosition = internalState.lastPosition;
        _this._lastVelocity = internalState.lastVelocity;
        _this._lastTime = internalState.lastTime;
      }

      if (_this._initialVelocity !== undefined && _this._initialVelocity !== null) _this._lastVelocity = _this._initialVelocity;

      _this.onUpdate();
    };

    _this.onUpdate = function () {
      var position = _this._lastPosition;
      var velocity = _this._lastVelocity;
      var tempPosition = _this._lastPosition;
      var tempVelocity = _this._lastVelocity; // If for some reason we lost a lot of frames (e.g. process large payload or
      // stopped in the debugger), we only advance by 4 frames worth of
      // computation and will continue on the next frame. It's better to have it
      // running at faster speed than jumping to the end.

      var MAX_STEPS = 64;
      var now$$1 = now();
      if (now$$1 > _this._lastTime + MAX_STEPS) now$$1 = _this._lastTime + MAX_STEPS; // We are using a fixed time step and a maximum number of iterations.
      // The following post provides a lot of thoughts into how to build this
      // loop: http://gafferongames.com/game-physics/fix-your-timestep/

      var TIMESTEP_MSEC = 1;
      var numSteps = Math.floor((now$$1 - _this._lastTime) / TIMESTEP_MSEC);

      for (var i = 0; i < numSteps; ++i) {
        // Velocity is based on seconds instead of milliseconds
        var step = TIMESTEP_MSEC / 1000; // This is using RK4. A good blog post to understand how it works:
        // http://gafferongames.com/game-physics/integration-basics/

        var aVelocity = velocity;
        var aAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + aVelocity * step / 2;
        tempVelocity = velocity + aAcceleration * step / 2;
        var bVelocity = tempVelocity;
        var bAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + bVelocity * step / 2;
        tempVelocity = velocity + bAcceleration * step / 2;
        var cVelocity = tempVelocity;
        var cAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;
        var dVelocity = tempVelocity;
        var dAcceleration = _this._tension * (_this._to - tempPosition) - _this._friction * tempVelocity;
        tempPosition = position + cVelocity * step / 2;
        tempVelocity = velocity + cAcceleration * step / 2;
        var dxdt = (aVelocity + 2 * (bVelocity + cVelocity) + dVelocity) / 6;
        var dvdt = (aAcceleration + 2 * (bAcceleration + cAcceleration) + dAcceleration) / 6;
        position += dxdt * step;
        velocity += dvdt * step;
      }

      _this._lastTime = now$$1;
      _this._lastPosition = position;
      _this._lastVelocity = velocity; // Conditions for stopping the spring animation

      var isOvershooting = _this._overshootClamping && _this._tension !== 0 ? _this._startPosition < _this._to ? position > _this._to : position < _this._to : false;

      var isVelocity = Math.abs(velocity) <= _this._restSpeedThreshold;

      var isDisplacement = _this._tension !== 0 ? Math.abs(_this._to - position) <= _this._restDisplacementThreshold : true;
      var endOfAnimation = isOvershooting || isVelocity && isDisplacement; // a listener might have stopped us in _onUpdate

      if (!_this.__active) return;

      if (endOfAnimation) {
        // Ensure that we end up with a round value
        if (_this._tension !== 0) _this._onUpdate(_this._to);
        return _this.__debouncedOnEnd({
          finished: true
        });
      } else _this._onUpdate(position);

      _this._animationFrame = requestFrame(_this.onUpdate);
    };

    _this._overshootClamping = withDefault(config.overshootClamping, false);
    _this._restDisplacementThreshold = withDefault(config.restDisplacementThreshold, 0.0001);
    _this._restSpeedThreshold = withDefault(config.restSpeedThreshold, 0.0001);
    _this._initialVelocity = config.velocity;
    _this._lastVelocity = withDefault(config.velocity, 0);
    _this._to = config.to;
    var springConfig = fromOrigamiTensionAndFriction(withDefault(config.tension, 40), withDefault(config.friction, 7));
    _this._tension = springConfig.tension;
    _this._friction = springConfig.friction;
    _this._delay = withDefault(config.delay, 0);
    return _this;
  }

  var _proto = SpringAnimation.prototype;

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation) {
    this.__active = true;
    this._startPosition = fromValue;
    this._lastPosition = this._startPosition;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this.__previous = previousAnimation;

    if (this._delay > 0) {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = undefined;
      }

      this._timer = setTimeout(this.startAsync, this._delay);
    } else this.startAsync();
  };

  _proto.getInternalState = function getInternalState() {
    return {
      lastPosition: this._lastPosition,
      lastVelocity: this._lastVelocity,
      lastTime: this._lastTime
    };
  };

  _proto.stop = function stop() {
    this.__active = false;
    clearTimeout(this._timeout);
    this._timeout = undefined;
    cancelFrame(this._animationFrame);

    this.__debouncedOnEnd({
      finished: false
    });
  };

  return SpringAnimation;
}(Animation);

var AnimatedArray =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedArray, _AnimatedWithChildren);

  function AnimatedArray(array) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    _this._values = array.map(function (n) {
      return new AnimatedValue(n);
    });
    return _this;
  }

  var _proto = AnimatedArray.prototype;

  _proto.setValue = function setValue(values) {
    var _this2 = this;

    values.forEach(function (n, i) {
      return _this2._values[i].setValue(n);
    });
  };

  _proto.__getValue = function __getValue() {
    return this._values.map(function (v) {
      return v.__getValue();
    });
  };

  _proto.stopAnimation = function stopAnimation(callback) {
    this._values.forEach(function (v) {
      return v.stopAnimation();
    });

    callback && callback(this.__getValue());
  };

  _proto.__attach = function __attach() {
    for (var i = 0; i < this._values.length; ++i) {
      if (this._values[i] instanceof Animated) this._values[i].__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var i = 0; i < this._values.length; ++i) {
      if (this._values[i] instanceof Animated) this._values[i].__removeChild(this);
    }
  };

  return AnimatedArray;
}(AnimatedWithChildren);

function maybeVectorAnim(array, _ref, anim, impl) {
  var to = _ref.to,
      rest = _objectWithoutPropertiesLoose(_ref, ["to"]);

  if (array instanceof AnimatedArray) return parallel(array._values.map(function (v, i) {
    return anim(v, _extends({}, rest, {
      to: to[i]
    }), impl);
  }), {
    stopTogether: false
  });
  return null;
}

function parallel(animations, config) {
  var doneCount = 0;
  var hasEnded = {};
  var stopTogether = !(config && config.stopTogether === false);
  var result = {
    start: function start(callback) {
      if (doneCount === animations.length) return callback && callback({
        finished: true
      });
      animations.forEach(function (animation, idx) {
        var cb = function cb(endResult) {
          hasEnded[idx] = true;
          doneCount++;

          if (doneCount === animations.length) {
            doneCount = 0;
            return callback && callback(endResult);
          }

          if (!endResult.finished && stopTogether) result.stop();
        };

        if (!animation) cb({
          finished: true
        });else animation.start(cb);
      });
    },
    stop: function stop() {
      animations.forEach(function (animation, idx) {
        !hasEnded[idx] && animation.stop();
        hasEnded[idx] = true;
      });
    }
  };
  return result;
}

function controller(value, config, impl) {
  if (impl === void 0) {
    impl = SpringAnimation;
  }

  return maybeVectorAnim(value, config, controller, impl) || {
    start: function start(callback) {
      var singleValue = value;
      var singleConfig = config;
      singleValue.stopTracking();
      if (config.to instanceof Animated) singleValue.track(new AnimatedTracking(singleValue, config.to, impl, singleConfig, callback));else singleValue.animate(new impl(singleConfig), callback);
    },
    stop: function stop() {
      value.stopAnimation();
    }
  };
}

var AnimatedStyle =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedStyle, _AnimatedWithChildren);

  function AnimatedStyle(style) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    style = style || {};
    if (style.transform && !(style.transform instanceof Animated)) style = applyAnimatedValues.transform(style);
    _this._style = style;
    return _this;
  }

  var _proto = AnimatedStyle.prototype;

  _proto.__getValue = function __getValue() {
    var style = {};

    for (var key in this._style) {
      var value = this._style[key];
      style[key] = value instanceof Animated ? value.__getValue() : value;
    }

    return style;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    var style = {};

    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) style[key] = value.__getAnimatedValue();
    }

    return style;
  };

  _proto.__attach = function __attach() {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) value.__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var key in this._style) {
      var value = this._style[key];
      if (value instanceof Animated) value.__removeChild(this);
    }
  };

  return AnimatedStyle;
}(AnimatedWithChildren);

var AnimatedProps =
/*#__PURE__*/
function (_Animated) {
  _inheritsLoose(AnimatedProps, _Animated);

  function AnimatedProps(props, callback) {
    var _this;

    _this = _Animated.call(this) || this;

    if (props.style) {
      props = _extends({}, props, {
        style: new AnimatedStyle(props.style)
      });
    }

    _this._props = props;
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedProps.prototype;

  _proto.__getValue = function __getValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) props[key] = value.__getValue();else props[key] = value;
    }

    return props;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) props[key] = value.__getAnimatedValue();
    }

    return props;
  };

  _proto.__attach = function __attach() {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) value.__addChild(this);
    }
  };

  _proto.__detach = function __detach() {
    for (var key in this._props) {
      var value = this._props[key];
      if (value instanceof Animated) value.__removeChild(this);
    }
  };

  _proto.update = function update() {
    this._callback();
  };

  return AnimatedProps;
}(Animated);

function createAnimatedComponent(Component) {
  var AnimatedComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(AnimatedComponent, _React$Component);

    function AnimatedComponent() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = AnimatedComponent.prototype;

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._propsAnimated && this._propsAnimated.__detach();
    };

    _proto.setNativeProps = function setNativeProps(props) {
      var didUpdate = applyAnimatedValues.fn(this.node, props, this);
      if (didUpdate === false) this.forceUpdate();
    };

    _proto.componentWillMount = function componentWillMount() {
      this.attachProps(this.props);
    };

    _proto.attachProps = function attachProps(_ref) {
      var _this = this;

      var forwardRef = _ref.forwardRef,
          nextProps = _objectWithoutPropertiesLoose(_ref, ["forwardRef"]);

      var oldPropsAnimated = this._propsAnimated; // The system is best designed when setNativeProps is implemented. It is
      // able to avoid re-rendering and directly set the attributes that
      // changed. However, setNativeProps can only be implemented on leaf
      // native components. If you want to animate a composite component, you
      // need to re-render it. In this case, we have a fallback that uses
      // forceUpdate.

      var callback = function callback() {
        if (_this.node) {
          var didUpdate = applyAnimatedValues.fn(_this.node, _this._propsAnimated.__getAnimatedValue(), _this);
          if (didUpdate === false) _this.forceUpdate();
        }
      };

      this._propsAnimated = new AnimatedProps(nextProps, callback); // When you call detach, it removes the element from the parent list
      // of children. If it goes to 0, then the parent also detaches itself
      // and so on.
      // An optimization is to attach the new elements and THEN detach the old
      // ones instead of detaching and THEN attaching.
      // This way the intermediate state isn't to go to 0 and trigger
      // this expensive recursive detaching to then re-attach everything on
      // the very next operation.

      oldPropsAnimated && oldPropsAnimated.__detach();
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      this.attachProps(nextProps);
    };

    _proto.render = function render() {
      var _this2 = this;

      var forwardRef = this.props.forwardRef;

      var _this$_propsAnimated$ = this._propsAnimated.__getValue(),
          scrollTop = _this$_propsAnimated$.scrollTop,
          scrollLeft = _this$_propsAnimated$.scrollLeft,
          animatedProps = _objectWithoutPropertiesLoose(_this$_propsAnimated$, ["scrollTop", "scrollLeft"]);

      return React.createElement(Component, _extends({}, animatedProps, {
        ref: function ref(node) {
          _this2.node = node;
          var forwardRef = _this2.props.forwardRef;

          if (forwardRef) {
            // If it's a function, assume it's a ref callback
            if (typeof forwardRef === 'function') forwardRef(node); // If it's an object and has a 'current' property, assume it's a ref object
            else if (typeof forwardRef === 'object') forwardRef.current = node;
          }
        }
      }));
    };

    return AnimatedComponent;
  }(React.Component);

  return React.forwardRef(function (props, ref) {
    return React.createElement(AnimatedComponent, _extends({}, props, {
      forwardRef: ref
    }));
  });
}

var config = {
  default: {
    tension: 170,
    friction: 26
  },
  gentle: {
    tension: 120,
    friction: 14
  },
  wobbly: {
    tension: 180,
    friction: 12
  },
  stiff: {
    tension: 210,
    friction: 20
  },
  slow: {
    tension: 280,
    friction: 60
  },
  molasses: {
    tension: 280,
    friction: 120
  }
};

var v = React.version.split('.');

if (process.env.NODE_ENV !== 'production' && (v[0] < 16 || v[1] < 4)) {
  console.warn('Please consider upgrading to react/react-dom 16.4.x or higher! Older React versions break getDerivedStateFromProps, see https://github.com/facebook/react/issues/12898');
}

var Spring =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Spring, _React$Component);

  function Spring() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      lastProps: {
        from: {},
        to: {}
      },
      propsChanged: false,
      internal: false
    };
    _this.didUpdate = false;
    _this.didInject = false;
    _this.updating = false;
    _this.animations = {};
    _this.interpolators = {};
    _this.mergedProps = {};

    _this.start = function () {
      var _this$props = _this.props,
          config$$1 = _this$props.config,
          delay = _this$props.delay,
          impl = _this$props.impl;
      if (_this.props.onStart) _this.props.onStart();
      Object.keys(_this.animations).forEach(function (name) {
        var _this$animations$name = _this.animations[name],
            animation = _this$animations$name.animation,
            to = _this$animations$name.toValue; // TODO: figure out why this is needed ...

        if (!to.__getValue && animation.__getValue() === to) return _this.finishAnimation(name);
        controller(animation, _extends({
          to: to,
          delay: delay
        }, callProp(config$$1, name)), impl).start(!to.__getValue && function (props) {
          return props.finished && _this.finishAnimation(name);
        });
      });
    };

    _this.stop = function () {
      return getValues(_this.animations).forEach(function (_ref) {
        var animation = _ref.animation;
        return animation.stopAnimation();
      });
    };

    _this.finishAnimation = function (name) {
      var _this$animations$name2 = _this.animations[name],
          animation = _this$animations$name2.animation,
          to = _this$animations$name2.toValue;
      _this.animations[name].stopped = true;
      if (!_this.mounted) return;

      if (getValues(_this.animations).every(function (a) {
        return a.stopped;
      })) {
        var current = _extends({}, _this.props.from, _this.props.to);

        if (_this.props.onRest) _this.props.onRest(current); // Restore end-state

        if (_this.didInject) {
          _this.afterInject = convertValues(_this.props);
          _this.didInject = false;

          _this.setState({
            internal: true
          });
        }
      }
    };

    return _this;
  }

  var _proto = Spring.prototype;

  _proto.componentDidMount = function componentDidMount() {
    // componentDidUpdate isn't called on mount, we call it here to start animating
    this.componentDidUpdate();
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // Stop all ongoing animtions
    this.mounted = false;
    this.stop();
  };

  Spring.getDerivedStateFromProps = function getDerivedStateFromProps(props, _ref2) {
    var internal = _ref2.internal,
        lastProps = _ref2.lastProps;
    // The following is a test against props that could alter the animation
    var from = props.from,
        to = props.to,
        reset = props.reset,
        force = props.force;
    var propsChanged = !shallowEqual(to, lastProps.to) || !shallowEqual(from, lastProps.from) || reset && !internal || force && !internal;
    return {
      propsChanged: propsChanged,
      lastProps: props,
      internal: false
    };
  };

  _proto.render = function render() {
    var _this2 = this;

    var propsChanged = this.state.propsChanged; // Handle injected frames, for instance targets/web/fix-auto
    // An inject will return an intermediary React node which measures itself out
    // .. and returns a callback when the values sought after are ready, usually "auto".

    if (this.props.inject && propsChanged && !this.injectProps) {
      var frame = this.props.inject(this.props, function (injectProps) {
        // The inject frame has rendered, now let's update animations...
        _this2.injectProps = injectProps;

        _this2.setState({
          internal: true
        });
      }); // Render out injected frame

      if (frame) return frame;
    } // Update animations, this turns from/to props into AnimatedValues
    // An update can occur on injected props, or when own-props have changed.


    if (this.injectProps) {
      this.updateAnimations(this.injectProps);
      this.injectProps = undefined; // didInject is needed, because there will be a 3rd stage, where the original values
      // .. will be restored after the animation is finished. When someone animates towards
      // .. "auto", the end-result should be "auto", not "1999px", which would block nested
      // .. height/width changes.

      this.didInject = true;
    } else if (propsChanged) this.updateAnimations(this.props); // Render out raw values or AnimatedValues depending on "native"


    var values = this.getAnimatedValues();
    return values && Object.keys(values).length ? renderChildren(this.props, _extends({}, values, this.afterInject)) : null;
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    // The animation has to start *after* render, since at that point the scene
    // .. graph should be established, so we do it here. Unfortunatelly, non-native
    // .. animations as well as "auto"-injects call forceUpdate, so it's causing a loop.
    // .. didUpdate prevents that as it gets set only on prop changes.
    if (this.didUpdate) this.start();
    this.didUpdate = false;
  };

  _proto.updateAnimations = function updateAnimations(_ref3) {
    var _this3 = this;

    var from = _ref3.from,
        to = _ref3.to,
        reverse = _ref3.reverse,
        attach = _ref3.attach,
        reset = _ref3.reset,
        immediate = _ref3.immediate,
        onFrame = _ref3.onFrame,
        native = _ref3.native;
    // This function will turn own-props into AnimatedValues, it tries to re-use
    // .. exsting animations as best as it can by detecting the changes made
    // We can potentially cause setState, but we're inside render, the flag prevents that
    this.updating = true; // Reverse values when requested

    if (reverse) {
      var _ref4 = [to, from];
      from = _ref4[0];
      to = _ref4[1];
    } // Attachment handling, trailed springs can "attach" themselves to a previous spring


    var target = attach && attach(this);
    var animationsChanged = false;
    this.mergedProps = _extends({}, from, this.mergedProps, to);
    var allProps = Object.entries(this.mergedProps);
    this.animations = allProps.reduce(function (acc, _ref5, i) {
      var _extends2, _extends3;

      var name = _ref5[0],
          value = _ref5[1];
      var entry = reset === false && acc[name] || {
        stopped: true
      };
      var isNumber = typeof value === 'number';
      var isString = typeof value === 'string' && !value.startsWith('#') && !/\d/.test(value) && !colorNames[value];
      var isArray = !isNumber && !isString && Array.isArray(value);
      var fromValue = from[name] !== undefined ? from[name] : value;
      var fromAnimated = fromValue instanceof AnimatedValue;
      var toValue = isNumber || isArray ? value : isString ? value : 1;

      if (target) {
        // Attach value to target animation
        var attachedAnimation = target.animations[name];
        if (attachedAnimation) toValue = attachedAnimation.animation;
      }

      var old = entry.animation;
      var animation, interpolation$$1;

      if (fromAnimated) {
        // Use provided animated value
        animation = interpolation$$1 = fromValue;
      } else if (isNumber || isString) {
        // Create animated value
        animation = interpolation$$1 = entry.animation || new AnimatedValue(fromValue);
      } else if (isArray) {
        // Create animated array
        animation = interpolation$$1 = entry.animation || new AnimatedArray(fromValue);
      } else {
        // Deal with interpolations
        var previous = entry.interpolation && entry.interpolation._interpolation(entry.animation._value);

        if (entry.animation) {
          animation = entry.animation;
          animation.setValue(0);
        } else animation = new AnimatedValue(0);

        var _config = {
          range: [0, 1],
          output: [previous !== undefined ? previous : fromValue, value]
        };
        if (entry.interpolation) interpolation$$1 = entry.interpolation.__update(_config);else interpolation$$1 = animation.interpolate(_config);
      }

      if (old !== animation) animationsChanged = true; // Set immediate values

      if (callProp(immediate, name)) animation.setValue(toValue); // Save interpolators

      _this3.interpolators = _extends({}, _this3.interpolators, (_extends2 = {}, _extends2[name] = interpolation$$1, _extends2));
      return _extends({}, acc, (_extends3 = {}, _extends3[name] = _extends({}, entry, {
        name: name,
        animation: animation,
        interpolation: interpolation$$1,
        toValue: toValue,
        stopped: false
      }), _extends3));
    }, this.animations); // Update animated props (which from now on will take care of the animation)

    if (animationsChanged) {
      var oldAnimatedProps = this.animatedProps;
      this.animatedProps = new AnimatedProps(this.interpolators, function () {
        // This gets called on every animation frame ...
        if (onFrame) onFrame(_this3.animatedProps.__getValue());
        if (!native && !_this3.updating) _this3.setState({
          internal: true
        });
      });
      oldAnimatedProps && oldAnimatedProps.__detach();
    } // Flag an update that occured, componentDidUpdate will start the animation later on


    this.didUpdate = true;
    this.afterInject = undefined;
    this.didInject = false;
    this.updating = false;
  };

  _proto.flush = function flush() {
    getValues(this.animations).forEach(function (_ref6) {
      var animation = _ref6.animation;
      return animation._update && animation._update();
    });
  };

  _proto.getValues = function getValues$$1() {
    return this.animatedProps ? this.animatedProps.__getValue() : {};
  };

  _proto.getAnimatedValues = function getAnimatedValues() {
    return this.props.native ? this.interpolators : this.getValues();
  };

  return Spring;
}(React.Component);

Spring.defaultProps = {
  from: {},
  to: {},
  config: config.default,
  native: false,
  immediate: false,
  reset: false,
  force: false,
  impl: SpringAnimation,
  inject: bugfixes
};

var empty = function empty() {
  return null;
};

var get$1 = function get(props) {
  var keys = props.keys,
      children = props.children,
      render = props.render,
      items = props.items,
      rest = _objectWithoutPropertiesLoose(props, ["keys", "children", "render", "items"]);

  children = render || children || empty;
  keys = typeof keys === 'function' ? items.map(keys) : keys;

  if (!Array.isArray(children)) {
    children = [children];
    keys = keys !== void 0 ? [keys] : children.map(function (c) {
      return c.toString();
    });
  } // Make sure numeric keys are interpreted as Strings (5 !== "5")


  keys = keys.map(function (k) {
    return String(k);
  });
  return _extends({
    keys: keys,
    children: children,
    items: items
  }, rest);
};

var guid = 0;

var Transition =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Transition, _React$PureComponent);

  var _proto = Transition.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  function Transition(prevProps) {
    var _this;

    _this = _React$PureComponent.call(this, prevProps) || this;

    _this.destroyItem = function (item, key) {
      return function (values) {
        var _this$props = _this.props,
            onRest = _this$props.onRest,
            onDestroyed = _this$props.onDestroyed;

        if (_this.mounted) {
          onDestroyed && onDestroyed(item);

          _this.setState(function (_ref) {
            var deleted = _ref.deleted;
            return {
              deleted: deleted.filter(function (t) {
                return t.key !== key;
              })
            };
          }, function () {
            return delete _this.springs[key];
          });

          onRest && onRest(item, values);
        }
      };
    };

    _this.springs = {};
    _this.state = {
      first: true,
      transitions: [],
      current: {},
      deleted: [],
      prevProps: prevProps
    };
    return _this;
  }

  Transition.getDerivedStateFromProps = function getDerivedStateFromProps(props, _ref2) {
    var first = _ref2.first,
        prevProps = _ref2.prevProps,
        state = _objectWithoutPropertiesLoose(_ref2, ["first", "prevProps"]);

    var _get = get$1(props),
        keys = _get.keys,
        children = _get.children,
        items = _get.items,
        initial = _get.initial,
        from = _get.from,
        enter = _get.enter,
        leave = _get.leave,
        update = _get.update,
        _get$delay = _get.delay,
        delay = _get$delay === void 0 ? 0 : _get$delay,
        config$$1 = _get.config;

    var _get2 = get$1(prevProps),
        _keys = _get2.keys,
        _items = _get2.items;

    var current = _extends({}, state.current);

    var deleted = state.deleted.concat(); // Compare next keys with current keys

    var currentKeys = Object.keys(current);
    var currentSet = new Set(currentKeys);
    var nextSet = new Set(keys);
    var added = keys.filter(function (item) {
      return !currentSet.has(item);
    });
    var removed = currentKeys.filter(function (item) {
      return !nextSet.has(item);
    });
    var updated = keys.filter(function (item) {
      return currentSet.has(item);
    });
    var trail = 0;
    added.forEach(function (key) {
      var keyIndex = keys.indexOf(key);
      var item = items ? items[keyIndex] : key;
      current[key] = {
        originalKey: key,
        key: guid++,
        item: item,
        delay: trail = trail + delay,
        children: children[keyIndex],
        config: callProp(config$$1, item, 'enter'),
        from: _extends({}, callProp(first ? typeof initial !== 'undefined' ? initial : from : from, item)),
        to: callProp(enter, item)
      };
    });
    removed.forEach(function (key) {
      var keyIndex = _keys.indexOf(key);

      var item = _items ? _items[keyIndex] : key;
      deleted.push(_extends({}, current[key], {
        destroyed: true,
        lastSibling: _keys[Math.max(0, keyIndex - 1)],
        delay: trail = trail + delay,
        config: callProp(config$$1, item, 'leave'),
        to: _extends({}, current[key].to, callProp(leave, item))
      }));
      delete current[key];
    });
    updated.forEach(function (key) {
      var keyIndex = keys.indexOf(key);
      var item = items ? items[keyIndex] : key;
      current[key] = _extends({}, current[key], {
        delay: trail = trail + delay,
        children: children[keyIndex],
        config: callProp(config$$1, item, 'update'),
        to: _extends({}, current[key].to, callProp(update, item))
      });
    });
    var transitions = keys.map(function (key) {
      return current[key];
    });
    deleted.forEach(function (_ref3) {
      var s = _ref3.lastSibling,
          t = _objectWithoutPropertiesLoose(_ref3, ["lastSibling"]);

      // Find last known sibling, left aligned
      var i = Math.max(0, transitions.findIndex(function (t) {
        return t.originalKey === s;
      }) + 1);
      transitions = transitions.slice(0, i).concat([t], transitions.slice(i));
    });
    return {
      first: first && added.length === 0,
      transitions: transitions,
      current: current,
      deleted: deleted,
      prevProps: props
    };
  };

  _proto.getValues = function getValues$$1() {
    return undefined;
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props2 = this.props,
        render = _this$props2.render,
        initial = _this$props2.initial,
        _this$props2$from = _this$props2.from,
        _this$props2$enter = _this$props2.enter,
        _this$props2$leave = _this$props2.leave,
        onDestroyed = _this$props2.onDestroyed,
        keys = _this$props2.keys,
        items = _this$props2.items,
        onFrame = _this$props2.onFrame,
        onRest = _this$props2.onRest,
        delay = _this$props2.delay,
        config$$1 = _this$props2.config,
        extra = _objectWithoutPropertiesLoose(_this$props2, ["render", "initial", "from", "enter", "leave", "onDestroyed", "keys", "items", "onFrame", "onRest", "delay", "config"]);

    return this.state.transitions.map(function (_ref4, i) {
      var key = _ref4.key,
          item = _ref4.item,
          children = _ref4.children,
          from = _ref4.from,
          to = _ref4.to,
          delay = _ref4.delay,
          config$$1 = _ref4.config,
          destroyed = _ref4.destroyed;
      return React.createElement(Spring, _extends({
        ref: function ref(r) {
          return r && (_this2.springs[key] = r.getValues());
        },
        key: key,
        onRest: destroyed ? _this2.destroyItem(item, key) : onRest && function (values) {
          return onRest(item, values);
        },
        onFrame: onFrame && function (values) {
          return onFrame(item, values);
        },
        delay: delay,
        config: config$$1
      }, extra, {
        from: destroyed ? _this2.springs[key] || from : from,
        to: to,
        render: render && children,
        children: render ? _this2.props.children : children
      }));
    });
  };

  return Transition;
}(React.PureComponent);

var Trail =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Trail, _React$PureComponent);

  function Trail() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Trail.prototype;

  _proto.getValues = function getValues() {
    return this.instance && this.instance.getValues();
  };

  _proto.componentDidMount = function componentDidMount() {
    this.instance && this.instance.flush();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.instance && this.instance.flush();
  };

  _proto.render = function render() {
    var _this = this;

    var _this$props = this.props,
        children = _this$props.children,
        render = _this$props.render,
        _this$props$from = _this$props.from,
        from = _this$props$from === void 0 ? {} : _this$props$from,
        _this$props$to = _this$props.to,
        to = _this$props$to === void 0 ? {} : _this$props$to,
        _this$props$native = _this$props.native,
        native = _this$props$native === void 0 ? false : _this$props$native,
        keys = _this$props.keys,
        delay = _this$props.delay,
        onRest = _this$props.onRest,
        extra = _objectWithoutPropertiesLoose(_this$props, ["children", "render", "from", "to", "native", "keys", "delay", "onRest"]);

    var animations = new Set();

    var hook = function hook(index, animation) {
      animations.add(animation);
      if (index === 0) return undefined;else return Array.from(animations)[index - 1];
    };

    var props = _extends({}, extra, {
      native: native,
      from: from,
      to: to
    });

    var target = render || children;
    return target.map(function (child, i) {
      var attachedHook = function attachedHook(animation) {
        return hook(i, animation);
      };

      var firstDelay = i === 0 && delay;
      return React.createElement(Spring, _extends({
        ref: function ref(_ref) {
          return i === 0 && (_this.instance = _ref);
        },
        onRest: i === 0 ? onRest : null,
        key: keys[i]
      }, props, {
        delay: firstDelay || undefined,
        attach: attachedHook,
        render: render && child,
        children: render ? children : child
      }));
    });
  };

  return Trail;
}(React.PureComponent);

var DEFAULT = '__default';

var Keyframes =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(Keyframes, _React$PureComponent);

  function Keyframes() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
    _this.guid = 0;
    _this.state = {
      props: {},
      oldProps: {},
      resolve: function resolve() {
        return null;
      }
    };

    _this.next = function (props) {
      _this.running = true;
      return new Promise(function (resolve) {
        _this.mounted && _this.setState(function (state) {
          return {
            props: props,
            oldProps: _extends({}, _this.state.props),
            resolve: resolve
          };
        }, function () {
          return _this.running = false;
        });
      });
    };

    return _this;
  }

  var _proto = Keyframes.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.componentDidUpdate({});
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    if (prevProps.state !== this.props.state || this.props.reset && !this.running) {
      (function () {
        var _this2$props = _this2.props,
            states = _this2$props.states,
            f = _this2$props.filter,
            state = _this2$props.state;

        if (states && state) {
          (function () {
            var localId = ++_this2.guid;
            var slots = states[state];

            if (slots) {
              if (Array.isArray(slots)) {
                var q = Promise.resolve();

                var _loop = function _loop() {
                  if (_isArray) {
                    if (_i >= _iterator.length) return "break";
                    _ref = _iterator[_i++];
                  } else {
                    _i = _iterator.next();
                    if (_i.done) return "break";
                    _ref = _i.value;
                  }

                  var s = _ref;
                  q = q.then(function () {
                    return localId === _this2.guid && _this2.next(f(s));
                  });
                };

                for (var _iterator = slots, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                  var _ref;

                  var _ret = _loop();

                  if (_ret === "break") break;
                }
              } else if (typeof slots === 'function') {
                slots(function (props) {
                  return localId === _this2.guid && _this2.next(f(props));
                }, _this2.props);
              } else {
                _this2.next(f(states[state]));
              }
            }
          })();
        }
      })();
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$state = this.state,
        props = _this$state.props,
        oldProps = _this$state.oldProps,
        resolve = _this$state.resolve;
    if (!props || Object.keys(props).length === 0) return null;

    var _this$props = this.props,
        state = _this$props.state,
        filter = _this$props.filter,
        states = _this$props.states,
        Component = _this$props.primitive,
        ownFrom = _this$props.from,
        _onRest = _this$props.onRest,
        rest = _objectWithoutPropertiesLoose(_this$props, ["state", "filter", "states", "primitive", "from", "onRest"]);

    var current = this.instance && this.instance.getValues();
    var from = typeof props.from === 'function' ? props.from : _extends({}, oldProps.from, current, props.from);
    return React.createElement(Component, _extends({
      ref: function ref(_ref2) {
        return _this3.instance = _ref2;
      }
    }, rest, props, {
      from: _extends({}, from, ownFrom),
      onRest: function onRest(args) {
        resolve(args);
        if (_onRest) _onRest(args);
      }
    }));
  };

  return Keyframes;
}(React.PureComponent);

Keyframes.defaultProps = {
  state: DEFAULT
};

Keyframes.create = function (primitive) {
  return function (states, filter) {
    var _states;

    if (filter === void 0) {
      filter = function filter(states) {
        return states;
      };
    }

    if (typeof states === 'function' || Array.isArray(states)) states = (_states = {}, _states[DEFAULT] = states, _states);
    return function (props) {
      return React.createElement(Keyframes, _extends({
        primitive: primitive,
        states: states,
        filter: filter
      }, props));
    };
  };
};

var interpolateTo = function interpolateTo(props) {
  var forward = getForwardProps(props);
  var rest = Object.keys(props).reduce(function (acc, key) {
    var _extends2;

    return typeof forward[key] !== 'undefined' ? acc : _extends({}, acc, (_extends2 = {}, _extends2[key] = props[key], _extends2));
  }, {});
  return _extends({
    to: forward
  }, rest);
};

Keyframes.Spring = Keyframes.create(Spring);

Keyframes.Spring.to = function (states) {
  return Keyframes.Spring(states, interpolateTo);
};

Keyframes.Trail = Keyframes.create(Trail);

Keyframes.Trail.to = function (states) {
  return Keyframes.Trail(states, interpolateTo);
};

Keyframes.Transition = Keyframes.create(Transition);

var AnimatedDiv = createAnimatedComponent('div');

var _React$createContext$1 = React.createContext(null);
var Provider$1 = _React$createContext$1.Provider;
var Consumer = _React$createContext$1.Consumer;

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop';
}

var START_TRANSLATE_3D = 'translate3d(0px,0px,0px)';
var START_TRANSLATE = 'translate(0px,0px)';
var ParallaxLayer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(ParallaxLayer, _React$PureComponent);

  function ParallaxLayer() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = ParallaxLayer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var parent = this.parent;

    if (parent) {
      parent.layers = parent.layers.concat(this);
      parent.update();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this = this;

    var parent = this.parent;

    if (parent) {
      parent.layers = parent.layers.filter(function (layer) {
        return layer !== _this;
      });
      parent.update();
    }
  };

  _proto.setPosition = function setPosition(height, scrollTop, immediate) {
    if (immediate === void 0) {
      immediate = false;
    }

    var _this$parent$props = this.parent.props,
        config$$1 = _this$parent$props.config,
        impl = _this$parent$props.impl;
    var targetScroll = Math.floor(this.props.offset) * height;
    var offset = height * this.props.offset + targetScroll * this.props.speed;
    var to = parseFloat(-(scrollTop * this.props.speed) + offset);
    if (!immediate) controller(this.animatedTranslate, _extends({
      to: to
    }, config$$1), impl).start();else this.animatedTranslate.setValue(to);
  };

  _proto.setHeight = function setHeight(height, immediate) {
    if (immediate === void 0) {
      immediate = false;
    }

    var _this$parent$props2 = this.parent.props,
        config$$1 = _this$parent$props2.config,
        impl = _this$parent$props2.impl;
    var to = parseFloat(height * this.props.factor);
    if (!immediate) controller(this.animatedSpace, _extends({
      to: to
    }, config$$1), impl).start();else this.animatedSpace.setValue(to);
  };

  _proto.initialize = function initialize() {
    var props = this.props;
    var parent = this.parent;
    var targetScroll = Math.floor(props.offset) * parent.space;
    var offset = parent.space * props.offset + targetScroll * props.speed;
    var to = parseFloat(-(parent.current * props.speed) + offset);
    this.animatedTranslate = new AnimatedValue(to);
    this.animatedSpace = new AnimatedValue(parent.space * props.factor);
  };

  _proto.renderLayer = function renderLayer() {
    var _extends2;

    var _this$props = this.props,
        style = _this$props.style,
        children = _this$props.children,
        offset = _this$props.offset,
        speed = _this$props.speed,
        factor = _this$props.factor,
        className = _this$props.className,
        props = _objectWithoutPropertiesLoose(_this$props, ["style", "children", "offset", "speed", "factor", "className"]);

    var horizontal = this.parent.props.horizontal;
    var translate3d = this.animatedTranslate.interpolate({
      range: [0, 1],
      output: horizontal ? [START_TRANSLATE_3D, 'translate3d(1px,0,0)'] : [START_TRANSLATE_3D, 'translate3d(0,1px,0)']
    });
    return React.createElement(AnimatedDiv, _extends({}, props, {
      className: className,
      style: _extends((_extends2 = {
        position: 'absolute',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform'
      }, _extends2[horizontal ? 'height' : 'width'] = '100%', _extends2[horizontal ? 'width' : 'height'] = this.animatedSpace, _extends2.WebkitTransform = translate3d, _extends2.MsTransform = translate3d, _extends2.transform = translate3d, _extends2), style)
    }), children);
  };

  _proto.render = function render() {
    var _this2 = this;

    return React.createElement(Consumer, null, function (parent) {
      if (parent && !_this2.parent) {
        _this2.parent = parent;

        _this2.initialize();
      }

      return _this2.renderLayer();
    });
  };

  return ParallaxLayer;
}(React.PureComponent);
ParallaxLayer.defaultProps = {
  factor: 1,
  offset: 0,
  speed: 0
};

var Parallax =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inheritsLoose(Parallax, _React$PureComponent2);

  function Parallax() {
    var _this3;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _React$PureComponent2.call.apply(_React$PureComponent2, [this].concat(args)) || this;
    _this3.state = {
      ready: false
    };
    _this3.layers = [];
    _this3.space = 0;
    _this3.current = 0;
    _this3.offset = 0;
    _this3.busy = false;

    _this3.moveItems = function () {
      _this3.layers.forEach(function (layer) {
        return layer.setPosition(_this3.space, _this3.current);
      });

      _this3.busy = false;
    };

    _this3.scrollerRaf = function () {
      return requestAnimationFrame(_this3.moveItems);
    };

    _this3.onScroll = function (event) {
      var horizontal = _this3.props.horizontal;

      if (!_this3.busy) {
        _this3.busy = true;

        _this3.scrollerRaf();

        _this3.current = event.target[getScrollType(horizontal)];
      }
    };

    _this3.update = function () {
      var _this3$props = _this3.props,
          scrolling = _this3$props.scrolling,
          horizontal = _this3$props.horizontal;
      var scrollType = getScrollType(horizontal);
      if (!_this3.container) return;
      _this3.space = _this3.container[horizontal ? 'clientWidth' : 'clientHeight'];
      if (scrolling) _this3.current = _this3.container[scrollType];else _this3.container[scrollType] = _this3.current = _this3.offset * _this3.space;
      if (_this3.content) _this3.content.style[horizontal ? 'width' : 'height'] = _this3.space * _this3.props.pages + "px";

      _this3.layers.forEach(function (layer) {
        layer.setHeight(_this3.space, true);
        layer.setPosition(_this3.space, _this3.current, true);
      });
    };

    _this3.updateRaf = function () {
      requestAnimationFrame(_this3.update); // Some browsers don't fire on maximize

      setTimeout(_this3.update, 150);
    };

    _this3.scrollStop = function (event) {
      return _this3.animatedScroll && _this3.animatedScroll.stopAnimation();
    };

    return _this3;
  }

  var _proto2 = Parallax.prototype;

  _proto2.scrollTo = function scrollTo(offset) {
    var _this$props2 = this.props,
        horizontal = _this$props2.horizontal,
        config$$1 = _this$props2.config,
        impl = _this$props2.impl;
    var scrollType = getScrollType(horizontal);
    this.scrollStop();
    this.offset = offset;
    var target = this.container;
    this.animatedScroll = new AnimatedValue(target[scrollType]);
    this.animatedScroll.addListener(function (_ref) {
      var value = _ref.value;
      return target[scrollType] = value;
    });
    controller(this.animatedScroll, _extends({
      to: offset * this.space
    }, config$$1), impl).start();
  };

  _proto2.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.updateRaf, false);
    this.update();
    this.setState({
      ready: true
    });
  };

  _proto2.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.updateRaf, false);
  };

  _proto2.componentDidUpdate = function componentDidUpdate() {
    this.update();
  };

  _proto2.render = function render() {
    var _this4 = this,
        _extends3;

    var _this$props3 = this.props,
        style = _this$props3.style,
        innerStyle = _this$props3.innerStyle,
        pages = _this$props3.pages,
        className = _this$props3.className,
        scrolling = _this$props3.scrolling,
        children = _this$props3.children,
        horizontal = _this$props3.horizontal;
    var overflow = scrolling ? 'scroll' : 'hidden';
    return React.createElement("div", {
      ref: function ref(node) {
        return _this4.container = node;
      },
      onScroll: this.onScroll,
      onWheel: scrolling ? this.scrollStop : null,
      onTouchStart: scrolling ? this.scrollStop : null,
      style: _extends({
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: overflow,
        overflowY: horizontal ? 'hidden' : overflow,
        overflowX: horizontal ? overflow : 'hidden',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: START_TRANSLATE,
        MsTransform: START_TRANSLATE,
        transform: START_TRANSLATE_3D
      }, style),
      className: className
    }, this.state.ready && React.createElement("div", {
      ref: function ref(node) {
        return _this4.content = node;
      },
      style: _extends((_extends3 = {
        position: 'absolute'
      }, _extends3[horizontal ? 'height' : 'width'] = '100%', _extends3.WebkitTransform = START_TRANSLATE, _extends3.MsTransform = START_TRANSLATE, _extends3.transform = START_TRANSLATE_3D, _extends3.overflow = 'hidden', _extends3[horizontal ? 'width' : 'height'] = this.space * pages, _extends3), innerStyle)
    }, React.createElement(Provider$1, {
      value: this
    }, children)));
  };

  return Parallax;
}(React.PureComponent);

Parallax.Layer = ParallaxLayer;
Parallax.defaultProps = {
  config: config.slow,
  scrolling: true,
  horizontal: false,
  impl: SpringAnimation
};

var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', // SVG
'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];
var extendedAnimated = domElements.reduce(function (acc, element) {
  acc[element] = createAnimatedComponent(element);
  return acc;
}, createAnimatedComponent);

var BORDER_WIDTH = 4;

var VALUE_DEFAULT = 1;
var SIZE_DEFAULT = 80;
var LABEL_DEFAULT = function LABEL_DEFAULT(value) {
  return Math.round(value * 100) + '%';
};

var CircleGraph = function CircleGraph(_ref) {
  var value = _ref.value,
      label = _ref.label,
      size = _ref.size;

  var length = Math.PI * 2 * (size - BORDER_WIDTH);
  var radius = (size - BORDER_WIDTH) / 2;
  return React.createElement(
    Spring,
    { to: { progressValue: value }, native: true },
    function (_ref2) {
      var progressValue = _ref2.progressValue;
      return React.createElement(
        Main$1,
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size + 'px',
            height: size + 'px'
          }
        },
        React.createElement(
          CircleSvg,
          { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size },
          React.createElement(CircleBase, { cx: size / 2, cy: size / 2, r: radius }),
          React.createElement(CircleValue, {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            style: {
              strokeDasharray: length,
              strokeDashoffset: progressValue.interpolate(function (t) {
                return length - length * t / 2;
              }),
              strokeWidth: BORDER_WIDTH
            }
          })
        ),
        React.createElement(
          Label,
          null,
          progressValue.interpolate(function (t) {
            return label(Math.min(1, Math.max(0, t)));
          })
        )
      );
    }
  );
};

CircleGraph.propTypes = {
  value: propTypes.number,
  size: propTypes.number,
  label: propTypes.func
};

CircleGraph.defaultProps = {
  value: VALUE_DEFAULT,
  size: SIZE_DEFAULT,
  label: LABEL_DEFAULT
};

var Main$1 = styled__default.div.withConfig({
  displayName: 'CircleGraph__Main',
  componentId: 'sc-2a8gt2-0'
})(['position:relative;']);

var CircleSvg = styled__default.svg.withConfig({
  displayName: 'CircleGraph__CircleSvg',
  componentId: 'sc-2a8gt2-1'
})(['position:absolute;top:0;left:0;']);

var CircleBase = styled__default.circle.withConfig({
  displayName: 'CircleGraph__CircleBase',
  componentId: 'sc-2a8gt2-2'
})(['fill:none;stroke:#6d777b;opacity:0.3;']);

var CircleValue = styled__default(extendedAnimated.circle).withConfig({
  displayName: 'CircleGraph__CircleValue',
  componentId: 'sc-2a8gt2-3'
})(['fill:none;transform:rotate(270deg);transform-origin:50% 50%;stroke:#21c1e7;']);

var Label = styled__default(extendedAnimated.div).withConfig({
  displayName: 'CircleGraph__Label',
  componentId: 'sc-2a8gt2-4'
})(['font-size:16px;font-weight:400;color:#000;']);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var ClickOutComponent = function (_React$Component) {
  _inherits(ClickOutComponent, _React$Component);

  function ClickOutComponent() {
    _classCallCheck(this, ClickOutComponent);

    return _possibleConstructorReturn(this, (ClickOutComponent.__proto__ || Object.getPrototypeOf(ClickOutComponent)).call(this));
  }

  _createClass(ClickOutComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;
      var elTouchIsClick = true;
      var documentTouchIsClick = true;
      var el = ReactDOM.findDOMNode(this);

      self.__documentTouchStarted = function (e) {
        el.removeEventListener('click', self.__elementClicked);
        document.removeEventListener('click', self.__documentClicked);
      };

      self.__documentTouchMoved = function (e) {
        documentTouchIsClick = false;
      };

      self.__documentTouchEnded = function (e) {
        if (documentTouchIsClick) self.__documentClicked(e);
        documentTouchIsClick = true;
      };

      self.__documentClicked = function (e) {
        if ((e.__clickedElements || []).indexOf(el) !== -1) return;

        var clickOutHandler = self.onClickOut || self.props.onClickOut;
        if (!clickOutHandler) {
          return console.warn('onClickOut is not defined.');
        }

        clickOutHandler.call(self, e);
      };

      self.__elementTouchMoved = function (e) {
        elTouchIsClick = false;
      };

      self.__elementTouchEnded = function (e) {
        if (elTouchIsClick) self.__elementClicked(e);
        elTouchIsClick = true;
      };

      self.__elementClicked = function (e) {
        e.__clickedElements = e.__clickedElements || [];
        e.__clickedElements.push(el);
      };

      setTimeout(function () {
        if (self.__unmounted) return;
        self.toggleListeners('addEventListener');
      }, 0);
    }
  }, {
    key: 'toggleListeners',
    value: function toggleListeners(listenerMethod) {
      var el = ReactDOM.findDOMNode(this);

      el[listenerMethod]('touchmove', this.__elementTouchMoved);
      el[listenerMethod]('touchend', this.__elementTouchEnded);
      el[listenerMethod]('click', this.__elementClicked);

      document[listenerMethod]('touchstart', this.__documentTouchStarted);
      document[listenerMethod]('touchmove', this.__documentTouchMoved);
      document[listenerMethod]('touchend', this.__documentTouchEnded);
      document[listenerMethod]('click', this.__documentClicked);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.toggleListeners('removeEventListener');
      this.__unmounted = true;
    }
  }, {
    key: 'render',
    value: function render() {
      return Array.isArray(this.props.children) ? React.createElement(
        'div',
        null,
        this.props.children
      ) : React.Children.only(this.props.children);
    }
  }]);

  return ClickOutComponent;
}(React.Component);

var reactOnclickout = ClickOutComponent;

var Ellipsis = function Ellipsis(props) {
  return React.createElement(
    "svg",
    _extends({ width: 15, height: 4, viewBox: "0 0 15 4" }, props),
    React.createElement("path", {
      d: "M7.5 3.213a1.42 1.42 0 0 1-.974-.37c-.278-.248-.418-.588-.418-1.021 0-.384.135-.71.404-.979S7.11.439 7.5.439s.722.135.997.404c.276.27.413.595.413.979 0 .439-.142.78-.427 1.025a1.465 1.465 0 0 1-.983.366zm-5.327 0c-.371 0-.694-.122-.97-.366C.928 2.603.791 2.26.791 1.822c0-.39.133-.718.398-.984.266-.266.594-.399.984-.399s.722.135.997.404c.275.27.413.595.413.979 0 .439-.142.78-.427 1.025a1.465 1.465 0 0 1-.983.366zm10.654 0c-.365 0-.688-.123-.97-.37-.28-.248-.421-.588-.421-1.021 0-.384.134-.71.403-.979.27-.269.598-.404.988-.404s.722.135.997.404c.276.27.413.595.413.979 0 .433-.14.773-.422 1.02a1.45 1.45 0 0 1-.988.371z",
      fill: "currentColor",
      fillRule: "evenodd"
    })
  );
};

var ArrowDown = function ArrowDown(props) {
  return React.createElement(
    "svg",
    _extends({ width: 9, height: 5, viewBox: "0 0 9 5" }, props),
    React.createElement("path", { d: "M0 0h8.36L4.18 4.18z", fill: "currentColor", fillRule: "evenodd" })
  );
};

var BASE_WIDTH = 46;
var BASE_HEIGHT = 32;

var ContextMenu = function (_React$Component) {
  inherits(ContextMenu, _React$Component);

  function ContextMenu() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ContextMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      opened: false
    }, _this.handleClose = function () {
      _this.setState({ opened: false });
    }, _this.handleBaseButtonClick = function () {
      _this.setState(function (_ref2) {
        var opened = _ref2.opened;
        return { opened: !opened };
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ContextMenu, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var opened = this.state.opened;
      var children = this.props.children;

      return React.createElement(
        reactOnclickout,
        { onClickOut: this.handleClose },
        React.createElement(
          Spring,
          {
            config: springs.smooth,
            to: { openProgress: Number(opened) },
            native: true
          },
          function (_ref3) {
            var openProgress = _ref3.openProgress;
            return React.createElement(
              Main$2,
              {
                style: {
                  zIndex: opened ? '2' : '1',
                  boxShadow: openProgress.interpolate(function (t) {
                    return '0 4px 4px rgba(0, 0, 0, ' + t * 0.03 + ')';
                  })
                }
              },
              React.createElement(
                BaseButton,
                { onClick: _this2.handleBaseButtonClick, opened: opened },
                React.createElement(
                  'span',
                  null,
                  React.createElement(Ellipsis, {
                    style: {
                      color: opened ? theme.accent : theme.textSecondary
                    }
                  })
                ),
                React.createElement(
                  'span',
                  null,
                  React.createElement(
                    extendedAnimated.div,
                    {
                      style: {
                        color: theme.textTertiary,
                        transform: openProgress.interpolate(function (t) {
                          return 'rotate(' + t * 180 + 'deg)';
                        })
                      }
                    },
                    React.createElement(ArrowDown, null)
                  )
                )
              ),
              React.createElement(
                Popup,
                {
                  onClick: _this2.handleClose,
                  style: {
                    display: opened ? 'block' : 'none',
                    opacity: openProgress,
                    boxShadow: openProgress.interpolate(function (t) {
                      return '0 4px 4px rgba(0, 0, 0, ' + t * 0.03 + ')';
                    })
                  }
                },
                children
              )
            );
          }
        )
      );
    }
  }]);
  return ContextMenu;
}(React.Component);

ContextMenu.propTypes = {
  children: propTypes.node
};


var Main$2 = styled__default(extendedAnimated.div).withConfig({
  displayName: 'ContextMenu__Main',
  componentId: 'ris724-0'
})(['position:relative;width:', 'px;height:', 'px;'], BASE_WIDTH, BASE_HEIGHT);

var BaseButton = styled__default.div.withConfig({
  displayName: 'ContextMenu__BaseButton',
  componentId: 'ris724-1'
})(['position:relative;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:', 'px;background:', ';border:1px solid ', ';border-radius:', ';border-bottom-color:', ';cursor:pointer;', ';&:active{background:', ';border-bottom-color:', ';}&:before{display:', ';content:\'\';position:absolute;bottom:-1px;right:-1px;width:1px;height:2px;background:', ';}& > span{display:flex;align-items:center;&:first-child{margin-right:5px;}}'], BASE_HEIGHT, theme.contentBackground, theme.contentBorder, function (_ref4) {
  var opened = _ref4.opened;
  return opened ? '3px 3px 0 0' : '3px';
}, function (_ref5) {
  var opened = _ref5.opened;
  return opened ? theme.contentBackground : theme.contentBorder;
}, unselectable(), theme.contentBackgroundActive, function (_ref6) {
  var opened = _ref6.opened;
  return opened ? theme.contentBackgroundActive : theme.contentBorder;
}, function (_ref7) {
  var opened = _ref7.opened;
  return opened ? 'block' : 'none';
}, theme.contentBorder);

var Popup = styled__default(extendedAnimated.div).withConfig({
  displayName: 'ContextMenu__Popup',
  componentId: 'ris724-2'
})(['overflow:hidden;position:absolute;top:', 'px;right:0;padding:10px 0;background:', ';border:1px solid ', ';border-radius:3px 0 3px 3px;'], BASE_HEIGHT - 1, theme.contentBackground, theme.contentBorder);

ContextMenu.BASE_WIDTH = 46;
ContextMenu.BASE_HEIGHT = 32;

var ContextMenuItem = styled__default.div.withConfig({
  displayName: 'ContextMenuItem',
  componentId: 'sc-6mg7lj-0'
})(['display:flex;align-items:center;padding:5px 20px;cursor:pointer;white-space:nowrap;', ';&:active{background:', ';}'], unselectable(), theme.contentBackgroundActive);

var FRAME_EVERY = 1000 / 30; // 30 FPS is enough for a ticker

var formatUnit = function formatUnit(v) {
  return String(v).padStart(2, '0');
};

var Countdown = function (_React$Component) {
  inherits(Countdown, _React$Component);

  function Countdown() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Countdown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Countdown.__proto__ || Object.getPrototypeOf(Countdown)).call.apply(_ref, [this].concat(args))), _this), _this.renderTime = function () {
      var end = _this.props.end;

      var _difference = difference(end, new Date()),
          days = _difference.days,
          hours = _difference.hours,
          minutes = _difference.minutes,
          seconds = _difference.seconds,
          totalInSeconds = _difference.totalInSeconds;

      if (totalInSeconds <= 0) {
        return React.createElement(
          TimeOut,
          null,
          'Time out'
        );
      }
      return React.createElement(
        'span',
        null,
        React.createElement(
          Part,
          null,
          formatUnit(days),
          React.createElement(
            Unit,
            null,
            'D'
          )
        ),
        React.createElement(Separator, null),
        React.createElement(
          Part,
          null,
          formatUnit(hours),
          React.createElement(
            Unit,
            null,
            'H'
          )
        ),
        React.createElement(
          Separator,
          null,
          ':'
        ),
        React.createElement(
          Part,
          null,
          formatUnit(minutes),
          React.createElement(
            Unit,
            null,
            'M'
          )
        ),
        React.createElement(
          Separator,
          null,
          ':'
        ),
        React.createElement(
          Part,
          null,
          formatUnit(seconds),
          React.createElement(
            Unit,
            null,
            'S'
          )
        )
      );
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Countdown, [{
    key: 'render',
    value: function render() {
      var end = this.props.end;

      return React.createElement(
        Main$3,
        { dateTime: formatHtmlDatetime(end) },
        React.createElement(
          IconWrapper,
          null,
          React.createElement(Time, null)
        ),
        React.createElement(
          Redraw,
          { interval: FRAME_EVERY },
          this.renderTime
        )
      );
    }
  }]);
  return Countdown;
}(React.Component);

Countdown.propTypes = {
  end: propTypes.instanceOf(Date)
};


var Main$3 = styled__default.time.withConfig({
  displayName: 'Countdown__Main',
  componentId: 'pou098-0'
})(['width:12em;white-space:nowrap;', ';'], unselectable());

var IconWrapper = styled__default.span.withConfig({
  displayName: 'Countdown__IconWrapper',
  componentId: 'pou098-1'
})(['margin-right:15px;']);

var Part = styled__default.span.withConfig({
  displayName: 'Countdown__Part',
  componentId: 'pou098-2'
})(['font-size:15px;font-weight:600;color:', ';'], theme.textPrimary);

var Separator = styled__default.span.withConfig({
  displayName: 'Countdown__Separator',
  componentId: 'pou098-3'
})(['margin:0 4px;color:', ';font-weight:400;'], theme.textTertiary);

var Unit = styled__default.span.withConfig({
  displayName: 'Countdown__Unit',
  componentId: 'pou098-4'
})(['margin-left:2px;font-size:12px;color:', ';'], theme.textSecondary);

var TimeOut = styled__default.span.withConfig({
  displayName: 'Countdown__TimeOut',
  componentId: 'pou098-5'
})(['font-weight:600;color:', ';'], theme.textSecondary);

var NON_BREAKING_SPACE$1 = '\xa0';

var accent = theme.accent;
var contentBackgroundActive = theme.contentBackgroundActive;

var DropDownItem = function (_React$Component) {
  inherits(DropDownItem, _React$Component);

  function DropDownItem() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, DropDownItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = DropDownItem.__proto__ || Object.getPrototypeOf(DropDownItem)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      pressed: false,
      displayFocus: false
    }, _this.handleActivate = function (event) {
      var keyboard = event.type === 'keydown';
      if (keyboard && event.keyCode !== 13) {
        return;
      }
      _this.props.onActivate(_this.props.index, { keyboard: keyboard });
    }, _this.handleMouseDown = function () {
      _this.setState({ pressed: true });
    }, _this.handleMouseUp = function () {
      _this.setState({ pressed: false });
    }, _this.handleFocus = function () {
      _this.setState({ displayFocus: !_this.state.pressed });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(DropDownItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          mainRef = _props.mainRef,
          active = _props.active;
      var displayFocus = this.state.displayFocus;

      return React.createElement(
        StyledDropDownItem,
        {
          innerRef: mainRef,
          className: className,
          active: active,
          displayFocus: displayFocus,
          onClick: this.handleActivate,
          onKeyDown: this.handleActivate,
          onMouseDown: this.handleMouseDown,
          onMouseUp: this.handleMouseUp,
          onFocus: this.handleFocus
        },
        children
      );
    }
  }]);
  return DropDownItem;
}(React.Component);

DropDownItem.propTypes = {
  active: propTypes.bool,
  children: propTypes.node,
  index: propTypes.number,
  mainRef: propTypes.func,
  onActivate: propTypes.func,
  className: propTypes.string
};
DropDownItem.defaultProps = {
  children: NON_BREAKING_SPACE$1,
  mainRef: function mainRef() {},
  className: ''
};


var StyledDropDownItem = styled__default.div.attrs({ tabIndex: '0' }).withConfig({
  displayName: 'DropDownItem__StyledDropDownItem',
  componentId: 'sc-192d7e-0'
})(['position:relative;padding:8px 15px;cursor:pointer;outline:0;&:after{content:\'\';opacity:0;position:absolute;z-index:2;top:0;left:0;right:0;bottom:0;margin:-1px -2px;border:2px solid ', ';transition:all 100ms ease-in-out;}&:active{background-color:', ';}&:hover,&:focus{color:', ';}&:focus:after{opacity:', ';}'], accent, contentBackgroundActive, accent, function (_ref2) {
  var displayFocus = _ref2.displayFocus;
  return displayFocus ? 1 : 0;
});

var arrow = "data:image/svg+xml,%3Csvg%20width%3D%229%22%20height%3D%225%22%20viewBox%3D%220%200%209%205%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h8.36L4.18%204.18z%22%20fill%3D%22%23B3B3B3%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E";

var NON_BREAKING_SPACE = '\xa0';

var contentBackground$1 = theme.contentBackground;
var contentBorder$1 = theme.contentBorder;
var textPrimary$1 = theme.textPrimary;


var StyledDropDown = styled__default.div.withConfig({
  displayName: 'DropDown__StyledDropDown',
  componentId: 'sc-17zpefi-0'
})(['position:relative;z-index:', ';display:', ';flex-direction:column;color:', ';white-space:nowrap;box-shadow:0 4px 4px 0 rgba(0,0,0,0.03);', ';&:focus{outline:0;}'], function (_ref) {
  var opened = _ref.opened;
  return opened ? '2' : '0';
}, function (_ref2) {
  var wide = _ref2.wide;
  return wide ? 'flex' : 'inline-flex';
}, textPrimary$1, unselectable());

var DropDownItems = styled__default(extendedAnimated.div).withConfig({
  displayName: 'DropDown__DropDownItems',
  componentId: 'sc-17zpefi-1'
})(['position:absolute;z-index:2;top:calc(100% - 1px);padding:8px 0;color:', ';background:', ';border:1px solid ', ';box-shadow:0 4px 4px 0 rgba(0,0,0,0.06);border-radius:3px;list-style:none;'], textPrimary$1, contentBackground$1, contentBorder$1);

var BlockingLayer = styled__default(extendedAnimated.div).withConfig({
  displayName: 'DropDown__BlockingLayer',
  componentId: 'sc-17zpefi-2'
})(['position:absolute;z-index:2;top:0;left:0;right:0;bottom:0;']);

var DropDownActiveItem = styled__default(PublicUrl.hocWrap(DropDownItem)).withConfig({
  displayName: 'DropDown__DropDownActiveItem',
  componentId: 'sc-17zpefi-3'
})(['padding-right:40px;background:', ';background-image:url(', ');background-repeat:no-repeat;background-position:calc(100% - 15px) 50%;border:1px solid ', ';border-radius:3px;&:hover,&:focus{color:inherit;}&:active{color:', ';}'], contentBackground$1, PublicUrl.styledUrl(arrow), contentBorder$1, textPrimary$1);

var DropDown = function (_React$Component) {
  inherits(DropDown, _React$Component);

  function DropDown() {
    var _ref3;

    var _temp, _this, _ret;

    classCallCheck(this, DropDown);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref3 = DropDown.__proto__ || Object.getPrototypeOf(DropDown)).call.apply(_ref3, [this].concat(args))), _this), _this.state = {
      opened: false
    }, _this.activeItemElt = null, _this.handleToggle = function () {
      _this.setState({ opened: !_this.state.opened });
    }, _this.handleClose = function () {
      _this.setState({ opened: false });
    }, _this.handleItemActivate = function (index, _ref4) {
      var keyboard = _ref4.keyboard;

      _this.props.onChange(index, _this.props.items);
      _this.setState({ opened: false });
      if (_this.activeItemElt && keyboard) {
        _this.activeItemElt.focus();
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(DropDown, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          items = _props.items,
          active = _props.active,
          wide = _props.wide;
      var opened = this.state.opened;

      var activeItem = items[active] || items[0];
      return React.createElement(
        reactOnclickout,
        { onClickOut: this.handleClose },
        React.createElement(
          StyledDropDown,
          { wide: wide, opened: opened },
          React.createElement(
            DropDownActiveItem,
            {
              onActivate: this.handleToggle,
              mainRef: function mainRef(el) {
                return _this2.activeItemElt = el;
              }
            },
            activeItem
          ),
          React.createElement(
            Transition,
            {
              config: springs.swift,
              from: { scale: 0.98, opacity: 0, enabled: 1 },
              enter: { scale: 1, opacity: 1, enabled: 1 },
              leave: { scale: 1, opacity: 0, enabled: 0 },
              native: true
            },
            opened ? function (_ref5) {
              var scale = _ref5.scale,
                  opacity = _ref5.opacity,
                  enabled = _ref5.enabled;
              return React.createElement(
                DropDownItems,
                {
                  role: 'listbox',
                  style: {
                    opacity: opacity,
                    transform: scale.interpolate(function (t) {
                      return 'scale3d(' + t + ',' + t + ',1)';
                    }),
                    minWidth: wide ? '100%' : '0'
                  }
                },
                items.length ? items.map(function (item, i) {
                  return React.createElement(
                    DropDownItem,
                    {
                      role: 'option',
                      key: i,
                      index: i,
                      active: i === active,
                      onActivate: _this2.handleItemActivate
                    },
                    item
                  );
                }) : NON_BREAKING_SPACE,
                React.createElement(BlockingLayer, {
                  style: {
                    display: enabled.interpolate(function (t) {
                      return t === 1 ? 'none' : 'block';
                    })
                  }
                })
              );
            } : null
          )
        )
      );
    }
  }]);
  return DropDown;
}(React.Component);

DropDown.propTypes = {
  items: propTypes.arrayOf(propTypes.node),
  wide: propTypes.bool,
  active: propTypes.number,
  onChange: propTypes.func
};
DropDown.defaultProps = {
  items: [],
  wide: false,
  active: 0,
  onChange: function onChange() {}
};

var ExtendedPropTypes = _extends({}, propTypes, {
  _component: propTypes.oneOfType([propTypes.string, propTypes.func])
});

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag$1 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$5.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var defineProperty$1 = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$5.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$7.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$8.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$2 = '[object Function]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
var float32Tag$1 = '[object Float32Array]';
var float64Tag$1 = '[object Float64Array]';
var int8Tag$1 = '[object Int8Array]';
var int16Tag$1 = '[object Int16Array]';
var int32Tag$1 = '[object Int32Array]';
var uint8Tag$1 = '[object Uint8Array]';
var uint8ClampedTag$1 = '[object Uint8ClampedArray]';
var uint16Tag$1 = '[object Uint16Array]';
var uint32Tag$1 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$1] = typedArrayTags[float64Tag$1] =
typedArrayTags[int8Tag$1] = typedArrayTags[int16Tag$1] =
typedArrayTags[int32Tag$1] = typedArrayTags[uint8Tag$1] =
typedArrayTags[uint8ClampedTag$1] = typedArrayTags[uint16Tag$1] =
typedArrayTags[uint32Tag$1] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$2] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$6.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$8.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$10.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;
var allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set$1 = getNative(root, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$2 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set$1);
var weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map && getTag(new Map) != mapTag$2) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set$1 && getTag(new Set$1) != setTag$2) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$2)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$2;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$12.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$11.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var mapTag$3 = '[object Map]';
var numberTag$2 = '[object Number]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$2 = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
var float32Tag$2 = '[object Float32Array]';
var float64Tag$2 = '[object Float64Array]';
var int8Tag$2 = '[object Int8Array]';
var int16Tag$2 = '[object Int16Array]';
var int32Tag$2 = '[object Int32Array]';
var uint8Tag$2 = '[object Uint8Array]';
var uint8ClampedTag$2 = '[object Uint8ClampedArray]';
var uint16Tag$2 = '[object Uint16Array]';
var uint32Tag$2 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);

    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);

    case dataViewTag$3:
      return cloneDataView(object, isDeep);

    case float32Tag$2: case float64Tag$2:
    case int8Tag$2: case int16Tag$2: case int32Tag$2:
    case uint8Tag$2: case uint8ClampedTag$2: case uint16Tag$2: case uint32Tag$2:
      return cloneTypedArray(object, isDeep);

    case mapTag$3:
      return new Ctor;

    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);

    case regexpTag$2:
      return cloneRegExp(object);

    case setTag$3:
      return new Ctor;

    case symbolTag$1:
      return cloneSymbol(object);
  }
}

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/** `Object#toString` result references. */
var mapTag$4 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$4;
}

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

/** `Object#toString` result references. */
var setTag$4 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$4;
}

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;
var CLONE_FLAT_FLAG$1 = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var symbolTag = '[object Symbol]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$1,
      isFlat = bitmask & CLONE_FLAT_FLAG$1,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/** `Object#toString` result references. */
var symbolTag$2 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$2);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

/** `Object#toString` result references. */
var objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$13 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$13.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$12.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

/** Built-in value references. */
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
  return defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

var EmptyStateCard = function (_React$Component) {
  inherits(EmptyStateCard, _React$Component);

  function EmptyStateCard(props) {
    classCallCheck(this, EmptyStateCard);

    var _this = possibleConstructorReturn(this, (EmptyStateCard.__proto__ || Object.getPrototypeOf(EmptyStateCard)).call(this, props));

    _this.displayWarnings({}, props);
    return _this;
  }

  createClass(EmptyStateCard, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.displayWarnings(prevProps, this.props);
    }
  }, {
    key: 'displayWarnings',
    value: function displayWarnings(prevProps, props) {
      // Deprecated warnings
      if (prevProps.actionButton !== props.actionButton && props.actionButton) {
        warn('The “actionButton” prop is deprecated. Please use “action” to pass ' + 'a custom element instead.');
      }
      if (prevProps.icon !== props.icon && props.icon && !React.isValidElement(props.icon)) {
        warn('Passing a component to the “icon” prop is deprecated. Please pass ' + 'an element instead (i.e. use icon={<Icon />} rather than ' + 'icon={Icon}).');
      }

      // Display a warning if `action` is used to override the button, while also
      // using one of the props that apply to the default button component.
      var anyActionParam = props.actionDisabled || props.actionText || props.onActivate;
      if (prevProps.action !== props.action && props.action && anyActionParam) {
        warn('Using `action` takes priority over `actionDisabled`, `actionText`, ' + 'and `onActivate`. Please use either `action` or any of these ' + 'props.');
      }
    }

    // Render icon, even when provided as a component (deprecated)

  }, {
    key: 'iconElement',
    value: function iconElement() {
      var icon = this.props.icon;

      return !icon || React.isValidElement(icon) ? icon : React.createElement(icon);
    }

    // Render the action (usually a button)

  }, {
    key: 'actionElement',
    value: function actionElement() {
      var _props = this.props,
          action = _props.action,
          actionButton = _props.actionButton,
          actionDisabled = _props.actionDisabled,
          actionText = _props.actionText,
          onActivate = _props.onActivate;

      // If an action node is provided, it takes priority above the other props

      if (action) {
        return action;
      }

      // If no label is provided, the button is not displayed
      if (!actionText) {
        return null;
      }

      // Use the provided actionButton if it exists, or a local component.
      var Button$$1 = actionButton || DefaultActionButton;

      return React.createElement(
        Button$$1,
        { disabled: actionDisabled, mode: 'strong', onClick: onActivate, wide: true },
        actionText
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          title = _props2.title,
          text = _props2.text,
          props = objectWithoutProperties(_props2, ['title', 'text']);

      var extraProps = omit(props, Object.keys(EmptyStateCard.propTypes));
      return React.createElement(
        Main$4,
        extraProps,
        React.createElement(
          'section',
          null,
          this.iconElement(),
          React.createElement(
            Heading,
            null,
            React.createElement(
              Text,
              { color: theme.accent, weight: 'bold', size: 'large' },
              title
            )
          ),
          text && React.createElement(
            Text.Block,
            null,
            text
          ),
          React.createElement(
            ActionWrapper,
            null,
            this.actionElement()
          )
        )
      );
    }
  }]);
  return EmptyStateCard;
}(React.Component);

EmptyStateCard.propTypes = {
  action: ExtendedPropTypes.element,
  actionButton: ExtendedPropTypes._component,
  actionDisabled: ExtendedPropTypes.bool,
  actionText: ExtendedPropTypes.string,
  icon: ExtendedPropTypes.oneOfType([ExtendedPropTypes.element, ExtendedPropTypes._component]),
  onActivate: ExtendedPropTypes.func,
  text: ExtendedPropTypes.string,
  title: ExtendedPropTypes.string
};
EmptyStateCard.defaultProps = {
  title: 'Nothing here.',
  actionDisabled: false,
  onActivate: noop
};


var Main$4 = styled__default(StyledCard).withConfig({
  displayName: 'EmptyStateCard__Main',
  componentId: 'ov2yly-0'
})(['display:flex;padding:40px 60px;align-items:center;justify-content:center;text-align:center;section{padding-top:20px;}']);

var DefaultActionButton = styled__default(Button).withConfig({
  displayName: 'EmptyStateCard__DefaultActionButton',
  componentId: 'ov2yly-1'
})(['width:150px;']);

var Heading = styled__default.h1.withConfig({
  displayName: 'EmptyStateCard__Heading',
  componentId: 'ov2yly-2'
})(['margin:20px 0 5px;']);

var ActionWrapper = styled__default.div.withConfig({
  displayName: 'EmptyStateCard__ActionWrapper',
  componentId: 'ov2yly-3'
})(['margin-top:20px;']);

var StyledField = styled__default.div.withConfig({
  displayName: 'Field__StyledField',
  componentId: 'uqte4v-0'
})(['margin-bottom:20px;']);

var StyledAsterisk = styled__default.span.withConfig({
  displayName: 'Field__StyledAsterisk',
  componentId: 'uqte4v-1'
})(['color:', ';float:right;padding-top:3px;font-size:12px;'], theme.accent);

var StyledTextBlock = styled__default(Text.Block).withConfig({
  displayName: 'Field__StyledTextBlock',
  componentId: 'uqte4v-2'
})(['', ';'], unselectable());

var Field = function Field(_ref) {
  var children = _ref.children,
      label = _ref.label,
      props = objectWithoutProperties(_ref, ['children', 'label']);

  var isRequired = React.Children.toArray(children).some(function (_ref2) {
    var props = _ref2.props;
    return props && props.required;
  });
  return React.createElement(
    StyledField,
    props,
    React.createElement(
      'label',
      null,
      React.createElement(
        StyledTextBlock,
        { color: theme.textSecondary, smallcaps: true },
        label,
        isRequired && React.createElement(
          StyledAsterisk,
          { title: 'Required' },
          '*'
        )
      ),
      children
    )
  );
};

Field.propTypes = {
  children: propTypes.node,
  label: propTypes.string
};

var main = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Identicon = function (_Component) {
  _inherits(Identicon, _Component);

  function Identicon(props) {
    _classCallCheck(this, Identicon);

    var _this = _possibleConstructorReturn(this, (Identicon.__proto__ || Object.getPrototypeOf(Identicon)).call(this, props));

    _this.generateIdenticon = _this.generateIdenticon.bind(_this);
    return _this;
  }

  _createClass(Identicon, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.generateIdenticon(_extends({}, this.props));
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (!this.isEquivalent(this.props, nextProps)) this.generateIdenticon(_extends({}, nextProps));
    }
  }, {
    key: 'isEquivalent',
    value: function isEquivalent(prevProps, nextProps) {
      var aProps = Object.getOwnPropertyNames(prevProps);
      var bProps = Object.getOwnPropertyNames(nextProps);

      if (aProps.length != bProps.length) {
        return false;
      }

      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (prevProps[propName] !== nextProps[propName]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: 'generateIdenticon',
    value: function generateIdenticon(options) {
      // NOTE --  Majority of this code is referenced from: https://github.com/alexvandesande/blockies
      //          Mostly to ensure congruence to Ethereum Mist's Identicons

      // The random number is a js implementation of the Xorshift PRNG
      var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

      function seedrand(seed) {
        for (var i = 0; i < randseed.length; i++) {
          randseed[i] = 0;
        }
        for (var _i = 0; _i < seed.length; _i++) {
          randseed[_i % 4] = (randseed[_i % 4] << 5) - randseed[_i % 4] + seed.charCodeAt(_i);
        }
      }

      function rand() {
        // based on Java's String.hashCode(), expanded to 4 32bit values
        var t = randseed[0] ^ randseed[0] << 11;

        randseed[0] = randseed[1];
        randseed[1] = randseed[2];
        randseed[2] = randseed[3];
        randseed[3] = randseed[3] ^ randseed[3] >> 19 ^ t ^ t >> 8;

        return (randseed[3] >>> 0) / (1 << 31 >>> 0);
      }

      function createColor() {
        // saturation is the whole color spectrum
        var h = Math.floor(rand() * 360);
        // saturation goes from 40 to 100, it avoids greyish colors
        var s = rand() * 60 + 40 + '%';
        // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
        var l = (rand() + rand() + rand() + rand()) * 25 + '%';

        var color = 'hsl(' + h + ',' + s + ',' + l + ')';
        return color;
      }

      function createImageData(size) {
        var width = size; // Only support square icons for now
        var height = size;

        var dataWidth = Math.ceil(width / 2);
        var mirrorWidth = width - dataWidth;

        var data = [];
        for (var y = 0; y < height; y++) {
          var row = [];
          for (var x = 0; x < dataWidth; x++) {
            // this makes foreground and background color to have a 43% (1/2.3) probability
            // spot color has 13% chance
            row[x] = Math.floor(rand() * 2.3);
          }
          var r = row.slice(0, mirrorWidth);
          r.reverse();
          row = row.concat(r);

          for (var i = 0; i < row.length; i++) {
            data.push(row[i]);
          }
        }

        return data;
      }

      function setCanvas(identicon, imageData, color, scale, bgcolor, spotcolor) {
        var width = Math.sqrt(imageData.length);
        var size = width * scale;

        identicon.width = size;
        identicon.style.width = size + 'px';

        identicon.height = size;
        identicon.style.height = size + 'px';

        var cc = identicon.getContext('2d');
        cc.fillStyle = bgcolor;
        cc.fillRect(0, 0, identicon.width, identicon.height);
        cc.fillStyle = color;

        for (var i = 0; i < imageData.length; i++) {
          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle = imageData[i] === 1 ? color : spotcolor;

          // if data is 0, leave the background
          if (imageData[i]) {
            var row = Math.floor(i / width);
            var col = i % width;

            cc.fillRect(col * scale, row * scale, scale, scale);
          }
        }
      }

      var opts = options || {};
      var size = opts.size || 8;
      var scale = opts.scale || 4;
      var seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

      seedrand(seed);

      var color = opts.color || createColor();
      var bgcolor = opts.bgColor || createColor();
      var spotcolor = opts.spotColor || createColor();
      var imageData = createImageData(size);
      var canvas = setCanvas(this.identicon, imageData, color, scale, bgcolor, spotcolor);

      return canvas;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('canvas', {
        ref: function ref(identicon) {
          _this2.identicon = identicon;
        },
        className: this.props.className
      });
    }
  }]);

  return Identicon;
}(React.Component);

exports.default = Identicon;


Identicon.defaultProps = {
  className: 'identicon'
};

Identicon.propTypes = {
  seed: _propTypes2.default.string.isRequired,
  size: _propTypes2.default.number,
  scale: _propTypes2.default.number,
  color: _propTypes2.default.string,
  bgColor: _propTypes2.default.string,
  spotColor: _propTypes2.default.string
};
});

var Blockies = unwrapExports(main);

var IDENTICON_SCALE = 3;
var IDENTICON_SQUARES = 8;
var IDENTICON_SIZE = IDENTICON_SQUARES * IDENTICON_SCALE;
var PX_RATIO = typeof devicePixelRatio === 'undefined' ? 2 : devicePixelRatio;

var IdentityBadge = function (_React$PureComponent) {
  inherits(IdentityBadge, _React$PureComponent);

  function IdentityBadge() {
    classCallCheck(this, IdentityBadge);
    return possibleConstructorReturn(this, (IdentityBadge.__proto__ || Object.getPrototypeOf(IdentityBadge)).apply(this, arguments));
  }

  createClass(IdentityBadge, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          entity = _props.entity,
          shorten = _props.shorten,
          fontSize = _props.fontSize,
          networkType = _props.networkType;

      var address = isAddress(entity) ? entity : null;

      var mainProps = stylingProps(this);
      if (address) {
        mainProps.href = blockExplorerUrl('address', address, { networkType: networkType });
      }

      var MainComponent = address ? MainAsLink : Main$5;

      return React.createElement(
        MainComponent,
        _extends({ title: address, onClick: this.handleClick }, mainProps),
        address && React.createElement(
          Identicon,
          null,
          React.createElement(Blockies, {
            seed: address,
            size: IDENTICON_SQUARES,
            scale: IDENTICON_SCALE * PX_RATIO
          })
        ),
        React.createElement(
          Label$1,
          { size: fontSize },
          address && shorten ? shortenAddress(address) : entity
        )
      );
    }
  }]);
  return IdentityBadge;
}(React.PureComponent);

IdentityBadge.propTypes = {
  entity: propTypes.string,
  shorten: propTypes.bool,
  fontSize: propTypes.string,
  networkType: propTypes.string
};
IdentityBadge.defaultProps = {
  entity: '',
  shorten: true,
  fontSize: 'normal',
  networkType: 'main'
};


var Main$5 = styled__default.div.withConfig({
  displayName: 'IdentityBadge__Main',
  componentId: 'q71pax-0'
})(['overflow:hidden;display:inline-flex;align-items:center;height:', 'px;background:#daeaef;border-radius:3px;cursor:default;'], IDENTICON_SIZE);

// TODO: move to `as` when migrating to styled-components v4.
// See https://www.styled-components.com/docs/api#as-polymorphic-prop
var MainAsLink = styled__default(Main$5.withComponent(SafeLink)).attrs({
  target: '_blank'
}).withConfig({
  displayName: 'IdentityBadge__MainAsLink',
  componentId: 'q71pax-1'
})(['cursor:pointer;text-decoration:none;']);

var Identicon = styled__default.div.withConfig({
  displayName: 'IdentityBadge__Identicon',
  componentId: 'q71pax-2'
})(['position:relative;width:', 'px;height:', 'px;transform:scale(', ');transform-origin:0 0;&:after{content:\'\';position:absolute;z-index:1;top:0;left:0;right:0;bottom:0;background:#fff;opacity:0.3;}'], IDENTICON_SIZE, IDENTICON_SIZE, 1 / PX_RATIO);

var Label$1 = styled__default(Text).withConfig({
  displayName: 'IdentityBadge__Label',
  componentId: 'q71pax-3'
})(['padding:0 8px;white-space:nowrap;', ' + &{padding:0 8px 0 5px;}'], Identicon);

var Bylaw = function Bylaw(props) {
  return React.createElement(
    "svg",
    _extends({ width: 17, height: 16, viewBox: "0 0 17 16" }, props),
    React.createElement(
      "g",
      { fill: "none", fillRule: "evenodd" },
      React.createElement("path", { d: "M-2-2h22v22H-2z" }),
      React.createElement(
        "g",
        { opacity: 0.8, stroke: "currentColor" },
        React.createElement("path", {
          d: "M9.036 1.143L1.578 4.357V5.43h14.916V4.357L9.036 1.143zm6.88 12.393H2.071c-.318 0-.577.242-.577.535v1.072h15V14.07c0-.293-.26-.535-.578-.535z",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }),
        React.createElement("path", { d: "M3 5v8.034M6 5v8.275M9 5v8.034M12 5v8.275M15 5v8.275" })
      )
    )
  );
};

var Icon = styled__default.span.withConfig({
  displayName: 'IconInfo__Icon',
  componentId: 'sc-1g1veyi-0'
})(['margin-right:10px;']);

var Title$1 = styled__default.div.withConfig({
  displayName: 'IconInfo__Title',
  componentId: 'sc-1g1veyi-1'
})(['color:', ';margin-bottom:2px;display:flex;align-items:center;', ';'], theme.textSecondary, font({ size: 'small' }));

var TitlelessBody = styled__default.div.withConfig({
  displayName: 'IconInfo__TitlelessBody',
  componentId: 'sc-1g1veyi-2'
})(['display:flex;align-items:center;']);

var IconInfo = function IconInfo(_ref) {
  var children = _ref.children,
      icon = _ref.icon,
      title = _ref.title,
      props = objectWithoutProperties(_ref, ['children', 'icon', 'title']);

  var titleElm = title;
  var bodyElm = React.createElement(
    TitlelessBody,
    null,
    icon && React.createElement(
      Icon,
      null,
      icon
    ),
    children
  );
  if (title) {
    titleElm = React.createElement(
      Title$1,
      null,
      icon && React.createElement(
        Icon,
        null,
        icon
      ),
      title
    );
    bodyElm = children;
  }
  return React.createElement(
    Info$1,
    _extends({ title: titleElm }, props),
    bodyElm
  );
};
IconInfo.propTypes = {
  children: propTypes.node,
  icon: propTypes.node,
  title: propTypes.node
};

var Action = function Action(props) {
  return React.createElement(IconInfo, _extends({ icon: React.createElement(Attention, null) }, props));
};

var PermissionIconInfo = styled__default(IconInfo).withConfig({
  displayName: 'IconInfo__PermissionIconInfo',
  componentId: 'sc-1g1veyi-3'
})(['', '{color:', ';}'], Icon, theme.infoPermissionsIcon);

var Permissions$2 = function Permissions(props) {
  return React.createElement(PermissionIconInfo, _extends({
    background: theme.infoPermissionsBackground,
    icon: React.createElement(Bylaw, null)
  }, props));
};

var Info$1 = function Info(_ref) {
  var children = _ref.children,
      title = _ref.title,
      props = objectWithoutProperties(_ref, ['children', 'title']);
  return React.createElement(
    Main$6,
    props,
    title && React.createElement(
      Title,
      null,
      title
    ),
    children
  );
};
Info$1.propTypes = {
  background: propTypes.string,
  children: propTypes.node,
  title: propTypes.node
};
Info$1.defaultProps = {
  background: theme.infoBackground
};

var Main$6 = styled__default.section.withConfig({
  displayName: 'Info__Main',
  componentId: 'sc-1kgnlbm-0'
})(['background:', ';padding:15px;border-radius:3px;word-wrap:break-word;'], function (_ref2) {
  var background = _ref2.background;
  return background;
});

var Title = styled__default.h1.withConfig({
  displayName: 'Info__Title',
  componentId: 'sc-1kgnlbm-1'
})(['display:flex;']);

Info$1.Action = Action;
Info$1.Permissions = Permissions$2;

var LeftIcon = function LeftIcon() {
  return React.createElement(
    "svg",
    { width: "24", height: "19", viewBox: "0 0 24 19" },
    React.createElement("path", {
      d: "M21 10H4l6-6-6 6 6 6",
      stroke: "currentColor",
      strokeWidth: "1.5",
      fill: "none",
      fillRule: "evenodd",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  );
};

var NavigationBar = function (_React$Component) {
  inherits(NavigationBar, _React$Component);

  function NavigationBar() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NavigationBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NavigationBar.__proto__ || Object.getPrototypeOf(NavigationBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      cachedItems: null,
      direction: -1,

      // only animate after the first rendering
      animate: false
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NavigationBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ animate: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          onBack = _props.onBack,
          items = _props.items;
      var animate = this.state.animate;

      var displayedItems = items.map(function (node, index) {
        return { node: node, index: index };
      }).slice(-1);
      return React.createElement(
        Container,
        null,
        React.createElement(
          Transition,
          {
            keys: displayedItems.map(
            // Use a different key than 0 when there is only one item, so that
            // the “leave” transition of the first item can be executed when a
            // second item is added.
            function (item) {
              return items.length === 1 ? -1 : item.index;
            }),
            config: springs.smooth,
            from: { opacity: 0, position: this.state.direction * -1 },
            enter: { opacity: 1, position: 0 },
            leave: { opacity: 0, position: this.state.direction },
            immediate: !animate,
            native: true
          },
          displayedItems.map(function (item) {
            return function (styles) {
              return React.createElement(Item, _extends({
                label: item.node,
                onBack: onBack,
                displayBack: items.length > 1 && item.index > 0
              }, styles));
            };
          })
        )
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, state) {
      var updatedState = { cachedItems: props.items };
      if (!state.cachedItems) {
        return updatedState;
      }
      return _extends({}, updatedState, {
        direction: state.cachedItems.length > props.items.length ? 1 : -1
      });
    }
  }]);
  return NavigationBar;
}(React.Component);

NavigationBar.propTypes = {
  onBack: propTypes.func,
  items: propTypes.arrayOf(propTypes.node)
};
NavigationBar.defaultProps = {
  onBack: function onBack() {},
  items: []
};


var Item = function Item(_ref2) {
  var opacity = _ref2.opacity,
      position = _ref2.position,
      displayBack = _ref2.displayBack,
      onBack = _ref2.onBack,
      label = _ref2.label;
  return React.createElement(
    extendedAnimated.span,
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        opacity: opacity,
        transform: position.interpolate(function (p) {
          return 'translate(' + p * 20 + 'px, 0)';
        })
      }
    },
    React.createElement(
      Title$2,
      null,
      displayBack && React.createElement(
        BackButton,
        { onClick: onBack },
        React.createElement(LeftIcon, null)
      ),
      React.createElement(
        Label$2,
        null,
        label
      )
    )
  );
};

Item.propTypes = {
  opacity: propTypes.object,
  position: propTypes.object,
  displayBack: propTypes.bool,
  onBack: propTypes.func,
  label: propTypes.node
};

var Container = styled__default.span.withConfig({
  displayName: 'NavigationBar__Container',
  componentId: 'pd4tzi-0'
})(['display:flex;position:relative;height:100%;']);

var Title$2 = styled__default.span.withConfig({
  displayName: 'NavigationBar__Title',
  componentId: 'pd4tzi-1'
})(['display:flex;align-items:center;position:absolute;left:0;top:0;bottom:0;']);

var Label$2 = styled__default.span.withConfig({
  displayName: 'NavigationBar__Label',
  componentId: 'pd4tzi-2'
})(['padding-left:30px;white-space:nowrap;font-size:22px;']);

var BackButton = styled__default.span.withConfig({
  displayName: 'NavigationBar__BackButton',
  componentId: 'pd4tzi-3'
})(['display:flex;align-items:center;height:63px;padding:0 30px;cursor:pointer;svg{color:hsl(179,76%,48%);}:active svg{color:hsl(179,76%,63%);}& + ', '{padding-left:0;}'], Label$2);

var RadioButton = styled__default.input.attrs({ type: 'radio' }).withConfig({
  displayName: 'RadioButton',
  componentId: 'sc-15x938z-0'
})(['appearance:none;display:inline-flex;align-items:center;justify-content:center;position:relative;width:14px;height:14px;margin:5px;background:#f3f9fb;border:1px solid #daeaef;border-radius:50%;outline:0;cursor:pointer;&:after{content:\'\';position:absolute;background:#daeaef;width:8px;height:8px;border-radius:4px;opacity:0;transform:scale(0.3);transition:all 100ms ease-in-out;}&:active{border-color:#c9d9de;}&:active:after{opacity:1;transform:scale(0.6);background:#daeaef;}&:checked:after{opacity:1;transform:scale(1);background:#1dd9d5;}']);

var RadioGroup = function RadioGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      radioProps = objectWithoutProperties(_ref, ['children', 'className']);
  return React.createElement(
    'div',
    { className: className, role: 'radiogroup' },
    React.Children.map(children, function (child) {
      return React.cloneElement(child, _extends({}, radioProps));
    })
  );
};
RadioGroup.propTypes = {
  children: propTypes.node.isRequired,
  className: propTypes.string
};

var installedColorSpaces = [];
var undef = function (obj) {
        return typeof obj === 'undefined';
    };
var channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/;
var percentageChannelRegExp = /\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/;
var alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/;
var cssColorRegExp = new RegExp(
                         '^(rgb|hsl|hsv)a?' +
                         '\\(' +
                             channelRegExp.source + ',' +
                             channelRegExp.source + ',' +
                             channelRegExp.source +
                             '(?:,' + alphaChannelRegExp.source + ')?' +
                         '\\)$', 'i');

function color$1(obj) {
    if (Array.isArray(obj)) {
        if (typeof obj[0] === 'string' && typeof color$1[obj[0]] === 'function') {
            // Assumed array from .toJSON()
            return new color$1[obj[0]](obj.slice(1, obj.length));
        } else if (obj.length === 4) {
            // Assumed 4 element int RGB array from canvas with all channels [0;255]
            return new color$1.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
        }
    } else if (typeof obj === 'string') {
        var lowerCased = obj.toLowerCase();
        if (color$1.namedColors[lowerCased]) {
            obj = '#' + color$1.namedColors[lowerCased];
        }
        if (lowerCased === 'transparent') {
            obj = 'rgba(0,0,0,0)';
        }
        // Test for CSS rgb(....) string
        var matchCssSyntax = obj.match(cssColorRegExp);
        if (matchCssSyntax) {
            var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                hasHue = colorSpaceName[0] === 'H',
                firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
            if (undef(color$1[colorSpaceName])) {
                throw new Error('color.' + colorSpaceName + ' is not installed.');
            }
            return new color$1[colorSpaceName](
                parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                alpha
            );
        }
        // Assume hex syntax
        if (obj.length < 6) {
            // Allow CSS shorthand
            obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
        }
        // Split obj into red, green, and blue components
        var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
        if (hexMatch) {
            return new color$1.RGB(
                parseInt(hexMatch[1], 16) / 255,
                parseInt(hexMatch[2], 16) / 255,
                parseInt(hexMatch[3], 16) / 255
            );
        }

        // No match so far. Lets try the less likely ones
        if (color$1.CMYK) {
            var cmykMatch = obj.match(new RegExp(
                             '^cmyk' +
                             '\\(' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source +
                             '\\)$', 'i'));
            if (cmykMatch) {
                return new color$1.CMYK(
                    parseFloat(cmykMatch[1]) / 100,
                    parseFloat(cmykMatch[2]) / 100,
                    parseFloat(cmykMatch[3]) / 100,
                    parseFloat(cmykMatch[4]) / 100
                );
            }
        }
    } else if (typeof obj === 'object' && obj.isColor) {
        return obj;
    }
    return false;
}

color$1.namedColors = {};

color$1.installColorSpace = function (colorSpaceName, propertyNames, config) {
    color$1[colorSpaceName] = function (a1) { // ...
        var args = Array.isArray(a1) ? a1 : arguments;
        propertyNames.forEach(function (propertyName, i) {
            var propertyValue = args[i];
            if (propertyName === 'alpha') {
                this._alpha = (isNaN(propertyValue) || propertyValue > 1) ? 1 : (propertyValue < 0 ? 0 : propertyValue);
            } else {
                if (isNaN(propertyValue)) {
                    throw new Error('[' + colorSpaceName + ']: Invalid color: (' + propertyNames.join(',') + ')');
                }
                if (propertyName === 'hue') {
                    this._hue = propertyValue < 0 ? propertyValue - Math.floor(propertyValue) : propertyValue % 1;
                } else {
                    this['_' + propertyName] = propertyValue < 0 ? 0 : (propertyValue > 1 ? 1 : propertyValue);
                }
            }
        }, this);
    };
    color$1[colorSpaceName].propertyNames = propertyNames;

    var prototype = color$1[colorSpaceName].prototype;

    ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : function () {
            return this.rgb()[methodName]();
        });
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (undef(epsilon)) {
            epsilon = 1e-10;
        }

        otherColor = otherColor[colorSpaceName.toLowerCase()]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = function () {
        return [colorSpaceName].concat(propertyNames.map(function (propertyName) {
            return this['_' + propertyName];
        }, this));
    };

    for (var propertyName in config) {
        if (config.hasOwnProperty(propertyName)) {
            var matchFromColorSpace = propertyName.match(/^from(.*)$/);
            if (matchFromColorSpace) {
                color$1[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
            } else {
                prototype[propertyName] = config[propertyName];
            }
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype[colorSpaceName.toLowerCase()] = function () {
        return this;
    };
    prototype.toString = function () {
        return '[' + colorSpaceName + ' ' + propertyNames.map(function (propertyName) {
            return this['_' + propertyName];
        }, this).join(', ') + ']';
    };

    // Generate getters and setters
    propertyNames.forEach(function (propertyName) {
        var shortName = propertyName === 'black' ? 'k' : propertyName.charAt(0);
        prototype[propertyName] = prototype[shortName] = function (value, isDelta) {
            // Simple getter mode: color.red()
            if (typeof value === 'undefined') {
                return this['_' + propertyName];
            } else if (isDelta) {
                // Adjuster: color.red(+.2, true)
                return new this.constructor(propertyNames.map(function (otherPropertyName) {
                    return this['_' + otherPropertyName] + (propertyName === otherPropertyName ? value : 0);
                }, this));
            } else {
                // Setter: color.red(.2);
                return new this.constructor(propertyNames.map(function (otherPropertyName) {
                    return (propertyName === otherPropertyName) ? value : this['_' + otherPropertyName];
                }, this));
            }
        };
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj[sourceColorSpaceName.toLowerCase()] = function () {
            return this.rgb()[sourceColorSpaceName.toLowerCase()]();
        };
        color$1[sourceColorSpaceName].propertyNames.forEach(function (propertyName) {
            var shortName = propertyName === 'black' ? 'k' : propertyName.charAt(0);
            obj[propertyName] = obj[shortName] = function (value, isDelta) {
                return this[sourceColorSpaceName.toLowerCase()]()[propertyName](value, isDelta);
            };
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && color$1[targetColorSpaceName].prototype[prop] === undefined) {
                color$1[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    installedColorSpaces.push(colorSpaceName);
    return color$1;
};

color$1.pluginList = [];

color$1.use = function (plugin) {
    if (color$1.pluginList.indexOf(plugin) === -1) {
        this.pluginList.push(plugin);
        plugin(color$1);
    }
    return color$1;
};

color$1.installMethod = function (name, fn) {
    installedColorSpaces.forEach(function (colorSpace) {
        color$1[colorSpace].prototype[name] = fn;
    });
    return this;
};

color$1.installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
    hex: function () {
        var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    hexa: function () {
        var alphaString = Math.round(this._alpha * 255).toString(16);
        return '#' + '00'.substr(0, 2 - alphaString.length) + alphaString + this.hex().substr(1, 6);
    },

    css: function () {
        return 'rgb(' + Math.round(255 * this._red) + ',' + Math.round(255 * this._green) + ',' + Math.round(255 * this._blue) + ')';
    },

    cssa: function () {
        return 'rgba(' + Math.round(255 * this._red) + ',' + Math.round(255 * this._green) + ',' + Math.round(255 * this._blue) + ',' + this._alpha + ')';
    }
});

var color_1 = color$1;

var XYZ = function XYZ(color) {
    color.installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
        fromRgb: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
            var convert = function (channel) {
                    return channel > 0.04045 ?
                        Math.pow((channel + 0.055) / 1.055, 2.4) :
                        channel / 12.92;
                },
                r = convert(this._red),
                g = convert(this._green),
                b = convert(this._blue);

            // Reference white point sRGB D65:
            // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
            return new color.XYZ(
                r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
                r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
                r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
                this._alpha
            );
        },

        rgb: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
            var x = this._x,
                y = this._y,
                z = this._z,
                convert = function (channel) {
                    return channel > 0.0031308 ?
                        1.055 * Math.pow(channel, 1 / 2.4) - 0.055 :
                        12.92 * channel;
                };

            // Reference white point sRGB D65:
            // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
            return new color.RGB(
                convert(x *  3.2404542 + y * -1.5371385 + z * -0.4985314),
                convert(x * -0.9692660 + y *  1.8760108 + z *  0.0415560),
                convert(x *  0.0556434 + y * -0.2040259 + z *  1.0572252),
                this._alpha
            );
        },

        lab: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
            var convert = function (channel) {
                    return channel > 0.008856 ?
                        Math.pow(channel, 1 / 3) :
                        7.787037 * channel + 4 / 29;
                },
                x = convert(this._x /  95.047),
                y = convert(this._y / 100.000),
                z = convert(this._z / 108.883);

            return new color.LAB(
                (116 * y) - 16,
                500 * (x - y),
                200 * (y - z),
                this._alpha
            );
        }
    });
};

var LAB = function LAB(color) {
    color.use(XYZ);

    color.installColorSpace('LAB', ['l', 'a', 'b', 'alpha'], {
        fromRgb: function () {
            return this.xyz().lab();
        },

        rgb: function () {
            return this.xyz().rgb();
        },

        xyz: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=08#text8
            var convert = function (channel) {
                    var pow = Math.pow(channel, 3);
                    return pow > 0.008856 ?
                        pow :
                        (channel - 16 / 116) / 7.87;
                },
                y = (this._l + 16) / 116,
                x = this._a / 500 + y,
                z = y - this._b / 200;

            return new color.XYZ(
                convert(x) *  95.047,
                convert(y) * 100.000,
                convert(z) * 108.883,
                this._alpha
            );
        }
    });
};

var HSV = function HSV(color) {
    color.installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
        rgb: function () {
            var hue = this._hue,
                saturation = this._saturation,
                value = this._value,
                i = Math.min(5, Math.floor(hue * 6)),
                f = hue * 6 - i,
                p = value * (1 - saturation),
                q = value * (1 - f * saturation),
                t = value * (1 - (1 - f) * saturation),
                red,
                green,
                blue;
            switch (i) {
            case 0:
                red = value;
                green = t;
                blue = p;
                break;
            case 1:
                red = q;
                green = value;
                blue = p;
                break;
            case 2:
                red = p;
                green = value;
                blue = t;
                break;
            case 3:
                red = p;
                green = q;
                blue = value;
                break;
            case 4:
                red = t;
                green = p;
                blue = value;
                break;
            case 5:
                red = value;
                green = p;
                blue = q;
                break;
            }
            return new color.RGB(red, green, blue, this._alpha);
        },

        hsl: function () {
            var l = (2 - this._saturation) * this._value,
                sv = this._saturation * this._value,
                svDivisor = l <= 1 ? l : (2 - l),
                saturation;

            // Avoid division by zero when lightness approaches zero:
            if (svDivisor < 1e-9) {
                saturation = 0;
            } else {
                saturation = sv / svDivisor;
            }
            return new color.HSL(this._hue, saturation, l / 2, this._alpha);
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
            var red = this._red,
                green = this._green,
                blue = this._blue,
                max = Math.max(red, green, blue),
                min = Math.min(red, green, blue),
                delta = max - min,
                hue,
                saturation = (max === 0) ? 0 : (delta / max),
                value = max;
            if (delta === 0) {
                hue = 0;
            } else {
                switch (max) {
                case red:
                    hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta / 6 + 1 / 3;
                    break;
                case blue:
                    hue = (red - green) / delta / 6 + 2 / 3;
                    break;
                }
            }
            return new color.HSV(hue, saturation, value, this._alpha);
        }
    });
};

var HSL = function HSL(color) {
    color.use(HSV);

    color.installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
        hsv: function () {
            // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
            var l = this._lightness * 2,
                s = this._saturation * ((l <= 1) ? l : 2 - l),
                saturation;

            // Avoid division by zero when l + s is very small (approaching black):
            if (l + s < 1e-9) {
                saturation = 0;
            } else {
                saturation = (2 * s) / (l + s);
            }

            return new color.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
        },

        rgb: function () {
            return this.hsv().rgb();
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
            return this.hsv().hsl();
        }
    });
};

var CMYK = function CMYK(color) {
    color.installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
        rgb: function () {
            return new color.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                     (1 - this._magenta * (1 - this._black) - this._black),
                                     (1 - this._yellow * (1 - this._black) - this._black),
                                     this._alpha);
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
            // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
            var red = this._red,
                green = this._green,
                blue = this._blue,
                cyan = 1 - red,
                magenta = 1 - green,
                yellow = 1 - blue,
                black = 1;
            if (red || green || blue) {
                black = Math.min(cyan, Math.min(magenta, yellow));
                cyan = (cyan - black) / (1 - black);
                magenta = (magenta - black) / (1 - black);
                yellow = (yellow - black) / (1 - black);
            } else {
                black = 1;
            }
            return new color.CMYK(cyan, magenta, yellow, black, this._alpha);
        }
    });
};

var namedColors = function namedColors(color) {
    color.namedColors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '0ff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000',
        blanchedalmond: 'ffebcd',
        blue: '00f',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '0ff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgrey: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkslategrey: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dimgrey: '696969',
        dodgerblue: '1e90ff',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'f0f',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        grey: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred: 'cd5c5c',
        indigo: '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgray: 'd3d3d3',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslategray: '789',
        lightslategrey: '789',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '0f0',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'f0f',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        rebeccapurple: '639',
        red: 'f00',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        slategrey: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        wheat: 'f5deb3',
        white: 'fff',
        whitesmoke: 'f5f5f5',
        yellow: 'ff0',
        yellowgreen: '9acd32'
    };
};

var clearer = function clearer(color) {
    color.installMethod('clearer', function (amount) {
        return this.alpha(isNaN(amount) ? -0.1 : -amount, true);
    });
};

var luminance = function luminance(color) {
  // http://www.w3.org/TR/WCAG20/#relativeluminancedef

  function channelLuminance(value) {
    return (value <= 0.03928) ? value / 12.92 : Math.pow(((value + 0.055) / 1.055), 2.4);
  }

  color.installMethod('luminance', function () {
    var rgb = this.rgb();
    return 0.2126 * channelLuminance(rgb._red) + 0.7152 * channelLuminance(rgb._green) + 0.0722 * channelLuminance(rgb._blue);
  });
};

var contrast = function contrast(color) {
  // http://www.w3.org/TR/WCAG20/#contrast-ratiodef

  color.use(luminance);

  color.installMethod('contrast', function (color2) {
    var lum1 = this.luminance();
    var lum2 = color2.luminance();
    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }

    return (lum2 + 0.05) / (lum1 + 0.05);
  });
};

var darken = function darken(color) {
    color.use(HSL);

    color.installMethod('darken', function (amount) {
        return this.lightness(isNaN(amount) ? -0.1 : -amount, true);
    });
};

var desaturate = function desaturate(color) {
    color.use(HSL);

    color.installMethod('desaturate', function (amount) {
        return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
    });
};

var grayscale = function grayscale(color) {
    function gs () {
        /*jslint strict:false*/
        var rgb = this.rgb(),
            val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

        return new color.RGB(val, val, val, rgb._alpha);
    }

    color.installMethod('greyscale', gs).installMethod('grayscale', gs);
};

var isDark = function isDark(color) {

  color.installMethod('isDark', function () {
    var rgb = this.rgb();

    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var yiq = (rgb._red * 255 * 299 + rgb._green * 255 * 587 + rgb._blue * 255 * 114) / 1000;
    return yiq < 128;
  });
};

var isLight = function isLight(color) {

  color.use(isDark);

  color.installMethod('isLight', function () {
    return !this.isDark();
  });
};

var lighten = function lighten(color) {
    color.use(HSL);

    color.installMethod('lighten', function (amount) {
        return this.lightness(isNaN(amount) ? 0.1 : amount, true);
    });
};

var mix = function mix(color) {
    color.installMethod('mix', function (otherColor, weight) {
        otherColor = color(otherColor).rgb();
        weight = 1 - (isNaN(weight) ? 0.5 : weight);

        var w = weight * 2 - 1,
            a = this._alpha - otherColor._alpha,
            weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
            weight2 = 1 - weight1,
            rgb = this.rgb();

        return new color.RGB(
            rgb._red * weight1 + otherColor._red * weight2,
            rgb._green * weight1 + otherColor._green * weight2,
            rgb._blue * weight1 + otherColor._blue * weight2,
            rgb._alpha * weight + otherColor._alpha * (1 - weight)
        );
    });
};

var negate = function negate(color) {
    color.installMethod('negate', function () {
        var rgb = this.rgb();
        return new color.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
    });
};

var opaquer = function opaquer(color) {
    color.installMethod('opaquer', function (amount) {
        return this.alpha(isNaN(amount) ? 0.1 : amount, true);
    });
};

var rotate = function rotate(color) {
    color.use(HSL);

    color.installMethod('rotate', function (degrees) {
        return this.hue((degrees || 0) / 360, true);
    });
};

var saturate = function saturate(color) {
    color.use(HSL);

    color.installMethod('saturate', function (amount) {
        return this.saturation(isNaN(amount) ? 0.1 : amount, true);
    });
};

// Adapted from http://gimp.sourcearchive.com/documentation/2.6.6-1ubuntu1/color-to-alpha_8c-source.html
// toAlpha returns a color where the values of the argument have been converted to alpha
var toAlpha = function toAlpha(color) {
    color.installMethod('toAlpha', function (color) {
        var me = this.rgb(),
            other = color(color).rgb(),
            epsilon = 1e-10,
            a = new color.RGB(0, 0, 0, me._alpha),
            channels = ['_red', '_green', '_blue'];

        channels.forEach(function (channel) {
            if (me[channel] < epsilon) {
                a[channel] = me[channel];
            } else if (me[channel] > other[channel]) {
                a[channel] = (me[channel] - other[channel]) / (1 - other[channel]);
            } else if (me[channel] > other[channel]) {
                a[channel] = (other[channel] - me[channel]) / other[channel];
            } else {
                a[channel] = 0;
            }
        });

        if (a._red > a._green) {
            if (a._red > a._blue) {
                me._alpha = a._red;
            } else {
                me._alpha = a._blue;
            }
        } else if (a._green > a._blue) {
            me._alpha = a._green;
        } else {
            me._alpha = a._blue;
        }

        if (me._alpha < epsilon) {
            return me;
        }

        channels.forEach(function (channel) {
            me[channel] = (me[channel] - other[channel]) / me._alpha + other[channel];
        });
        me._alpha *= a._alpha;

        return me;
    });
};

var onecolor = color_1
    .use(XYZ)
    .use(LAB)
    .use(HSV)
    .use(HSL)
    .use(CMYK)

    // Convenience functions
    .use(namedColors)
    .use(clearer)
    .use(contrast)
    .use(darken)
    .use(desaturate)
    .use(grayscale)
    .use(isDark)
    .use(isLight)
    .use(lighten)
    .use(luminance)
    .use(mix)
    .use(negate)
    .use(opaquer)
    .use(rotate)
    .use(saturate)
    .use(toAlpha);

var contentBorder$2 = theme.contentBorder;

var labelBoxBorder = onecolor(colors.Sea['Light Sea']);

var RadioListItem = function (_React$Component) {
  inherits(RadioListItem, _React$Component);

  function RadioListItem() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, RadioListItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = RadioListItem.__proto__ || Object.getPrototypeOf(RadioListItem)).call.apply(_ref, [this].concat(args))), _this), _this.handleOnChange = function (event) {
      var _this$props = _this.props,
          index = _this$props.index,
          onChange = _this$props.onChange,
          onSelect = _this$props.onSelect;

      onSelect(index);
      onChange(event);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(RadioListItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          description = _props.description,
          selected = _props.selected,
          title = _props.title,
          ignoredIndex = _props.index,
          ignoredOnChange = _props.onChange,
          ignoredOnSelect = _props.onSelect,
          radioProps = objectWithoutProperties(_props, ['className', 'description', 'selected', 'title', 'index', 'onChange', 'onSelect']);

      return React.createElement(
        Label$3,
        { className: className },
        React.createElement(Radio, _extends({
          checked: selected,
          onChange: this.handleOnChange
        }, radioProps)),
        React.createElement(
          LabelBox,
          { selected: selected },
          React.createElement(
            Title$4,
            null,
            title
          ),
          React.createElement(
            Description$1,
            null,
            description
          )
        )
      );
    }
  }]);
  return RadioListItem;
}(React.Component);

// Styled components


RadioListItem.propTypes = {
  description: propTypes.node.isRequired,
  index: propTypes.number.isRequired,
  title: propTypes.node.isRequired,

  className: propTypes.string,
  onChange: propTypes.func,
  onSelect: propTypes.func,
  selected: propTypes.bool
};
RadioListItem.defaultProps = {
  // By default, prevent the default change event from bubbling up
  onChange: function onChange(event) {
    event.stopPropagation();
  },
  onSelect: function onSelect() {}
};
var Label$3 = styled__default.label.withConfig({
  displayName: 'RadioListItem__Label',
  componentId: 'sc-1utxw89-0'
})(['display:flex;&:not(:first-child){margin-top:10px;}', ';'], unselectable());

var LabelBox = styled__default.div.withConfig({
  displayName: 'RadioListItem__LabelBox',
  componentId: 'sc-1utxw89-1'
})(['flex-grow:1;margin-left:12px;padding:12px 12px;border:1px ', ' solid;border-radius:3px;transition:border 200ms linear;cursor:pointer;&:focus,&:hover{border-color:', ';}'], contentBorder$2, labelBoxBorder.alpha(0.35).cssa());

var Title$4 = styled__default(Text).attrs({
  weight: 'bold'
}).withConfig({
  displayName: 'RadioListItem__Title',
  componentId: 'sc-1utxw89-2'
})(['']);

var Description$1 = styled__default(Text.Block).withConfig({
  displayName: 'RadioListItem__Description',
  componentId: 'sc-1utxw89-3'
})(['margin-top:5px;']);

var Radio = styled__default(RadioButton).withConfig({
  displayName: 'RadioListItem__Radio',
  componentId: 'sc-1utxw89-4'
})(['flex-shrink:0;margin-top:16px;']);

var RadioList = function (_React$Component) {
  inherits(RadioList, _React$Component);

  function RadioList() {
    classCallCheck(this, RadioList);
    return possibleConstructorReturn(this, (RadioList.__proto__ || Object.getPrototypeOf(RadioList)).apply(this, arguments));
  }

  createClass(RadioList, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          description = _props.description,
          items = _props.items,
          selected = _props.selected,
          title = _props.title,
          props = objectWithoutProperties(_props, ['description', 'items', 'selected', 'title']);

      return React.createElement(
        'div',
        null,
        title && React.createElement(
          Title$3,
          null,
          React.createElement(
            Text,
            { size: 'large', weight: 'bold' },
            title
          )
        ),
        description && React.createElement(
          Description,
          null,
          description
        ),
        React.createElement(
          Group,
          props,
          items.map(function (_ref, i) {
            var description = _ref.description,
                title = _ref.title,
                value = _ref.value;
            return React.createElement(RadioListItem, {
              key: i,
              index: i,
              selected: i === selected,
              description: description,
              title: title,
              value: value
            });
          })
        )
      );
    }
  }]);
  return RadioList;
}(React.Component);

RadioList.propTypes = {
  description: propTypes.node,
  items: propTypes.arrayOf(propTypes.shape({
    description: propTypes.node.isRequired,
    title: propTypes.node.isRequired,
    value: propTypes.string
  })),
  selected: function selected(_ref2, _, componentName) {
    var items = _ref2.items,
        _selected = _ref2.selected;

    if (!Number.isInteger(_selected) || _selected >= items.length) {
      throw new Error('Invalid prop `selected` supplied to `' + componentName + '`. ' + '`selected` must be an integer less than the length of `items`. ' + ('Given ' + _selected + ' instead.'));
    }
  },
  title: propTypes.node
};
RadioList.defaultProps = {
  items: [],
  selected: 0
};


var Title$3 = styled__default.h2.withConfig({
  displayName: 'RadioList__Title',
  componentId: 'sc-1hkg1b7-0'
})(['margin-bottom:5px;']);

var Description = styled__default(Text.Block).withConfig({
  displayName: 'RadioList__Description',
  componentId: 'sc-1hkg1b7-1'
})(['margin-bottom:18px;']);

var Group = styled__default(RadioGroup).withConfig({
  displayName: 'RadioList__Group',
  componentId: 'sc-1hkg1b7-2'
})(['display:flex;flex-direction:column;']);

var close = "data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%2210%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%201.014L6.014%205%2010%208.986%208.986%2010%205%206.014%201.014%2010%200%208.986%203.986%205%200%201.014%201.014%200%205%203.986%208.986%200z%22%20fill%3D%22%236D777B%22%20fill-rule%3D%22evenodd%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E";

var PANEL_WIDTH = 450;
var CONTENT_PADDING = 30;
var PANEL_EXTRA_PADDING = PANEL_WIDTH * 0.2;
var PANEL_OUTER_WIDTH = PANEL_WIDTH + PANEL_EXTRA_PADDING;
var PANEL_INNER_WIDTH = PANEL_WIDTH - CONTENT_PADDING * 2;

var SidePanel = function (_React$PureComponent) {
  inherits(SidePanel, _React$PureComponent);

  function SidePanel() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, SidePanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = SidePanel.__proto__ || Object.getPrototypeOf(SidePanel)).call.apply(_ref, [this].concat(args))), _this), _this.handleClose = function () {
      if (!_this.props.blocking) {
        _this.props.onClose();
      }
    }, _this.handleEscape = function (event) {
      if (event.keyCode === 27 && _this.props.opened) {
        _this.handleClose();
      }
    }, _this.handleTransitionRest = function () {
      _this.props.onTransitionEnd(_this.props.opened);
    }, _this.renderIn = function (_ref2) {
      var progress = _ref2.progress;
      var _this$props = _this.props,
          children = _this$props.children,
          title = _this$props.title,
          opened = _this$props.opened,
          blocking = _this$props.blocking;

      // When hiding the panel, add 40px more for the shadow

      var panelRight = opened ? -PANEL_EXTRA_PADDING : -PANEL_OUTER_WIDTH - 40;

      return React.createElement(
        Main$7,
        { opened: opened },
        React.createElement(Overlay, {
          style: {
            opacity: progress,
            pointerEvents: opened ? 'auto' : 'none'
          },
          onClick: _this.handleClose
        }),
        React.createElement(
          Panel,
          {
            style: {
              right: panelRight + 'px',
              transform: progress.interpolate(function (t) {
                return 'translate3d(' + (Number(opened) - t) * (PANEL_WIDTH + 40) + 'px, 0, 0)';
              })
            }
          },
          React.createElement(
            PanelHeader,
            null,
            React.createElement(
              'h1',
              null,
              React.createElement(
                Text,
                { size: 'xxlarge' },
                title
              )
            ),
            !blocking && React.createElement(
              PanelCloseButton,
              { type: 'button', onClick: _this.handleClose },
              React.createElement(
                PublicUrl,
                null,
                function (publicUrl) {
                  return React.createElement('img', { src: prefixUrl(close, publicUrl), alt: 'Close' });
                }
              )
            )
          ),
          React.createElement(
            PanelScrollView,
            null,
            React.createElement(
              PanelContent,
              null,
              children
            )
          )
        )
      );
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(SidePanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this.handleEscape, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleEscape, false);
    }
  }, {
    key: 'render',
    value: function render() {
      var opened = this.props.opened;

      return React.createElement(
        Spring,
        {
          config: springs.lazy,
          to: { progress: Number(opened) },
          onRest: this.handleTransitionRest,
          native: true
        },
        this.renderIn
      );
    }
  }]);
  return SidePanel;
}(React.PureComponent);

SidePanel.propTypes = {
  children: propTypes.node,
  title: propTypes.string.isRequired,
  opened: propTypes.bool,
  blocking: propTypes.bool,
  onClose: propTypes.func,
  onTransitionEnd: propTypes.func
};

SidePanel.defaultProps = {
  opened: true,
  blocking: false,
  onClose: function onClose() {},
  onTransitionEnd: function onTransitionEnd() {}
};

var Main$7 = styled__default.div.withConfig({
  displayName: 'SidePanel__Main',
  componentId: 'sc-1kjx6mk-0'
})(['position:fixed;z-index:3;top:0;left:0;right:0;bottom:0;pointer-events:', ';'], function (_ref3) {
  var opened = _ref3.opened;
  return opened ? 'auto' : 'none';
});

var Overlay = styled__default(extendedAnimated.div).withConfig({
  displayName: 'SidePanel__Overlay',
  componentId: 'sc-1kjx6mk-1'
})(['position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(68,81,89,0.65);']);

var Panel = styled__default(extendedAnimated.aside).withConfig({
  displayName: 'SidePanel__Panel',
  componentId: 'sc-1kjx6mk-2'
})(['position:absolute;top:0;right:0;display:flex;flex-direction:column;width:', 'px;height:100vh;padding-right:', 'px;background:white;box-shadow:-2px 0 36px rgba(0,0,0,0.2);'], PANEL_WIDTH + PANEL_EXTRA_PADDING, PANEL_EXTRA_PADDING);

var PanelHeader = styled__default.header.withConfig({
  displayName: 'SidePanel__PanelHeader',
  componentId: 'sc-1kjx6mk-3'
})(['position:relative;padding-top:15px;padding-left:', 'px;padding-right:20px;padding-bottom:15px;', ';flex-shrink:0;'], CONTENT_PADDING, unselectable());

var PanelScrollView = styled__default.div.withConfig({
  displayName: 'SidePanel__PanelScrollView',
  componentId: 'sc-1kjx6mk-4'
})(['overflow-y:auto;height:100%;display:flex;flex-direction:column;']);

var PanelContent = styled__default.div.withConfig({
  displayName: 'SidePanel__PanelContent',
  componentId: 'sc-1kjx6mk-5'
})(['min-height:0;flex-grow:1;flex-shrink:0;display:flex;flex-direction:column;width:100%;padding-right:', 'px;padding-left:', 'px;padding-bottom:', 'px;'], CONTENT_PADDING, CONTENT_PADDING, CONTENT_PADDING);

var PanelCloseButton = styled__default.button.withConfig({
  displayName: 'SidePanel__PanelCloseButton',
  componentId: 'sc-1kjx6mk-6'
})(['', ' &{position:absolute;padding:20px;top:0;right:0;cursor:pointer;background:none;border:0;outline:0;&::-moz-focus-inner{border:0;}}'], PanelHeader);

SidePanel.PANEL_WIDTH = PANEL_WIDTH;
SidePanel.PANEL_OUTER_WIDTH = PANEL_OUTER_WIDTH;
SidePanel.PANEL_EXTRA_PADDING = PANEL_EXTRA_PADDING;
SidePanel.PANEL_INNER_WIDTH = PANEL_INNER_WIDTH;
SidePanel.HORIZONTAL_PADDING = CONTENT_PADDING;

// legacy
SidePanel.PANEL_OVERFLOW = PANEL_EXTRA_PADDING;
SidePanel.PANEL_HIDE_RIGHT = -PANEL_OUTER_WIDTH;

var SidePanelSeparator = styled__default.div.withConfig({
  displayName: 'SidePanelSeparator',
  componentId: 'sc-75c7uf-0'
})(['width:calc(100% + ', 'px);margin:0 -', 'px;height:1px;background:', ';'], SidePanel.HORIZONTAL_PADDING * 2, SidePanel.HORIZONTAL_PADDING, theme.contentBorder);

var SidePanelSplit = function SidePanelSplit(_ref) {
  var children = _ref.children,
      props = objectWithoutProperties(_ref, ['children']);
  return React.createElement(
    Main$8,
    props,
    React.createElement(
      Part$1,
      null,
      children[0]
    ),
    React.createElement(
      Part$1,
      null,
      children[1]
    )
  );
};

SidePanelSplit.propTypes = {
  children: propTypes.node
};

var Main$8 = styled__default.div.withConfig({
  displayName: 'SidePanelSplit__Main',
  componentId: 'd0csv3-0'
})(['display:flex;width:calc(100% + ', 'px);margin:0 -', 'px;border:1px solid ', ';border-width:1px 0;'], SidePanel.HORIZONTAL_PADDING * 2, SidePanel.HORIZONTAL_PADDING, theme.contentBorder);

var Part$1 = styled__default.div.withConfig({
  displayName: 'SidePanelSplit__Part',
  componentId: 'd0csv3-1'
})(['width:50%;padding:20px ', 'px;&:first-child{border-right:1px solid ', ';}'], SidePanel.HORIZONTAL_PADDING, theme.contentBorder);

var BAR_HEIGHT = 6;
var HANDLE_SIZE = 24;
var HANDLE_SHADOW_MARGIN = 15;
var PADDING = 5;
var MIN_WIDTH = HANDLE_SIZE * 10;
var HEIGHT = Math.max(HANDLE_SIZE, BAR_HEIGHT) + PADDING * 2;

var Slider = function (_React$Component) {
  inherits(Slider, _React$Component);

  function Slider() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Slider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Slider.__proto__ || Object.getPrototypeOf(Slider)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      pressed: false
    }, _this.handleRef = function (element) {
      _this._mainElement = element;
      _this._document = element && element.ownerDocument;
    }, _this.getRect = function () {
      var now = Date.now();

      // Cache the rect if the last poll was less than a second ago
      if (_this._lastRect && now - _this._lastRectTime < 1000) {
        return _this._lastRect;
      }

      _this._lastRectTime = now;
      _this._lastRect = _this._mainElement ? _this._mainElement.getBoundingClientRect() : new window.DOMRect();

      return _this._lastRect;
    }, _this.dragStart = function (event) {
      _this.dragStop();
      var clientX = _this.clientXFromEvent(event);
      _this.setState({ pressed: true }, function () {
        _this.updateValueFromClientX(clientX);
      });
      _this._document.addEventListener('mouseup', _this.dragStop);
      _this._document.addEventListener('touchend', _this.dragStop);
      _this._document.addEventListener('mousemove', _this.dragMove);
      _this._document.addEventListener('touchmove', _this.dragMove);
    }, _this.dragStop = function () {
      _this.setState({ pressed: false });
      _this._document.removeEventListener('mouseup', _this.dragStop);
      _this._document.removeEventListener('touchend', _this.dragStop);
      _this._document.removeEventListener('mousemove', _this.dragMove);
      _this._document.removeEventListener('touchmove', _this.dragMove);
    }, _this.dragMove = function (event) {
      if (!_this.state.pressed) {
        return;
      }

      _this.updateValueFromClientX(_this.clientXFromEvent(event));
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Slider, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.dragStop();
    }
  }, {
    key: 'clientXFromEvent',
    value: function clientXFromEvent(event) {
      return (event.touches ? event.touches.item(0) : event).clientX;
    }
  }, {
    key: 'updateValueFromClientX',
    value: function updateValueFromClientX(clientX) {
      var rect = this.getRect();
      var x = Math.min(rect.width, Math.max(0, clientX - rect.x));
      this.props.onUpdate(x / rect.width);
    }
  }, {
    key: 'getHandleStyles',
    value: function getHandleStyles(pressProgress) {
      return {
        transform: pressProgress.interpolate(function (t) {
          return 'translate3d(0, calc(' + t + 'px - 50%), 0)';
        }),
        boxShadow: pressProgress.interpolate(function (t) {
          return '0 4px 8px 0 rgba(0, 0, 0, ' + 0.13 * (1 - t) + ')';
        }),
        background: pressProgress.interpolate(function (t) {
          return 'hsl(0, 0%, ' + 100 * (1 - t * 0.01) + '%)';
        })
      };
    }
  }, {
    key: 'getHandlePositionStyles',
    value: function getHandlePositionStyles(value) {
      return {
        transform: value.interpolate(function (t) {
          return 'translate3d(calc(' + t * 100 + '% + ' + HANDLE_SHADOW_MARGIN + 'px), 0, 0)';
        })
      };
    }
  }, {
    key: 'getActiveBarStyles',
    value: function getActiveBarStyles(value, pressProgress) {
      return {
        transform: value.interpolate(function (t) {
          return 'scaleX(' + t + ') translateZ(0)';
        }),
        background: pressProgress.interpolate(function (t) {
          return 'hsl(179, ' + Math.round(76 * (1 + 0.2 * t)) + '%, 48%)';
        })
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var pressed = this.state.pressed;

      var value = Math.max(0, Math.min(1, this.props.value));
      return React.createElement(
        Spring,
        {
          config: springs.swift,
          to: {
            pressProgress: Number(pressed),
            value: value
          },
          native: true
        },
        function (_ref2) {
          var value = _ref2.value,
              pressProgress = _ref2.pressProgress;
          return React.createElement(
            Main$9,
            null,
            React.createElement(
              Area,
              {
                innerRef: _this2.handleRef,
                onMouseDown: _this2.dragStart,
                onTouchStart: _this2.dragStart
              },
              React.createElement(
                Bars,
                null,
                React.createElement(BaseBar, null),
                React.createElement(ActiveBar, {
                  pressed: pressed,
                  style: _this2.getActiveBarStyles(value, pressProgress)
                })
              ),
              React.createElement(
                HandleClip,
                null,
                React.createElement(
                  HandlePosition,
                  {
                    style: _this2.getHandlePositionStyles(value, pressProgress)
                  },
                  React.createElement(Handle, {
                    pressed: pressed,
                    style: _this2.getHandleStyles(pressProgress)
                  })
                )
              )
            )
          );
        }
      );
    }
  }]);
  return Slider;
}(React.Component);

Slider.propTypes = {
  value: propTypes.number,
  onUpdate: propTypes.func
};
Slider.defaultProps = {
  value: 0,
  onUpdate: function onUpdate() {}
};


var Main$9 = styled__default.div.withConfig({
  displayName: 'Slider__Main',
  componentId: 'sc-94djfe-0'
})(['min-width:', 'px;padding:0 ', 'px;', ';'], MIN_WIDTH, HANDLE_SIZE / 2 + PADDING, unselectable);

var Area = styled__default.div.withConfig({
  displayName: 'Slider__Area',
  componentId: 'sc-94djfe-1'
})(['position:relative;height:', 'px;cursor:pointer;'], HEIGHT);

var Bars = styled__default(extendedAnimated.div).withConfig({
  displayName: 'Slider__Bars',
  componentId: 'sc-94djfe-2'
})(['position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);overflow:hidden;border-radius:2px;height:', 'px;'], BAR_HEIGHT);

var Bar = styled__default(extendedAnimated.div).withConfig({
  displayName: 'Slider__Bar',
  componentId: 'sc-94djfe-3'
})(['position:absolute;top:0;left:0;right:0;bottom:0;']);

var BaseBar = styled__default(Bar).withConfig({
  displayName: 'Slider__BaseBar',
  componentId: 'sc-94djfe-4'
})(['background:#edf3f6;']);

var ActiveBar = styled__default(Bar).withConfig({
  displayName: 'Slider__ActiveBar',
  componentId: 'sc-94djfe-5'
})(['transform-origin:0 0;']);

var HandleClip = styled__default.div.withConfig({
  displayName: 'Slider__HandleClip',
  componentId: 'sc-94djfe-6'
})(['pointer-events:none;overflow:hidden;width:calc(100% + ', 'px);height:calc(100% + ', 'px);transform-origin:50% 50%;transform:translate( -', 'px,-', 'px );'], HANDLE_SIZE + HANDLE_SHADOW_MARGIN * 2, HANDLE_SHADOW_MARGIN * 2, HANDLE_SIZE / 2 + HANDLE_SHADOW_MARGIN, HANDLE_SHADOW_MARGIN);

var HandlePosition = styled__default(extendedAnimated.div).withConfig({
  displayName: 'Slider__HandlePosition',
  componentId: 'sc-94djfe-7'
})(['width:calc(100% - ', 'px);height:100%;transform-origin:50% 50%;'], HANDLE_SIZE + HANDLE_SHADOW_MARGIN * 2);

var Handle = styled__default(extendedAnimated.div).withConfig({
  displayName: 'Slider__Handle',
  componentId: 'sc-94djfe-8'
})(['position:absolute;top:50%;left:0;width:', 'px;height:', 'px;border:0.5px solid #dcecf5;border-radius:50%;'], HANDLE_SIZE, HANDLE_SIZE);

var TabBar = function (_React$Component) {
  inherits(TabBar, _React$Component);

  function TabBar() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TabBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TabBar.__proto__ || Object.getPrototypeOf(TabBar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      displayFocusRing: false
    }, _this.handleMouseDown = function () {
      _this.disableFocusRing();
    }, _this.handleKeydown = function (_ref2) {
      var key = _ref2.key;

      if (key === 'Enter') {
        _this.selectElement(document.activeElement);
        _this.enableFocusRing();
      }
      if (key === 'Tab') {
        _this.enableFocusRing();
      }
    }, _this.handleTabMouseDown = function (_ref3) {
      var currentTarget = _ref3.currentTarget;

      // We would usually avoid using the DOM when possible, and prefer using a
      // separate component (`Tab`) to keep the `index` in a prop, then pass it
      // using an event prop. But since `this.selectElement()` is needed (so we
      // can pass `document.activeElement` to it for the keyboard), and we have
      // `e.currentTarget` in the event object, we might as well use it for the
      // pointer device too.
      _this.selectElement(currentTarget);
    }, _this.handleBarRef = function (el) {
      _this.barElement = el;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TabBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }, {
    key: 'enableFocusRing',
    value: function enableFocusRing() {
      this.setState({ displayFocusRing: true });
    }
  }, {
    key: 'disableFocusRing',
    value: function disableFocusRing() {
      this.setState({ displayFocusRing: false });
    }
  }, {
    key: 'selectElement',
    value: function selectElement(element) {
      if (!element || !this.barElement) {
        return;
      }
      var index = [].concat(toConsumableArray(this.barElement.childNodes)).indexOf(element);
      if (index > -1) {
        this.props.onSelect(index);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var displayFocusRing = this.state.displayFocusRing;
      var _props = this.props,
          items = _props.items,
          selected = _props.selected;

      return React.createElement(
        'nav',
        { onMouseDown: this.handleMouseDown },
        React.createElement(
          Bar$1,
          { innerRef: this.handleBarRef },
          items.map(function (item, i) {
            return React.createElement(
              Tab,
              {
                key: i,
                tabIndex: '0',
                selected: i === selected,
                focusRing: displayFocusRing,
                onMouseDown: _this2.handleTabMouseDown
              },
              React.createElement(
                Label$4,
                { selected: i === selected },
                item
              ),
              displayFocusRing && React.createElement(FocusRing, null)
            );
          })
        )
      );
    }
  }]);
  return TabBar;
}(React.Component);

TabBar.propTypes = {
  items: propTypes.arrayOf(propTypes.node).isRequired,
  selected: propTypes.number,
  onSelect: propTypes.func
};
TabBar.defaultProps = {
  selected: 0,
  onSelect: noop
};


var Bar$1 = styled__default.ul.withConfig({
  displayName: 'TabBar__Bar',
  componentId: 'sc-1rsszd9-0'
})(['display:flex;border-bottom:1px solid ', ';'], theme.contentBorder);

var FocusRing = styled__default.span.withConfig({
  displayName: 'TabBar__FocusRing',
  componentId: 'sc-1rsszd9-1'
})(['display:none;position:absolute;top:-5px;left:-5px;right:-5px;bottom:-5px;border:2px solid ', ';border-radius:2px;'], theme.accent);

var Tab = styled__default.li.withConfig({
  displayName: 'TabBar__Tab',
  componentId: 'sc-1rsszd9-2'
})(['position:relative;list-style:none;padding:0 30px;cursor:pointer;', ';', ';&:focus{outline:0;', '{display:block;}}'], function (p) {
  return font({ weight: p.selected ? 'bold' : 'normal' });
}, unselectable(), FocusRing);

var Label$4 = styled__default.span.withConfig({
  displayName: 'TabBar__Label',
  componentId: 'sc-1rsszd9-3'
})(['display:flex;margin-bottom:-1px;padding:5px 0 3px;border-bottom:4px solid ', ';'], function (p) {
  return p.selected ? theme.accent : 'transparent';
});

var Table = function Table(_ref) {
  var header = _ref.header,
      children = _ref.children,
      props = objectWithoutProperties(_ref, ['header', 'children']);
  return React.createElement(
    StyledTable,
    props,
    header && React.createElement(
      'thead',
      null,
      header
    ),
    React.createElement(
      'tbody',
      null,
      children
    )
  );
};

Table.propTypes = {
  children: propTypes.node,
  header: propTypes.node
};

var StyledTable = styled__default.table.withConfig({
  displayName: 'Table__StyledTable',
  componentId: 'uvcan9-0'
})(['width:100%;border-spacing:0;']);

var StyledTableRow = styled__default.tr.withConfig({
  displayName: 'TableRow__StyledTableRow',
  componentId: 'sc-3jn6yz-0'
})(['']);

var contentBackground$2 = theme.contentBackground;
var contentBorder$3 = theme.contentBorder;


var StyledTableCell = styled__default.td.withConfig({
  displayName: 'TableCell__StyledTableCell',
  componentId: 'sc-110j155-0'
})(['padding:20px;background:', ';border-bottom:1px solid ', ';text-align:', ';&:first-child{border-left:1px solid ', ';}&:last-child{border-right:1px solid ', ';}', ':first-child &{border-top:1px solid ', ';}', ':first-child &:first-child{border-top-left-radius:3px;}', ':first-child &:last-child{border-top-right-radius:3px;}', ':last-child &:first-child{border-bottom-left-radius:3px;}', ':last-child &:last-child{border-bottom-right-radius:3px;}'], contentBackground$2, contentBorder$3, function (_ref) {
  var align = _ref.align;
  return align;
}, contentBorder$3, contentBorder$3, StyledTableRow, contentBorder$3, StyledTableRow, StyledTableRow, StyledTableRow, StyledTableRow);

var StyledTableCellContent = styled__default.div.withConfig({
  displayName: 'TableCell__StyledTableCellContent',
  componentId: 'sc-110j155-1'
})(['display:flex;align-items:center;justify-content:', ';'], function (_ref2) {
  var align = _ref2.align;
  return align === 'right' ? 'flex-end' : 'space-between';
});

var TableCell = function TableCell(_ref3) {
  var children = _ref3.children,
      Container = _ref3.contentContainer,
      align = _ref3.align,
      props = objectWithoutProperties(_ref3, ['children', 'contentContainer', 'align']);
  return React.createElement(
    StyledTableCell,
    _extends({ align: align }, props),
    React.createElement(
      Container,
      { align: align },
      children
    )
  );
};

TableCell.propTypes = {
  align: propTypes.string,
  contentContainer: propTypes.func,
  children: propTypes.node
};

TableCell.defaultProps = {
  align: 'left',
  contentContainer: StyledTableCellContent
};

var StyledTableHeader = styled__default.th.withConfig({
  displayName: 'TableHeader__StyledTableHeader',
  componentId: 'sc-1qxm8cp-0'
})(['padding:0;padding-left:', ';padding-right:', ';line-height:30px;font-weight:normal;text-align:', ';white-space:nowrap;'], function (_ref) {
  var align = _ref.align;
  return align === 'left' ? '21px' : '0';
}, function (_ref2) {
  var align = _ref2.align;
  return align === 'right' ? '21px' : '0';
}, function (_ref3) {
  var align = _ref3.align;
  return align;
});

var TableHeader = function TableHeader(_ref4) {
  var title = _ref4.title,
      align = _ref4.align,
      props = objectWithoutProperties(_ref4, ['title', 'align']);
  return React.createElement(
    StyledTableHeader,
    _extends({ align: align }, props),
    React.createElement(
      Text.Block,
      { color: theme.textSecondary, smallcaps: true },
      title
    )
  );
};

TableHeader.propTypes = {
  title: propTypes.string,
  align: propTypes.string
};

TableHeader.defaultProps = {
  align: 'left'
};

var baseStyles = styled.css(['', ';width:', ';padding:5px 10px;background:', ';border:1px solid ', ';border-radius:3px;box-shadow:inset 0 1px 2px rgba(0,0,0,0.06);color:', ';appearance:none;&:focus{outline:none;border-color:', ';}&:read-only{color:transparent;text-shadow:0 0 0 ', ';}'], font({ size: 'small', weight: 'normal' }), function (_ref) {
  var wide = _ref.wide;
  return wide ? '100%' : 'auto';
}, theme.contentBackground, theme.contentBorder, theme.textPrimary, theme.contentBorderActive, theme.textSecondary);

// Simple input
var TextInput = styled__default.input.withConfig({
  displayName: 'TextInput',
  componentId: 'gngg3n-0'
})(['', ';'], baseStyles);
TextInput.propTypes = {
  required: propTypes.bool,
  type: propTypes.oneOf(['email', 'number', 'password', 'search', 'tel', 'text', 'url'])
};
TextInput.defaultProps = {
  required: false,
  type: 'text'

  // <input type=number> (only for compat)
};var TextInputNumber = styled__default.input.attrs({ type: 'number' }).withConfig({
  displayName: 'TextInput__TextInputNumber',
  componentId: 'gngg3n-1'
})(['', ';'], baseStyles);

// Multiline input (textarea element)
var TextInputMultiline = styled__default.textarea.withConfig({
  displayName: 'TextInput__TextInputMultiline',
  componentId: 'gngg3n-2'
})(['', ';resize:vertical;'], baseStyles);
TextInputMultiline.propTypes = {
  required: propTypes.bool
};
TextInputMultiline.defaultProps = {
  required: false
};

TextInput.Number = TextInputNumber;
TextInput.Multiline = TextInputMultiline;

exports.IconAdd = Add;
exports.IconApps = Apps;
exports.IconAttention = Attention;
exports.IconError = Error$1;
exports.IconBlank = Blank;
exports.IconCheck = Check;
exports.IconCross = Cross;
exports.IconFundraising = Fundraising;
exports.IconGroups = Groups;
exports.IconHome = Home;
exports.IconIdentity = Identity;
exports.IconNotifications = Notifications;
exports.IconPermissions = Permissions;
exports.IconRemove = Remove;
exports.IconSettings = Settings;
exports.IconShare = Share;
exports.IconTime = Time;
exports.IconWallet = Wallet;
exports.theme = theme;
exports.themeDark = themeDark;
exports.brand = brand;
exports.colors = colors;
exports.noop = noop;
exports.devOnly = devOnly;
exports.log = log;
exports.warn = warn;
exports.difference = difference;
exports.formatHtmlDatetime = formatHtmlDatetime;
exports.formatIntegerRange = formatIntegerRange;
exports.unselectable = unselectable;
exports.breakpoint = breakpoint;
exports.BreakPoint = BreakPoint;
exports.font = font;
exports.grid = grid;
exports.springs = springs;
exports.spring = spring;
exports.addressesEqual = addressesEqual;
exports.shortenAddress = shortenAddress;
exports.isAddress = isAddress;
exports.blockExplorerUrl = blockExplorerUrl;
exports.forwardProps = forwardProps;
exports.stylingProps = stylingProps;
exports.observe = observe;
exports.PublicUrl = PublicUrl;
exports.Redraw = Redraw;
exports.RedrawFromDate = RedrawFromDate;
exports.AppBar = AppBar;
exports.AppView = AppView;
exports.AragonApp = AragonApp;
exports.Badge = Badge;
exports.BadgeNumber = BadgeNumber;
exports.BaseStyles = BaseStyles$1;
exports.Button = Button;
exports.Card = StyledCard;
exports.CircleGraph = CircleGraph;
exports.ContextMenu = ContextMenu;
exports.ContextMenuItem = ContextMenuItem;
exports.Countdown = Countdown;
exports.DropDown = DropDown;
exports.EmptyStateCard = EmptyStateCard;
exports.Field = Field;
exports.IdentityBadge = IdentityBadge;
exports.Info = Info$1;
exports.NavigationBar = NavigationBar;
exports.RadioButton = RadioButton;
exports.RadioGroup = RadioGroup;
exports.RadioList = RadioList;
exports.SafeLink = SafeLink;
exports.SidePanel = SidePanel;
exports.SidePanelSeparator = SidePanelSeparator;
exports.SidePanelSplit = SidePanelSplit;
exports.Slider = Slider;
exports.TabBar = TabBar;
exports.Table = Table;
exports.TableCell = TableCell;
exports.TableHeader = TableHeader;
exports.TableRow = StyledTableRow;
exports.Text = Text;
exports.TextInput = TextInput;
//# sourceMappingURL=index.cjs.js.map
