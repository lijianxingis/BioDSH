var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "node_modules/react/cjs/react.production.min.js"(exports) {
    "use strict";
    var l = Symbol.for("react.element");
    var n = Symbol.for("react.portal");
    var p = Symbol.for("react.fragment");
    var q = Symbol.for("react.strict_mode");
    var r = Symbol.for("react.profiler");
    var t = Symbol.for("react.provider");
    var u = Symbol.for("react.context");
    var v = Symbol.for("react.forward_ref");
    var w = Symbol.for("react.suspense");
    var x = Symbol.for("react.memo");
    var y = Symbol.for("react.lazy");
    var z = Symbol.iterator;
    function A(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z && a[z] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } };
    var C = Object.assign;
    var D = {};
    function E(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    E.prototype.isReactComponent = {};
    E.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E.prototype;
    function G(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D;
      this.updater = e || B;
    }
    var H = G.prototype = new F();
    H.constructor = G;
    C(H, E.prototype);
    H.isPureReactComponent = true;
    var I = Array.isArray;
    var J = Object.prototype.hasOwnProperty;
    var K = { current: null };
    var L = { key: true, ref: true, __self: true, __source: true };
    function M(a, b, e) {
      var d, c = {}, k = null, h = null;
      if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
        c.children = f;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
    }
    function N(a, b) {
      return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P = /\/+/g;
    function Q(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R(a, b, e, d, c) {
      var k = typeof a;
      if ("undefined" === k || "boolean" === k) a = null;
      var h = false;
      if (null === a) h = true;
      else switch (k) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h = true;
          }
      }
      if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
      h = 0;
      d = "" === d ? "." : d + ":";
      if (I(a)) for (var g = 0; g < a.length; g++) {
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
      }
      else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
      else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h;
    }
    function S(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U = { current: null };
    var V = { transition: null };
    var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    exports.Children = { map: S, forEach: function(a, b, e) {
      S(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    exports.Component = E;
    exports.Fragment = p;
    exports.Profiler = r;
    exports.PureComponent = G;
    exports.StrictMode = q;
    exports.Suspense = w;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    exports.act = X;
    exports.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k = b.ref, h = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
      }
      var f = arguments.length - 2;
      if (1 === f) d.children = e;
      else if (1 < f) {
        g = Array(f);
        for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
        d.children = g;
      }
      return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
    };
    exports.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    exports.createElement = M;
    exports.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    exports.isValidElement = O;
    exports.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    exports.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    exports.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    exports.unstable_act = X;
    exports.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    exports.useContext = function(a) {
      return U.current.useContext(a);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    exports.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    exports.useId = function() {
      return U.current.useId();
    };
    exports.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    exports.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    exports.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    exports.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    exports.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    exports.useRef = function(a) {
      return U.current.useRef(a);
    };
    exports.useState = function(a) {
      return U.current.useState(a);
    };
    exports.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    exports.useTransition = function() {
      return U.current.useTransition();
    };
    exports.version = "18.3.1";
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_react_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/scheduler/cjs/scheduler.production.min.js
var require_scheduler_production_min = __commonJS({
  "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
    "use strict";
    function f(a, b) {
      var c = a.length;
      a.push(b);
      a: for (; 0 < c; ) {
        var d = c - 1 >>> 1, e = a[d];
        if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
        else break a;
      }
    }
    function h(a) {
      return 0 === a.length ? null : a[0];
    }
    function k(a) {
      if (0 === a.length) return null;
      var b = a[0], c = a.pop();
      if (c !== b) {
        a[0] = c;
        a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
          var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
          if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
          else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
          else break a;
        }
      }
      return b;
    }
    function g(a, b) {
      var c = a.sortIndex - b.sortIndex;
      return 0 !== c ? c : a.id - b.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      l = performance;
      exports.unstable_now = function() {
        return l.now();
      };
    } else {
      p = Date, q = p.now();
      exports.unstable_now = function() {
        return p.now() - q;
      };
    }
    var l;
    var p;
    var q;
    var r = [];
    var t = [];
    var u = 1;
    var v = null;
    var y = 3;
    var z = false;
    var A = false;
    var B = false;
    var D = "function" === typeof setTimeout ? setTimeout : null;
    var E = "function" === typeof clearTimeout ? clearTimeout : null;
    var F = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G(a) {
      for (var b = h(t); null !== b; ) {
        if (null === b.callback) k(t);
        else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
        else break;
        b = h(t);
      }
    }
    function H(a) {
      B = false;
      G(a);
      if (!A) if (null !== h(r)) A = true, I(J);
      else {
        var b = h(t);
        null !== b && K(H, b.startTime - a);
      }
    }
    function J(a, b) {
      A = false;
      B && (B = false, E(L), L = -1);
      z = true;
      var c = y;
      try {
        G(b);
        for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
          var d = v.callback;
          if ("function" === typeof d) {
            v.callback = null;
            y = v.priorityLevel;
            var e = d(v.expirationTime <= b);
            b = exports.unstable_now();
            "function" === typeof e ? v.callback = e : v === h(r) && k(r);
            G(b);
          } else k(r);
          v = h(r);
        }
        if (null !== v) var w = true;
        else {
          var m = h(t);
          null !== m && K(H, m.startTime - b);
          w = false;
        }
        return w;
      } finally {
        v = null, y = c, z = false;
      }
    }
    var N = false;
    var O = null;
    var L = -1;
    var P = 5;
    var Q = -1;
    function M() {
      return exports.unstable_now() - Q < P ? false : true;
    }
    function R() {
      if (null !== O) {
        var a = exports.unstable_now();
        Q = a;
        var b = true;
        try {
          b = O(true, a);
        } finally {
          b ? S() : (N = false, O = null);
        }
      } else N = false;
    }
    var S;
    if ("function" === typeof F) S = function() {
      F(R);
    };
    else if ("undefined" !== typeof MessageChannel) {
      T = new MessageChannel(), U = T.port2;
      T.port1.onmessage = R;
      S = function() {
        U.postMessage(null);
      };
    } else S = function() {
      D(R, 0);
    };
    var T;
    var U;
    function I(a) {
      O = a;
      N || (N = true, S());
    }
    function K(a, b) {
      L = D(function() {
        a(exports.unstable_now());
      }, b);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A || z || (A = true, I(J));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h(r);
    };
    exports.unstable_next = function(a) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var b = 3;
          break;
        default:
          b = y;
      }
      var c = y;
      y = b;
      try {
        return a();
      } finally {
        y = c;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c = y;
      y = a;
      try {
        return b();
      } finally {
        y = c;
      }
    };
    exports.unstable_scheduleCallback = function(a, b, c) {
      var d = exports.unstable_now();
      "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
      switch (a) {
        case 1:
          var e = -1;
          break;
        case 2:
          e = 250;
          break;
        case 5:
          e = 1073741823;
          break;
        case 4:
          e = 1e4;
          break;
        default:
          e = 5e3;
      }
      e = c + e;
      a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
      c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
      return a;
    };
    exports.unstable_shouldYield = M;
    exports.unstable_wrapCallback = function(a) {
      var b = y;
      return function() {
        var c = y;
        y = b;
        try {
          return a.apply(this, arguments);
        } finally {
          y = c;
        }
      };
    };
  }
});

// node_modules/scheduler/index.js
var require_scheduler = __commonJS({
  "node_modules/scheduler/index.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_scheduler_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom.production.min.js
var require_react_dom_production_min = __commonJS({
  "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
    "use strict";
    var aa = require_react();
    var ca = require_scheduler();
    function p(a) {
      for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
      return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var da = /* @__PURE__ */ new Set();
    var ea = {};
    function fa(a, b) {
      ha(a, b);
      ha(a + "Capture", b);
    }
    function ha(a, b) {
      ea[a] = b;
      for (a = 0; a < b.length; a++) da.add(b[a]);
    }
    var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
    var ja = Object.prototype.hasOwnProperty;
    var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
    var la = {};
    var ma = {};
    function oa(a) {
      if (ja.call(ma, a)) return true;
      if (ja.call(la, a)) return false;
      if (ka.test(a)) return ma[a] = true;
      la[a] = true;
      return false;
    }
    function pa(a, b, c, d) {
      if (null !== c && 0 === c.type) return false;
      switch (typeof b) {
        case "function":
        case "symbol":
          return true;
        case "boolean":
          if (d) return false;
          if (null !== c) return !c.acceptsBooleans;
          a = a.toLowerCase().slice(0, 5);
          return "data-" !== a && "aria-" !== a;
        default:
          return false;
      }
    }
    function qa(a, b, c, d) {
      if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
      if (d) return false;
      if (null !== c) switch (c.type) {
        case 3:
          return !b;
        case 4:
          return false === b;
        case 5:
          return isNaN(b);
        case 6:
          return isNaN(b) || 1 > b;
      }
      return false;
    }
    function v(a, b, c, d, e, f, g) {
      this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
      this.attributeName = d;
      this.attributeNamespace = e;
      this.mustUseProperty = c;
      this.propertyName = a;
      this.type = b;
      this.sanitizeURL = f;
      this.removeEmptyString = g;
    }
    var z = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      z[a] = new v(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      z[b] = new v(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      z[a] = new v(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      z[a] = new v(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      z[a] = new v(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      z[a] = new v(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
    });
    var ra = /[\-:]([a-z])/g;
    function sa(a) {
      return a[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ra,
        sa
      );
      z[b] = new v(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
    });
    z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
    });
    function ta(a, b, c, d) {
      var e = z.hasOwnProperty(b) ? z[b] : null;
      if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
    }
    var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    var va = Symbol.for("react.element");
    var wa = Symbol.for("react.portal");
    var ya = Symbol.for("react.fragment");
    var za = Symbol.for("react.strict_mode");
    var Aa = Symbol.for("react.profiler");
    var Ba = Symbol.for("react.provider");
    var Ca = Symbol.for("react.context");
    var Da = Symbol.for("react.forward_ref");
    var Ea = Symbol.for("react.suspense");
    var Fa = Symbol.for("react.suspense_list");
    var Ga = Symbol.for("react.memo");
    var Ha = Symbol.for("react.lazy");
    Symbol.for("react.scope");
    Symbol.for("react.debug_trace_mode");
    var Ia = Symbol.for("react.offscreen");
    Symbol.for("react.legacy_hidden");
    Symbol.for("react.cache");
    Symbol.for("react.tracing_marker");
    var Ja = Symbol.iterator;
    function Ka(a) {
      if (null === a || "object" !== typeof a) return null;
      a = Ja && a[Ja] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var A = Object.assign;
    var La;
    function Ma(a) {
      if (void 0 === La) try {
        throw Error();
      } catch (c) {
        var b = c.stack.trim().match(/\n( *(at )?)/);
        La = b && b[1] || "";
      }
      return "\n" + La + a;
    }
    var Na = false;
    function Oa(a, b) {
      if (!a || Na) return "";
      Na = true;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        if (b) if (b = function() {
          throw Error();
        }, Object.defineProperty(b.prototype, "props", { set: function() {
          throw Error();
        } }), "object" === typeof Reflect && Reflect.construct) {
          try {
            Reflect.construct(b, []);
          } catch (l) {
            var d = l;
          }
          Reflect.construct(a, [], b);
        } else {
          try {
            b.call();
          } catch (l) {
            d = l;
          }
          a.call(b.prototype);
        }
        else {
          try {
            throw Error();
          } catch (l) {
            d = l;
          }
          a();
        }
      } catch (l) {
        if (l && d && "string" === typeof l.stack) {
          for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
          for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
            if (1 !== g || 1 !== h) {
              do
                if (g--, h--, 0 > h || e[g] !== f[h]) {
                  var k = "\n" + e[g].replace(" at new ", " at ");
                  a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                  return k;
                }
              while (1 <= g && 0 <= h);
            }
            break;
          }
        }
      } finally {
        Na = false, Error.prepareStackTrace = c;
      }
      return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
    }
    function Pa(a) {
      switch (a.tag) {
        case 5:
          return Ma(a.type);
        case 16:
          return Ma("Lazy");
        case 13:
          return Ma("Suspense");
        case 19:
          return Ma("SuspenseList");
        case 0:
        case 2:
        case 15:
          return a = Oa(a.type, false), a;
        case 11:
          return a = Oa(a.type.render, false), a;
        case 1:
          return a = Oa(a.type, true), a;
        default:
          return "";
      }
    }
    function Qa(a) {
      if (null == a) return null;
      if ("function" === typeof a) return a.displayName || a.name || null;
      if ("string" === typeof a) return a;
      switch (a) {
        case ya:
          return "Fragment";
        case wa:
          return "Portal";
        case Aa:
          return "Profiler";
        case za:
          return "StrictMode";
        case Ea:
          return "Suspense";
        case Fa:
          return "SuspenseList";
      }
      if ("object" === typeof a) switch (a.$$typeof) {
        case Ca:
          return (a.displayName || "Context") + ".Consumer";
        case Ba:
          return (a._context.displayName || "Context") + ".Provider";
        case Da:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case Ga:
          return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
        case Ha:
          b = a._payload;
          a = a._init;
          try {
            return Qa(a(b));
          } catch (c) {
          }
      }
      return null;
    }
    function Ra(a) {
      var b = a.type;
      switch (a.tag) {
        case 24:
          return "Cache";
        case 9:
          return (b.displayName || "Context") + ".Consumer";
        case 10:
          return (b._context.displayName || "Context") + ".Provider";
        case 18:
          return "DehydratedFragment";
        case 11:
          return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 5:
          return b;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return Qa(b);
        case 8:
          return b === za ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
          if ("function" === typeof b) return b.displayName || b.name || null;
          if ("string" === typeof b) return b;
      }
      return null;
    }
    function Sa(a) {
      switch (typeof a) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function Ta(a) {
      var b = a.type;
      return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
    }
    function Ua(a) {
      var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
      if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
        var e = c.get, f = c.set;
        Object.defineProperty(a, b, { configurable: true, get: function() {
          return e.call(this);
        }, set: function(a2) {
          d = "" + a2;
          f.call(this, a2);
        } });
        Object.defineProperty(a, b, { enumerable: c.enumerable });
        return { getValue: function() {
          return d;
        }, setValue: function(a2) {
          d = "" + a2;
        }, stopTracking: function() {
          a._valueTracker = null;
          delete a[b];
        } };
      }
    }
    function Va(a) {
      a._valueTracker || (a._valueTracker = Ua(a));
    }
    function Wa(a) {
      if (!a) return false;
      var b = a._valueTracker;
      if (!b) return true;
      var c = b.getValue();
      var d = "";
      a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
      a = d;
      return a !== c ? (b.setValue(a), true) : false;
    }
    function Xa(a) {
      a = a || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof a) return null;
      try {
        return a.activeElement || a.body;
      } catch (b) {
        return a.body;
      }
    }
    function Ya(a, b) {
      var c = b.checked;
      return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
    }
    function Za(a, b) {
      var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
      c = Sa(null != b.value ? b.value : c);
      a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
    }
    function ab(a, b) {
      b = b.checked;
      null != b && ta(a, "checked", b, false);
    }
    function bb(a, b) {
      ab(a, b);
      var c = Sa(b.value), d = b.type;
      if (null != c) if ("number" === d) {
        if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
      } else a.value !== "" + c && (a.value = "" + c);
      else if ("submit" === d || "reset" === d) {
        a.removeAttribute("value");
        return;
      }
      b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
      null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
    }
    function db(a, b, c) {
      if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
        var d = b.type;
        if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
        b = "" + a._wrapperState.initialValue;
        c || b === a.value || (a.value = b);
        a.defaultValue = b;
      }
      c = a.name;
      "" !== c && (a.name = "");
      a.defaultChecked = !!a._wrapperState.initialChecked;
      "" !== c && (a.name = c);
    }
    function cb(a, b, c) {
      if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
    }
    var eb = Array.isArray;
    function fb(a, b, c, d) {
      a = a.options;
      if (b) {
        b = {};
        for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
        for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
      } else {
        c = "" + Sa(c);
        b = null;
        for (e = 0; e < a.length; e++) {
          if (a[e].value === c) {
            a[e].selected = true;
            d && (a[e].defaultSelected = true);
            return;
          }
          null !== b || a[e].disabled || (b = a[e]);
        }
        null !== b && (b.selected = true);
      }
    }
    function gb(a, b) {
      if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
      return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
    }
    function hb(a, b) {
      var c = b.value;
      if (null == c) {
        c = b.children;
        b = b.defaultValue;
        if (null != c) {
          if (null != b) throw Error(p(92));
          if (eb(c)) {
            if (1 < c.length) throw Error(p(93));
            c = c[0];
          }
          b = c;
        }
        null == b && (b = "");
        c = b;
      }
      a._wrapperState = { initialValue: Sa(c) };
    }
    function ib(a, b) {
      var c = Sa(b.value), d = Sa(b.defaultValue);
      null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
      null != d && (a.defaultValue = "" + d);
    }
    function jb(a) {
      var b = a.textContent;
      b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
    }
    function kb(a) {
      switch (a) {
        case "svg":
          return "http://www.w3.org/2000/svg";
        case "math":
          return "http://www.w3.org/1998/Math/MathML";
        default:
          return "http://www.w3.org/1999/xhtml";
      }
    }
    function lb(a, b) {
      return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
    }
    var mb;
    var nb = (function(a) {
      return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
        MSApp.execUnsafeLocalFunction(function() {
          return a(b, c, d, e);
        });
      } : a;
    })(function(a, b) {
      if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
      else {
        mb = mb || document.createElement("div");
        mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
        for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
        for (; b.firstChild; ) a.appendChild(b.firstChild);
      }
    });
    function ob(a, b) {
      if (b) {
        var c = a.firstChild;
        if (c && c === a.lastChild && 3 === c.nodeType) {
          c.nodeValue = b;
          return;
        }
      }
      a.textContent = b;
    }
    var pb = {
      animationIterationCount: true,
      aspectRatio: true,
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
      gridArea: true,
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
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    var qb = ["Webkit", "ms", "Moz", "O"];
    Object.keys(pb).forEach(function(a) {
      qb.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        pb[b] = pb[a];
      });
    });
    function rb(a, b, c) {
      return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
    }
    function sb(a, b) {
      a = a.style;
      for (var c in b) if (b.hasOwnProperty(c)) {
        var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
        "float" === c && (c = "cssFloat");
        d ? a.setProperty(c, e) : a[c] = e;
      }
    }
    var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
    function ub(a, b) {
      if (b) {
        if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
        if (null != b.dangerouslySetInnerHTML) {
          if (null != b.children) throw Error(p(60));
          if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
        }
        if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
      }
    }
    function vb(a, b) {
      if (-1 === a.indexOf("-")) return "string" === typeof b.is;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var wb = null;
    function xb(a) {
      a = a.target || a.srcElement || window;
      a.correspondingUseElement && (a = a.correspondingUseElement);
      return 3 === a.nodeType ? a.parentNode : a;
    }
    var yb = null;
    var zb = null;
    var Ab = null;
    function Bb(a) {
      if (a = Cb(a)) {
        if ("function" !== typeof yb) throw Error(p(280));
        var b = a.stateNode;
        b && (b = Db(b), yb(a.stateNode, a.type, b));
      }
    }
    function Eb(a) {
      zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
    }
    function Fb() {
      if (zb) {
        var a = zb, b = Ab;
        Ab = zb = null;
        Bb(a);
        if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
      }
    }
    function Gb(a, b) {
      return a(b);
    }
    function Hb() {
    }
    var Ib = false;
    function Jb(a, b, c) {
      if (Ib) return a(b, c);
      Ib = true;
      try {
        return Gb(a, b, c);
      } finally {
        if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
      }
    }
    function Kb(a, b) {
      var c = a.stateNode;
      if (null === c) return null;
      var d = Db(c);
      if (null === d) return null;
      c = d[b];
      a: switch (b) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
          a = !d;
          break a;
        default:
          a = false;
      }
      if (a) return null;
      if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
      return c;
    }
    var Lb = false;
    if (ia) try {
      Mb = {};
      Object.defineProperty(Mb, "passive", { get: function() {
        Lb = true;
      } });
      window.addEventListener("test", Mb, Mb);
      window.removeEventListener("test", Mb, Mb);
    } catch (a) {
      Lb = false;
    }
    var Mb;
    function Nb(a, b, c, d, e, f, g, h, k) {
      var l = Array.prototype.slice.call(arguments, 3);
      try {
        b.apply(c, l);
      } catch (m) {
        this.onError(m);
      }
    }
    var Ob = false;
    var Pb = null;
    var Qb = false;
    var Rb = null;
    var Sb = { onError: function(a) {
      Ob = true;
      Pb = a;
    } };
    function Tb(a, b, c, d, e, f, g, h, k) {
      Ob = false;
      Pb = null;
      Nb.apply(Sb, arguments);
    }
    function Ub(a, b, c, d, e, f, g, h, k) {
      Tb.apply(this, arguments);
      if (Ob) {
        if (Ob) {
          var l = Pb;
          Ob = false;
          Pb = null;
        } else throw Error(p(198));
        Qb || (Qb = true, Rb = l);
      }
    }
    function Vb(a) {
      var b = a, c = a;
      if (a.alternate) for (; b.return; ) b = b.return;
      else {
        a = b;
        do
          b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
        while (a);
      }
      return 3 === b.tag ? c : null;
    }
    function Wb(a) {
      if (13 === a.tag) {
        var b = a.memoizedState;
        null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
        if (null !== b) return b.dehydrated;
      }
      return null;
    }
    function Xb(a) {
      if (Vb(a) !== a) throw Error(p(188));
    }
    function Yb(a) {
      var b = a.alternate;
      if (!b) {
        b = Vb(a);
        if (null === b) throw Error(p(188));
        return b !== a ? null : a;
      }
      for (var c = a, d = b; ; ) {
        var e = c.return;
        if (null === e) break;
        var f = e.alternate;
        if (null === f) {
          d = e.return;
          if (null !== d) {
            c = d;
            continue;
          }
          break;
        }
        if (e.child === f.child) {
          for (f = e.child; f; ) {
            if (f === c) return Xb(e), a;
            if (f === d) return Xb(e), b;
            f = f.sibling;
          }
          throw Error(p(188));
        }
        if (c.return !== d.return) c = e, d = f;
        else {
          for (var g = false, h = e.child; h; ) {
            if (h === c) {
              g = true;
              c = e;
              d = f;
              break;
            }
            if (h === d) {
              g = true;
              d = e;
              c = f;
              break;
            }
            h = h.sibling;
          }
          if (!g) {
            for (h = f.child; h; ) {
              if (h === c) {
                g = true;
                c = f;
                d = e;
                break;
              }
              if (h === d) {
                g = true;
                d = f;
                c = e;
                break;
              }
              h = h.sibling;
            }
            if (!g) throw Error(p(189));
          }
        }
        if (c.alternate !== d) throw Error(p(190));
      }
      if (3 !== c.tag) throw Error(p(188));
      return c.stateNode.current === c ? a : b;
    }
    function Zb(a) {
      a = Yb(a);
      return null !== a ? $b(a) : null;
    }
    function $b(a) {
      if (5 === a.tag || 6 === a.tag) return a;
      for (a = a.child; null !== a; ) {
        var b = $b(a);
        if (null !== b) return b;
        a = a.sibling;
      }
      return null;
    }
    var ac = ca.unstable_scheduleCallback;
    var bc = ca.unstable_cancelCallback;
    var cc = ca.unstable_shouldYield;
    var dc = ca.unstable_requestPaint;
    var B = ca.unstable_now;
    var ec = ca.unstable_getCurrentPriorityLevel;
    var fc = ca.unstable_ImmediatePriority;
    var gc = ca.unstable_UserBlockingPriority;
    var hc = ca.unstable_NormalPriority;
    var ic = ca.unstable_LowPriority;
    var jc = ca.unstable_IdlePriority;
    var kc = null;
    var lc = null;
    function mc(a) {
      if (lc && "function" === typeof lc.onCommitFiberRoot) try {
        lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
      } catch (b) {
      }
    }
    var oc = Math.clz32 ? Math.clz32 : nc;
    var pc = Math.log;
    var qc = Math.LN2;
    function nc(a) {
      a >>>= 0;
      return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
    }
    var rc = 64;
    var sc = 4194304;
    function tc(a) {
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return a & 130023424;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 1073741824;
        default:
          return a;
      }
    }
    function uc(a, b) {
      var c = a.pendingLanes;
      if (0 === c) return 0;
      var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
      if (0 !== g) {
        var h = g & ~e;
        0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
      } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
      if (0 === d) return 0;
      if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
      0 !== (d & 4) && (d |= c & 16);
      b = a.entangledLanes;
      if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
      return d;
    }
    function vc(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 4:
          return b + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return b + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function wc(a, b) {
      for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
        var g = 31 - oc(f), h = 1 << g, k = e[g];
        if (-1 === k) {
          if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
        } else k <= b && (a.expiredLanes |= h);
        f &= ~h;
      }
    }
    function xc(a) {
      a = a.pendingLanes & -1073741825;
      return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
    }
    function yc() {
      var a = rc;
      rc <<= 1;
      0 === (rc & 4194240) && (rc = 64);
      return a;
    }
    function zc(a) {
      for (var b = [], c = 0; 31 > c; c++) b.push(a);
      return b;
    }
    function Ac(a, b, c) {
      a.pendingLanes |= b;
      536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
      a = a.eventTimes;
      b = 31 - oc(b);
      a[b] = c;
    }
    function Bc(a, b) {
      var c = a.pendingLanes & ~b;
      a.pendingLanes = b;
      a.suspendedLanes = 0;
      a.pingedLanes = 0;
      a.expiredLanes &= b;
      a.mutableReadLanes &= b;
      a.entangledLanes &= b;
      b = a.entanglements;
      var d = a.eventTimes;
      for (a = a.expirationTimes; 0 < c; ) {
        var e = 31 - oc(c), f = 1 << e;
        b[e] = 0;
        d[e] = -1;
        a[e] = -1;
        c &= ~f;
      }
    }
    function Cc(a, b) {
      var c = a.entangledLanes |= b;
      for (a = a.entanglements; c; ) {
        var d = 31 - oc(c), e = 1 << d;
        e & b | a[d] & b && (a[d] |= b);
        c &= ~e;
      }
    }
    var C = 0;
    function Dc(a) {
      a &= -a;
      return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
    }
    var Ec;
    var Fc;
    var Gc;
    var Hc;
    var Ic;
    var Jc = false;
    var Kc = [];
    var Lc = null;
    var Mc = null;
    var Nc = null;
    var Oc = /* @__PURE__ */ new Map();
    var Pc = /* @__PURE__ */ new Map();
    var Qc = [];
    var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function Sc(a, b) {
      switch (a) {
        case "focusin":
        case "focusout":
          Lc = null;
          break;
        case "dragenter":
        case "dragleave":
          Mc = null;
          break;
        case "mouseover":
        case "mouseout":
          Nc = null;
          break;
        case "pointerover":
        case "pointerout":
          Oc.delete(b.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Pc.delete(b.pointerId);
      }
    }
    function Tc(a, b, c, d, e, f) {
      if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
      a.eventSystemFlags |= d;
      b = a.targetContainers;
      null !== e && -1 === b.indexOf(e) && b.push(e);
      return a;
    }
    function Uc(a, b, c, d, e) {
      switch (b) {
        case "focusin":
          return Lc = Tc(Lc, a, b, c, d, e), true;
        case "dragenter":
          return Mc = Tc(Mc, a, b, c, d, e), true;
        case "mouseover":
          return Nc = Tc(Nc, a, b, c, d, e), true;
        case "pointerover":
          var f = e.pointerId;
          Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
          return true;
        case "gotpointercapture":
          return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
      }
      return false;
    }
    function Vc(a) {
      var b = Wc(a.target);
      if (null !== b) {
        var c = Vb(b);
        if (null !== c) {
          if (b = c.tag, 13 === b) {
            if (b = Wb(c), null !== b) {
              a.blockedOn = b;
              Ic(a.priority, function() {
                Gc(c);
              });
              return;
            }
          } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
            a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function Xc(a) {
      if (null !== a.blockedOn) return false;
      for (var b = a.targetContainers; 0 < b.length; ) {
        var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
        if (null === c) {
          c = a.nativeEvent;
          var d = new c.constructor(c.type, c);
          wb = d;
          c.target.dispatchEvent(d);
          wb = null;
        } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
        b.shift();
      }
      return true;
    }
    function Zc(a, b, c) {
      Xc(a) && c.delete(b);
    }
    function $c() {
      Jc = false;
      null !== Lc && Xc(Lc) && (Lc = null);
      null !== Mc && Xc(Mc) && (Mc = null);
      null !== Nc && Xc(Nc) && (Nc = null);
      Oc.forEach(Zc);
      Pc.forEach(Zc);
    }
    function ad(a, b) {
      a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
    }
    function bd(a) {
      function b(b2) {
        return ad(b2, a);
      }
      if (0 < Kc.length) {
        ad(Kc[0], a);
        for (var c = 1; c < Kc.length; c++) {
          var d = Kc[c];
          d.blockedOn === a && (d.blockedOn = null);
        }
      }
      null !== Lc && ad(Lc, a);
      null !== Mc && ad(Mc, a);
      null !== Nc && ad(Nc, a);
      Oc.forEach(b);
      Pc.forEach(b);
      for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
      for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
    }
    var cd = ua.ReactCurrentBatchConfig;
    var dd = true;
    function ed(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 1, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function gd(a, b, c, d) {
      var e = C, f = cd.transition;
      cd.transition = null;
      try {
        C = 4, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f;
      }
    }
    function fd(a, b, c, d) {
      if (dd) {
        var e = Yc(a, b, c, d);
        if (null === e) hd(a, b, d, id, c), Sc(a, d);
        else if (Uc(e, a, b, c, d)) d.stopPropagation();
        else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
          for (; null !== e; ) {
            var f = Cb(e);
            null !== f && Ec(f);
            f = Yc(a, b, c, d);
            null === f && hd(a, b, d, id, c);
            if (f === e) break;
            e = f;
          }
          null !== e && d.stopPropagation();
        } else hd(a, b, d, null, c);
      }
    }
    var id = null;
    function Yc(a, b, c, d) {
      id = null;
      a = xb(d);
      a = Wc(a);
      if (null !== a) if (b = Vb(a), null === b) a = null;
      else if (c = b.tag, 13 === c) {
        a = Wb(b);
        if (null !== a) return a;
        a = null;
      } else if (3 === c) {
        if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
        a = null;
      } else b !== a && (a = null);
      id = a;
      return null;
    }
    function jd(a) {
      switch (a) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 4;
        case "message":
          switch (ec()) {
            case fc:
              return 1;
            case gc:
              return 4;
            case hc:
            case ic:
              return 16;
            case jc:
              return 536870912;
            default:
              return 16;
          }
        default:
          return 16;
      }
    }
    var kd = null;
    var ld = null;
    var md = null;
    function nd() {
      if (md) return md;
      var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
      for (a = 0; a < c && b[a] === e[a]; a++) ;
      var g = c - a;
      for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
      return md = e.slice(a, 1 < d ? 1 - d : void 0);
    }
    function od(a) {
      var b = a.keyCode;
      "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
      10 === a && (a = 13);
      return 32 <= a || 13 === a ? a : 0;
    }
    function pd() {
      return true;
    }
    function qd() {
      return false;
    }
    function rd(a) {
      function b(b2, d, e, f, g) {
        this._reactName = b2;
        this._targetInst = e;
        this.type = d;
        this.nativeEvent = f;
        this.target = g;
        this.currentTarget = null;
        for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
        this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
        this.isPropagationStopped = qd;
        return this;
      }
      A(b.prototype, { preventDefault: function() {
        this.defaultPrevented = true;
        var a2 = this.nativeEvent;
        a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
      }, stopPropagation: function() {
        var a2 = this.nativeEvent;
        a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
      }, persist: function() {
      }, isPersistent: pd });
      return b;
    }
    var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
      return a.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0 };
    var td = rd(sd);
    var ud = A({}, sd, { view: 0, detail: 0 });
    var vd = rd(ud);
    var wd;
    var xd;
    var yd;
    var Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
      return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
    }, movementX: function(a) {
      if ("movementX" in a) return a.movementX;
      a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
      return wd;
    }, movementY: function(a) {
      return "movementY" in a ? a.movementY : xd;
    } });
    var Bd = rd(Ad);
    var Cd = A({}, Ad, { dataTransfer: 0 });
    var Dd = rd(Cd);
    var Ed = A({}, ud, { relatedTarget: 0 });
    var Fd = rd(Ed);
    var Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
    var Hd = rd(Gd);
    var Id = A({}, sd, { clipboardData: function(a) {
      return "clipboardData" in a ? a.clipboardData : window.clipboardData;
    } });
    var Jd = rd(Id);
    var Kd = A({}, sd, { data: 0 });
    var Ld = rd(Kd);
    var Md = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    };
    var Nd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Pd(a) {
      var b = this.nativeEvent;
      return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
    }
    function zd() {
      return Pd;
    }
    var Qd = A({}, ud, { key: function(a) {
      if (a.key) {
        var b = Md[a.key] || a.key;
        if ("Unidentified" !== b) return b;
      }
      return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
      return "keypress" === a.type ? od(a) : 0;
    }, keyCode: function(a) {
      return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    }, which: function(a) {
      return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    } });
    var Rd = rd(Qd);
    var Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
    var Td = rd(Sd);
    var Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
    var Vd = rd(Ud);
    var Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
    var Xd = rd(Wd);
    var Yd = A({}, Ad, {
      deltaX: function(a) {
        return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
      },
      deltaY: function(a) {
        return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    });
    var Zd = rd(Yd);
    var $d = [9, 13, 27, 32];
    var ae = ia && "CompositionEvent" in window;
    var be = null;
    ia && "documentMode" in document && (be = document.documentMode);
    var ce = ia && "TextEvent" in window && !be;
    var de = ia && (!ae || be && 8 < be && 11 >= be);
    var ee = String.fromCharCode(32);
    var fe = false;
    function ge(a, b) {
      switch (a) {
        case "keyup":
          return -1 !== $d.indexOf(b.keyCode);
        case "keydown":
          return 229 !== b.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function he(a) {
      a = a.detail;
      return "object" === typeof a && "data" in a ? a.data : null;
    }
    var ie = false;
    function je(a, b) {
      switch (a) {
        case "compositionend":
          return he(b);
        case "keypress":
          if (32 !== b.which) return null;
          fe = true;
          return ee;
        case "textInput":
          return a = b.data, a === ee && fe ? null : a;
        default:
          return null;
      }
    }
    function ke(a, b) {
      if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
            if (b.char && 1 < b.char.length) return b.char;
            if (b.which) return String.fromCharCode(b.which);
          }
          return null;
        case "compositionend":
          return de && "ko" !== b.locale ? null : b.data;
        default:
          return null;
      }
    }
    var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
    function me(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
    }
    function ne(a, b, c, d) {
      Eb(d);
      b = oe(b, "onChange");
      0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
    }
    var pe = null;
    var qe = null;
    function re(a) {
      se(a, 0);
    }
    function te(a) {
      var b = ue(a);
      if (Wa(b)) return a;
    }
    function ve(a, b) {
      if ("change" === a) return b;
    }
    var we = false;
    if (ia) {
      if (ia) {
        ye = "oninput" in document;
        if (!ye) {
          ze = document.createElement("div");
          ze.setAttribute("oninput", "return;");
          ye = "function" === typeof ze.oninput;
        }
        xe = ye;
      } else xe = false;
      we = xe && (!document.documentMode || 9 < document.documentMode);
    }
    var xe;
    var ye;
    var ze;
    function Ae() {
      pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
    }
    function Be(a) {
      if ("value" === a.propertyName && te(qe)) {
        var b = [];
        ne(b, qe, a, xb(a));
        Jb(re, b);
      }
    }
    function Ce(a, b, c) {
      "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
    }
    function De(a) {
      if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
    }
    function Ee(a, b) {
      if ("click" === a) return te(b);
    }
    function Fe(a, b) {
      if ("input" === a || "change" === a) return te(b);
    }
    function Ge(a, b) {
      return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
    }
    var He = "function" === typeof Object.is ? Object.is : Ge;
    function Ie(a, b) {
      if (He(a, b)) return true;
      if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
      var c = Object.keys(a), d = Object.keys(b);
      if (c.length !== d.length) return false;
      for (d = 0; d < c.length; d++) {
        var e = c[d];
        if (!ja.call(b, e) || !He(a[e], b[e])) return false;
      }
      return true;
    }
    function Je(a) {
      for (; a && a.firstChild; ) a = a.firstChild;
      return a;
    }
    function Ke(a, b) {
      var c = Je(a);
      a = 0;
      for (var d; c; ) {
        if (3 === c.nodeType) {
          d = a + c.textContent.length;
          if (a <= b && d >= b) return { node: c, offset: b - a };
          a = d;
        }
        a: {
          for (; c; ) {
            if (c.nextSibling) {
              c = c.nextSibling;
              break a;
            }
            c = c.parentNode;
          }
          c = void 0;
        }
        c = Je(c);
      }
    }
    function Le(a, b) {
      return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
    }
    function Me() {
      for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
        try {
          var c = "string" === typeof b.contentWindow.location.href;
        } catch (d) {
          c = false;
        }
        if (c) a = b.contentWindow;
        else break;
        b = Xa(a.document);
      }
      return b;
    }
    function Ne(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
    }
    function Oe(a) {
      var b = Me(), c = a.focusedElem, d = a.selectionRange;
      if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
        if (null !== d && Ne(c)) {
          if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
          else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
            a = a.getSelection();
            var e = c.textContent.length, f = Math.min(d.start, e);
            d = void 0 === d.end ? f : Math.min(d.end, e);
            !a.extend && f > d && (e = d, d = f, f = e);
            e = Ke(c, f);
            var g = Ke(
              c,
              d
            );
            e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
          }
        }
        b = [];
        for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
        "function" === typeof c.focus && c.focus();
        for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
      }
    }
    var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
    var Qe = null;
    var Re = null;
    var Se = null;
    var Te = false;
    function Ue(a, b, c) {
      var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
      Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
    }
    function Ve(a, b) {
      var c = {};
      c[a.toLowerCase()] = b.toLowerCase();
      c["Webkit" + a] = "webkit" + b;
      c["Moz" + a] = "moz" + b;
      return c;
    }
    var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
    var Xe = {};
    var Ye = {};
    ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
    function Ze(a) {
      if (Xe[a]) return Xe[a];
      if (!We[a]) return a;
      var b = We[a], c;
      for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
      return a;
    }
    var $e = Ze("animationend");
    var af = Ze("animationiteration");
    var bf = Ze("animationstart");
    var cf = Ze("transitionend");
    var df = /* @__PURE__ */ new Map();
    var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ff(a, b) {
      df.set(a, b);
      fa(b, [a]);
    }
    for (gf = 0; gf < ef.length; gf++) {
      hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
      ff(jf, "on" + kf);
    }
    var hf;
    var jf;
    var kf;
    var gf;
    ff($e, "onAnimationEnd");
    ff(af, "onAnimationIteration");
    ff(bf, "onAnimationStart");
    ff("dblclick", "onDoubleClick");
    ff("focusin", "onFocus");
    ff("focusout", "onBlur");
    ff(cf, "onTransitionEnd");
    ha("onMouseEnter", ["mouseout", "mouseover"]);
    ha("onMouseLeave", ["mouseout", "mouseover"]);
    ha("onPointerEnter", ["pointerout", "pointerover"]);
    ha("onPointerLeave", ["pointerout", "pointerover"]);
    fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
    var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
    function nf(a, b, c) {
      var d = a.type || "unknown-event";
      a.currentTarget = c;
      Ub(d, b, void 0, a);
      a.currentTarget = null;
    }
    function se(a, b) {
      b = 0 !== (b & 4);
      for (var c = 0; c < a.length; c++) {
        var d = a[c], e = d.event;
        d = d.listeners;
        a: {
          var f = void 0;
          if (b) for (var g = d.length - 1; 0 <= g; g--) {
            var h = d[g], k = h.instance, l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
          else for (g = 0; g < d.length; g++) {
            h = d[g];
            k = h.instance;
            l = h.currentTarget;
            h = h.listener;
            if (k !== f && e.isPropagationStopped()) break a;
            nf(e, h, l);
            f = k;
          }
        }
      }
      if (Qb) throw a = Rb, Qb = false, Rb = null, a;
    }
    function D(a, b) {
      var c = b[of];
      void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
      var d = a + "__bubble";
      c.has(d) || (pf(b, a, 2, false), c.add(d));
    }
    function qf(a, b, c) {
      var d = 0;
      b && (d |= 4);
      pf(c, a, d, b);
    }
    var rf = "_reactListening" + Math.random().toString(36).slice(2);
    function sf(a) {
      if (!a[rf]) {
        a[rf] = true;
        da.forEach(function(b2) {
          "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
        });
        var b = 9 === a.nodeType ? a : a.ownerDocument;
        null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
      }
    }
    function pf(a, b, c, d) {
      switch (jd(b)) {
        case 1:
          var e = ed;
          break;
        case 4:
          e = gd;
          break;
        default:
          e = fd;
      }
      c = e.bind(null, b, c, a);
      e = void 0;
      !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
      d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
    }
    function hd(a, b, c, d, e) {
      var f = d;
      if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
        if (null === d) return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h = d.stateNode.containerInfo;
          if (h === e || 8 === h.nodeType && h.parentNode === e) break;
          if (4 === g) for (g = d.return; null !== g; ) {
            var k = g.tag;
            if (3 === k || 4 === k) {
              if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
            }
            g = g.return;
          }
          for (; null !== h; ) {
            g = Wc(h);
            if (null === g) return;
            k = g.tag;
            if (5 === k || 6 === k) {
              d = f = g;
              continue a;
            }
            h = h.parentNode;
          }
        }
        d = d.return;
      }
      Jb(function() {
        var d2 = f, e2 = xb(c), g2 = [];
        a: {
          var h2 = df.get(a);
          if (void 0 !== h2) {
            var k2 = td, n = a;
            switch (a) {
              case "keypress":
                if (0 === od(c)) break a;
              case "keydown":
              case "keyup":
                k2 = Rd;
                break;
              case "focusin":
                n = "focus";
                k2 = Fd;
                break;
              case "focusout":
                n = "blur";
                k2 = Fd;
                break;
              case "beforeblur":
              case "afterblur":
                k2 = Fd;
                break;
              case "click":
                if (2 === c.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                k2 = Bd;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                k2 = Dd;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                k2 = Vd;
                break;
              case $e:
              case af:
              case bf:
                k2 = Hd;
                break;
              case cf:
                k2 = Xd;
                break;
              case "scroll":
                k2 = vd;
                break;
              case "wheel":
                k2 = Zd;
                break;
              case "copy":
              case "cut":
              case "paste":
                k2 = Jd;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                k2 = Td;
            }
            var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
            t = [];
            for (var w = d2, u; null !== w; ) {
              u = w;
              var F = u.stateNode;
              5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
              if (J) break;
              w = w.return;
            }
            0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
          }
        }
        if (0 === (b & 7)) {
          a: {
            h2 = "mouseover" === a || "pointerover" === a;
            k2 = "mouseout" === a || "pointerout" === a;
            if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
            if (k2 || h2) {
              h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
              if (k2) {
                if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
              } else k2 = null, n = d2;
              if (k2 !== n) {
                t = Bd;
                F = "onMouseLeave";
                x = "onMouseEnter";
                w = "mouse";
                if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
                J = null == k2 ? h2 : ue(k2);
                u = null == n ? h2 : ue(n);
                h2 = new t(F, w + "leave", k2, c, e2);
                h2.target = J;
                h2.relatedTarget = u;
                F = null;
                Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
                J = F;
                if (k2 && n) b: {
                  t = k2;
                  x = n;
                  w = 0;
                  for (u = t; u; u = vf(u)) w++;
                  u = 0;
                  for (F = x; F; F = vf(F)) u++;
                  for (; 0 < w - u; ) t = vf(t), w--;
                  for (; 0 < u - w; ) x = vf(x), u--;
                  for (; w--; ) {
                    if (t === x || null !== x && t === x.alternate) break b;
                    t = vf(t);
                    x = vf(x);
                  }
                  t = null;
                }
                else t = null;
                null !== k2 && wf(g2, h2, k2, t, false);
                null !== n && null !== J && wf(g2, J, n, t, true);
              }
            }
          }
          a: {
            h2 = d2 ? ue(d2) : window;
            k2 = h2.nodeName && h2.nodeName.toLowerCase();
            if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
            else if (me(h2)) if (we) na = Fe;
            else {
              na = De;
              var xa = Ce;
            }
            else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
            if (na && (na = na(a, d2))) {
              ne(g2, na, c, e2);
              break a;
            }
            xa && xa(a, h2, d2);
            "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
          }
          xa = d2 ? ue(d2) : window;
          switch (a) {
            case "focusin":
              if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
              break;
            case "focusout":
              Se = Re = Qe = null;
              break;
            case "mousedown":
              Te = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Te = false;
              Ue(g2, c, e2);
              break;
            case "selectionchange":
              if (Pe) break;
            case "keydown":
            case "keyup":
              Ue(g2, c, e2);
          }
          var $a;
          if (ae) b: {
            switch (a) {
              case "compositionstart":
                var ba = "onCompositionStart";
                break b;
              case "compositionend":
                ba = "onCompositionEnd";
                break b;
              case "compositionupdate":
                ba = "onCompositionUpdate";
                break b;
            }
            ba = void 0;
          }
          else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
          ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
          if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
        }
        se(g2, b);
      });
    }
    function tf(a, b, c) {
      return { instance: a, listener: b, currentTarget: c };
    }
    function oe(a, b) {
      for (var c = b + "Capture", d = []; null !== a; ) {
        var e = a, f = e.stateNode;
        5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
        a = a.return;
      }
      return d;
    }
    function vf(a) {
      if (null === a) return null;
      do
        a = a.return;
      while (a && 5 !== a.tag);
      return a ? a : null;
    }
    function wf(a, b, c, d, e) {
      for (var f = b._reactName, g = []; null !== c && c !== d; ) {
        var h = c, k = h.alternate, l = h.stateNode;
        if (null !== k && k === d) break;
        5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
        c = c.return;
      }
      0 !== g.length && a.push({ event: b, listeners: g });
    }
    var xf = /\r\n?/g;
    var yf = /\u0000|\uFFFD/g;
    function zf(a) {
      return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
    }
    function Af(a, b, c) {
      b = zf(b);
      if (zf(a) !== b && c) throw Error(p(425));
    }
    function Bf() {
    }
    var Cf = null;
    var Df = null;
    function Ef(a, b) {
      return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
    }
    var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
    var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
    var Hf = "function" === typeof Promise ? Promise : void 0;
    var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
      return Hf.resolve(null).then(a).catch(If);
    } : Ff;
    function If(a) {
      setTimeout(function() {
        throw a;
      });
    }
    function Kf(a, b) {
      var c = b, d = 0;
      do {
        var e = c.nextSibling;
        a.removeChild(c);
        if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
          if (0 === d) {
            a.removeChild(e);
            bd(b);
            return;
          }
          d--;
        } else "$" !== c && "$?" !== c && "$!" !== c || d++;
        c = e;
      } while (c);
      bd(b);
    }
    function Lf(a) {
      for (; null != a; a = a.nextSibling) {
        var b = a.nodeType;
        if (1 === b || 3 === b) break;
        if (8 === b) {
          b = a.data;
          if ("$" === b || "$!" === b || "$?" === b) break;
          if ("/$" === b) return null;
        }
      }
      return a;
    }
    function Mf(a) {
      a = a.previousSibling;
      for (var b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("$" === c || "$!" === c || "$?" === c) {
            if (0 === b) return a;
            b--;
          } else "/$" === c && b++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    var Nf = Math.random().toString(36).slice(2);
    var Of = "__reactFiber$" + Nf;
    var Pf = "__reactProps$" + Nf;
    var uf = "__reactContainer$" + Nf;
    var of = "__reactEvents$" + Nf;
    var Qf = "__reactListeners$" + Nf;
    var Rf = "__reactHandles$" + Nf;
    function Wc(a) {
      var b = a[Of];
      if (b) return b;
      for (var c = a.parentNode; c; ) {
        if (b = c[uf] || c[Of]) {
          c = b.alternate;
          if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
            if (c = a[Of]) return c;
            a = Mf(a);
          }
          return b;
        }
        a = c;
        c = a.parentNode;
      }
      return null;
    }
    function Cb(a) {
      a = a[Of] || a[uf];
      return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
    }
    function ue(a) {
      if (5 === a.tag || 6 === a.tag) return a.stateNode;
      throw Error(p(33));
    }
    function Db(a) {
      return a[Pf] || null;
    }
    var Sf = [];
    var Tf = -1;
    function Uf(a) {
      return { current: a };
    }
    function E(a) {
      0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
    }
    function G(a, b) {
      Tf++;
      Sf[Tf] = a.current;
      a.current = b;
    }
    var Vf = {};
    var H = Uf(Vf);
    var Wf = Uf(false);
    var Xf = Vf;
    function Yf(a, b) {
      var c = a.type.contextTypes;
      if (!c) return Vf;
      var d = a.stateNode;
      if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
      var e = {}, f;
      for (f in c) e[f] = b[f];
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
      return e;
    }
    function Zf(a) {
      a = a.childContextTypes;
      return null !== a && void 0 !== a;
    }
    function $f() {
      E(Wf);
      E(H);
    }
    function ag(a, b, c) {
      if (H.current !== Vf) throw Error(p(168));
      G(H, b);
      G(Wf, c);
    }
    function bg(a, b, c) {
      var d = a.stateNode;
      b = b.childContextTypes;
      if ("function" !== typeof d.getChildContext) return c;
      d = d.getChildContext();
      for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
      return A({}, c, d);
    }
    function cg(a) {
      a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
      Xf = H.current;
      G(H, a);
      G(Wf, Wf.current);
      return true;
    }
    function dg(a, b, c) {
      var d = a.stateNode;
      if (!d) throw Error(p(169));
      c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
      G(Wf, c);
    }
    var eg = null;
    var fg = false;
    var gg = false;
    function hg(a) {
      null === eg ? eg = [a] : eg.push(a);
    }
    function ig(a) {
      fg = true;
      hg(a);
    }
    function jg() {
      if (!gg && null !== eg) {
        gg = true;
        var a = 0, b = C;
        try {
          var c = eg;
          for (C = 1; a < c.length; a++) {
            var d = c[a];
            do
              d = d(true);
            while (null !== d);
          }
          eg = null;
          fg = false;
        } catch (e) {
          throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
        } finally {
          C = b, gg = false;
        }
      }
      return null;
    }
    var kg = [];
    var lg = 0;
    var mg = null;
    var ng = 0;
    var og = [];
    var pg = 0;
    var qg = null;
    var rg = 1;
    var sg = "";
    function tg(a, b) {
      kg[lg++] = ng;
      kg[lg++] = mg;
      mg = a;
      ng = b;
    }
    function ug(a, b, c) {
      og[pg++] = rg;
      og[pg++] = sg;
      og[pg++] = qg;
      qg = a;
      var d = rg;
      a = sg;
      var e = 32 - oc(d) - 1;
      d &= ~(1 << e);
      c += 1;
      var f = 32 - oc(b) + e;
      if (30 < f) {
        var g = e - e % 5;
        f = (d & (1 << g) - 1).toString(32);
        d >>= g;
        e -= g;
        rg = 1 << 32 - oc(b) + e | c << e | d;
        sg = f + a;
      } else rg = 1 << f | c << e | d, sg = a;
    }
    function vg(a) {
      null !== a.return && (tg(a, 1), ug(a, 1, 0));
    }
    function wg(a) {
      for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
      for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
    }
    var xg = null;
    var yg = null;
    var I = false;
    var zg = null;
    function Ag(a, b) {
      var c = Bg(5, null, null, 0);
      c.elementType = "DELETED";
      c.stateNode = b;
      c.return = a;
      b = a.deletions;
      null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
    }
    function Cg(a, b) {
      switch (a.tag) {
        case 5:
          var c = a.type;
          b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
          return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
        case 6:
          return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
        case 13:
          return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
        default:
          return false;
      }
    }
    function Dg(a) {
      return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
    }
    function Eg(a) {
      if (I) {
        var b = yg;
        if (b) {
          var c = b;
          if (!Cg(a, b)) {
            if (Dg(a)) throw Error(p(418));
            b = Lf(c.nextSibling);
            var d = xg;
            b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
          }
        } else {
          if (Dg(a)) throw Error(p(418));
          a.flags = a.flags & -4097 | 2;
          I = false;
          xg = a;
        }
      }
    }
    function Fg(a) {
      for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
      xg = a;
    }
    function Gg(a) {
      if (a !== xg) return false;
      if (!I) return Fg(a), I = true, false;
      var b;
      (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
      if (b && (b = yg)) {
        if (Dg(a)) throw Hg(), Error(p(418));
        for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
      }
      Fg(a);
      if (13 === a.tag) {
        a = a.memoizedState;
        a = null !== a ? a.dehydrated : null;
        if (!a) throw Error(p(317));
        a: {
          a = a.nextSibling;
          for (b = 0; a; ) {
            if (8 === a.nodeType) {
              var c = a.data;
              if ("/$" === c) {
                if (0 === b) {
                  yg = Lf(a.nextSibling);
                  break a;
                }
                b--;
              } else "$" !== c && "$!" !== c && "$?" !== c || b++;
            }
            a = a.nextSibling;
          }
          yg = null;
        }
      } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
      return true;
    }
    function Hg() {
      for (var a = yg; a; ) a = Lf(a.nextSibling);
    }
    function Ig() {
      yg = xg = null;
      I = false;
    }
    function Jg(a) {
      null === zg ? zg = [a] : zg.push(a);
    }
    var Kg = ua.ReactCurrentBatchConfig;
    function Lg(a, b, c) {
      a = c.ref;
      if (null !== a && "function" !== typeof a && "object" !== typeof a) {
        if (c._owner) {
          c = c._owner;
          if (c) {
            if (1 !== c.tag) throw Error(p(309));
            var d = c.stateNode;
          }
          if (!d) throw Error(p(147, a));
          var e = d, f = "" + a;
          if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
          b = function(a2) {
            var b2 = e.refs;
            null === a2 ? delete b2[f] : b2[f] = a2;
          };
          b._stringRef = f;
          return b;
        }
        if ("string" !== typeof a) throw Error(p(284));
        if (!c._owner) throw Error(p(290, a));
      }
      return a;
    }
    function Mg(a, b) {
      a = Object.prototype.toString.call(b);
      throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
    }
    function Ng(a) {
      var b = a._init;
      return b(a._payload);
    }
    function Og(a) {
      function b(b2, c2) {
        if (a) {
          var d2 = b2.deletions;
          null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
        }
      }
      function c(c2, d2) {
        if (!a) return null;
        for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
        return null;
      }
      function d(a2, b2) {
        for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
        return a2;
      }
      function e(a2, b2) {
        a2 = Pg(a2, b2);
        a2.index = 0;
        a2.sibling = null;
        return a2;
      }
      function f(b2, c2, d2) {
        b2.index = d2;
        if (!a) return b2.flags |= 1048576, c2;
        d2 = b2.alternate;
        if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
        b2.flags |= 2;
        return c2;
      }
      function g(b2) {
        a && null === b2.alternate && (b2.flags |= 2);
        return b2;
      }
      function h(a2, b2, c2, d2) {
        if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function k(a2, b2, c2, d2) {
        var f2 = c2.type;
        if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
        if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
        d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
        d2.ref = Lg(a2, b2, c2);
        d2.return = a2;
        return d2;
      }
      function l(a2, b2, c2, d2) {
        if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2.children || []);
        b2.return = a2;
        return b2;
      }
      function m(a2, b2, c2, d2, f2) {
        if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function q(a2, b2, c2) {
        if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
        if ("object" === typeof b2 && null !== b2) {
          switch (b2.$$typeof) {
            case va:
              return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
            case wa:
              return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
            case Ha:
              var d2 = b2._init;
              return q(a2, d2(b2._payload), c2);
          }
          if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
          Mg(a2, b2);
        }
        return null;
      }
      function r(a2, b2, c2, d2) {
        var e2 = null !== b2 ? b2.key : null;
        if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
        if ("object" === typeof c2 && null !== c2) {
          switch (c2.$$typeof) {
            case va:
              return c2.key === e2 ? k(a2, b2, c2, d2) : null;
            case wa:
              return c2.key === e2 ? l(a2, b2, c2, d2) : null;
            case Ha:
              return e2 = c2._init, r(
                a2,
                b2,
                e2(c2._payload),
                d2
              );
          }
          if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
          Mg(a2, c2);
        }
        return null;
      }
      function y(a2, b2, c2, d2, e2) {
        if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
        if ("object" === typeof d2 && null !== d2) {
          switch (d2.$$typeof) {
            case va:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
            case wa:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
            case Ha:
              var f2 = d2._init;
              return y(a2, b2, c2, f2(d2._payload), e2);
          }
          if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
          Mg(b2, d2);
        }
        return null;
      }
      function n(e2, g2, h2, k2) {
        for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
          u.index > w ? (x = u, u = null) : x = u.sibling;
          var n2 = r(e2, u, h2[w], k2);
          if (null === n2) {
            null === u && (u = x);
            break;
          }
          a && u && null === n2.alternate && b(e2, u);
          g2 = f(n2, g2, w);
          null === m2 ? l2 = n2 : m2.sibling = n2;
          m2 = n2;
          u = x;
        }
        if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
        if (null === u) {
          for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
          I && tg(e2, w);
          return l2;
        }
        for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
        a && u.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function t(e2, g2, h2, k2) {
        var l2 = Ka(h2);
        if ("function" !== typeof l2) throw Error(p(150));
        h2 = l2.call(h2);
        if (null == h2) throw Error(p(151));
        for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
          m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
          var t2 = r(e2, m2, n2.value, k2);
          if (null === t2) {
            null === m2 && (m2 = x);
            break;
          }
          a && m2 && null === t2.alternate && b(e2, m2);
          g2 = f(t2, g2, w);
          null === u ? l2 = t2 : u.sibling = t2;
          u = t2;
          m2 = x;
        }
        if (n2.done) return c(
          e2,
          m2
        ), I && tg(e2, w), l2;
        if (null === m2) {
          for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
          I && tg(e2, w);
          return l2;
        }
        for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
        a && m2.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w);
        return l2;
      }
      function J(a2, d2, f2, h2) {
        "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
        if ("object" === typeof f2 && null !== f2) {
          switch (f2.$$typeof) {
            case va:
              a: {
                for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                  if (l2.key === k2) {
                    k2 = f2.type;
                    if (k2 === ya) {
                      if (7 === l2.tag) {
                        c(a2, l2.sibling);
                        d2 = e(l2, f2.props.children);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                    } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                      c(a2, l2.sibling);
                      d2 = e(l2, f2.props);
                      d2.ref = Lg(a2, l2, f2);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                    c(a2, l2);
                    break;
                  } else b(a2, l2);
                  l2 = l2.sibling;
                }
                f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
              }
              return g(a2);
            case wa:
              a: {
                for (l2 = f2.key; null !== d2; ) {
                  if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                    c(a2, d2.sibling);
                    d2 = e(d2, f2.children || []);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  } else {
                    c(a2, d2);
                    break;
                  }
                  else b(a2, d2);
                  d2 = d2.sibling;
                }
                d2 = Sg(f2, a2.mode, h2);
                d2.return = a2;
                a2 = d2;
              }
              return g(a2);
            case Ha:
              return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
          }
          if (eb(f2)) return n(a2, d2, f2, h2);
          if (Ka(f2)) return t(a2, d2, f2, h2);
          Mg(a2, f2);
        }
        return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
      }
      return J;
    }
    var Ug = Og(true);
    var Vg = Og(false);
    var Wg = Uf(null);
    var Xg = null;
    var Yg = null;
    var Zg = null;
    function $g() {
      Zg = Yg = Xg = null;
    }
    function ah(a) {
      var b = Wg.current;
      E(Wg);
      a._currentValue = b;
    }
    function bh(a, b, c) {
      for (; null !== a; ) {
        var d = a.alternate;
        (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
        if (a === c) break;
        a = a.return;
      }
    }
    function ch(a, b) {
      Xg = a;
      Zg = Yg = null;
      a = a.dependencies;
      null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
    }
    function eh(a) {
      var b = a._currentValue;
      if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
        if (null === Xg) throw Error(p(308));
        Yg = a;
        Xg.dependencies = { lanes: 0, firstContext: a };
      } else Yg = Yg.next = a;
      return b;
    }
    var fh = null;
    function gh(a) {
      null === fh ? fh = [a] : fh.push(a);
    }
    function hh(a, b, c, d) {
      var e = b.interleaved;
      null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
      b.interleaved = c;
      return ih(a, d);
    }
    function ih(a, b) {
      a.lanes |= b;
      var c = a.alternate;
      null !== c && (c.lanes |= b);
      c = a;
      for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
      return 3 === c.tag ? c.stateNode : null;
    }
    var jh = false;
    function kh(a) {
      a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
    }
    function lh(a, b) {
      a = a.updateQueue;
      b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
    }
    function mh(a, b) {
      return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
    }
    function nh(a, b, c) {
      var d = a.updateQueue;
      if (null === d) return null;
      d = d.shared;
      if (0 !== (K & 2)) {
        var e = d.pending;
        null === e ? b.next = b : (b.next = e.next, e.next = b);
        d.pending = b;
        return ih(a, c);
      }
      e = d.interleaved;
      null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
      d.interleaved = b;
      return ih(a, c);
    }
    function oh(a, b, c) {
      b = b.updateQueue;
      if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    function ph(a, b) {
      var c = a.updateQueue, d = a.alternate;
      if (null !== d && (d = d.updateQueue, c === d)) {
        var e = null, f = null;
        c = c.firstBaseUpdate;
        if (null !== c) {
          do {
            var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
            null === f ? e = f = g : f = f.next = g;
            c = c.next;
          } while (null !== c);
          null === f ? e = f = b : f = f.next = b;
        } else e = f = b;
        c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
        a.updateQueue = c;
        return;
      }
      a = c.lastBaseUpdate;
      null === a ? c.firstBaseUpdate = b : a.next = b;
      c.lastBaseUpdate = b;
    }
    function qh(a, b, c, d) {
      var e = a.updateQueue;
      jh = false;
      var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
      if (null !== h) {
        e.shared.pending = null;
        var k = h, l = k.next;
        k.next = null;
        null === g ? f = l : g.next = l;
        g = k;
        var m = a.alternate;
        null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
      }
      if (null !== f) {
        var q = e.baseState;
        g = 0;
        m = l = k = null;
        h = f;
        do {
          var r = h.lane, y = h.eventTime;
          if ((d & r) === r) {
            null !== m && (m = m.next = {
              eventTime: y,
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            });
            a: {
              var n = a, t = h;
              r = b;
              y = c;
              switch (t.tag) {
                case 1:
                  n = t.payload;
                  if ("function" === typeof n) {
                    q = n.call(y, q, r);
                    break a;
                  }
                  q = n;
                  break a;
                case 3:
                  n.flags = n.flags & -65537 | 128;
                case 0:
                  n = t.payload;
                  r = "function" === typeof n ? n.call(y, q, r) : n;
                  if (null === r || void 0 === r) break a;
                  q = A({}, q, r);
                  break a;
                case 2:
                  jh = true;
              }
            }
            null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
          } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
          h = h.next;
          if (null === h) if (h = e.shared.pending, null === h) break;
          else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
        } while (1);
        null === m && (k = q);
        e.baseState = k;
        e.firstBaseUpdate = l;
        e.lastBaseUpdate = m;
        b = e.shared.interleaved;
        if (null !== b) {
          e = b;
          do
            g |= e.lane, e = e.next;
          while (e !== b);
        } else null === f && (e.shared.lanes = 0);
        rh |= g;
        a.lanes = g;
        a.memoizedState = q;
      }
    }
    function sh(a, b, c) {
      a = b.effects;
      b.effects = null;
      if (null !== a) for (b = 0; b < a.length; b++) {
        var d = a[b], e = d.callback;
        if (null !== e) {
          d.callback = null;
          d = c;
          if ("function" !== typeof e) throw Error(p(191, e));
          e.call(d);
        }
      }
    }
    var th = {};
    var uh = Uf(th);
    var vh = Uf(th);
    var wh = Uf(th);
    function xh(a) {
      if (a === th) throw Error(p(174));
      return a;
    }
    function yh(a, b) {
      G(wh, b);
      G(vh, a);
      G(uh, th);
      a = b.nodeType;
      switch (a) {
        case 9:
        case 11:
          b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
          break;
        default:
          a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
      }
      E(uh);
      G(uh, b);
    }
    function zh() {
      E(uh);
      E(vh);
      E(wh);
    }
    function Ah(a) {
      xh(wh.current);
      var b = xh(uh.current);
      var c = lb(b, a.type);
      b !== c && (G(vh, a), G(uh, c));
    }
    function Bh(a) {
      vh.current === a && (E(uh), E(vh));
    }
    var L = Uf(0);
    function Ch(a) {
      for (var b = a; null !== b; ) {
        if (13 === b.tag) {
          var c = b.memoizedState;
          if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
        } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
          if (0 !== (b.flags & 128)) return b;
        } else if (null !== b.child) {
          b.child.return = b;
          b = b.child;
          continue;
        }
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return null;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
      return null;
    }
    var Dh = [];
    function Eh() {
      for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
      Dh.length = 0;
    }
    var Fh = ua.ReactCurrentDispatcher;
    var Gh = ua.ReactCurrentBatchConfig;
    var Hh = 0;
    var M = null;
    var N = null;
    var O = null;
    var Ih = false;
    var Jh = false;
    var Kh = 0;
    var Lh = 0;
    function P() {
      throw Error(p(321));
    }
    function Mh(a, b) {
      if (null === b) return false;
      for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
      return true;
    }
    function Nh(a, b, c, d, e, f) {
      Hh = f;
      M = b;
      b.memoizedState = null;
      b.updateQueue = null;
      b.lanes = 0;
      Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
      a = c(d, e);
      if (Jh) {
        f = 0;
        do {
          Jh = false;
          Kh = 0;
          if (25 <= f) throw Error(p(301));
          f += 1;
          O = N = null;
          b.updateQueue = null;
          Fh.current = Qh;
          a = c(d, e);
        } while (Jh);
      }
      Fh.current = Rh;
      b = null !== N && null !== N.next;
      Hh = 0;
      O = N = M = null;
      Ih = false;
      if (b) throw Error(p(300));
      return a;
    }
    function Sh() {
      var a = 0 !== Kh;
      Kh = 0;
      return a;
    }
    function Th() {
      var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
      return O;
    }
    function Uh() {
      if (null === N) {
        var a = M.alternate;
        a = null !== a ? a.memoizedState : null;
      } else a = N.next;
      var b = null === O ? M.memoizedState : O.next;
      if (null !== b) O = b, N = a;
      else {
        if (null === a) throw Error(p(310));
        N = a;
        a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
      }
      return O;
    }
    function Vh(a, b) {
      return "function" === typeof b ? b(a) : b;
    }
    function Wh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = N, e = d.baseQueue, f = c.pending;
      if (null !== f) {
        if (null !== e) {
          var g = e.next;
          e.next = f.next;
          f.next = g;
        }
        d.baseQueue = e = f;
        c.pending = null;
      }
      if (null !== e) {
        f = e.next;
        d = d.baseState;
        var h = g = null, k = null, l = f;
        do {
          var m = l.lane;
          if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
          else {
            var q = {
              lane: m,
              action: l.action,
              hasEagerState: l.hasEagerState,
              eagerState: l.eagerState,
              next: null
            };
            null === k ? (h = k = q, g = d) : k = k.next = q;
            M.lanes |= m;
            rh |= m;
          }
          l = l.next;
        } while (null !== l && l !== f);
        null === k ? g = d : k.next = h;
        He(d, b.memoizedState) || (dh = true);
        b.memoizedState = d;
        b.baseState = g;
        b.baseQueue = k;
        c.lastRenderedState = d;
      }
      a = c.interleaved;
      if (null !== a) {
        e = a;
        do
          f = e.lane, M.lanes |= f, rh |= f, e = e.next;
        while (e !== a);
      } else null === e && (c.lanes = 0);
      return [b.memoizedState, c.dispatch];
    }
    function Xh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = c.dispatch, e = c.pending, f = b.memoizedState;
      if (null !== e) {
        c.pending = null;
        var g = e = e.next;
        do
          f = a(f, g.action), g = g.next;
        while (g !== e);
        He(f, b.memoizedState) || (dh = true);
        b.memoizedState = f;
        null === b.baseQueue && (b.baseState = f);
        c.lastRenderedState = f;
      }
      return [f, d];
    }
    function Yh() {
    }
    function Zh(a, b) {
      var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
      f && (d.memoizedState = e, dh = true);
      d = d.queue;
      $h(ai.bind(null, c, d, a), [a]);
      if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
        c.flags |= 2048;
        bi(9, ci.bind(null, c, d, e, b), void 0, null);
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(c, b, e);
      }
      return e;
    }
    function di(a, b, c) {
      a.flags |= 16384;
      a = { getSnapshot: b, value: c };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
    }
    function ci(a, b, c, d) {
      b.value = c;
      b.getSnapshot = d;
      ei(b) && fi(a);
    }
    function ai(a, b, c) {
      return c(function() {
        ei(b) && fi(a);
      });
    }
    function ei(a) {
      var b = a.getSnapshot;
      a = a.value;
      try {
        var c = b();
        return !He(a, c);
      } catch (d) {
        return true;
      }
    }
    function fi(a) {
      var b = ih(a, 1);
      null !== b && gi(b, a, 1, -1);
    }
    function hi(a) {
      var b = Th();
      "function" === typeof a && (a = a());
      b.memoizedState = b.baseState = a;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
      b.queue = a;
      a = a.dispatch = ii.bind(null, M, a);
      return [b.memoizedState, a];
    }
    function bi(a, b, c, d) {
      a = { tag: a, create: b, destroy: c, deps: d, next: null };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
      return a;
    }
    function ji() {
      return Uh().memoizedState;
    }
    function ki(a, b, c, d) {
      var e = Th();
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
    }
    function li(a, b, c, d) {
      var e = Uh();
      d = void 0 === d ? null : d;
      var f = void 0;
      if (null !== N) {
        var g = N.memoizedState;
        f = g.destroy;
        if (null !== d && Mh(d, g.deps)) {
          e.memoizedState = bi(b, c, f, d);
          return;
        }
      }
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, f, d);
    }
    function mi(a, b) {
      return ki(8390656, 8, a, b);
    }
    function $h(a, b) {
      return li(2048, 8, a, b);
    }
    function ni(a, b) {
      return li(4, 2, a, b);
    }
    function oi(a, b) {
      return li(4, 4, a, b);
    }
    function pi(a, b) {
      if ("function" === typeof b) return a = a(), b(a), function() {
        b(null);
      };
      if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
        b.current = null;
      };
    }
    function qi(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return li(4, 4, pi.bind(null, b, a), c);
    }
    function ri() {
    }
    function si(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      c.memoizedState = [a, b];
      return a;
    }
    function ti(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      a = a();
      c.memoizedState = [a, b];
      return a;
    }
    function ui(a, b, c) {
      if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
      He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
      return b;
    }
    function vi(a, b) {
      var c = C;
      C = 0 !== c && 4 > c ? c : 4;
      a(true);
      var d = Gh.transition;
      Gh.transition = {};
      try {
        a(false), b();
      } finally {
        C = c, Gh.transition = d;
      }
    }
    function wi() {
      return Uh().memoizedState;
    }
    function xi(a, b, c) {
      var d = yi(a);
      c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, c);
      else if (c = hh(a, b, c, d), null !== c) {
        var e = R();
        gi(c, a, d, e);
        Bi(c, b, d);
      }
    }
    function ii(a, b, c) {
      var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, e);
      else {
        var f = a.alternate;
        if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
          var g = b.lastRenderedState, h = f(g, c);
          e.hasEagerState = true;
          e.eagerState = h;
          if (He(h, g)) {
            var k = b.interleaved;
            null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
            b.interleaved = e;
            return;
          }
        } catch (l) {
        } finally {
        }
        c = hh(a, b, e, d);
        null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
      }
    }
    function zi(a) {
      var b = a.alternate;
      return a === M || null !== b && b === M;
    }
    function Ai(a, b) {
      Jh = Ih = true;
      var c = a.pending;
      null === c ? b.next = b : (b.next = c.next, c.next = b);
      a.pending = b;
    }
    function Bi(a, b, c) {
      if (0 !== (c & 4194240)) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false };
    var Oh = { readContext: eh, useCallback: function(a, b) {
      Th().memoizedState = [a, void 0 === b ? null : b];
      return a;
    }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return ki(
        4194308,
        4,
        pi.bind(null, b, a),
        c
      );
    }, useLayoutEffect: function(a, b) {
      return ki(4194308, 4, a, b);
    }, useInsertionEffect: function(a, b) {
      return ki(4, 2, a, b);
    }, useMemo: function(a, b) {
      var c = Th();
      b = void 0 === b ? null : b;
      a = a();
      c.memoizedState = [a, b];
      return a;
    }, useReducer: function(a, b, c) {
      var d = Th();
      b = void 0 !== c ? c(b) : b;
      d.memoizedState = d.baseState = b;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
      d.queue = a;
      a = a.dispatch = xi.bind(null, M, a);
      return [d.memoizedState, a];
    }, useRef: function(a) {
      var b = Th();
      a = { current: a };
      return b.memoizedState = a;
    }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
      return Th().memoizedState = a;
    }, useTransition: function() {
      var a = hi(false), b = a[0];
      a = vi.bind(null, a[1]);
      Th().memoizedState = a;
      return [b, a];
    }, useMutableSource: function() {
    }, useSyncExternalStore: function(a, b, c) {
      var d = M, e = Th();
      if (I) {
        if (void 0 === c) throw Error(p(407));
        c = c();
      } else {
        c = b();
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(d, b, c);
      }
      e.memoizedState = c;
      var f = { value: c, getSnapshot: b };
      e.queue = f;
      mi(ai.bind(
        null,
        d,
        f,
        a
      ), [a]);
      d.flags |= 2048;
      bi(9, ci.bind(null, d, f, c, b), void 0, null);
      return c;
    }, useId: function() {
      var a = Th(), b = Q.identifierPrefix;
      if (I) {
        var c = sg;
        var d = rg;
        c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
        b = ":" + b + "R" + c;
        c = Kh++;
        0 < c && (b += "H" + c.toString(32));
        b += ":";
      } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
      return a.memoizedState = b;
    }, unstable_isNewReconciler: false };
    var Ph = {
      readContext: eh,
      useCallback: si,
      useContext: eh,
      useEffect: $h,
      useImperativeHandle: qi,
      useInsertionEffect: ni,
      useLayoutEffect: oi,
      useMemo: ti,
      useReducer: Wh,
      useRef: ji,
      useState: function() {
        return Wh(Vh);
      },
      useDebugValue: ri,
      useDeferredValue: function(a) {
        var b = Uh();
        return ui(b, N.memoizedState, a);
      },
      useTransition: function() {
        var a = Wh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      },
      useMutableSource: Yh,
      useSyncExternalStore: Zh,
      useId: wi,
      unstable_isNewReconciler: false
    };
    var Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
      return Xh(Vh);
    }, useDebugValue: ri, useDeferredValue: function(a) {
      var b = Uh();
      return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
    }, useTransition: function() {
      var a = Xh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
    function Ci(a, b) {
      if (a && a.defaultProps) {
        b = A({}, b);
        a = a.defaultProps;
        for (var c in a) void 0 === b[c] && (b[c] = a[c]);
        return b;
      }
      return b;
    }
    function Di(a, b, c, d) {
      b = a.memoizedState;
      c = c(d, b);
      c = null === c || void 0 === c ? b : A({}, b, c);
      a.memoizedState = c;
      0 === a.lanes && (a.updateQueue.baseState = c);
    }
    var Ei = { isMounted: function(a) {
      return (a = a._reactInternals) ? Vb(a) === a : false;
    }, enqueueSetState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueReplaceState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f = mh(d, e);
      f.tag = 1;
      f.payload = b;
      void 0 !== c && null !== c && (f.callback = c);
      b = nh(a, f, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueForceUpdate: function(a, b) {
      a = a._reactInternals;
      var c = R(), d = yi(a), e = mh(c, d);
      e.tag = 2;
      void 0 !== b && null !== b && (e.callback = b);
      b = nh(a, e, d);
      null !== b && (gi(b, a, d, c), oh(b, a, d));
    } };
    function Fi(a, b, c, d, e, f, g) {
      a = a.stateNode;
      return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
    }
    function Gi(a, b, c) {
      var d = false, e = Vf;
      var f = b.contextType;
      "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
      b = new b(c, f);
      a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
      b.updater = Ei;
      a.stateNode = b;
      b._reactInternals = a;
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
      return b;
    }
    function Hi(a, b, c, d) {
      a = b.state;
      "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
      "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
      b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
    }
    function Ii(a, b, c, d) {
      var e = a.stateNode;
      e.props = c;
      e.state = a.memoizedState;
      e.refs = {};
      kh(a);
      var f = b.contextType;
      "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
      e.state = a.memoizedState;
      f = b.getDerivedStateFromProps;
      "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
      "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
      "function" === typeof e.componentDidMount && (a.flags |= 4194308);
    }
    function Ji(a, b) {
      try {
        var c = "", d = b;
        do
          c += Pa(d), d = d.return;
        while (d);
        var e = c;
      } catch (f) {
        e = "\nError generating stack: " + f.message + "\n" + f.stack;
      }
      return { value: a, source: b, stack: e, digest: null };
    }
    function Ki(a, b, c) {
      return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
    }
    function Li(a, b) {
      try {
        console.error(b.value);
      } catch (c) {
        setTimeout(function() {
          throw c;
        });
      }
    }
    var Mi = "function" === typeof WeakMap ? WeakMap : Map;
    function Ni(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      c.payload = { element: null };
      var d = b.value;
      c.callback = function() {
        Oi || (Oi = true, Pi = d);
        Li(a, b);
      };
      return c;
    }
    function Qi(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      var d = a.type.getDerivedStateFromError;
      if ("function" === typeof d) {
        var e = b.value;
        c.payload = function() {
          return d(e);
        };
        c.callback = function() {
          Li(a, b);
        };
      }
      var f = a.stateNode;
      null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
        Li(a, b);
        "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
        var c2 = b.stack;
        this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
      });
      return c;
    }
    function Si(a, b, c) {
      var d = a.pingCache;
      if (null === d) {
        d = a.pingCache = new Mi();
        var e = /* @__PURE__ */ new Set();
        d.set(b, e);
      } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
      e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
    }
    function Ui(a) {
      do {
        var b;
        if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
        if (b) return a;
        a = a.return;
      } while (null !== a);
      return null;
    }
    function Vi(a, b, c, d, e) {
      if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
      a.flags |= 65536;
      a.lanes = e;
      return a;
    }
    var Wi = ua.ReactCurrentOwner;
    var dh = false;
    function Xi(a, b, c, d) {
      b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
    }
    function Yi(a, b, c, d, e) {
      c = c.render;
      var f = b.ref;
      ch(b, e);
      d = Nh(a, b, c, d, f, e);
      c = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && c && vg(b);
      b.flags |= 1;
      Xi(a, b, d, e);
      return b.child;
    }
    function $i(a, b, c, d, e) {
      if (null === a) {
        var f = c.type;
        if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
        a = Rg(c.type, null, d, b, b.mode, e);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      f = a.child;
      if (0 === (a.lanes & e)) {
        var g = f.memoizedProps;
        c = c.compare;
        c = null !== c ? c : Ie;
        if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
      }
      b.flags |= 1;
      a = Pg(f, d);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    function bj(a, b, c, d, e) {
      if (null !== a) {
        var f = a.memoizedProps;
        if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
        else return b.lanes = a.lanes, Zi(a, b, e);
      }
      return cj(a, b, c, d, e);
    }
    function dj(a, b, c) {
      var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
      if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
      else {
        if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
        b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        d = null !== f ? f.baseLanes : c;
        G(ej, fj);
        fj |= d;
      }
      else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
      Xi(a, b, e, c);
      return b.child;
    }
    function gj(a, b) {
      var c = b.ref;
      if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
    }
    function cj(a, b, c, d, e) {
      var f = Zf(c) ? Xf : H.current;
      f = Yf(b, f);
      ch(b, e);
      c = Nh(a, b, c, d, f, e);
      d = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && d && vg(b);
      b.flags |= 1;
      Xi(a, b, c, e);
      return b.child;
    }
    function hj(a, b, c, d, e) {
      if (Zf(c)) {
        var f = true;
        cg(b);
      } else f = false;
      ch(b, e);
      if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
      else if (null === a) {
        var g = b.stateNode, h = b.memoizedProps;
        g.props = h;
        var k = g.context, l = c.contextType;
        "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
        var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
        q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
        jh = false;
        var r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        k = b.memoizedState;
        h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
      } else {
        g = b.stateNode;
        lh(a, b);
        h = b.memoizedProps;
        l = b.type === b.elementType ? h : Ci(b.type, h);
        g.props = l;
        q = b.pendingProps;
        r = g.context;
        k = c.contextType;
        "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
        var y = c.getDerivedStateFromProps;
        (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
        jh = false;
        r = b.memoizedState;
        g.state = r;
        qh(b, d, g, e);
        var n = b.memoizedState;
        h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
      }
      return jj(a, b, c, d, f, e);
    }
    function jj(a, b, c, d, e, f) {
      gj(a, b);
      var g = 0 !== (b.flags & 128);
      if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
      d = b.stateNode;
      Wi.current = b;
      var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
      b.flags |= 1;
      null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
      b.memoizedState = d.state;
      e && dg(b, c, true);
      return b.child;
    }
    function kj(a) {
      var b = a.stateNode;
      b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
      yh(a, b.containerInfo);
    }
    function lj(a, b, c, d, e) {
      Ig();
      Jg(e);
      b.flags |= 256;
      Xi(a, b, c, d);
      return b.child;
    }
    var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
    function nj(a) {
      return { baseLanes: a, cachePool: null, transitions: null };
    }
    function oj(a, b, c) {
      var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
      (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
      if (h) f = true, b.flags &= -129;
      else if (null === a || null !== a.memoizedState) e |= 1;
      G(L, e & 1);
      if (null === a) {
        Eg(b);
        a = b.memoizedState;
        if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
        g = d.children;
        a = d.fallback;
        return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
      }
      e = a.memoizedState;
      if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
      if (f) {
        f = d.fallback;
        g = b.mode;
        e = a.child;
        h = e.sibling;
        var k = { mode: "hidden", children: d.children };
        0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
        null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
        f.return = b;
        d.return = b;
        d.sibling = f;
        b.child = d;
        d = f;
        f = b.child;
        g = a.child.memoizedState;
        g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
        f.memoizedState = g;
        f.childLanes = a.childLanes & ~c;
        b.memoizedState = mj;
        return d;
      }
      f = a.child;
      a = f.sibling;
      d = Pg(f, { mode: "visible", children: d.children });
      0 === (b.mode & 1) && (d.lanes = c);
      d.return = b;
      d.sibling = null;
      null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
      b.child = d;
      b.memoizedState = null;
      return d;
    }
    function qj(a, b) {
      b = pj({ mode: "visible", children: b }, a.mode, 0, null);
      b.return = a;
      return a.child = b;
    }
    function sj(a, b, c, d) {
      null !== d && Jg(d);
      Ug(b, a.child, null, c);
      a = qj(b, b.pendingProps.children);
      a.flags |= 2;
      b.memoizedState = null;
      return a;
    }
    function rj(a, b, c, d, e, f, g) {
      if (c) {
        if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
        if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
        f = d.fallback;
        e = b.mode;
        d = pj({ mode: "visible", children: d.children }, e, 0, null);
        f = Tg(f, e, g, null);
        f.flags |= 2;
        d.return = b;
        f.return = b;
        d.sibling = f;
        b.child = d;
        0 !== (b.mode & 1) && Ug(b, a.child, null, g);
        b.child.memoizedState = nj(g);
        b.memoizedState = mj;
        return f;
      }
      if (0 === (b.mode & 1)) return sj(a, b, g, null);
      if ("$!" === e.data) {
        d = e.nextSibling && e.nextSibling.dataset;
        if (d) var h = d.dgst;
        d = h;
        f = Error(p(419));
        d = Ki(f, d, void 0);
        return sj(a, b, g, d);
      }
      h = 0 !== (g & a.childLanes);
      if (dh || h) {
        d = Q;
        if (null !== d) {
          switch (g & -g) {
            case 4:
              e = 2;
              break;
            case 16:
              e = 8;
              break;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              e = 32;
              break;
            case 536870912:
              e = 268435456;
              break;
            default:
              e = 0;
          }
          e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
          0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
        }
        tj();
        d = Ki(Error(p(421)));
        return sj(a, b, g, d);
      }
      if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
      a = f.treeContext;
      yg = Lf(e.nextSibling);
      xg = b;
      I = true;
      zg = null;
      null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
      b = qj(b, d.children);
      b.flags |= 4096;
      return b;
    }
    function vj(a, b, c) {
      a.lanes |= b;
      var d = a.alternate;
      null !== d && (d.lanes |= b);
      bh(a.return, b, c);
    }
    function wj(a, b, c, d, e) {
      var f = a.memoizedState;
      null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
    }
    function xj(a, b, c) {
      var d = b.pendingProps, e = d.revealOrder, f = d.tail;
      Xi(a, b, d.children, c);
      d = L.current;
      if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
      else {
        if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
          if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
          else if (19 === a.tag) vj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b) break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b) break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
        d &= 1;
      }
      G(L, d);
      if (0 === (b.mode & 1)) b.memoizedState = null;
      else switch (e) {
        case "forwards":
          c = b.child;
          for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
          c = e;
          null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
          wj(b, false, e, c, f);
          break;
        case "backwards":
          c = null;
          e = b.child;
          for (b.child = null; null !== e; ) {
            a = e.alternate;
            if (null !== a && null === Ch(a)) {
              b.child = e;
              break;
            }
            a = e.sibling;
            e.sibling = c;
            c = e;
            e = a;
          }
          wj(b, true, c, null, f);
          break;
        case "together":
          wj(b, false, null, null, void 0);
          break;
        default:
          b.memoizedState = null;
      }
      return b.child;
    }
    function ij(a, b) {
      0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
    }
    function Zi(a, b, c) {
      null !== a && (b.dependencies = a.dependencies);
      rh |= b.lanes;
      if (0 === (c & b.childLanes)) return null;
      if (null !== a && b.child !== a.child) throw Error(p(153));
      if (null !== b.child) {
        a = b.child;
        c = Pg(a, a.pendingProps);
        b.child = c;
        for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
        c.sibling = null;
      }
      return b.child;
    }
    function yj(a, b, c) {
      switch (b.tag) {
        case 3:
          kj(b);
          Ig();
          break;
        case 5:
          Ah(b);
          break;
        case 1:
          Zf(b.type) && cg(b);
          break;
        case 4:
          yh(b, b.stateNode.containerInfo);
          break;
        case 10:
          var d = b.type._context, e = b.memoizedProps.value;
          G(Wg, d._currentValue);
          d._currentValue = e;
          break;
        case 13:
          d = b.memoizedState;
          if (null !== d) {
            if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
            if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
            G(L, L.current & 1);
            a = Zi(a, b, c);
            return null !== a ? a.sibling : null;
          }
          G(L, L.current & 1);
          break;
        case 19:
          d = 0 !== (c & b.childLanes);
          if (0 !== (a.flags & 128)) {
            if (d) return xj(a, b, c);
            b.flags |= 128;
          }
          e = b.memoizedState;
          null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
          G(L, L.current);
          if (d) break;
          else return null;
        case 22:
        case 23:
          return b.lanes = 0, dj(a, b, c);
      }
      return Zi(a, b, c);
    }
    var zj;
    var Aj;
    var Bj;
    var Cj;
    zj = function(a, b) {
      for (var c = b.child; null !== c; ) {
        if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
        else if (4 !== c.tag && null !== c.child) {
          c.child.return = c;
          c = c.child;
          continue;
        }
        if (c === b) break;
        for (; null === c.sibling; ) {
          if (null === c.return || c.return === b) return;
          c = c.return;
        }
        c.sibling.return = c.return;
        c = c.sibling;
      }
    };
    Aj = function() {
    };
    Bj = function(a, b, c, d) {
      var e = a.memoizedProps;
      if (e !== d) {
        a = b.stateNode;
        xh(uh.current);
        var f = null;
        switch (c) {
          case "input":
            e = Ya(a, e);
            d = Ya(a, d);
            f = [];
            break;
          case "select":
            e = A({}, e, { value: void 0 });
            d = A({}, d, { value: void 0 });
            f = [];
            break;
          case "textarea":
            e = gb(a, e);
            d = gb(a, d);
            f = [];
            break;
          default:
            "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
        }
        ub(c, d);
        var g;
        c = null;
        for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
          var h = e[l];
          for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
        for (l in d) {
          var k = d[l];
          h = null != e ? e[l] : void 0;
          if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
            for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
          } else c || (f || (f = []), f.push(
            l,
            c
          )), c = k;
          else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
        }
        c && (f = f || []).push("style", c);
        var l = f;
        if (b.updateQueue = l) b.flags |= 4;
      }
    };
    Cj = function(a, b, c, d) {
      c !== d && (b.flags |= 4);
    };
    function Dj(a, b) {
      if (!I) switch (a.tailMode) {
        case "hidden":
          b = a.tail;
          for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
          null === c ? a.tail = null : c.sibling = null;
          break;
        case "collapsed":
          c = a.tail;
          for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
          null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
      }
    }
    function S(a) {
      var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
      if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
      else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
      a.subtreeFlags |= d;
      a.childLanes = c;
      return b;
    }
    function Ej(a, b, c) {
      var d = b.pendingProps;
      wg(b);
      switch (b.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return S(b), null;
        case 1:
          return Zf(b.type) && $f(), S(b), null;
        case 3:
          d = b.stateNode;
          zh();
          E(Wf);
          E(H);
          Eh();
          d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
          if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
          Aj(a, b);
          S(b);
          return null;
        case 5:
          Bh(b);
          var e = xh(wh.current);
          c = b.type;
          if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          else {
            if (!d) {
              if (null === b.stateNode) throw Error(p(166));
              S(b);
              return null;
            }
            a = xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.type;
              var f = b.memoizedProps;
              d[Of] = b;
              d[Pf] = f;
              a = 0 !== (b.mode & 1);
              switch (c) {
                case "dialog":
                  D("cancel", d);
                  D("close", d);
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", d);
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D(lf[e], d);
                  break;
                case "source":
                  D("error", d);
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    d
                  );
                  D("load", d);
                  break;
                case "details":
                  D("toggle", d);
                  break;
                case "input":
                  Za(d, f);
                  D("invalid", d);
                  break;
                case "select":
                  d._wrapperState = { wasMultiple: !!f.multiple };
                  D("invalid", d);
                  break;
                case "textarea":
                  hb(d, f), D("invalid", d);
              }
              ub(c, f);
              e = null;
              for (var g in f) if (f.hasOwnProperty(g)) {
                var h = f[g];
                "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                  d.textContent,
                  h,
                  a
                ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
              }
              switch (c) {
                case "input":
                  Va(d);
                  db(d, f, true);
                  break;
                case "textarea":
                  Va(d);
                  jb(d);
                  break;
                case "select":
                case "option":
                  break;
                default:
                  "function" === typeof f.onClick && (d.onclick = Bf);
              }
              d = e;
              b.updateQueue = d;
              null !== d && (b.flags |= 4);
            } else {
              g = 9 === e.nodeType ? e : e.ownerDocument;
              "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
              "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
              a[Of] = b;
              a[Pf] = d;
              zj(a, b, false, false);
              b.stateNode = a;
              a: {
                g = vb(c, d);
                switch (c) {
                  case "dialog":
                    D("cancel", a);
                    D("close", a);
                    e = d;
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", a);
                    e = d;
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], a);
                    e = d;
                    break;
                  case "source":
                    D("error", a);
                    e = d;
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      a
                    );
                    D("load", a);
                    e = d;
                    break;
                  case "details":
                    D("toggle", a);
                    e = d;
                    break;
                  case "input":
                    Za(a, d);
                    e = Ya(a, d);
                    D("invalid", a);
                    break;
                  case "option":
                    e = d;
                    break;
                  case "select":
                    a._wrapperState = { wasMultiple: !!d.multiple };
                    e = A({}, d, { value: void 0 });
                    D("invalid", a);
                    break;
                  case "textarea":
                    hb(a, d);
                    e = gb(a, d);
                    D("invalid", a);
                    break;
                  default:
                    e = d;
                }
                ub(c, e);
                h = e;
                for (f in h) if (h.hasOwnProperty(f)) {
                  var k = h[f];
                  "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
                }
                switch (c) {
                  case "input":
                    Va(a);
                    db(a, d, false);
                    break;
                  case "textarea":
                    Va(a);
                    jb(a);
                    break;
                  case "option":
                    null != d.value && a.setAttribute("value", "" + Sa(d.value));
                    break;
                  case "select":
                    a.multiple = !!d.multiple;
                    f = d.value;
                    null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                      a,
                      !!d.multiple,
                      d.defaultValue,
                      true
                    );
                    break;
                  default:
                    "function" === typeof e.onClick && (a.onclick = Bf);
                }
                switch (c) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d = !!d.autoFocus;
                    break a;
                  case "img":
                    d = true;
                    break a;
                  default:
                    d = false;
                }
              }
              d && (b.flags |= 4);
            }
            null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          }
          S(b);
          return null;
        case 6:
          if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
          else {
            if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
            c = xh(wh.current);
            xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.memoizedProps;
              d[Of] = b;
              if (f = d.nodeValue !== c) {
                if (a = xg, null !== a) switch (a.tag) {
                  case 3:
                    Af(d.nodeValue, c, 0 !== (a.mode & 1));
                    break;
                  case 5:
                    true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                }
              }
              f && (b.flags |= 4);
            } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
          }
          S(b);
          return null;
        case 13:
          E(L);
          d = b.memoizedState;
          if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
            if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
            else if (f = Gg(b), null !== d && null !== d.dehydrated) {
              if (null === a) {
                if (!f) throw Error(p(318));
                f = b.memoizedState;
                f = null !== f ? f.dehydrated : null;
                if (!f) throw Error(p(317));
                f[Of] = b;
              } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
              S(b);
              f = false;
            } else null !== zg && (Fj(zg), zg = null), f = true;
            if (!f) return b.flags & 65536 ? b : null;
          }
          if (0 !== (b.flags & 128)) return b.lanes = c, b;
          d = null !== d;
          d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
          null !== b.updateQueue && (b.flags |= 4);
          S(b);
          return null;
        case 4:
          return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
        case 10:
          return ah(b.type._context), S(b), null;
        case 17:
          return Zf(b.type) && $f(), S(b), null;
        case 19:
          E(L);
          f = b.memoizedState;
          if (null === f) return S(b), null;
          d = 0 !== (b.flags & 128);
          g = f.rendering;
          if (null === g) if (d) Dj(f, false);
          else {
            if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
              g = Ch(a);
              if (null !== g) {
                b.flags |= 128;
                Dj(f, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G(L, L.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
            null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
          }
          else {
            if (!d) if (a = Ch(g), null !== a) {
              if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
            } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
            f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
          }
          if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
          S(b);
          return null;
        case 22:
        case 23:
          return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
        case 24:
          return null;
        case 25:
          return null;
      }
      throw Error(p(156, b.tag));
    }
    function Ij(a, b) {
      wg(b);
      switch (b.tag) {
        case 1:
          return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 3:
          return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
        case 5:
          return Bh(b), null;
        case 13:
          E(L);
          a = b.memoizedState;
          if (null !== a && null !== a.dehydrated) {
            if (null === b.alternate) throw Error(p(340));
            Ig();
          }
          a = b.flags;
          return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 19:
          return E(L), null;
        case 4:
          return zh(), null;
        case 10:
          return ah(b.type._context), null;
        case 22:
        case 23:
          return Hj(), null;
        case 24:
          return null;
        default:
          return null;
      }
    }
    var Jj = false;
    var U = false;
    var Kj = "function" === typeof WeakSet ? WeakSet : Set;
    var V = null;
    function Lj(a, b) {
      var c = a.ref;
      if (null !== c) if ("function" === typeof c) try {
        c(null);
      } catch (d) {
        W(a, b, d);
      }
      else c.current = null;
    }
    function Mj(a, b, c) {
      try {
        c();
      } catch (d) {
        W(a, b, d);
      }
    }
    var Nj = false;
    function Oj(a, b) {
      Cf = dd;
      a = Me();
      if (Ne(a)) {
        if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
        else a: {
          c = (c = a.ownerDocument) && c.defaultView || window;
          var d = c.getSelection && c.getSelection();
          if (d && 0 !== d.rangeCount) {
            c = d.anchorNode;
            var e = d.anchorOffset, f = d.focusNode;
            d = d.focusOffset;
            try {
              c.nodeType, f.nodeType;
            } catch (F) {
              c = null;
              break a;
            }
            var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
            b: for (; ; ) {
              for (var y; ; ) {
                q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
                q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
                3 === q.nodeType && (g += q.nodeValue.length);
                if (null === (y = q.firstChild)) break;
                r = q;
                q = y;
              }
              for (; ; ) {
                if (q === a) break b;
                r === c && ++l === e && (h = g);
                r === f && ++m === d && (k = g);
                if (null !== (y = q.nextSibling)) break;
                q = r;
                r = q.parentNode;
              }
              q = y;
            }
            c = -1 === h || -1 === k ? null : { start: h, end: k };
          } else c = null;
        }
        c = c || { start: 0, end: 0 };
      } else c = null;
      Df = { focusedElem: a, selectionRange: c };
      dd = false;
      for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
      else for (; null !== V; ) {
        b = V;
        try {
          var n = b.alternate;
          if (0 !== (b.flags & 1024)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              break;
            case 1:
              if (null !== n) {
                var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
                x.__reactInternalSnapshotBeforeUpdate = w;
              }
              break;
            case 3:
              var u = b.stateNode.containerInfo;
              1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
              break;
            case 5:
            case 6:
            case 4:
            case 17:
              break;
            default:
              throw Error(p(163));
          }
        } catch (F) {
          W(b, b.return, F);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V = a;
          break;
        }
        V = b.return;
      }
      n = Nj;
      Nj = false;
      return n;
    }
    function Pj(a, b, c) {
      var d = b.updateQueue;
      d = null !== d ? d.lastEffect : null;
      if (null !== d) {
        var e = d = d.next;
        do {
          if ((e.tag & a) === a) {
            var f = e.destroy;
            e.destroy = void 0;
            void 0 !== f && Mj(b, c, f);
          }
          e = e.next;
        } while (e !== d);
      }
    }
    function Qj(a, b) {
      b = b.updateQueue;
      b = null !== b ? b.lastEffect : null;
      if (null !== b) {
        var c = b = b.next;
        do {
          if ((c.tag & a) === a) {
            var d = c.create;
            c.destroy = d();
          }
          c = c.next;
        } while (c !== b);
      }
    }
    function Rj(a) {
      var b = a.ref;
      if (null !== b) {
        var c = a.stateNode;
        switch (a.tag) {
          case 5:
            a = c;
            break;
          default:
            a = c;
        }
        "function" === typeof b ? b(a) : b.current = a;
      }
    }
    function Sj(a) {
      var b = a.alternate;
      null !== b && (a.alternate = null, Sj(b));
      a.child = null;
      a.deletions = null;
      a.sibling = null;
      5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
      a.stateNode = null;
      a.return = null;
      a.dependencies = null;
      a.memoizedProps = null;
      a.memoizedState = null;
      a.pendingProps = null;
      a.stateNode = null;
      a.updateQueue = null;
    }
    function Tj(a) {
      return 5 === a.tag || 3 === a.tag || 4 === a.tag;
    }
    function Uj(a) {
      a: for (; ; ) {
        for (; null === a.sibling; ) {
          if (null === a.return || Tj(a.return)) return null;
          a = a.return;
        }
        a.sibling.return = a.return;
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
          if (a.flags & 2) continue a;
          if (null === a.child || 4 === a.tag) continue a;
          else a.child.return = a, a = a.child;
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function Vj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
      else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
    }
    function Wj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
      else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
    }
    var X = null;
    var Xj = false;
    function Yj(a, b, c) {
      for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
    }
    function Zj(a, b, c) {
      if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
        lc.onCommitFiberUnmount(kc, c);
      } catch (h) {
      }
      switch (c.tag) {
        case 5:
          U || Lj(c, b);
        case 6:
          var d = X, e = Xj;
          X = null;
          Yj(a, b, c);
          X = d;
          Xj = e;
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
          break;
        case 18:
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
          break;
        case 4:
          d = X;
          e = Xj;
          X = c.stateNode.containerInfo;
          Xj = true;
          Yj(a, b, c);
          X = d;
          Xj = e;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
            e = d = d.next;
            do {
              var f = e, g = f.destroy;
              f = f.tag;
              void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
              e = e.next;
            } while (e !== d);
          }
          Yj(a, b, c);
          break;
        case 1:
          if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
            d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
          } catch (h) {
            W(c, b, h);
          }
          Yj(a, b, c);
          break;
        case 21:
          Yj(a, b, c);
          break;
        case 22:
          c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
          break;
        default:
          Yj(a, b, c);
      }
    }
    function ak(a) {
      var b = a.updateQueue;
      if (null !== b) {
        a.updateQueue = null;
        var c = a.stateNode;
        null === c && (c = a.stateNode = new Kj());
        b.forEach(function(b2) {
          var d = bk.bind(null, a, b2);
          c.has(b2) || (c.add(b2), b2.then(d, d));
        });
      }
    }
    function ck(a, b) {
      var c = b.deletions;
      if (null !== c) for (var d = 0; d < c.length; d++) {
        var e = c[d];
        try {
          var f = a, g = b, h = g;
          a: for (; null !== h; ) {
            switch (h.tag) {
              case 5:
                X = h.stateNode;
                Xj = false;
                break a;
              case 3:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
              case 4:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
            }
            h = h.return;
          }
          if (null === X) throw Error(p(160));
          Zj(f, g, e);
          X = null;
          Xj = false;
          var k = e.alternate;
          null !== k && (k.return = null);
          e.return = null;
        } catch (l) {
          W(e, b, l);
        }
      }
      if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
    }
    function dk(a, b) {
      var c = a.alternate, d = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ck(b, a);
          ek(a);
          if (d & 4) {
            try {
              Pj(3, a, a.return), Qj(3, a);
            } catch (t) {
              W(a, a.return, t);
            }
            try {
              Pj(5, a, a.return);
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 1:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          break;
        case 5:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          if (a.flags & 32) {
            var e = a.stateNode;
            try {
              ob(e, "");
            } catch (t) {
              W(a, a.return, t);
            }
          }
          if (d & 4 && (e = a.stateNode, null != e)) {
            var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
            a.updateQueue = null;
            if (null !== k) try {
              "input" === h && "radio" === f.type && null != f.name && ab(e, f);
              vb(h, g);
              var l = vb(h, f);
              for (g = 0; g < k.length; g += 2) {
                var m = k[g], q = k[g + 1];
                "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
              }
              switch (h) {
                case "input":
                  bb(e, f);
                  break;
                case "textarea":
                  ib(e, f);
                  break;
                case "select":
                  var r = e._wrapperState.wasMultiple;
                  e._wrapperState.wasMultiple = !!f.multiple;
                  var y = f.value;
                  null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                    e,
                    !!f.multiple,
                    f.defaultValue,
                    true
                  ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
              }
              e[Pf] = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 6:
          ck(b, a);
          ek(a);
          if (d & 4) {
            if (null === a.stateNode) throw Error(p(162));
            e = a.stateNode;
            f = a.memoizedProps;
            try {
              e.nodeValue = f;
            } catch (t) {
              W(a, a.return, t);
            }
          }
          break;
        case 3:
          ck(b, a);
          ek(a);
          if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
            bd(b.containerInfo);
          } catch (t) {
            W(a, a.return, t);
          }
          break;
        case 4:
          ck(b, a);
          ek(a);
          break;
        case 13:
          ck(b, a);
          ek(a);
          e = a.child;
          e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
          d & 4 && ak(a);
          break;
        case 22:
          m = null !== c && null !== c.memoizedState;
          a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
          ek(a);
          if (d & 8192) {
            l = null !== a.memoizedState;
            if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
              for (q = V = m; null !== V; ) {
                r = V;
                y = r.child;
                switch (r.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    Pj(4, r, r.return);
                    break;
                  case 1:
                    Lj(r, r.return);
                    var n = r.stateNode;
                    if ("function" === typeof n.componentWillUnmount) {
                      d = r;
                      c = r.return;
                      try {
                        b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                      } catch (t) {
                        W(d, c, t);
                      }
                    }
                    break;
                  case 5:
                    Lj(r, r.return);
                    break;
                  case 22:
                    if (null !== r.memoizedState) {
                      gk(q);
                      continue;
                    }
                }
                null !== y ? (y.return = r, V = y) : gk(q);
              }
              m = m.sibling;
            }
            a: for (m = null, q = a; ; ) {
              if (5 === q.tag) {
                if (null === m) {
                  m = q;
                  try {
                    e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                  } catch (t) {
                    W(a, a.return, t);
                  }
                }
              } else if (6 === q.tag) {
                if (null === m) try {
                  q.stateNode.nodeValue = l ? "" : q.memoizedProps;
                } catch (t) {
                  W(a, a.return, t);
                }
              } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
                q.child.return = q;
                q = q.child;
                continue;
              }
              if (q === a) break a;
              for (; null === q.sibling; ) {
                if (null === q.return || q.return === a) break a;
                m === q && (m = null);
                q = q.return;
              }
              m === q && (m = null);
              q.sibling.return = q.return;
              q = q.sibling;
            }
          }
          break;
        case 19:
          ck(b, a);
          ek(a);
          d & 4 && ak(a);
          break;
        case 21:
          break;
        default:
          ck(
            b,
            a
          ), ek(a);
      }
    }
    function ek(a) {
      var b = a.flags;
      if (b & 2) {
        try {
          a: {
            for (var c = a.return; null !== c; ) {
              if (Tj(c)) {
                var d = c;
                break a;
              }
              c = c.return;
            }
            throw Error(p(160));
          }
          switch (d.tag) {
            case 5:
              var e = d.stateNode;
              d.flags & 32 && (ob(e, ""), d.flags &= -33);
              var f = Uj(a);
              Wj(a, f, e);
              break;
            case 3:
            case 4:
              var g = d.stateNode.containerInfo, h = Uj(a);
              Vj(a, h, g);
              break;
            default:
              throw Error(p(161));
          }
        } catch (k) {
          W(a, a.return, k);
        }
        a.flags &= -3;
      }
      b & 4096 && (a.flags &= -4097);
    }
    function hk(a, b, c) {
      V = a;
      ik(a, b, c);
    }
    function ik(a, b, c) {
      for (var d = 0 !== (a.mode & 1); null !== V; ) {
        var e = V, f = e.child;
        if (22 === e.tag && d) {
          var g = null !== e.memoizedState || Jj;
          if (!g) {
            var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
            h = Jj;
            var l = U;
            Jj = g;
            if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
            for (; null !== f; ) V = f, ik(f, b, c), f = f.sibling;
            V = e;
            Jj = h;
            U = l;
          }
          kk(a, b, c);
        } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a, b, c);
      }
    }
    function kk(a) {
      for (; null !== V; ) {
        var b = V;
        if (0 !== (b.flags & 8772)) {
          var c = b.alternate;
          try {
            if (0 !== (b.flags & 8772)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                U || Qj(5, b);
                break;
              case 1:
                var d = b.stateNode;
                if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                else {
                  var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                  d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
                var f = b.updateQueue;
                null !== f && sh(b, f, d);
                break;
              case 3:
                var g = b.updateQueue;
                if (null !== g) {
                  c = null;
                  if (null !== b.child) switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                  sh(b, g, c);
                }
                break;
              case 5:
                var h = b.stateNode;
                if (null === c && b.flags & 4) {
                  c = h;
                  var k = b.memoizedProps;
                  switch (b.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k.autoFocus && c.focus();
                      break;
                    case "img":
                      k.src && (c.src = k.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (null === b.memoizedState) {
                  var l = b.alternate;
                  if (null !== l) {
                    var m = l.memoizedState;
                    if (null !== m) {
                      var q = m.dehydrated;
                      null !== q && bd(q);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(p(163));
            }
            U || b.flags & 512 && Rj(b);
          } catch (r) {
            W(b, b.return, r);
          }
        }
        if (b === a) {
          V = null;
          break;
        }
        c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function gk(a) {
      for (; null !== V; ) {
        var b = V;
        if (b === a) {
          V = null;
          break;
        }
        var c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function jk(a) {
      for (; null !== V; ) {
        var b = V;
        try {
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              var c = b.return;
              try {
                Qj(4, b);
              } catch (k) {
                W(b, c, k);
              }
              break;
            case 1:
              var d = b.stateNode;
              if ("function" === typeof d.componentDidMount) {
                var e = b.return;
                try {
                  d.componentDidMount();
                } catch (k) {
                  W(b, e, k);
                }
              }
              var f = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, f, k);
              }
              break;
            case 5:
              var g = b.return;
              try {
                Rj(b);
              } catch (k) {
                W(b, g, k);
              }
          }
        } catch (k) {
          W(b, b.return, k);
        }
        if (b === a) {
          V = null;
          break;
        }
        var h = b.sibling;
        if (null !== h) {
          h.return = b.return;
          V = h;
          break;
        }
        V = b.return;
      }
    }
    var lk = Math.ceil;
    var mk = ua.ReactCurrentDispatcher;
    var nk = ua.ReactCurrentOwner;
    var ok = ua.ReactCurrentBatchConfig;
    var K = 0;
    var Q = null;
    var Y = null;
    var Z = 0;
    var fj = 0;
    var ej = Uf(0);
    var T = 0;
    var pk = null;
    var rh = 0;
    var qk = 0;
    var rk = 0;
    var sk = null;
    var tk = null;
    var fk = 0;
    var Gj = Infinity;
    var uk = null;
    var Oi = false;
    var Pi = null;
    var Ri = null;
    var vk = false;
    var wk = null;
    var xk = 0;
    var yk = 0;
    var zk = null;
    var Ak = -1;
    var Bk = 0;
    function R() {
      return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
    }
    function yi(a) {
      if (0 === (a.mode & 1)) return 1;
      if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
      if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
      a = C;
      if (0 !== a) return a;
      a = window.event;
      a = void 0 === a ? 16 : jd(a.type);
      return a;
    }
    function gi(a, b, c, d) {
      if (50 < yk) throw yk = 0, zk = null, Error(p(185));
      Ac(a, c, d);
      if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
    }
    function Dk(a, b) {
      var c = a.callbackNode;
      wc(a, b);
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
      else if (b = d & -d, a.callbackPriority !== b) {
        null != c && bc(c);
        if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
          0 === (K & 6) && jg();
        }), c = null;
        else {
          switch (Dc(d)) {
            case 1:
              c = fc;
              break;
            case 4:
              c = gc;
              break;
            case 16:
              c = hc;
              break;
            case 536870912:
              c = jc;
              break;
            default:
              c = hc;
          }
          c = Fk(c, Gk.bind(null, a));
        }
        a.callbackPriority = b;
        a.callbackNode = c;
      }
    }
    function Gk(a, b) {
      Ak = -1;
      Bk = 0;
      if (0 !== (K & 6)) throw Error(p(327));
      var c = a.callbackNode;
      if (Hk() && a.callbackNode !== c) return null;
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) return null;
      if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
      else {
        b = d;
        var e = K;
        K |= 2;
        var f = Jk();
        if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
        do
          try {
            Lk();
            break;
          } catch (h) {
            Mk(a, h);
          }
        while (1);
        $g();
        mk.current = f;
        K = e;
        null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
      }
      if (0 !== b) {
        2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
        if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
        if (6 === b) Ck(a, d);
        else {
          e = a.current.alternate;
          if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          a.finishedWork = e;
          a.finishedLanes = d;
          switch (b) {
            case 0:
            case 1:
              throw Error(p(345));
            case 2:
              Pk(a, tk, uk);
              break;
            case 3:
              Ck(a, d);
              if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                if (0 !== uc(a, 0)) break;
                e = a.suspendedLanes;
                if ((e & d) !== d) {
                  R();
                  a.pingedLanes |= a.suspendedLanes & e;
                  break;
                }
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 4:
              Ck(a, d);
              if ((d & 4194240) === d) break;
              b = a.eventTimes;
              for (e = -1; 0 < d; ) {
                var g = 31 - oc(d);
                f = 1 << g;
                g = b[g];
                g > e && (e = g);
                d &= ~f;
              }
              d = e;
              d = B() - d;
              d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
              if (10 < d) {
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 5:
              Pk(a, tk, uk);
              break;
            default:
              throw Error(p(329));
          }
        }
      }
      Dk(a, B());
      return a.callbackNode === c ? Gk.bind(null, a) : null;
    }
    function Nk(a, b) {
      var c = sk;
      a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
      a = Ik(a, b);
      2 !== a && (b = tk, tk = c, null !== b && Fj(b));
      return a;
    }
    function Fj(a) {
      null === tk ? tk = a : tk.push.apply(tk, a);
    }
    function Ok(a) {
      for (var b = a; ; ) {
        if (b.flags & 16384) {
          var c = b.updateQueue;
          if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
            var e = c[d], f = e.getSnapshot;
            e = e.value;
            try {
              if (!He(f(), e)) return false;
            } catch (g) {
              return false;
            }
          }
        }
        c = b.child;
        if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
        else {
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return true;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
      }
      return true;
    }
    function Ck(a, b) {
      b &= ~rk;
      b &= ~qk;
      a.suspendedLanes |= b;
      a.pingedLanes &= ~b;
      for (a = a.expirationTimes; 0 < b; ) {
        var c = 31 - oc(b), d = 1 << c;
        a[c] = -1;
        b &= ~d;
      }
    }
    function Ek(a) {
      if (0 !== (K & 6)) throw Error(p(327));
      Hk();
      var b = uc(a, 0);
      if (0 === (b & 1)) return Dk(a, B()), null;
      var c = Ik(a, b);
      if (0 !== a.tag && 2 === c) {
        var d = xc(a);
        0 !== d && (b = d, c = Nk(a, d));
      }
      if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
      if (6 === c) throw Error(p(345));
      a.finishedWork = a.current.alternate;
      a.finishedLanes = b;
      Pk(a, tk, uk);
      Dk(a, B());
      return null;
    }
    function Qk(a, b) {
      var c = K;
      K |= 1;
      try {
        return a(b);
      } finally {
        K = c, 0 === K && (Gj = B() + 500, fg && jg());
      }
    }
    function Rk(a) {
      null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
      var b = K;
      K |= 1;
      var c = ok.transition, d = C;
      try {
        if (ok.transition = null, C = 1, a) return a();
      } finally {
        C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
      }
    }
    function Hj() {
      fj = ej.current;
      E(ej);
    }
    function Kk(a, b) {
      a.finishedWork = null;
      a.finishedLanes = 0;
      var c = a.timeoutHandle;
      -1 !== c && (a.timeoutHandle = -1, Gf(c));
      if (null !== Y) for (c = Y.return; null !== c; ) {
        var d = c;
        wg(d);
        switch (d.tag) {
          case 1:
            d = d.type.childContextTypes;
            null !== d && void 0 !== d && $f();
            break;
          case 3:
            zh();
            E(Wf);
            E(H);
            Eh();
            break;
          case 5:
            Bh(d);
            break;
          case 4:
            zh();
            break;
          case 13:
            E(L);
            break;
          case 19:
            E(L);
            break;
          case 10:
            ah(d.type._context);
            break;
          case 22:
          case 23:
            Hj();
        }
        c = c.return;
      }
      Q = a;
      Y = a = Pg(a.current, null);
      Z = fj = b;
      T = 0;
      pk = null;
      rk = qk = rh = 0;
      tk = sk = null;
      if (null !== fh) {
        for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
          c.interleaved = null;
          var e = d.next, f = c.pending;
          if (null !== f) {
            var g = f.next;
            f.next = e;
            d.next = g;
          }
          c.pending = d;
        }
        fh = null;
      }
      return a;
    }
    function Mk(a, b) {
      do {
        var c = Y;
        try {
          $g();
          Fh.current = Rh;
          if (Ih) {
            for (var d = M.memoizedState; null !== d; ) {
              var e = d.queue;
              null !== e && (e.pending = null);
              d = d.next;
            }
            Ih = false;
          }
          Hh = 0;
          O = N = M = null;
          Jh = false;
          Kh = 0;
          nk.current = null;
          if (null === c || null === c.return) {
            T = 1;
            pk = b;
            Y = null;
            break;
          }
          a: {
            var f = a, g = c.return, h = c, k = b;
            b = Z;
            h.flags |= 32768;
            if (null !== k && "object" === typeof k && "function" === typeof k.then) {
              var l = k, m = h, q = m.tag;
              if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                var r = m.alternate;
                r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
              }
              var y = Ui(g);
              if (null !== y) {
                y.flags &= -257;
                Vi(y, g, h, f, b);
                y.mode & 1 && Si(f, l, b);
                b = y;
                k = l;
                var n = b.updateQueue;
                if (null === n) {
                  var t = /* @__PURE__ */ new Set();
                  t.add(k);
                  b.updateQueue = t;
                } else n.add(k);
                break a;
              } else {
                if (0 === (b & 1)) {
                  Si(f, l, b);
                  tj();
                  break a;
                }
                k = Error(p(426));
              }
            } else if (I && h.mode & 1) {
              var J = Ui(g);
              if (null !== J) {
                0 === (J.flags & 65536) && (J.flags |= 256);
                Vi(J, g, h, f, b);
                Jg(Ji(k, h));
                break a;
              }
            }
            f = k = Ji(k, h);
            4 !== T && (T = 2);
            null === sk ? sk = [f] : sk.push(f);
            f = g;
            do {
              switch (f.tag) {
                case 3:
                  f.flags |= 65536;
                  b &= -b;
                  f.lanes |= b;
                  var x = Ni(f, k, b);
                  ph(f, x);
                  break a;
                case 1:
                  h = k;
                  var w = f.type, u = f.stateNode;
                  if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                    f.flags |= 65536;
                    b &= -b;
                    f.lanes |= b;
                    var F = Qi(f, h, b);
                    ph(f, F);
                    break a;
                  }
              }
              f = f.return;
            } while (null !== f);
          }
          Sk(c);
        } catch (na) {
          b = na;
          Y === c && null !== c && (Y = c = c.return);
          continue;
        }
        break;
      } while (1);
    }
    function Jk() {
      var a = mk.current;
      mk.current = Rh;
      return null === a ? Rh : a;
    }
    function tj() {
      if (0 === T || 3 === T || 2 === T) T = 4;
      null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
    }
    function Ik(a, b) {
      var c = K;
      K |= 2;
      var d = Jk();
      if (Q !== a || Z !== b) uk = null, Kk(a, b);
      do
        try {
          Tk();
          break;
        } catch (e) {
          Mk(a, e);
        }
      while (1);
      $g();
      K = c;
      mk.current = d;
      if (null !== Y) throw Error(p(261));
      Q = null;
      Z = 0;
      return T;
    }
    function Tk() {
      for (; null !== Y; ) Uk(Y);
    }
    function Lk() {
      for (; null !== Y && !cc(); ) Uk(Y);
    }
    function Uk(a) {
      var b = Vk(a.alternate, a, fj);
      a.memoizedProps = a.pendingProps;
      null === b ? Sk(a) : Y = b;
      nk.current = null;
    }
    function Sk(a) {
      var b = a;
      do {
        var c = b.alternate;
        a = b.return;
        if (0 === (b.flags & 32768)) {
          if (c = Ej(c, b, fj), null !== c) {
            Y = c;
            return;
          }
        } else {
          c = Ij(c, b);
          if (null !== c) {
            c.flags &= 32767;
            Y = c;
            return;
          }
          if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
          else {
            T = 6;
            Y = null;
            return;
          }
        }
        b = b.sibling;
        if (null !== b) {
          Y = b;
          return;
        }
        Y = b = a;
      } while (null !== b);
      0 === T && (T = 5);
    }
    function Pk(a, b, c) {
      var d = C, e = ok.transition;
      try {
        ok.transition = null, C = 1, Wk(a, b, c, d);
      } finally {
        ok.transition = e, C = d;
      }
      return null;
    }
    function Wk(a, b, c, d) {
      do
        Hk();
      while (null !== wk);
      if (0 !== (K & 6)) throw Error(p(327));
      c = a.finishedWork;
      var e = a.finishedLanes;
      if (null === c) return null;
      a.finishedWork = null;
      a.finishedLanes = 0;
      if (c === a.current) throw Error(p(177));
      a.callbackNode = null;
      a.callbackPriority = 0;
      var f = c.lanes | c.childLanes;
      Bc(a, f);
      a === Q && (Y = Q = null, Z = 0);
      0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
        Hk();
        return null;
      }));
      f = 0 !== (c.flags & 15990);
      if (0 !== (c.subtreeFlags & 15990) || f) {
        f = ok.transition;
        ok.transition = null;
        var g = C;
        C = 1;
        var h = K;
        K |= 4;
        nk.current = null;
        Oj(a, c);
        dk(c, a);
        Oe(Df);
        dd = !!Cf;
        Df = Cf = null;
        a.current = c;
        hk(c, a, e);
        dc();
        K = h;
        C = g;
        ok.transition = f;
      } else a.current = c;
      vk && (vk = false, wk = a, xk = e);
      f = a.pendingLanes;
      0 === f && (Ri = null);
      mc(c.stateNode, d);
      Dk(a, B());
      if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
      if (Oi) throw Oi = false, a = Pi, Pi = null, a;
      0 !== (xk & 1) && 0 !== a.tag && Hk();
      f = a.pendingLanes;
      0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
      jg();
      return null;
    }
    function Hk() {
      if (null !== wk) {
        var a = Dc(xk), b = ok.transition, c = C;
        try {
          ok.transition = null;
          C = 16 > a ? 16 : a;
          if (null === wk) var d = false;
          else {
            a = wk;
            wk = null;
            xk = 0;
            if (0 !== (K & 6)) throw Error(p(331));
            var e = K;
            K |= 4;
            for (V = a.current; null !== V; ) {
              var f = V, g = f.child;
              if (0 !== (V.flags & 16)) {
                var h = f.deletions;
                if (null !== h) {
                  for (var k = 0; k < h.length; k++) {
                    var l = h[k];
                    for (V = l; null !== V; ) {
                      var m = V;
                      switch (m.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Pj(8, m, f);
                      }
                      var q = m.child;
                      if (null !== q) q.return = m, V = q;
                      else for (; null !== V; ) {
                        m = V;
                        var r = m.sibling, y = m.return;
                        Sj(m);
                        if (m === l) {
                          V = null;
                          break;
                        }
                        if (null !== r) {
                          r.return = y;
                          V = r;
                          break;
                        }
                        V = y;
                      }
                    }
                  }
                  var n = f.alternate;
                  if (null !== n) {
                    var t = n.child;
                    if (null !== t) {
                      n.child = null;
                      do {
                        var J = t.sibling;
                        t.sibling = null;
                        t = J;
                      } while (null !== t);
                    }
                  }
                  V = f;
                }
              }
              if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
              else b: for (; null !== V; ) {
                f = V;
                if (0 !== (f.flags & 2048)) switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pj(9, f, f.return);
                }
                var x = f.sibling;
                if (null !== x) {
                  x.return = f.return;
                  V = x;
                  break b;
                }
                V = f.return;
              }
            }
            var w = a.current;
            for (V = w; null !== V; ) {
              g = V;
              var u = g.child;
              if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
              else b: for (g = w; null !== V; ) {
                h = V;
                if (0 !== (h.flags & 2048)) try {
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, h);
                  }
                } catch (na) {
                  W(h, h.return, na);
                }
                if (h === g) {
                  V = null;
                  break b;
                }
                var F = h.sibling;
                if (null !== F) {
                  F.return = h.return;
                  V = F;
                  break b;
                }
                V = h.return;
              }
            }
            K = e;
            jg();
            if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
              lc.onPostCommitFiberRoot(kc, a);
            } catch (na) {
            }
            d = true;
          }
          return d;
        } finally {
          C = c, ok.transition = b;
        }
      }
      return false;
    }
    function Xk(a, b, c) {
      b = Ji(c, b);
      b = Ni(a, b, 1);
      a = nh(a, b, 1);
      b = R();
      null !== a && (Ac(a, 1, b), Dk(a, b));
    }
    function W(a, b, c) {
      if (3 === a.tag) Xk(a, a, c);
      else for (; null !== b; ) {
        if (3 === b.tag) {
          Xk(b, a, c);
          break;
        } else if (1 === b.tag) {
          var d = b.stateNode;
          if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
            a = Ji(c, a);
            a = Qi(b, a, 1);
            b = nh(b, a, 1);
            a = R();
            null !== b && (Ac(b, 1, a), Dk(b, a));
            break;
          }
        }
        b = b.return;
      }
    }
    function Ti(a, b, c) {
      var d = a.pingCache;
      null !== d && d.delete(b);
      b = R();
      a.pingedLanes |= a.suspendedLanes & c;
      Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
      Dk(a, b);
    }
    function Yk(a, b) {
      0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
      var c = R();
      a = ih(a, b);
      null !== a && (Ac(a, b, c), Dk(a, c));
    }
    function uj(a) {
      var b = a.memoizedState, c = 0;
      null !== b && (c = b.retryLane);
      Yk(a, c);
    }
    function bk(a, b) {
      var c = 0;
      switch (a.tag) {
        case 13:
          var d = a.stateNode;
          var e = a.memoizedState;
          null !== e && (c = e.retryLane);
          break;
        case 19:
          d = a.stateNode;
          break;
        default:
          throw Error(p(314));
      }
      null !== d && d.delete(b);
      Yk(a, c);
    }
    var Vk;
    Vk = function(a, b, c) {
      if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
      else {
        if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
        dh = 0 !== (a.flags & 131072) ? true : false;
      }
      else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
      b.lanes = 0;
      switch (b.tag) {
        case 2:
          var d = b.type;
          ij(a, b);
          a = b.pendingProps;
          var e = Yf(b, H.current);
          ch(b, c);
          e = Nh(null, b, d, a, e, c);
          var f = Sh();
          b.flags |= 1;
          "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
          return b;
        case 16:
          d = b.elementType;
          a: {
            ij(a, b);
            a = b.pendingProps;
            e = d._init;
            d = e(d._payload);
            b.type = d;
            e = b.tag = Zk(d);
            a = Ci(d, a);
            switch (e) {
              case 0:
                b = cj(null, b, d, a, c);
                break a;
              case 1:
                b = hj(null, b, d, a, c);
                break a;
              case 11:
                b = Yi(null, b, d, a, c);
                break a;
              case 14:
                b = $i(null, b, d, Ci(d.type, a), c);
                break a;
            }
            throw Error(p(
              306,
              d,
              ""
            ));
          }
          return b;
        case 0:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
        case 1:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
        case 3:
          a: {
            kj(b);
            if (null === a) throw Error(p(387));
            d = b.pendingProps;
            f = b.memoizedState;
            e = f.element;
            lh(a, b);
            qh(b, d, null, c);
            var g = b.memoizedState;
            d = g.element;
            if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
              e = Ji(Error(p(423)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else if (d !== e) {
              e = Ji(Error(p(424)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
            else {
              Ig();
              if (d === e) {
                b = Zi(a, b, c);
                break a;
              }
              Xi(a, b, d, c);
            }
            b = b.child;
          }
          return b;
        case 5:
          return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
        case 6:
          return null === a && Eg(b), null;
        case 13:
          return oj(a, b, c);
        case 4:
          return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
        case 11:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
        case 7:
          return Xi(a, b, b.pendingProps, c), b.child;
        case 8:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 12:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 10:
          a: {
            d = b.type._context;
            e = b.pendingProps;
            f = b.memoizedProps;
            g = e.value;
            G(Wg, d._currentValue);
            d._currentValue = g;
            if (null !== f) if (He(f.value, g)) {
              if (f.children === e.children && !Wf.current) {
                b = Zi(a, b, c);
                break a;
              }
            } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
              var h = f.dependencies;
              if (null !== h) {
                g = f.child;
                for (var k = h.firstContext; null !== k; ) {
                  if (k.context === d) {
                    if (1 === f.tag) {
                      k = mh(-1, c & -c);
                      k.tag = 2;
                      var l = f.updateQueue;
                      if (null !== l) {
                        l = l.shared;
                        var m = l.pending;
                        null === m ? k.next = k : (k.next = m.next, m.next = k);
                        l.pending = k;
                      }
                    }
                    f.lanes |= c;
                    k = f.alternate;
                    null !== k && (k.lanes |= c);
                    bh(
                      f.return,
                      c,
                      b
                    );
                    h.lanes |= c;
                    break;
                  }
                  k = k.next;
                }
              } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
              else if (18 === f.tag) {
                g = f.return;
                if (null === g) throw Error(p(341));
                g.lanes |= c;
                h = g.alternate;
                null !== h && (h.lanes |= c);
                bh(g, c, b);
                g = f.sibling;
              } else g = f.child;
              if (null !== g) g.return = f;
              else for (g = f; null !== g; ) {
                if (g === b) {
                  g = null;
                  break;
                }
                f = g.sibling;
                if (null !== f) {
                  f.return = g.return;
                  g = f;
                  break;
                }
                g = g.return;
              }
              f = g;
            }
            Xi(a, b, e.children, c);
            b = b.child;
          }
          return b;
        case 9:
          return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
        case 14:
          return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
        case 15:
          return bj(a, b, b.type, b.pendingProps, c);
        case 17:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
        case 19:
          return xj(a, b, c);
        case 22:
          return dj(a, b, c);
      }
      throw Error(p(156, b.tag));
    };
    function Fk(a, b) {
      return ac(a, b);
    }
    function $k(a, b, c, d) {
      this.tag = a;
      this.key = c;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.ref = null;
      this.pendingProps = b;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = d;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function Bg(a, b, c, d) {
      return new $k(a, b, c, d);
    }
    function aj(a) {
      a = a.prototype;
      return !(!a || !a.isReactComponent);
    }
    function Zk(a) {
      if ("function" === typeof a) return aj(a) ? 1 : 0;
      if (void 0 !== a && null !== a) {
        a = a.$$typeof;
        if (a === Da) return 11;
        if (a === Ga) return 14;
      }
      return 2;
    }
    function Pg(a, b) {
      var c = a.alternate;
      null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
      c.flags = a.flags & 14680064;
      c.childLanes = a.childLanes;
      c.lanes = a.lanes;
      c.child = a.child;
      c.memoizedProps = a.memoizedProps;
      c.memoizedState = a.memoizedState;
      c.updateQueue = a.updateQueue;
      b = a.dependencies;
      c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
      c.sibling = a.sibling;
      c.index = a.index;
      c.ref = a.ref;
      return c;
    }
    function Rg(a, b, c, d, e, f) {
      var g = 2;
      d = a;
      if ("function" === typeof a) aj(a) && (g = 1);
      else if ("string" === typeof a) g = 5;
      else a: switch (a) {
        case ya:
          return Tg(c.children, e, f, b);
        case za:
          g = 8;
          e |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
        case Ea:
          return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
        case Fa:
          return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
        case Ia:
          return pj(c, e, f, b);
        default:
          if ("object" === typeof a && null !== a) switch (a.$$typeof) {
            case Ba:
              g = 10;
              break a;
            case Ca:
              g = 9;
              break a;
            case Da:
              g = 11;
              break a;
            case Ga:
              g = 14;
              break a;
            case Ha:
              g = 16;
              d = null;
              break a;
          }
          throw Error(p(130, null == a ? a : typeof a, ""));
      }
      b = Bg(g, c, b, e);
      b.elementType = a;
      b.type = d;
      b.lanes = f;
      return b;
    }
    function Tg(a, b, c, d) {
      a = Bg(7, a, d, b);
      a.lanes = c;
      return a;
    }
    function pj(a, b, c, d) {
      a = Bg(22, a, d, b);
      a.elementType = Ia;
      a.lanes = c;
      a.stateNode = { isHidden: false };
      return a;
    }
    function Qg(a, b, c) {
      a = Bg(6, a, null, b);
      a.lanes = c;
      return a;
    }
    function Sg(a, b, c) {
      b = Bg(4, null !== a.children ? a.children : [], a.key, b);
      b.lanes = c;
      b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
      return b;
    }
    function al(a, b, c, d, e) {
      this.tag = b;
      this.containerInfo = a;
      this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.pendingContext = this.context = null;
      this.callbackPriority = 0;
      this.eventTimes = zc(0);
      this.expirationTimes = zc(-1);
      this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = zc(0);
      this.identifierPrefix = d;
      this.onRecoverableError = e;
      this.mutableSourceEagerHydrationData = null;
    }
    function bl(a, b, c, d, e, f, g, h, k) {
      a = new al(a, b, c, h, k);
      1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
      f = Bg(3, null, null, b);
      a.current = f;
      f.stateNode = a;
      f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
      kh(f);
      return a;
    }
    function cl(a, b, c) {
      var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
    }
    function dl(a) {
      if (!a) return Vf;
      a = a._reactInternals;
      a: {
        if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
        var b = a;
        do {
          switch (b.tag) {
            case 3:
              b = b.stateNode.context;
              break a;
            case 1:
              if (Zf(b.type)) {
                b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                break a;
              }
          }
          b = b.return;
        } while (null !== b);
        throw Error(p(171));
      }
      if (1 === a.tag) {
        var c = a.type;
        if (Zf(c)) return bg(a, c, b);
      }
      return b;
    }
    function el(a, b, c, d, e, f, g, h, k) {
      a = bl(c, d, true, a, e, f, g, h, k);
      a.context = dl(null);
      c = a.current;
      d = R();
      e = yi(c);
      f = mh(d, e);
      f.callback = void 0 !== b && null !== b ? b : null;
      nh(c, f, e);
      a.current.lanes = e;
      Ac(a, e, d);
      Dk(a, d);
      return a;
    }
    function fl(a, b, c, d) {
      var e = b.current, f = R(), g = yi(e);
      c = dl(c);
      null === b.context ? b.context = c : b.pendingContext = c;
      b = mh(f, g);
      b.payload = { element: a };
      d = void 0 === d ? null : d;
      null !== d && (b.callback = d);
      a = nh(e, b, g);
      null !== a && (gi(a, e, g, f), oh(a, e, g));
      return g;
    }
    function gl(a) {
      a = a.current;
      if (!a.child) return null;
      switch (a.child.tag) {
        case 5:
          return a.child.stateNode;
        default:
          return a.child.stateNode;
      }
    }
    function hl(a, b) {
      a = a.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        var c = a.retryLane;
        a.retryLane = 0 !== c && c < b ? c : b;
      }
    }
    function il(a, b) {
      hl(a, b);
      (a = a.alternate) && hl(a, b);
    }
    function jl() {
      return null;
    }
    var kl = "function" === typeof reportError ? reportError : function(a) {
      console.error(a);
    };
    function ll(a) {
      this._internalRoot = a;
    }
    ml.prototype.render = ll.prototype.render = function(a) {
      var b = this._internalRoot;
      if (null === b) throw Error(p(409));
      fl(a, b, null, null);
    };
    ml.prototype.unmount = ll.prototype.unmount = function() {
      var a = this._internalRoot;
      if (null !== a) {
        this._internalRoot = null;
        var b = a.containerInfo;
        Rk(function() {
          fl(null, a, null, null);
        });
        b[uf] = null;
      }
    };
    function ml(a) {
      this._internalRoot = a;
    }
    ml.prototype.unstable_scheduleHydration = function(a) {
      if (a) {
        var b = Hc();
        a = { blockedOn: null, target: a, priority: b };
        for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
        Qc.splice(c, 0, a);
        0 === c && Vc(a);
      }
    };
    function nl(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
    }
    function ol(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
    }
    function pl() {
    }
    function ql(a, b, c, d, e) {
      if (e) {
        if ("function" === typeof d) {
          var f = d;
          d = function() {
            var a2 = gl(g);
            f.call(a2);
          };
        }
        var g = el(b, d, a, 0, null, false, false, "", pl);
        a._reactRootContainer = g;
        a[uf] = g.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk();
        return g;
      }
      for (; e = a.lastChild; ) a.removeChild(e);
      if ("function" === typeof d) {
        var h = d;
        d = function() {
          var a2 = gl(k);
          h.call(a2);
        };
      }
      var k = bl(a, 0, false, null, null, false, false, "", pl);
      a._reactRootContainer = k;
      a[uf] = k.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk(function() {
        fl(b, k, c, d);
      });
      return k;
    }
    function rl(a, b, c, d, e) {
      var f = c._reactRootContainer;
      if (f) {
        var g = f;
        if ("function" === typeof e) {
          var h = e;
          e = function() {
            var a2 = gl(g);
            h.call(a2);
          };
        }
        fl(b, g, a, e);
      } else g = ql(c, b, a, e, d);
      return gl(g);
    }
    Ec = function(a) {
      switch (a.tag) {
        case 3:
          var b = a.stateNode;
          if (b.current.memoizedState.isDehydrated) {
            var c = tc(b.pendingLanes);
            0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
          }
          break;
        case 13:
          Rk(function() {
            var b2 = ih(a, 1);
            if (null !== b2) {
              var c2 = R();
              gi(b2, a, 1, c2);
            }
          }), il(a, 1);
      }
    };
    Fc = function(a) {
      if (13 === a.tag) {
        var b = ih(a, 134217728);
        if (null !== b) {
          var c = R();
          gi(b, a, 134217728, c);
        }
        il(a, 134217728);
      }
    };
    Gc = function(a) {
      if (13 === a.tag) {
        var b = yi(a), c = ih(a, b);
        if (null !== c) {
          var d = R();
          gi(c, a, b, d);
        }
        il(a, b);
      }
    };
    Hc = function() {
      return C;
    };
    Ic = function(a, b) {
      var c = C;
      try {
        return C = a, b();
      } finally {
        C = c;
      }
    };
    yb = function(a, b, c) {
      switch (b) {
        case "input":
          bb(a, c);
          b = c.name;
          if ("radio" === c.type && null != b) {
            for (c = a; c.parentNode; ) c = c.parentNode;
            c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
            for (b = 0; b < c.length; b++) {
              var d = c[b];
              if (d !== a && d.form === a.form) {
                var e = Db(d);
                if (!e) throw Error(p(90));
                Wa(d);
                bb(d, e);
              }
            }
          }
          break;
        case "textarea":
          ib(a, c);
          break;
        case "select":
          b = c.value, null != b && fb(a, !!c.multiple, b, false);
      }
    };
    Gb = Qk;
    Hb = Rk;
    var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] };
    var tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
    var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
      a = Zb(a);
      return null === a ? null : a.stateNode;
    }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!vl.isDisabled && vl.supportsFiber) try {
        kc = vl.inject(ul), lc = vl;
      } catch (a) {
      }
    }
    var vl;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
    exports.createPortal = function(a, b) {
      var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!nl(b)) throw Error(p(200));
      return cl(a, b, null, c);
    };
    exports.createRoot = function(a, b) {
      if (!nl(a)) throw Error(p(299));
      var c = false, d = "", e = kl;
      null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
      b = bl(a, 1, false, null, null, c, false, d, e);
      a[uf] = b.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      return new ll(b);
    };
    exports.findDOMNode = function(a) {
      if (null == a) return null;
      if (1 === a.nodeType) return a;
      var b = a._reactInternals;
      if (void 0 === b) {
        if ("function" === typeof a.render) throw Error(p(188));
        a = Object.keys(a).join(",");
        throw Error(p(268, a));
      }
      a = Zb(b);
      a = null === a ? null : a.stateNode;
      return a;
    };
    exports.flushSync = function(a) {
      return Rk(a);
    };
    exports.hydrate = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, true, c);
    };
    exports.hydrateRoot = function(a, b, c) {
      if (!nl(a)) throw Error(p(405));
      var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
      null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
      b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
      a[uf] = b.current;
      sf(a);
      if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
        c,
        e
      );
      return new ml(b);
    };
    exports.render = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, false, c);
    };
    exports.unmountComponentAtNode = function(a) {
      if (!ol(a)) throw Error(p(40));
      return a._reactRootContainer ? (Rk(function() {
        rl(null, null, a, false, function() {
          a._reactRootContainer = null;
          a[uf] = null;
        });
      }), true) : false;
    };
    exports.unstable_batchedUpdates = Qk;
    exports.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
      if (!ol(c)) throw Error(p(200));
      if (null == a || void 0 === a._reactInternals) throw Error(p(38));
      return rl(a, b, c, false, d);
    };
    exports.version = "18.3.1-next-f1338f8080-20240426";
  }
});

// node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "node_modules/react-dom/index.js"(exports, module) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module.exports = require_react_dom_production_min();
    } else {
      module.exports = null;
    }
  }
});

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (true) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.min.js
var require_react_jsx_runtime_production_min = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports) {
    "use strict";
    var f = require_react();
    var k = Symbol.for("react.element");
    var l = Symbol.for("react.fragment");
    var m = Object.prototype.hasOwnProperty;
    var n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
    var p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    exports.Fragment = l;
    exports.jsx = q;
    exports.jsxs = q;
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (true) {
      module.exports = require_react_jsx_runtime_production_min();
    } else {
      module.exports = null;
    }
  }
});

// site/site.js
var import_react6 = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);

// client/Home.jsx
var import_react3 = __toESM(require_react(), 1);

// client/workflow-templates.js
var INTERPRETER_PLACEHOLDER = "{{python}}";
function step(id, title, instructions, extra = {}) {
  return {
    id,
    title,
    instructions,
    ...extra
  };
}
var sequenceAnalysis = {
  id: "sequence-analysis",
  badge: "\u7EC4\u5B66",
  title: "\u5E8F\u5217\u5206\u6790",
  description: "\u626B\u63CF\u5DE5\u4F5C\u533A\u91CC\u7684 FASTA/FASTQ\uFF0C\u6C47\u603B\u8BB0\u5F55\u6570\u5E76\u5199\u51FA\u62A5\u544A\u3002",
  preset: "biomni",
  steps: [
    step("inspect-inputs", "\u626B\u63CF\u5E8F\u5217\u6587\u4EF6", "\u5217\u51FA\u5DE5\u4F5C\u533A\u91CC\u7684\u5E8F\u5217\u6587\u4EF6\u4E0E\u8BB0\u5F55\u6570\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/inspect_sequences.py`,
      inputs: [],
      outputs: []
    }),
    step("analyze-sequences", "\u6C47\u603B\u5E8F\u5217", "\u628A\u8BB0\u5F55\u6570\u5199\u6210 sequence-summary.json\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/summarize_sequences.py`,
      needs: ["inspect-inputs"],
      inputs: [],
      outputs: [{ path: "sequence-summary.json", mediaType: "application/json", minBytes: 20 }]
    }),
    step("interpret-results", "\u89E3\u8BFB\u7ED3\u679C", "\u9605\u8BFB sequence-summary.json\uFF0C\u8BF4\u660E\u6837\u672C\u6784\u6210\u4E0E\u9700\u8981\u4EBA\u5DE5\u5224\u65AD\u7684\u90E8\u5206\u3002")
  ]
};
var localDataAnalysis = {
  id: "local-data-analysis",
  badge: "\u6570\u636E",
  title: "\u672C\u5730\u6570\u636E\u5206\u6790",
  description: "\u5256\u6790\u5DE5\u4F5C\u533A\u91CC\u7684 CSV/TSV\uFF0C\u7EDF\u8BA1\u6570\u503C\u5217\u5E76\u751F\u6210\u62A5\u544A\u3002",
  preset: "standard",
  steps: [
    step("inspect-data", "\u5256\u6790\u8868\u683C", "\u8BFB\u53D6\u524D 5000 \u884C\uFF0C\u62A5\u544A\u884C\u6570\u3001\u5217\u6570\u4E0E\u7F3A\u5931\u503C\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/profile_tables.py`,
      inputs: [],
      outputs: [{ path: "data-profile.json", mediaType: "application/json", minBytes: 20 }]
    }),
    step("analyze-data", "\u89E3\u8BFB\u6570\u636E", "\u6839\u636E data-profile.json \u8BF4\u660E\u6570\u636E\u7ED3\u6784\u4E0E\u9700\u8981\u6F84\u6E05\u7684\u95EE\u9898\u3002", {
      needs: ["inspect-data"],
      inputs: [{ path: "data-profile.json" }]
    })
  ]
};
var literatureEvidence = {
  id: "literature-evidence",
  badge: "\u6587\u732E",
  title: "\u6587\u732E\u8BC1\u636E",
  description: "\u68C0\u7D22 PubMed \u5E76\u6574\u7406\u8BC1\u636E\u8868\uFF0C\u660E\u786E\u6807\u6CE8\u54EA\u4E9B\u5217\u672A\u7ECF\u8BC4\u4F30\u3002",
  preset: "standard",
  steps: [
    step("define-search", "\u5B9A\u4E49\u68C0\u7D22\u5F0F", "\u628A\u7814\u7A76\u95EE\u9898\u8F6C\u6210\u53EF\u590D\u73B0\u7684 PubMed \u68C0\u7D22\u5F0F\u3002"),
    step("collect-evidence", "\u68C0\u7D22\u5E76\u6574\u7406", "\u7528\u68C0\u7D22\u5F0F\u67E5\u8BE2 PubMed\uFF0C\u628A\u7ED3\u679C\u6392\u6210\u8BC1\u636E\u8868\u3002", {
      needs: ["define-search"]
    })
  ]
};
var medicalMetadata = {
  id: "medical-metadata",
  badge: "\u533B\u5B66",
  title: "\u533B\u5B66\u4E0E\u7EC4\u5B66 \xB7 \u7ED3\u6784\u534F\u4F5C",
  description: "\u53EA\u63A5\u6536\u4EBA\u5DE5\u5BA1\u6838\u7684\u7ED3\u6784\u63CF\u8FF0\uFF0C\u4E0D\u8BBF\u95EE\u6587\u4EF6\u3001\u4E0D\u6267\u884C\u4EE3\u7801\u3002",
  preset: "medical-metadata",
  steps: [
    step("coordinate-scope", "\u603B\u534F\u8C03\u4E0E\u8303\u56F4\u754C\u5B9A", "\u7406\u89E3\u76EE\u6807\u5E76\u62C6\u5206\u5B50\u4EFB\u52A1\u3002"),
    step("evidence-review", "\u6587\u732E\u8BC1\u636E", "\u53EA\u57FA\u4E8E\u516C\u5F00\u7814\u7A76\u5173\u952E\u8BCD\u68C0\u7D22\u3002", { needs: ["coordinate-scope"] }),
    step("biology-method-review", "\u65B9\u6CD5\u4E0E\u751F\u7269\u5B66", "\u9759\u6001\u5206\u6790\uFF0C\u4E0D\u6267\u884C\u4EE3\u7801\u3002", { needs: ["coordinate-scope"] }),
    step("code-technical-debug", "\u4EE3\u7801\u5BA1\u67E5", "\u4EE5\u6587\u5B57\u7ED9\u51FA\u4EE3\u7801\uFF0C\u53EA\u505A\u9759\u6001\u5206\u6790\u3002", { needs: ["coordinate-scope"] }),
    step("independent-review", "\u72EC\u7ACB\u5BA1\u6838", "\u5728\u72EC\u7ACB\u4E0A\u4E0B\u6587\u4E2D\u590D\u6838\u3002", { needs: ["biology-method-review"] }),
    step("human-decision-report", "\u6574\u5408\u62A5\u544A", "\u72B6\u6001\u4E3A\u5F85\u4EBA\u51B3\u7B56\u3002", { needs: ["independent-review"] })
  ]
};
var containerAnalysis = {
  id: "container-r-analysis",
  badge: "\u5BB9\u5668",
  title: "\u5BB9\u5668\u5185\u7EDF\u8BA1\u5EFA\u6A21",
  description: "\u5728\u56FA\u5B9A digest \u7684 R \u955C\u50CF\u4E2D\u62DF\u5408\u7EBF\u6027\u6A21\u578B\uFF0C\u7F51\u7EDC\u5173\u95ED\uFF0C\u4EA7\u7269\u6309\u5B57\u8282\u54C8\u5E0C\u767B\u8BB0\u3002",
  preset: "biomni",
  backend: "container",
  image: "docker.m.daocloud.io/library/r-base@sha256:205aca88535e1a066c72c84d7a149747665da41cafabb951ccae8dd4e6f0c308",
  steps: [
    step("inspect-data", "\u68C0\u67E5\u8868\u8FBE\u91CF\u77E9\u9635", "\u5728\u5BB9\u5668\u5185\u786E\u8BA4 expression \u4E0E group \u4E24\u5217\u5B58\u5728\u3002", {
      // Runs inside the image: file(1) and head are part of it, and a host Python script
      // is not, because the mount only carries the workspace.
      command: "head -n 3 expression.csv",
      inputs: [{ path: "expression.csv", required: true }],
      outputs: [],
      timeoutMs: 6e4
    }),
    step("fit-model", "\u62DF\u5408\u7EBF\u6027\u6A21\u578B", "\u5728\u5BB9\u5668\u5185\u7528 R \u62DF\u5408 expression ~ group\uFF0C\u5199\u51FA\u6A21\u578B\u6458\u8981\u3002", {
      command: "Rscript model.R expression.csv model-result.json",
      needs: ["inspect-data"],
      inputs: [{ path: "expression.csv", required: true }],
      outputs: [{ path: "model-result.json", mediaType: "application/json", minBytes: 80 }],
      timeoutMs: 18e4
    })
  ]
};
var bioconductorDE = {
  id: "bioconductor-de",
  badge: "\u5BB9\u5668",
  title: "Bioconductor \u5DEE\u5F02\u8868\u8FBE",
  description: "\u5728\u9489\u6B7B digest \u7684 limma/edgeR \u955C\u50CF\u4E2D\u505A\u5DEE\u5F02\u8868\u8FBE\uFF0C\u7F51\u7EDC\u5173\u95ED\uFF0C\u7ED3\u679C\u53EF\u4E0E\u771F\u503C\u5BF9\u7167\u3002",
  preset: "biomni",
  backend: "container",
  image: "dsh-bioc@sha256:cb4d683b14e68c6986a14f7809094a3224f764796fa22d9854e440c226cf30b5",
  steps: [
    step("inspect-inputs", "\u68C0\u67E5\u8F93\u5165\u77E9\u9635", "\u5728\u5BB9\u5668\u5185\u786E\u8BA4\u8BA1\u6570\u77E9\u9635\u7684\u8868\u5934\u4E0E\u6837\u672C\u6570\u3002", {
      command: "head -n 1 counts.csv",
      inputs: [{ path: "counts.csv", required: true }, { path: "samples.csv", required: true }],
      timeoutMs: 6e4
    }),
    step("differential-expression", "limma \u5DEE\u5F02\u8868\u8FBE", "TMM \u5F52\u4E00\u5316\u3001voom\u3001eBayes\uFF0C\u5199\u51FA\u6392\u5E8F\u7ED3\u679C\u4E0E\u6458\u8981\u3002", {
      command: "Rscript differential_expression.R counts.csv samples.csv de-results.csv de-summary.json",
      argv: ["Rscript", "differential_expression.R", "counts.csv", "samples.csv", "de-results.csv", "de-summary.json"],
      needs: ["inspect-inputs"],
      inputs: [{ path: "counts.csv", required: true }, { path: "samples.csv", required: true }],
      outputs: [
        { path: "de-results.csv", minBytes: 1e3 },
        { path: "de-summary.json", mediaType: "application/json", minBytes: 100 }
      ],
      timeoutMs: 3e5
    })
  ]
};
var timeCourse = {
  id: "time-course-periodicity",
  badge: "\u65F6\u95F4\u5E8F\u5217",
  title: "\u65F6\u95F4\u5E8F\u5217\u5468\u671F\u5206\u6790",
  description: "\u5BF9\u6BCF\u4E2A\u65F6\u95F4\u70B9\u5355\u6837\u672C\u7684\u8868\u8FBE\u8C31\u505A\u5468\u671F\u62DF\u5408\u3002\u4E0D\u5047\u88C5\u6709\u91CD\u590D\uFF0C\u4E5F\u4E0D\u505A\u7EC4\u95F4\u6BD4\u8F83\u3002",
  preset: "biomni",
  backend: "container",
  image: "dsh-bioc@sha256:cb4d683b14e68c6986a14f7809094a3224f764796fa22d9854e440c226cf30b5",
  steps: [
    step("parse-matrix", "\u89E3\u6790\u8868\u8FBE\u77E9\u9635", "\u628A GEO series matrix \u8F6C\u6210 CSV\uFF0C\u5E76\u62A5\u544A\u7F3A\u5931\u503C\u6BD4\u4F8B\u3002", {
      command: "head -n 1 expression.csv",
      inputs: [{ path: "expression.csv", required: true }],
      timeoutMs: 12e4
    }),
    step("periodicity", "\u5468\u671F\u62DF\u5408", "\u6B63\u5F26\u62DF\u5408 + F \u68C0\u9A8C + BH \u6821\u6B63\uFF0C\u5468\u671F\u4ECE\u65F6\u95F4\u8F74\u63A8\u5BFC\u3002", {
      command: "Rscript periodicity_analysis.R expression.csv samples.csv periodic-genes.csv periodicity-summary.json",
      argv: ["Rscript", "periodicity_analysis.R", "expression.csv", "samples.csv", "periodic-genes.csv", "periodicity-summary.json"],
      needs: ["parse-matrix"],
      inputs: [{ path: "expression.csv", required: true }, { path: "samples.csv", required: true }],
      outputs: [
        { path: "periodic-genes.csv", minBytes: 1e3 },
        { path: "periodicity-summary.json", mediaType: "application/json", minBytes: 100 }
      ],
      timeoutMs: 6e5
    })
  ]
};
var biomniToolkit = {
  id: "biomni-toolkit",
  badge: "Biomni",
  title: "Biomni \u5DE5\u5177\u94FE",
  description: "\u8C03\u7528 Biomni \u7684\u5206\u5B50\u751F\u7269\u5B66\u5DE5\u5177\uFF0C\u6BCF\u4E2A\u7ED3\u679C\u90FD\u767B\u8BB0\u5B57\u8282\u6570\u4E0E\u54C8\u5E0C\u3002\u4E0D\u7ECF LLM \u9009\u5DE5\u5177\u3002",
  preset: "biomni",
  steps: [
    step("inventory", "\u6E05\u70B9\u53EF\u7528\u5DE5\u5177", "\u5217\u51FA\u80FD\u52A0\u8F7D\u7684 Biomni \u6A21\u5757\u4E0E\u51FD\u6570\u6570\uFF0C\u4EE5\u53CA\u56E0\u7F3A\u4F9D\u8D56\u800C\u4E0D\u53EF\u7528\u7684\u6A21\u5757\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/biomni_bridge.py list --json biomni-inventory.json`,
      outputs: [{ path: "biomni-inventory.json", mediaType: "application/json", minBytes: 200 }],
      timeoutMs: 3e5
    }),
    step("restriction-sites", "\u9176\u5207\u4F4D\u70B9\u5206\u6790", "\u5728\u7ED9\u5B9A\u5E8F\u5217\u4E0A\u627E\u9650\u5236\u9176\u5207\u4F4D\u70B9\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/biomni_bridge.py call molecular_biology find_restriction_enzymes --args "{"sequence": "ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG", "is_circular": false}" --out restriction-sites.json`,
      needs: ["inventory"],
      outputs: [{ path: "restriction-sites.json", mediaType: "application/json", minBytes: 100 }],
      timeoutMs: 3e5
    }),
    step("reading-frames", "\u5F00\u653E\u9605\u8BFB\u6846\u6CE8\u91CA", "\u5728\u6B63\u94FE\u4E0A\u627E\u5F00\u653E\u9605\u8BFB\u6846\uFF0C\u6700\u77ED 30 bp\u3002", {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/biomni_bridge.py call molecular_biology annotate_open_reading_frames --args "{"sequence": "ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG", "min_length": 30}" --out reading-frames.json`,
      needs: ["inventory"],
      outputs: [{ path: "reading-frames.json", mediaType: "application/json", minBytes: 100 }],
      timeoutMs: 3e5
    })
  ]
};
var custom = {
  id: "custom",
  badge: "\u81EA\u5B9A\u4E49",
  title: "\u81EA\u5B9A\u4E49\u6D41\u7A0B",
  description: "\u4ECE\u7A7A\u767D\u5F00\u59CB\u642D\u5EFA\u4F60\u81EA\u5DF1\u7684\u7814\u7A76\u6D41\u7A0B\u3002",
  preset: "standard",
  steps: [step("step-1", "\u7B2C\u4E00\u6B65", "\u63CF\u8FF0\u8FD9\u4E00\u6B65\u8981\u505A\u4EC0\u4E48\u3002")]
};
var WORKFLOW_TEMPLATES = Object.freeze([
  sequenceAnalysis,
  localDataAnalysis,
  literatureEvidence,
  biomniToolkit,
  bioconductorDE,
  timeCourse,
  containerAnalysis,
  medicalMetadata,
  custom
]);

// client/GlowingEffect.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var joinClass = (...values) => values.filter(Boolean).join(" ");
var GlowingEffect = (0, import_react.memo)(function GlowingEffect2({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = "default",
  glow = false,
  className = "",
  movementDuration = 2,
  borderWidth = 1,
  disabled = false
}) {
  const containerRef = (0, import_react.useRef)(null);
  const lastPosition = (0, import_react.useRef)({ x: 0, y: 0 });
  const frameRef = (0, import_react.useRef)(0);
  const reducedRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = query.matches;
    };
    apply();
    query.addEventListener?.("change", apply);
    return () => query.removeEventListener?.("change", apply);
  }, []);
  (0, import_react.useEffect)(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);
  const handleMove = (0, import_react.useCallback)((event) => {
    const element = containerRef.current;
    if (!element) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const pointer = event?.clientX !== void 0 ? { x: event.clientX, y: event.clientY } : lastPosition.current;
      if (event?.clientX !== void 0) lastPosition.current = pointer;
      const centerX = left + width * 0.5;
      const centerY = top + height * 0.5;
      const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY);
      if (distance < 0.5 * Math.min(width, height) * inactiveZone) {
        containerRef.current.style.setProperty("--active", "0");
        return;
      }
      const isActive = pointer.x > left - proximity && pointer.x < left + width + proximity && pointer.y > top - proximity && pointer.y < top + height + proximity;
      containerRef.current.style.setProperty("--active", isActive ? "1" : "0");
      if (!isActive) return;
      let angle = 180 * Math.atan2(pointer.y - centerY, pointer.x - centerX) / Math.PI + 90;
      angle = angle < 0 ? angle + 360 : angle;
      containerRef.current.style.setProperty("--start", String(angle));
      if (reducedRef.current) containerRef.current.style.setProperty("--active", "0");
    });
  }, [inactiveZone, proximity]);
  (0, import_react.useEffect)(() => {
    if (disabled) return;
    const onScroll = () => handleMove();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [disabled, handleMove]);
  if (disabled) return null;
  const gradient = variant === "white" ? "repeating-conic-gradient(from 236.84deg at 50% 50%, #ffffff, #ffffff calc(25% / var(--repeating-conic-gradient-times)))" : "radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),repeating-conic-gradient(from 236.84deg at 50% 50%, #dd7bbb 0%, #d79f1e calc(25% / var(--repeating-conic-gradient-times)), #5a922c calc(50% / var(--repeating-conic-gradient-times)), #4c7894 calc(75% / var(--repeating-conic-gradient-times)), #dd7bbb calc(100% / var(--repeating-conic-gradient-times)))";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref: containerRef,
      className: joinClass("rw-glow", className),
      style: {
        "--blur": blur + "px",
        "--spread": spread,
        "--start": "0",
        "--active": "0",
        "--glowingeffect-border-width": borderWidth + "px",
        "--repeating-conic-gradient-times": "5",
        "--movement-duration": movementDuration + "s",
        "--gradient": gradient
      },
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: joinClass("rw-glow-inner", glow && "rw-glow-inner--on") })
    }
  );
});

// client/DnaHelix.jsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var COLOURS = ["#2f5fd0", "#0f7b5f", "#a06a00", "#7c4dd6", "#c0392b"];
function project(t, phase, radius, width, height, turn) {
  const angle = t * Math.PI * 2 * turn + phase;
  return {
    x: width / 2 + Math.cos(angle) * radius,
    y: t * height,
    z: Math.sin(angle)
  };
}
function DnaHelix({ events = [], height = 260, turns = 3.4, selected = null, onSelect }) {
  const canvasRef = (0, import_react2.useRef)(null);
  const frameRef = (0, import_react2.useRef)(0);
  const phaseRef = (0, import_react2.useRef)(0);
  const hoverRef = (0, import_react2.useRef)(null);
  const [hovered, setHovered] = (0, import_react2.useState)(null);
  const [reduced, setReduced] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener?.("change", apply);
    return () => query.removeEventListener?.("change", apply);
  }, []);
  const rungs = (0, import_react2.useMemo)(() => {
    const count = Math.max(events.length, 1);
    return Array.from({ length: count }, (_, index) => ({
      t: count === 1 ? 0.5 : index / (count - 1),
      index,
      event: events[index] ?? null,
      colour: COLOURS[index % COLOURS.length],
      verified: events[index]?.verified !== false
    }));
  }, [events]);
  const draw = (0, import_react2.useCallback)(() => {
    const canvas2 = canvasRef.current;
    if (!canvas2) return;
    const ctx = canvas2.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas2.clientWidth;
    if (canvas2.width !== Math.round(width * dpr) || canvas2.height !== Math.round(height * dpr)) {
      canvas2.width = Math.round(width * dpr);
      canvas2.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(canvas2);
    const ink = styles.getPropertyValue("--dna-ink").trim() || "#0f1115";
    const faint = styles.getPropertyValue("--dna-faint").trim() || "rgba(0,0,0,.12)";
    const accent = styles.getPropertyValue("--dna-accent").trim() || "#2f5fd0";
    const radius = Math.min(width * 0.34, 128);
    const pad = 18;
    const innerHeight = height - pad * 2;
    const drawRung = (rung, phase) => {
      const a = project(rung.t, phase, radius, width, innerHeight, turns);
      const b = project(rung.t, phase + Math.PI, radius, width, innerHeight, turns);
      const depth = (a.z + b.z) / 2;
      const active = hoverRef.current === rung.index || selected === rung.index;
      const nearness = (depth + 1) / 2;
      const depthScale = 0.72 + nearness * 0.56;
      ctx.globalAlpha = active ? 1 : 0.3 + nearness * 0.7;
      ctx.strokeStyle = rung.verified ? rung.colour : faint;
      ctx.lineWidth = active ? 3 : 0.9 + nearness * 1.5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + pad);
      ctx.lineTo(b.x, b.y + pad);
      ctx.stroke();
      for (const point of [a, b]) {
        const pointNearness = (point.z + 1) / 2;
        const r = active ? 5.5 : (2.6 + pointNearness * 2.4) * depthScale;
        ctx.globalAlpha = active ? 1 : 0.35 + pointNearness * 0.65;
        ctx.beginPath();
        ctx.arc(point.x, point.y + pad, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = rung.verified ? rung.colour : faint;
        ctx.fill();
        if (active) {
          ctx.beginPath();
          ctx.arc(point.x, point.y + pad, r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    const strand = (basePhase, offset) => {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      for (let i = 0; i < 120; i++) {
        const from = project(i / 120, basePhase + offset, radius, width, innerHeight, turns);
        const to = project((i + 1) / 120, basePhase + offset, radius, width, innerHeight, turns);
        const nearness = ((from.z + to.z) / 2 + 1) / 2;
        ctx.globalAlpha = 0.16 + nearness * 0.4;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y + pad);
        ctx.lineTo(to.x, to.y + pad);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    strand(phaseRef.current, 0);
    strand(phaseRef.current, Math.PI);
    const ordered = [...rungs].sort((left, right) => Math.sin(left.t * Math.PI * 2 * turns + phaseRef.current) - Math.sin(right.t * Math.PI * 2 * turns + phaseRef.current));
    for (const rung of ordered) drawRung(rung, phaseRef.current);
  }, [height, rungs, selected, turns]);
  (0, import_react2.useEffect)(() => {
    const tick = () => {
      if (!reduced) phaseRef.current += 6e-3;
      draw();
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw, reduced]);
  const handleMove = (event) => {
    const canvas2 = canvasRef.current;
    if (!canvas2) return;
    const rect = canvas2.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = Math.min(canvas2.clientWidth * 0.34, 128);
    const pad = 18;
    const innerHeight = height - pad * 2;
    let best = null;
    let bestDistance = Infinity;
    for (const rung of rungs) {
      const a = project(rung.t, phaseRef.current, radius, canvas2.clientWidth, innerHeight, turns);
      const b = project(rung.t, phaseRef.current + Math.PI, radius, canvas2.clientWidth, innerHeight, turns);
      const distance = Math.hypot(x - (a.x + b.x) / 2, y - (a.y + b.y) / 2 + pad);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = rung.index;
      }
    }
    const next = bestDistance < 26 ? best : null;
    if (next !== hoverRef.current) {
      hoverRef.current = next;
      setHovered(next);
    }
  };
  const activeEvent = hovered !== null ? events[hovered] : selected !== null ? events[selected] : null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "rw-dna", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "canvas",
      {
        ref: canvasRef,
        className: "rw-dna-canvas",
        style: { height },
        onMouseMove: handleMove,
        onMouseLeave: () => {
          hoverRef.current = null;
          setHovered(null);
        },
        onClick: () => {
          if (hovered !== null && onSelect) onSelect(hovered);
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "rw-dna-caption", "aria-live": "polite", children: activeEvent ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { children: activeEvent.type ?? "event" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: activeEvent.label ?? "" })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "rw-dna-hint", children: reduced ? "\u5BA1\u8BA1\u94FE \xB7 \u5DF2\u505C\u6B62\u52A8\u753B" : "\u5BA1\u8BA1\u94FE \xB7 \u6BCF\u6761\u6A2A\u6863\u662F\u4E00\u4E2A\u4E8B\u4EF6" }) })
  ] });
}

// .build/assets.js
var assets_default = { "fragment-audit-chain.png": "data:image/png;base64,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ADkESAAAAAAAAHIIkAAAAAAAAOQQIAEAAAAAAMghQAIAAAAAAJBDgAQAAAAAACCHAAkAAAAAAEAOARIAAAAAAIAcAiQAAAAAAAA5BEgAAAAAAAByCJAAAAAAAADkECABAAAAAADIIUACAAAAAACQQ4AEAAAAAAAghwAJAAAAAABADgESAAAAAACAHAIkAAAAAAAAOQRIAAAAAAAAcgiQAAAAAAAA5BAgAQAAAAAAyCFAAgAAAAAAkEOABAAA/89+HQsAAAAADPK33jOMsggAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgggQAADBBAgAAmCABAABMkAAAACZIAAAAEyQAAIAJEgAAwAQJAABgAQAA///fdhL0AAAABklEQVQDABAIDiBNhWAPAAAAAElFTkSuQmCC", "fragment-parallel.png": "data:image/png;base64,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", "fragment-steps.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGAAAAHQCAIAAABhnossAAAQAElEQVR4nOzdC1xM2R8A8LNpdprYGaJJ0ZTtiZJHCpVHyKr8i7RLNu+s2mVZLK1XHrtYLCsK5RlhK2pVSPKopOSRQs9VI6WJmFFNs1Pt/947U81MMzXTQ+H33T4708ydO/feuZPzu79zfkf5v//+QwAAAAAAAAAAEFJCAAAAAAAAAAAIECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAhBgAQAAAAAAAAAQhAgAQAAAAAAAIAQBEgAAAAAAAAAIAQBEgAAAAAAAAAIQYAEAAAAAAAAAEIQIAEAAAAAAACAEARIAAAAAAAAACAEARIAAAAAAAAACEGABAAAAAAAAABCECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAhBgAQAAAAAAAAAQhAgAQAAAAAAAIAQBEgAAAAAAAAAIAQBEgAAAAAAAAAIQYAEAAAAAAAAAEIQIAEAAAAAAACAEARIAAAAAAAAACAEARIAAAAAAAAACEGABAAAAAAAAABCECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAhBgAQAAAAAAAAAQhAgAQAAAAAAAIAQBEgAAAAAAAAAIAQBEgAAAAAAAAAIQYAEAAAAAAAAAEIQIAEAAAAAAACAEARIAAAAAAAAACAEARIAAAAAAAAACEGABAAAAAAAAABCECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAgpIwAAkIXHZiMajYxaoORBVApTcJdqOMHGqKvM98hKL+jO0NFo2duIq+IhlSZWUw1/8wAAAADQDMggAfCpYQV9bTDabVvQA1ZVtcyFqnJi93uO761poDMvjI1aIu3wPPd5gh/vqyWyl3v6x9djrI36aXenGxiN97zIRC33YJulJt3S0y8mh9foOV5BhI+dCf1rxfaGud+K3l2t7sczFrVUFZtV8jT+4rmjMf8gAAAAAHRmcDUVdAQeu4SNN2FVaPS2SBu0C6xFS2wjGdtGFfQRqYi/GMt+hPYsubxnCSIP2nTt1hJD8SWy94+xXpde99vlZSsjJwQ40lC74MXs8ysQ3K1ml1SZDmKglmLu/2EPvqpzPl+f81ExdVm3Y/sPI2h4aBT7x6of9sSwiKV+WHNxgv+U9tibCnZJBXbGvM1KymGjqoKUhKyKqoKk+Cw2u4TVELDprLK28zZEAAAAAOisOjxAil9n4hki68muRqNHMlQQzWjk8EGDhpt92Xkb0/VurTXxiJDyuN32e76OzW991h77/x2RcgnddX/G1rHog1aVEx8U6h90+u6jokaX8Gn0QSOnf/2Ni7uDKa3ulCw46mb3xyNZa+uuZ2PRT4WmZz3a2ma0KV1F9oks+YkM+Cnmr/k6Uhet5mUlnQ7xPx10Pb2kUQaCpmVq6eTiPmPWFFNaU+sX30zs1NXpSh80znr0WAsjGadvW+2pnKouR8aI/Go5vHFj3dB1gc26ZfF1v/JClvi4jttj17XJ1ebEX33CEX0kuaD+7tu02KiLGiLP0QwmjjXEw85/jqw/J3Ksn/qYqflIrvqb4Lf+E1BzCvznrXsqsj3p6Ygu+KRKLm6ri47wvQnzWOmYFeDQBiHSDR+jH0KrWCx2tQIvKjgXluXtbYQAAAAA0El1eIDEKyliye59wwrJIW5PCn/XsPFa5+PlOoTeaa/oV5WxSoqkPB70V+ROR5fmNjs18PfUxk1zTEkV+nBV/RO1aua8oBzZS7BZjy77Pboci1ITfviy7sEKJnZuyHpFSVFYFt6AP70f+58yfcr64/s9zWnSTmfJT4Qm/VCy7/h5zPWJYcnexqL0GP/0mBsoLdFLp4n1i2GVhGXjtyf34P/XctgauJfIaYhroz2VD+9iRFTDb3Qv9xFSFtKYvWfrIfOGeIN92mPLrILt5ki2ksve7huzZTzJClkzT+w6SH+ftERDHcQOWeeThdpCjp/72nTRB2iL9tadS4wfdi0PGL+nPl6rCpvnbpPx92w6aqWqkiY+OJmYYSFPvdf1RwAAAADonD6wMUgl8X5Lxpv0tvSJeY0+MJFhFyuaWyY+NIiHPirV7Ji11r3Nm4yO2uBdWBc32uuMWHOrZWNlsMSdv72OfVPRUdsoilpnbzB6S2pLN7MN9hRVRP4d2fCbzhyXQdKXY/ywe75oJMc+vHp/Ww+eYUeuWXIZtYHq7P2LfcRycLRZAetFwrkh3gGLxPN+y2bub9dzsinMmButGWgFAAAAgPb1YRZpyPH72mD81la0MztCbFBYMw3wWxGnP+REUSPV2UFfm3/tn43ej3+O/s+zJeUE2Jc97damovfl0R5795OtC8VauqeYkrDgiw2/GXp8I3swzAjvXV8Rd7RsfvC9llV8rSG51ybYsSuXhNWf8DRzF/fZs4Q/I8RyOzS17k2vKGaJw7oHYq9w9feR6BBosfWMh1iIlL7OzjOm/f+E0LToGgY2rrNn/bDJP+hYWHJmRkEx65ZnywdaAQAAAKC9db4iDWS6Rs+G39hFLBkxQ/ouu2ndk6/9YIA+FLdORZbMnq8h6+nq2KCjH1P+CG+2LrkhrQWqTNMwHW5nKjgSJWmx0kYlSWH+w7HvLQV3Xz+KiY0NuZwueW5c3ub71EXBzkupOxsHG8qGruuXu1oPN+ujgvejepSefDfy4umwW0VyrI9sOuWbQXUt+pK0iNhHjXbu1uqNMS7+sof0tNOeYlh/n4oXeZ/5rl8y91uZiw7dkaIofv+S8fuXyF6AGCOk0h+LcMQSIwU3Tt8SPkAe5DTdTDQ+6aNx0dMtpP7I0FwCQvztBAtUZ+8ac7phSdr8kE1Nde3L8p329TmxQ0z7xn/XV436MSqb7zy/PEakox1ih309nvb3te2jGy0rOq6MLfqhh3kaxQsGkk0PyPAZLfYi8ujlez0GqaCujEGDNFQ+vtoeAAAA2sqbRyFn77HVhrl+M6idKiCBVup0AZLRL9HJS8Qur1YVpYf8vmzVyUZtROwa8GK/Kde8dFCn5TDFKepi/Qj+1NC/i+Z7aElftCridMMgjSGmgx6kP0IfsAJ/yWYrjj5h5X6flWMNJSsNVPOybhzZtTayyVXqjHZysBPed5gy39v3dZSH+bwQsTfBOy+t66/I5fk7oYESmznEOzl6uZFIPQWNCYxBExw8vP2rcqJW/VHSzAq/dNm6V+Sc3ItlStaM/vpogegyvLCgy3vtXGQV7WifPcU8PbJfJFU25btZGqi53ZGbxoTlvuKVFGI86wMkna/X7xFNQGX5jrds6FyHJXy2C6MjIq7e2hCwmW6N2W4h+68Uvp6NYkOPUH/vGN8J0v+9GeL916ZYseWxXNw0Wsx5bwvxF8gcV1bNrnu88ahAHbtZLlPaNskGAADgo1RZeDf1URFdwx4CpM7qAyjzraJl6r73mvvPYe62nhcluiY98FkXtiDIpdPWtsvp3s0UC+Tqfk0NDGN6LJHaqBUbOq8yfLjRBx0gFZ1eIj5iHkNz9E856qIh9YxTJhtN8AqY4IUU0tMhwN8lxC1M9LFHj7IRUiBsKMnOkWjpui4Xi45EqRg4+PojRdEmbI/Z/shojVgvvqt305GLubyraIs9xdw64icSp7l87dRBXxxe9sWLIqfHBO+VQ3klLPy7XRW/cbZIXG23y9+VxirBnulC0+gpsbW8rD32llskTjPTrceXG8n+q2a05PxfT8zFQvcHe+zGs6XmkQAAAHwgqtmZd2IuJtxgvmZX4nVFSapf9DGwcZszcYBcf9u5T8LP3i5GJFP7OdZ49xb+q5zEmKuxqYUv2Fw+vjoKja7r4DrT3vQLpCBswx6/QqoMs8EMCuo0+MV3Anafu81wP7V0qMyF2Pk3zodG3y8pEhzSbhqDJzjNdehPk3d0TnVpckxwVMLDYi6/Fj+GWn3MnBe6jNL8MGYY+nDmQdJyCUqmeQx2E7+Oji6eDC1xmSW935qgavPJqItJWW/x3zXMJkyY6OLiPtJQaq3kkgdRKaJdhBjDpwwhxkK8Tr8YHBYUHpqGX23vbjTSwdVrgZyV9IyGD1c53ZD7yjpyOmuJtAq/FZEhIumTKcNN2YeRPKrYzOy7d29dT0jLuHsrj9jL5nZTshxzfcFlHvPW6dNBEVGC9WgMmv71fLeFYw1bUFc6ZZ/PLYmHhvjEyIqOWsPQ1AiFtaYMWhVbMoXC5vEQauPIQcN51ug1qbfE3vetQmto/Z4idth+8T6c5Lb+OGI86V+fk/pM9jpz+jqR312Dc2IezLTbSQSNsWssjddIX+FKa6OVxD286p1orph9a834/x2WKHVAdw8+31yfW5qdb9TWbGuxMUtYHmlwSUDiMVctBAAA4INTGr5r+UWxf835le/y06J/W3l91ML1XpbNRSavEkIuPspBXzhNIpqTxdGb1l3NF1sdl/3iafDeDVFD3Xd+P1QVKSA75pxfGtKy79dZAiR+ye3AgIDU13jgJ/sqa2Vm2G97E/L5Iq8rL7kbfvhusvXGNS4G3VAzal/f2Lc7MJ0r8npuUf4dv3Vpt79dsXJcT9TpfVATxdImBJyZH2N/VCxEio+6VTHLtdFwjpLI5f+bfzpLbH4SVszJ9JiTe1YpG7ofPe/rKFnkN+3wPHfR5h0+smJ4iu98143xIu+IF26+FbZniYHXX9E+ds1+xCMd3MlHA+rbpTIq/JacPiIyNY2D3ZfsXagZJZE+Hmv8pI2KqdtN+oStp/x/MJe8eCJZjpkouKwSudxu9mnRbmAlRX6PLvuto0/YeeGYR39FAobq+JATEr3WbHyDvIzey7mmoaWh4PLYnwexMhIxf/hlOcpMIrUQXUNys0pKsGPUmqSFonv6aN+2GCkPM35IZP0g8Vh16ioD+wDxz9BoU2rykjYsLUCz8P7JdadbSAteyssOmOmwSnJ4G801ONH3KzmOqLLhD+eD0yQutbCjPEzMU/66tpPonWe26FiQoEAFKvhrpc/F+pqZI7yCvhtO3GOYIQAAAJ0Cv6Yadesz8X9O9kP7du9B4r95/eJ+tN/ZR6W13NuBBwz0Vk7s1dTL82Pi8bKmDBs7QTfpWvSvEsVglL3bV2Z9en1B4r17W5gWEhh2+w1i3w/aeVln41dt1L5nXf15wVXpT5k1mdtpET4rJzEqIuT2C3Ztc4syo3/bnZCPLdZN13X+jIkDNEiVLx5GhQZcy68sTtgZ2GfvshFNRoncu/sF0ZGylrmLl5u5riq/NO8ecQy5D0/5h+itc+30tYo+qAAJM+KndeZHV4l1VopPSUeuYnO5SL26LKI6O2i2SdqmhFtLmp7Pnp2ydrydv4z15Ph9bV7y18O6keWydLGZMosc0HDlnhkUmr5uvan4Qqy/Q0V2ydFxCq2kuQCJGbLNr5maAazYdXbTkBx1LLJOu3gsiWfLWMkqK3ueQsUwUqMkipWrzF/m3j7X5tlJCRJJldHDTZEiVIZYG6FYsZU83WZpdnfrcX8pExa1WAVbSNCDwQAAEABJREFU8vBqaCi09tbuKTts6x55S0tn+S4LaHQ2ZD1RuEdfe6j657SH/XLJrraINiUgMeAruY8odqklZk+J3XLxaunMgK8NYmYdi9njoDHEYcoQ4rGio76iMwroWE9xkjVlbaPJcJvCsHAyVSzABQAAIIO6jceBqRr1Xb9IPTQMxs/7lXx42bGnlbUvbiaUTHSW/Re39mlswjvsdvA4a+G/Ij0sV+2yV6//J4X0hbqxtZePMv/nc3d5KCchufQre3XUFpSUaV/ISCt90dbt8+TD8w4LB/iS+vQfWP70oczyWK+vnriKR0eq/X/8ddFwQbKI1me424+6X+xaHv6iMv3vkPQRc5pog6SHBqThuSNd+2VbXfoQDynjx3Bbz89/Onyj8nXEiRt268d28o7tH1qAhOh2U01XpYoOPOBlZbOQSF3gLN9pjaIjsoaWSol4qbRHGx2W9M/wnSA7U3B5jSu7yepq7LCvPScUBLvI/owLCljoh1leGkf31Kd+S/xOp6zfbiG61D+hgSLxkaubiwryQwoj08g8tmQZvPR1rttGp3oPauJz/mePx5Km91OOlYjISkoQH9VDdp9ug9rD66iV62LFHqHN95iAFPPl9B9sfJbEiz+IxZb2BltNZ+3c7+Nu2hZf4fhYieyNkaEiwUar9zRl25oYORfN8fPYIq0ye3Z2AZogWhCl5Eb8W2sbqYlBFVMH1yHdG1Wxe5t2LuqR1EqNdJedOxx7Sz5a8vfqNSGisRAvfr2U6IjufjLR11HBj8lg1t8x6H+SMRIqeFJQJbJHJZGhKUhOjSbDbYrLX2X+dggAAEAbINGlXHNUtTYffOzpbSxBxHyBXZWU9Vp+wvUbeM/6ofbWdbGKak8p8U+3EaOMz91NQ6i4MB8LyVBb6DVu7Tb799m5m0QzsP/GxdkSRXs/fShroTfpt/PxWwM7l+HiXenUp0x3uvlnxBtuYvLTOaYyC+k+SX5UifBD6ja1j/jb95/janDjRA7KT015M3ZiD9SZfXjzIOkYSM5sWcIWaZA/2Pa1eFUri1XRBaznWRk5b1k5MatEh8Wzg1b+0dSgDjYRNigbuuITmBwLOrb9hxGSvfKIastNrIL39i1CQ1zcRRvDvNMhd8QWyjp3tGEzyPPdFWn4Gn3jE3QttaCY9bbsOf5/1vPkY7PEyvox9/jGNrkKniA6olt4bid2039r47lxmHt2RshbgrwgW6J5bTGobUp7VbFZrBLhT3aMr6dlf4nCbjRXf28LhUN+uvseH6mTpValn14yxqC7ybytscxWzU/FjvXwDBN/iDHlqyayl229p//4LTks34w/EjOums/3GFJ3/0GOyJeFnbLN3miai938sJJqKavRmb7Jd++eH0Y2PPD1+j2+ezd9LetM6Glq5+QwRfJngplELwayzc6LjT8sVtBsg+5qdIV/LCWjI0Rz+eu86Ein7AA/8QmyCrILPrKpnAEA4KOl1p0Im1RVmxj88/rqdbx7nbq1zYDmWsTqakSFBjKlK/oA6Y37Zf1vh//wcrXUIDW9ZHY2MY96z8FDG/ck1B0+GD8IlU+e5Mt8fUlOHtEyMB7Y+JCSzAcNxm9fpD3kSj5XW11ZnPMw4c7thEc5xe/4zfYDbGcfXAYJu+RvYIQFFdKfYwX57BEdSKOz/FqMd10WUJlm4X0mIN3Ao76+MPN0yAPvdUNkv9eQ5aIlgKc4zXeXLCvM3H8idd32psuRGbovMNzVMOyHFxQav3NEfVIlO+RcQ75LZZbDaPk+E40JPjF/e1lInL3KZCOnPX+tirfc2bDOizdS0VdNbiHNQWyEupOLu5PnIDex2YGaKoYhhikZHyG6Bh21hSgP4yjZz9JG741SoJOVqC+9Lsawp9jtkV42sChq19dRu2QM6JKimo0FNsICHq+zbsUG79oSliURRdgs92hqCqO23VNW0HIf+ao7SMy4SvPYvH3i6aMBwkfuPspBdgb4Dl5cbuV+Gs/jsCM9LZbQHvlPaJtE+Q0fox9CBXdd92dsHSttGQOvi8HpEidnq0yY7/HP0YB/sHuMlefFe8zGH90vkYq+42Om6We3yd93kY1Gp62dCQAAAOGltAU9hwz1dGUu88+Nq/jf+T4T7XSbWx03vxjviYf69ftwJuAU0ctgQC/Uen369EboHWKX5FciXYWqVQio9tWioYds9OxFCRZuCR+sfffw7KGA6+KDo5SUx3ruXNjG47AU8OFlkJpSFBkk1lfKYd1PEn0kaVNcRBM0rJg7TQzMMNwaIDlBitES/5XifaOqrsc32/rUcZkv2qeu6nTUrfoW84OwoIZNkL83GsN1U6PoqH4jh4utpIpZ0GQChOzqf1Cifhftq727HMWXik9IqUZyaVW2pUUMZgWlZvw92xC1FM3c+1bGMfcm/ubhA7oM7Hyzm9+5nD12xiZGgh8rF4+NjaIjZLp1z6wWjj9pyZ5WsV/JtZzEjKu0Wf5bRiCzhnMp+1YSC7FTt9obCKIjAfY5N4tt6ahNVJWUFLGEP7IPNO0r/5j1pjqzjv29vuWfeIOeE3YmJuwcSx+0KVj8WgkvJOCotK1gxWx0MdK2XhLBfP9nOgAAAPlw7wZG473IVIfaj5GZQXoSe6cUuxlgPbG54KEyOSg4E7ulTPzKupkMDEJ89jv2G+FPhaAQHJdT/wj+wybyJ7XcCtEHG/+Uy9nwag//VlRKebSSJ3i0jP0GNYNXyZfyKJdP/NvJLiure6Qk2mfzrmt4dETq0We4+aCxxho0VWUsofQvH3WgDzCDlJ0uKyCpSooVGzDwleOURnlQla5iEU9Tk8nYeLpK6RFk+D8X+q49IsMgcrKxnJURapKWo6v5mpT63jq8o0Gx20cTZbJSzvk1VKake7mPQIrjsVnsl1l3s4sKkpPSHyXFZ7HER2kUlGBvIXM6XfIsj68aXwwn44PRI0U756UXYIFcp5sHk+F+8vxOR4Y8JdeboeXgm/x8Zewf65btuSij+kXKRms71GxtjyYpm2+9eeGHlhzGFu8pY/RXdPSU1fRCWC7ITrxvqp3DBBV8NJG5BooXnKK3zq523xh1UTx3Y7EqOmSVYoUxZKmqkDctZLT8Whp2XvtuQ62GDwYjG3qcz/CQ+Gfo6R9bm5i4uDo7aPG2KftFHzLcmpog8snGeqg11Ohr6xqAAAAAxNVWVwrmLKp6+exJzs3Y63dZ1aib7pwV7jL7zlXeib6L/elXHjthROOYBwtyKvGERiUrL+fJ7Rvhaa/5SpQBLt/Paf5fvJLo7dtDxP/VLbru9/31Rgu+Sti0MgE1oR1q2TWvb18t9LQIvbt7N9/NQFf8Oe6D9BfNvV5DSxO7log11x/drbQeJZFlynnyUKKnenJE8Av8Uxg+Z8OPoxummeIz7zzswPDwQwyQCp5JduEaZCBseWQ/Ee8kddmzt5onaimV/kZSL/Nr6BgRn3y97Gwmsmum8UN3/27CqtSGeCMkOMz3KxcVvCJ2w5miM8dlEFIAO/30znV7AuNbdyXbwlRq7KTSB2+Li6w5O+sfeQIkhs4ArHEp+ki6sGtWu2AGzTbP2pTw9xLDNoiREFlngndQhndVTtTWlav3x0sJKh5tnL/fIaFFEQ7eKzIowMuihd3RWr6ng/AsED4IatAsF95pKZMplYTNs/CIkh6dmA4fjZ2ugvt3oi6KPkWz2RpyVGq3w6zf7I0OoaqG45e91d7EVxmxm6y7WFIkb509AY2vtgUx6mf0qkre57lfZHYjiyXHlkj7Z+Vl5OpVYSKfrHLd4RT7W8gO2SLWWbex0Ts2jUbLEAAAgM6gOMZnw9WGf2RUe46a8s2s/xk0Masp+1rCQywE6jFigpR5GySCHIrW0Ike39obyPcvuCrtC1qbDFhttpYd7x2bT6F1a9PGfB/LsYyrwUxUev1syIiVrl82rLz0+jEijdaM4WOGqqbdr6zNOR54Z+APIxo+gvKc4BMJpeILFxUKjrLBqNFik/CSGCOGo470wQVIrJgLEv15TM0GCO+9LGIhRT2SrM1VT6eP9KEzGnSJx3lIjhhX5SuXKSi2oX0ZGXmxwsX1vmhFbIars9ypiWpWiIetR4Ti+9uYlob07l50ho74WK8q+UJ5jZ5k/Jg0wLtmrTRo/TgkYeGvqqL4XXNddokMnm+DxI44FQOHrREO6/6JWjVzXlCOxJPZvqfTf1gvf86ErKFlaDZr/roF0wfR5Ry20tZ7OtR6NAq7xVi+fynN47REuQhelu9Uy42pMl+rbGP3FQq5LPmwhtOemIOzdGTtEI9VIh4LVbFYioTx5O7dm19IxcBmSkPgzSz4XfRJw//NcZgiLY4tYG4TC5CkurNt5WVpj0/wWvnWD/9EGMu3utFLxOYAMDXsdPlVAAD4ZCipdqd9UUFMEYt37ap8ffui391bBs6L5jkZS+1ilx9zE0+GGIwZqyvtaWGQw+eyK7HWD7fo/tVN6XcGT3T3cjFobuiNxsQ1myc2vcg/NwKvPEN64xY2P/ZJthfR63zwety6U9ZsdW7DmSN62s+beHsLtuaSiG3ed03H2Q9V+5xX9iQh4QaTq97ji8o375pZgdl0D7Onf6ZxK9POLVuZMHaCtQEVvWXev3Erp6jmC3Xau1KRK7KkLoJIpPBJZvVw404UlXxoY5AeHNkv0Zbr7zLl/XZdaZTCYmjIc1p2dfyf2KieqJh4lBJ1uqHV2H++e38kH17McivJ6IhmONpllvsqvBLd38HLjVCr/ZMjnmqg68j37Rs0XHIY1a1DoQWozaho2ayLTtgqXlrj0Ua3rQ9Q21L50sE3OeevbxrNtHsjvqnd6e+TVsZ62/DzPCvj2l/es+SOjkQ2oK32lD7Igs5Yecx7UBfxx7Ewe96wpqIjHHn0VxIfKMP9ZEbWMdnRUUuJROA6OgoH1KyCf0R/Jcu6+MPGK0uKLCdlMeb+FUel59N6Wq+LeZ683eWHXT8NUpb3kgEAAIB2pzn2lz82H/hj8+GDe04d/G3PUvvhPRCfnROyc4tfMlfK8v/cu/0GawUbTBwvdTw3HuRgazvgu/PUkZ2Hty5yM/0C8d89jPZbtu9+JVIUN+daQk65yAOl2TdSH93ILEOtUHr3UT5R1SA/9V4palMM+19+GKFFwjsuFqVdDTx2zi/4KhYdqX7ptMq5L7GEimpTYSJl+A/fzzHA41I++8XVsHN+x84FX8Ojo4k/uI8lGg/1pQXVrUcY4LHIu6u7vX/2T8hvsxJMrfVBZZCqs/evlOz3YjFnen3+pztNPHfRMO29bDQDWc3+t2+lf0rsVyXiD2jQ5Kr4SHb1mL8ksmHY98UbfjrhDVsruiPNePrHqtOi22a67mb0SlOR5mpONpIfG6+S3rjXVhVbcje7yzdztIqNw2gUe0v0oac+q8Jm/eXSdnOCKRv+cNDnL0uRgtSIuWvaGruc7RZtfEbT7HyPeoS7BIimxIiC1/J+WK3UNntqahdw0AILtCIbzukAABAASURBVMRCiPSt400eyVFeQcPFzW5ZfP00SoN+Pe/rKD18UVGja9RV+2AXiaWMVOh0msgGa0jrJihSIF6D1g0phpWVJdafwVDWRFMSeWajftKWq988hsOUrlEXxbqMko0W+W9FEhuMXYQ0fE+nBAAAgKaRKOpmE380HRCydlcEi3v7VOjY4ZIjkYTlGYyHDm++FJuyqmZ/+2WbB4ds/fny68q00JD0oXMUGXtbFPbnpugS9Pezlb+7D2722mLtiyePqQNMv2huOaQ+wW7U9aDblZRRU8a1zbxMIlTNvvndd+yTqwm3H+c8KEb9DAwGjLKeaKaBrj/Bn1bqqd70LEZKfSau+c3inzs3bj56mFlY0a3vwAGDxkwYoUvLDz6BP0/vpSZcstfYVT+U+PjfKeJXF6WGrUuNUNc1d5plP/bL5o9Au/pwAiTsavd80RrEBNr8rfMb2mo6AywQEilj95pm6OTQ4lxKSeqjEtR4tvvsvyX659iYmyH5jHRwJx+tb2pXndsT0BDmmLs6ynvNvOBGrGiUaLTpmFh0hMnKlq+sM+H63UfIxULyUd7FCPHpk8jDLeTM1NGnuzsuvyU+wD3GY9quAdEr+7dd0sHAa//yo6P3iPRxYh/12DYrbb2CBQPYbHZXGq2J74Gyjs6X4qOqyGQ5+n+1nbbYUwubxnXeTZesH77y64ZQmzZ2vt2LoyE5jRbs6ujq6BlT94E+2rztopv/FGnR7uhfM7J+Je492GY2XvRahiGWCvuBkX3xHGf0LFm10kULxCtcGr4qPkosJh9i2ookKsNiOBk9wL+oduu/t/xDfORVg+xH90V+601/r2cFAACApin1cbYziDiVgypzHuahAaJjoZsszyCLlsPYwZfDHiJuSlr+HFNdOV9VdPlPHyw6QpQBk23liY6ubjtw4h80+NsVK8c1d1m621CvP4d6oXZD0hhg7zLAXuyxJ3nP8BtGv35yrID25Qgn7Ef0oTf5OcQcowZ6De1rQTB2+1RQSPKLUn51af6dwF/vhJi6+Cy1Vu+4jm4fRBc7Xkm839cmJh6RktM6SkyXqYFX3BKRczqkNd2u4vcENHo5O3KPxNQoOiOGy9vxU9nGdY7Il0MwEa2Azaz/yT2XskQKa5DkJXBeTFQkkh/v6K7Gk8rk+O2SWMfE4XIXkCC7Ll/e6Gp6+larYe6ns2X1SqpipQct8wz4B8lvkPdBD/G2dsEez105SDFJa3Ssll/8R/ZoypywIIm5gAcw2rCrrzzaZk8boU3w2e8iPCE1Zh179JeXmfRAkezqNb/h/XlhP6yJbSoHXhG7ZFqjCgdlqVsnWbsvsbdYEsWWeg5U3L1V/3VTOLxhXwwTi+dVhlu0Jp8j7CbKWL7OSXagVpGeIvoRyNfTFgAAwHtDMtQl2lbv3or3ZWuyPINsqgaC8dQiJaqbgUdHIfmVWHTk+v0vX/VpZunynBCfvSf+wTsEqqq2YI6h9yD/cSb+T7jWgP4t6xTET3+C/8upZDBgoPgTJI1R81bu8dv5+yLrAUQXEnZ62G9n81HH6XQB0ttHsRcjooifo1uXLV/iNt5IU9vIySem0bDqQZsaTZc5xMVdLFhg7po2L0hq25fHuuXrE9JM0SzJl7PvbJsyO0x8rLn5D3MUGDFvMcdLarvNbvZ0+VtX5G5il6pDgsXiG3bkMo9zihVPwdI7W+80rKPqn9PudtvEc1BkDw8XBYqnDflp56zG3x3WxSXWvbXN/7fML0T4EWM/YfvXev7PXLu38fglJ9MV225l8y3+EluVvXWxn8LjnXJOu5trG9kv3x+bXcIW2QQeOyvWx85K4lAgnQkT3ndnqrbaU0m0KZu2jyZKdaf4OjSVRhvx01aRgUjsc25TfGV142THrPQMkoyfstfZ2+8i4p+S0/MGzQ8raRQjsS9H1vfiQ6aKdVdjX14jUVNhylhZMyNLVI8wNJP29VUZNNwITx95DWrimMTHxoj8Nnq4QhUoAQAAtL/CQuJP/hfd1UQfbaY8g0y1L14Q8wrS1NTkWJqbc2r7z0R0hKWDmo2O+P9c/c3bL+JFNVKijJrn7WVJQZ1QWvxVfPqjPmPHtOyS4Our1/H4SHW4zXCp8YeSspalyy97frQn+u+Vpj8pQh2m03WxKwlb4x7W/GI6i8IuSqnlZbhyu8t+N5EYhh21xFx73ZAJ7s4ulsQUMi+fxF6NvXrrAasKGW518GnmbQQvN7CxG0nOuhz/iCXZgKfN+sld7swPrr+LK2PPLsnAzMH1KwX6nukwsChQpHl62VPHMnbrT446qCDmhF/QnRaUtkvfZW+wn246+ivDqqTYWzmN0gNDvH+QcwJbIbLdnqitT6zXNc7g8Zi3TvrcOonahMpX232/CvMQbRw/8HH3d7zlqXDhjpI7p9d9fXpd8wvarJzTZuXy5NeGeypGa1ZQjiOtZ5NXgqrZj3KQu8/yXSK95h5tdPgfLarRlLW8rD1is83WoQ8y5T16IHycHelp8XVVzF/Td2VmbBUukOVr59Ow+Ek3y67BMZsmLPw7w7WGeKQLTeYf4xy/KW4SOVAX1wmylpZv2lwD00H9fdbho+ZkpspuxYrmWOkWpq2v0wgAAEBxtbKu9nNv3CJ6gJANBuuJPCxo5csszyBzhZU379zGiyIoD2m2f13t6xv7dgemc/FoZ463l3WTw2lq3z25cHRvdD5e+0FV12359/ZfdsrxL+X3/QLxAhWqZrbNzqsrVVFYQDDeAO7p4NBkUTIlXXz6Huwz4nH/RR3mQ6tih8OLaKVtt5HapsPakScblR1jP4jdv9HTfd487GfVztMxDxSqOIzYOfEhJ2MbR0eI5hKwdYKCk9IYeng1urbtKGVC2yYQFcPF5YSt85zn7ukjiI6M+rekBV/FSo85GSYlOkKmWw96KZwzUTb8ITphqzlqZzTXrT4Sl+4frV0e1F7XHGiuwUcVC4nb8K3bZ0+bio4qsmN8PS21DEbve9QoK8i+tczabluqyOmCRUf2llvqyz4wdBpit+5fB6SK1gNk31j+v43pZDpdA/8hp22cL9FzNcvfTcfK5xYSLEAnasdLwU7dZmflIz79GdJZtdxO5j8u2VniFRdkXCOy2RXd5DlfERZwVOQPAtnRbggCAADQAYqj13kfu5H5mi/6IO/Fjb1bAolJe3Tt7EQqNHBvxxKt/OHjRknvxVYS4bM18FoOW3R1tdVF1w6vCib6VWuOs2+uYx4/70bsYyw60rBfsV56dESi0Whf0L5Apclhvy3f8BsRHdEMJm7c9mOniI7+uS9xPPnMhD/XBt3GD1x/j/lDRQduFV32W7541fKdN4pq6x979+T6/SLRVjP/9ZPg7WvxsVhI136ek0g6reji4cBbL/i1IguX378r6MHep09zvRLb0Yc1DxJ50Ozt+9fPGtTUuDWanW/qX7TxXx9WbNJJKb7x8S3Zs+SGjEvIdIeAOH87xftgajhOt1iTmiLyiKubi2JRVleXrduPXFwjozqzuc/JpemWs+UuZNd/ue/YsCX+Mg6XsvnK6DM/tGyaVzIWI+VY+Hu6b4wtQe3mS6+A9cGWW0T3N37JyrD/Bbdh1TyCsqH70fO+X7XxWhXQ7nvKfvu64ZeYlSbd6wu+ZePThdlt93ePdBPtPpey014n3OuvaB+7nuxba8b/T+RLR1t0cCvb3l3kATvfqK151uuI05Y2ds/fm8zx076aHbNuvLSkE54a+tog0uOvazsnSNs/HvPiajf3k43Oc9r8gFX4BYKC+LBHZdg7UA1HGtX3SS05vS1IbGlZxe7ItCaPacHRPWKVG5wnWCAAAAAd41/Wo8CdjwKVlGlfED3TarjscmFPbvWRi34RnSPoVcJVvAzbFxMnyE5i8F/fCPa7EYxI3b5QxafHqK58xxW24HsM/WWNfbOXSUkGLr/8oPFY03q4rL4Fg13W8pWDz51ZnkBsJ6nn2G89F1rLVyz4PShNDTwcFEii0FSJMEE4GRSe4JqzatFwsTKzj8LDckqxg5MZEX5/bF0KoDInJijkVFDjA4h/HC7iUc+/rBsndt0IptBoaoa61Lf5+fllxMIkDbcZCpTQaHOdP4OEz7M52mX5zoiEguLnt/Y2HR0RlGl221MLore7msrst0Yb4rL1r+CFzUzsaOj+V+pfnqaNohcsTjuWlnbMtWWZBC1Hd9HuauT57hOQonQWRWednGWk3GjDPIMLor2MFAt7aaN/TUze7qDR6FUajj4xT6PXmbei+a1Ms1gSnPU8IWjVhEFN9SIk69jMkuMTkc5oyV6JGgbo8rKVkfLV0p+w/ZbvcrshTe4jzdR1U3Da8wRfxw7uRtWqPW1W0d1bIt0z2aLlsAUp164TfGMks1h4GLMkjI3Yj+JFYmza/JCt5pIfuCCpOATRHP1T/iLO3qKoJVYGYtcyhkywEzvGzICvDSzXxorVdahmPzq93FLbXEp0hGU7Y4QF0Nk3NhJJYxdLYxOjup/RW8TrmtMZvZHi2GGrNoq9tauT4t9hAAAAbaLHgIlmGiQlPM/DZr/Df4joiNTDwHXZ5j0L+4smivJj4vHkBMPGTmZ7g2o2pr8W8Q8Yv5xYG5tor5O/GGy/6MDv7gPkm4VC1UxqdFRdmf80+tiu5V6rfj6c8BD7t43Uc7jzogN+6zpRdIT5oqc6iYiLBMcTi46UlLXM7LEE10TJq4p9DASPKOkOaOjHqEpTw/8lFj2AJFqfifPWSXwcmK4afYTv9erF3dSnOa+whZXVjSf+smONfQfmjxD67L///kMfsQp2QfbdR8z6PB92OXmQjhpNRVoIEeNJ//qcyO/fBL/1J9o9PHZWSkI2UbOEzDC1HMCgtfUUmS1UzStJj08R7J2awWgLQ3k2rMDX2ky0edffJy2R6E0ksbahhjRFOv7Jo4rNKvnnkcjHgb+RhZEGjU5TsKdiO6jmsctKCh6lF1Q0PEYzHG7GoLf5cegw//hZmvvU1Zxw+avM367+qWr2RU8T9zBZZTIaFmZf9hwkOuaH5vLXQzyVKnJemW5NvoZlHUW+UIZbUxN+EPxrxONVkckqFdkX13p6nEwX6+wqWJVKdsBMh1USmVvz5TEh3hZYcJhzdLTVmkfSayHS3YMT61N8VWFuvT1iUZNU5oe93NX06DrmfivzdfW98vC/CTYhs7U9RMcfkef//Xz7aMk/KbEeam4hdb8YbUpNXvJ+J7QGAIBPS3XlGy6L+bjonaq6Xr8+al+oNm4R1T4N/OHwDR4aPOe3laObqYKANe4rXxU+LmSr9urXT7Nnk/OBoOZWVZKf+ehhQtrt7Beldf/MYgHDWIfpzuN0aZ00VVF/PGlaA/v2oX1BkrWdtdWlzBKk2Udd4oDz3rHLXj7Le42wA9i3J61bUweQz373tvhZzisS9l50LO/UgZmjOh9WFzvFdaXpDJmg08rhAWSakU3L51NqR8pkjSETprTV4Ie2XZs0KjR6G3wc7UQzItgWAAAQAElEQVSZTKMzBk1gfKLFyFiRAVKjI7Kp6y/eK+dPqD//aV/5PzqJBs0WxEhYxkbY0VRngoPOxuwCfJjW+ab6ZGLRUdHp/w1efksiyKHZ+ApXZehxPtVIvMMeSt1jN4+RdX6WhsH8gPWnLTc2muCW6Asqmu1U6YNXZWlytKHpOi/Fao8IdsB1vU/AZZ+Uuu232PTT6I/97ygAAHR6yqo9vtDtMUJX9hL8hOtYdITIQ+2tm68RR+r2Ba1b/1G6qAX4rJzH2SUFOTk5z549e/VOtD4uSVVj4Mhh9tbjBjA6+b8czR9PISVldV1puR7yFzTNLwZryjVIg0T7Qp02qM2nu20N+IcdAICXs9u53l90gJPGCK91v3q5DqE3Tu7RHP0fxTCm2B01Eo2F+ju60vfEfN+o+L609/o7kT3aUqS4wpfz/7qy3a6hfwFt9PbU5AEudsvihYmkIT7Jf80S9CI3WnL+ryfmYsOWsPzSGW8Lie4JdAaWF5U5Y7JgcF2LunQiA6+YRCTcfvG5qgEAAHRWwhrT6tY2A9o5afMiJmjX9Xf1v5JUv+jDGDh86CAzSwPdbtDw/jDA5wQAwOEDnPbZB7CR0Tfbd26aNZreVH9Nmrn3reKfsHSQyGOm7hcSVspZQdHA62JwuqCrnpEnXtG7cecFo9lhj9SWW8w+XUJz+eu86Mg6ot5DNlFEnm7+w46D65wYUrpofmnzw+xZKY0f72ow+qsJU0YaqrTmj59w+yPtfMXmqgYAANBZ0cYu3WxFpIZQO9MdZz+RX6Zj0LePXr8+vTpFhzGgqI99DJIiZI5B+rjIHIMEPnr4OCt2Xa8zcuOhX+zU2Kx+EyzaaKToo5PLA+4L7jKm/LLcTjLRwovZuY3n4j3ly6YiMXb86Vt6s6Y0LojyT9j+dNOFDq2Lc5rHy7oRm12frGIMnzKkYTey7qT2HiGrhgmPzao/1Eil60c0kg0AAAD42EGA1AACJAAAAAAAAD5xH+JEsQAAAAAAAADQLiBAAgAAAAAAAAAhGF/cwGzRsaCvRH7/SAs+a3y1LYjBafidZqCBAAAAAAAAADgYgwQAAAAAAAAAQtDFDgAAAAAAAACEIEACAAAAAAAAACEIkAAAAAAAAABACAIkAAAAAAAAABCCAAkAAAAAAAAAhCBAAgAAAAAAAAAhCJAAAAAAAAAAQAgCJAAAAAAAAAAQggAJAAAAAAAAAIQgQAIAAAAAAAAAIQiQAAAAAAAAAEAIAiQAAAAAAAAAEIIACQAAAAAAAACEIEACAAAAAAAAACEIkAAAAAAAAABACAIkAAAAAAAAABCCAAkAAAAAAAAAhCBAAgAAAAAAAAAhCJAAAAAAAAAAQAgCJAAAAAAAAAAQggAJAAAAAAAAAIQgQAIAAAAAAAAAIQiQAAAAAAAAAEAIAiQAAAAAAAAAEIIACQAAAAAAAACEIEACAAAAAAAAACFl1InV/vdfbU1tbe1/2B0MAgAAAAAAAHyYPvvsMyXsR+kzpS7Y/z5DndVnnTPwqK7B/IfFRggAAAAAAADwcVFSUurS5TPlLl1Q59PpAqSamlp+dQ3kiwAAAAAAAPi4YTklEhYkdelco346V4CEhUbV1TUIAAAAAAAA8GlQVu6ChUmo0+gsARK2Gf/ya6BPHQAAAAAAAJ8aJSWlz0ldPuscA5M6RYCEbQPv32roVgcAAAAAAMCnCYuOyJ8rd4YYqVN0+MNyRxAdAQAAAAAA8MkSdChDnUDHB0j8auhZBwAAAAAAwKcOCwr4naAeQQcHSDU1tVCVAQAAAAAAAICpxmf76eDcSQcHSJ0hRgQAAAAAAAB0Eh0eIHRkgITFhzD0CAAAAAAAAFAPCxCwMAF1nI4MkLD4CAEAAAAAAACAiI4NEzosQKr97z+ozQAAAAAAAACQgIUJtR3X0azjAqSOHn0FAAAAAAAA6Jw6MFhQRh0EiwoRAAAAAAAAADTSgcFCxwVIUJ4BAAAAAAAAIE0HBgsdFiBB/ToAAAAAAACAVP99gmOQAAAAAAAAAKCzgQAJAAAAAAAAAIQgQAIAAAAAAAAAIQiQAAAAAAAAAEAIAiQAAAAAAAAAEIIACQAAAAAAAACEIEACAAAAAAAAACEIkAAAAAAAAABACAIkAAAAAAAAABCCAAkAAAAAAAAAhCBAAgAAAAAAAAAhCJAAAAAAAAAAQAgCJAAAAAAAAAAQggAJAAAAAAAAAISUEQDSVD1LPBManvGsqqqrCt1q6UZnbfxRHptTTaN2FVmuIifhei4HIaqxrbU+GQHQ4RqfpQAAAAAAcoMACTTGTt05e8qeew0P8CbjAVLa75aT9zERMt+SdHGBtvApVtzaRVuyETJcn3RTXxu1PR6nlFPV+GEylU7tPPGYyEZ2odLV5N2wKuxlPMHdz6nqNBUEWk3qWQoAAAAAIDcIkIAkTvgSYXSkPmyanaEKqmLS8RZ/wim83YlJDY1mLviOgd6PRG+z2edlPEfVt3Kc+d13s20NOzhdILqRkw/kBEyTa3ty/pw4bu9zwf2pp4p8xyPQWh10lgIAAADg4wFjkICEHP9tcfgteeqR+IgDO3fu3ukbssoKe8B88kwqsYTJNPtO0u7k5CYGb5k9xmDIlJ1xnGrUOVw6drZUrgUTjx98joBUVaUZ0eH3WEhhnfAsBQAAAMCHBTJIQFxpairRalf5dq49VewZFdudWTnrWDUqHdO3TX/pxbB5dU3eKlZ6RnZW6vnzx6895uEbvWe2UfickEu/WlNRh0vduTd1zq/mzXy3So9tO1GFQGPPjzmP/CUFIeP1yc7DkII6+CwFAAAAwIcPMkhAXDlHcNmeoUWX8mxXWoe1O5VpdHX1uh9tE9vJ0zzXn7qa9ywxwE2fWODZCVeLJdc4qAOpGBvgR41zwj+S18yimccO3sduDAyNEZDAa+WH2IFnKQAAAAA+fBAggQ+bSr/Ju289DhEMx+dc+HbBmRb0y2orVSajHIiWeXTg2aY3I+HEIXyojPZkexMEAAAAAAA6D+hi1ynUVTOrL2XG42SmJuQKLqRT9UebG0q7Ii75Kh47O/V27huq/jgryaIFPDYz817Gc2Fag6o/ylyfpqIsbW1v2MLf37JYpYKyag3rZ3H+xW5VqOoKXaCvKs5IvCd4bzJjmJWJZptf3adZb/lrY+rITWkIJa7bmzjzNytpSwmPD3G/h761uYGUvajmcd7g9ehUVNWFdaIrSjOSU5mVxNZrm1sNVFdp6kszfq5X3LE9z9H9g8cy56yWlR0qPvPnCfx4mC+aahC/r4nV4duTW38mYBtgMtxYW8pmN/poqjg5qbfqT6BR5saKlMiTXFvD2YgfATN10VWJvBGZYWlloi77w61gZz+sO/7YwmbD9LXFt0r4viy2YDhZNZtVKjwFG4oWNvqABGcXqt+wxoeirJRTg/DTuAet8WdXX0hQ0bMaAAAAAB8rCJA6hcR1Q74NRcJSZsUXvndccr5YbAH65F9D/OYYkmW+avilVTZ1yRO84rZnXYFj3vPodR7fn86QHO6irG7vHbjHcxhVcm1C2b5OZr6Cu3UF1m6uM5t7AbuddrzwgB2SR1Xmie9nrY0W3xekP/PIuZ32mqhNaS/evvQYXt+ZdyzgwgarqWIt72r2tS3fLAyQOAjq49cH+okcAdzz41Os6qqWe1JTd8523XNP7FVkk8VHzm20pcnaDsNvF5vvWZuKnh88kbh6m9RADWWf2peA306eN0OFdVrGirAP7reV3scSWRLFJ5QN3A79tXuyutiDoh+Nben5n+y+DxUvFKE5+bfT++cZyxcBiK7N9NKKbzyCc0WeVZ984HLANOzjq84Jnvv1ijixN6I7+l71m0qXiL2fXdrx8y8HExvVrpA4E+reVyh33xSzuuhx+snifbb4HdEPaH7VQZdxm+4LlpB5ljJPfz1mWw52h7HkcrK3eMKuIm6txexgfBqvORczfjVHAAAAAADQxa6T4eUemjiMiI6o6nRNdXrd9XjWpbVjnA9lV8t61b4pUruWceJWWIxcUBcdUTWJdQoCgurS6C1Ow5fGtd+YHU7MEjNbYXSkom4y3s5E+Na5ZxZYOh3MRW3MzH6aIGqIiYsTPVDVOQenDPxWEB0p0wytbK31BTmQ0mtbnGx+knUEWNeWjpqCR0dkOnHcqIJGPy/j4Lejvo9hy9wMzRnzJuO3VSeOn6+QtkB14nE/vA6Gypy5TVQDZx6dvSCAiI6UaXRNA2s7K0PByYCFJQvGroiTMcapBtvZIXh0hL8K32xhoFh86RdbxY95Wdz34/DoiCq6qtJL349bm8rD3mgcHh2RxU/UyCVTdmaIr+X58QUewugIO6v1rcZbGdAFi2NnwrhV1ypQi7Cil39VFx01xdDzsCCVx/TdEiweq2fsW4tHR4g272SzRTUAAAAA8KmAAKlTiVvuuCVDffLuxLzizAdp9x6kpRFFCPoRT6Zt8QiQWhaaHbbt92zq5N8uPXhWVPgsMynAmaivgAUG38wOJtqljBkByc8Ks+4R68wsrF8nJ3S2i3+OYC3j9xUWFxUWJ643JH7FrtDjv+I/LZqfJ/eQy9wLeOOT2J1naZdPHb+MvXVW+FL8Gn71vU3ebT5YyMR8jOBOBrPhOLGv/eSMd71DyHx5RNY/j2+GnAy59eDZs6Tdk/EsEOvsku0pUtbF/HP2t6Fs/CXMvDTiuGGvvbjeigjx2Oe/Wye7WU+etmopUW3v0g6/nMZPV0UeP4ZHN9qL51ihpqnbbgx58Iz5OO3e9ZDj526m5WWFzCHWzA7+Q/oYp9jl2M6q2/+RRLwK32xsT4/MEKQTMzYtOsRECjj/0+zz/ZZezBCeOc8yI5aZEU9wTnxvOxs7qiZLIrJyhCdqVuRSQXaG6ftn48iQbrs+JI04q2+dOxVyPe3Z45A5gmFjZ/bWV0W38yXOt6SNgq6JxuuThWdgoTB9JCr14KZwnsmCkzdzCouZeVlxP5vK2g1lg2V7BJ9I4tptcQ35wGeHlvviJwp1wcnfLBAAAAAAgAAESJ0Km8ObeiQei14aukLhRQhCd1oT97N/P5ggJYkUF33Javf1gHnEGAwVqrYhMciHdW6dIDBgeEbc/GMyQ6R3Fb7OSyenEY39jC2/n2/hJfwmlAZ7byHyCLYHxHeHavHzkfUG+L3EfccyUdvS0BSkkHLS6wOTlN+9QvFsD2PJ5YurhlHrswRkbbd9vtPw7WIfO3ShcbntKg7b0Pu62EuUaeae504vIDrX8S7sbWKyI+N5i4fit0y/440+r5w/t13Cbyf//GOT9etUJh7OundysZXYgB+q1a+/TSfu3Y+Olfb+HE7VtCM3sIio4VVkbfs//t4tiMUyfz+YiBRhtfvoz+Zq9W8/bLWfMH5mPnuOxTNh3g3Hhzr0522eguN/KTFZbFds/R6nnfrOWmx4Es16y6/TiHupl2NbECpnX7r0dkHE1S3EHMHKZKqxNr2Jpc1+oMwlqwAAEABJREFUPkB8cFWha/9MEzzEPr+JOEWpc05vVLiYOAAAAAA+YhAgdS7m6zbYN57JR3Pmj3OIxiXvbLS0PkX0JevdJIf0PD9/hGgLk6f+9tMwKQP0qbYbVwnahZfOX22uJrWinp0/RLw5Y/n6aY12h+E4g0g1PI+Nb+N5Uqndu0s8cu3UCaIH3eTVSxtVi+tqO20qcefSbSlRA3nOr54GjR829/pZMFKlyWa9+syFRDc73oljEvW+hZPDkufNn9p01QS6vgFVWqcvU0tBrMPilEt72dANGyc3Hh+l7rZsjqD4x5nL95D8pn8neV71s52qL1znsuVTJT5bc0tBII8e5Yl+suqGxtKGbCmbWgl25TWnRfNB2W5bo0BgY77G1w3f3Od7t+Kpy6qYdStiEHSuAwAAAEBjECB1Kgbjx6hLfcJ6tD1xy8vJaZw4IDuMb9T6L024JsjPTJk6XsZAF/qY8YJsQOK9DNSmWLfjsvFb9Wl2UmIMpG0geN+M9BzUpnJyBCtUZ2gIHrh37SJxa2dvL+0gGBgINi8151mj5yZbW0ttN2uOGi+IEFIzmuiupuI4d56Uet+880eJyWG1v5vbXPc6cTxOaWl24qXo0EP+FwVvmyNlmxEynDRKeiLF0lpwAlVlZsufrjHs3/jjYzC+FNyxNjdr9KSBieCT/VfGYDkcj80qzUmIvHTe/+AFwa5k5rbkPLCabN1VkeW72v7qNxMPkRLXbbqU+Od6PG0InesAAAAA0BhcO+1UTAx1ZTyjhfcgYuGJg8ZX2xmMxlFV0XMiRJHaxq2jb4LFVdhiVWzZJQdahMUUvHnp3sl996L3prREmLcw1NYibiuYTEH+JmZJP60lSBGG/fVlPENECLl4zNLUUVO2WrZu2LH198TqfT87/ifRvc580TxD1LyqZ3HH9/zuH5PBklZHokpaEGKiL+PjVtbGT5JSxdI1JrrajR4j06hIcTxm3PEdOw/GPi7lSNnsFiWQNDXoCr5CxXbdHufzC8J55xd8g/8OnesAAAAAIA1kkDoXcksiVhODfo0eK3muwLiOnByFxu43q6S4FL1/FQnXBF3ltIeZCyJGFqvlffiUFZg3SCr6jLlE0gav9y14JOHw73jgSJ66bIZ6c6/mZfs79bOavSlUGB1RNdUNraa6zVr6m2eTbfouqC21ydp4OQcd9Sy/3XI+jYiOBEX5nGe6Lf91cSuyN01F/jLR7NdvqE+22u/aAJ3rAAAAANAYNBA+EHUBD50qX8O9O76cvFfmDQwYqC3RaGSsXYytd1nkX/O0ZS9HbkkyQhbW2ePRxB3G9KnC/Ew3Kp1IkSFH37RfrWW/9HNqDyT/+7AE0SSZSmt6wa5T581ZGX2CV3ViX/BSKzfqhWPE5LAMr6Xjm+sbVhW3bsoWYrBQv5lHjqyzFZ3mNWbJL/6KjCOq22ymIGjtSW1t5KcY3jVvZ0ExbsaMgCAfW9Epj689X3swBb1HvGs7f6/vThq9cnPqVzAACQAAAACSoHXQqeTkPEfjpUUU2VmCdh3ZwKDZ5ANBk6GPEPaa7HTsfzJilNwMwUrpmop2VmoGnWFAvDmTXa1Ol297W4tz4af1grDBdvV3dbkFdQ1h4PemCqmrK7ST2fhwJmnHrTojXTC4y9yk2ajSes53jBP7mCjxTHTptJ4XiPht2OJvm0198KJPniHyRrYHLu2UKNrBKm0qNZhd8Fz6Ztd91irGhm38YTetIvrYWaIrop3v1T8mi+9KaUkxep84MSu98I2hzdv3c87StQmcE7M2TcvaAr3sAAAAACAGuth1Khl370ktKJdz4ZRgHLv9+KFILtq2EwTt5PDzsqp4s25eI4YKSavx0DoMs2HCmmkXFKsq3UJlcb9MXnKNuGuy6VeRunmmwwS1EBLPRinaFk9MzZb2cFXk+fPEHUNb6+YjDePvVtvht6mn924OjMPvTZ47U7PZl9UlqYytzBvl2NKTmzqkGXdSpaYNsy+cEeyOvc37jQfqejkaWjbaler0xPdydghx4ryX4hNzqTjvWjN9zsYl+NeDc2T2L+81hQUAAACADwAESJ1L9JqV1xqNyM/2X7KXaGaqzJkxXt6cn8G8RcIq3t7ecVIG+XMubdpKpFy0v5vb5oW8LOYuJsKzqhNbDuZKX4RT1haVIap52ZGrxgyefYwo6UafcTLMQzR/oj5tFlFuG93bvk3aQUB4UTWO1ADy+b7v/RsVV+PErVhDlFlAw+Y6N9F3sB5tmgdRXzvzxDG8m1nz1b3FvGaxJEoa5B7aHtrkSy6tWxHT6MDmHvp+D3ECkefMtEUd4u0rycRXdsDv56UvS6cLcnOZGRlNVMNTDDt6jcd5/Ayw3b0dT2SZrNo/D4/Y2Mdmr01ts3cBAAAAwMcAAqROhnPh28mronPr8ki80gT/b6YI5lzF2nbeChSHps/ZtZEoxMwJnW3z7aGE0vrcFI+VeMjVwuM8/oD2ssM/y1NRTUEGnj6CSCBjk63TprgckZJrPE7mpU3OQ4x8FBxI8zrjWuSl6LqfYztXfe86sh9Db8yiM9nEys2XR8T/YSuRplBx/FlQQQ4/CItOZJSKJOgqShOOLBlj4Bwso89axhZnV/9EVt0rqnIvrZg8m2hkI8aSX+c1nwgiWAljRdzQDcvk+gC1DQQpvdJD3jvv1Zd946QccnXcwmxm6BP7/NyvVkTWH3Dis3YUnkDj9/xs/Z471dbtCst/7Y6Uusitmp2Kn9XPqdLHoJEZ2oJxSheOnXguSIi1MpzmhC9ZEI5/kA0JRuVha/YQpyje0a4FY7oAAAB8bDj5KVGngk4GBp2MzOI3PFz9Kj0uPBB/PDixBRObtwNOQXJEGL6dgVcyuQi0h093DFJMdtrFp/fuFua9YJdhv/ahqQ3vqzel/zA7QzPUYabuPo42zT2zYPQZvNhXjypWQ4Nee16I7zSFihooGyw+dzLHZnZwKWLFbXE124KvUx2xiuvbmupuxy+vbp/dpU7eGrIkZ4pvBqq+d/DbcQcRma6Jbz2nuFTYB0zRuhClF35ZdEH6U/pTf9u1dZ6F1NlIDZad9k0ftySag1iRaydGrkVUdXpXPDqqq50tfUSQoXfAzGiPTVu+wQ6birr6528a6lNTR+8MWiV/p0Q8lbeXGB9lv3CGnON/xi9dbxKKRzUZvk5GvsShKyvFQzXq1FM+6NufLsh64bQ/TiKf2cGLxgUThe/+rT/a2PFecM7PmYbeM2XbH9ebnCd2Za/zwL1kdbqa8BygTj+5Ec1eIS0hZj7rO8aRfUyEEtaP7LeJRu/CZk05Wbyvpcmv4jMLvIj+jcY/HxCpGYKdorvtLnwfQ3S0m/IYJkQCAIAPCb8sL/Vu8mOipwWtj8XI0cZ9Zbdpa6uLH99KTn4h+JdfWd3IepwFQ6xNxc08sWt3St0U7Or0iY5G+IXQ2qLruw8H59dFIdWmblZi/5LzC7OuJ6W8FDSsVOhG1laWut1Enq/mZN+PT8l6LfjHuKntFFsS20JL66F6PaUsyU0/s/nww1e1gt/UetpPMqYgufCKMm+mpDDfEb+o9hw42MZcj0pCLcdnZV6/LVwhtms2o417fzxhxacYID0qLvCJDU0qyBJ9sOBNKfYTmn5npI6Rz4TpgzR1UEfQsPONP6Li+h2WFWGz6mplqwyceeDwVvt+ZIVXR7XdnZI0/reV3scS8T8h2DrrhuLQrb7b9vvPLVmnvGjm3pfTBm9ZsOZQKr4jPFZ97W9ldet5v+3+pXWdvbBgT9fEeor9zKkzrPWb3AvNqUdSGMfWrfwllOgyx6kPjbADO3XDr1vn9ZO6fpPF5yKQ18JNcaVVpXVhhrK6vXfgHo9hVEW+N/Q5P8/b+s0xNGeeo9xHW/+7sEjkNW/LNZFDR7ddf8TvO/M7TU7opGZ74HqAyjcewbl4HCJ8kGzi5hvwq6P2+61fJ2Toee4iWrJgSxx+2Y1XSpyB6uPXB/p5Dru7VMZrjH8O2pnhuop4CXbSVrfmD9Xzg/NXJeB3tJftWWooth7atI3r/WOw6A3vaDctAyraAQDAB6IwfvfeSJHkSUb8jSu9LOZvmGPUOFjgZl/xOxwnnmnJyES6m51EQp30cD8sOlLqZjljwdcDqW/fcnoRD3OuhODREUXHec50G21UyhH5d6IiL8ovKDxfbL3xuYjhM6muiwkr5tfdIUVi74ttJ9XMZeNCC6poF66KvPC9R6OKRDt8Z1yPiWCMnb/SVU9sj2qzQo7h0VEvMxfPrwd057yukLMMb1qQ1+EMvugjD1LCz9Gdl/3ooNuSf/y46WHbjqQUN6wR27VrUjb4g/XZf//9hzoCt+pf1BGwxNGC0IPVtTVNLKOs1OXI9MXvM5V0bWnfb/FL6VNPFfmOR/jQGk5uakIuB/XQNzdl0KmtD2N4nFLmo2RsjWSGGbZGdWr7RUaNVJU9z32YwaxE+O4Y0qnqtA5pqSMem/UsIxU7BoKDoKZObVxu+9mhMVZbsrFm/fqkm554tqGK8zw3Fdt47CXD9DVpKu+1DV33qalqm5gbMJr4zGKWaM7F00rTjhceIMpCVJXlpN7GdpWqb2nC6KgDLqru4JO1TYYba8t1+glfgjrLLgAAAOgMuBmB64OSuYiqZ+vhZqWlgt4+vhAYkoE11hmTV6x3FMvwcFOD1p3I4NRiC4+cNX2CPtGXpSglKeVzm9ljG5ZMP7x6XxqimM/fN89I5NWsmC27Q14iPcfVayariW1DxcPATWeSKxDqquPwtbMtsd63z1MSUil280b2qnt51Ba/9H6jnUdbaGHPV5U8jb9y+kYBFlFp2q0QDc+Id1fuZTjcefKo/nRVbMm0yNAzD8qw6ENv6uo1E0Te+kGQR2AGIg9esWumsUKjZFKPekUih0ljLPtrfE5saszZK8lvsQaRkeev84cqGtM8PrPU7yEXKWsOcVo4fUB3VFl0MzQgtgA7zpIb3GoUlc9RR/i0LpliuaNmoyMMtgC2WNS8NR2VR0LKZKqxlb0xajtkqrqBtWML5tZsAypq2ia22m1cKa8FyDS64kdVhdqBG9/yT01FrcM+bulacPBb9HkBAAD4uHESr2HREWI4bvzJRtBLjmrlvrl3uPcfScy4a5mOMxv+3ah4ePosHh0x7H5c76RV92g3qp2L+L8t3LdEHqi7mkQ6hsuuxG96qUu0+Ln3g8Lx6Ki37ea1kzTrAhVqd1s3U9HF6HZrfBwa+rB1s3T10qzdsuVWefGd20wn5/qhBnxsyR+9XA3rw5RuNgtX61/YsSG2LO/aLeYEkSXfERtKVaMpWkPAbPaf5sr124Jt6sIvKZVrwtN5WQl3uUNHKxQhFYQHP8TDvAnfb54qOKrdqE5eW+lHV5/Kyou+kmmrYPDWKX1aRRp8YkObjY4EsMWwhREAAAAAAOg0cnPxXmt6w4aIjSHSGzIU+53HzBPp0saMvoiHUobOKxuiI6necd5IffwNW2oB3PwrIRBncXwAABAASURBVOlcpKQ3+6eG6EgqUqMRPgwTfTwW4ZS9Enlw6MIVItGRkKblYLyrHodVINKJ79Ub6RvaPJKy5LZ0NTXtK1jnO6SQosz7WOoJ6U38SuyoUkaOt+2OfQQPE+6jj8AnlEGKyU6TGHfUNGxh7CUdWrMBAAAAAAA06NWjG0LlMp7sQa1PAtVm3UjCFutm5zhSdn6EW5yWzqwsZxIlsSpeZCQn4SUWehnqo+zcV+i5IIx5lZ2SjA+2UWUMNtGkoMzrd7HHqdaTbLoihXG5eLxDpqiKPthUlMWtxraNgviFGfefV7JfEONTeC/Sk1LwGRN76lsaimS3BGUYcgtyn1f30qMzGBbW44x6ySzDUFlJhF6qXVUlnhBWnigtI9ajqzfYxs6c3rCaohfEaGIdfcnDqmNsqByVUv00rwCZd1APrLbzCQVIF58qXMwXewkESAAAAAAAnQTD0rTXraS8hBvFto71CRxu0rV4LNtjPHhEfav96f1UvPqrqaVeEyt7d/9CWHhdSSPO4yuBj/E7lvNmolNhyXUL5SWG5eEzm6s565g4ULLup1djcdeIFsUAzLwX2P8ppkOb7z/+ugzP05Dpmt3x317diwqMKavb0KyQU8QVf9OZdQESNy/i2J8xDdmm4ges9AcZr9R2LDSXsf6KvLzX2I3W0CGiZfcKonwOh5c2lIsg1pNy5bqj9wobsXRZLb/xKmndsSxeGQdPc0GA9OG4W5iHFNSClwAAAAAAgPai67zULm9DTPyWzW9muk0yo1fnXg0/fauASzHynG9Rn+h49awIjxa0tRi15ZlX/gq5xSzmcFFXNcag0W7/G1lX4/uLoVNdelWW3//7yn0Oog6c9DURLfTqx0Dfupii59dPpWANQT0rl3F4wVtVBpaeepmfh6eb+uj1wwKquNPhiU9Ly7lKFE0N04nfTLIRq/Etjld0P+RMIJbU6moy92uj5naSGx+Hj/OpD6V6DXNYSK9kP7gS8rgcUY1c/2eCT9zRUzg6qTjCb3sMC1ucMXKS2wRTdRW8JkRabOTLLlJXXs3JvnU68Ep6rTJjsqtdT9Gn3hSXIk1TWwfbIYN06BQlLjMl1P9sxqv8yOAbQ1bYEnvXQw07eJzXRblcpCmWROLm5hMhXGkJlmHrhT5sn1CAJJjvqL1fAgAAAAAA2o+m049rKrZtT8w4+WeG8CGSzmzv+UNF+ry9ek004ZRq7h/e5Z9el1mpKMtLCt+Sett15Qo7fAQORdPMQhOxXl25ch+hrn1MLEfWFZcbaaGHPk8nAqRehhaW9XmYf8oECaeK+0fXHcuqWy+3mJlycuf9G5O/X+8oOjKHdf2PQ5GlNVwOF0+4kOlD7Wa62g/u1czsQ9y8c34ns7GN15r6P2EoReprYtkXFbOuh2A5LnIf05EWDfPV54fvI6Ijy3mrF5qLVHr49kextaaFrTj7BPHKOXiAp9yLYTHbq3FEpzXux3V6DQOiKAwr94UFW7Ynlmemp/NtR+Ib3q+/GTkpnpcXcuKh+eLB9Yty08Ojs4l7NYiPPngw8UenMH5fYfE+BDpev+9uFn2HPjh2vsVFvggAAAD46NWWxR/cd/IxFykp9+qr179ndUFmAZNbcHLL7tdeXs51jftKLt5PjJQd6a+Ex042xPSs/JdJgX+E369ghQReMW2YsEgRgkFEJCw8IOm7/ug5WoukhE+ZGh/gh20S81JQ1NDVDiIhUiWnnFNf6YHHun/zIh9R5k4xosoad1S3KqTUbdyiReN6Nr9FgjFRyNh+jnmTxej4bA6nfuxW9Svm/ZDTlZ8vmGkpNrsrXc9Q8nV6hn1QYhZ6w8HeBT9iSkauznrx5/K46WfWbcubNFYby2Wx85KuJBfxKcoIO+w9qB96+gh9UgFSH5pawZtSRV+CwHtRXVNTW1P7H+qoebnAJ+ezzxD2n1IXJeUuXRAAAIAPRGYQER31HrnmJ2e9upTRq1uHN5/Li/IN6rl9kWjtBD6P6uC9yKav8FdS75Geyzgbfo0rLr11/fEkt4GohfjV3Sd8v3RsXSREott4eXF8doeXll25muUwp74HHd3BZ4eD4C6vnJkeG3I2KT3m6LrimTtEci8Na82P2+d3JbMCy9zouP6wyE6uKVwL0rPxUHCouUUzeSnz+QHCPFg192VB6t/BJ9MyAn/989XqFQ59JbaD++pZXl7Ri7xc1quS/II3VRJrooxetPlfv10RBZzClJBTKYIHqWYuXurXd8eWITKlmS35EHxCAdLwvnqKBkjYSxBoZ1hohIG4CLxn2CmH/VdLnH9dunSBMAkAAD4Ab+PDU7AUjparV0N0hOk1epHXM5/dKXkhoVk2c0RG+PQebC3R+tcyHdozLup1dd4zFhpIRy1Etx4pUTqcPtRMLTy2jMvMf4WMpKRQyN0Y5s4r+vXc7hOZlx4Skj54ttikSag4lgg5ahF1oLO3x8he8gYZglrkapraSG7KlN56NovWq5/AjhgrPCjOxtu2rmY6XuzBj5jyVYhEoUqLFTQneO22IYrmMd8hWh+LkaON+yozz13Bn9Jo8VHtRD6hAGlK/2Gh6XcUfQkC7YlfjaeOEAAdB4uUsNMQy12SlKHLMQAAdG65OXj5LHVj00Z9z4zNjSgpD7nP8ouRkSbWTNdUQ+llSF2jUayixcBCm9eIL9e8mI1o9dFEWcWoR6/eks9oaqsjVNbMCJyeNnb9I/0fV6c9KUCmDaXeiiN2b4hhISXK0G+Weo5uQfelf/k8pCjj8eaaKfHFhblpXFsbIp/FPLdr+61yRFKzmeI81qKPJrUb3oEw9ajHMWnT5JC1jO2cRcrxlefl4134GLpa6MP3CU0Ua2doNlKn2bIhDbCFocZ3u4LoCHQe2KmInZAIAADAR0Gzjzp+U1RYLPkM6xXRnajx/D9y6a3BwNvOpcxCyWdevSRmcaWoNjM9EtH05lc19Fvjph7dhkVHJLrzinWKR0c9aHj2p7z4BRcpSkmQpSKmWsJlxCRgEY6yzYLVs+2MGN2J6AjfVvnW9jolmYmtU8+0+RLmH4BPKEDC+EyYrqwkV0cabDFsYQTaDdGzCaIj0IlgJyR2WiIAAACdFlFjGr0uYDYKB5hPcvHH6isEDDQxxRq5rx/fLxJfriIvk4XddNPr1w21gJKRKV7GoOz+PZb4E9ynefgjVN26EuLSFTCf4zdaffrUP3LlQhYXKVt+6+Wg24KODDqmhvir0hOTOAq+kv+sAI8e66ZaQkUvmHi7jNpTPDuXmSnPnDfc9LBb2HIU8zGWFPQR+LQCpEGaOkemL242RsIWwBbDFkag3dRASxR0PnBaAgBAp6Y3yhbLDNXmnT6RwhG5ysrNDj9xC89+WFoNFg7eoVjY4VXdysKPRDLrcyC15feDrqRjL2SMndTCYeYUS1u8vkJxbFB4fkO/A07SmRCiMLfjBGHr8VXSleRC8Y4JteXpJ05GvcXTLOOs6sKzosz7+IywekPNWxhYGE8ajReXK7zy57ks0WOC+KxXrwX38uIjsjjiiSC8IMQFPPLpNXKUMOXTuwdR1o/DbJhvFs9u+aVKdq/gc8rFV1bNjPDzT+MiitHc6Qr01erMPrk+93aGZlHz1vjEhiYVZEldYKSOEZY7guioXVVDVQbQKeHjkWpqoGADAAB0VnSHhbb3d8Qx08NWrIw3HUDHkh8Vr/PTmXiTnWLqOkskzDD+erplelDyy/gtq7OIJflF2Vl5FXjROddZNtQWb8JAZw+zrH1prKjdG+/rG+t3RRWlefcLsaBCmTHJtb4wN5/1MPBU3AkK3dgY30j0b9nT3KJXPCw6oljOcW9IsxS9IDoBZvl/v1r625nODFg8uKnt0ZrkOTljyyUW89bRFcl0wTFBFaw7uayhc3YsxLfnXVbMmZOxgqroePz4tiQvswifmomkZbvUpa7Fq2RqaRpxP736/qmtG1KI/cIPbM1QU53k9ALRN3x1/cCGm//q6etqfY7w+WGf5BXj+0V3+GH20Gb6F34wPsVByVjwc959RUx22sWn9+4W5glmg+1DUxveV29K/2Ew7ug9qIXOdaCzwk9OCJAAAKDT6jtp/a99wv0vxDBZ6Q/q+rmR6TYu7jOt6GK13ygmCzct0jwUFJ7XsCSpt4Xnjy6mLQ+P8PWaLlq9hqj2VpydUVy3AePcv3Mb0tBtr5e+PiP+PpMrspH49KxDnec4iU891AY0HVds73fl+Klb6RyRPaVqMYTdDbWMDLvdzy1/xcyKZ9a9hkwfOtFx1iTRGZkoQxcscvU9FpLHFe4XqZvlN0sXqoYnp4u9HamrColXlvc4I09kv1znuwxVRx+Nzzpq3hlu1b8IfKp4//4LGSTQOX32GSJ//jkCAADQyfG5nAqiX7SSCpXaZMjBK+cQvcZIlG4UMmoztdVcThW/yQ3gV5Rz67qjkbp2a+8Zgviccq7gEjRJhdpVfJPqtxY1c8Tqt5lCravTIGWhuoPfzvtFUemYf5EhQAIdoIoHnz7ovFTIECABAAAAHa+jAiSY9wOAT1INvyjrHjFjQU+DYQbq0vqU8Ss5lXgPZQpN9SOYFBsAAAAAQC4QIH10Kh6e3BoSz6O7rvzRrvVTdfHK8p7kvsKL9dM0B+kxusIJ0wj7UcSF12Zzx+miDwb/edTmbVfzhYl2tenaG5xo9wI3n71ZruG2duVkTeFiD09v2JeCkIV7kEerZ0yuKby068/gAsoYD++FQz6KCqDy4JUzs58UlxP3u/UdZKwluxNCNZeZ9+gFG7+r0lPPUKdXE9+12upXuZl5ryuxu7Q+pnoMebs2NHS9qNPGvU0AAACAjwK0dz86T+/Hc6oRKkq4y7JzoqMWqy1PDz7gn1QmUslRWXOI09L5Fr0+reLwTeCXpgRtO/qotGaA1gcUIPHuBe7CoyOS5gCniYO6s0tIWPoo697N19hHXXjjXslkRw3U5lhpN3Kx9fNvpj5ZOKTV4Vbnx80K2XUy5qV4aVQlirH9vKWTdSTiGc7jKwEn4jIrxB6k6k36cYkto1How3kQtutESnHD1zKMRDWa+dN8m+aHxrJi/tgdXtroYXI305FT3VxM4HsNAAAACHTx8fFBHaG6GuYbaR801fLHOWWf95v6tXVfkUmi+aV5t6NDM6qHGfaWZy3c+4d2Hrj3rlZJWdNk7DQ7w75Vb/JfV7BfPr1dqD7WvHcre1y17XSc/MrC+1dCL5VqDWW0aNK3FqjhF6VdOLD7yKnbJZX4ID51y/8N64M+DOybwYcecJDqsJ+3zbfR7atraKzdFTttKOWZOa8peq5fj9GuS/AU3b+c/AKhPmbThrU6F/kF7fP8J3l8ja9mTB7QvbN32FNWbnUVu9J75y7l8ahag0eOcrAerKdWyyt9/ebf6lfZdzPJw6y/FMmhZYatOpDwkq9M0epnM3LMBJMeiPv2Fftf7pu8Ww9rh9vof/FZw7Lc1KO/HH30phZR+5pMnmRjbfAFu/Dh+Eb3AAAQAElEQVTFq/LXabeefGE5ol8zk8JX5NxIysTSTmQKtasKWbmWxyfSSTX/svIfXXsg+V4AAABAhyMpd0xdWcggfXS6GrmtXe8m+Sgr5sBh7OKxZT8kl8fhx9O5CKk5rFjhLJjXeaStbeLRdcFZ3PTwC48Huw1EncfD07v2pSAtJwf0XrATD/x8OqeSuIRPo1HYbC76oOQXFOI3JgMGiv7NUR0we+3m2aj9aIxZumEM+mSo6jp7rR86sD5it7BzKY/33XIyG+VFX8mcMNO4fslyNre7ycIlM+urvlraOXOzw7b9mVL8Mi74htUK2/qVCGZbR5pjvda7CtJQFpYTRkb9+mf4y6ILf2eNmyfX9HyaY7w21+eWeUXJJ44EppWjl3EnrgxfM1kNAQAAAJ886FQBGuPGxz7E2mEUc2dhdESgWjk79sWfvR7/EH3CKt68xqIjUk+D6Ss3758lZ8TZifwLudv3oLuRSHREUOpmMwGffB3xmHlFIo9rfbV5i7vEnBgUQxdnU/xOZnZuw6PC2daNnF1EOukpaTm4jaRiX8v0+5lIcWQty0Wz7Yj5QPKe5SIAAAAAQAap06mvUt+4gP17w334IBu7UR5hIXFBWm3EcK2QwiKU/TQTDTZG7xW/nFNJtOyxA6Oq+LDyupeTVGnNj2gXVm/D0gDdqKRGqd2uBrae3gOGf6mGr+cBajv8SjYx8UAXCq1bc9tYw68s5yIph6JuJfiuUtu1+FzTR6llq2qqYh6fy65bSJ4PEdV/6PIcz/ejh1p37Osl8aCWlqa0ZTU11VB6GXpZUozdF32iJ11T4roWhdIVIQ6/mo9aRkdPB6F0BAAAAAABCJA6DT4r+UTQiTQWv67MFImq5zDP3cFQMFyBe99vq//jakQZvOL3mcYiLSRO7J8rLhQhspHnlvlDsYZS0ZUNv8YVIzXntasdtOp/FUo+tjr5GHHPdGbA4sHStyQzl2gs6Rn3l3yG2k+Hioo4vCLmS2Qs11im1uPmxgYFhD8p4jU8RDJy2rFynDq65+8RdLvuwaKIbe4RxD2tiTs2OdQNmsHrKOw6+ajh5SSqmb27l6NBw3iN4qjVG64WIbXpmzfYV1/980BM2mu+zIURohlZj0JtoChy8+qIMmJr7f6NPbzvfE5p/dv2NHBaON9JX2SkishGjvrn8KagJ+wa8T2tLLz5V9CJOyX8hgQRSV1/2MyFM4b3FPxaErFxW2h97iIlyD0lCL8jKFInsn4nzWa2nJ0VFXDsRsNR6kLSGuGy0n2EelNhkvDDGuW113NIw6OlqWf9Qu/lvm5o25O6jfhxzwwzkVdWPk8IDoy4WSTS/idR9Ufbe7mKv6PILkysiNp38Opjdt1TNN3ZPy2b2Pqijq1U9AL/JpIZenJsCV8wU1xvjYZPo7cGQwkVv85Lf400e4os+awAX21fXR3UMgV5BfiNZh9dBAAAAADoYtdZVGQF++wOfMDid6EwDE1shhjpUZX5nLzwP3cEpgquOFOGznE0VcLTO8EXWSIvTDkdjbd5TZ1n4tFRW3j1glh/4wvVmK6U7vhN2avX6L3gph3dvOkcFh1hbf0BY6wGjTHvq05G/HeV8l0s5z4+veWnACw6IqnqGmAvH65PJfE5aREHlgfcq2y0NP9F1OZfo9LKKfrmwjdCxMI/n32C2lH1i8hd68/lvO3Rd7hgC7sg/uuc0F2bT2ZJWZr/T+i240R0JKro+va1uwITsehIZE+78Etz7+xbuy2iCLWhomt7f951FYuOSHR8g8eYapAQvyjx7E+/RhUp2Hmv6Mq2nw7dwaIjkha+zWOsDHS7kbC0z7/ib7d8cygeHZEouqbYMgP06dgbcnKvyXxH9r3Dy3dczVbGN89Ml8g1sfNP7jyaxkMdiV8QHol/ogzb8c1nX2sLkh/h1cH1dBgNDyoNdphExw5JiF8ks/4LUJrkfyEP+/swztGGilqiOCI0hoOtwMh5QiuKXgIAAAAfEcggdQbc+MCj199iV4hHrvnJWU8Y53DzgvdtTyxLPhtuPZRIGXUdOdcpBUsWFceGx09YZEMslhkafR9r9hk6e4yWMbeM1qTNByYhxIrywSv8Ws7bsdC8ma3h1xC1iZWk9UoirmczUXXl+ylMUBwXnIQPhhrltcGzYfIcPrv4HZHSGeYZMMwTobsBy4giDd47xOtTVyYe3X6Dg7poTF65zK0uG1OZe3bTjjtFKaGho4fNFutCWBYReFXdZv7+GYNogrxEDefu0W37Urjsa2dDrTZP10btouT6vkjqxCWbZw+qa9+y7/j7nL1dzr16LHT09um6YktX376YjMa67/96GA37fPhEM7kmP3hfxGOsOU0ftvJndzNa3bKVOcG7Dlx6XhK686ju9vlmZA2nTXud6g5XC2c3yg/ddTa/ElHM5q5aaSUc0L/wdcKuzaFpz68G3Bi5cbzco/xr7kVcKMFudZ1WbiEGtwnwi0sqJd8OqY+dv7H+c8E/xNBtuxLyn1/ddEJ7//xB4mdq2dVIrtncDfWbV/ng8HK/J5Xlj8Ljy8wmvM8iBGV5Sbmv8Ds1rx6nJGQUveIra46cvdKx+Tik+GJoDPYHQUnParTYBms6eq14u29fUvyWVamamoxe1czMIi5fiWL57Ur566ZUvMhITiLGR70rSk6+m/6yGnXVcVs6v62usAAAAAAfOsggdQL5V6LxMT9arl710RGGojfD2QZLYnAz7j8VPkSd4O6GXVCuzQsJJZILhZHBKVysFTV74cg2nHrzVUkZftOD2gu1FKcgPSnrVUuHRDR4+YJIfvQzHyS6fySappocY0ryoy/mYDf6079zE+mrpqo/Y7YN9mpuYmqjvFA/p42zGlrhqAt1+PzvJuN9mThXb7VbEqkG6bsua4iOMLQRnj9a47PavE6+JZlE4pSSx66cRURHGBKRHbkdfglL6HXpO3ulSHSEUTVwWzndDNsdLDZI4KA2wL19MaEUW7GNe334getp7TEFj3ByU9PY8q+M9TIfz/+omQ3tK/owSVOjbic4N0Pxt0P64p8L/iFO93Y3wO5UJsXcaPSWqsOm/yiyeapD3N2Igge5T560/pREteXMBymZEhMcSce8fiosEP8JD39QxO6qZ/ftj+vdjJr7qlYzI3ZvicGyuMrGU6fbSAYtpF79tGhK+IisYmZWehEx3oxC1+ypwCAwzuMrgYINi0jCoiNSdy3LkaOMm59GCQAAAPhUQIDU8ZjJ6fhlZkOLcT3Fn1Bi9MNHFVRn5tb3qVMb527LUELclPCoorLrp+OLETJ1dbdp00u/wkFQZEoLB7bXZgVv9tt36qj3H/GtbZX3UiOabU/+jsxXuGmbn3oD7wdoMNZGMmlgqKeL/b8y+5lE1zMz6xE0iUW76I4yx0OXyqycNu2nJspgrHWjtIauuXkP7Ib/OLNQ4hn90TbiA1i4Dx/k47fDxk3s0WjdqtZjiCxR7uNHbRAb8O7dfoTdUMeMHiDxDE1fFz90uTnZSG5qPYkRRGVXo+6wpfbN4z26S8SHo+zG0Ro9qTpixCj85YVpGZLZzMGWw8RPXYrBl8QRfs0uRa2VGbRrS2DY7l8PXG++l2kPvSEmNkOIHrM9KYiTF3Nqt9cav6hs2elXfkHMH1ux6IiPKMZTv19hK3FicO8f3uodnPGqi9pQO+elP65Yv9jZ2VSNVFEg0he3eZTeejaiG/a2KDn2zIaVW4LTP7CC9QAAAEA7gS52Ha48Lx8fbIAKrqzxjpV4jk+0WIpLsACprluO1qSFtg83xJaF/74b8ZvsXNdSmhoyymfJicd+JRjswXn9FmtNo1bQdpg+KNn/ET8/cu/8+L4TnZycRhjQ5Ivb2Hn5eGqhS37I+g0hEs8JDmtJCdZcFgk21Ay+lHIkdXWx/MYT7DN4IbawPMSLIggNWBqwaLjoA1q6BlKK8uka6KFLqaiIVYKQaIKFaqAncURLXhAxlP6XBkiaPppYI7tMEBu0tkhB/jM8JYe4N/023JZ4qpZLJHJevxI5VZtBHjF9UkxadFllytkfHsQMt3eYPnGYluihKH6Zj9/01f9S2su79NXSQKgIlb7BB9CIPKGm1Y7JEC6bQ5w8tRz2Oyx11vTCOuMWujf8xmfFH/Q7mVkQ7utH8l5h1+jD4OfH7dt/JRNbPYnu4PGd80DJWY/5qWeOp3ERWW+29yIb4T7SGaYjbVOPrj6WlXzisF6/H8c1s0m47oOcZzuJfEhYVLb3WEh++fXDhzV95FoDAAAA8HGDAKnDVQrH8/C4HFmDyGvF+vNoOjmPSzx6nYs9SHf+ZmQbh0eoybQiETVhbdBeTZSwo1h4LCm/kMI3nTSJgVqJMsprPe3SUf/IfDa78OrJA1dPU/THOkmWL5OmgkuMZKnhs9/IyJ3UVP+L5NDyAtYU3cGDxkjOk9RP3ta79E9BuatkNPWa/Qa/oau1KhSVS6XgmPIrZR1SxFdokiXdqd5/9AnadfxREb/sbkTQ3YizWuZ2Hu4T9QVFA9+UEUEXtTsNdRoUy/mL2Bce8k3HOegixZDoNt/Pe7neL+YtK/Jqlt0csQFwr24d3nwuDx9vp2v7o9ckPSk54fKEa/gssXoTp9uIn0MU85mzknwCM4ti4grGuSpeyo6kY/eDfebPYem1RQlJrHGOUKoBAADApw4CpI4nmEOGYu6+daqujCVURH/jJife4RIN6FrWlfCHtosHt22MpElXx3MOpS+kZJBelxGdlNQZTSYjKIa2boaobXShDnRctn9SWe6dmNMRd3LZXLx8WfbrHRscms6HkIjxOajbsJU+TroyFlFFzStlEV2peqgpnpagmk2db4ZapuQVEYnSejR7PZ+Eh3A1qAKPs9s+WBbTRfDnoq/b5kWjZBw71W5IESR1i/k7hvGLHsWEXrhxt5hflBq1KfP5SrykRP3b8SuxCweKz3zVXvChRHqoZZR0LAd1i7lVzmXmv0JG9WP8iiN3b7lEdKtznLd0so6MFGluHhP7vzKD0bjOBAV/MLPsVSmWb2xRrW+Krl5PlF6KmIVFcmcAAQAAgI8WjEHqcHRNovQal/OO0r0bVeqP6IyxFUkBwdiFZDWHxc6mSoibHn76QVuPHOjXh8j8vMjLk3ymOJeJvxnDQP89nzgkNX2bGRt37dwiqFP3/EZsVjOvUBcc1nLOWxUqjSb1R2KQ1Tu2tCFT+Uy80hrq27sPah9vy940frCmMJ/om6erqdHc63X1iSRVTt4zqU+/KCZKbvTt3QaTAPXW0MVvOG94sg5pi2aM7ULSGuKwdPPO/d8NwMOu+pISOv308Zv8nDxpr6opLCI+Gd0+zR6izudz1c/r7xdG+hPRkeW81StkRkf1qiul5j1rUetwK4n0NYXSzjE2AAAA8CGAAKnjGQ8kLkjnpiQ0P+y77Pr+8PRaRLFwdh440hWfFIWbfDpU/sHVlfLU5+49ZCieLimPl6yhVpCcgre29QYNbP/uXFKRqVkGxAAAEABJREFUdJ3siEla+RWNpjGqqBLfNaMBeAE3lHMjoQzJhZ+Y3KhU3Zvr0ffwW/2Bg1pYsqJZlY+SGr0t+8b123hftb5mJs02WKkWw/BBSpW3r99sPLVTZcJNYvvNTAag1qMPNCNq+t1MbJeafjRzJ3sijKvkEh8lzcwCH33EvxmbIGXP7tzBD1EXA7O22LP3pG52I6ouo+4bxE2+gJda6TV63kLzpj9rfT3iusXTp43jRdb9NPwk76XewliRm3pNUFBFX7/VvWIBAACADx8ESB2PNHLMOKxpVFsU7BeeKZ7E4L9MOXkho/7X4shjwUzsMq+Jx9f4AAZN++l23fE64AFBGc3WKBNc2hd002kO3W4iHrNxU8+IlMaqZl4IjXqLv7vD2Pc1mUzu9Ygs8SPy+iVR0Y/UVaSL1+fErrFzcsQKPpNHTLbBW5y5IYeCJVbCL7l9PCKt0btVxgftShSJpvj5ob4RuTV4P73pY9svJOTfDDhwUyQ25j+P2BWCF15QHWs/UY7hNzQbu1HdsIxKTuCu0MeihwDb/l2hadj2a090s2iTzIDuxIlEMHYjaFd8idgpV8N5HHn2ZsMMxtzc2KP7DoXebSLmZ925lCK+En5J0Vv8VlWYx1Cb4DAI/5zTQ7eFis2Nix2ibUF4wQhdR6dRnaf3XQNWzMGg5ELxUuB8VvyBY8TsRlqOE+o7wuWlE4X/9PSa7RrXzdoa/1ZyEoMCk8obHq4tTz9xKLwUX62drcL96/gcVmaE37oT+Ogm1H2k80jIIAEAAAAwBqkzUDJynWeRfjDl1cuk3Wvv9uqr178nPlFPQWYBk1uNTGfOFixWeCXwCj47ylCX6aaCZoySjqvb4Hi/h9y00BMP9BYOaaJxQzc27oZelnNTj654aWSmXp2LLDYvHCxraZKVu2f6Dv90bvKxrXnXsO1BRXl5eZxqpESxmVX37u/Bu5xQv4iIbhoDzDSwSBDxyp6kFWJNQZKRvZPIEPcB/Q1QUg76J2r5huxRX5JevOnjsRwfoTRwuvvEJ4evskou7doQS+872EANa22/fZHzJJ/LRwOWzpV4M7XhFqS7xzfPv9h3sLGaKqfkbmZJJR8fBDVx8fSBLS/V0BzNAaOUnwSuWRWhbzBAQ7lu87BPbMTS6fIlR8iDPFdNLNp8Nf95wvbVyer98PUgTsntJyV8PLobsHSlg1YbbT9tvPvCB3sDs7hpJ7d9d174uVSW5D98xuHXqE2vn3g2K3TnuUdY2ucur/fRpdbSk281r28EnA0+SdU31e2DBzncnNScIh4+DVR9OEoaNH+j07bVESX5Vw7/cEO45NtnT9OK8COkauHu7dgXdUr8lxmB29aeoKgxvtTS+hxVvC56WlyGf65KFMs5ixoqxb1984roHZd8bHXyMemrqp/cGf9WPt7hn8ZNPrXlfhj2jaZ3/7fsaW4RUTSSYuzkKmcBuuKY3R4xjR7tauK52pkBV8wAAAAACJA6CdJAl81rtc8cjIgvrX7FzIoXpnmUKVoms5xN8Lu1RVHH4phYW8rQca7oVd6BznNNM/BI5nSopbF7E6ELw2WBa/aBkKJqTmFWPJafMBuFmkIZumip59GAwAdl9dtDouo5zHN3MHyP15h7aWiRnxSVl6Qllggf6ULRH49XsRPNrJBGzl/6dPO+JC6/OOdmMZYw6SNskZMHzPbx1j99KDCxjM8qvMsSzilE6qYxZqZT4+hQx3GZfa8Dv10pvJtYt2RPA9fvF03Wbq/udbjP+jitHKfuezgi98nNXOHbqpvaLfWcqCv/22o5bPm158nDEVf/4ZbWr6cLSawoXNvQGLPcu5egrqDo50KmmjlOH1s/vL93335d7j2uQap0DZk7odpTtyep6DUnN/WRcL9R3QaLhHNajt5/9D7rd/ZOLltkSbLGcOfpCycYtOWetaUvTM31EmLzXnHL8h6X1XWJw77OxrMWzLTsLfJXt7KyUv614t/KddsSz+wLyyjmstIfCBN2JHUjZ9ev7QYqVh8D1W9VT/oIW2fH0TpUiI4AAAAAwmf//fcf6gjcKrlqLH9q+BXl3NcvnrK/6K9NJXXtRmnrljmfU87Fr1h3oXSXb918Lud1UUEpRUeHTqW2WThdxVPg0+eXcyrfFD5+Rx3Yh6raTWYZAH4lp5LosCVlGT6XXfm6MIvT1ahvDxKFpiq+68VRqzdcLUJq0zdvcNIkFn75LJ/fU7e3muSSbaoocvPqiDKkNXHHJjzfhW3/i/z86l66Wj2oLX9bHoddxSks4NJ1NLqqUttx82v4leVlRQUlqLeuuiqF1o0kbUtIqg2VMO75ewTdRmiU117PIQ1L4Z9aeUn+S6TV3AYLTgP8c+lJVaVR2jNmRSrkz1FbwL9ulSUFxUizn0bXNv06132R8RKXYkVcAAAAgI8IRaVt/kVWFPzL2rlgQRGpq5Elai8kajfFGmkkCrW3nmlv1LY++wzJH5iTulFp3QaManYxVarMATtYUETrS7NA8r0fhaY9oKXluVsO237dAYNQK5GpNOyn1atpXhcs+NHQH6TR5JaI/MrjVuA3alri5xL+qalSzeSoLC04Dd7D54KdnG0F/7pRu7X51we14IsMAAAAALlBpwrQAT5DbdcIBR8C/v00vCqGaj99TdTJwckJAAAAfOIgQAIdQKkLnHgfPz67jC8oPce+E/gXXnRO3cZmIOrs4OQEAAAAPnHQxQ50AOUuXWpqajpo+Bt4T0rj96+O5tK6oco3RF2+boPmTNFFndtnn+EnJwIAAADAJwwCJNAxunTpUl1dg8DHi0RRJfHL2G+IenpDiPJ0nXHOIjFdIDoCAAAAPnlQxQ50GD4WIdXUIvAx41dWIlXVD6OgQJcuSiRluGYEAAAAdBZQxQ58cojGKMRIHzeSamedq0gCREcAAAAAEIAGAehIWJP0s89qYDwS6ECffYb3rIOhRwAAAAAQgAAJdDBlom2KJ5Jqav9D/0GkBN6Pz/B63p8pdVGC0AgAAAAAoiBAAp0C3kiFdioAAAAAAOhoMOMHAAAAAAAAAAh1WID02WcwXT0AAAAAAABAig4MFjosQFKCAAkAAAAAAAAgjdKnGCApQYAEAAAAAAAAkKIDg4WOC5C6wPAnAAAAAAAAgBQdGCx0ZBc7JSWIkQAAAAAAAABisDDhU+xih/Cp66GXHQAAAAAAAEBMx4YJHRkgKWO7DqUaAAAAAAAAAHWwAKFjp3Hv4E5uJGWYGxQAAAAAAAAg1OEBQgcHSF26KClDjAQAAAAAAABACAsNunR0LbeOL5OAxYhQrQEAAAAAAIBPHBYUdIb+ZZ0iMvmcBIORAAAAAAAA+HRh4QAWFKBO4LP//vsPdQLYZvzLr6mtrUUAAAAAAACATwmWO+o8KZPOEiAJ8KtrqqtrEAAAAAAAAODToKzcpVNVbutcARKmpqYWC5M621YBAAAAAAAA2haWMiJ1gqoMEjpdgCRQXYP5D3rcAQAAAAAA8PFRUlLq0qWD5zuSpZMGSAK1//1Xi49L+g+7AzklAAAAAAAAPlxYvkgJ+1H6TKkL9r/OW6GtUwdIAAAAAAAAAPA+wQREAAAAAAAAACAEARIAAAAAAAAACEGABAAAAAAAAABCECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAhBgAQAAAAAAAAAQhAgAQAAAAAAAIAQBEgAAAAAAAAAIAQBEgAAAAAAAAAIQYAEAAAAAAAAAEIQIAEAAAAAAACAEARIAAAAAAAAACCkjDqx2v/+q62pra39D7uDQQAAAAAAAIAP02effaaE/Sh9ptQF+99nqLP6rHMGHtU1mP+w2AgBAAAAAAAAPi5KSkpdunym3KUL6nw6XYBUU1PLr66BfBEAAAAAAAAfNyynRMKCpC6da9RP5wqQsNCouroGAQAAAAAAAD4NyspdsDAJdRqdJUDCNuNffg30qQMAAAAAAOBTo6Sk9Dmpy2edY2BSpwiQsG3g/VsN3eoAAAAAAAD4NGHREflz5c4QI3WKDn9Y7giiIwAAAAAAAD5Zgg5lqBPo+ACJXw096wAAAAAAAPjUYUEBvxPUI+jgAKmmphaqMgAAAAAAAAAw1fhsPx2cO+ngAKkzxIgAAAAAAACATqLDA4SODJCw+BCGHgEAAAAAAADqYQECFiagjtORARIWHyEAAAAAAAAAENGxYUKHBUi1//0HtRkAAAAAAAAAErAwobbjOpp1XIDU0aOvAAAAAAAAAJ1TBwYLyqiDYFEhAgAAAAAAAIBGOjBY6LgACcozAAAAAAAAAKTpwGChwwIkqF8HAAAAAAAAkOq/T3AMEgAAAAAAAAB0NhAgAQAAAAAAAIAQBEgAAAAAAAAAIAQBEgAAAAAAAAAIQYAEAAAAAAAAAEIQIAEAAAAAAACAEARIAAAAAAAAACAEARIAAAAAAAAACEGABAAAAAAAAABCECABAAAAAAAAgBAESAAAAAAAAAAgBAESAAAAAAAAAAhBgAQAAAAAAAAAQhAgAQAAAAAAAICQMgLgY8FKu5T6HLvVNnc0oaNOoaqMjdRoKqjlqjhspEpTgW8q6ARafT7zsm/F5XIQourbjjZozfcCAAAAaD/Q7OoceGwW51/sVkVVndq1qQUQ+pzao665XMFmVf7beFkVqjqVjORXxSnl8BR9IY+TmZqQy2LevZ1TiegmtqY9qfqjzA3VFHnjtpZ+xGNBKHY79VSR73jU4UrPLxj7/SU2Up956vbO8V1bsoqMnSMn7nmOlIf9djNiXj8EQMdpg/MZu4gR5+OxKRMh4/XJcQYMBAAAAHRGECB1DjfXmc29gN0ark+66akt+Wx1zkHncZvS8Lsm3tcvLqEJHmaedLbckiN9hWRte69fNy61ZTQfsOT8OXHcXjzxghjLryevMmhm8Wp26ol1KzZdyK4WffSM8HbWueKdVghgiqOPYa1JTOmZ6OSd422R4hKP+RIfTPW94Njn8zy0EQAdpQ3OZwAAAODDAGOQOj/2tZ+cBdERdfrJsCXy9UvhPY/eM9vSzON8cXNLphw/+Fx4l+l3PKG6yYXxUG3glPUi0RFVnS4ag/F46FNTzctOPHHtcaPHNW0dzIg71Jn2lqhFzO2nC4JhE5cJ2vK+LwCtwSvNiLyQWtro8TY4nzu1qtzEYzEZCAAAAIAAqfPL9v/m21Diwq3Z+ot/2FKlLWO/70FaWt1P3LkD66caClKDnEvfz9qX3WTMk3DhbBV2QybjcRfvxJm4JpblXfvZedN94m6/mbsvPXhWVFic+SDtWWFxUV5W8uXdHsPon1pK8tbafgy9Ma5rz79o/Jz24kt5WWmPn2W0uD8Sefwf2MsfZD27vLif/O8LQAsxTzhp9hsycdG+1PLGT7b+fO60En/p17ff6G9+iWQhAAAAAAKkTo4Ts2TKFuKiJnXqqXPfGcoIP1SwNI563Y+x1TRP35sZJ6cJYqnM3/9sIuapuHDsBJ7zobNsr9AAABAASURBVC/6bhrxwPlzF6pkLVx8du9ZIlTTXnr15k43M3WRXBaZqm3itiki7fdPrOdNFaeqqafJVPXW1ldQUZM2MKyZ9wWgRSo5TT7dBudzp8Rjf3qZbwAAAE2AAKkTyz3kMvcC3mChTj1y23c8VZHXUm03rhomuJuRlSNrqaqrF6LxW223qT9aTSYeunT2fKmMpdNTU4lbw2+nmshqJMGgNgAAAAAA8CGD9mxnxYn73lGQPDLZGOlrr4YURddmIHQPu5Od8xwhqaUXSs8EEtkl7alTjcmG8+esuHSiCiWe+bvUbYE6ei+qynJSb+cKr1r30LcebECV1XunojQjOZVZid8la5tbDVRvyZVsHjsbe783dW9nbtBc1T4e53nO3bTnvEZbWFVWyqnBPiZhIqeKU8oSBpYNZQaFy3Sh0gXF/eqqDsqsVdjoJXUFBj/Hr9yj5t8XcYhnRUsdNt6jUuLFZCqdqnDJwYSNQ76PRKZL/z41p4UVIxrtkaAcouAUoOqPNjdsYqsq2NkP6z4+RGaYDdPXllJyWvItqnmsx4mpgs9Qrg9dDoqcSHKe5G37XVDwIAjPCtZb4e/sN6WsboK7jc69+vNZ8h2f56ZmCLYK/yjbuqal6PrxtRvjW9X4CyLrJdI3SfiVZNd9ndisUuHXSeqXtKo4I/Ge4CCSGcOsTDQ7smgnAACA9gMBUqdUnXPwm9nn8bYSbdrxc4v1UWsYGshoyz47f5wYUGQ4d6YhdmNpP5N84hgPpR4+lr3gZ8PGy2to07EmFBZxnbqQ4fmzSevOnapnl9bO8QjOlXzc7VThboluerycY15f/3JJPLGlbOB26K/dk+UO5KrZ17Z8szAgQ7xnmvr49YF+nsOkJed4zMh1C5acyWjU98btbOHu0c+PTx+JVyuuE710SLTwrsHGxOvEkKG6ZfCKxt/hFY1zD02cvA8f5TD9ZPE+aX0Ri0+4DlubKrJA4roh34oVLm/mfa3P2k30xQ+UvV/eEWdprbfEzWauWBiMzLc8uKh4GMzD2s3F6HklajGxPSq+8L3jEok6IvTJv4b4zTEU33bsbNnx8y8HExslN/VnHjm3015T5lsMv3/Ia96Wa6KvUzZYfCZ8oxUNtYwiJ5KcJ3l7fBcUPAiJ3mazzzc8nbPXcche4f1G5179+VyHk3LCe+3m848lvyp02/VH/L4zVyj1LRXn3sHlCzdJ7DXx0ZO3SXxBFNskyUKgkUvMIoV3JQqKVmWe+H7W2miJmjfSTj8AAAAfAehi1wk1lK0zWR9+wK6FLbmE68KWs4mR9Mrd2aHHs/HbYXOdiXaAstW0b4lm6fMLFzKlvcBsqpugwfB830Tn31PLUMvlHppiJWwRqqgbWDvbmmiqUwVZF4mSElgmzWycsEVIVjexw5YkDkh1TvCCIVMCcuR6OyzgnDLwW0GjVplmaGVrrS8YQFV6bYuTzU9xjQZeYB/BCMtFddERVZ2uif8Ir6O3ePRP/QEMvXBNWuUMVvR5ohMjed43LRzKZTJ1pqDlGn0xWupmJkQSNTnQ5Hkz3lOSUBYeFi4OI6IjweFVF4ZErEtrxzgfEq8s8vz4Ag9hdIQtrG813spAWDsx98yCcauuVUh/C3bcKhtHPDCgEh+f4ATDTwbXbw4+Qy2h0Ikk50nezt+Ftj8IkuK8ndcKQhEVdXW6me14M+G7sOK2TPnmEBO1DiduhY1TfXTUsBf4R7/kfNn72CROzBIzW2F0pKJuMt7OhC4IsbBtsHQ6mIsAAAB8ZCBA6myq6svWmay/ftWzuVmJZOBcWrKAqL6AjH/+UXpj+95xP6K899BpDnVXQM1nCS4MPz94IlHaSwxWn15vIrh7f98UkyHf+ieyWjK4+fnBRcLeg6vj8p6lXQ/xO3n13oMsZl5ayHqrXiILNmTS1O3/SHr27MHV49iSj4szIpYRFYdTN64LbraOuUjAab48IuufxzdDTobcevDsWdLuyXj7knV2yfYUsRfgH8FZokHWb+aRW3l4pb57+M8zZt7NwzOJOuvai+MKi4sKi49PFbxk2nHiV/zn+mKZM7oazJwr+EAvBEc2PnDPz5/Gu0Qi7e/mypxKqrn3NZ63eCjxxKXo6MZhQ3XcGcFZMX3mtA4uRBa33HFLhvrk3Yl1hzct71ligJvg0KVt8Qh4LvEC7Np/SBqx8K1zp0Kupz17HCLo5sc5s/es1GFzcd5eZ6pG/3rzWWEW8fFl5Qg/cYQydhxORApT6ESS8yRv7++CnAfB9gBxFiWvF5yfWDay/rySa85lw1kBN3MKn6U9SLt08tSlB1n/XP/Nighh034/2IIj3aA0eMHsYOLjpTvuTK7fC2Ze8h+TqZwL5+NatUkMz+vEPp4UlKjBM7fCvS5sSB/VjwUlTtdnaZdPHb+cllmYFb4U/2NYfW+T9xkofgcAAB8ZCJA6mbh1grJ1+JRHckdHzORL0ZH1Pyc2OQ8xWiCo7mC1+/BS6bXvEs+fIZrK1jPt6fUPGk+dRrQKqk6clZriQPrfXYz7dbww94BdNf/GzGDIAkXDpIrUBEGGavrPy4xFu1KR6VbfuQ1t+J11bp2gPTre78aRGdoNYwzUhq32W090Akz881RzSaSU372IgJOx5PLFVcOo9UeDrO22z3ca/v7sY4dEavc9O+QhaLIa/3wzbqe9vsgWKpMNHXcuG41ajOE815y4IyXDk3nmGHFYzBfNM0Qtpj5zobDaxvmrkp9KVeQZohtVyzNUbYfN4U09Eo9FRA2HV6Xf5N2hO62J+9m/HxSZkkvF1u9x2qnvrNVFzxaa9ZZfBe3a1MuxLKlvofXzxVMivfUaPnFUdTY6FSlIoRNJzpO83b8LbX0QpDD4MS7v5s7JhqIht7LBvN8F3XR5Zy7fQy2WuHctEcyoOAfEH54pMu01mTEj4K6fbftvUmmwt+DPge0B8dOVavHzEUE8mbjvWCYCAADwMYEAqXNhpqZyFH4RSvX3WLCo/mftwRTsiivZZFZActo5N+njl3jnj54gWnK2M51Fu1o1neLAqRjPOZWSdGSWibCJVl0ajYdJ4zbFsZGi/nne5JXX5+ePEI0j7aUbnBv1M+xnP5O4cM6Mi2u6w8y1UyeIQzp59VITyee62k4TZGIu3a6/zJ169Hei5yFt3valhm0+Bltzxjw7wTtKZniyL14gdsS2lZ3fVCba2xN3rp0+L354edEXL+G3TWWo3h/zdRvsG49O0Zz54xzioPPORt+vf1Td0FhaR1NlUyvBjryWXvR8/NJGlfG72joI4kfevdTnSCGKnkhCzZzkci7W8u9C2x4EabQNjaV9T/qZCxI2VWzF/zLUuXZO8GdKe/HSyY1PFqrzz8vU23mTnp0/RBx4xvL10xptAcNxBnEqPI+Nb4PjCAAAoPOAAKlzYfy0fyPR1uGEznbZdq8FwRKBZr/vxsWdkxmy2vcV0eeJpjKaPNVevKtVQ4pDsnktgqxtv/Pys4zLuxvCpJyD3w60XJ8o1wZ3tR4vuDR+f+3ERScyZI1lKk24RlyXpTvbS8uoaBsIQrm0jCZTSPeuXSRu7eztpXUqMxCuJTVHOB4j49rfRGSoPsfNArUDsr2zMMMTJZbhybhwimhjNfpEFNZ16jxBjJEYHiva9az0/BniQ5c/Q8U8Mdts2BDRH69w/PHs3/8n8fimW0hBBuPHSG/bWo8WxHe8nBwZ9eZ5bFZpTkLkpfP+BwUxJcrMlXYOGFibSfkCmJgKPnEeEsmRVuUmiuRgG34Scus/IwVPJDlP8nb/LihwENpGBZv1PONa5KVjOw/eFTySk9PSYUgZqTeJW/2ZU42lLmBiPga16yaxbscRl0vUp9lJy+drGwg+jox0+QZDAgAA+EBAFbtORtlk8bmT6Rb4YIMMXyeX7nINQ5p2vPCAHdFwfHZ7xyKP4Fx29NKRU0plvpZ19vg14o71KHNOaalYVKM8bLwZSk3Dmtdno4pnzmuiQJOaidvOy27e9w4uXbgpDm/LMo9846Ilzwarz9u7Png03nGFFbl2YuRautV3q9ctniY28yxCRc+zBVvr+5WmL2qhCiZT0MSNWdJPa0nzy1c/Zwqa5WPMTVC7UHGcO2/5pWM8FB0eXeU8VbjLKWcO4u9Lnjd/qgpqLes53zFO7GOKV2xn/X02Ab+1mvk/uTNUlc9ZxdKiFB5ey04US+HCFSaGujKe0RIWS2SJpYV4zLjjO3YejH1cypHSppf69iYMuUuRs66uW7BFShsXL2WmT6xF0RNJzpO83b8LChyElqtmZ4Tu2+R3PjW3VMon0eI5WOu/jINNFO502kabxGIKDnzp3sl99yIAAACfCgiQOh+q7YHI9dlEmylji/P3erflLWRHptGNJ++Ou24wZdymtCZeW1cMAKGE9SPN1sta3b2Dp3LmrWou2lEbtvjUA7dLS4YTo54ytqw85hwxr9m6t/rfXc0wr4+sWImHVkw+tEJz8m+n98+r7xtT8rwNhj6zWIr1fXnOzEDtTNnKfgb52AkeirkQXTFVUCwh4QJRXK6tOr/hpRr2/XIfpV6IZi2YQ4wxK426QHzok2dMkzs+YswOT5v+r+gjCWvxeZAMl0SELBSt84xUFC/lTJb/bw8v56DLuE31Pe6UaXR1uqGlOaOfCTVx7cGUNngLFaOpbrOknCnaRnVxiqInEpLvJEft/l0gt/ff+LJLK8Z5BNfH0WR1upqGqa2pwZfarIO/y5x1Wh4t/jK23SaVFLdmBwAAAHyoIEDqlPS/CzueMRwvncQ+P/cb01uXFZgKSdlg8dGd14atSsBeu3TrtHs7x0v0CKorBtAsZuiF7FU/y3PtljrZN2xJ6kRfrA15Lzjy+TwPOa5aE5HV3NKM8/u37DiWyMLSAsWXfrEdmnq8LqjrTlUhUgONm+PiPm+qcd6NioUH+EVgR9+0X62bWkkP4lYZfY7anfWM7+gn9rFQ3PmrvGnOZFSdGH0Wv6YtnJCqDag7TB32y/176P75qOI5eLwqnPNKwQxVVxpd/OQRTsbZnU5Xb7cq4XXBAJ0qeDPeNW9nQXTEmBEQ5GMrOpPstedNBUjyo9su3d103QpFTySBZk9yORdrk+9Cu3h+cJYgFKFZrz98YLaVyAnz/GBI6wKkTrBJNBqZyDcZLIv8a14Tf9XI7/3AAwAAaE8wBqmTotr5XhSW1M7Y5LjkmkKjkTRn7t5EvJZzxmu7ZL2m1NOCaUDIbkcepKVJ/UnaLSgk8PzQcblL9JoME4xdQhlPFeiOr6Ju4rbpXFpO0pEZgtYH+/z6Q9nCvWAIokJmJcKa47J/aE21+NU1hM3JN1Wo6ZUIrhVoGwwS7kaLB07IoW5CpGvhRC27uLPH8PiobkKqtkCfMZcYynPveDie+RDOedU5yjMQcnJkZGSyswRpA7KBARGDVUQfO0sMqbfzvfrHZNHoCEuLlTRf5L2NKHoiiWjqJJdzsTb5LrSHtDP+RG09xpJzIZ7eDYLMAAAQAElEQVRW4uE0i9nKeZb6GQi7uRaXyEigPc/Jad9NojMEKXQmu1q9qSNPbfNyLgAAADoSBEidl6HnuVPTievHnAvffiMxdWYzGPN2LRNMEnPkhx1pIk9UJ54/RXTAJ8+YOVnWv/fabm6Cmly8Y+fi5H3LmrrNNlB87iaytv0fl4WX8J9nZAjKu2mbDxeUnDp1PqHlQ8lNhwlCAnxIlTzLW1kJgsPM42fasXSvwbxFw/DbmLPnS3nnz13A70+eO7PZronyqyvVkB0SzUQ5F0LxcIQxfWobZahaL+PuPakDQXIuCGtV2wurF9T1bTO0NJe8Sl+dntiqOXYUouiJ1IjUk1zOxdrmu9AO6tJ95sMaDdl7lprY4tFHQgamgtoMso55cVxUGmrXTWKYDSNiTt6ZC+/vVAMAANDhIEDqzGjj/wgXFLVDaVvGTFEkRlI2We07h2hQPt+7fF/9C6sijxPJCkRfNNO8iZfbzpgnuCQaeuZ8XUuOeWTVjhRZ5XHZwlY+IlsNai4NUs2rkrIjtO7C9i9NRXg1dthcL2JVvBObAmRkpcrYzaXW1KfNElSNu7d9W5z0hXlsTkNrlWzvJuiEhh03OQ64hrZgFqmMLMXKWNHtpxHHPzH6WvQ1vLicgp3f5Hhf66kz8BVmno0OvxCMBxnDFn/bwnmH20P0mpWN86LZ/kv2EvGQypwZ48VTMW9fSWYRsgN+P4/eGwVPJDlP8vf6XWgeXVPw5c1JV/DqALtM4i8D+9qefdmolbSnzSKuI0g/5uzoLZtT22aT6AxBj9GHGZILWMxdLJwabsvBXOkv5pS1vI45AACAzgkCpM5N2WDxuZPC+TfStkz5KU6BNpDFz3ucieZV5u/fHxNcha+bCQdpu01tskibspXbIkGT4dKZ8Lo++/+m7nUeqDnsmxX+lzKes4UNuwo2M+3MJsdR38cQv5r9vLjZTlzPj08ZNntHXI5o05CT8vseooQ0GmpuXtcyNvxug2BGy4wt46ZsjMsWuehexcmJ3uhkZrLubnPvpuL482riOjQndLbNohMZpSLXkCtKE44sGWPgHCzS9lax2yrsYYgFpWNWRWey66tgVZVmBK8atyJGZO1a2oKcTPap4wmCGs1i4ZZsmjPmEe3ta4f34V3K1L9zU6jzmzzvK2zb5exZcwLfv7bNULUelhedvCq6vo42rzTB/xvBLMlYgL7bu+5waAv7WbH81zbE59XsVHzh59T3OPRDsRNJzpP8/X4Xmt9HLeEUtOePnhBW7Ws67jIQ1pe75rMy+Fn9R/k8+qevvg1Fre93Rp/xoxvxERPH/Ez9XleVJh6cMWpBuIqUE6Alm6Qh/Drlnjl+S3CO8ThlgtcaePoIrlxkbLJ12iT2SfE4mZfwWbl9WjETLgBAFJ+VGRN+MjDoZGBYcpEiryvMSE5KSc4uQ50JJzulE24VkNOnW6QhJjvt4tN7dwvzXrDxc7cPTW14X70p/YfZGZqhTkWkqB0+OVJ/uQp/E2j267dah69KwP5t37gy2PGcGzp7TBgfTZUxr0gDk6kzGb77mAglnIlmzRJUQiMUJwZvwX6kvUZ95qlz3zFQ8/4tjdv7bdxefNyFOlUZa+7U1W5WHrZxr8h7USdvC1ua7YiHEKkBs8cECJdHZaUsYctHjndTNlh22jd93JJojrCSMqKq4yMTKkpZwqafxPGkTTt0nek8Du+a+OzMAtszWHqHrkmt38hpE0V3edrMyasSsKP6/ISryQkVdVpVKX1j4vXF/ZrbKixVNWUyunQJZeZgF60Z305VrKq4XO+Ld+Tbu/4eh8NuqwLiVlsfpK1HKqqtr9AwdfdxtGnumQWjz+BV6XpUsRriDe15Ib4Nk3Iq2/643uQ8UdMRi8/34hXJEKcYr91MnX5yI5q9IhS9JwqeSHKe5O/1u9AsPKg+gSfxEtda9ltLVSdzSu1PFfmOl7V8vxkbpu/7NpSNOJdWWOmtwA/Iv6xiPMYwWR/gEOKxo5X9VLvabjwyJ8H1BBMvg75qTOQq/JjzhLtssv768qfjFoS2fpPw9OCKRPzrdGzGwGNkdWpNaW/vpJue+AUG6uStIUtypvhmoOp7B78dd5D4a4A9LjgJcW1x4AEAqDB+997ITK7wt38Hu1hqCe/zC7OuJ6W8xL/Hqj0HDrYx16OSxF766l5UYEwZMp1paaiG2gy3OC2dWSnliV6GFno9m305yo0LC0xHLdsqLLh6+lrK46rapqZ9KbJfx2U+SC+uanYxhErzknOxN+jZf6SexIUmkaON/ctEN7IYPtRQjSRtHWJL0vpYjBxt3PfjCSs+xQDpUXGBT2xoUkGW6IMFb0qxn9D0OyN1jHwmTB+kqYM6j4aidgoW/tacuXv9YUt8gpfEFd4XBlseF/RIkWssivHMecb7NmGNifsHj2XOwa6dM77x3f1yy58nE5mN+/GTTaat+3XbnGFUeU4ourntQHL2Y3wtWHOwPj9Dn7z+yM7vzMX/jFCH/nz1nukmz18OppRKLm/13bbffx4vxxsizalHUhjH1q38JZTonsSpb9EilYFTN/y6dZ5EPEM2WHbxsXXAygXbLuElxRCvfjoglYEzp5mKLTptz7n0nG8E3W+qSrG/E9pyfqvqJ0RqUec3ud6XPmPu+PX38DmvyDPsLVHrqVDV26oMgIadb/wRFdfvzmRXs1l1SUrs8B44vNW+n9h1fkPPcxfRkgVb4vD0jHAKJvXx6wP9PIfdXYreK/lPJDlP8vf/XWiGwerTO9NdVl0rFewftmFNf+C08X/cOEL+esFpkQOibOB26K/dk6sOhqDWo1r9ejPReu0cj2BBDzfsLRDxFn4nf3XUTlzaNpuk4rwr5EGuq6D7Ig+fGo7R8G2imXtfThu8ZcGaQ6n4YWn4a4CU1a3n/bb7l6YLIAIA5FEWE4RHRxRdWy93Ky1U8lbYJOdmnti1O6W8YcEHKeFhOm7LvMb1Re3s3f0LYeHS6l5azpMrQGoNYXDViKadblORz+PwXYEPuc0uhsquHz0cjJeiMvIcqTdU5In0wLX7Hoj1/I5PiiNp2a75eRJDNEiqLYs/uO/kY67IQxnxN65QBzp7Lx7Z66PonfbZf//9hzoCt+pf1BGwxNGC0IPVtTVNLKOs1OXI9MWdLpXUeVSwWWXP09OeY60nqr65oRa1JUWceGwWS7ASMsPMlEFXb2YdFWxm7r0MwXtaGvamqrekAw8+l25Gai7W/iHeVE2d2rWZF3BKmY+S8RdgezpIW+byVWXPcx9mlPQ0Ga6v3dw621Iz71t8YsqwtVhUzFh+PXlVpxiAdG1p32/xS/5ThXmJah4nNzUBO8A99M2xs6CJD7XusyNrmww31u7gsmFynkhynuQd8l1oivC0R9g530++lddtElV/lLm+lFJ+rSc41ZmV2CEapq8tqNfHOz9XD+/cS55z8dmv5q3fJMFLXtNNBhsw1MiytwHhp6shnfr+ywYC8LF6eWXLljgm0nLd/KOdSOxRHLl7wyUWIqnZuLo7D6SiqhfxwWfC87BAymTpFnfTuhCgOGLHBiKDFLB4MGozDwO/P5OMuhkP0ZXoNaE9wX2cbvOvv39wtT+RQVJ8q1hRPrvDS5UZxsY64mEOddhU5yHdpL+otih8859RRESnabdisxNd1tq5SUdXn8oighsjzwPzh4pt89pwNNrBdkh/uip2hako5dqJixmvahHFdObuxYPrQ6RXkbu9L7FIvU2cnceP0MZSUJzcq+GnbxVwsCUt5u+bY4TaDkXlPUy/IsWnlUHCckfNRkcYbAFssah5azpXHqnzwKfHoY3XVqxTmCQyja6tyEq60hhmtoxWBq34XLpW9s11LxR9AVXdwNqx+dBCRU3bxLaVR6Qlmn7f7FMHiZxh5yrPIEaZTJXzE1H4s2tPcm6MnCd5h3wXmtwgOU979P42SdqpXp2aepO4Y27CaJNNErwEKbINAIA2UcF9i9980UssM5N1He86QBnnsdptoOARI4efVlP/9DmZnRGVWG46oRtqd33GLXQfijoEdaiLu4OWvEtz4kKi5JnnrTbrQlgWV8aTpgs2DSXVhwbdqHbuG1QOLz2Xx01PucMdbFMXrfFrKKbfrF46ur6fQ7ehrl79+xJxV8rN+K+NbJrs3/dB+LSKNPjEhjYbHQlgi2ELIwA+XNWJx/2I4hydrTwDAG2BE3lIUJPT/KsJdAQA+JC9KZNSD6YoPxP7jpONhg4UfZQyYogedpOXm4va1Utipj31Ph3x7yerGB+ApK4pd3SEKpKORxSh7iPtBjazIDPkr+tcZDraQup+kUiSiRPKoP744UZvOG8aHtSc4iUSHdUtOXIoMZNkyUtFCmx0Wp9QBikmO01i3FHTsIWxl0BHO/CBYh7bQjQfafO+mwodgcCHqZSZS2XoS+vkl3tmwRrBLG2T581ofdUQAEAHeZ2XnP0aPXtH/PIuLymFj92q9h1qpkXqQe2FkKyZ56g9ekh/glOQfD31fmZuMVI3NjaxHmfBkFrvlF+Wl3gr8UlB7kukaWg81NrKUlc8H1WL+Eh+1Zzsu3G3nmYyS1FvfVMLGztz2ddtaquL71+7/rAgL+8dTU/P2HLUOFO6eBWEauzdFcGNDwxPr6VYTp+kl5zU1IJ54f63ylFvW1cb5H8LyaWykihUoaKqKvJgU+mVKn4V+gh8QgHSxacKF2PFXgIBEviQFOdkVHenq1Rlh65cQJTMVnHetcYCAfBhSt8xenb0QNvF3851sDWlCwL919lRZ37fG3BPUFPdZNOGae9x1B8AoI09uxl4qv7idVHMqTD8Vt12s5mWJmWwpXF4embG9SSu8ci6Plu1RVFxeQh1s7GUMgiCmxq07kQGRxhdlBUzs67HXhm3aKWbqViXL252+C6/JGZdAFScVHQ/Ke4vM5eNCy2o9U3/N2V4rz96j+YzSLVF13cfDs6v67b2OiXvccqV6462Uv80lSb57wy/Xz9VwwNW+oOkcIkqCG/fvcL+35MuZ/KKeyvoZDaiDLSfNYTyNFn2crUFIUeTXiE1h3mTNNEVJOfKcwvwGLWv6bDuzS36ugzfbETX7IM+Ap9QgHS3MA8pqAUvAaAjpe+bOPdCw6/qMwO3T36PcwUB0PaqHsft9cYroTeiPn7nX6dmNTczNQCgM+s3ZuG3JuhZUmBiEUJadt+OxMcBqvbthT9HsZw/M33jmeTgHbsLnV0n6quy0qODI+NLEcNugbNuo1W9vLbrRFlXM2cvR1N1FfQvKz38RHjy2/Lrhw9r+vw4rn50U+GVXb5JzFplzSFOC2cOZVDQq8fXTpyIy0wL+zNad71jXeaHy8UjnhepJwOJ+I3Wx8jYeOhALZJk8oR7/+CB4PxqvJKE83T7wRqfo8rSh1cCwyKjGu9sxcPAHeH3uYiqZ+vhPt5YHXGZ908fCksuitt1rM/uRSbCEEmQtCnPCg98gwdZKvR+A/XNTCSLmwu9jv8zkucZAAAAEABJREFUJA8p6bnOsWh64E9m0LGYt6jX6BnOfbFQFDUPS7JdD/e7mIdIdFd322bbEszYRLzRLE8o9SH4hAIkwXxH7f0SADoHssms/Ue2TmZ0bLU3AFrFauOlnfSth8+n5rBEZxegGlh/s2jjjzNN2nDKEwBAh+ipZzlSD5EyAhOxX77QG2khVhGh6+CF3lz2lvDMG2e23BA+1stq0RonaaNzSlnI7sfN9U91H7nwFwrC4itu0YXIrHHC0mpl10/HMWuR5oTvN08VLtnLdNIKT673H0nMuGuZ9jONBSGQIL/0tiD+gWApvIw1FgWNW7BULB+VHn78cTVSojuvXOEgrDzejTrWfXPPMysOPpSohZAZGp7MxVI9Llu9hMEMhWGx8JeayjXh6WnXrr82EVbwqyXem8e6/0A4+3h8UhxSohg7LVoxQXzHsXyaX2RerfLQb91tmsylc1OP+qVwkbrNUtdmyo+ln9py/HENt5zLxxJxpG56ls4//m8ko7nw6NWtw7tuleMVNf5n+3Fclv10J4oF4CNk51vM3MV5U/V5Zy1APH5fYfE+BIB8yHSzmRtDZm7E7/M4pZwqcosmFQAAfJjq+8KRKHRjYzrpdX56YfmrxMNr3kqbb4c82HWKePzQdfDX428mRxZx83KKkRHeYy3/VgwTYfkWh6/El9QbMpSaFMPJuP8UGRN1DvjaFlhqi9ZngBaVU/S0kJmXdD216BW/7PrBHcjLp66qHrqfiEdBlKGODuLzMpFMp0xlPCTmGqrfmZSYVGzZbrb24qmeroOH6IenZxfdf1BuJ6jLR+nv8C1dtaeuDh2VPssvYmZcvZlVzONmXvhzO1q9ZkLDlaHMoMPhLxHF1HXuyCazR1iW6UQWF4viFjpqNledjV9ezuE0/JKXeuVEVRfPORa9SDJeUFueGXZo3w0WH1GMpy5ya65KxIfiEwqQ+tDUCt7IUwFR7CUIvBfVNTW1NbX/oY6al+tj8tnnVAri/ftRDJL8qHz2GcL+U+qipNylCwIKI1PV1aG/KACfEKxZj/eFo5h+s7ShZlpFXsgfh2Meh+8O0dr2jXgyRF/PuFHrn2qoQ0VFnNf4HOOa+Hw9Bfg4mR6Ufx+miI/WKSfGz1RX1iV9SH1NLOszQiO1jEda2E0l3vol9/rfcY4DBXmSgrwC/Ka/ceOZf7rRaOIP/JOXi+dkeqLilGTx0hMviTIIlRXYDREgCbJqgu0fQtcbYmEzpSz+wL6Tmdy86CuZtsIclzAp1H3kykWDmwqPhFkmZPqNl4Mcs+sOXbwjQHCPz3317CHeTfFBmHfxm81rJ0kJrjgZwX+cuV6K5dC6jZu/3G3Ieyi8/p58QgHS8L56igZI2EsQaGdYaISBuAh89LCTHPuvljjju3TpAmESAAA0ITPyMtasp5jPFKso3VXP1csxzycy71b49Uk/jhMd7qIkbUZRCqUr1oyv+62igrh4+Drj5KkMpCjsrZ0Hxx98yC1Mv/fWlnjrN2x81Wqa8oyFFAxq4hdEnSpAilJSs3EbnbjhSh6vLsdVeGWXICnk6cxoKinEvX9YkGWa6TFawcmJSJRehiMXblFT/fno9ZdxJ64MXzNZLG3ATQ/bdiSlGMvvaY1cusTZ+OO6gvUJBUhT+g8LTb+j6EsQaE/8ajx1hAD4lGCREnbiY9lSkjJ0cgYAAKlYec+qsZtBpo2SMz2HWPaNzGMW5eWicebNrYbLrWj8oJbFQlvpMU2vfqgp+rr66GE6qsKrKLSsFAFFz9llcC9pz6hqf9HUC3vq6VFRHkeQ42LFHMNHUmF3wretDm+0bHHMbo8Y7NbIcyHJPx1/ATf9zNLvzzRaMMv/+9XYjabdis1OMuqSKxmNs1K7HluWl53Fnzyyvp8dlr9afSyLi5QZY+evdNX78CeGlfQJ/fNsZ2g2UsdI/qmQsIWhxne7gugIfMqIk78aYiQAAGgbtf82fozzrADP8dSVzO6Fz55UhnhkxkiLlswAy+aw8Rvlulp2FFUyQryy4ucISfZe41bwxB/ooYalWDhcZU1Li6HNDQSS5h27nLglOh/wa+R7UY0ikznJItjaqmos0hIGSML8FcXSbeXCkR9PtzpRn9a/zT4Tpjsc215d2/xppazUBVsYgXZD9DOC6Ah80rCvwGef1UBfOwAAaOQLKhbLlKK8ZwXIXHysEfdJeiHCB/lITBWbm3GfazFULJdRducuXtCaomcgCIdI+jqaKK/49YPkfEcphcKbw3mQiZddoOoZ9xY8wNDGNi0b3U9J4o4Ur5PwOjUxV/zF/XT7KyUl12YlJHGHWimecUlPf4Q3mvSMjLH/0x18djhIW+r+wdX+6WIZoQCpSbaiKxt+jSvGUkwH5g9t5o25TCZe0pnSm17Xh46bfIGoBGjn9bFGR6jpuXA/PoM0dY5MX4wFP00vhi2ALYYtjEC7wcIjBMAnD74IAAAgDWWElREFrx8dGp5f3fBwbVl8YHQ6FiqoW1hLjBPnZR0PTHrVcOm1mnnhWAgeSqlNmljXT09r+Dh8oqXyqKDwPPG+d/yXKTFJrPpfi9MfvhLPvnAeh/8ZjYdbDKtRDPGNRNlXAm6JTAzDLwgn6iKIURpsbY4vm34hKF5iRDwni5j9tu63vAwmR2LbkvadIMrlmY0a0X692TLjo9LLxHe6mnnp2OlMhBffG1Pf1zErHX9EzXI4HX28PrneHXaGZlHz1vjEhsrqazdSxwjLHUF01K6qoSoDAAR8PFINJJEAAEASyXzm3NQd/umsqJ0bkxl6/XuSsNxF7pO8Yh7C5x1aOEmyj5w6XT073HvlbdMB9O6IX5SXl8fBIyuGnbtDQ01vtXHukxJ+v8J8mbR9zV1NfWN9Yvqgt8WZ6S+rscSLXd1yxYln/A+H9OoreF/hAtgdiunMlY70RhvJTT+3w+um3ghNCvq37Gl20StlE0vDjORssQ00/nq6zeOg+Iq8kz5ro4V7hCpe56czy/mmMx1shYtVZERtiTlD0dIx16A0LIDd623rvdCEhNpNeU74schwcjc9fV0tvOAFtyCzgMnF9lqZMVlkZt6iEqJ6eVn4r1KGP+HUbTf7TGpJD8bO5FPs/o4FP+fdV8Rkp118eu9uYZ5gNtg+NLXhffWm9B8G447eg1roXAdAHfzrAAESAABIogxdvG593MnAyKxiZla8cE4h5V6Go+fMmySlZlrv8Wvmlu3zu5JeN78qItNtXOfNHik+ZYuW7frN9OA/z1x/WV2cnVFXcFu5F8PCeVRD5EPr2Y1UW/6q4X3xtQ2d6Dx3skRBAsrQRUs9jwYEPijjv8yLf4k/ROptsfRHF37w6mTJHTKZ/atXb7+T4dliayb1NnK1bahF0ZXWg6RUxi3Kiy+qe4jUTc980kI3i17t2vFLy8C0e1762/K8xxn1+Sxs25ynfW038KPtSifLZx017wy36l8EPlW8f/+FDBIAAp99hsiff44AAADIwOeUc4krq6Su3SjN5FCquW+riH5iXSjdm1yWV86pm/WIQu1Gahx78Lmcirpe0EoqVGqTSYX6hUkq1K7NpR9E1ix9j2qruZyqut5uze1I2xI5LCRKN0pHT81NUemYfx8hQAIdoIoHnz4ADVTIECABAAAAkjoqQIIKswB88PiVnEo+fqmHpvr+rjEBAAAAAHyUIED66FQ8PLk1JJ5Hd135o50Wai1eWd6T3Ff4xNM0zUF6jK5wwtThleVmZbOIKblpmgMMtaikjhtF8vD0hn0pCFm4B3m876mNi67sWnehpPso9x2zBykUnLX4hXKqfHB0XcCjtzoTt6500PpUBvhUc18W5D57XYnfV+2lb6ynLvsL2/DVRrQ+A/T6Sute0lhdrw+p3VH4FSxmdr5gnao99Y311UhydpcX60wiJL3HCwAAAND+oL370Xl6Px4v21KUcJdl59SKCoy15enBB/yTRAs+KmsOcVo6v53HCHZ+/JLbpw8FJoqXwiSpTVy8bPYgKvq0lNy9XcivQaXxdx7OHjT8fbxQXo9TH5Vin1DuvbssB6cPvZiOHIrjDu/7O0+iKC1J3cLzJxdTibOSz0o+cezEA9ETOAw7gcfN+d5tSDPDcIsv7t4QU4aQmvPa1Q6i11+K4vf5Xk7nVIu/vVzrxL28tg2fkUMSqbue3dfTnc3UEAAAAPAewQW6j05/q3Fa3ag9jRysxaIjfmlefMjhqDQ518K9f3jXPiw6UlLWNLWd/e0kB0M1EqoufhC2+fBDLupc+JWFdyOPBiaWoPeBc/PPbf5YdESm6ptbu3lMnz7eQIuMbUTZVd9t/g8627FpM/zXOTcvHIhIl3hYY/hoA60e1IGOdoORQqS/sA0/ysGjR+j2oGpZ2I39BKIjTHF23qsaZU1DC2dXl4WutuPwLyz2rU/Zt/lMpljNyPL4vbvxakvkbnoDR7p+6+w8Uk+TOIGvB+4KTG3yBK5ICoktk/5UUQ4WHZF6642zc14oWCdJuM7gx0h+pK7dqNRu1Loxwfy3eVGHd2yJKEIAAADAewQZpI9OVyO3tevdJB9lxRw4HF6KLPshuTwOP56ONZXUHFascNYlTpKRtraJR9cFZ3HTwy88Huw2EHUeD0/v2peCtJwc0PvAffuOMtDJ3XPyAJqg45aFtZNr2c0D2wLTubdPRkwcMkMffXxKovcdCC1Co7wkn9Aa//2O8agFpL6wDT9KktGMLb+jT0cvc5dtCyx61fVWtBw7yTU7bMOfKa+4D8PjpqyZUJ/GqeRUUIztZnpMMaIKro+NHOngVhbvu/tkNjf5bPQ4cxc9GW+RGXolXVZ9/l5DF66fbdm77h8UbJ3f5AX7HL7+lns9Mt5xoI18qVU1h2UNiSl+YcoJ/7Dkt4gZExJj/aNdTwQAAAC8H5BBAo1x42OJCZvNnYXREYFq5ezYF3/2evxD9OmiDP9uwxrHuuhIoIvaGNexeLuuPPtxMQLg/WOYN0RHAiTDSXbEZO95ubkiD6sOXbh6hVNddCSgpGbjOhrPtHFzM2Vla/LCT6Rwkbqa9ISc7uCG6Ej49nqO44hYh5mTi1qC1Ndi4fyRRGRVlJeNAAAAgPcGAqROpraa+7acg/1UVKOOwn34AG+OKI+wMBJ/Qm3EcKLFk/00E71v/HIOm43/VPJQC9S9nMuXZ+FK4Xvxaxo/SdXSokh5jWZvXfymrOglUnjb6t6OXSl76/jclu++/K+tW1LOA/Whkm83FT7l6o9zZzl23Wg0KQ9q9pV2AmtpEMFUWbHUAKm2KDwo6RWijHMdx0Dyonb/ArWSnm5/BAAAALxv0MWu08BHTgedSGPx6zqxkKh6DvPcHQwFrRnufb+t/o+rEWXwit9nGosEtpzYP1dcKEJkI88t84d2xauDbcCHO9eNohb+KpR8bHXyMeKe6cyAxTKGjWTmEiNN9IwbtU2o/XSoqIjDK2K+RMa90XvBzY0NCgh/UiTSSCUZOe1YOU4d3fP3CLpd92szTZYAABAASURBVGBRxDb3COKe1sQdmxr66ZSmBO06+ajh5SSqmb27l6OBav3qiqNWb7hahNSmb95gX331zwMxaa/5MheWhcetwG/UtBQ5LKWpZ/1C7+W+bmhQk7qN+HHPDDPRhdhPIk6cjUjn1C9E0hrkuXT+cHl6HMn92srcq4FBMXeLRJr2JOrknza7dRUcHKHbfsuEB7yuYt7dgGUiBfTKLm3bHPyPjHp6WUHf7bpXifq6/b5ycg+JF8r+KJd9HvBzFJaCMJu/beVIyZY9+9quH84Woh7WW36friv+VFHk5tURZeInA0Kv75wMjL6RyxE54pSJnttmm4q8sqYs7e8zJ67mlIoeDK0Bru7uk/XFNqBhF+b3uxu037+hbgdJa/y8jTMGNH/atC9WMRGu6+nL0euTyyVq36lpSit9WRwRFFWKKGbTXQdWn0DyKn5Rit8wDFre6TQv/ymxVQwdBAAAALw3kEHqHCqygn12Bz5g8btQGIYmNkOM9KjKfE5e+J876oZNU4bOcTRVwtM7wRdZIi9MOR2NN19NnWfi0VFbePWCWH9Pumbjs6MrpTt+U/bqNXovuGlHN286h0VHJHX9AWOsBo0x76tORvx3cl6j5z4+veWnACw6IqnqGmAvH65PJfE5aREHlgfcq2y0NP9F1OZfo9LKKfrmwjdCxMI/n33S7DtVpqbh9S9U++nLXTiw6Mq2nw7dwaIjkha+bWOsDHS7kbCshdgcukXXt/scDsUiHLwmBL6MFrb7RY/2rd3W/MB1uV9bdG3v8h1ReHREomjhx3mAviYFO1Dsd0hBaqOG470w0b17dxsl3x4nP8KPuf6wUT2QAnoMs/gSv01LTWv0oZfdTinEbtRHmuvKs6riqPVrz17FoiOyhhl+wAeZ6WK7yRVL1lY+Oblh865oPDoi0fsOxxYz1VAlYcftSfCOzdKLcNQWRvy6ed+dd+qmdacNtvi1w9uuvJ+qITJxEiOvYBEKxcTBqvk6cty76fhlETJDr3GEXxjpH1uGKEZzZ5koUJCdkxJ+swx7e0s78xbWdqwtigpO4mCrMJ1k2/oZCwAAAAC5QQapM+DGBx69/hah3iPX/OSsJ4xzuHnB+7YnliWfDbceSqSMuo6c65SCJYuKY8PjJyyyIRbLDI2+j+VGDJ09RlOkr1tr0uYDk7BryVE+u/EiDfN2LDRvZmv4NUSDUUlaW6i3hiZCTFRd+X6qtRXHBSfhg6FGeW3wHFK/g3x28Tvi2vwwz4BhnnUX8rWcvHc4aoi+ujLx6PYbHNRFY/LKZW511/4rc89u2nGnKCU0dPSw2WJdCMsiAq+q28zfP2OQcHxRDefu0W37Urjsa2dDrTZP15a9nZX3ToTmYLfqNjYD5Zxyp+ZexAW8Aa3rtHILMbRLuG/FJQ2RW01+8L6Ix+VIddD0rV7W6oI1uwsKQpSEBl0fu3ocTeb65X5tVtCms/nYm6qPnb+xft8Rnn3KxR7VdNgR4IBQScTGbUSRhr2eQ1ATaDbWZqFn02qe3EzhDhdN+NQ8SbqHBzhmo0dI2+amPkr1sQbB/+SgR/du80aMIYu86M29FCxbhfpOHKuL5HA38mo+FrZpT9yxVmRmJF5hacMR594MPHwVuz7QTdftp+8nawu/Agtrym767Qx8xL19aK/uRu/JEqNwHlyP0LLe+Md0fUHCqAaLl3aFPkf50TGPJ7gPfI9TMPELM+4/J3bmXVFy8t30l9Woq47bUndTSnOvrHh4+u887LaX5ShjicsitVnBe+OLsThnRnOXYLhF6Q8LibcvL055EJPL4iOK8dRFC4c0+/b1/mWmpSQX4PfYhQ8TkvKKeYiq57hy0WD5VwEAAAC0HmSQOoH8K9H4mB8tV6/66AhD0ZvhbIM1B7kZ958KH6JOcHdjYE2WvJDQLPz3wsjgFC5S0pu9cGQbNiBelRCVfHtQe6GW4hSkJ2W9av1IjJcviFRHP/NBovtHommqyXElOz/6Ih606E//zk2kZ5Sq/ozZNtiruYmpjfJC/Zw2zhKJELpQh8//bjLeG41z9ZbsJBL7jv+GoNvlWHAwYsFUXSQn1ku8sY7UzIb2FX2YpKlRHz/wU6IuYZk61WFL6yMcRBSEcLfD+yzl3kthy1y93K8tiQjGk2mq5jO2iu47hoblkZDCyGajiAqHkgmfRwk38bcZNtlC4VOVZDFuDB575NwVL0JdlJiEj/4fZD1BrpRUSRGebUJaZmZi88aS+6rXvzw3IhhPo1AmLl5WHx3hsOPmRZwJNSXhcY3OhBo1J4+66AhfuK/TbGv8Q6zMSXuOWq36VXpKen65PIu+uhcVeCoM/4lISn9JYgyZtGbdonF9m3sZJyVw05lk7NB2tZjjKtGVjXv/8JnrXCyH4zzLvLkP7k16iODdT12JymZR6Cau369cOkGh1E/5/UjBGsJCbmDRkXIvhonNaL2W/yECAAAAWgQCpI7HTE5/hd0YWoyTGBmixOiHN1eqM3Pr+9SpjXO3ZSghbkp4VFHZ9dPYlV1k6upu00ad6wSEg6DIFAW604jCLjlv9tt36qj3H/Ec1Dq91NTxmyd/R+YrHG3lp97A+wEajLWRnGXSUE8X+39l9jOJTmpm1o2SG110RxH9gyqzcqT2aGM/Orva++xtLNigD1uzeYYC6QK1nkTcUnY16g67RuoS3Nt38QCP1jgr1cPAAG/TF+b+I2vtcr+2OPU2vmPUifYj2mjADGXU+GH4qh7fuysybOwuEY6qj7VpSUaly4CRFvjJmJZwRyQkzL+dgEfyo6xHyHeiUtWJhnbRjei7MgLL/IdP8ASIlvUEo8bboDvWGj+RKtOe5Es8pT1slEQkqduPCBI57DeolTixB7wPhu3bKddsQl0ZA22GmOA/hnQqhc98cGW798YNgSmvamWv/0HYhg1hyRUIdR+8YqOLRPqoONLPPx0LjwZ7yZPDUe0zVPDuQ/QYVAr3ZUaI75YffYLulyK5KTOMTYS7MFBLk4JeMTOijv3ptf5MZgUCAAAA3hvoYtfhyvMEl4cLrqzxjpV4jk9cMS8uwQKkuqEtWpMW2j7cEFsW/vtuxG+yc11LaWqoofQy9LIEi75aMscmj/1K0DLmvH6LNUtRK2g7TB+U7P+Inx+5d35834lOTk4jDGjyNYfZefl4M7hLfsj6DSESzwkOa0kJ1nITub6tZvCllCOpq4tdgX+CfQYvxBbGO+Clnd216wYeA9KGTN/oYa0uuWHCbmniBiwNWDQcuyWPmD4pJi26rDLl7A8PYobbO0yfOExLtP8YelaAd3rCOwr+kCK5A5VE6FnEKkFIA0kh72v5/+TjG9hF16CJDoSKMho2XPXezcqc2/e5owSpTd6dm/ewG7UxI3RRiwwcbal+I6EUT3yNmyiIYgUBsOqw0YPkXAdl1BTr0McJpeVP9q1cpWU+dvr/7IZrin5m3IIi/NCoGvaTmvXQ6tMbC2jRmzLstNEVfUKztzpqL2/fCC4ycF+9xfuaNr0wdYjjbJEOkJzH4X8eTGI+CNscqLp7UaPhQ7Xl6UF79qXgf3yoA529PUZKVAlHhVcCr7CQEt152Uxjea6kdTdxXmgi8vZZIX8ejXmZ4b8jaOkWObr5EXsw1MVdpKQG4ufH7dt/JfPtw937++5ebdOqPyYAAACA3CBA6nCVwvE8PC5HVjXhWrGS35pOzuMSj17nYg/Snb8Z2cbhEWoyrUhETVhLt1cTtdooFh5Lyi+k8E0nTZK/IrCsdY3yWk+7dNQ/Mp/NLrx68sDV0xT9sU5eriPUm0tEVAiKctXw2W9kJJ9qqv9FcpD6RpU5wbsOXHqOd8MbtXCZp7ma1I3XHTxojOTMvP3qG9O6U73/6BO06/ijIn7Z3YiguxFntcztPNwn1nXW4lYQe4AXm0bS/SszrSbva0vfENU2NDTasonfZcCEsdSb0Ry8l91IPL3Dv38vDcuSfTlybEsCboK27cQvE4L/Kbydypk4Hm8nP05MZiuaktKdvmNz3xP7w24W84tSr+5LvUrSHOA6u742HectcTC60zrRjKQMl+89URRTffwkK4W/6FjYs9KVtfRcHjftWsJbk3HdRZ6ryAv543DMS+zL3s3S7fuFIxudwKVJ+/bGMWuVjafOtOlWznlb/4Tge4UqOeUc/ETtQukuI9VMNXL9ybl4TXg6NyMqsdx0QvOFIhoj6dounZrrFZyHmCl3XtrYvafKmQAAAD51ECB1PBLRwqOYu2+VNYKFpCL6Gzc58Q6XCGNqWVfCH9oubuMRzJp0dfxKeekLKRmk12VEfxl1RpMjCyiGtm6GqG10oQ50XLZ/UlnunZjTEXdy2dzca2d/yn69Y4ND04MbSCSi2dZt2EofJ10Zi8jTqayURbSae6g1hBCV9/BBR0S3upU/u5vJrJNANZs636ypdZPULebvGMYvehQTeuHGXbzVHrUp8/nK7fPN8FQSCY/NapD+N97Lhkv/hEkqsi6py/ta4VHicuWKFeWmaz5IPTqhVFhWQdjfz2ysNa3lq1SbMBov1ZCbksweP5FW8yQphS9/eYZ6JPqIhZtHzCm+F/13VERqGb8Yr02Xv2SDJzHI7XPim1hR9X4qkMhHSW2oq/tQ1EKU4aam5/LSUVHeMzSuPrlU8RAfdER0q1u6eqaptJOo+PatdPwwVGde+HPFhcbPl8X4bonB7xh5Hpgvc/O6Dh6iH56ejfL+yUfIBLUIqZ+OJsorRixmIUIQIAEAAHgvYAxSh6NrEp2kuJx3lO7dqFJ/uorEsRVJAcFZXKTmsNjZVAlx08NPP2jr9ly/PkTm50VenuQzxblM/M0YBvrv+cQhqenbzNi4a+cWQXGz5zdis5p5hbrgsGLXvlWoNJrUH4kr3+/Y0oZM5TOJYs19e/cRPsC9G0QMOtKeuGNzE9GR3LqQtIY4LN28c/93xLQ55Y/CEwTboaFLhIClb7kytp+qSpa1UnlfKzxKb/Kftnq0jBg84YOEZRXYd26kt7A8gyiS+TAzLID5J+32m7qSD1+aKVYxvH5VmsOcvttwdNeMUXhWg3v7kmBokwZDDz8j2Dk5UtNuRS+ISYW0+vRBHxxl1c/r73PvnwjBo6Petpu3SI+OMKSuX1Cp3aT9CL81pK6CX+Xq8Uoht3A8I7G9ghnGlFWhkh0AAID3BQKkjmc8UA+/yU1JaH5yobLr+8PTaxHFwtl54EjXSXQ8n3Q6NF3uEKlSnvrcvYcMxdMl5fG3JKKQguQUfFi83qCBHTQYgKTrZDcKv8OvaDSNkeSFf6MBeHsa5dwghvLLgZ+Y3KhA2Zvr0fjgGaQ/cJCwifc86kwqH3UxWLjSQatNKzjTzJ3siaimkivYEY3+ROuVnRj/uEbRlcn9WuFRKrx6LR/JoULe+u7CCZHS7t0rSr2XK7VcRBPvIjWHQx4xeRT2IRSm3Cu8nYB/Uq1LSeFVB53GE13LKisFJQAGDhmEx6j/xEflN1q4Jl9+s4dhAAAQAElEQVRwIqkPHvgBTckjnN0I6Wh/WfdQ/pWQx9V46cufJmnK/vPfa4LX7m3rpf04E/kiNYdlgl9dTJt4+4qHD/A6g0i/X4s723LvX32IXzBQ0tH7EgEAAADvBwRIHY80csw4Cj4rYrBfeKZ4EoP/MuXkhYz6X4sjjwUz8ZkfPb7Gy2xp2k+3647XAQ8Iymi2yJugI19uHhM1j243EY/ZuKlnAhsKK1czL4RGvSXmnRyrht6P3OsRWeJH5PVLoqIfqatI9zhBzyjJC/9Ye9oGv+acG3IoWGIl/JLbxyPSGr1bZXzQrkSRaIqfH+obkVuD99ObPlYYEpY+ycE7GWroGrSy6BvrzqWUEr74VhURIz1UKcJL5bpjx+lju1Z+b59fQqn4B8zOigpObGoeUnlfSx7hNhn/NEuvHNoVL7Y9fNaduyJVqgUHOSfvGZIPPiES9pL0tOAnhQhRx1rqyvMq6R9lnYHjLLHIPffu2auPG6WkXt8JPXQ4MDanUua6S25fuSN+KPilLGIqXFVVYRnIAXbOeLEKzqU/D9xkiSyKz4h1CC+b3m3AzEm6qBN6ELYb+6qIf9Ccx+G7QvAsMMVijE3doXqVkYfXzOypo9+WpS8zQv64kvm6Wvzts0L+wK/mIMpgO2vFsz+11dyXWVF/7PAnLv/0sp5kCRkkAAAA7wuMQeoElIxc51mkH0x59TJp99q7vfrq9e+JT9RTkFnA5FYj05mzBYsJikoh5aEu04UloZR0XN0Gx/s95KaFnnig1+SEjHRj427oZTk39eiKl0Zm6tW5yGLzwsGyliZZuXum402T5GNb865h24OK8vLyONiFZ4rNrOmm762l8i4n1C8iopvGADMNfIQ5r+xJWiEWn5CM7J1ECjEP6G+AknLQP1HLN2SP+pL04k0fj+X4CKWB090nPjl8lVVyadeGWHrfwQZqWFDz9kXOk3wuHw1YOlfizdSGW5DuHt88/2LfwcZqqpySu5kllXx8ENTExdPrsx+sV0QEVXR1tcdV6dusNXHHJofmkww1r28EnA0+SdU31e2D93bj5qTmFPHwtEZ9MIZ6jPOYlbbpZH7lo9CffozSNTbQoRIHIb2wlIe0nMzdmli/3K/Vcpw/O+fAySxu2slt888Jtqf6RU5OLos/ymvEcGF1OyIl9ZxTGX/4hxcDBmvyc9CIHXOHNbWD+IRIZ9Me5aQ9QuhLm4nyVcmT9VEKaZuP6pkQ8U9ho5QU52rg2Qjs0dRCVf3NbrrSV156+6z/hTD1fgYDNPC/e2+fPU0rwpKBlInO9fPtakxe6Z6/Nuh2eU7g2l+CdXWH96EIzzr8TNCYvmrR8Daqht7GatiZMUdXxCpTe+uYaVDwvx7ZBcwKPGIhadl6uzd8W169Jk7g0rgN38dJX5W67WafSQpW06hm58Xt3hBH6ko3NqRjX9W3JXmZL7n4hAEkuqucRfBwZeG/rg5v9CjVzMVbcoImAAAAoB1BgNQpkAa6bF6rfeZgRHxp9StmVrwwzaNM0TKZ5UwMbq4tijoWx8QaHIaOc0UL1w10nmuagUcyp0MtjZuqpctwWeCafSCkqJpTmBWPXdM3G4WaQhm6aKnn0YDAB2X120Oi6jnMc3cwfI8XcntpaJGfFJWXpNVnPLpQ9MfjVexE+1aRRs5f+nTzviQuvzjnZjHWjO4j7A5HHjDbx1v/9KHAxDI+q/Auq1C4fDeNMTOdGkeHOo7L7Hsd+O1K4d3EuiV7Grh+v0h0ztDKytZPf0tQ7anbk1T0mpOb+ii3bj+EVexEuqJp2Sz7nR7lH3D1MZubn/4oX/BoF5K66djZNhpNv4O8r+3Sd+Jyb61LQUeic0p5DduD7fsAkTHxuv9b5Pbkz+B8PvufJzf/QWikDWoGPiHSiUf4LLTy94WT+VHWbcXECX0jzjVOSVH76VBQLhd1Uesjc1QSRb0vlVTEKc19crP+iAur2IkspTrM81eqbtCZkNSyyvycm/nCBdX1h81cOGN4J6pvJ67fUJveefEvqzlFefH1leXJ3UzHfD13ihFVJD6p5FajtscYOoR+P43Fr2ClP6ibtE1JuZfh6DnzJhm3uD8uiaKpaTrxm0k2ui2pgAcAAAC02Gf//fcf6gjcqratm/WR4FeUc1+/eMr+or82ldS1G6UVY5ulr59TzsVnjZRdnFfyBVzO66KCUoqODp1KbbNwuoqnwKfPL+dUvil8/I46sA9VtRuVJGMoC7+SIwhepCzD57IrXxdmcboa9e1BotBUxXe9OGr1hqtFSG365g1OmsTCL5/l83vq9laTXLKt4dtcXpL/EmnpaHRVpTbxbthBeMvKL0Iauj0pTRyE1r2WX8nmsl7kV/fSVe9Gkbrv+GeBD2oiqdIo7Xdomvgo2bG7fsACpC8d9ntPpDXaeKTSULiiKHLz6ogyyYQefiZwSgtKUG+Z+yi+5Gtlnb50lSbqYbQNFfLnqPWwb2tFzdvnTyppA7S6q7ThF1Y+1dy3VXyO8M8XhdqNBD24AQAAtM7/2bsfuKbq/X/gH2AThtyh6KZDmXD5m4J/kCDCP4EKCXrF1N83LTXNTO2r/dE0r9dSqWuWdguv/0mvWlhfMeEqeEXFFJAgQQkwEHbFiZsORVnAmBvzd87ZQAYDBqKb8Hrmw42zc84+G2Dntc/n8/5wbDrj/4/thx4k80KFInZPzwDypLCpq5b2HcDh9nf16ezquhYWxPhgzrbj2tsNfrHN3Wy5LXZTUKHIfqC9PzHu+Tj2ToOHkaeBbrMtdxjfiD3tuDy7oR1brcjoY6nYw3a2H9r6qR6/bp8R7WjpWUpPnaY79wx1SdGNb/z1g1qmq2Rgf73hjvRPAsd+aBudb+3b87FRvw6dg/pt7UW4vYz8Qe90LE4vO06vJ/jPFwAAwNOBj/jABCxIZ10SQjeiupR86q6RFcNLL16kK3O4/dmdmD38OgAAAJgVBCQwAUsr/OBBO1X+EnPgSg0hzuGhLVQMV1Te084QU5UmHEqgopSV+0uBJqpI3x74dQAAADArGGIHJsCysqqrqzPR9Dd4ttxO2LD5VBWr5p6CTj9OExaPb2nY25XYlQd/tefa1sorlfTXzlOnjzXPonONWFjQvw4EAAAAzAYCEpiGlZWVWt3uBVChO6pT0V1DVmzHF6atmP0Cr8U0wWZbE1WlvJIuwTfwpenz5/g9rQW7HoMV0hEAAICZQRU7MBkVlZDqNASgLaoaFdvIioJKhYrFYT8jocPKypLNwqdUAAAAhpmqih3GvoPJUJeGVph9AUZgG19v3RrpCAAAAB4L/vcMpkRdIFpY1GE+EnQrFhb0yDpMPQIAADBPCEhgYizmSpEebFeneUgeIilBV2VB1/O2sLSyRDQCAAAwZwhIYBboS0ZcNQIAAACAqWEGCAAAAAAAgI7JApKFBRaPBwAAAAAAA0wYFkwWkCwRkAAAAAAAwBDL7hiQLBGQAAAAAADAABOGBdMFJCyAAwAAAAAAhpgwLJhyiJ2lJTISAAAAAADooWJCdxxiR+iF5DHKDgAAAAAA9Jg2JpgyILGol45SDQAAAAAAUI8KCKZdVN3Eg9zYLKwNCgAAAAAAOiYPCCYOSFZWlixkJAAAAAAAIISKBlamruVm+jIJVEZEtQYAAAAAgG6OCgXmML7MLJJJDzYmIwEAAAAAdF9UHKBCATEDFg8fPiRmgGrGA1WdRqMhAAAAAADQnVB9R+bTZWIuAUlLpa5Tq+sIAAAAAAB0DyyWlVlVbjOvgESpq9NQMcncWgUAAAAAAJ2L6jJim0FVhibMLiBpqesoDzHiDgAAAACg67G0tLSyMvF6Ry0x04CkpXn4UEPPS3pI3UGfEgAAAADAs4vqL7Kk/lhaWFpRf5lvhTazDkgAAAAAAABPExYgAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0EFAAgAAAAAA0GERM6Z5+FBTp9FoHlJ3KAQAAAAAAJ5NFhYWltQfSwtLK+ovC2KuLMwzeKjrKA+pbEQAAAAAAKBrsbS0tLKyYFlZEfNjdgGprk6jUtehvwgAAAAAoGuj+pTYVEiyMq9ZP+YVkKhopFbXEQAAAAAA6B5YLCsqJhGzYS4BiWrGA1UdxtQBAAAAAHQ3lpaWPdhWFuYxMcksAhLVBuUDNYbVAQAAAAB0T1Q6su7BMoeMZBYD/qi+I6QjAAAAAIBuSzugjJgB0wcklRoj6wAAAAAAujsqFKjMoB6BiQNSXZ0GVRkAAAAAAICiplf7MXHfiYkDkjlkRAAAAAAAMBMmDwimDEhUPsTUIwAAAAAAaEAFBComENMxZUCi8hEBAAAAAABoxLQxwWQBSfPwIWozAAAAAABAE1RM0JhuoJnpApKpZ18BAAAAAIB5MmFYYBEToVIhAQAAAAAAaMaEYcF0AQnlGQAAAAAAwBAThgWTBSTUrwMAAAAAAIMedsM5SAAAAAAAAOYGAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAQkAAAAAAEAHAakbqa2orCUAAAAAANAiBKRuovynN4e4eA9xGfbhmWoCAAAAAAAGISB1D9KkfScq6Tvlh5IyCQAAAAAAGISA1D0IQiKGMXe4M8MDmj2qLM8/fvRiOYEOqy3PT4rPlhEAAAAAeLZZPHz4kJiCovYBgadKKS+v7dHb3oalt1W8f0rA6mxC3D9JP7vIhUD73dgXGfjXLEK81mamvC0kAAAAANAJODY9iCmwCHQX1lyetYHNNXICj0eJtxAAAACgq8AQOwAAAAAAAB30IJlYrbxcrqRue3CbDX5jBsXJawmxseVxezY7sKJcXkeIFZfvYK13Hp69DX1o5dWLF0rucd2Cgzx6Gti/4eSy+7oTVt4rl9lp79afRK8t2hMy93u7jfJz5xrqjjJMrZTf03shtdL89OwbxMkvaBivyRNpH6JfCrEWjgzyFhh4mqavRa2UFaRf1B5k6+QX4M3v2UaLaiuKqVej6/ixdfL2cxcafD2tt1xZKZM/oN7CSrV250pZebnu5Vhz+e14gwAAAADAXGAOkonJvp0ybG02dUE9L170d3/9xwq/CAiJFlNX528mXIsaqfeQOuUd4ZyfCOEv/U/uam9qw5llA1+Po26nfifZ+vyJD0e/eUhbMMBjbca5xU6E3NgZEri+sPE8mZR3HOkzGEKfZNyj56o8E/U/C/bk66+hxBu3Nmb74pFcYoRru8YGRV3VNmZ+7c5pwetzDDxRbeH+d15bkyTVP9Zt5rc/fhkuaLxJ77X0PRk9SQAAEABJREFUyvnitWnRF5WNd7D2fmvPkbUhXEPxX5616/3FUU2fhXqTh8zcdqDJE7XV8uSlgjeOEoOmH5BGhxAAAAAA6ChTzUHCEDsT44eEe9C3ysQz+U0eEp89IWbu1P672WM5Z5LoG+uIcd5NHlGWRE+uT0edQF28c/KQ17XpiGXvERQyyk3b51N+JmrK6A9S2jn7Rpb0/sv1GUOPPHnpsBBdOrLheY8L9eZrs1fJoTcDpuwsaeF0yUufn0SnIxsejy/g6Q4hyvw9c5431Lare6Z4RtanI2vmEIGuC6u24NCbI19u6YlaaTkAAAAAdCUISKbmEhTOo29lp9LFeg+Up6UU1989mlio95g4+wLTnxM+zrfJ6SqPbPziKnfi309cuiYpu1aYsSeSTwwL2SYpk0rKMte6M1+6f5JOf8n8aejVqTzzQeT6XPqe3/sJRf8tOHf4wOHzl65dy9gy0Z5u8w9LP88i7XBx5/p4pfebB84Vl0nFoqKUlT7a7SW7pr1xlM4zvIlb0kXXcv/z3b/+k1tYVhS/jM5/6uz1qw1FvmvRr1FH+S47ll92LfdSbvYl5pC1o5iYJI97a3WyXr8SlcEmf5JN3+MGfRJfIL3GHJJ96Zq44NjaIOag/PWTlp6RG93y0K3M25XxiRezD9WjJal/D9F9BAAAAPBsQkAyOe+IV5mEVJiS1nglouq0pHTqZqQfPe7uRtLZG40eq89O06eOazqKLCXpRNCWs3vmMXN7bLhOHoLHmAmT9cWSOHp5WeHS/xz7cOSjEWvWTrOit75Cn7hy366jtUaf7+qJE/ffTDgVFUJPi2JZc72cmPRWHrs6iukiC9mWumeWy6MGc/1XfqvNb+nR+wqbnU5ZKfdaeS5+pZ8DaXTI24cPzGXSjvKn6B8exSp19ufLmAxGQrZc+HGRv/2jY1j2fot/PLaW6YuTH/3rrmKjWw4AAAAAXQ0Ckul5jwtnRnmlJ6U/6vGoPZV0hrrxfWVVGJ0QrqakPbrW12UnMi4kqPnZ+EvXzhKQTnHmu/1Mopi4alnTgXykZ8grU5k7Jy6kE+OFbPxoZNNt137axZxC+P7aV5pNaRJOepV57hunU280O5v1vKhlHs0nGvm/95G2Yy0n6XRD5kz51z7mxXis/WyWA2nO462185hoJv7uaL6RLQcAAACALgcByQz4hs9kLs3PpDzKGukpJ6i/PSJCRr04ke6sSD+RVl3/WOYFOjuRoPCg5r1DBmYldVT2mWPMbWh4uKGicO7u2rF5F4uvEWMFTRzV7FSyCylX6VveK6HuBg5xcmfmaJH8vOYdO+GjAoghvKAwXdvy69t2MTVJ2+qZLzsZPIawgkZNZO6UZ/9WToxpOQAAAAB0PSjzbQZYQeMmk31xhJy7mE9CmHyjDSdO4cFOxGtchHX0PmXKmXTySij9WH7mafomKHI8r/m5hEIe6RzVYrG2Qyt5qYvjUtIpBP2aj0yTiZl8RMq/njjwa9Iebu5uLfz8Cp2oFFRMD8LTFTFXirVFwIm3u0uL5/P2cSfx1FEyeRUVskibLQcAAACArgc9SGYhKISZ019+Ik3b45F7JpG6nudNjaBn/4+k4hMlKZUpMEBupJ2iOzg8QkYZumRvLQC0j0x2g3Qyj+cM9BHdlpaTjmFZ2xi7q0wmJkYrbt4nZrDlAAAAAND1oAfJLNhMmDqOpJwhxWculC9y4YkvnJARwn81XDtajo5PcSl0se+okd7laWfocgVM59ITZcelAhjduTNpa+5no1rerwe3N3kc9vbWVA8PIe7vHf+/ea28JmujllzSkkm14c7avpd2gw23j/FHu3dayAQAAACAZw0CknnoOSo8iJxJJ2mn0mpf80s6XNx4NpFN0MRRJCWN7l9a6V14IY00dC49Sbx+Qu2de7WEx3tyA8z4QqpzJp8QcaWax2/X+MDCEuptEhp6pH7Ckp+3Lurw+jnVP1JCxrkZPl/9UU58DKcDAAAA6K4wxM5M8Ma/zBRJS05JlzJ9RNavhjesccQbNY6OQ3T/0sULdLEBm790WimGlvmM1BbJS/8hUUqeHOGwkcxIOeWho+2ph0dLu1hoaHP10SPxzB2vkFH1iStojLYCQ/Gho8WGT6ZOTzuh3RX1GAAAAAC6LwQkc8EPCWfKtaWdiT5B9xFNHjfqUfeeU/gMeg5M2qmvf/q3kgpPMyd3WslpvkDbt1Kc1zRs8F55TRsqsj/fmGJw9VR6JaJq8rj831jENKF2f9TOEsO7yCsqDW2+8fX7u66qm2ysPLP6b9qKdX6vvdLQv2Qz6Q1dFe9/LDX4LFd3/G0fU8ch/LVX2tmBxOdrn6YwP19NAAAAAOCZhoBkNlyCwunujvJDP9AdKeH6axwJtcW+z/1wiK5oED7Ol3QWG0cnbamDn/bu15Wtq6jUxiGbSStXMQP55HFzRi/cn1/+aJkmUl2e9u3Sse6RsTLy2NwXr5vKtCF/fciU9SnFtY9ihlJeeGJ95AjPddmGD82Nmvz6rrSGhlUXJ33w8uvM4rbEadnGuY1G7LGCPto1lat7luDlxxs9C31U4NiNTM9S6NZ/RLZ3aV1roZP2kKP79t/QLpvbQqIDAACALkElK0yOPxBz8EDMkUwJgS6m+85BSr6ae+z37F/LRDcrK6gvB9g7PD/QdfJzI0M9hhHT8I54lff11vJaJXW5HxIxQf8yfZi22LeSvv6eGBLUid83ugNn/9c3CElfE+CyhsuzlpeHfyfZOo56iOX+3vdb84KXJsmJ7PiaCcfXEC6P35NORzJdj1Ln1HbjTvz08NLiyVvziTp75+vBO4k1X0BnGbm0XJs3DM808lr57YykN6OiZgyLItY8vnVDq6gzBm35fqW3/rvEDd16bL147CfZRF0cuzA4lkqAPB5XXi5ryH2+a8/FTG1HLYh6fq+9Lfw2Wkx18a0NdFlvz7eqlE0+II0OIQAAANBeqgrRxV8zC2TMJ5m2fYYMH+3nymUb3FNWePZClvgP+r79AP/RY7z6t3CFJL+eefZiUXkNdZfF8wl+ebjA8Meh6jt559MybzIXFH9yGTPmBQ8HA89clrrl6+OFCt1XD4ZPC3A0ecsfk0KamyeuaW2Pvh7+ro1KXqnKis5mZN3SfiBMvYTAMV4Du06s6I4B6Tfp9XWn4zKuFzXeeP1eOfUnLu+XwEGe68ZPHyoYRJ4673HhNlv305EgdGqztVlH6tZKImTc5HCjy1sbw33V91/mTfvwDFNtW073xjQ6vWDqt1nCfX9b8de4Yu3DDSHEZsjUjz/7dF7nFHyz91v9n9zhUW9+tOsi3QylrKH2N4s3at7ft/zVYNiw9l784zGy9M2oFJnyUc7hT1z77Zdv+zkYOMDjrYSiYftXr9nwUwG9d215fQCz9n7lb59tnDuS27FfCK+VB7/Mn/FhCt2dpq6k/11E9RMAAID2U1yN37w9Q6xqtOlSVvyP/IglSyI9OHp75h3Z+G2W9NGe+ak/nxG+NH/FDFeO/jmlp7dvTrgu1zza8+zpY8ELV8zy0d+xuij2ywNnyx+NY0m9lHHYedLq5aMFeiOuKpIP0umI4xyyZHaQI7l9n23qlneCP3KOHolvdeGVgHn1AUlTkboz+kCBotGD1Es4yR0SuXpRYN8uMTrN4uHDh8QUFLUPiClQHUdvxu1Ua+pa2YdlafXt9EWm60oyCaW8XPxbZglx8xvqwuM2/3BCWSm7ln+xRE6PKBvmI3TgcZ9MJYPaihsll/PpzzB6u/l58Lk8+2Zp8MbOkMD1hVQsWZuZ8raQaZu4MDv/htLayft5NyejGlZdKS6hD6Gf5Tkh36EzPo3RvUXELcBbaKDZAAAA0Lr8mKUHM63sfILCIkYP5tmQB7K8pNjjqVRosXScte7d4IYejIJDy7ZfVhCWYMSUBdMH9yI1knNxe07TWcJ16qqPxj/6lFRxce+qfUUKS47X+Jlzxw7oUXsz9eCh+FJF0xNqJImffRN/i7B53nPnT32OS+4XHN3xQ/4dDeH4z4+e6/mojbdORkWliInjjA3vhvYxg5Z3jqq8I0cv3TP0SLXkl6sVKmvPxZ/N92Vy2Z3jW1afkLH7e0dGjnvBiUt9fF5yKv778/RLaPpePTaOTQ9iCt0rIFF9RxH7Pm89HWlRGSlx3kcm6UeCtjQLSAAAANAVXI6JKg3+INK18WedGkn8hm8Sywl3zJIt/6O9MLsev2Z74n0iGP/uhqmODTsqMvau+q5IYT18+eaZXtp+DM31w2u3J9/Xzx71J+T4zY+ep7uaV5zfvexHEeEMX/5F/bENJ2yShUTxy7/KkBPPxdvm+5pBy58wRc7OT3fkqRs3Q5qw/XDvV5eN0RurU/9euc7ZvHB05/VvmSogda8iDetOxxmTjijUbtTOBAAAAACekuEL1uhnDIqlY8AI+lpcfkuiG5UmKcy5T924TnjZsfGOnMBxIb0IUV5Oy6nfVHAhldrTenhkiEPjE0aEuBJ6qFtOfQXfitR0EX3GcWFelnonHE1PTZbkXKp6tPVehdyMWv6EiU4ezlOTXoGzGjVDMHlJk3RE6JfgO5S+vX2rS5Ss6EZTJZKv5jaZd9Q6amfqkG420A4AAADAdFr56L5WrSCEnu8juUkv0Mgb5Na0p2KQlwcrMUv9u+g68aN7bApz8umJMl4+XvqnZQ99zvVHkUgpLiwjXgMJuV+QU0Zt5vuOaHLdP8jHi5WcpRZdvULG+5O7osyrd8k1prIC+UOUkUXHHtuBvsMc2aZqeSPaqgmi/0pK1L2H9eP3D3gx2IffuEKE6q7ol5QL+f+VSAnPy8t7VLC/sI3KVIrU4xl3CPEJCxM2bkZr3Su1qlrSBXSjgHTs9+wOHIKABAAAAGBClUyfDac/X+96XqNqvqd9L2qXCvm9e1TkIKRKeouuuCB0bLbAYS++0JqIlBV3bhFCxYybZXS3hyVf0L/pjo4DqGMlRHaPCjaCa+divmv4qF2S/N0R+pYXsmGYo4CYqOVa1aLE7Qfp6Uk6FakSEblU0ffRIECF6PD2LT/L6p+4QiouOns6KWDWigWBdqQlopNJV6lnDIwcZcSYubsVd+gbvmAA6QK6UUD6tUzUziM6cggAAAAAdJrqjOQcuj6sn2/9rJveDnRlgLuSEgUR6NeHKyml124h5bepi/W+RF7JLGcv6N98Bfje9tQpyon0loy6pidyBZ0t+vD7NtuP2+tP9M1dGXVCgcvYBa97k2sZMelUnnIMfT2QnghtO7CvCVtOmPISX+2Op/IShx88KTJ0eL8ehC4RkXxE0tB9JE3Y/vnPMsJ2GD1j9gx/R46movA/P2xPvp4Zu0s4aHmoo8HWt9B91ALxaWaQ4kCfkb1IF9CN5iBp1zt60ocAAAAAQOeoFh3+Kj5PQ3WmvBzpU7/R5blhdPVZ0eH9lxuXmlbkxdM9HpQ6wnSVyO7cbeP0KmZmulRW3sZ+GhV9wj6uAYH+AR5MZCJ/cjNRexkAABAASURBVKXuU3+04+tM1HKK+Mi3TDryXLx++ayXXPv2suP2suvrEThr9TTd095N3X+aSlMOEStWzQly5FDNtXbwmrJkxRg7opEdP9nC9JNSpvvIenioEd1Hd87v3ny+impE8F9COrCepBnCci3wzHFalFK2iAAAAEBXprqVEfNVfA7Vl9Jr+PL/Hf3oytvSc0aka+qPIkXeob9tFIW95GRPSKUo42SmRMVhEYWa9Ob2Jab09FquKfo5gy4g4TN1pm8Ly5yIU34WUTnNKzhCf86S0M+Hez5DTtd78PRqdlTh2V/pvqzAF71a70zRVBUe2RVND97jeE1dOGsI6Rq6UUAaYO9w/V5bnxA0O4TAU6Guq9PUaR4SU5Wd76YsLAj1n6WVJcvKigAAAJgLtfjE7m+SmKV1nMNWvBci1O+m4YxZuOEBs4hqWdbh77K0G7nDpi3hnd1yuoJYc9jEVJ5uy6/9nksvfe85KrClfp4q0X/pBCXgKHMysvQeuc+Mk1IqapofpMhiBgc6Boe0uuCNPD/2q0P00rqWdsHz3581wo50Fd0oID0/0LW9AYk6hMATRkUjCnKRSVBvO/WfhvkeWFlZISYBAIDpaSRnv94dK1IQS47vjCULXuIbzAyC8Uu2jJYUnsvKEv9B7Af4B47xGsgS/3iSfqifduoOv28fQlodqybg85m/eYS0OquiD19AzLHluprjVPNa7OepqWEG80kvHY+5RIwk/zmDHhzo4d/KcrSKvCMbv82SqgjbMXDZ0kivrjG0rl43CkiTnxsZl/dLew8h8CSp1HTXEQFTo5IS9a2g+u/YLAy7BQAA09FIEj/7hp5U09NzzofzR/Na3dna0Ss0stHwsCpRKd1bInTWlh3g2vekY8ajegaPyKR0/LDrq93M5VD9LwptJQb9/e7cukff9OnT9sg3k7RcS6VWkTYIA6eFGv7Yv49b0y2y1Ey6qp+P3/CWurMUF/eu2lekICzhS/NXzHDtvIVhzUU3uhgK9RgWOMjT+KWQqJ1R4/uJQjoyN8y3Q42MBAAAJqLI2U0XZGM7hny0MkzY3nFyd7MyxYRYuvrokoedq7MdEVeJ6SLe+jFDclNM/R/PcoCrC/Pln53dyOU8jUQsIT76Jd3EZVREIQJn17baYqKWa8viyWXXFURoOKb8idubrnqn6jkwINCRGENyKZMeceU6wreF4FN2cvP+IoUlp40q4c+yblTFjrJu/HSWpVGDiKjdqJ0JPDHMqC6kI7NDfVOobw0BAAB4+kpPHs5TEGvPBR+0P2PQY77Oiwjh+I0NqL+wFw5mVmQtyMpU6O0qTs+iF2z18PbRXghzPJlFVyvS0q/rnzIrrYC6sfMdxifm2fL6snjpP7c0RJDj5kzPqJdezBITo0h/vUw/hfC5YYbzkSLzaAoV0gTjl3TVdES6W0AaKhj07fRFbWYkagdqN2pnAk9MHa7CzRW+NQAAYBLS3CJ6sVEPX9+2xmyp5FX6g8rU4oTtO3IVVNR5Y7rno80+48J4hGhE3zcuq112cj9dk9ouNNy/Pss4BE/w5NDlquMSyxr2U+TsT2Km4owPcyZm2nJLzwlj6fwjStp3uKBK74luyeTMHcGoF12p6/37Gft/FOmnLfWd9JOZt5o0ULcik8DLs4VZRUV5hdTfDgHPtxUan2UWpqoapqh9QEzkN+n1dafjWhprFzjIk+o7Qjp6oqg+CrUaV+Hmi8VCwQYAAHjacnau2pHX2g4B8zYt8KPvSBM2fXzugaubs2MPQl/TXxFJlVRa4EcsfzfSWX+geNnJqE10jweb6+jj6tDzQUXu7xK5hghD3107pfGQM0XOzk07qF4gS5bAzcutJ7lfVphXrmbWF5qvV0H74t639lHXkJ6Lt833NYeWayTJG7cdlqipu+z+ri8wC9Delxbm3XJtaKH0xJao4zI6mFnzfQbzmaVctU/tELlmVYTeyLv8mKUHMzWs4CWfGa7ZLTn58WcpUtIyXsiGdWFG1bQwAsemBzGF7jjZgAo/P81ennw199jv2b+WibSrwQ6wd3h+oOvk50Zi3tFToMHgOvNGf4MQkAAAwFyxe9qwlRWignyRbgOrr9B3xvxpvs1LIwwMW7GUbI9JKZRLci5JmIPtfMLnLJ7YZEIOx3fhssV798RcqpBezdcGAHZ//8XvTvPpSTpR57fc0jF09Wrhsdj9Z0V3bolSbzWc1rmhsIRg4vLP+x/ZfDBLqpTlXZLVN8XONTA4oL/+k2rnOBGHvi3Xr+sOumMPEpic8sED1PU2ZxYWxLqHaT6zAQAAMIpKIa/WjUZh97Rrc/0glbxKwXw8y+HasS2NOC3bhtvzyXQkPKGWa9QKea2q1dM2nIpY2nC5z0A3ial6kBCQwARqlfjumzsbawQkAAAAMCUMsQOAJ0Ypr6wlxIpjb2e6tcUBAAAAngUISF1O9eUDnx5OVfJnrHg31Lh6961RVoiulNyhrq2JvWCoq7AnfmCeSZJTX69KqCCOEzatj3j8H4p2UVVLRL+VVdJ3bfu6uAr7tzmUgKhKUw9n9540zbvlVbnVCrHot5v0WW37uHm5ObCNqceprJIrjB5U0Gj8Qz0rTi8O8iUAAECXh+vdLuf3nFS5mrokTvtVFjrlMSowaqryYrftyKhoVIySJRgxZdl8/77dqzg8dJS8KDHmUHyTmqI9B81YsjDUuYV/eTRVhccObE++ruCFBLcQkFSlKdHbTxZWN9pk7RixaGGkR+ulVWWJG7fElxtdXSf30PJ9zQtdsjiOXjNmTx8t7HqLhgMAAIAOLnW7nOeCgh3tuH08I0bppSNVuSj18O7EXCPPosjZvTmaSkeWLIFPyJzXwyI8HNhELb10ZMPuywoCxlLdLT53dFtCHul+RLEb9lLpiM3h+wQyP0JDHPtS/S/V1w9v+abRKhP1VBWinw9+/EHUFiodtXLWspOfb6HTEZvnGjFl2oIZIb48FlFKEr/ZFFvQymFEcT6eTkftxuJw7bjchqmuaoUk/8CmTTEX8UsAAADQZaEHqcvp6TlrzdpZTbfKkrftpi4QA1yIUQri/5VHXQI6RCxfrqvKHxgSkr73b7FFirz4owXDDZfGh6ZuJ0Vvi5OQF5eQ7uePGqVdwKy35wbxdeEiMCSyWhT75e6z5bL4Q6mjPxzd0EEkOhy15XyViq6rw+L2JPJqdQvn1K3ezRky7dNF/lzm452Al8ZoV644+++USUNCDI/K0xQd/beIdITrGxsblrlQy/PO7NmfUqhQZMbGj/Kd6YXPlwAAALoi/B8emlOknqa7iTh+kY3XLOMGRU4aSD96NvUyAWiDY8SqtQsa0pFWT9dZk5hlwkuLSxptrrxLpyN2f+8Fa9evCGp55lH96t0hf9GlIwbHd26YD3Vblpd93/Bh4sP/d1ZBBDwH8lhYXJ+wZX9xpe8qxYUSAgAAAF0SepDMTEMN+ydXfb9NisuXrlI3rBf8PfUfcHjhecfDZRJy9fdCMtyLmICqRl6jYtva68+Vr1PVVCmYN41jb9v2LHrmJPQdWzsuu9XVUFVV8pr6tRBsrUkHm9chuqdu+opUNZXMK22rHl19yzunMR3CFww0tNlxgIAUSUm5lAoY9fUi+vqFLZ80xmsg/QMvbfvMPGHTxf04tvSNWlVraPey4zHnqwhn+KwwxZbvKsjjYbsNEhCREY0EAACAZxUCktlQyTL3H9yfK1NpdBvYXNeIebMjdFPPFTnbP91RoKau85Z/oTe2R376m+VHJcTac3HUfN+ehEhOfvxZipQ4RK5ZRRcs032pk7lvVeY+5p7PzD2LhhtuSWEJM2XG1eu5po9wXQZxiUSulIhvEa/+5Cn4dc970VmE+M8++Bo37h+7E0rpdPDikq8Xj2AeVt2+8P3emF9uq+rrjbH7uE9ZMH+KW6M59NLEVR+fkhCH6Rs+Dlef+mZbcu7d+sITbO6w8NlLJrnbNnnWuorcfx/af6q4vFGFCrbj4BmzZ0904xjVvP7aJ9W5sP29C9p71J5vjTT0QrN3vHXwAnPs3D8lRu88VVCpe8B+cMSK/53gzCaVRXFfb00rUTa80sFzP1w4ttlC1+UX927+128SZUO7HSYsem88MRsKBVNegSdoFHKEfiHGHewo4FGvUJRfQHx9Gm0uLaXHz1k7Cpv/TGok8TGpUsIJeC3Sq+4QeWyqkuv0b5Nls5AGAAAAXQWG2JmH6qLYdVtiLslUVhyhh/foEZ6uXJZKLor/pmE6OMd37iQfS7p7J/aYrNGBWd8n0dfhPpEz6XTUGe7cZM7fhy9o/tPRk9OLvqm4c5c8XYpzMdu08eORmisH1m3ckX5bZclx9hk6NmiwWx+26m5x3KYNOy4ZmEOvupm44bPE3CqOm9/QsX4Dedb0gtK5CdtW/nCl6Wk/3rA5iU5HbP7A54OGjvXpR/XiqCRXYls4s+HmdYhKnLhx86mrPd21L4faUnklce2OtPJLu1duTish/YYFDR3mTHcKqe5eifn0YIF+JWrJ8Y0f7GLSkTWXfplUy0nFqa0b9xQQMyG+mCenbgY6u5EO4IdO8eYQder+vTny+m3VosMHM+5QgT48rHmvpjThYGI54fhEvjaiM+rOVV/ez8xlEo5/2Rf/dgIAAHRR6EEyB4rUmL1n7xPSP/CjDyJddTlHIYqN/jy9IvOH+ungPQPfmJJFdRZJT8enjl84mtmtMC4ph7oa9oh8a0wL13+OYRu2hdE1jtfRNY4D5m1a4NdGa1R1zBR5S0Mjs/r3E1DXuERd85SLeImSE5TOs9a8M9GZjgYqOolQmWT3KSrKOY36ZMV0N10fkKLkhy/Xn6m4cCBuzNDZQ/SGz1UkxJzijZ7/z1eH2mu318l/3bsxOktReeaHuKAN0510Z9Cd1s551gfvTHTSvQkL6irObf8y5jfFhV1fO3+yeqKgreaxIzbtiSDkdsInG5kiDfVdXm359fgp5ykr9k7Sjk5TlSZsXnv8NslLWFWoYvu/+s/5L2gbX3Np9/vbr9RUZZ/Imj4ksP5bX3RwfcJt6tY57J3V03XdYvUtf9yhZZ2j7OT+tCrq1icokNuR4wl7xOzVU7dvTijasWYNt/8gN9btvLIqlYYlDF24fHyzKUYFhzaeriAczzdmD+9oPPpDlJHFBN+6OwVZafmSOyqWIHDOiinoPwIAAOiy8CmoGSg9mUTP+XGcsaQhHVE4rq9GjqZ6ORT5Ob/rNnHHz54lJEQjOhzHrNBSdjw2S0EsXecsCOzEZVnu3GYupntz+5KOkl/Pyyi60wkdKvXuKtznvM3EDwqbTd3eSGRqZw+ctbQhHVE4bjOmj6W+rPotu6TZSVymfPJafTqiWHGfn//2RHqImvzU+fpOpJKEWPq0nAmL3mtIR8zODmOXMDvX3Y5PudJ28zrszxErJjXM3WE7Twp9kW6wSsUevGDOCw2Ntx0xJZy5RC/+77X6nRUXkrNrqFuf6Q3pSK/lnUZsKj6PAAAHOElEQVR9Jy8rr7SqnUdRae9k1Ga6Bh31qt4Y0/Ef2J4CV0dreraeXCLKETO179jcQfw/NX3Xqy/H7LusIJyAVx+nc1WS/N2RGPpPfPwlKh1xBB6+E/x5+GAJAACgC0NAMj1xZt4d6sbDP7jJVayl0GUQdaMuLGkYU+cQPDtEaEkUWfGJkoqz36dKqevhGbNHd9LgOi3dJCjrjk7u1xTFbtge/d3e1V+lykknsR06Rn+IVGnmb/SqNj4vjO+tv6eViztdZkxVUHy7yTmGjXrBvskmK+cX/eiejJqiYu18odLLV+iM4ThqvGezNlg5vzSK7qOoyb1S2lbzOszNP0CvkVYDHfsxd7xHPq9XJaKfIxOjahr68pTZF36jb18cPcq2Wcu1L7NTyE9vW73zSPSXm2PbMWxPLT6x/aMtKWIV4ThPWrt8dIdbIz2+5aPtKYVKjmtg2IJF7258d/aMQEduXUXqd5uiEhrXlZMlf3Uok4pH/jMX+D3Ot8bOa4T3aO0fDz7XWiG9mnXgm03Lv0yVaggAAAB0Sfgk1OSqRNoP46+f/Gj16SaPqZirX+ltKiDVr/rqGLYg5PLHpyviv9hCVK0OrusoQT8HkldBbt2m0pegA8crK+9oKwTI796ner1IZ3B18dD7Wl4sYsLX1cT3VyY32VfFvJ0SGRWQ+jXa7OD+ZwNvlLMzlTOuUG/xTbqmmuK6hD6trYeLwRFUjgP6E1JB7lVQ2cy5teZ1HN/B8BvmaLgkXCPSW6X0TT/nAQYe7GHTab/p9+9pY6/izn26FHzbB6iuJ3+973AptTNL+NKcd6d5cjv8sYzk5I4TMhX1McHSZbN0xUscQz28Q186GbUpRZy8O9ZtnXaFLmnCwcO3COkfsnq2J3ksA4IXzPZt9LX80qGNey/fKT2+8SA/eu5jnhwAAADMEQKSydX3ASgVcmULu2j01s0UTIkMTt97VkFt5Ef+T2AnxyPSarcik5qosNG3lRJ2HP+3llYdzVL5hIUJSSfhNOnOUtTUMLdKRaWyhelQdcaN8NObpyS/zxSf6GXfzhFpHFOV0m7kXgVT965PXz55ooTT3llMEsW8cWFBRvzolWdEb4qn1xzmDIpcOK++JGMHFZ46L2WW55rV5DwDw+aOyYr6uepsStaMIf6V53dvTJYR9qBZc4N6yqsedWNWMb9HGkXNfWZjhyrpc0fMXDymhHouxcWsvLmePgQAAAC6GgQk09MuxcPxm/3pVOcW9rBp/JUiM/0XBRNjNLKT8ZdDFg3v3Iwk4PPofpLymwZ6kO7SnScGFqLRx/EImdVZXSot6MG8abaj538xxdnwHmyj3pVyGROJejvwGp22uvYp16DoRKoauoQdeYIsHXxn6HWqtKiMmXRED6sLW/FeiPBxQ6RMdI1OOI5OBvrIhC4DyM9F1LfzDpHlpIjo75/qeuymqNjmu97N+HxNBn2nlUr3rdI9l0YilhAfFGsAAADochCQTI4v6Ef1zBCF/A9OL7u2ryGrM/bEFimIQ8SiMeKd8Xl58d9f8lwwolMjkssAISkSk5siEfF11XtEWiKmLz2F7m4mnrzGzMC5QWruy23tucZdeP9RKTcwZLBUzExVGtifuejuJ3RlkxuqyuLiSuJs3+wUkpu36BvHAQOI+ek/wJFckZDbdK51bvrgTelTr2JHL0DEpCOfmZs6NcOraqneQ7tmWx/dteXacZWGj5RT/a6WLK4d84mDXQf/9VPVaHt0bWxtCQAAAHQ9CEim5zXEleSKSElW2t3A4DbGdlWc/Wd8noZw/CMjh3hKwy7knZBlfh8X4DXbx7grUGY8X1u79h/hy0sRl1elni+a4dp4lsX1zCz6Ott16JBOm/LfUYOfcycZxeTKLz/fGzWhtzFHqNIzr8zxHKy37d7ZpGz61m3IUG3KGjJiqO3P2TX/TU0snTDLWf8EdaU/p9Evnzd8SHu7DaprjJuu8zgELkNsiaRGfu78lVnO+i+zJu1cNnnKVBnHE6nexl6BKxZ2Vjriu7qwSLla/LtIMYmvf05FTi69PBHh8fsSfvAHa4MNnuDi3rf2FZE+Y1asC+vI5DotjST5HPNcvQa59iIAAADQ9aCKnemxA8cGc+gLr9jt8YX6dd9Ut7IOHM1v+FJ6fF+smLrS9n7r/9G5RRA+PbQXXQd8z8H8NifcaAfylYjEpG380Al0z5Hi4qH6ZWoJXYjsaFziffrZI15yIKbG9g+eQPUi1JUd2BpXUKn3kEr2S8zx35ofUpN6cHN6o44UVWnc1oSSOqonYeT0l+oT3+DQSHpBJPmJb7adkzV6U+lFk3aduEvtPHhmmDMxmnbMXrHomv5mRcnpvdG74n7tzPV2B49hXkXTl1lTHLs5LreOPGWFBUyKcHIWdt6/MV5jn6dLz5fGbz56vdH3Ri0+se9feVSvDic4xP8JTgZTKeTirAMbtsUz/YidOcUOAAAAzMn/BwAA//+df+kwAAAABklEQVQDAOzSaRF6SYSsAAAAAElFTkSuQmCC", "fragment-verify.png": "data:image/png;base64,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YIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAChZ7ZIAAABhklEQVQAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYIXAAAAAAAAArBAYAAAAAACAFQIDAAAAAACwQmAAAAAAAABWCAwAAAAAAMAKgQEAAAAAAFghMAAAAAAAACsEBgAAAAAAYPX/AAAA//+nE/yyAAAABklEQVQDAHYJmnAsTLwNAAAAAElFTkSuQmCC" };

// client/Home.jsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var STATUS_LABEL = { completed: "\u5DF2\u5B8C\u6210", failed: "\u5931\u8D25", running: "\u8FD0\u884C\u4E2D", pending: "\u5F85\u5F00\u59CB" };
var STATUS_TONE = { completed: "ok", failed: "bad", running: "busy", pending: "idle" };
var FRAGMENTS = [
  {
    src: assets_default["fragment-steps.png"],
    alt: "\u4E00\u6B21\u771F\u5B9E\u8FD0\u884C\u7684\u4E09\u4E2A\u6B65\u9AA4\uFF0C\u6BCF\u6B65\u663E\u793A\u9000\u51FA\u7801\u3001\u4EA7\u7269\u540D\u3001\u5B57\u8282\u6570\u4E0E\u54C8\u5E0C\u524D\u7F00",
    title: "\u6BCF\u4E00\u6B65\u90FD\u662F\u771F\u5B9E\u8FDB\u7A0B",
    body: "\u4E0D\u662F\u6A21\u578B\u63CF\u8FF0\u5B83\u505A\u4E86\u4EC0\u4E48\u3002\u5BBF\u4E3B\u6267\u884C\u6BCF\u4E2A\u6B65\u9AA4\uFF0C\u8BB0\u5F55\u9000\u51FA\u7801\u3001\u4EA7\u7269\u8DEF\u5F84\u4E0E\u5B57\u8282\u6570\u3002",
    width: 560,
    height: 232
  },
  {
    src: assets_default["fragment-verify.png"],
    alt: "\u5951\u7EA6\u68C0\u67E5\u7ED3\u679C\uFF1A\u8F93\u5165\u5B58\u5728\u3001\u4EA7\u7269\u843D\u5730\u3001\u5A92\u4F53\u7C7B\u578B\u5339\u914D",
    title: "\u5951\u7EA6\u4E0D\u6EE1\u8DB3\u5C31\u5224\u5931\u8D25",
    body: "\u9000\u51FA\u7801 0 \u4F46\u6CA1\u5199\u51FA\u58F0\u660E\u7684\u4EA7\u7269\uFF0C\u6B65\u9AA4\u4ECD\u7136\u7B97\u5931\u8D25\u3002\u8F93\u5165\u7F3A\u5931\u65F6\u547D\u4EE4\u6839\u672C\u4E0D\u6267\u884C\u3002",
    width: 520,
    height: 230
  },
  {
    src: assets_default["fragment-audit-chain.png"],
    alt: "\u5BA1\u8BA1\u94FE\u4E8B\u4EF6\u5217\u8868\uFF0C\u6BCF\u6761\u5E26\u524D\u4E00\u6761\u7684\u54C8\u5E0C\u524D\u7F00",
    title: "\u5BA1\u8BA1\u94FE\u53EF\u79BB\u7EBF\u81EA\u6821\u9A8C",
    body: "\u5E26 previousHash \u4E0E eventHash \u7684\u94FE\u3002\u6539\u52A8\u4EFB\u4F55\u4E00\u6761\uFF0C\u6574\u94FE\u6821\u9A8C\u5931\u8D25\u3002",
    width: 560,
    height: 300
  },
  {
    src: assets_default["fragment-parallel.png"],
    alt: "\u4E09\u4E2A\u5E76\u884C\u6B65\u9AA4\u7684\u8C03\u5EA6\u793A\u610F\u4E0E\u5B9E\u6D4B\u8017\u65F6\u5BF9\u6BD4",
    title: "\u5E76\u884C\u9700\u8981\u4F60\u660E\u786E\u6388\u6743",
    body: "\u9ED8\u8BA4\u4E32\u884C\u3002\u58F0\u660E\u5199\u5165\u8303\u56F4\u51B2\u7A81\u65F6\u62D2\u7EDD\u5E76\u884C\uFF0C\u800C\u4E0D\u662F\u8D4C\u4E00\u628A\u3002",
    width: 540,
    height: 250
  }
];
function relativeTime(iso) {
  if (typeof iso !== "string") return "";
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1e3);
  if (seconds < 60) return "\u521A\u521A";
  if (seconds < 3600) return Math.floor(seconds / 60) + " \u5206\u949F\u524D";
  if (seconds < 86400) return Math.floor(seconds / 3600) + " \u5C0F\u65F6\u524D";
  return Math.floor(seconds / 86400) + " \u5929\u524D";
}
function chainEvents(runs) {
  const events = [];
  for (const run of runs) {
    const steps = Array.isArray(run.steps) ? run.steps : [];
    for (const step2 of steps) {
      events.push({
        type: step2.status === "completed" ? "step-completed" : step2.status === "failed" ? "step-failed" : "step",
        label: (run.title || run.id) + " \xB7 " + (step2.title || step2.id),
        verified: step2.status !== "failed"
      });
    }
    if (!steps.length) events.push({ type: "run-created", label: run.title || run.id, verified: true });
  }
  return events.slice(0, 24);
}
function Capability({ item, index }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-cap" + (index % 2 === 1 ? " rw-cap--flip" : ""), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-cap-copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: item.title }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: item.body })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("figure", { className: "rw-cap-shot", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("img", { src: item.src, alt: item.alt, width: item.width, height: item.height, loading: "lazy" }) })
  ] });
}
function RunRow({ run, onOpen }) {
  const tone = STATUS_TONE[run.status] ?? "idle";
  const steps = Array.isArray(run.steps) ? run.steps : [];
  const done = steps.filter((step2) => step2.status === "completed").length;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "rw-home-run", onClick: () => onOpen(run.id), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-dot rw-home-dot--" + tone, "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-run-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-run-title", children: run.title || "\u672A\u547D\u540D\u8FD0\u884C" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-run-meta", children: [
        STATUS_LABEL[run.status] ?? run.status,
        steps.length > 0 && " \xB7 " + done + "/" + steps.length + " \u6B65",
        run.templateId && " \xB7 " + run.templateId
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-run-time", children: relativeTime(run.updatedAt || run.createdAt) })
  ] });
}
function TemplateCard({ template, onPick }) {
  const scripted = template.steps.filter((step2) => step2.command).length;
  const total = template.steps.length;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "rw-home-card", onClick: () => onPick(template), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GlowingEffect, { spread: 70, glow: true, disabled: false, proximity: 18, inactiveZone: 0.12, borderWidth: 1.5 }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-card-top", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-badge", children: template.badge }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-card-arrow", "aria-hidden": "true", children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-card-title", children: template.title }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-card-desc", children: template.description }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-card-foot", children: scripted > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-pill rw-home-pill--ok", children: [
        scripted,
        " \u6B65\u81EA\u52A8\u6267\u884C"
      ] }),
      total > scripted && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-pill", children: [
        total - scripted,
        " \u6B65\u9700\u4EBA\u5DE5"
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-home-pill", children: "\u5168\u90E8\u4EBA\u5DE5\u63A8\u8FDB" }) })
  ] });
}
function WorkbenchHome({ api: api2, onOpenWorkflow, onPickTemplate, onRefreshFiles, cwd }) {
  const [runs, setRuns] = (0, import_react3.useState)({ state: "loading" });
  const [selected, setSelected] = (0, import_react3.useState)(null);
  const loadRuns = (0, import_react3.useCallback)(() => {
    setRuns({ state: "loading" });
    api2("workflow/list", {}).then((value) => {
      const list = Array.isArray(value?.runs) ? value.runs : [];
      const sorted = [...list].sort((a, b) => String(b.updatedAt ?? b.createdAt ?? "").localeCompare(String(a.updatedAt ?? a.createdAt ?? "")));
      setRuns({ state: "ready", list: sorted });
    }).catch((error) => setRuns({ state: "error", message: error?.message || "\u65E0\u6CD5\u8BFB\u53D6\u8FD0\u884C\u8BB0\u5F55" }));
  }, [api2]);
  (0, import_react3.useEffect)(loadRuns, [loadRuns]);
  const recent = runs.state === "ready" ? runs.list.slice(0, 4) : [];
  const isEmpty = runs.state === "ready" && runs.list.length === 0;
  const events = (0, import_react3.useMemo)(() => runs.state === "ready" ? chainEvents(runs.list) : [], [runs]);
  const totals = (0, import_react3.useMemo)(() => {
    if (runs.state !== "ready") return null;
    let steps = 0;
    let failed = 0;
    for (const run of runs.list) {
      const list = Array.isArray(run.steps) ? run.steps : [];
      steps += list.length;
      failed += list.filter((step2) => step2.status === "failed").length;
    }
    return { runs: runs.list.length, steps, failed };
  }, [runs]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-home", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "rw-hero", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-hero-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { children: isEmpty ? "\u5F00\u59CB\u7B2C\u4E00\u4E2A\u7814\u7A76\u6D41\u7A0B" : "\u7EE7\u7EED\u4F60\u7684\u7814\u7A76" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-hero-lede", children: isEmpty ? "\u8FD9\u662F\u7814\u7A76\u5DE5\u4F5C\u53F0\uFF1A\u6BCF\u4E00\u6B65\u7531\u5BBF\u4E3B\u771F\u5B9E\u6267\u884C\uFF0C\u4EA7\u7269\u6309\u5B57\u8282\u54C8\u5E0C\u767B\u8BB0\uFF0C\u5BA1\u8BA1\u94FE\u53EF\u79BB\u7EBF\u81EA\u6821\u9A8C\u3002" : "\u7814\u7A76\u5DE5\u4F5C\u53F0\uFF1A\u9009\u4E00\u4E2A\u6A21\u677F\u5F00\u59CB\u65B0\u7684\u8FD0\u884C\uFF0C\u6216\u4ECE\u6700\u8FD1\u7684\u8BB0\u5F55\u7EE7\u7EED\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-hero-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "rw-home-primary", onClick: () => onOpenWorkflow(), children: "\u6253\u5F00\u5DE5\u4F5C\u6D41" }),
          cwd && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { type: "button", className: "rw-home-secondary", onClick: onRefreshFiles, children: "\u6D4F\u89C8\u6587\u4EF6" })
        ] }),
        cwd && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-cwd", title: cwd, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: cwd }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-hero-stage", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-hero-stage-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u5BA1\u8BA1\u94FE" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "rw-hero-stage-count", children: runs.state === "ready" ? events.length + " \u4E2A\u4E8B\u4EF6" : "\u8BFB\u53D6\u4E2D" })
        ] }),
        runs.state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-note", children: "\u6B63\u5728\u8BFB\u53D6\u8FD0\u884C\u8BB0\u5F55\u2026" }),
        runs.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-error", role: "alert", children: runs.message }),
        runs.state === "ready" && (events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DnaHelix, { events, height: 232, turns: 2.6, selected, onSelect: setSelected }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "rw-hero-stage-empty", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "\u8FD8\u6CA1\u6709\u4E8B\u4EF6\u3002\u5B8C\u6210\u7B2C\u4E00\u4E2A\u6A21\u677F\u540E\uFF0C\u6BCF\u4E00\u6B65\u90FD\u4F1A\u6210\u4E3A\u8FD9\u6761\u94FE\u4E0A\u7684\u4E00\u6761\u6A2A\u6863\u3002" }) })),
        totals && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("dl", { className: "rw-hero-metrics", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: "\u8FD0\u884C" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: totals.runs })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: "\u6B65\u9AA4" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { children: totals.steps })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dt", { children: "\u5931\u8D25\u6B65\u9AA4" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("dd", { className: totals.failed > 0 ? "is-bad" : "", children: totals.failed })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "rw-home-section rw-capabilities", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-home-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "\u5B83\u5B9E\u9645\u505A\u4EC0\u4E48" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-count", children: [
          FRAGMENTS.length,
          " \u9879"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-note", children: "\u4E0B\u9762\u662F\u8FD9\u4E2A\u5DE5\u4F5C\u53F0\u81EA\u5DF1\u4EA7\u51FA\u7684\u754C\u9762\u7247\u6BB5\uFF0C\u4E0D\u662F\u793A\u610F\u56FE\u3002" }),
      FRAGMENTS.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Capability, { item, index }, item.title))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "rw-home-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-home-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "\u7814\u7A76\u6A21\u677F" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "rw-home-count", children: [
          WORKFLOW_TEMPLATES.length,
          " \u4E2A"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-note", children: "\u6807\u6CE8\u4E86\u54EA\u4E9B\u6B65\u9AA4\u4F1A\u771F\u5B9E\u6267\u884C\u3001\u54EA\u4E9B\u9700\u8981\u4F60\u5224\u65AD\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "rw-home-cards", children: WORKFLOW_TEMPLATES.map((template) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TemplateCard, { template, onPick: onPickTemplate }, template.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "rw-home-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-home-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { children: "\u6700\u8FD1\u7684\u8FD0\u884C" }),
        runs.state === "ready" && runs.list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "rw-home-link", onClick: () => onOpenWorkflow(), children: [
          "\u67E5\u770B\u5168\u90E8 ",
          runs.list.length,
          " \u6761"
        ] })
      ] }),
      runs.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "rw-home-error", role: "alert", children: runs.message }),
      runs.state === "ready" && recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "rw-home-runs", children: recent.map((run) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(RunRow, { run, onOpen: (id) => onOpenWorkflow(id) }, run.id)) }),
      isEmpty && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "rw-home-empty", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "\u8FD8\u6CA1\u6709\u8FD0\u884C\u8BB0\u5F55\u3002\u5B8C\u6210\u7B2C\u4E00\u4E2A\u6A21\u677F\u540E\uFF0C\u6BCF\u4E00\u6B65\u7684\u72B6\u6001\u4E0E\u8BC1\u636E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "rw-home-secondary", onClick: () => onPickTemplate(WORKFLOW_TEMPLATES[0]), children: [
          "\u7528\u300C",
          WORKFLOW_TEMPLATES[0]?.title ?? "\u7B2C\u4E00\u4E2A\u6A21\u677F",
          "\u300D\u5F00\u59CB"
        ] })
      ] })
    ] })
  ] });
}

// client/WorkflowPanel.jsx
var import_react5 = __toESM(require_react(), 1);

// client/Feedback.jsx
var import_react4 = __toESM(require_react(), 1);
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
function SkeletonRows({ rows = 3 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "rw-skeletons", "aria-hidden": "true", children: Array.from({ length: rows }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "rw-skeleton", style: { width: 70 + index * 13 % 30 + "%" } }, index)) });
}

// client/WorkflowPanel.jsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var STATUS_LABEL2 = { pending: "\u5F85\u5F00\u59CB", running: "\u8FD0\u884C\u4E2D", completed: "\u5DF2\u5B8C\u6210", failed: "\u5931\u8D25", skipped: "\u5DF2\u8DF3\u8FC7", cancelled: "\u5DF2\u53D6\u6D88" };
var STATUS_TONE2 = { completed: "ok", failed: "bad", running: "busy", skipped: "idle", cancelled: "idle", pending: "idle" };
var DECISIONS = [
  { value: "accepted", label: "\u63A5\u53D7\u7ED3\u679C" },
  { value: "rejected", label: "\u62D2\u7EDD" },
  { value: "needs-revision", label: "\u9700\u8981\u4FEE\u6539" }
];
function StepRow({ step: step2 }) {
  const tone = STATUS_TONE2[step2.status] ?? "idle";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-step", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-home-dot rw-home-dot--" + tone, "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-step-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rw-step-title", children: step2.title || step2.id }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-step-meta", children: [
        STATUS_LABEL2[step2.status] ?? step2.status,
        Array.isArray(step2.artifacts) && step2.artifacts.length > 0 && " \xB7 " + step2.artifacts.length + " \u4E2A\u4EA7\u7269",
        step2.error && " \xB7 " + step2.error
      ] }),
      Array.isArray(step2.artifacts) && step2.artifacts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("ul", { className: "rw-step-artifacts", children: step2.artifacts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: item.path }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
          item.bytes,
          " B"
        ] }),
        item.sha256 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-hash", children: item.sha256.slice(0, 12) })
      ] }, item.path)) })
    ] })
  ] });
}
function WorkflowPanel({ api: api2, initialTemplateId, initialRunId }) {
  const [templateId, setTemplateId] = (0, import_react5.useState)(initialTemplateId ?? WORKFLOW_TEMPLATES[0].id);
  const [runs, setRuns] = (0, import_react5.useState)({ state: "loading" });
  const [activeId, setActiveId] = (0, import_react5.useState)(initialRunId ?? null);
  const [run, setRun] = (0, import_react5.useState)({ state: "idle" });
  const [evidence, setEvidence] = (0, import_react5.useState)({ state: "idle" });
  const [busy, setBusy] = (0, import_react5.useState)("");
  const [notice, setNotice] = (0, import_react5.useState)(null);
  const template = (0, import_react5.useMemo)(() => WORKFLOW_TEMPLATES.find((item) => item.id === templateId) ?? WORKFLOW_TEMPLATES[0], [templateId]);
  const loadRuns = (0, import_react5.useCallback)(() => {
    setRuns({ state: "loading" });
    api2("workflow/list", {}).then((value) => setRuns({ state: "ready", list: Array.isArray(value?.runs) ? value.runs : [] })).catch((error) => setRuns({ state: "error", message: error?.message || "\u65E0\u6CD5\u8BFB\u53D6\u8FD0\u884C\u8BB0\u5F55" }));
  }, [api2]);
  (0, import_react5.useEffect)(loadRuns, [loadRuns]);
  const openRun = (0, import_react5.useCallback)((id) => {
    setActiveId(id);
    setRun({ state: "loading" });
    setEvidence({ state: "idle" });
    api2("workflow/get", { runId: id }).then((value) => setRun({ state: "ready", run: value.run })).catch((error) => setRun({ state: "error", message: error?.message || "\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u6B21\u8FD0\u884C" }));
  }, [api2]);
  (0, import_react5.useEffect)(() => {
    if (initialRunId) openRun(initialRunId);
  }, [initialRunId, openRun]);
  const createRun = (0, import_react5.useCallback)(() => {
    setBusy("create");
    setNotice(null);
    api2("workflow/create", {
      templateId: template.id,
      title: template.title,
      preset: template.preset,
      steps: template.steps.map((step2) => ({
        id: step2.id,
        title: step2.title,
        instructions: step2.instructions,
        ...step2.command ? { command: step2.command } : {},
        ...step2.needs ? { needs: step2.needs } : {},
        ...step2.inputs ? { inputs: step2.inputs } : {},
        ...step2.outputs ? { outputs: step2.outputs } : {}
      }))
    }).then((value) => {
      setBusy("");
      setNotice({ tone: "ok", text: "\u5DF2\u521B\u5EFA\u8FD0\u884C " + value.runId });
      loadRuns();
      openRun(value.runId);
    }).catch((error) => {
      setBusy("");
      setNotice({ tone: "bad", text: error?.message || "\u521B\u5EFA\u5931\u8D25" });
    });
  }, [api2, template, loadRuns, openRun]);
  const execute = (0, import_react5.useCallback)(() => {
    if (!activeId) return;
    setBusy("execute");
    setNotice(null);
    api2("workflow/execute", { runId: activeId }).then((value) => {
      setBusy("");
      setNotice({ tone: value.status === "completed" ? "ok" : "bad", text: "\u6267\u884C\u7ED3\u675F\uFF1A" + value.status });
      openRun(activeId);
      loadRuns();
    }).catch((error) => {
      setBusy("");
      setNotice({ tone: "bad", text: error?.message || "\u6267\u884C\u5931\u8D25" });
    });
  }, [api2, activeId, openRun, loadRuns]);
  const loadEvidence = (0, import_react5.useCallback)(() => {
    if (!activeId) return;
    setEvidence({ state: "loading" });
    Promise.all([
      api2("workflow/provenance", { runId: activeId }).catch((error) => ({ error })),
      api2("workflow/artifacts", { runId: activeId }).catch((error) => ({ error }))
    ]).then(([provenance, artifacts]) => {
      setEvidence({ state: "ready", provenance, artifacts });
    });
  }, [api2, activeId]);
  const decide = (0, import_react5.useCallback)((decision) => {
    if (!activeId) return;
    setBusy("decide");
    api2("workflow/decision", { runId: activeId, decision }).then(() => {
      setBusy("");
      setNotice({ tone: "ok", text: "\u5DF2\u8BB0\u5F55\u51B3\u7B56\uFF1A" + decision });
      openRun(activeId);
    }).catch((error) => {
      setBusy("");
      setNotice({ tone: "bad", text: error?.message || "\u65E0\u6CD5\u8BB0\u5F55\u51B3\u7B56" });
    });
  }, [api2, activeId, openRun]);
  const activeRun = run.state === "ready" ? run.run : null;
  const terminal = activeRun && ["completed", "failed"].includes(activeRun.status);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-workflow", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "rw-wf-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rw-home-section-head", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { children: "\u65B0\u5EFA\u8FD0\u884C" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-wf-create", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("select", { value: templateId, onChange: (event) => setTemplateId(event.target.value), "aria-label": "\u9009\u62E9\u6A21\u677F", children: WORKFLOW_TEMPLATES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: item.id, children: item.title }, item.id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "rw-home-primary", onClick: createRun, disabled: busy === "create", children: busy === "create" ? "\u521B\u5EFA\u4E2D\u2026" : "\u521B\u5EFA\u8FD0\u884C" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "rw-home-note", children: [
        template.description,
        " \xB7 ",
        template.steps.filter((step2) => step2.command).length,
        "/",
        template.steps.length,
        " \u6B65\u53EF\u81EA\u52A8\u6267\u884C"
      ] })
    ] }),
    notice && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "rw-wf-notice rw-wf-notice--" + notice.tone, role: "status", children: notice.text }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "rw-wf-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-home-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { children: "\u8FD0\u884C\u8BB0\u5F55" }),
        runs.state === "ready" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "rw-home-count", children: [
          runs.list.length,
          " \u6761"
        ] })
      ] }),
      runs.state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SkeletonRows, { rows: 3 }),
      runs.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "rw-home-error", role: "alert", children: runs.message }),
      runs.state === "ready" && runs.list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "rw-home-note", children: "\u8FD8\u6CA1\u6709\u8FD0\u884C\u3002\u9009\u4E00\u4E2A\u6A21\u677F\u521B\u5EFA\u7B2C\u4E00\u6761\u3002" }),
      runs.state === "ready" && runs.list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rw-home-runs", children: runs.list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "button",
        {
          type: "button",
          className: "rw-home-run" + (item.id === activeId ? " is-active" : ""),
          onClick: () => openRun(item.id),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-home-dot rw-home-dot--" + (STATUS_TONE2[item.status] ?? "idle"), "aria-hidden": "true" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "rw-home-run-main", children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-home-run-title", children: item.title || item.id }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-home-run-meta", children: STATUS_LABEL2[item.status] ?? item.status })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "rw-home-run-time", children: [
              (item.steps ?? []).length,
              " \u6B65"
            ] })
          ]
        },
        item.id
      )) })
    ] }),
    activeId && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "rw-wf-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-home-section-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { children: "\u8FD0\u884C\u8BE6\u60C5" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "rw-home-link", onClick: () => openRun(activeId), children: "\u5237\u65B0" })
      ] }),
      run.state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SkeletonRows, { rows: 4 }),
      run.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "rw-home-error", role: "alert", children: run.message }),
      activeRun && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-wf-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "rw-home-primary", onClick: execute, disabled: busy === "execute" || !(activeRun.steps ?? []).some((step2) => step2.command), children: busy === "execute" ? "\u6267\u884C\u4E2D\u2026" : "\u7531\u5BBF\u4E3B\u6267\u884C\u547D\u4EE4\u6B65\u9AA4" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "rw-home-secondary", onClick: loadEvidence, children: "\u8BFB\u53D6\u8BC1\u636E" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "rw-home-note", children: [
          (activeRun.steps ?? []).filter((step2) => step2.command).length,
          " \u4E2A\u6B65\u9AA4\u5E26\u547D\u4EE4\uFF0C\u7531\u5BBF\u4E3B\u771F\u5B9E\u6267\u884C\uFF1B \u5176\u4F59\u6B65\u9AA4\u662F\u63D0\u793A\u9A71\u52A8\uFF0C\u9700\u8981\u4F60\u5224\u65AD\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "rw-steps", children: (activeRun.steps ?? []).map((step2) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StepRow, { step: step2 }, step2.id)) }),
        evidence.state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SkeletonRows, { rows: 2 }),
        evidence.state === "ready" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-evidence", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-evidence-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u5BA1\u8BA1\u94FE" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: evidence.provenance?.provenance ? evidence.provenance.verified ? "\u2713 \u6821\u9A8C\u901A\u8FC7" : "\u2717 \u6821\u9A8C\u5931\u8D25" : evidence.provenance?.reason ?? "\u65E0 provenance" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-evidence-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\u4EA7\u7269" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
              (evidence.artifacts?.artifacts ?? []).length,
              " \u4E2A\u5DF2\u6838\u5BF9",
              (evidence.artifacts?.missing ?? []).length > 0 && " \xB7 \u7F3A\u5931 " + evidence.artifacts.missing.length + " \u4E2A"
            ] })
          ] }),
          (evidence.artifacts?.artifacts ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-evidence-artifact", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: item.path }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
              item.bytes,
              " B"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-hash", children: item.sha256.slice(0, 12) })
          ] }, item.path))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "rw-decision", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-decision-label", children: "\u4EBA\u5DE5\u51B3\u7B56" }),
          DECISIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              type: "button",
              className: "rw-home-secondary",
              disabled: !terminal || busy === "decide",
              onClick: () => decide(item.value),
              children: item.label
            },
            item.value
          )),
          !terminal && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "rw-home-note", children: "\u8FD0\u884C\u7ED3\u675F\u540E\u624D\u80FD\u8BB0\u5F55\u51B3\u7B56\u3002" })
        ] }),
        activeRun.decisionGate && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "rw-home-note", children: [
          "\u5DF2\u8BB0\u5F55\uFF1A",
          activeRun.decisionGate.decision,
          " \xB7 ",
          activeRun.decisionGate.actor,
          " \xB7 \u4E34\u5E8A\u7528\u9014 ",
          activeRun.decisionGate.clinicalUse
        ] })
      ] })
    ] })
  ] });
}

// site/demo-api.js
var RUNS = [
  {
    id: "2026-11-02T09-04-02-537Z-sequence-analysis",
    title: "\u5E8F\u5217\u5206\u6790",
    status: "completed",
    templateId: "sequence-analysis",
    updatedAt: new Date(Date.now() - 1e3 * 60 * 12).toISOString(),
    steps: [
      { id: "inspect-inputs", title: "\u626B\u63CF\u5E8F\u5217\u6587\u4EF6", status: "completed", artifacts: [] },
      { id: "analyze-sequences", title: "\u6C47\u603B\u5E8F\u5217", status: "completed", artifacts: [{ path: "sequence-summary.json", bytes: 111, sha256: "1917fe519f3d76cf" }] }
    ]
  },
  {
    id: "2026-11-02T08-57-14-252Z-biomni-toolkit",
    title: "Biomni \u5DE5\u5177\u94FE",
    status: "completed",
    templateId: "biomni-toolkit",
    updatedAt: new Date(Date.now() - 1e3 * 60 * 48).toISOString(),
    steps: [
      { id: "inventory", title: "\u6E05\u70B9\u53EF\u7528\u5DE5\u5177", status: "completed", artifacts: [{ path: "biomni-inventory.json", bytes: 9098, sha256: "e7b98295d7d4" }] },
      { id: "restriction-sites", title: "\u9176\u5207\u4F4D\u70B9\u5206\u6790", status: "completed", artifacts: [{ path: "restriction-sites.json", bytes: 3283, sha256: "a2b6c02a2e78" }] },
      { id: "reading-frames", title: "\u5F00\u653E\u9605\u8BFB\u6846\u6CE8\u91CA", status: "completed", artifacts: [{ path: "reading-frames.json", bytes: 1088, sha256: "b5a0c92b6f42" }] }
    ]
  },
  {
    id: "2026-11-02T07-31-08-115Z-bioconductor-de",
    title: "Bioconductor \u5DEE\u5F02\u8868\u8FBE",
    status: "completed",
    templateId: "bioconductor-de",
    updatedAt: new Date(Date.now() - 1e3 * 60 * 60 * 5).toISOString(),
    steps: [
      { id: "inspect-inputs", title: "\u68C0\u67E5\u8F93\u5165\u77E9\u9635", status: "completed", artifacts: [] },
      { id: "differential-expression", title: "limma \u5DEE\u5F02\u8868\u8FBE", status: "completed", artifacts: [{ path: "de-results.csv", bytes: 23501, sha256: "7c81ca1022c17b29" }, { path: "de-summary.json", bytes: 328, sha256: "6b7d067dd30b49" }] }
    ]
  },
  {
    id: "2026-11-02T06-12-44-902Z-sequence-analysis",
    title: "\u5E8F\u5217\u5206\u6790\uFF08\u89E3\u91CA\u5668\u7F3A\u5931\uFF09",
    status: "failed",
    templateId: "sequence-analysis",
    updatedAt: new Date(Date.now() - 1e3 * 60 * 60 * 9).toISOString(),
    steps: [
      { id: "inspect-inputs", title: "\u626B\u63CF\u5E8F\u5217\u6587\u4EF6", status: "failed", error: "biopython is not installed for C:\\anaconda3\\python.exe", artifacts: [] },
      { id: "analyze-sequences", title: "\u6C47\u603B\u5E8F\u5217", status: "skipped", artifacts: [] }
    ]
  }
];
var EVIDENCE = {
  audit: [
    { at: "09:04:02", type: "workflow-created", toString: "sequence-analysis" },
    { at: "09:04:02", type: "artifact-observed", toString: "sequence-summary.json \xB7 111 B" },
    { at: "09:04:02", type: "execution-recorded", toString: "analyze-sequences \xB7 exit 0" }
  ],
  artifacts: [
    { path: "sequence-summary.json", bytes: 111, sha256: "1915fe519f3d76cf" }
  ]
};
function delay(value, ms = 120) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function createDemoApi() {
  const mutable = RUNS.map((run) => JSON.parse(JSON.stringify(run)));
  return async function api2(action, payload = {}) {
    switch (action) {
      case "workflow/list":
        return delay({ runs: mutable.map(({ steps, ...rest }) => ({ ...rest, steps: steps.map((s) => ({ id: s.id, title: s.title, status: s.status })) })) });
      case "workflow/get": {
        const run = mutable.find((item) => item.id === payload.runId) ?? mutable[0];
        return delay({ run });
      }
      case "workflow/provenance":
        return delay({ provenance: { audit: EVIDENCE.audit }, verified: true });
      case "workflow/artifacts": {
        const run = mutable.find((item) => item.id === payload.runId) ?? mutable[0];
        const declared = run.steps.flatMap((step2) => (step2.artifacts ?? []).map((a) => a.path));
        const artifacts = run.steps.flatMap((step2) => step2.artifacts ?? []);
        return delay({ artifacts, declared, missing: [] });
      }
      case "editor/read":
        return delay({
          path: payload.path ?? "columns.csv",
          version: "v1",
          text: ["probe,control_1,control_2,treated_1,treated_2", "YGL054C,42,39,148,151", "YGR189C,88,91,86,84", "YDR481C,17,19,61,58", "YBR038W,120,118,44,47"].join("\n")
        });
      case "editor/save":
        return delay({ path: payload.path, text: payload.text, version: "v2" });
      case "workflow/create":
        return delay({ runId: "demo-" + Date.now(), run: mutable[0] });
      case "workflow/execute":
        return delay({ runId: payload.runId, status: "completed", order: ["inspect-inputs", "analyze-sequences"] });
      case "workflow/decision":
        return delay({ runId: payload.runId, decisionGate: { decision: payload.decision, actor: "human-user (identity not verified)", clinicalUse: "not-authorized" } });
      default: {
        const error = new Error("the demo does not implement " + action);
        error.code = "NOT_IMPLEMENTED";
        throw error;
      }
    }
  };
}

// .build/styles.js
var styles_default = `/* Panel shell: navigation, body, and the placeholder used when a host capability is
   absent. Colours come from the host tokens declared in home.css so every view agrees. */

.rw-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--hw-bg, #ffffff);
  color: var(--hw-text, #0f1115);
  font-family: inherit;
}

.rw-nav {
  display: flex;
  gap: 4px;
  padding: 10px 16px 0;
  flex: none;
}

.rw-nav-item {
  font: inherit;
  font-size: 13px;
  padding: 6px 12px;
  border: 0;
  border-radius: var(--hw-radius-pill, 999px);
  background: transparent;
  color: var(--hw-text-3, #5b6270);
  cursor: pointer;
}

.rw-nav-item.is-active {
  background: var(--hw-surface-2, #f3f4f6);
  color: var(--hw-text, #0f1115);
  font-weight: 500;
}

.rw-body { flex: 1; min-height: 0; display: flex; }

.rw-placeholder {
  flex: 1;
  padding: 24px;
  color: var(--hw-text-3, #5b6270);
  font-size: 15px;
  line-height: 1.6;
}

/* Workflow panel styles. Kept separate from the overview so the two views can change
   without touching each other. */

.rw-workflow { display: flex; flex-direction: column; gap: 14px; padding: 16px 20px; width: 100%; }
.rw-workflow-step { padding: 12px 14px; border-radius: 8px; background: #f3f4f6; }
.rw-workflow-step-title { font-size: 14px; font-weight: 600; }
.rw-workflow-step-body { font-size: 13px; color: #4b5563; margin-top: 4px; }


/* ---------------------------------------------------------------- workflow panel */

.rw-workflow { display: flex; flex-direction: column; gap: 22px; padding: 16px 20px 40px; width: 100%; min-width: 0; }

.rw-wf-block { display: flex; flex-direction: column; gap: 12px; }

.rw-wf-create { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

.rw-wf-create select {
  font: inherit;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: #f3f4f6;
  color: inherit;
  min-width: 200px;
}

.rw-wf-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.rw-wf-notice { margin: 0; font-size: 14px; padding: 8px 12px; border-radius: 8px; }
.rw-wf-notice--ok { background: #e8f6f1; color: #0f7b5f; }
.rw-wf-notice--bad { background: #fdecea; color: #c0392b; }

.rw-steps { display: flex; flex-direction: column; gap: 8px; }

.rw-step { display: grid; grid-template-columns: 14px 1fr; gap: 12px; padding: 12px 14px; border-radius: 8px; background: #f6f7f9; }
.rw-step-main { min-width: 0; }
.rw-step-title { font-size: 14px; font-weight: 500; }
.rw-step-meta { font-size: 13px; color: #5b6270; margin-top: 2px; }

.rw-step-artifacts { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.rw-step-artifacts li { display: flex; gap: 8px; align-items: baseline; font-size: 12px; color: #5b6270; }
.rw-step-artifacts code { font-family: ui-monospace; font-size: 12px; background: #eef0f3; padding: 1px 6px; border-radius: 4px; }

.rw-hash { font-family: ui-monospace; font-size: 11px; color: #9aa2b1; }

.rw-evidence { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-radius: 8px; background: #f6f7f9; }
.rw-evidence-row { display: flex; justify-content: space-between; font-size: 13px; }
.rw-evidence-artifact { display: flex; gap: 8px; font-size: 12px; color: #5b6270; }

.rw-decision { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; padding-top: 4px; }
.rw-decision-label { font-size: 14px; color: #5b6270; }

/* ---------------------------------------------------------------- editor */

.rw-editor { display: flex; flex-direction: column; gap: 12px; padding: 16px 20px 40px; width: 100%; min-width: 0; }

.rw-editor-bar { display: flex; gap: 10px; flex-wrap: wrap; }

.rw-editor-bar input {
  flex: 1;
  min-width: 220px;
  font: inherit;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: #f3f4f6;
  color: inherit;
}

.rw-editor-area {
  width: 100%;
  min-height: 320px;
  font-family: ui-monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 14px;
  border-radius: 8px;
  border: 0;
  background: #f6f7f9;
  color: inherit;
  resize: vertical;
}

/* ---------------------------------------------------------------- command palette */

.rw-palette-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 17, 21, .28);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  z-index: 60;
}

.rw-palette {
  width: min(560px, 92vw);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, .24);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rw-palette-input {
  font: inherit;
  font-size: 15px;
  padding: 14px 16px;
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, .08);
  outline: none;
}

.rw-palette-list { max-height: 320px; overflow: auto; padding: 6px; }

.rw-palette-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  text-align: left;
  font: inherit;
  font-size: 14px;
  padding: 9px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.rw-palette-item.is-active { background: #eef3fe; color: #2f5fd0; }
.rw-palette-hint { color: #9aa2b1; font-size: 12px; }
.rw-palette-empty { margin: 0; padding: 14px 16px; color: #5b6270; font-size: 14px; }

.rw-nav-kbd {
  margin-left: auto;
  font: inherit;
  font-size: 12px;
  padding: 4px 10px;
  border: 0;
  border-radius: 6px;
  background: #f3f4f6;
  color: #5b6270;
  cursor: pointer;
}


/* ---------------------------------------------------------------- view transitions */

/* The old view fades out while the new one fades in. Naming the element means the browser
   animates the content rather than the whole page, so the nav does not flicker. */
::view-transition-old(workbench-view) {
  animation: 180ms cubic-bezier(.4, 0, 1, 1) both rw-view-out;
}

::view-transition-new(workbench-view) {
  animation: 240ms cubic-bezier(0, 0, .2, 1) both rw-view-in;
}

@keyframes rw-view-out {
  to { opacity: 0; transform: translateY(-6px); }
}

@keyframes rw-view-in {
  from { opacity: 0; transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(workbench-view),
  ::view-transition-new(workbench-view) { animation: none; }
}

/* Workspace overview \u2014 styled to match the host application.
   Colours are sampled from the DSH UI: white surfaces, near-black text, 12px card radius,
   pill buttons, and the host's blue as the single accent. A dark variant keys off the
   same marker the host sets, rather than inventing a second palette. */

.rw-home {
  /* The host resets box-sizing globally, but a standalone render does not, and
     content-box + width:100% + 48px of padding produced a 48px overflow that widened
     every child. Declaring it here makes the panel independent of the host reset. */
  box-sizing: border-box;
  width: 100%;
  --hw-bg: #ffffff;
  --hw-surface: #f9fafb;
  --hw-surface-2: #f3f4f6;
  --hw-border: rgba(0, 0, 0, .12);
  --hw-border-strong: rgba(0, 0, 0, .2);
  --hw-text: #0f1115;
  --hw-text-2: #4b5563;
  --hw-text-3: #5b6270;
  /* #4176e6 measured 4.2:1 on white and failed WCAG AA for text; this is the same hue
     at 4.6:1. */
  --hw-accent: #2f5fd0;
  --hw-accent-soft: #eef3fe;
  --hw-ok: #0f7b5f;
  --hw-ok-soft: #e8f6f1;
  --hw-bad: #c0392b;
  --hw-busy: #a06a00;
  --hw-radius-sm: 8px;
  --hw-radius-md: 12px;
  --hw-radius-pill: 999px;

  flex: 1;
  min-height: 0;
  overflow: auto;
  /* Reserve the scrollbar gutter symmetrically: with a one-sided scrollbar the content
     sits visibly off-centre. */
  scrollbar-gutter: stable both-edges;
  padding: 22px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  background: var(--hw-bg);
  color: var(--hw-text);
  font-family: inherit;
}

.rw-home > * {
  box-sizing: border-box;
  width: 100%;
  /* The cap is always the panel width, so the left and right margins come out equal.
     A fixed pixel cap cannot do that once a scrollbar takes width from one side. */
  max-width: 100%;
  margin-inline: 0;
}

body[data-ds-dark-theme] .rw-home {
  --hw-bg: transparent;
  --hw-surface: #ffffff0a;
  --hw-surface-2: #ffffff14;
  --hw-border: #ffffff1f;
  --hw-border-strong: #ffffff29;
  --hw-text: #f0f2f5;
  --hw-text-2: #a9b1bd;
  --hw-text-3: #9aa2b1;
  --hw-accent: #7aa2f7;
  --hw-accent-soft: #ffffff14;
  --hw-ok: #58d3ab;
  --hw-ok-soft: #58d3ab1a;
  --hw-bad: #ff8a7a;
  --hw-busy: #e0b341;
}

/* ---------------------------------------------------------------- hero
   Two columns on wide panels, stacked when the panel is narrow, because the workbench
   is usually a side panel rather than a full page. */

.rw-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 32px;
  align-items: center;
  padding-bottom: 8px;
  min-width: 0;
}

.rw-hero-copy { display: flex; flex-direction: column; justify-content: center; min-width: 0; }

.rw-hero h1 {
  margin: 0;
  font-size: clamp(2.25rem, 1rem + 5.2vw, 4.25rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 600;
  color: var(--hw-text);
}

.rw-hero-lede {
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--hw-text-2);
  max-width: 62ch;
}

.rw-hero-actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }

.rw-hero-stage {
  min-height: 300px;
  border-radius: var(--hw-radius-md);
  /* A fill one tone off the page, not an outline: six outlined boxes on one screen
     reads as a wireframe. */
  background: var(--hw-surface-2);
  padding: 16px 18px 14px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.rw-hero-stage-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
  color: var(--hw-text-2);
  margin-bottom: 6px;
}

.rw-hero-stage-count { font-variant-numeric: tabular-nums; }

.rw-hero-stage-empty { padding: 28px 4px; color: var(--hw-text-3); font-size: 14px; line-height: 1.6; }
.rw-hero-stage-empty p { margin: 0; max-width: 40ch; }

.rw-hero-stage .rw-dna { flex: 1; min-height: 0; }
.rw-hero-stage .rw-dna-canvas { flex: 1; min-height: 200px; }

.rw-hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: var(--hw-radius-sm);
  background: var(--hw-bg);
}

.rw-hero-metrics > div { display: flex; flex-direction: column; gap: 2px; }
.rw-hero-metrics dt { font-size: 12px; color: var(--hw-text-3); }
.rw-hero-metrics dd { margin: 0; font-size: 20px; font-variant-numeric: tabular-nums; color: var(--hw-text); line-height: 1.1; }
.rw-hero-metrics dd.is-bad { color: var(--hw-bad); }

/* ---------------------------------------------------------------- sections */

.rw-home-section { display: flex; flex-direction: column; gap: 12px; }

.rw-home-section-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }

.rw-home-section-head h2 { margin: 0; font-size: 17px; font-weight: 600; color: var(--hw-text); }

.rw-home-count { font-size: 14px; color: var(--hw-text-3); font-variant-numeric: tabular-nums; }

.rw-home-note { margin: 0; font-size: 15px; line-height: 1.6; color: var(--hw-text-3); max-width: 62ch; }

.rw-home-error { margin: 0; font-size: 14px; color: var(--hw-bad); }

/* ---------------------------------------------------------------- capabilities
   A single-column sequence, each row a 5/7 split with the statement on one side and the
   real fragment on the other, alternating so the column never becomes a zigzag. */

.rw-capabilities { display: flex; flex-direction: column; gap: 22px; }

.rw-cap {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 26px;
  align-items: center;
}

.rw-cap--flip .rw-cap-copy { order: 2; }
.rw-cap--flip .rw-cap-shot { order: 1; }

.rw-cap-copy h3 {
  margin: 0 0 8px;
  font-size: 19px;
  line-height: 1.3;
  font-weight: 600;
  color: var(--hw-text);
  letter-spacing: -0.01em;
}

.rw-cap-copy p { margin: 0; font-size: 15px; line-height: 1.65; color: var(--hw-text-2); max-width: 34ch; }

.rw-cap-shot { margin: 0; min-width: 0; }

.rw-cap-shot img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--hw-radius-md);
  background: var(--hw-surface-2);
}

/* ---------------------------------------------------------------- cards */

.rw-home-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.rw-home-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
  border: 0;
  border-radius: var(--hw-radius-md);
  background: var(--hw-surface-2);
  color: inherit;
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.rw-home-card-top { display: flex; justify-content: space-between; align-items: center; }

.rw-home-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--hw-radius-pill);
  background: var(--hw-accent-soft);
  color: var(--hw-accent);
}

.rw-home-card-arrow { color: var(--hw-text-3); font-size: 14px; }
.rw-home-card-title { font-size: 15px; font-weight: 600; color: var(--hw-text); }
.rw-home-card-desc { font-size: 14px; line-height: 1.55; color: var(--hw-text-3); flex: 1; }
.rw-home-card-foot { display: flex; gap: 6px; flex-wrap: wrap; }

.rw-home-pill {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--hw-radius-pill);
  background: var(--hw-bg);
  color: var(--hw-text-3);
}

.rw-home-pill--ok { background: var(--hw-ok-soft); color: var(--hw-ok); }

/* ---------------------------------------------------------------- runs */

.rw-home-runs { display: flex; flex-direction: column; gap: 8px; }

.rw-home-run {
  display: grid;
  grid-template-columns: 14px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 0;
  border-radius: var(--hw-radius-sm);
  background: var(--hw-surface-2);
  color: inherit;
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.rw-home-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--hw-text-3); }
.rw-home-dot--ok { background: var(--hw-ok); }
.rw-home-dot--bad { background: var(--hw-bad); }
.rw-home-dot--busy { background: var(--hw-busy); }

.rw-home-run-main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.rw-home-run-title { font-size: 14px; font-weight: 500; color: var(--hw-text); }
.rw-home-run-meta { font-size: 13px; color: var(--hw-text-3); max-width: 54ch; }
.rw-home-run-time { font-size: 13px; color: var(--hw-text-3); font-variant-numeric: tabular-nums; }

.rw-home-empty {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: var(--hw-radius-md);
  background: var(--hw-surface-2);
  color: var(--hw-text-3);
  font-size: 15px;
  line-height: 1.6;
}

.rw-home-empty p { margin: 0; max-width: 52ch; }

/* ---------------------------------------------------------------- buttons */

.rw-home-primary,
.rw-home-secondary {
  font: inherit;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: var(--hw-radius-pill);
  cursor: pointer;
  border: 0;
}

.rw-home-primary { background: var(--hw-accent); color: #ffffff; font-weight: 500; }
.rw-home-secondary { background: var(--hw-surface-2); color: var(--hw-text); }

.rw-home-link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  font-size: 14px;
  color: var(--hw-accent);
  cursor: pointer;
}

.rw-home-cwd {
  margin: 14px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--hw-text-3);
}

.rw-home-cwd code { font-family: ui-monospace; font-size: 12px; }

/* ---------------------------------------------------------------- narrow panels */

@media (max-width: 900px) {
  .rw-hero { grid-template-columns: minmax(0, 1fr); gap: 20px; padding-bottom: 18px; }
  .rw-hero-copy { justify-content: flex-start; }
}

@media (max-width: 760px) {
  .rw-cap { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .rw-cap--flip .rw-cap-copy { order: 0; }
  .rw-cap--flip .rw-cap-shot { order: 0; }
  .rw-cap-copy p { max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .rw-hero * { transition: none !important; }
}

/* Toasts and skeletons. One action per toast: a row of buttons is a dialog in disguise. */

.rw-toasts {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 40;
}

.rw-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #0f1115;
  color: #ffffff;
  font-size: 13px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .18);
}

.rw-toast--error { background: #c0392b; }

.rw-toast button {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.rw-skeleton {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #eef0f3 25%, #f6f7f9 37%, #eef0f3 63%);
  background-size: 400% 100%;
  animation: rw-shimmer 1.4s ease infinite;
}

@keyframes rw-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* Loading must not animate for a reader who asked it not to. */
@media (prefers-reduced-motion: reduce) {
  .rw-skeleton { animation: none; background: #eef0f3; }
}

/* Glowing Effect \u2014 same geometry as the registry component, no Tailwind.
   The mask trick is what makes a conic gradient read as a border: two mask layers, one
   for the padding box and one for the border box, intersected, so only the ring between
   them keeps paint. */

.rw-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 1;
  transition: opacity .3s ease;
  will-change: opacity;
  z-index: 2;
}

.rw-glow-inner {
  border-radius: inherit;
  position: relative;
  height: 100%;
  width: 100%;
}

.rw-glow-inner::after {
  content: "";
  border-radius: inherit;
  position: absolute;
  inset: calc(-1 * var(--glowingeffect-border-width));
  border: var(--glowingeffect-border-width) solid transparent;
  background: var(--gradient);
  background-attachment: fixed;
  opacity: var(--active);
  filter: saturate(1.25) brightness(1.02);
  transition: opacity .35s ease;
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  mask-image:
    linear-gradient(#0000, #0000),
    conic-gradient(from calc((var(--start) - var(--spread)) * 1deg), #00000000 0deg, #fff, #00000000 calc(var(--spread) * 2deg));
  -webkit-mask-clip: padding-box, border-box;
  -webkit-mask-composite: source-in;
  -webkit-mask-image:
    linear-gradient(#0000, #0000),
    conic-gradient(from calc((var(--start) - var(--spread)) * 1deg), #00000000 0deg, #fff, #00000000 calc(var(--spread) * 2deg));
}

.rw-glow-inner--on { opacity: 1; }

/* A glow that chases the pointer is precisely what reduced-motion asks to be spared. */
@media (prefers-reduced-motion: reduce) {
  .rw-glow-inner::after { transition: none; opacity: 0; }
}

/* ---------------------------------------------------------------- DNA helix */

.rw-dna {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  --dna-ink: var(--hw-text);
  --dna-faint: var(--hw-border-strong);
  --dna-accent: var(--hw-accent);
}

.rw-dna-canvas { width: 100%; display: block; cursor: crosshair; }

.rw-dna-caption {
  min-height: 20px;
  font-size: 13px;
  color: var(--hw-text-3);
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.rw-dna-caption code {
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--hw-surface-2);
  color: var(--hw-text-2);
}

.rw-dna-hint { font-variant-numeric: tabular-nums; }
`;

// site/effects.js
var DEFAULTS = {
  spacing: 26,
  radius: 1.6,
  baseColour: [0, 0, 0],
  baseAlpha: 0.1,
  highlightColour: [47, 95, 208],
  highlightAlpha: 0.95,
  influenceRadius: 150,
  fadeFrom: 0.45,
  fadeTo: 1
};
function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function createDotField(canvas2, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const context = canvas2.getContext("2d", { alpha: true });
  if (!context) return { destroy() {
  } };
  const pointer = { x: -9999, y: -9999, active: false };
  const trail = /* @__PURE__ */ new Map();
  let frame = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let reduced = false;
  const media = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : void 0;
  const applyReduced = () => {
    reduced = media?.matches === true;
  };
  applyReduced();
  media?.addEventListener?.("change", applyReduced);
  function resize() {
    const rect = canvas2.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas2.width = Math.round(width * dpr);
    canvas2.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function key(x, y) {
    return Math.round(x / config.spacing) + ":" + Math.round(y / config.spacing);
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    for (const [id, value] of trail) {
      const next = value * 0.92;
      if (next < 0.01) trail.delete(id);
      else trail.set(id, next);
    }
    const cols = Math.ceil(width / config.spacing) + 1;
    const rows = Math.ceil(height / config.spacing) + 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * config.spacing + config.spacing / 2;
        const y = row * config.spacing + config.spacing / 2;
        const distance = pointer.active ? Math.hypot(x - pointer.x, y - pointer.y) : Number.POSITIVE_INFINITY;
        const proximity = 1 - smoothstep(0, config.influenceRadius, distance);
        const accumulated = trail.get(key(x, y)) ?? 0;
        const influence = Math.max(proximity, accumulated);
        const verticalFade = 1 - smoothstep(config.fadeFrom, config.fadeTo, y / Math.max(1, height));
        const alpha = config.baseAlpha * verticalFade + config.highlightAlpha * influence * verticalFade;
        if (alpha <= 5e-3) continue;
        const r = config.radius * (1 + influence * 1.8);
        const [br, bg, bb] = config.baseColour;
        const [hr, hg, hb] = config.highlightColour;
        const mix = Math.min(1, influence);
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fillStyle = "rgba(" + [
          Math.round(br + (hr - br) * mix),
          Math.round(bg + (hg - bg) * mix),
          Math.round(bb + (hb - bb) * mix)
        ].join(",") + "," + alpha.toFixed(3) + ")";
        context.fill();
      }
    }
  }
  function loop() {
    draw();
    frame = requestAnimationFrame(loop);
  }
  function onPointerMove(event) {
    const rect = canvas2.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
    trail.set(key(pointer.x, pointer.y), 1);
  }
  function onPointerLeave() {
    pointer.active = false;
  }
  function onResize() {
    resize();
    draw();
  }
  resize();
  if (reduced) {
    draw();
  } else {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    frame = requestAnimationFrame(loop);
  }
  return {
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      media?.removeEventListener?.("change", applyReduced);
    }
  };
}
function countOnView(element, { duration = 900, format = (value) => String(value) } = {}) {
  const target = Number(element.dataset.count ?? element.textContent ?? 0);
  if (!Number.isFinite(target)) return () => {
  };
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  if (reduced) {
    element.textContent = format(target);
    return () => {
    };
  }
  let frame = 0;
  let startedAt = 0;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.disconnect();
      startedAt = performance.now();
      const step2 = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = format(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(step2);
      };
      frame = requestAnimationFrame(step2);
    }
  }, { threshold: 0.4 });
  observer.observe(element);
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
}

// site/parallax.js
var SUPPORTS_NATIVE = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()") === true;
function createParallax(layers, { enabled = true } = {}) {
  if (!enabled || !layers.length) return { destroy() {
  } };
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  if (reduced) return { destroy() {
  } };
  if (SUPPORTS_NATIVE) {
    for (const { element, speed } of layers) {
      element.style.setProperty("--parallax-speed", String(speed));
      element.classList.add("is-parallax-native");
    }
    return { destroy() {
      for (const { element } of layers) element.classList.remove("is-parallax-native");
    } };
  }
  let frame = 0;
  let queued = false;
  const apply = () => {
    queued = false;
    const viewportHeight = window.innerHeight;
    for (const { element, speed } of layers) {
      const rect = element.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = -progress * speed * 60;
      element.style.transform = "translate3d(0," + offset.toFixed(2) + "px,0)";
    }
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    frame = requestAnimationFrame(apply);
  };
  apply();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return {
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
}

// site/site.js
var style = document.createElement("style");
style.textContent = styles_default;
document.head.appendChild(style);
var api = createDemoApi();
var canvas = document.getElementById("dot-field");
if (canvas) createDotField(canvas, { spacing: 28, radius: 1.5, influenceRadius: 170 });
createParallax([
  { element: document.querySelector(".hero .lede"), speed: 0.35 },
  { element: document.querySelector(".stage"), speed: -0.18 },
  ...[...document.querySelectorAll("section.block")].map((element, index) => ({
    element,
    speed: index % 2 === 0 ? 0.12 : -0.1
  }))
]);
for (const element of document.querySelectorAll("[data-count]")) countOnView(element);
(0, import_client.createRoot)(document.getElementById("app")).render(
  import_react6.default.createElement(WorkbenchHome, {
    api,
    cwd: "E:/projects/yeast-cell-cycle",
    onOpenWorkflow: () => {
      document.getElementById("workflow").scrollIntoView({ behavior: "smooth" });
    },
    onPickTemplate: () => {
      document.getElementById("workflow").scrollIntoView({ behavior: "smooth" });
    },
    onRefreshFiles: () => {
      document.getElementById("workflow").scrollIntoView({ behavior: "smooth" });
    }
  })
);
(0, import_client.createRoot)(document.getElementById("workflow-app")).render(
  import_react6.default.createElement(WorkflowPanel, { api, initialRunId: "2026-11-02T08-57-14-252Z-biomni-toolkit" })
);
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
