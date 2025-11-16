import { j as jsxRuntimeExports, r as reactExports, R as React, 
  a as requireReact, b as requireReactDom, 
  c as createLucideIcon, A as ArrowLeft, 
  S as Search$1, X, d as cn, e as RotateCw, 
  f as ReactDOM } 
  from "./styles-DdAdgHfX.js";
const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: []
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  const sorted = Array.from(relatedVals).sort((a2, b) => {
    if (a2 instanceof Derived && a2.options.deps.includes(b)) return 1;
    if (b instanceof Derived && b.options.deps.includes(a2)) return -1;
    return 0;
  });
  for (const derived of sorted) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!relatedLinkedDerivedVals) continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  const value2 = {
    prevVal: store.prevState,
    currentVal: store.state
  };
  for (const listener of store.listeners) {
    listener(value2);
  }
}
function __notifyDerivedListeners(derived) {
  const value2 = {
    prevVal: derived.prevState,
    currentVal: derived.state
  };
  for (const listener of derived.listeners) {
    listener(value2);
  }
}
function __flush(store) {
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch(fn) {
  __batchDepth++;
  try {
    fn();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = __pendingUpdates.values().next().value;
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}
function isUpdaterFunction(updater) {
  return typeof updater === "function";
}
class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a2, _b2;
      this.listeners.add(listener);
      const unsub = (_b2 = (_a2 = this.options) == null ? void 0 : _a2.onSubscribe) == null ? void 0 : _b2.call(_a2, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
  setState(updater) {
    var _a2, _b2, _c2;
    this.prevState = this.state;
    if ((_a2 = this.options) == null ? void 0 : _a2.updateFn) {
      this.state = this.options.updateFn(this.prevState)(updater);
    } else {
      if (isUpdaterFunction(updater)) {
        this.state = updater(this.prevState);
      } else {
        this.state = updater;
      }
    }
    (_c2 = (_b2 = this.options) == null ? void 0 : _b2.onUpdate) == null ? void 0 : _c2.call(_b2);
    __flush(this);
  }
}
class Derived {
  constructor(options) {
    this.listeners = /* @__PURE__ */ new Set();
    this._subscriptions = [];
    this.lastSeenDepValues = [];
    this.getDepVals = () => {
      const l2 = this.options.deps.length;
      const prevDepVals = new Array(l2);
      const currDepVals = new Array(l2);
      for (let i2 = 0; i2 < l2; i2++) {
        const dep = this.options.deps[i2];
        prevDepVals[i2] = dep.prevState;
        currDepVals[i2] = dep.state;
      }
      this.lastSeenDepValues = currDepVals;
      return {
        prevDepVals,
        currDepVals,
        prevVal: this.prevState ?? void 0
      };
    };
    this.recompute = () => {
      var _a2, _b2;
      this.prevState = this.state;
      const depVals = this.getDepVals();
      this.state = this.options.fn(depVals);
      (_b2 = (_a2 = this.options).onUpdate) == null ? void 0 : _b2.call(_a2);
    };
    this.checkIfRecalculationNeededDeeply = () => {
      for (const dep of this.options.deps) {
        if (dep instanceof Derived) {
          dep.checkIfRecalculationNeededDeeply();
        }
      }
      let shouldRecompute = false;
      const lastSeenDepValues = this.lastSeenDepValues;
      const { currDepVals } = this.getDepVals();
      for (let i2 = 0; i2 < currDepVals.length; i2++) {
        if (currDepVals[i2] !== lastSeenDepValues[i2]) {
          shouldRecompute = true;
          break;
        }
      }
      if (shouldRecompute) {
        this.recompute();
      }
    };
    this.mount = () => {
      this.registerOnGraph();
      this.checkIfRecalculationNeededDeeply();
      return () => {
        this.unregisterFromGraph();
        for (const cleanup of this._subscriptions) {
          cleanup();
        }
      };
    };
    this.subscribe = (listener) => {
      var _a2, _b2;
      this.listeners.add(listener);
      const unsub = (_b2 = (_a2 = this.options).onSubscribe) == null ? void 0 : _b2.call(_a2, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.options = options;
    this.state = options.fn({
      prevDepVals: void 0,
      prevVal: void 0,
      currDepVals: this.getDepVals().currDepVals
    });
  }
  registerOnGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        dep.registerOnGraph();
        this.registerOnGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        let relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (!relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
          __storeToDerived.set(dep, relatedLinkedDerivedVals);
        }
        relatedLinkedDerivedVals.add(this);
        let relatedStores = __derivedToStore.get(this);
        if (!relatedStores) {
          relatedStores = /* @__PURE__ */ new Set();
          __derivedToStore.set(this, relatedStores);
        }
        relatedStores.add(dep);
      }
    }
  }
  unregisterFromGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        this.unregisterFromGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        const relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals.delete(this);
        }
        const relatedStores = __derivedToStore.get(this);
        if (relatedStores) {
          relatedStores.delete(dep);
        }
      }
    }
  }
}
const stateIndexKey = "__TSR_index";
const popStateEvent = "popstate";
const beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    const ignoreBlocker = navigateOpts?.ignoreBlocker ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = opts.getBlockers?.() ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          opts.onBlocked?.();
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      if (!opts.setBlockers) return () => {
      };
      const blockers = opts.getBlockers?.() ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        const blockers2 = opts.getBlockers?.() ?? [];
        opts.setBlockers?.(blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => opts.flush?.(),
    destroy: () => opts.destroy?.(),
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index
  };
}
function createBrowserHistory(opts) {
  const win = typeof document !== "undefined" ? window : void 0;
  const originalPushState = win.history.pushState;
  const originalReplaceState = win.history.replaceState;
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => blockers = newBlockers;
  const createHref = ((path) => path);
  const parseLocation = (() => parseHref(
    `${win.location.pathname}${win.location.search}${win.location.hash}`,
    win.history.state
  ));
  if (!win.history.state?.__TSR_key && !win.history.state?.key) {
    const addedKey = createRandomKey();
    win.history.replaceState(
      {
        [stateIndexKey]: 0,
        key: addedKey,
        // TODO: Remove in v2 - use __TSR_key instead
        __TSR_key: addedKey
      },
      ""
    );
  }
  let currentLocation = parseLocation();
  let rollbackLocation;
  let nextPopIsGo = false;
  let ignoreNextPop = false;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;
  const getLocation = () => currentLocation;
  let next2;
  let scheduled;
  const flush = () => {
    if (!next2) {
      return;
    }
    history._ignoreSubscribers = true;
    (next2.isPush ? win.history.pushState : win.history.replaceState)(
      next2.state,
      "",
      next2.href
    );
    history._ignoreSubscribers = false;
    next2 = void 0;
    scheduled = void 0;
    rollbackLocation = void 0;
  };
  const queueHistoryAction = (type2, destHref, state) => {
    const href = createHref(destHref);
    if (!scheduled) {
      rollbackLocation = currentLocation;
    }
    currentLocation = parseHref(destHref, state);
    next2 = {
      href,
      state,
      isPush: next2?.isPush || type2 === "push"
    };
    if (!scheduled) {
      scheduled = Promise.resolve().then(() => flush());
    }
  };
  const onPushPop = (type2) => {
    currentLocation = parseLocation();
    history.notify({ type: type2 });
  };
  const onPushPopEvent = async () => {
    if (ignoreNextPop) {
      ignoreNextPop = false;
      return;
    }
    const nextLocation = parseLocation();
    const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
    const isForward = delta === 1;
    const isBack = delta === -1;
    const isGo = !isForward && !isBack || nextPopIsGo;
    nextPopIsGo = false;
    const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
    const notify = isGo ? {
      type: "GO",
      index: delta
    } : {
      type: isBack ? "BACK" : "FORWARD"
    };
    if (skipBlockerNextPop) {
      skipBlockerNextPop = false;
    } else {
      const blockers2 = _getBlockers();
      if (typeof document !== "undefined" && blockers2.length) {
        for (const blocker of blockers2) {
          const isBlocked = await blocker.blockerFn({
            currentLocation,
            nextLocation,
            action
          });
          if (isBlocked) {
            ignoreNextPop = true;
            win.history.go(1);
            history.notify(notify);
            return;
          }
        }
      }
    }
    currentLocation = parseLocation();
    history.notify(notify);
  };
  const onBeforeUnload = (e) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }
    let shouldBlock = false;
    const blockers2 = _getBlockers();
    if (typeof document !== "undefined" && blockers2.length) {
      for (const blocker of blockers2) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }
        if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }
    if (shouldBlock) {
      e.preventDefault();
      return e.returnValue = "";
    }
    return;
  };
  const history = createHistory({
    getLocation,
    getLength: () => win.history.length,
    pushState: (href, state) => queueHistoryAction("push", href, state),
    replaceState: (href, state) => queueHistoryAction("replace", href, state),
    back: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      return win.history.back();
    },
    forward: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      win.history.forward();
    },
    go: (n) => {
      nextPopIsGo = true;
      win.history.go(n);
    },
    createHref: (href) => createHref(href),
    flush,
    destroy: () => {
      win.history.pushState = originalPushState;
      win.history.replaceState = originalReplaceState;
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true
      });
      win.removeEventListener(popStateEvent, onPushPopEvent);
    },
    onBlocked: () => {
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
    notifyOnIndexChange: false
  });
  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
  win.addEventListener(popStateEvent, onPushPopEvent);
  win.history.pushState = function(...args) {
    const res = originalPushState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("PUSH");
    return res;
  };
  win.history.replaceState = function(...args) {
    const res = originalReplaceState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("REPLACE");
    return res;
  };
  return history;
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function last(arr) {
  return arr[arr.length - 1];
}
function isFunction(d2) {
  return typeof d2 === "function";
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
const hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(prev, _next) {
  if (prev === _next) {
    return prev;
  }
  const next2 = _next;
  const array = isPlainArray(prev) && isPlainArray(next2);
  if (!array && !(isPlainObject(prev) && isPlainObject(next2))) return next2;
  const prevItems = array ? prev : getEnumerableOwnKeys(prev);
  if (!prevItems) return next2;
  const nextItems = array ? next2 : getEnumerableOwnKeys(next2);
  if (!nextItems) return next2;
  const prevSize = prevItems.length;
  const nextSize = nextItems.length;
  const copy = array ? new Array(nextSize) : {};
  let equalItems = 0;
  for (let i2 = 0; i2 < nextSize; i2++) {
    const key = array ? i2 : nextItems[i2];
    const p2 = prev[key];
    const n = next2[key];
    if (p2 === n) {
      copy[key] = p2;
      if (array ? i2 < prevSize : hasOwn.call(prev, key)) equalItems++;
      continue;
    }
    if (p2 === null || n === null || typeof p2 !== "object" || typeof n !== "object") {
      copy[key] = n;
      continue;
    }
    const v = replaceEqualDeep(p2, n);
    copy[key] = v;
    if (v === p2) equalItems++;
  }
  return prevSize === nextSize && equalItems === prevSize ? prev : copy;
}
function getEnumerableOwnKeys(o2) {
  const keys = [];
  const names = Object.getOwnPropertyNames(o2);
  for (const name of names) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, name)) return false;
    keys.push(name);
  }
  const symbols = Object.getOwnPropertySymbols(o2);
  for (const symbol of symbols) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, symbol)) return false;
    keys.push(symbol);
  }
  return keys;
}
function isPlainObject(o2) {
  if (!hasObjectPrototype(o2)) {
    return false;
  }
  const ctor = o2.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function isPlainArray(value2) {
  return Array.isArray(value2) && value2.length === Object.keys(value2).length;
}
function deepEqual(a2, b, opts) {
  if (a2 === b) {
    return true;
  }
  if (typeof a2 !== typeof b) {
    return false;
  }
  if (Array.isArray(a2) && Array.isArray(b)) {
    if (a2.length !== b.length) return false;
    for (let i2 = 0, l2 = a2.length; i2 < l2; i2++) {
      if (!deepEqual(a2[i2], b[i2], opts)) return false;
    }
    return true;
  }
  if (isPlainObject(a2) && isPlainObject(b)) {
    const ignoreUndefined = opts?.ignoreUndefined ?? true;
    if (opts?.partial) {
      for (const k in b) {
        if (!ignoreUndefined || b[k] !== void 0) {
          if (!deepEqual(a2[k], b[k], opts)) return false;
        }
      }
      return true;
    }
    let aCount = 0;
    if (!ignoreUndefined) {
      aCount = Object.keys(a2).length;
    } else {
      for (const k in a2) {
        if (a2[k] !== void 0) aCount++;
      }
    }
    let bCount = 0;
    for (const k in b) {
      if (!ignoreUndefined || b[k] !== void 0) {
        bCount++;
        if (bCount > aCount || !deepEqual(a2[k], b[k], opts)) return false;
      }
    }
    return aCount === bCount;
  }
  return false;
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value2) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value2;
    resolveLoadPromise(value2);
    onResolve?.(value2);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function isPromise(value2) {
  return Boolean(
    value2 && typeof value2 === "object" && typeof value2.then === "function"
  );
}
var prefix = "Invariant failed";
function invariant$1(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
const rootRouteId = "__root__";
const SEGMENT_TYPE_PATHNAME = 0;
const SEGMENT_TYPE_PARAM = 1;
const SEGMENT_TYPE_WILDCARD = 2;
const SEGMENT_TYPE_OPTIONAL_PARAM = 3;
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value2, basepath) {
  if (value2?.endsWith("/") && value2 !== "/" && value2 !== `${basepath}/`) {
    return value2.slice(0, -1);
  }
  return value2;
}
function exactPathTest(pathName1, pathName2, basepath) {
  return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function segmentToString(segment) {
  const { type: type2, value: value2 } = segment;
  if (type2 === SEGMENT_TYPE_PATHNAME) {
    return value2;
  }
  const { prefixSegment, suffixSegment } = segment;
  if (type2 === SEGMENT_TYPE_PARAM) {
    const param = value2.substring(1);
    if (prefixSegment && suffixSegment) {
      return `${prefixSegment}{$${param}}${suffixSegment}`;
    } else if (prefixSegment) {
      return `${prefixSegment}{$${param}}`;
    } else if (suffixSegment) {
      return `{$${param}}${suffixSegment}`;
    }
  }
  if (type2 === SEGMENT_TYPE_OPTIONAL_PARAM) {
    const param = value2.substring(1);
    if (prefixSegment && suffixSegment) {
      return `${prefixSegment}{-$${param}}${suffixSegment}`;
    } else if (prefixSegment) {
      return `${prefixSegment}{-$${param}}`;
    } else if (suffixSegment) {
      return `{-$${param}}${suffixSegment}`;
    }
    return `{-$${param}}`;
  }
  if (type2 === SEGMENT_TYPE_WILDCARD) {
    if (prefixSegment && suffixSegment) {
      return `${prefixSegment}{$}${suffixSegment}`;
    } else if (prefixSegment) {
      return `${prefixSegment}{$}`;
    } else if (suffixSegment) {
      return `{$}${suffixSegment}`;
    }
  }
  return value2;
}
function resolvePath({
  base,
  to,
  trailingSlash = "never",
  parseCache: parseCache2
}) {
  let baseSegments = parseBasePathSegments(base, parseCache2).slice();
  const toSegments = parseRoutePathSegments(to, parseCache2);
  if (baseSegments.length > 1 && last(baseSegments)?.value === "/") {
    baseSegments.pop();
  }
  for (let index = 0, length = toSegments.length; index < length; index++) {
    const toSegment = toSegments[index];
    const value2 = toSegment.value;
    if (value2 === "/") {
      if (!index) {
        baseSegments = [toSegment];
      } else if (index === length - 1) {
        baseSegments.push(toSegment);
      } else ;
    } else if (value2 === "..") {
      baseSegments.pop();
    } else if (value2 === ".") ;
    else {
      baseSegments.push(toSegment);
    }
  }
  if (baseSegments.length > 1) {
    if (last(baseSegments).value === "/") {
      if (trailingSlash === "never") {
        baseSegments.pop();
      }
    } else if (trailingSlash === "always") {
      baseSegments.push({ type: SEGMENT_TYPE_PATHNAME, value: "/" });
    }
  }
  const segmentValues = baseSegments.map(segmentToString);
  const joined = joinPaths(segmentValues);
  return joined;
}
const parseBasePathSegments = (pathname, cache) => parsePathname(pathname, cache, true);
const parseRoutePathSegments = (pathname, cache) => parsePathname(pathname, cache, false);
const parsePathname = (pathname, cache, basePathValues) => {
  if (!pathname) return [];
  const cached2 = cache?.get(pathname);
  if (cached2) return cached2;
  const parsed2 = baseParsePathname(pathname, basePathValues);
  cache?.set(pathname, parsed2);
  return parsed2;
};
const PARAM_RE = /^\$.{1,}$/;
const PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const WILDCARD_RE = /^\$$/;
const WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function baseParsePathname(pathname, basePathValues) {
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      const partToMatch = !basePathValues && part !== rootRouteId && part.slice(-1) === "_" ? part.slice(0, -1) : part;
      const wildcardBracesMatch = partToMatch.match(WILDCARD_W_CURLY_BRACES_RE);
      if (wildcardBracesMatch) {
        const prefix2 = wildcardBracesMatch[1];
        const suffix2 = wildcardBracesMatch[2];
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix2 || void 0
        };
      }
      const optionalParamBracesMatch = partToMatch.match(
        OPTIONAL_PARAM_W_CURLY_BRACES_RE
      );
      if (optionalParamBracesMatch) {
        const prefix2 = optionalParamBracesMatch[1];
        const paramName = optionalParamBracesMatch[2];
        const suffix2 = optionalParamBracesMatch[3];
        return {
          type: SEGMENT_TYPE_OPTIONAL_PARAM,
          value: paramName,
          // Now just $paramName (no prefix)
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix2 || void 0
        };
      }
      const paramBracesMatch = partToMatch.match(PARAM_W_CURLY_BRACES_RE);
      if (paramBracesMatch) {
        const prefix2 = paramBracesMatch[1];
        const paramName = paramBracesMatch[2];
        const suffix2 = paramBracesMatch[3];
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "" + paramName,
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix2 || void 0
        };
      }
      if (PARAM_RE.test(partToMatch)) {
        const paramName = partToMatch.substring(1);
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "$" + paramName,
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      if (WILDCARD_RE.test(partToMatch)) {
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      return {
        type: SEGMENT_TYPE_PATHNAME,
        value: partToMatch.includes("%25") ? partToMatch.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(partToMatch)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  return segments;
}
function interpolatePath({
  path,
  params,
  leaveWildcards,
  leaveParams,
  decodeCharMap,
  parseCache: parseCache2
}) {
  const interpolatedPathSegments = parseRoutePathSegments(path, parseCache2);
  function encodeParam(key) {
    const value2 = params[key];
    const isValueString = typeof value2 === "string";
    if (key === "*" || key === "_splat") {
      return isValueString ? encodeURI(value2) : value2;
    } else {
      return isValueString ? encodePathParam(value2, decodeCharMap) : value2;
    }
  }
  let isMissingParams = false;
  const usedParams = {};
  const interpolatedPath = joinPaths(
    interpolatedPathSegments.map((segment) => {
      if (segment.type === SEGMENT_TYPE_PATHNAME) {
        return segment.value;
      }
      if (segment.type === SEGMENT_TYPE_WILDCARD) {
        usedParams._splat = params._splat;
        usedParams["*"] = params._splat;
        const segmentPrefix = segment.prefixSegment || "";
        const segmentSuffix = segment.suffixSegment || "";
        if (!("_splat" in params)) {
          isMissingParams = true;
          if (leaveWildcards) {
            return `${segmentPrefix}${segment.value}${segmentSuffix}`;
          }
          if (segmentPrefix || segmentSuffix) {
            return `${segmentPrefix}${segmentSuffix}`;
          }
          return void 0;
        }
        const value2 = encodeParam("_splat");
        if (leaveWildcards) {
          return `${segmentPrefix}${segment.value}${value2 ?? ""}${segmentSuffix}`;
        }
        return `${segmentPrefix}${value2}${segmentSuffix}`;
      }
      if (segment.type === SEGMENT_TYPE_PARAM) {
        const key = segment.value.substring(1);
        if (!isMissingParams && !(key in params)) {
          isMissingParams = true;
        }
        usedParams[key] = params[key];
        const segmentPrefix = segment.prefixSegment || "";
        const segmentSuffix = segment.suffixSegment || "";
        if (leaveParams) {
          const value2 = encodeParam(segment.value);
          return `${segmentPrefix}${segment.value}${value2 ?? ""}${segmentSuffix}`;
        }
        return `${segmentPrefix}${encodeParam(key) ?? "undefined"}${segmentSuffix}`;
      }
      if (segment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        const key = segment.value.substring(1);
        const segmentPrefix = segment.prefixSegment || "";
        const segmentSuffix = segment.suffixSegment || "";
        if (!(key in params) || params[key] == null) {
          if (leaveWildcards) {
            return `${segmentPrefix}${key}${segmentSuffix}`;
          }
          if (segmentPrefix || segmentSuffix) {
            return `${segmentPrefix}${segmentSuffix}`;
          }
          return void 0;
        }
        usedParams[key] = params[key];
        if (leaveParams) {
          const value2 = encodeParam(segment.value);
          return `${segmentPrefix}${segment.value}${value2 ?? ""}${segmentSuffix}`;
        }
        if (leaveWildcards) {
          return `${segmentPrefix}${key}${encodeParam(key) ?? ""}${segmentSuffix}`;
        }
        return `${segmentPrefix}${encodeParam(key) ?? ""}${segmentSuffix}`;
      }
      return segment.value;
    })
  );
  return { usedParams, interpolatedPath, isMissingParams };
}
function encodePathParam(value2, decodeCharMap) {
  let encoded = encodeURIComponent(value2);
  if (decodeCharMap) {
    for (const [encodedChar, char] of decodeCharMap) {
      encoded = encoded.replaceAll(encodedChar, char);
    }
  }
  return encoded;
}
function matchPathname(currentPathname, matchLocation, parseCache2) {
  const pathParams = matchByPath(currentPathname, matchLocation, parseCache2);
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function matchByPath(from, {
  to,
  fuzzy,
  caseSensitive
}, parseCache2) {
  const stringTo = to;
  const baseSegments = parseBasePathSegments(
    from.startsWith("/") ? from : `/${from}`,
    parseCache2
  );
  const routeSegments = parseRoutePathSegments(
    stringTo.startsWith("/") ? stringTo : `/${stringTo}`,
    parseCache2
  );
  const params = {};
  const result = isMatch(
    baseSegments,
    routeSegments,
    params,
    fuzzy,
    caseSensitive
  );
  return result ? params : void 0;
}
function isMatch(baseSegments, routeSegments, params, fuzzy, caseSensitive) {
  let baseIndex = 0;
  let routeIndex = 0;
  while (baseIndex < baseSegments.length || routeIndex < routeSegments.length) {
    const baseSegment = baseSegments[baseIndex];
    const routeSegment = routeSegments[routeIndex];
    if (routeSegment) {
      if (routeSegment.type === SEGMENT_TYPE_WILDCARD) {
        const remainingBaseSegments = baseSegments.slice(baseIndex);
        let _splat;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          if (!baseSegment) return false;
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix2 = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ("prefixSegment" in routeSegment) {
            if (!baseValue.startsWith(prefix2)) {
              return false;
            }
          }
          if ("suffixSegment" in routeSegment) {
            if (!baseSegments[baseSegments.length - 1]?.value.endsWith(suffix2)) {
              return false;
            }
          }
          let rejoinedSplat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
          if (prefix2 && rejoinedSplat.startsWith(prefix2)) {
            rejoinedSplat = rejoinedSplat.slice(prefix2.length);
          }
          if (suffix2 && rejoinedSplat.endsWith(suffix2)) {
            rejoinedSplat = rejoinedSplat.slice(
              0,
              rejoinedSplat.length - suffix2.length
            );
          }
          _splat = rejoinedSplat;
        } else {
          _splat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
        }
        params["*"] = _splat;
        params["_splat"] = _splat;
        return true;
      }
      if (routeSegment.type === SEGMENT_TYPE_PATHNAME) {
        if (routeSegment.value === "/" && !baseSegment?.value) {
          routeIndex++;
          continue;
        }
        if (baseSegment) {
          if (caseSensitive) {
            if (routeSegment.value !== baseSegment.value) {
              return false;
            }
          } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
            return false;
          }
          baseIndex++;
          routeIndex++;
          continue;
        } else {
          return false;
        }
      }
      if (routeSegment.type === SEGMENT_TYPE_PARAM) {
        if (!baseSegment) {
          return false;
        }
        if (baseSegment.value === "/") {
          return false;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix2 = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if (prefix2 && !baseValue.startsWith(prefix2)) {
            return false;
          }
          if (suffix2 && !baseValue.endsWith(suffix2)) {
            return false;
          }
          let paramValue = baseValue;
          if (prefix2 && paramValue.startsWith(prefix2)) {
            paramValue = paramValue.slice(prefix2.length);
          }
          if (suffix2 && paramValue.endsWith(suffix2)) {
            paramValue = paramValue.slice(0, paramValue.length - suffix2.length);
          }
          _paramValue = decodeURIComponent(paramValue);
          matched = true;
        } else {
          _paramValue = decodeURIComponent(baseSegment.value);
          matched = true;
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
      if (routeSegment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        if (!baseSegment) {
          routeIndex++;
          continue;
        }
        if (baseSegment.value === "/") {
          routeIndex++;
          continue;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix2 = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ((!prefix2 || baseValue.startsWith(prefix2)) && (!suffix2 || baseValue.endsWith(suffix2))) {
            let paramValue = baseValue;
            if (prefix2 && paramValue.startsWith(prefix2)) {
              paramValue = paramValue.slice(prefix2.length);
            }
            if (suffix2 && paramValue.endsWith(suffix2)) {
              paramValue = paramValue.slice(
                0,
                paramValue.length - suffix2.length
              );
            }
            _paramValue = decodeURIComponent(paramValue);
            matched = true;
          }
        } else {
          let shouldMatchOptional = true;
          for (let lookAhead = routeIndex + 1; lookAhead < routeSegments.length; lookAhead++) {
            const futureRouteSegment = routeSegments[lookAhead];
            if (futureRouteSegment?.type === SEGMENT_TYPE_PATHNAME && futureRouteSegment.value === baseSegment.value) {
              shouldMatchOptional = false;
              break;
            }
            if (futureRouteSegment?.type === SEGMENT_TYPE_PARAM || futureRouteSegment?.type === SEGMENT_TYPE_WILDCARD) {
              if (baseSegments.length < routeSegments.length) {
                shouldMatchOptional = false;
              }
              break;
            }
          }
          if (shouldMatchOptional) {
            _paramValue = decodeURIComponent(baseSegment.value);
            matched = true;
          }
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
    }
    if (baseIndex < baseSegments.length && routeIndex >= routeSegments.length) {
      params["**"] = joinPaths(
        baseSegments.slice(baseIndex).map((d2) => d2.value)
      );
      return !!fuzzy && routeSegments[routeSegments.length - 1]?.value !== "/";
    }
    if (routeIndex < routeSegments.length && baseIndex >= baseSegments.length) {
      for (let i2 = routeIndex; i2 < routeSegments.length; i2++) {
        if (routeSegments[i2]?.type !== SEGMENT_TYPE_OPTIONAL_PARAM) {
          return false;
        }
      }
      break;
    }
    break;
  }
  return true;
}
const SLASH_SCORE = 0.75;
const STATIC_SEGMENT_SCORE = 1;
const REQUIRED_PARAM_BASE_SCORE = 0.5;
const OPTIONAL_PARAM_BASE_SCORE = 0.4;
const WILDCARD_PARAM_BASE_SCORE = 0.25;
const STATIC_AFTER_DYNAMIC_BONUS_SCORE = 0.2;
const BOTH_PRESENCE_BASE_SCORE = 0.05;
const PREFIX_PRESENCE_BASE_SCORE = 0.02;
const SUFFIX_PRESENCE_BASE_SCORE = 0.01;
const PREFIX_LENGTH_SCORE_MULTIPLIER = 2e-4;
const SUFFIX_LENGTH_SCORE_MULTIPLIER = 1e-4;
function handleParam(segment, baseScore) {
  if (segment.prefixSegment && segment.suffixSegment) {
    return baseScore + BOTH_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
  }
  if (segment.prefixSegment) {
    return baseScore + PREFIX_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length;
  }
  if (segment.suffixSegment) {
    return baseScore + SUFFIX_PRESENCE_BASE_SCORE + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
  }
  return baseScore;
}
function sortRoutes(routes) {
  const scoredRoutes = [];
  routes.forEach((d2, i2) => {
    if (d2.isRoot || !d2.path) {
      return;
    }
    const trimmed = trimPathLeft(d2.fullPath);
    let parsed2 = parseRoutePathSegments(trimmed);
    let skip = 0;
    while (parsed2.length > skip + 1 && parsed2[skip]?.value === "/") {
      skip++;
    }
    if (skip > 0) parsed2 = parsed2.slice(skip);
    let optionalParamCount = 0;
    let hasStaticAfter = false;
    const scores = parsed2.map((segment, index) => {
      if (segment.value === "/") {
        return SLASH_SCORE;
      }
      if (segment.type === SEGMENT_TYPE_PATHNAME) {
        return STATIC_SEGMENT_SCORE;
      }
      let baseScore = void 0;
      if (segment.type === SEGMENT_TYPE_PARAM) {
        baseScore = REQUIRED_PARAM_BASE_SCORE;
      } else if (segment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        baseScore = OPTIONAL_PARAM_BASE_SCORE;
        optionalParamCount++;
      } else {
        baseScore = WILDCARD_PARAM_BASE_SCORE;
      }
      for (let i22 = index + 1; i22 < parsed2.length; i22++) {
        const nextSegment = parsed2[i22];
        if (nextSegment.type === SEGMENT_TYPE_PATHNAME && nextSegment.value !== "/") {
          hasStaticAfter = true;
          return handleParam(
            segment,
            baseScore + STATIC_AFTER_DYNAMIC_BONUS_SCORE
          );
        }
      }
      return handleParam(segment, baseScore);
    });
    scoredRoutes.push({
      child: d2,
      trimmed,
      parsed: parsed2,
      index: i2,
      scores,
      optionalParamCount,
      hasStaticAfter
    });
  });
  const flatRoutes = scoredRoutes.sort((a2, b) => {
    const minLength = Math.min(a2.scores.length, b.scores.length);
    for (let i2 = 0; i2 < minLength; i2++) {
      if (a2.scores[i2] !== b.scores[i2]) {
        return b.scores[i2] - a2.scores[i2];
      }
    }
    if (a2.scores.length !== b.scores.length) {
      if (a2.optionalParamCount !== b.optionalParamCount) {
        if (a2.hasStaticAfter === b.hasStaticAfter) {
          return a2.optionalParamCount - b.optionalParamCount;
        } else if (a2.hasStaticAfter && !b.hasStaticAfter) {
          return -1;
        } else if (!a2.hasStaticAfter && b.hasStaticAfter) {
          return 1;
        }
      }
      return b.scores.length - a2.scores.length;
    }
    for (let i2 = 0; i2 < minLength; i2++) {
      if (a2.parsed[i2].value !== b.parsed[i2].value) {
        return a2.parsed[i2].value > b.parsed[i2].value ? 1 : -1;
      }
    }
    return a2.index - b.index;
  }).map((d2, i2) => {
    d2.child.rank = i2;
    return d2.child;
  });
  return flatRoutes;
}
function processRouteTree({
  routeTree: routeTree2,
  initRoute
}) {
  const routesById = {};
  const routesByPath = {};
  const recurseRoutes = (childRoutes) => {
    childRoutes.forEach((childRoute, i2) => {
      initRoute?.(childRoute, i2);
      const existingRoute = routesById[childRoute.id];
      invariant$1(
        !existingRoute,
        `Duplicate routes found with id: ${String(childRoute.id)}`
      );
      routesById[childRoute.id] = childRoute;
      if (!childRoute.isRoot && childRoute.path) {
        const trimmedFullPath = trimPathRight(childRoute.fullPath);
        if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
          routesByPath[trimmedFullPath] = childRoute;
        }
      }
      const children = childRoute.children;
      if (children?.length) {
        recurseRoutes(children);
      }
    });
  };
  recurseRoutes([routeTree2]);
  const flatRoutes = sortRoutes(Object.values(routesById));
  return { routesById, routesByPath, flatRoutes };
}
function isNotFound(obj) {
  return !!obj?.isNotFound;
}
function getSafeSessionStorage() {
  try {
    if (typeof window !== "undefined" && typeof window.sessionStorage === "object") {
      return window.sessionStorage;
    }
  } catch {
  }
  return void 0;
}
const storageKey = "tsr-scroll-restoration-v1_3";
const throttle = (fn, wait) => {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn(...args);
        timeout = null;
      }, wait);
    }
  };
};
function createScrollRestorationCache() {
  const safeSessionStorage = getSafeSessionStorage();
  if (!safeSessionStorage) {
    return null;
  }
  const persistedState = safeSessionStorage.getItem(storageKey);
  let state = persistedState ? JSON.parse(persistedState) : {};
  return {
    state,
    // This setter is simply to make sure that we set the sessionStorage right
    // after the state is updated. It doesn't necessarily need to be a functional
    // update.
    set: (updater) => (state = functionalUpdate(updater, state) || state, safeSessionStorage.setItem(storageKey, JSON.stringify(state)))
  };
}
const scrollRestorationCache = createScrollRestorationCache();
const defaultGetScrollRestorationKey = (location) => {
  return location.state.__TSR_key || location.href;
};
function getCssSelector(el) {
  const path = [];
  let parent;
  while (parent = el.parentNode) {
    path.push(
      `${el.tagName}:nth-child(${Array.prototype.indexOf.call(parent.children, el) + 1})`
    );
    el = parent;
  }
  return `${path.reverse().join(" > ")}`.toLowerCase();
}
let ignoreScroll = false;
function restoreScroll({
  storageKey: storageKey2,
  key,
  behavior,
  shouldScrollRestoration,
  scrollToTopSelectors,
  location
}) {
  let byKey;
  try {
    byKey = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
  } catch (error) {
    console.error(error);
    return;
  }
  const resolvedKey = key || window.history.state?.__TSR_key;
  const elementEntries = byKey[resolvedKey];
  ignoreScroll = true;
  scroll: {
    if (shouldScrollRestoration && elementEntries && Object.keys(elementEntries).length > 0) {
      for (const elementSelector in elementEntries) {
        const entry = elementEntries[elementSelector];
        if (elementSelector === "window") {
          window.scrollTo({
            top: entry.scrollY,
            left: entry.scrollX,
            behavior
          });
        } else if (elementSelector) {
          const element = document.querySelector(elementSelector);
          if (element) {
            element.scrollLeft = entry.scrollX;
            element.scrollTop = entry.scrollY;
          }
        }
      }
      break scroll;
    }
    const hash = (location ?? window.location).hash.split("#", 2)[1];
    if (hash) {
      const hashScrollIntoViewOptions = window.history.state?.__hashScrollIntoViewOptions ?? true;
      if (hashScrollIntoViewOptions) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView(hashScrollIntoViewOptions);
        }
      }
      break scroll;
    }
    const scrollOptions = { top: 0, left: 0, behavior };
    window.scrollTo(scrollOptions);
    if (scrollToTopSelectors) {
      for (const selector of scrollToTopSelectors) {
        if (selector === "window") continue;
        const element = typeof selector === "function" ? selector() : document.querySelector(selector);
        if (element) element.scrollTo(scrollOptions);
      }
    }
  }
  ignoreScroll = false;
}
function setupScrollRestoration(router2, force) {
  if (!scrollRestorationCache && !router2.isServer) {
    return;
  }
  const shouldScrollRestoration = router2.options.scrollRestoration ?? false;
  if (shouldScrollRestoration) {
    router2.isScrollRestoring = true;
  }
  if (router2.isServer || router2.isScrollRestorationSetup || !scrollRestorationCache) {
    return;
  }
  router2.isScrollRestorationSetup = true;
  ignoreScroll = false;
  const getKey = router2.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  window.history.scrollRestoration = "manual";
  const onScroll = (event) => {
    if (ignoreScroll || !router2.isScrollRestoring) {
      return;
    }
    let elementSelector = "";
    if (event.target === document || event.target === window) {
      elementSelector = "window";
    } else {
      const attrId = event.target.getAttribute(
        "data-scroll-restoration-id"
      );
      if (attrId) {
        elementSelector = `[data-scroll-restoration-id="${attrId}"]`;
      } else {
        elementSelector = getCssSelector(event.target);
      }
    }
    const restoreKey = getKey(router2.state.location);
    scrollRestorationCache.set((state) => {
      const keyEntry = state[restoreKey] ||= {};
      const elementEntry = keyEntry[elementSelector] ||= {};
      if (elementSelector === "window") {
        elementEntry.scrollX = window.scrollX || 0;
        elementEntry.scrollY = window.scrollY || 0;
      } else if (elementSelector) {
        const element = document.querySelector(elementSelector);
        if (element) {
          elementEntry.scrollX = element.scrollLeft || 0;
          elementEntry.scrollY = element.scrollTop || 0;
        }
      }
      return state;
    });
  };
  if (typeof document !== "undefined") {
    document.addEventListener("scroll", throttle(onScroll, 100), true);
  }
  router2.subscribe("onRendered", (event) => {
    const cacheKey = getKey(event.toLocation);
    if (!router2.resetNextScroll) {
      router2.resetNextScroll = true;
      return;
    }
    if (typeof router2.options.scrollRestoration === "function") {
      const shouldRestore = router2.options.scrollRestoration({
        location: router2.latestLocation
      });
      if (!shouldRestore) {
        return;
      }
    }
    restoreScroll({
      storageKey,
      key: cacheKey,
      behavior: router2.options.scrollRestorationBehavior,
      shouldScrollRestoration: router2.isScrollRestoring,
      scrollToTopSelectors: router2.options.scrollToTopSelectors,
      location: router2.history.location
    });
    if (router2.isScrollRestoring) {
      scrollRestorationCache.set((state) => {
        state[cacheKey] ||= {};
        return state;
      });
    }
  });
}
function handleHashScroll(router2) {
  if (typeof document !== "undefined" && document.querySelector) {
    const hashScrollIntoViewOptions = router2.state.location.state.__hashScrollIntoViewOptions ?? true;
    if (hashScrollIntoViewOptions && router2.state.location.hash !== "") {
      const el = document.getElementById(router2.state.location.hash);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions);
      }
    }
  }
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) {
      result.set(key, stringify(val));
    }
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = {};
  for (const [key, value2] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) {
      result[key] = toValue(value2);
    } else if (Array.isArray(previousValue)) {
      previousValue.push(toValue(value2));
    } else {
      result[key] = [previousValue, toValue(value2)];
    }
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(
  JSON.stringify,
  JSON.parse
);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") {
      searchStr = searchStr.substring(1);
    }
    const query = decode(searchStr);
    for (const key in query) {
      const value2 = query[key];
      if (typeof value2 === "string") {
        try {
          query[key] = parser(value2);
        } catch (_err) {
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) {
      try {
        return stringify(val);
      } catch (_err) {
      }
    } else if (hasParser && typeof val === "string") {
      try {
        parser(val);
        return stringify(val);
      } catch (_err) {
      }
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
function redirect(opts) {
  opts.statusCode = opts.statusCode || opts.code || 307;
  if (!opts.reloadDocument && typeof opts.href === "string") {
    try {
      new URL(opts.href);
      opts.reloadDocument = true;
    } catch {
    }
  }
  const headers = new Headers(opts.headers);
  if (opts.href && headers.get("Location") === null) {
    headers.set("Location", opts.href);
  }
  const response = new Response(null, {
    status: opts.statusCode,
    headers
  });
  response.options = opts;
  if (opts.throw) {
    throw response;
  }
  return response;
}
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function createLRUCache(max) {
  const cache = /* @__PURE__ */ new Map();
  let oldest;
  let newest;
  const touch = (entry) => {
    if (!entry.next) return;
    if (!entry.prev) {
      entry.next.prev = void 0;
      oldest = entry.next;
      entry.next = void 0;
      if (newest) {
        entry.prev = newest;
        newest.next = entry;
      }
    } else {
      entry.prev.next = entry.next;
      entry.next.prev = entry.prev;
      entry.next = void 0;
      if (newest) {
        newest.next = entry;
        entry.prev = newest;
      }
    }
    newest = entry;
  };
  return {
    get(key) {
      const entry = cache.get(key);
      if (!entry) return void 0;
      touch(entry);
      return entry.value;
    },
    set(key, value2) {
      if (cache.size >= max && oldest) {
        const toDelete = oldest;
        cache.delete(toDelete.key);
        if (toDelete.next) {
          oldest = toDelete.next;
          toDelete.next.prev = void 0;
        }
        if (toDelete === newest) {
          newest = void 0;
        }
      }
      const existing = cache.get(key);
      if (existing) {
        existing.value = value2;
        touch(existing);
      } else {
        const entry = { key, value: value2, prev: newest };
        if (newest) newest.next = entry;
        newest = entry;
        if (!oldest) oldest = entry;
        cache.set(key, entry);
      }
    }
  };
}
const triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.state.matches.some((d2) => d2.id === matchId));
};
const _handleNotFound = (inner, err) => {
  const routeCursor = inner.router.routesById[err.routeId ?? ""] ?? inner.router.routeTree;
  if (!routeCursor.options.notFoundComponent && inner.router.options?.defaultNotFoundComponent) {
    routeCursor.options.notFoundComponent = inner.router.options.defaultNotFoundComponent;
  }
  invariant$1(
    routeCursor.options.notFoundComponent
  );
  const matchForRoute = inner.matches.find((m2) => m2.routeId === routeCursor.id);
  invariant$1(matchForRoute, "Could not find match for route: " + routeCursor.id);
  inner.updateMatch(matchForRoute.id, (prev) => ({
    ...prev,
    status: "notFound",
    error: err,
    isFetching: false
  }));
  if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
    err.routeId = routeCursor.parentRoute.id;
    _handleNotFound(inner, err);
  }
};
const handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) {
    throw err;
  }
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    const status = isRedirect(err) ? "redirected" : "notFound";
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status,
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) {
      err.routeId = match.routeId;
    }
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
    throw err;
  } else {
    _handleNotFound(inner, err);
    throw err;
  }
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!inner.router.isServer && match._nonReactive.dehydrated) {
    return true;
  }
  if (inner.router.isServer && match.ssr === false) {
    return true;
  }
  return false;
};
const handleSerialError = (inner, index, err, routerCode) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) {
    throw err;
  }
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = matchId === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") {
      return "data-only";
    }
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) {
    return tempSsr.then((ssr) => {
      existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
    });
  }
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
  return;
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  const shouldPending = !!(inner.onReady && !inner.router.isServer && !resolvePreload(inner, matchId) && (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? inner.router.options?.defaultPendingComponent));
  if (shouldPending) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise)
    return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) {
      handleRedirectAndNotFound(inner, match, match.error);
    }
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  const prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
  });
  const { paramsError, searchError } = match;
  if (paramsError) {
    handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  }
  if (searchError) {
    handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  }
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  const parentMatchContext = parentMatch?.context ?? inner.router.options.context ?? void 0;
  const context = { ...parentMatchContext, ...match.__routeContext };
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController,
      context
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const { search, params, cause } = match;
  const preload2 = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload: preload2,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload2 ? "preload" : cause,
    matches: inner.matches,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2,
        context: {
          ...prev.context,
          ...beforeLoadContext2
        }
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err, "BEFORE_LOAD");
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
  return;
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    if (inner.router.isServer) {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) {
    return;
  }
  if (!route.options.head && !route.options.scripts && !route.options.headers) {
    return;
  }
  const assetContext = {
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    const meta = headFnContent?.meta;
    const links = headFnContent?.links;
    const headScripts = headFnContent?.scripts;
    const styles = headFnContent?.styles;
    return {
      meta,
      links,
      headScripts,
      headers,
      scripts,
      styles
    };
  });
};
const getLoaderContext = (inner, matchId, index, route) => {
  const parentMatchPromise = inner.matchPromises[index - 1];
  const { params, loaderDeps, abortController, context, cause } = inner.router.getMatch(matchId);
  const preload2 = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload2,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload2 ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
const runLoader = async (inner, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!inner.router.isServer || match.ssr === true) {
        loadRouteChunk(route);
      }
      const loaderResult = route.options.loader?.(
        getLoaderContext(inner, matchId, index, route)
      );
      const loaderResultIsPromise = route.options.loader && isPromise(loaderResult);
      const willLoadSomething = !!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise);
      if (willLoadSomething) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          isFetching: "loader"
        }));
      }
      if (route.options.loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(
          inner,
          inner.router.getMatch(matchId),
          loaderData
        );
        if (loaderData !== void 0) {
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            loaderData
          }));
        }
      }
      if (route._lazyPromise) await route._lazyPromise;
      const headResult = executeHead(inner, matchId, route);
      const head = headResult ? await headResult : void 0;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        status: "success",
        isFetching: false,
        updatedAt: Date.now(),
        ...head
      }));
    } catch (e) {
      let error = e;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        route.options.onError?.(e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(
          inner,
          inner.router.getMatch(matchId),
          onErrorError
        );
      }
      const headResult = executeHead(inner, matchId, route);
      const head = headResult ? await headResult : void 0;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        status: "error",
        isFetching: false,
        ...head
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
      match._nonReactive.loaderPromise = void 0;
    }
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  if (shouldSkipLoader(inner, matchId)) {
    if (inner.router.isServer) {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
      return inner.router.getMatch(matchId);
    }
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload) {
        return prevMatch;
      }
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      if (match2.error) {
        handleRedirectAndNotFound(inner, match2, match2.error);
      }
    } else {
      const age = Date.now() - prevMatch.updatedAt;
      const preload2 = resolvePreload(inner, matchId);
      const staleAge = preload2 ? route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
      const shouldReloadOption = route.options.shouldReload;
      const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchId, index, route)) : shouldReloadOption;
      const nextPreload = !!preload2 && !inner.router.state.matches.some((d2) => d2.id === matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          preload: nextPreload
        }));
      }
      const { status, invalid } = match2;
      loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
      if (preload2 && route.options.preload === false) ;
      else if (loaderShouldRunAsync && !inner.sync) {
        loaderIsRunningAsync = true;
        (async () => {
          try {
            await runLoader(inner, matchId, index, route);
            const match3 = inner.router.getMatch(matchId);
            match3._nonReactive.loaderPromise?.resolve();
            match3._nonReactive.loadPromise?.resolve();
            match3._nonReactive.loaderPromise = void 0;
          } catch (err) {
            if (isRedirect(err)) {
              await inner.router.navigate(err.options);
            }
          }
        })();
      } else if (status !== "success" || loaderShouldRunAsync && inner.sync) {
        await runLoader(inner, matchId, index, route);
      } else {
        const headResult = executeHead(inner, matchId, route);
        if (headResult) {
          const head = await headResult;
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            ...head
          }));
        }
      }
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else {
    return match;
  }
};
async function loadMatches(arg) {
  const inner = Object.assign(arg, {
    matchPromises: []
  });
  if (!inner.router.isServer && inner.router.state.matches.some((d2) => d2._forcePending)) {
    triggerOnReady(inner);
  }
  try {
    for (let i2 = 0; i2 < inner.matches.length; i2++) {
      const beforeLoad = handleBeforeLoad(inner, i2);
      if (isPromise(beforeLoad)) await beforeLoad;
    }
    const max = inner.firstBadMatchIndex ?? inner.matches.length;
    for (let i2 = 0; i2 < max; i2++) {
      inner.matchPromises.push(loadRouteMatch(inner, i2));
    }
    await Promise.all(inner.matchPromises);
    const readyPromise = triggerOnReady(inner);
    if (isPromise(readyPromise)) await readyPromise;
  } catch (err) {
    if (isNotFound(err) && !inner.preload) {
      const readyPromise = triggerOnReady(inner);
      if (isPromise(readyPromise)) await readyPromise;
      throw err;
    }
    if (isRedirect(err)) {
      throw err;
    }
  }
  return inner.matches;
}
async function loadRouteChunk(route) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) {
    if (route.lazyFn) {
      route._lazyPromise = route.lazyFn().then((lazyRoute) => {
        const { id: _id, ...options } = lazyRoute.options;
        Object.assign(route.options, options);
        route._lazyLoaded = true;
        route._lazyPromise = void 0;
      });
    } else {
      route._lazyLoaded = true;
    }
  }
  if (!route._componentsLoaded && route._componentsPromise === void 0) {
    const loadComponents = () => {
      const preloads = [];
      for (const type2 of componentTypes) {
        const preload2 = route.options[type2]?.preload;
        if (preload2) preloads.push(preload2());
      }
      if (preloads.length)
        return Promise.all(preloads).then(() => {
          route._componentsLoaded = true;
          route._componentsPromise = void 0;
        });
      route._componentsLoaded = true;
      route._componentsPromise = void 0;
      return;
    };
    route._componentsPromise = route._lazyPromise ? route._lazyPromise.then(loadComponents) : loadComponents();
  }
  return route._componentsPromise;
}
function makeMaybe(value2, error) {
  if (error) {
    return { status: "error", error };
  }
  return { status: "success", value: value2 };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) {
    if (route.options[componentType]?.preload) {
      return true;
    }
  }
  return false;
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function composeRewrites(rewrites) {
  return {
    input: ({ url: url2 }) => {
      for (const rewrite of rewrites) {
        url2 = executeRewriteInput(rewrite, url2);
      }
      return url2;
    },
    output: ({ url: url2 }) => {
      for (let i2 = rewrites.length - 1; i2 >= 0; i2--) {
        url2 = executeRewriteOutput(rewrites[i2], url2);
      }
      return url2;
    }
  };
}
function rewriteBasepath(opts) {
  const trimmedBasepath = trimPath(opts.basepath);
  const normalizedBasepath = `/${trimmedBasepath}`;
  const normalizedBasepathWithSlash = `${normalizedBasepath}/`;
  const checkBasepath = opts.caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
  const checkBasepathWithSlash = opts.caseSensitive ? normalizedBasepathWithSlash : normalizedBasepathWithSlash.toLowerCase();
  return {
    input: ({ url: url2 }) => {
      const pathname = opts.caseSensitive ? url2.pathname : url2.pathname.toLowerCase();
      if (pathname === checkBasepath) {
        url2.pathname = "/";
      } else if (pathname.startsWith(checkBasepathWithSlash)) {
        url2.pathname = url2.pathname.slice(normalizedBasepath.length);
      }
      return url2;
    },
    output: ({ url: url2 }) => {
      url2.pathname = joinPaths(["/", trimmedBasepath, url2.pathname]);
      return url2;
    }
  };
}
function executeRewriteInput(rewrite, url2) {
  const res = rewrite?.input?.({ url: url2 });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url2;
}
function executeRewriteOutput(rewrite, url2) {
  const res = rewrite?.output?.({ url: url2 });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url2;
}
function getLocationChangeInfo(routerState) {
  const fromLocation = routerState.resolvedLocation;
  const toLocation = routerState.location;
  const pathChanged = fromLocation?.pathname !== toLocation.pathname;
  const hrefChanged = fromLocation?.href !== toLocation.href;
  const hashChanged = fromLocation?.hash !== toLocation.hash;
  return { fromLocation, toLocation, pathChanged, hrefChanged, hashChanged };
}
class RouterCore {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(
      Math.random() * 1e7
    )}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.startTransition = (fn) => fn();
    this.update = (newOptions) => {
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info."
        );
      }
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(
        this.options.pathParamsAllowedCharacters.map((char) => [
          encodeURIComponent(char),
          char
        ])
      ) : void 0;
      if (!this.history || this.options.history && this.options.history !== this.history) {
        if (!this.options.history) {
          if (!this.isServer) {
            this.history = createBrowserHistory();
          }
        } else {
          this.history = this.options.history;
        }
      }
      this.origin = this.options.origin;
      if (!this.origin) {
        if (!this.isServer && window?.origin && window.origin !== "null") {
          this.origin = window.origin;
        } else {
          this.origin = "http://localhost";
        }
      }
      if (this.history) {
        this.updateLatestLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store && this.latestLocation) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d2) => !["redirected"].includes(d2.status)
              )
            };
          }
        });
        setupScrollRestoration(this);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      const basepathChanged = basepathWasUnset || prevBasepath !== nextBasepath;
      const rewriteChanged = prevRewriteOption !== nextRewriteOption;
      if (basepathChanged || rewriteChanged) {
        this.basepath = nextBasepath;
        const rewrites = [];
        if (trimPath(nextBasepath) !== "") {
          rewrites.push(
            rewriteBasepath({
              basepath: nextBasepath
            })
          );
        }
        if (nextRewriteOption) {
          rewrites.push(nextRewriteOption);
        }
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) {
          this.updateLatestLocation();
        }
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.__store) {
        this.__store.state = {
          ...this.state,
          location: this.latestLocation
        };
      }
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") {
        this.isViewTransitionTypesSupported = window.CSS.supports(
          "selector(:active-view-transition-type(a)"
        );
      }
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(
        this.history.location,
        this.latestLocation
      );
    };
    this.buildRouteTree = () => {
      const { routesById, routesByPath, flatRoutes } = processRouteTree({
        routeTree: this.routeTree,
        initRoute: (route, i2) => {
          route.init({
            originalIndex: i2
          });
        }
      });
      this.routesById = routesById;
      this.routesByPath = routesByPath;
      this.flatRoutes = flatRoutes;
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({
          originalIndex: 99999999999
        });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({
        href,
        state
      }) => {
        const fullUrl = new URL(href, this.origin);
        const url2 = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url2.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url2.search = searchStr;
        const fullPath = url2.href.replace(url2.origin, "");
        const { pathname, hash } = url2;
        return {
          href: fullPath,
          publicHref: href,
          url: url2.href,
          pathname,
          searchStr,
          search: replaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: hash.split("#").reverse()[0] ?? "",
          state: replaceEqualDeep(previousLocation?.state, state)
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        parseCache: this.parsePathnameCache
      });
      return resolvedPath;
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") {
        return this.matchRoutesInternal(
          {
            pathname: pathnameOrNext,
            search: locationSearchOrOpts
          },
          opts
        );
      }
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.parsePathnameCache = createLRUCache(1e3);
    this.getMatchedRoutes = (pathname, routePathname) => {
      return getMatchedRoutes({
        pathname,
        routePathname,
        caseSensitive: this.options.caseSensitive,
        routesByPath: this.routesByPath,
        routesById: this.routesById,
        flatRoutes: this.flatRoutes,
        parseCache: this.parsePathnameCache
      });
    };
    this.cancelMatch = (id2) => {
      const match = this.getMatch(id2);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      this.state.pendingMatches?.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.latestLocation;
        const allCurrentLocationMatches = this.matchRoutes(currentLocation, {
          _buildLocation: true
        });
        const lastMatch = last(allCurrentLocationMatches);
        if (dest.from && false) ;
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lastMatch.fullPath;
        const fromPath = this.resolvePathWithBase(defaultedFromPath, ".");
        const fromSearch = lastMatch.search;
        const fromParams = { ...lastMatch.params };
        const nextTo = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : this.resolvePathWithBase(fromPath, ".");
        const nextParams = dest.params === false || dest.params === null ? {} : (dest.params ?? true) === true ? fromParams : Object.assign(
          fromParams,
          functionalUpdate(dest.params, fromParams)
        );
        const interpolatedNextTo = interpolatePath({
          path: nextTo,
          params: nextParams,
          parseCache: this.parsePathnameCache
        }).interpolatedPath;
        const destRoutes = this.matchRoutes(interpolatedNextTo, void 0, {
          _buildLocation: true
        }).map((d2) => this.looseRoutesById[d2.routeId]);
        if (Object.keys(nextParams).length > 0) {
          for (const route of destRoutes) {
            const fn = route.options.params?.stringify ?? route.options.stringifyParams;
            if (fn) {
              Object.assign(nextParams, fn(nextParams));
            }
          }
        }
        const nextPathname = interpolatePath({
          // Use the original template path for interpolation
          // This preserves the original parameter syntax including optional parameters
          path: nextTo,
          params: nextParams,
          leaveWildcards: false,
          leaveParams: opts.leaveParams,
          decodeCharMap: this.pathParamsDecodeCharMap,
          parseCache: this.parsePathnameCache
        }).interpolatedPath;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) {
              try {
                Object.assign(
                  validatedSearch,
                  validateSearch(route.options.validateSearch, {
                    ...validatedSearch,
                    ...nextSearch
                  })
                );
              } catch {
              }
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = replaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        const url2 = new URL(fullPath, this.origin);
        const rewrittenUrl = executeRewriteOutput(this.rewrite, url2);
        return {
          publicHref: rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash,
          href: fullPath,
          url: rewrittenUrl.href,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next2 = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          let params = {};
          const foundMask = this.options.routeMasks?.find((d2) => {
            const match = matchPathname(
              next2.pathname,
              {
                to: d2.from,
                caseSensitive: false,
                fuzzy: false
              },
              this.parsePathnameCache
            );
            if (match) {
              params = match;
              return true;
            }
            return false;
          });
          if (foundMask) {
            const { from: _from, ...maskProps } = foundMask;
            maskedDest = {
              from: opts.from,
              ...maskProps,
              params
            };
            maskedNext = build(maskedDest);
          }
        }
        if (maskedNext) {
          next2.maskedLocation = maskedNext;
        }
        return next2;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          from: opts.from,
          ...opts.mask
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = ({
      viewTransition,
      ignoreBlocker,
      ...next2
    }) => {
      const isSameState = () => {
        const ignoredProps = [
          "key",
          // TODO: Remove in v2 - use __TSR_key instead
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next2.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next2.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next2.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next2.href);
      const previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
      });
      if (isSameUrl && isSameState()) {
        this.load();
      } else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next2;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                  // TODO: Remove in v2 - use __TSR_key instead
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
            nextHistory.state.__tempKey = this.tempLocationKey;
          }
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next2.replace ? "replace" : "push"](
          nextHistory.publicHref,
          nextHistory.state,
          { ignoreBlocker }
        );
      }
      this.resetNextScroll = next2.resetScroll ?? true;
      if (!this.history.subscribers.size) {
        this.load();
      }
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      hashScrollIntoView,
      viewTransition,
      ignoreBlocker,
      href,
      ...rest
    } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed2 = parseHref(href, {
          __TSR_index: replace ? currentIndex : currentIndex + 1
        });
        rest.to = parsed2.pathname;
        rest.search = this.options.parseSearch(parsed2.search);
        rest.hash = parsed2.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      return this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
    };
    this.navigate = ({ to, reloadDocument, href, ...rest }) => {
      if (!reloadDocument && href) {
        try {
          new URL(`${href}`);
          reloadDocument = true;
        } catch {
        }
      }
      if (reloadDocument) {
        if (!href) {
          const location = this.buildLocation({ to, ...rest });
          href = location.url;
        }
        if (rest.replace) {
          window.location.replace(href);
        } else {
          window.location.href = href;
        }
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      if (this.isServer) {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        const normalizeUrl = (url2) => {
          try {
            return encodeURI(decodeURI(url2));
          } catch {
            return url2;
          }
        };
        if (trimPath(normalizeUrl(this.latestLocation.href)) !== trimPath(normalizeUrl(nextLocation.href))) {
          let href = nextLocation.url;
          if (this.origin && href.startsWith(this.origin)) {
            href = href.replace(this.origin, "") || "/";
          }
          throw redirect({ href });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      this.__store.setState((s2) => ({
        ...s2,
        status: "pending",
        statusCode: 200,
        isLoading: true,
        location: this.latestLocation,
        pendingMatches,
        // If a cached moved to pendingMatches, remove it from cachedMatches
        cachedMatches: s2.cachedMatches.filter(
          (d2) => !pendingMatches.some((e) => e.id === d2.id)
        )
      }));
    };
    this.load = async (opts) => {
      let redirect2;
      let notFound;
      let loadPromise;
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            const next2 = this.latestLocation;
            const prevLocation = this.state.resolvedLocation;
            if (!this.state.redirect) {
              this.emit({
                type: "onBeforeNavigate",
                ...getLocationChangeInfo({
                  resolvedLocation: prevLocation,
                  location: next2
                })
              });
            }
            this.emit({
              type: "onBeforeLoad",
              ...getLocationChangeInfo({
                resolvedLocation: prevLocation,
                location: next2
              })
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              matches: this.state.pendingMatches,
              location: next2,
              updateMatch: this.updateMatch,
              // eslint-disable-next-line @typescript-eslint/require-await
              onReady: async () => {
                this.startViewTransition(async () => {
                  let exitingMatches;
                  let enteringMatches;
                  let stayingMatches;
                  batch(() => {
                    this.__store.setState((s2) => {
                      const previousMatches = s2.matches;
                      const newMatches = s2.pendingMatches || s2.matches;
                      exitingMatches = previousMatches.filter(
                        (match) => !newMatches.some((d2) => d2.id === match.id)
                      );
                      enteringMatches = newMatches.filter(
                        (match) => !previousMatches.some((d2) => d2.id === match.id)
                      );
                      stayingMatches = previousMatches.filter(
                        (match) => newMatches.some((d2) => d2.id === match.id)
                      );
                      return {
                        ...s2,
                        isLoading: false,
                        loadedAt: Date.now(),
                        matches: newMatches,
                        pendingMatches: void 0,
                        cachedMatches: [
                          ...s2.cachedMatches,
                          ...exitingMatches.filter((d2) => d2.status !== "error")
                        ]
                      };
                    });
                    this.clearExpiredCache();
                  });
                  [
                    [exitingMatches, "onLeave"],
                    [enteringMatches, "onEnter"],
                    [stayingMatches, "onStay"]
                  ].forEach(([matches, hook]) => {
                    matches.forEach((match) => {
                      this.looseRoutesById[match.routeId].options[hook]?.(match);
                    });
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
              if (!this.isServer) {
                this.navigate({
                  ...redirect2.options,
                  replace: true,
                  ignoreBlocker: true
                });
              }
            } else if (isNotFound(err)) {
              notFound = err;
            }
            this.__store.setState((s2) => ({
              ...s2,
              statusCode: redirect2 ? redirect2.status : notFound ? 404 : s2.matches.some((d2) => d2.status === "error") ? 500 : 200,
              redirect: redirect2
            }));
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) {
        await this.latestLoadPromise;
      }
      if (this.hasNotFoundMatch()) {
        this.__store.setState((s2) => ({
          ...s2,
          statusCode: 404
        }));
      }
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next2 = this.latestLocation;
          const prevLocation = this.state.resolvedLocation;
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(
            getLocationChangeInfo({
              resolvedLocation: prevLocation,
              location: next2
            })
          ) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn();
            return;
          }
          startViewTransitionParams = {
            update: fn,
            types: resolvedViewTransitionTypes
          };
        } else {
          startViewTransitionParams = fn;
        }
        document.startViewTransition(startViewTransitionParams);
      } else {
        fn();
      }
    };
    this.updateMatch = (id2, updater) => {
      const matchesKey = this.state.pendingMatches?.some((d2) => d2.id === id2) ? "pendingMatches" : this.state.matches.some((d2) => d2.id === id2) ? "matches" : this.state.cachedMatches.some((d2) => d2.id === id2) ? "cachedMatches" : "";
      if (matchesKey) {
        this.__store.setState((s2) => ({
          ...s2,
          [matchesKey]: s2[matchesKey]?.map((d2) => d2.id === id2 ? updater(d2) : d2)
        }));
      }
    };
    this.getMatch = (matchId) => {
      const findFn = (d2) => d2.id === matchId;
      return this.state.cachedMatches.find(findFn) ?? this.state.pendingMatches?.find(findFn) ?? this.state.matches.find(findFn);
    };
    this.invalidate = (opts) => {
      const invalidate = (d2) => {
        if (opts?.filter?.(d2) ?? true) {
          return {
            ...d2,
            invalid: true,
            ...opts?.forcePending || d2.status === "error" ? { status: "pending", error: void 0 } : void 0
          };
        }
        return d2;
      };
      this.__store.setState((s2) => ({
        ...s2,
        matches: s2.matches.map(invalidate),
        cachedMatches: s2.cachedMatches.map(invalidate),
        pendingMatches: s2.pendingMatches?.map(invalidate)
      }));
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.resolveRedirect = (redirect2) => {
      if (!redirect2.options.href) {
        const location = this.buildLocation(redirect2.options);
        let href = location.url;
        if (this.origin && href.startsWith(this.origin)) {
          href = href.replace(this.origin, "") || "/";
        }
        redirect2.options.href = location.href;
        redirect2.headers.set("Location", href);
      }
      if (!redirect2.headers.get("Location")) {
        redirect2.headers.set("Location", redirect2.options.href);
      }
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter2 = opts?.filter;
      if (filter2 !== void 0) {
        this.__store.setState((s2) => {
          return {
            ...s2,
            cachedMatches: s2.cachedMatches.filter(
              (m2) => !filter2(m2)
            )
          };
        });
      } else {
        this.__store.setState((s2) => {
          return {
            ...s2,
            cachedMatches: []
          };
        });
      }
    };
    this.clearExpiredCache = () => {
      const filter2 = (d2) => {
        const route = this.looseRoutesById[d2.routeId];
        if (!route.options.loader) {
          return true;
        }
        const gcTime = (d2.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3;
        const isError = d2.status === "error";
        if (isError) return true;
        const gcEligible = Date.now() - d2.updatedAt >= gcTime;
        return gcEligible;
      };
      this.clearCache({ filter: filter2 });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next2 = this.buildLocation(opts);
      let matches = this.matchRoutes(next2, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = new Set(
        [...this.state.matches, ...this.state.pendingMatches ?? []].map(
          (d2) => d2.id
        )
      );
      const loadedMatchIds = /* @__PURE__ */ new Set([
        ...activeMatchIds,
        ...this.state.cachedMatches.map((d2) => d2.id)
      ]);
      batch(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds.has(match.id)) {
            this.__store.setState((s2) => ({
              ...s2,
              cachedMatches: [...s2.cachedMatches, match]
            }));
          }
        });
      });
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next2,
          preload: true,
          updateMatch: (id2, updater) => {
            if (activeMatchIds.has(id2)) {
              matches = matches.map((d2) => d2.id === id2 ? updater(d2) : d2);
            } else {
              this.updateMatch(id2, updater);
            }
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) {
            return void 0;
          }
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next2
          });
        }
        if (!isNotFound(err)) {
          console.error(err);
        }
        return void 0;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(
          location.from || "",
          location.to
        ) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next2 = this.buildLocation(matchLocation);
      if (opts?.pending && this.state.status !== "pending") {
        return false;
      }
      const pending = opts?.pending === void 0 ? !this.state.isLoading : opts.pending;
      const baseLocation = pending ? this.latestLocation : this.state.resolvedLocation || this.state.location;
      const match = matchPathname(
        baseLocation.pathname,
        {
          ...opts,
          to: next2.pathname
        },
        this.parsePathnameCache
      );
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match, location.params, { partial: true })) {
          return false;
        }
      }
      if (match && (opts?.includeSearch ?? true)) {
        return deepEqual(baseLocation.search, next2.search, { partial: true }) ? match : false;
      }
      return match;
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some(
        (d2) => d2.status === "notFound" || d2.globalNotFound
      );
    };
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch
    });
    if (typeof document !== "undefined") {
      self.__TSR_ROUTER__ = this;
    }
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutesInternal(next2, opts) {
    const { foundRoute, matchedRoutes, routeParams } = this.getMatchedRoutes(
      next2.pathname,
      opts?.dest?.to
    );
    let isGlobalNotFound = false;
    if (
      // If we found a route, and it's not an index route and we have left over path
      foundRoute ? foundRoute.path !== "/" && routeParams["**"] : (
        // Or if we didn't find a route and we have left over path
        trimPathRight(next2.pathname)
      )
    ) {
      if (this.options.notFoundRoute) {
        matchedRoutes.push(this.options.notFoundRoute);
      } else {
        isGlobalNotFound = true;
      }
    }
    const globalNotFoundRouteId = (() => {
      if (!isGlobalNotFound) {
        return void 0;
      }
      if (this.options.notFoundMode !== "root") {
        for (let i2 = matchedRoutes.length - 1; i2 >= 0; i2--) {
          const route = matchedRoutes[i2];
          if (route.children) {
            return route.id;
          }
        }
      }
      return rootRouteId;
    })();
    const matches = [];
    const getParentContext = (parentMatch) => {
      const parentMatchId = parentMatch?.id;
      const parentContext = !parentMatchId ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
      return parentContext;
    };
    matchedRoutes.forEach((route, index) => {
      const parentMatch = matches[index - 1];
      const [preMatchSearch, strictMatchSearch, searchError] = (() => {
        const parentSearch = parentMatch?.search ?? next2.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          return [
            {
              ...parentSearch,
              ...strictSearch
            },
            { ...parentStrictSearch, ...strictSearch },
            void 0
          ];
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) {
            searchParamError = new SearchParamError(err.message, {
              cause: err
            });
          }
          if (opts?.throwOnError) {
            throw searchParamError;
          }
          return [parentSearch, {}, searchParamError];
        }
      })();
      const loaderDeps = route.options.loaderDeps?.({
        search: preMatchSearch
      }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decodeCharMap: this.pathParamsDecodeCharMap
      });
      const matchId = interpolatePath({
        path: route.id,
        params: routeParams,
        leaveWildcards: true,
        decodeCharMap: this.pathParamsDecodeCharMap,
        parseCache: this.parsePathnameCache
      }).interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = this.state.matches.find(
        (d2) => d2.routeId === route.id
      );
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) {
        const strictParseParams = route.options.params?.parse ?? route.options.parseParams;
        if (strictParseParams) {
          try {
            Object.assign(
              strictParams,
              strictParseParams(strictParams)
            );
          } catch (err) {
            paramsError = new PathParamError(err.message, {
              cause: err
            });
            if (opts?.throwOnError) {
              throw paramsError;
            }
          }
        }
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) {
        match = {
          ...existingMatch,
          cause,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : replaceEqualDeep(existingMatch.search, preMatchSearch),
          _strictSearch: strictMatchSearch
        };
      } else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          index,
          routeId: route.id,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: {
            loadPromise: createControlledPromise()
          },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) {
        match.globalNotFound = globalNotFoundRouteId === route.id;
      }
      match.searchError = searchError;
      const parentContext = getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches.push(match);
    });
    matches.forEach((match, index) => {
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      if (!existingMatch && opts?._buildLocation !== true) {
        const parentMatch = matches[index - 1];
        const parentContext = getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next2,
            navigate: (opts2) => this.navigate({ ...opts2, _fromLocation: next2 }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    });
    return matches;
  }
}
class SearchParamError extends Error {
}
class PathParamError extends Error {
}
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise)
      throw new SearchParamError("Async validation not supported");
    if (result.issues)
      throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), {
        cause: result
      });
    return result.value;
  }
  if ("parse" in validateSearch2) {
    return validateSearch2.parse(input);
  }
  if (typeof validateSearch2 === "function") {
    return validateSearch2(input);
  }
  return {};
}
function getMatchedRoutes({
  pathname,
  routePathname,
  caseSensitive,
  routesByPath,
  routesById,
  flatRoutes,
  parseCache: parseCache2
}) {
  let routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  const getMatchedParams = (route) => {
    const result = matchPathname(
      trimmedPath,
      {
        to: route.fullPath,
        caseSensitive: route.options?.caseSensitive ?? caseSensitive,
        // we need fuzzy matching for `notFoundMode: 'fuzzy'`
        fuzzy: true
      },
      parseCache2
    );
    return result;
  };
  let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
  if (foundRoute) {
    routeParams = getMatchedParams(foundRoute);
  } else {
    let fuzzyMatch = void 0;
    for (const route of flatRoutes) {
      const matchedParams = getMatchedParams(route);
      if (matchedParams) {
        if (route.path !== "/" && matchedParams["**"]) {
          if (!fuzzyMatch) {
            fuzzyMatch = { foundRoute: route, routeParams: matchedParams };
          }
        } else {
          foundRoute = route;
          routeParams = matchedParams;
          break;
        }
      }
    }
    if (!foundRoute && fuzzyMatch) {
      foundRoute = fuzzyMatch.foundRoute;
      routeParams = fuzzyMatch.routeParams;
    }
  }
  let routeCursor = foundRoute || routesById[rootRouteId];
  const matchedRoutes = [routeCursor];
  while (routeCursor.parentRoute) {
    routeCursor = routeCursor.parentRoute;
    matchedRoutes.push(routeCursor);
  }
  matchedRoutes.reverse();
  return { matchedRoutes, routeParams, foundRoute };
}
function applySearchMiddleware({
  search,
  dest,
  destRoutes,
  _includeValidateSearch
}) {
  const allMiddlewares = destRoutes.reduce(
    (acc, route) => {
      const middlewares = [];
      if ("search" in route.options) {
        if (route.options.search?.middlewares) {
          middlewares.push(...route.options.search.middlewares);
        }
      } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
        const legacyMiddleware = ({
          search: search2,
          next: next2
        }) => {
          let nextSearch = search2;
          if ("preSearchFilters" in route.options && route.options.preSearchFilters) {
            nextSearch = route.options.preSearchFilters.reduce(
              (prev, next22) => next22(prev),
              search2
            );
          }
          const result = next2(nextSearch);
          if ("postSearchFilters" in route.options && route.options.postSearchFilters) {
            return route.options.postSearchFilters.reduce(
              (prev, next22) => next22(prev),
              result
            );
          }
          return result;
        };
        middlewares.push(legacyMiddleware);
      }
      if (_includeValidateSearch && route.options.validateSearch) {
        const validate = ({ search: search2, next: next2 }) => {
          const result = next2(search2);
          try {
            const validatedSearch = {
              ...result,
              ...validateSearch(route.options.validateSearch, result) ?? void 0
            };
            return validatedSearch;
          } catch {
            return result;
          }
        };
        middlewares.push(validate);
      }
      return acc.concat(middlewares);
    },
    []
  ) ?? [];
  const final = ({ search: search2 }) => {
    if (!dest.search) {
      return {};
    }
    if (dest.search === true) {
      return search2;
    }
    return functionalUpdate(dest.search, search2);
  };
  allMiddlewares.push(final);
  const applyNext = (index, currentSearch) => {
    if (index >= allMiddlewares.length) {
      return currentSearch;
    }
    const middleware = allMiddlewares[index];
    const next2 = (newSearch) => {
      return applyNext(index + 1, newSearch);
    };
    return middleware({ search: currentSearch, next: next2 });
  };
  return applyNext(0, search);
}
const preloadWarning = "Error preloading route! ☝️";
class BaseRoute {
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) {
        this._path = rootRouteId;
      } else if (!this.parentRoute) {
        invariant$1(
          false
        );
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") {
        path = trimPathLeft(path);
      }
      const customId = options2?.id || path;
      let id2 = isRoot ? rootRouteId : joinPaths([
        this.parentRoute.id === rootRouteId ? "" : this.parentRoute.id,
        customId
      ]);
      if (path === rootRouteId) {
        path = "/";
      }
      if (id2 !== rootRouteId) {
        id2 = joinPaths(["/", id2]);
      }
      const fullPath = id2 === rootRouteId ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id2;
      this._fullPath = fullPath;
      this._to = fullPath;
    };
    this.clone = (other) => {
      this._path = other._path;
      this._id = other._id;
      this._fullPath = other._fullPath;
      this._to = other._to;
      this.options.getParentRoute = other.options.getParentRoute;
      this.children = other.children;
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) {
        this.children = children;
      }
      if (typeof children === "object" && children !== null) {
        this.children = Object.values(children);
      }
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) {
      throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
    }
  }
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
}
class BaseRootRoute extends BaseRoute {
  constructor(options) {
    super(options);
  }
}
function CatchBoundary(props) {
  const errorComponent = props.errorComponent ?? ErrorComponent;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundaryImpl,
    {
      getResetKey: props.getResetKey,
      onCatch: props.onCatch,
      children: ({ error, reset }) => {
        if (error) {
          return reactExports.createElement(errorComponent, {
            error,
            reset
          });
        }
        return props.children;
      }
    }
  );
}
class CatchBoundaryImpl extends reactExports.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  static getDerivedStateFromProps(props) {
    return { resetKey: props.getResetKey() };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.error && prevState.resetKey !== this.state.resetKey) {
      this.reset();
    }
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset();
      }
    });
  }
}
function ErrorComponent({ error }) {
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: ".5rem", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: ".5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          style: {
            appearance: "none",
            fontSize: ".6em",
            border: "1px solid currentColor",
            padding: ".1rem .2rem",
            fontWeight: "bold",
            borderRadius: ".25rem"
          },
          onClick: () => setShow((d2) => !d2),
          children: show ? "Hide Error" : "Show Error"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: ".25rem" } }),
    show ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pre",
      {
        style: {
          fontSize: ".7em",
          border: "1px solid red",
          borderRadius: ".25rem",
          padding: ".3rem",
          color: "red",
          overflow: "auto"
        },
        children: error.message ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: error.message }) : null
      }
    ) }) : null
  ] });
}
function ClientOnly({ children, fallback = null }) {
  return useHydrated() ? /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children }) : /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: fallback });
}
function useHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
function subscribe() {
  return () => {
  };
}
function warning(condition, message) {
}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React2 = requireReact();
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React2.useState, useEffect = React2.useEffect, useLayoutEffect2 = React2.useLayoutEffect, useDebugValue = React2.useDebugValue;
  function useSyncExternalStore$2(subscribe2, getSnapshot) {
    var value2 = getSnapshot(), _useState = useState({ inst: { value: value2, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
    useLayoutEffect2(
      function() {
        inst.value = value2;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      },
      [subscribe2, value2, getSnapshot]
    );
    useEffect(
      function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        return subscribe2(function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        });
      },
      [subscribe2]
    );
    useDebugValue(value2);
    return value2;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe2, getSnapshot) {
    return getSnapshot();
  }
  var shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim.exports;
  hasRequiredShim = 1;
  {
    shim.exports = requireUseSyncExternalStoreShim_production();
  }
  return shim.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_production;
function requireWithSelector_production() {
  if (hasRequiredWithSelector_production) return withSelector_production;
  hasRequiredWithSelector_production = 1;
  var React2 = requireReact(), shim2 = requireShim();
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef = React2.useRef, useEffect = React2.useEffect, useMemo = React2.useMemo, useDebugValue = React2.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function(subscribe2, getSnapshot, getServerSnapshot, selector, isEqual) {
    var instRef = useRef(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo(
      function() {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return memoizedSelection = currentSelection;
            }
            return memoizedSelection = nextSnapshot;
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return memoizedSnapshot = nextSnapshot, currentSelection;
          memoizedSnapshot = nextSnapshot;
          return memoizedSelection = nextSelection;
        }
        var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function() {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          }
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual]
    );
    var value2 = useSyncExternalStore(subscribe2, instRef[0], instRef[1]);
    useEffect(
      function() {
        inst.hasValue = true;
        inst.value = value2;
      },
      [value2]
    );
    useDebugValue(value2);
    return value2;
  };
  return withSelector_production;
}
var hasRequiredWithSelector;
function requireWithSelector() {
  if (hasRequiredWithSelector) return withSelector.exports;
  hasRequiredWithSelector = 1;
  {
    withSelector.exports = requireWithSelector_production();
  }
  return withSelector.exports;
}
var withSelectorExports = requireWithSelector();
function useStore(store, selector = (d2) => d2) {
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    shallow
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
    }
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = getOwnKeys(objA);
  if (keysA.length !== getOwnKeys(objB).length) {
    return false;
  }
  for (let i2 = 0; i2 < keysA.length; i2++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i2]) || !Object.is(objA[keysA[i2]], objB[keysA[i2]])) {
      return false;
    }
  }
  return true;
}
function getOwnKeys(obj) {
  return Object.keys(obj).concat(
    Object.getOwnPropertySymbols(obj)
  );
}
const routerContext = reactExports.createContext(null);
function getRouterContext() {
  if (typeof document === "undefined") {
    return routerContext;
  }
  if (window.__TSR_ROUTER_CONTEXT__) {
    return window.__TSR_ROUTER_CONTEXT__;
  }
  window.__TSR_ROUTER_CONTEXT__ = routerContext;
  return routerContext;
}
function useRouter(opts) {
  const value2 = reactExports.useContext(getRouterContext());
  warning(
    !((opts?.warn ?? true) && !value2)
  );
  return value2;
}
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: opts?.router === void 0
  });
  const router2 = opts?.router || contextRouter;
  const previousResult = reactExports.useRef(void 0);
  return useStore(router2.__store, (state) => {
    if (opts?.select) {
      if (opts.structuralSharing ?? router2.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep(
          previousResult.current,
          opts.select(state)
        );
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}
const matchContext = reactExports.createContext(void 0);
const dummyMatchContext = reactExports.createContext(
  void 0
);
function useMatch(opts) {
  const nearestMatchId = reactExports.useContext(
    opts.from ? dummyMatchContext : matchContext
  );
  const matchSelection = useRouterState({
    select: (state) => {
      const match = state.matches.find(
        (d2) => opts.from ? opts.from === d2.routeId : d2.id === nearestMatchId
      );
      invariant$1(
        !((opts.shouldThrow ?? true) && !match),
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`
      );
      if (match === void 0) {
        return void 0;
      }
      return opts.select ? opts.select(match) : match;
    },
    structuralSharing: opts.structuralSharing
  });
  return matchSelection;
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s2) => {
      return opts.select ? opts.select(s2.loaderData) : s2.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s2) => {
      return select ? select(s2.loaderDeps) : s2.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback(
    (options) => {
      return router2.navigate({
        ...options,
        from: options.from ?? _defaultOpts?.from
      });
    },
    [_defaultOpts?.from, router2]
  );
}
var reactDomExports = requireReactDom();
const useLayoutEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function usePrevious(value2) {
  const ref = reactExports.useRef({
    value: value2,
    prev: null
  });
  const current = ref.current.value;
  if (value2 !== current) {
    ref.current = {
      value: value2,
      prev: current
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions2 = {}, options = {}) {
  reactExports.useEffect(() => {
    if (!ref.current || options.disabled || typeof IntersectionObserver !== "function") {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions2);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [callback, intersectionObserverOptions2, options.disabled, ref]);
}
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const hasRenderFetched = reactExports.useRef(false);
  const innerRef = useForwardedRef(forwardedRef);
  const {
    // custom props
    activeProps,
    inactiveProps,
    activeOptions,
    to,
    preload: userPreload,
    preloadDelay: userPreloadDelay,
    hashScrollIntoView,
    replace,
    startTransition,
    resetScroll,
    viewTransition,
    // element props
    children,
    target,
    disabled,
    style,
    className,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    ignoreBlocker,
    // prevent these from being returned
    params: _params,
    search: _search,
    hash: _hash,
    state: _state,
    mask: _mask,
    reloadDocument: _reloadDocument,
    unsafeRelative: _unsafeRelative,
    from: _from,
    _fromLocation,
    ...propsSafeToSpread
  } = options;
  const currentSearch = useRouterState({
    select: (s2) => s2.location.search,
    structuralSharing: true
  });
  const from = options.from;
  const _options = reactExports.useMemo(
    () => {
      return { ...options, from };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      router2,
      currentSearch,
      from,
      options._fromLocation,
      options.hash,
      options.to,
      options.search,
      options.params,
      options.state,
      options.mask,
      options.unsafeRelative
    ]
  );
  const next2 = reactExports.useMemo(
    () => router2.buildLocation({ ..._options }),
    [router2, _options]
  );
  const hrefOption = reactExports.useMemo(() => {
    if (disabled) {
      return void 0;
    }
    let href = next2.maskedLocation ? next2.maskedLocation.url : next2.url;
    let external = false;
    if (router2.origin) {
      if (href.startsWith(router2.origin)) {
        href = router2.history.createHref(href.replace(router2.origin, "")) || "/";
      } else {
        external = true;
      }
    }
    return { href, external };
  }, [disabled, next2.maskedLocation, next2.url, router2.origin, router2.history]);
  const externalLink = reactExports.useMemo(() => {
    if (hrefOption?.external) {
      return hrefOption.href;
    }
    try {
      new URL(to);
      return to;
    } catch {
    }
    return void 0;
  }, [to, hrefOption]);
  const preload2 = options.reloadDocument || externalLink ? false : userPreload ?? router2.options.defaultPreload;
  const preloadDelay = userPreloadDelay ?? router2.options.defaultPreloadDelay ?? 0;
  const isActive = useRouterState({
    select: (s2) => {
      if (externalLink) return false;
      if (activeOptions?.exact) {
        const testExact = exactPathTest(
          s2.location.pathname,
          next2.pathname,
          router2.basepath
        );
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = removeTrailingSlash(
          s2.location.pathname,
          router2.basepath
        );
        const nextPathSplit = removeTrailingSlash(
          next2.pathname,
          router2.basepath
        );
        const pathIsFuzzyEqual = currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/");
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      if (activeOptions?.includeSearch ?? true) {
        const searchTest = deepEqual(s2.location.search, next2.search, {
          partial: !activeOptions?.exact,
          ignoreUndefined: !activeOptions?.explicitUndefined
        });
        if (!searchTest) {
          return false;
        }
      }
      if (activeOptions?.includeHash) {
        return s2.location.hash === next2.hash;
      }
      return true;
    }
  });
  const doPreload = reactExports.useCallback(() => {
    router2.preloadRoute({ ..._options }).catch((err) => {
      console.warn(err);
      console.warn(preloadWarning);
    });
  }, [router2, _options]);
  const preloadViewportIoCallback = reactExports.useCallback(
    (entry) => {
      if (entry?.isIntersecting) {
        doPreload();
      }
    },
    [doPreload]
  );
  useIntersectionObserver(
    innerRef,
    preloadViewportIoCallback,
    intersectionObserverOptions,
    { disabled: !!disabled || !(preload2 === "viewport") }
  );
  reactExports.useEffect(() => {
    if (hasRenderFetched.current) {
      return;
    }
    if (!disabled && preload2 === "render") {
      doPreload();
      hasRenderFetched.current = true;
    }
  }, [disabled, doPreload, preload2]);
  const handleClick = (e) => {
    const elementTarget = e.currentTarget.target;
    const effectiveTarget = target !== void 0 ? target : elementTarget;
    if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
      e.preventDefault();
      reactDomExports.flushSync(() => {
        setIsTransitioning(true);
      });
      const unsub = router2.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      router2.navigate({
        ..._options,
        replace,
        resetScroll,
        hashScrollIntoView,
        startTransition,
        viewTransition,
        ignoreBlocker
      });
    }
  };
  if (externalLink) {
    return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className },
      ...onClick && { onClick },
      ...onFocus && { onFocus },
      ...onMouseEnter && { onMouseEnter },
      ...onMouseLeave && { onMouseLeave },
      ...onTouchStart && { onTouchStart }
    };
  }
  const handleFocus = (_) => {
    if (disabled) return;
    if (preload2) {
      doPreload();
    }
  };
  const handleTouchStart = handleFocus;
  const handleEnter = (e) => {
    if (disabled || !preload2) return;
    if (!preloadDelay) {
      doPreload();
    } else {
      const eventTarget = e.target;
      if (timeoutMap.has(eventTarget)) {
        return;
      }
      const id2 = setTimeout(() => {
        timeoutMap.delete(eventTarget);
        doPreload();
      }, preloadDelay);
      timeoutMap.set(eventTarget, id2);
    }
  };
  const handleLeave = (e) => {
    if (disabled || !preload2 || !preloadDelay) return;
    const eventTarget = e.target;
    const id2 = timeoutMap.get(eventTarget);
    if (id2) {
      clearTimeout(id2);
      timeoutMap.delete(eventTarget);
    }
  };
  const resolvedActiveProps = isActive ? functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
  const resolvedInactiveProps = isActive ? STATIC_EMPTY_OBJECT : functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
  const resolvedClassName = [
    className,
    resolvedActiveProps.className,
    resolvedInactiveProps.className
  ].filter(Boolean).join(" ");
  const resolvedStyle = (style || resolvedActiveProps.style || resolvedInactiveProps.style) && {
    ...style,
    ...resolvedActiveProps.style,
    ...resolvedInactiveProps.style
  };
  return {
    ...propsSafeToSpread,
    ...resolvedActiveProps,
    ...resolvedInactiveProps,
    href: hrefOption?.href,
    ref: innerRef,
    onClick: composeHandlers([onClick, handleClick]),
    onFocus: composeHandlers([onFocus, handleFocus]),
    onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
    onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
    onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
    disabled: !!disabled,
    target,
    ...resolvedStyle && { style: resolvedStyle },
    ...resolvedClassName && { className: resolvedClassName },
    ...disabled && STATIC_DISABLED_PROPS,
    ...isActive && STATIC_ACTIVE_PROPS,
    ...isTransitioning && STATIC_TRANSITIONING_PROPS
  };
}
const STATIC_EMPTY_OBJECT = {};
const STATIC_ACTIVE_OBJECT = { className: "active" };
const STATIC_DISABLED_PROPS = { role: "link", "aria-disabled": true };
const STATIC_ACTIVE_PROPS = { "data-status": "active", "aria-current": "page" };
const STATIC_TRANSITIONING_PROPS = { "data-transitioning": "transitioning" };
const timeoutMap = /* @__PURE__ */ new WeakMap();
const intersectionObserverOptions = {
  rootMargin: "100px"
};
const composeHandlers = (handlers) => (e) => {
  for (const handler of handlers) {
    if (!handler) continue;
    if (e.defaultPrevented) return;
    handler(e);
  }
};
const Link = reactExports.forwardRef(
  (props, ref) => {
    const { _asChild, ...rest } = props;
    const {
      type: _type,
      ref: innerRef,
      ...linkProps
    } = useLinkProps(rest, ref);
    const children = typeof rest.children === "function" ? rest.children({
      isActive: linkProps["data-status"] === "active"
    }) : rest.children;
    if (_asChild === void 0) {
      delete linkProps.disabled;
    }
    return reactExports.createElement(
      _asChild ? _asChild : "a",
      {
        ...linkProps,
        ref: innerRef
      },
      children
    );
  }
);
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
let Route$b = class Route extends BaseRoute {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d2) => opts?.select ? opts.select(d2.context) : d2.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { ref, from: this.fullPath, ...props });
      }
    );
    this.$$typeof = Symbol.for("react.memo");
  }
};
function createRoute(options) {
  return new Route$b(
    // TODO: Help us TypeChris, you're our only hope!
    options
  );
}
class RootRoute extends BaseRootRoute {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d2) => opts?.select ? opts.select(d2.context) : d2.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { ref, from: this.fullPath, ...props });
      }
    );
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  if (typeof path === "object") {
    return new FileRoute(path, {
      silent: true
    }).createRoute(path);
  }
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      warning(
        this.silent
      );
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2?.select,
        from: this.options.id,
        structuralSharing: opts2?.structuralSharing
      });
    };
    this.useRouteContext = (opts2) => {
      return useMatch({
        from: this.options.id,
        select: (d2) => opts2?.select ? opts2.select(d2.context) : d2.context
      });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2?.select,
        structuralSharing: opts2?.structuralSharing,
        from: this.options.id
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2?.select,
        structuralSharing: opts2?.structuralSharing,
        from: this.options.id
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      const router2 = useRouter();
      return useNavigate({ from: router2.routesById[this.options.id].fullPath });
    };
    this.options = opts;
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createLazyFileRoute(id2) {
  if (typeof id2 === "object") {
    return new LazyRoute(id2);
  }
  return (opts) => new LazyRoute({ id: id2, ...opts });
}
function Transitioner() {
  const router2 = useRouter();
  const mountLoadForRouter = reactExports.useRef({ router: router2, mounted: false });
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const { hasPendingMatches, isLoading } = useRouterState({
    select: (s2) => ({
      isLoading: s2.isLoading,
      hasPendingMatches: s2.matches.some((d2) => d2.status === "pending")
    }),
    structuralSharing: true
  });
  const previousIsLoading = usePrevious(isLoading);
  const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious(isAnyPending);
  const isPagePending = isLoading || hasPendingMatches;
  const previousIsPagePending = usePrevious(isPagePending);
  router2.startTransition = (fn) => {
    setIsTransitioning(true);
    reactExports.startTransition(() => {
      fn();
      setIsTransitioning(false);
    });
  };
  reactExports.useEffect(() => {
    const unsub = router2.history.subscribe(router2.load);
    const nextLocation = router2.buildLocation({
      to: router2.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true,
      _includeValidateSearch: true
    });
    if (trimPathRight(router2.latestLocation.href) !== trimPathRight(nextLocation.href)) {
      router2.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router2, router2.history]);
  useLayoutEffect(() => {
    if (
      // if we are hydrating from SSR, loading is triggered in ssr-client
      typeof window !== "undefined" && router2.ssr || mountLoadForRouter.current.router === router2 && mountLoadForRouter.current.mounted
    ) {
      return;
    }
    mountLoadForRouter.current = { router: router2, mounted: true };
    const tryLoad = async () => {
      try {
        await router2.load();
      } catch (err) {
        console.error(err);
      }
    };
    tryLoad();
  }, [router2]);
  useLayoutEffect(() => {
    if (previousIsLoading && !isLoading) {
      router2.emit({
        type: "onLoad",
        // When the new URL has committed, when the new matches have been loaded into state.matches
        ...getLocationChangeInfo(router2.state)
      });
    }
  }, [previousIsLoading, router2, isLoading]);
  useLayoutEffect(() => {
    if (previousIsPagePending && !isPagePending) {
      router2.emit({
        type: "onBeforeRouteMount",
        ...getLocationChangeInfo(router2.state)
      });
    }
  }, [isPagePending, previousIsPagePending, router2]);
  useLayoutEffect(() => {
    if (previousIsAnyPending && !isAnyPending) {
      router2.emit({
        type: "onResolved",
        ...getLocationChangeInfo(router2.state)
      });
      router2.__store.setState((s2) => ({
        ...s2,
        status: "idle",
        resolvedLocation: s2.location
      }));
      handleHashScroll(router2);
    }
  }, [isAnyPending, previousIsAnyPending, router2]);
  return null;
}
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s2) => `not-found-${s2.location.pathname}-${s2.status}`
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      onCatch: (error, errorInfo) => {
        if (isNotFound(error)) {
          props.onCatch?.(error, errorInfo);
        } else {
          throw error;
        }
      },
      errorComponent: ({ error }) => {
        if (isNotFound(error)) {
          return props.fallback?.(error);
        } else {
          throw error;
        }
      },
      children: props.children
    }
  );
}
function DefaultGlobalNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not Found" });
}
function SafeFragment(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: props.children });
}
function renderRouteNotFound(router2, route, data) {
  if (!route.options.notFoundComponent) {
    if (router2.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(router2.options.defaultNotFoundComponent, { data });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(route.options.notFoundComponent, { data });
}
function ScriptOnce({ children }) {
  const router2 = useRouter();
  if (!router2.isServer) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "script",
    {
      nonce: router2.options.ssr?.nonce,
      className: "$tsr",
      dangerouslySetInnerHTML: {
        __html: [children].filter(Boolean).join("\n") + ";$_TSR.c()"
      }
    }
  );
}
function ScrollRestoration() {
  const router2 = useRouter();
  if (!router2.isScrollRestoring || !router2.isServer) {
    return null;
  }
  if (typeof router2.options.scrollRestoration === "function") {
    const shouldRestore = router2.options.scrollRestoration({
      location: router2.latestLocation
    });
    if (!shouldRestore) {
      return null;
    }
  }
  const getKey = router2.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  const userKey = getKey(router2.latestLocation);
  const resolvedKey = userKey !== defaultGetScrollRestorationKey(router2.latestLocation) ? userKey : void 0;
  const restoreScrollOptions = {
    storageKey,
    shouldScrollRestoration: true
  };
  if (resolvedKey) {
    restoreScrollOptions.key = resolvedKey;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScriptOnce,
    {
      children: `(${restoreScroll.toString()})(${JSON.stringify(restoreScrollOptions)})`
    }
  );
}
const Match = reactExports.memo(function MatchImpl({
  matchId
}) {
  const router2 = useRouter();
  const matchState = useRouterState({
    select: (s2) => {
      const match = s2.matches.find((d2) => d2.id === matchId);
      invariant$1(
        match
      );
      return {
        routeId: match.routeId,
        ssr: match.ssr,
        _displayPending: match._displayPending
      };
    },
    structuralSharing: true
  });
  const route = router2.routesById[matchState.routeId];
  const PendingComponent = route.options.pendingComponent ?? router2.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {}) : null;
  const routeErrorComponent = route.options.errorComponent ?? router2.options.defaultErrorComponent;
  const routeOnCatch = route.options.onCatch ?? router2.options.defaultOnCatch;
  const routeNotFoundComponent = route.isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route.options.notFoundComponent ?? router2.options.notFoundRoute?.options.component
  ) : route.options.notFoundComponent;
  const resolvedNoSsr = matchState.ssr === false || matchState.ssr === "data-only";
  const ResolvedSuspenseBoundary = (
    // If we're on the root route, allow forcefully wrapping in suspense
    (!route.isRoot || route.options.wrapInSuspense || resolvedNoSsr) && (route.options.wrapInSuspense ?? PendingComponent ?? (route.options.errorComponent?.preload || resolvedNoSsr)) ? reactExports.Suspense : SafeFragment
  );
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s2) => s2.loadedAt
  });
  const parentRouteId = useRouterState({
    select: (s2) => {
      const index = s2.matches.findIndex((d2) => d2.id === matchId);
      return s2.matches[index - 1]?.routeId;
    }
  });
  const ShellComponent = route.isRoot ? route.options.shellComponent ?? SafeFragment : SafeFragment;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ShellComponent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedSuspenseBoundary, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResolvedCatchBoundary,
      {
        getResetKey: () => resetKey,
        errorComponent: routeErrorComponent || ErrorComponent,
        onCatch: (error, errorInfo) => {
          if (isNotFound(error)) throw error;
          routeOnCatch?.(error, errorInfo);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ResolvedNotFoundBoundary,
          {
            fallback: (error) => {
              if (!routeNotFoundComponent || error.routeId && error.routeId !== matchState.routeId || !error.routeId && !route.isRoot)
                throw error;
              return reactExports.createElement(routeNotFoundComponent, error);
            },
            children: resolvedNoSsr || matchState._displayPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClientOnly, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId })
          }
        )
      }
    ) }) }),
    parentRouteId === rootRouteId && router2.options.scrollRestoration ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OnRendered, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollRestoration, {})
    ] }) : null
  ] });
});
function OnRendered() {
  const router2 = useRouter();
  const prevLocationRef = reactExports.useRef(
    void 0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "script",
    {
      suppressHydrationWarning: true,
      ref: (el) => {
        if (el && (prevLocationRef.current === void 0 || prevLocationRef.current.href !== router2.latestLocation.href)) {
          router2.emit({
            type: "onRendered",
            ...getLocationChangeInfo(router2.state)
          });
          prevLocationRef.current = router2.latestLocation;
        }
      }
    },
    router2.latestLocation.state.__TSR_key
  );
}
const MatchInner = reactExports.memo(function MatchInnerImpl({
  matchId
}) {
  const router2 = useRouter();
  const { match, key, routeId } = useRouterState({
    select: (s2) => {
      const match2 = s2.matches.find((d2) => d2.id === matchId);
      const routeId2 = match2.routeId;
      const remountFn = router2.routesById[routeId2].options.remountDeps ?? router2.options.defaultRemountDeps;
      const remountDeps = remountFn?.({
        routeId: routeId2,
        loaderDeps: match2.loaderDeps,
        params: match2._strictParams,
        search: match2._strictSearch
      });
      const key2 = remountDeps ? JSON.stringify(remountDeps) : void 0;
      return {
        key: key2,
        routeId: routeId2,
        match: {
          id: match2.id,
          status: match2.status,
          error: match2.error,
          _forcePending: match2._forcePending,
          _displayPending: match2._displayPending
        }
      };
    },
    structuralSharing: true
  });
  const route = router2.routesById[routeId];
  const out = reactExports.useMemo(() => {
    const Comp = route.options.component ?? router2.options.defaultComponent;
    if (Comp) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {}, key);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }, [key, route.options.component, router2.options.defaultComponent]);
  if (match._displayPending) {
    throw router2.getMatch(match.id)?._nonReactive.displayPendingPromise;
  }
  if (match._forcePending) {
    throw router2.getMatch(match.id)?._nonReactive.minPendingPromise;
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router2.options.defaultPendingMinMs;
    if (pendingMinMs) {
      const routerMatch = router2.getMatch(match.id);
      if (routerMatch && !routerMatch._nonReactive.minPendingPromise) {
        if (!router2.isServer) {
          const minPendingPromise = createControlledPromise();
          routerMatch._nonReactive.minPendingPromise = minPendingPromise;
          setTimeout(() => {
            minPendingPromise.resolve();
            routerMatch._nonReactive.minPendingPromise = void 0;
          }, pendingMinMs);
        }
      }
    }
    throw router2.getMatch(match.id)?._nonReactive.loadPromise;
  }
  if (match.status === "notFound") {
    invariant$1(isNotFound(match.error));
    return renderRouteNotFound(router2, route, match.error);
  }
  if (match.status === "redirected") {
    invariant$1(isRedirect(match.error));
    throw router2.getMatch(match.id)?._nonReactive.loadPromise;
  }
  if (match.status === "error") {
    if (router2.isServer) {
      const RouteErrorComponent = (route.options.errorComponent ?? router2.options.defaultErrorComponent) || ErrorComponent;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        RouteErrorComponent,
        {
          error: match.error,
          reset: void 0,
          info: {
            componentStack: ""
          }
        }
      );
    }
    throw match.error;
  }
  return out;
});
const Outlet = reactExports.memo(function OutletImpl() {
  const router2 = useRouter();
  const matchId = reactExports.useContext(matchContext);
  const routeId = useRouterState({
    select: (s2) => s2.matches.find((d2) => d2.id === matchId)?.routeId
  });
  const route = router2.routesById[routeId];
  const parentGlobalNotFound = useRouterState({
    select: (s2) => {
      const matches = s2.matches;
      const parentMatch = matches.find((d2) => d2.id === matchId);
      invariant$1(
        parentMatch
      );
      return parentMatch.globalNotFound;
    }
  });
  const childMatchId = useRouterState({
    select: (s2) => {
      const matches = s2.matches;
      const index = matches.findIndex((d2) => d2.id === matchId);
      return matches[index + 1]?.id;
    }
  });
  const pendingElement = router2.options.defaultPendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(router2.options.defaultPendingComponent, {}) : null;
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router2, route, void 0);
  }
  if (!childMatchId) {
    return null;
  }
  const nextMatch = /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId: childMatchId });
  if (matchId === rootRouteId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: pendingElement, children: nextMatch });
  }
  return nextMatch;
});
function Matches() {
  const router2 = useRouter();
  const rootRoute = router2.routesById[rootRouteId];
  const PendingComponent = rootRoute.options.pendingComponent ?? router2.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {}) : null;
  const ResolvedSuspense = router2.isServer || typeof document !== "undefined" && router2.ssr ? SafeFragment : reactExports.Suspense;
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(ResolvedSuspense, { fallback: pendingElement, children: [
    !router2.isServer && /* @__PURE__ */ jsxRuntimeExports.jsx(Transitioner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchesInner, {})
  ] });
  return router2.options.InnerWrap ? /* @__PURE__ */ jsxRuntimeExports.jsx(router2.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
  const router2 = useRouter();
  const matchId = useRouterState({
    select: (s2) => {
      return s2.matches[0]?.id;
    }
  });
  const resetKey = useRouterState({
    select: (s2) => s2.loadedAt
  });
  const matchComponent = matchId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: router2.options.disableGlobalCatchBoundary ? matchComponent : /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: ErrorComponent,
      onCatch: (error) => {
        warning(false, error.message || error.toString());
      },
      children: matchComponent
    }
  ) });
}
const createRouter = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
} else if (typeof window !== "undefined") {
  window.createFileRoute = createFileRoute;
  window.createLazyFileRoute = createLazyFileRoute;
}
function RouterContextProvider({
  router: router2,
  children,
  ...rest
}) {
  if (Object.keys(rest).length > 0) {
    router2.update({
      ...router2.options,
      ...rest,
      context: {
        ...router2.options.context,
        ...rest.context
      }
    });
  }
  const routerContext2 = getRouterContext();
  const provider = /* @__PURE__ */ jsxRuntimeExports.jsx(routerContext2.Provider, { value: router2, children });
  if (router2.options.Wrap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(router2.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router: router2, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterContextProvider, { router: router2, ...rest, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Matches, {}) });
}
const INLINED_ICONS = {
  "beech.ico": "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAgXklEQVR42u3dCbSdZXkv8O/MmQEDATIwD2UQzMRgQQUWC8K9FXqLioBeoXKdrgphSkGt1LZia0V7r2IVlJZAAqxWtEVBkKqAoIADIhREhgSSMIQkZB5Ozn1e8y1AbhIO4dv7+/a3f7+1nrUPjatn7+d73+f973322adzYGAgU0oppVR7VWcGALQdAQAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAgLYOAB0dHZmqX737c+M6o3Y488pJJ5xz9dRTyq4zvrL3xLg/w1wbpTa7b4elvVKFPZtmR5ohaZa4NvUsrwDUzEkXj50cNTu+XBQ1v29Y77e6h3bNLLs6uzp+Hvdnedy3n0edGdXnasHv92xf1Mej7k17JO2VKuzZNDvSDEmzJM2UNFtcLT8CoJpDpDvqH+PLe6LeFTWqond1YtQlUQ8YKNi3v98DD0R9MWpSRe/mqHym3BP398tRva6cAEB1hkhH3KRn/R9tobu9W9StQgBtvG9TGL413wut4sNp1uQzBwGAimzKP2vB+52eWVzrGQVtePinNX9NVt1X6jbnT6P+t6soAFD+IBkaN5/e1L93dXZn3Z09pVd6w8lmXgn4oCtJmzkjas+N/UPaK1XYs2l2bMZfxuwZ4TIKAJTr2KhtN/WP++98WDZ1j+NKrzeM2n5zj+FUl5E2s8k1n/ZKFfZsmh2bMTpqmssoAFCuP67BY5jqtwJoF7HWe+Lm4Bo8lMNdTQGAco2vyeMY41LSJtJar8Ob6HZwKQUAyjWkJo+jy6WkTfTU5HF4864AAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIAA0D5WrlmWLV+9pPRa17/WxYBBSHulCns2zQ4EAFrYw0/dk933xA9LryXLFroYMAhpr1Rhz6bZgQAAAAgAAIAAAAAIAACAAAAACACwSUO0gDbRowUIAPCSnbWANjFBCxAA4CXHawFt4gQtQACAl/z5SReP3U8bqLNY4/vEzRk6gQAAL+mNujEG5Ju0gpoe/gfEzfcy73dBAKAZ+tf1ZwPrs9Krd0hfNmrrka9W40dtM/LeD1++/10fv3Li16bPmvJ3UZ8rsk7/8h7HxCAeZ2XwisN5QlobRa+3tIbTWo41/ZNY27+INb7zq+2DtFeqsGfT7EAAoIU99fi8bM4jc0uvYSOGZtuM2frVa7utO0duM/zgIcN7z+jp6zo36rwiqyNeZYi2PBkD/5GoC6OGWyVte+iPiPpkWgvxn3PS2ih6vaU1nNZyrOlD09oezB5Ie6UKezbNDgQAqKPdo/466oE4AKZoR9sd/lPj5sGov8rXAggA0GZ2ivpBHAgTtaJtDv90rW+NGq8bCADQ3kZFzYqDoVsran/4p2s8O2qEbiAAQDMWWkdn1ts9JOvrGVZqpfuxCXtHvdeVqr3Tovba1Bote32mPbKZNQoCAK3njbu8JZu82zHZpF2PLrVGDN96c3fzZFeq9jZ5jdPaKHt9pj2S9goIANBch2pB7R2iBSAA1MWAFhRmWPrVMG2op7i2IzMfwgMCQI08owWF8kbA+urSgkI9pwUCAOX6rRYAJXhECwQAyvUdLQBK8G0tEAAo0ewZ8x6Om2/pBNBE/x6z50FtEAAo3/SoxdoANMGSqDO1QQCgGq8CPB43xwoBQBMO//8WM+dRrRAAqE4I+GncpM84/zfdABogzZZJMWvu0AoBgAq+EhD1Z/HlntmGl+guzTfttwuu9Cd1F+g4VMKCfE8Wvc//NZ8haZbsmWaLZ/4CANUPAo9EfSnqw/mmPaHgmhbfZlzUiZnPIYCyPBv1zrQX055swD4/MZ8haZb4lT8BAF4MGeuj0jOEQ/NBBDTPwqg3xx68Lu1F7UAAoIwgkF4SnK4T0FTTPStHAKAKrsk2vDsYaLxl+Z4DAYDSXwVYGzc+FASa48HYc6u1AQGAqjCQoDlWaAECAAAgAAAAAgAAIABQpvufuD27+5Hvll5Lly9yMdiotDaqsEbTXgEBgNroX78uW7d+bek1MDDgYrBRaW1UYY2mvQICAAAgAAAAAgAAIAAAAAIAACAAAAAtEgBOunhsZ9R+p395j3dPnzXln8uus66a9H/j/hwWNdbSAajMWTE2zeY0o6twVqQzK51d6QwTAF77xRwd9fn4ckHU/R1ZdnVPX9d7y6+ej8T9uS3qqbh/90adEtVh+wE0/ZzoyGfwvWkmp9mcZnQVzop0ZqWzK51hcf/+IWpbAWBwF/WouHko6uyo7Sq8/iZFzYy6Je7zNrYjQNPOiTRzb8ln8KQK39V0hk1PZ1rc56MFgM1f1MPi5rtRo1toLR4ZdXPc96G2JUDDz4k0a2/OZ2+reEPUDfkZJwBs4qJeFdXbgmtyctRFtiZAw12Uz9xW0xM1q0pPFqv0CsAZUTtt7B+6Oruy4X1blV5De0ds7v5/NC7sGHsToGFPFHdIs3ZT/55mdBXOinRmbcL4qA8JABu5tpv6h+HDtsoO2Pltpdde46Zs7v4PiTreFgVomOPzWbtRaUZX4axIZ9ZmvEsA+P9NqcHinGJ/AjTM1Bo8hslV+fXAStyJaMbW2Yafj7Q6PwIAaJxxNXgMXVU5K3wSYLF8JgBA49Tlt62GCAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAACAAAAACAAAgAAAAAkApVq5alj0072el1+NP32/FAFRUmtFVOCvSmSUAFGTtujXZ88vml15LVjxnhwFUVJrRVTgr0pklAAAAAgAAIAAAAAIAACAAAAC1DwDDXIqW11WTx9HnUtbW0Jo8jh6X0rysUwDY03poeTvX5HHs5lLWVl3mzK4upXlZpwDwTuuhdZ108dg3x82EujwcV7S2TqzJ49gx9tzhLmdLq8SZV3oAiIU8JW7OsB5a9vAfEjdfqtFD+kA8pomubO3W6aS4+WCNHtIX4zENdWVb1ulx/Q5q6wAQDTgmbm7M/EyrVYfqjnFzQ9SUGj2s9B6AG+OxHeUK12adpmt5U83mTAo0N+R7kNaT1uJ34/odXbkAEHeqL73E9N5Ldjnt7GumfrfQmj31e9NnTb7tY//yprmjtx99Y9ToqGxzNWLUiGx9//rSa+2ada009PaLOuHMmROvLPoaTp815Qcfnznx/tHbbzsnrs+Rr3b9UnVU5IdNI7camQ3i/o6JuiXW6Jy0VtOaLXwfqMbWS3MmrdFborZ9teue1kYVpL0ymD0VdUTag7EXf5P2ZNE9TLMjzZA0S1pl7qUZXYWzIp1Zg7h+6ez7fjoLGzVn0hmezvJ0pr9qAEhpMurS+HJh1I+jvtHd0zmt0OrtPLanr/uwoSP6xo/Yalg2mOobPiSb+7unSq/5c+ZX/dDvjkovYf8u/jP95aJv9Q7pPbXoa9jT13XkkGG9+43Yamj3YK9hZZ7eD+vNBnufY41OSGs1rdnC94FqbL00ZyYMes7E2qiKwd7ntAdjL+6b9mTRPUyzI82QNEvSTMlnS3eVZ2Ca0VU4K9KZ9RrmzPhGzZl0hudn+XPpbH/lK0adr3g5/oH852TDvULTci9zbpdf6K9m3skOFGu3fLbcls8aWsuI/Gx/ID/rXwoA+bu4vxO1tT615OGf3gz0/ahDdQNooEOibomZ40lia0pn/HfyMz/rjC/S614zo3r1pmV9OupN2gA0wQFRF2lDy0pnfXp/R296BeD0bBMfLNHV2ZWNGrZt6TVyyDYu2aaf/Y+Om49t6t+7Oruz7s6e0qujo6MS/apKP1T1Kq2NKkh7pQX68dGYPWNM4I1LZ1YVzs50hm9C+pHO/0wB4B2b+l/09Q3L9hv/x6XXXjtOsaI27e1RQzb1j/uMPzibusdxpdfIoaMr0awDdz6iEv1Q1au0NipxeMReqUI/9t/5sFd7Fnm88btx6cyqwtmZzvDNeGcKAD70pLVN1gKgBJO0oKVNTAHA6+utbXstAEpQxo8A1mh7YUb7c8DFer6E7+lTFIEylPEX7RZoe3EEgGL9RgsAGuZ+LRAAqmgg6tvaANAw12uBAFBFV8+eMe8RbQBojJixD6dZqxMCQJXMizpHGwAa7ux85iIAlG5O1NGRTL05BaDxrwKkWXt0PnsRAEqxIuofog6MBfmAdgA0LQSkmXtgPoNX6IgA8HK3R12Sbfi86qLr41H/PWrbWITnRC22jACaHgIWpxmcZnHUn+SzuREzP50ldwgA1ZfeIDI1FsXhUdOjPt2A+seoG6JW2oIApQeBlVH/kc/mRsz8dJakz0U+KD9jBIAKmhv1lrhQ99gSABQcNO6Om8Pzs0YAqJhz4wI9bZkC0KAQ8Ey24bcQBIAKWZb5gAgAGi+dNUsFgOqYE8lstXUJQINfBVgbN7X40Le6BIC1liUATfKCAEDlLVw6L5u/6NHSa83aavzSxDMvzKlEP1T1Kq2NKkh7pQr9eG7JkwZozQkANTd/0WPZ48/+uvRatXZ5Jfrx5MKHKtEPVb1Ka6MK0l6pQj+eet6fNmnrALB+fX+2fPWS0mvFmqWuFAAtIZ1ZVTg70xm+xQFg1eoV2X1P/LD0evCpu6woAFpCOrOqcHamM3yLAwAAUE8CAAAIALSgHi0ASjBECwQAyrW7FgAl2EsLBABKctLFYyfHzd46AZRg15hBh2iDAEDzD/++uPmKTgAl+j8xi/woQACgiYf/+Lj5Xrbh71MDlGVK1I0xkyZohQDQ7gdzZ9TUqFPPvHLi9edcM/XOQmv2lHvOumrSo2PGjXl8zNgxR0Rlr1auMLClp8NgZkzUW2MmPRaz6bE0o4qee2mWxkw9JZ+tJpoAULmDvyfqY/Fl+vDsn0Vd2TOk+/iuns5DCq3ersm9Q3t2HTq8r2voiL5sMNXh8gBbIM2Owc6ZNJNiNu2SZlTRcy/N0rgrM/PZ+mSatWnmukICQBUO/+3i5o6oL0XtqCMADbNjPmvvyGcvAkBph//QuLk5aqpuADRNmrk35zMYAaAUF0YdqA0ATZdm7wXaIACU8ex/q7iZrhMApTkrZvEobRAAmm1alJefAMozPOoYbRAAms1L/wDle5MWCADNNkYLAEq3vRYIAM3WpQUApevWAgEAABAAAAABAAAQAABAAAAABAAo2rrVWbZ21UDpNbDetWDj0tqowhpNewUEAGrjP/9pdXb9RatKryVPSwBsXFobVVijaa+AAAAACAAAgAAAAAgAAIAAAAAIAACAAAAAAgAAIAAAAAIAACAAAAACAAAgAJSlp4Tv2Wf5AJSut4TvOUoAqI6dTrp4bLMP5H3sO4DS7dXMbxZnTXrCuYcAUB0jok5o4gLYP24OtO8ASjc5n8nNks6akQJAtfx9LIIxTTj808tNX7fnACrja/lsbvT8T2fM5+vStDoFgAlRt8UFmtLAi79L3Hw/6hD7DaAyDk2zOZ/RjZr/6Wy5LWqntggA/f392ZpV60qvdavXZjtM2GEwtVfU3WddPfnZc6456OGoB4qpqQ9NnzVlQfz/fjTqrYO5L52dfsEC4HUfUjFLBzn/02x+NGb1/DSzi5v/Bz2czpR0tuRnzKvel3RmVeHsTGf4lgeAdf3Z/DnzS68lzy/J+ob2DLp6h3Rv29XTsWfUPsVU5149fV3bx//vjsHeh6zDxgV43WKWvob53xGzeoc0s4ub/x17pjPltZxB6cyqwtmZzvAtDgAAQE1fXdECABAAAAABAAAQAAAAAQAAEAAAgBYKAIu0AQDaysIUAH6pDwDQVn6RAsB1+gAAbeW6FAAuj3pcLwCgLTwWdUXn7Bnz1sQX74laqycAUGvprD81nf2//y2A+OL2uHl71GK9AYBaSmf82+PM/0n6jxd/DTD+DzfGzb5RX4tark8AUAvL87N93/ysz/4gAOQhYH7UB+LLbaPeGnVy1GkF1xlRn4q63TUBoM2ls/CTUe9vwHl7cn6Wb5vO9nTGv/wbb/SDgOJ/tCrqx1Gzoq4ouC6L+kzU4fGtpkUtdP0BaDPPRx2bzsKov466vAHn7az8LF+1sTtQ6icB5i9FHJd5AyIA7SOdedPiDLypzDtR+kcBRwN+FjeXWQ8AtIlv5mdfqarytwCutR4AaBPXVOFOVCUAPGw9ANAmnhAAXrLCegCgTfQLAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAIAAAAAIAACAAVMHaNeuy1SvXtlRlAxYXwOsWs7TV5n86swSAgqxZvSZbMHdBS9X69ettXIDXKc3SVpv/6cwSAAAAAQAAEAAAAAEAABAAAAABAAAQAACgVa0SAHKzZ8xbHDdrrQkAaq4/6hkB4A/dY10AUHP3xpPeSnxSXJUCwCzrAoCam12VO1KlAHBZ1BxrA4Camhv1VQHglZFoxryVcXNK1BprBICaSe9zOzk/6wSAjYSA2+NmWtRCawWAmkhn2rT8jKuMyv0aYDTo1rjZO+oLUc9aNwC0qGfzs+yP4mz7QdXuXCU/ByAatTDq7Phyh6j9o46N+tMS6+Soz2Ybfn4DQDXNzWf1ySWfGdPys2vHdJZFPVfFZlX6g4DSr0pE/SbqpqjrS6xZURfEXdor6iv2GEDlpNm8V5rV+cwu88y4MT+7+qvcMJ8E+NoCyaqoj2QV+jUOALKr02xOM1orBIBGmx61ThsASpdm8dnaIAA065WA+XFzp04AlO6OmMkLtEEAaCYfWgRQPm/OFgCazo8AAMrXrwUCAAAgAFAlh72vNzvuvCGl16gxljwbl9ZGFdZo2isgAFAbQ0d1ZMO3Kb86u1wLNjEMY21UYY2mvQICAAAgAAAAAgAAIAAAAAIAACAAAAACAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAAAgAFGbJ80uzZUtWlF7ZgGvxcqtXrKnEdVHVq7Q2eJmYHVW4LmmWIgC0lBcWvZAtfHph6TUgAPyBpUuWVuK6qOpVWhu87PyP2VGF65JmKQIAACAAAAACAAAgAAAAAgAAIAAAgADAllmtBQClW6kFAkCzzdcCgNI9pQUCQLPdrgUApbtDCwSAZvtR1FxtAChNmsG3aYMA0FSzZ8xbGzcX6ARAaS6IWbxOGwSAMkLAzLi5QicAmu6KfAYjAJTm/VGfz/zdPYBmGMhn7vu1QgAo+1WA/qhz48sDo1IaXawrAIVbnM/YA9PMTbNXSwSAqgSBX0e9J74cHbVjHggmFlyHRn0o6uc63nDL8mcZxzTgOqrmVLp2f59fSxrrV1EfjnpzA67jgflMHZ1mbJq12i0AVDUIrI9aEHVf1C8LrruivhrfZmrUZ3S7ocNsn/xZxvcbcB1Vcypdu/PStYy6z7JumL+NmhS9vjTqzgZcx/vymbpeqwUAIWNDyPhU5g2IjfB81LTo75NaUZv9kq7ltKhFulG4q6K/FzqcBQCa78IoG69Yl8Qw8ymP9QsB8+LmizpRqPRmvPO1QQCgvKF2r04U6t+1oLZu0IJC/SpmkI/hFQAokWerxTLQ6ssnd9orCAC14vMHiuVTxeprjRbYKwgAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIABQhIVPL8wWPbO49PIHC2Bw0l6pwp5NswMBgBa2fOmK7IXFS0uvbL1rAYMSe6UKezbNDgQAAEAAAAAEAABAAAAABAAAQAAAAAQAirBSC4ASrNYCAYByzdUCoATztUAAoFw/1gKgBD/UAgGAct0siQNNtiDqJm0QACjR7Bnz0s/hLtQJoIk+GbPH+48EgPKddPHYkVHviPrUmTMn/vTc6w6aU3Z96LL9vhP35/yot0Z1NTgEfDNurrCcgSb4l6jLGzzTu6LelmZomqVVmOnpbIn784moE9OZIwBU4+D/XHz5TNS1URd1dXcf1NnVMaH86vyTuD8XZxt+TvZ43M/3RXU0sB1/HvW3Uf3mE9AA/flMOz2edDTkD3ymGRl1Wnz5RNR/pu+XZmkVZno6W+L+fCbqunTmxP38bNQIAaCcw3983NwTdV7UkIrf3XRf07P0a+N+9zboVYD1UelHAftFfS3b8DM6gNcrzZKvR+0fM+YvohryJCOfjemJ3DeixlW8J+nMmRF1d34WCQBNPPxT6kpvfturxe76iVGXNvIbxOZ8KOoDUTvGf6Y+7dqAemPU+9LiNxuhVPfke/GNDdrrw9MsifpfUf/V4MdyaT4jW8kfRd0UZ9JwAaB5ZuSNb0Wnx2I5ohnfKDbs8qjHG1D3R/1zfIuDo/7KDIZS/E3UQWkv5nuyEXt9RZOe1L0lzcYWvQ77Rp0vADRnoQyNm7NafOPW4l376eeAUX8ZX840i6G52y/23ica9bN4M/E1Oys/mwSABjs6aliLL5b0mwFb1WgY+TVEaK4L6vJA8nfUH9niDyP9uPWIVrvTrRgA9qnBmu+O2rM2T0VmzJsTNw+aydAUv40991iNHs/u+UxsdfsKAI03piaLfvuaDaVnzGVoirp98ufWZroAMFhdNVksPeYYsAUGtMBMb9cAAAAIAACAAAAACAAAgAAAAAgAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACQEvprdnj6XNJoSmG1ezxbO2SCgDtZr+6PJCTLh7bEzf7uKTQFPvEnqtT4D7AJRUA2s37arSJ3xW1lUsKTTEi33N1ePKQXgk9zSUVANrNTlGXxAboaPENvFvcfMHlhKb6Quy9PVp8dnTks2MXl1MAaEcfiro2NsKEFty8nVEnxpd3Rm3nUkJTjY76SezBd6S92ILzIz0BujbqIy6lAFCYFxa9kC1bsqL0GjK0L5uw+7jB1IlRT5x73UErz7vu4KWtUOded/CyCbuPXx33+7qoMYN5nKtXrq7EdVm9ao1dz0altVGJNRp7Zdwu4wZT20VdO37XcavOvW7q4pghi1qhzrl26rK4309EnTiYx9nb11uJ65LOFgGg4pYuWZotfHph6dXZ1RHVOdjqiP/9kI6ubEQrVGdXNjzub/dreHzZyuUrK3Fd1q1d56Rjo9LaqMIaTXulu7dz0NXV09kTe2yr2JNbt0J1dXcOfy2Pr7unsxLXJZ0tAgAAIAAAAAIAACAAAAACAAAgAAAAAsBgrXTZaKC1WlBb/VpAAy0TABrvKeuMBlk+e8a85dpQT3Ftl3oCgbOptQPAXdYZDXKnFtSe+YG11cIB4N6oh601GuAqLai9q7WABviveIXpFwJAg0WTB+LmAuuNgj0YNVMbau8KTyBogL9oxTvdkr8FECHgX+PmMmuOgqS/8vHuWFf+UEDN5df4pKilukFB/inW1fUCQHN9MOoSa4/XaU7UUbGBf6UVbRMC0ku1R0U9qRu8Tp/PWvhPGne28Cbuj5oeX06N+lbUKmuR1+B3UZ+I2jfW0T3a0XYh4O642SfqU/lagMFalZ85U2IdnZvOIgGgvI18T9T/iC9Hp2Ee9baoIwqu46JmZBt+Tkxjpc2U3qh1av4srehreWjU+Fgze0T9jV/7a+sQsCzqM2ktxH/ulK+NotfbUflanpn5HIJmeDCf1cc14Fq+LT9j3pDOnKh7W71ZnTXazCuiHoz6UdQPC67vRX0uvs0BUZ+1xxrmyTxVnxJ1VdStDbiWd0X5LAleOT/m5muj6PV2a76W3xPfZlLUE7rdMGk2H5BmdT6zi76WP8rPmNp8loSPAn5tQ2JdVPoNhG/oRuHWRB0b/f2lVlDT+XFf3EzL/LiyES5Ls9kbeQWAZjg/P7AozuWxeX+jDdQ8BKSXqL+uE4U/eZihDQJAszbxc3HzE50o1Le1gDZxvRYU6vaYyQu1QQBoJr9CVCw/G6VdzNWCQnlPjwDQdN7RWyw/F6Vd+IuTxVqvBQIAACAAAAACAAAgAACAAAAACAAAgAAAAAgAAIAAAAAIAACAAAAACADt4/mnl2RLnluq8lq53Ef9w2CsWrE6W7ZoucprccwPBICWsnzZsmzx84tVXmvX+vsnMBhr1qzJFj77vMpr6ZIXLAoBAAAQAAAAAQAAEAAAAAEAABAAAEAAYAut1oJC9WsBbcLvxBZrpRYIAM02XwsK9YwW0EZrfUAbCvOUFggAzXabFhTm7tkz5nlFhbYQaz29AvBTnSjMHVogADTbj6PmakMhZmoB1jxbYI4nYwJAWSn+Ap143R6N+qo20Ga+HvVbbXjdLohZvE4bBIAyQkBK8d/UiS2WPuT7ndHHNVpBm82OtObfle8Btsw3o49XaYMAUKYzov4u86aeLXnmf2Rs4Hu1gjYNAb9IeyDfCwzeQD5zz9AKAaDsTdwfdX58eUDUlVGLdGWz0tA7K2pfhz/mx+/3wL5RZ0b9XEc2a1E+Yw9MMzfNXi0RAKqyke+Pem98OTpqx7RIoyaqF2vvqOHRo0lRX/Suf3hxdqyO+lLU5LRH8r1iZrxUaZbukGZrmrFRv7ZqCgoAAwMDmSquZp3/1EDUgqj7on6pXqyHo1ZYI0ptdn6syPeKmfFSpVn6dJqt1kix5RUAAPAjAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAABAAAQAAAAAQAAEAAAAAEAABAAAAAAQAAaCv/D651goW1Yu0cAAAAAElFTkSuQmCC",
  "discor.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURVdl8v///1Zl8lZk8VZk8e7w/fj4/ldk8lZk8VZk8lZk8VZl8ldk8lZk8VZk8aSr+LrA+WJu8rG3+GZy84SO9a20+MXK+ldk8pOc9ldk8d7h/HaB9Gt38+Tm/Fdl8Vdl8lZl8VUA9gBl/0dwTEdwTCQujVkAAAAldFJOU///J+z7///2zdQQCo6cXP//////////Mv+e/////56envv/AAADM8XgAAABK0lEQVQ4y4VT2baDIAwMKIoriktdansf+v/feMFE0VoP86BhHIHJAp8daVnIIAwDWZSpY2EL+CuGHfGbfwmyPIQTwjw7CngCFyTcCR4B/EDw2AT853ej4CjIErhBkq2CHG6RWwF3969r90Qv3AhGWjRqYn07DG3PJtUQ+feBlPLTCHaAIEWcQknaip1QEV1CgcEzOguiJ/IFSAw0+4JGXgIlab2BWLeJMKZkAZqc8ad6YWypcbsZjZJgsJQ5tmOsMxeyq4EEeERnqRagZ6wHaO2qoyOkMynU+qqUcEYl2azYBRXZLPcjop5ygUFHiaJUK8Mtc6u0Vu1svERqS/VWrEaLaSviJDTV4nUq917m5lRub8P4W87btP629w+Of/TsJuNxeEd+me678f8HQVYjIhOHP3oAAAAASUVORK5CYII=",
  "gf.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAQAElEQVR4Aex9B1gU1/f2FnpHQOkiKF2QDiIooMaexJaYaGzRKJbYNcZYYvwZSzR2oyYae+81sdKkF5HeO9JFev1Ost+fB82yzB12YcvhuY537pxz7rnvmXfmlplZ1ppHDEyIgMQiwGLgHyIgwQggASQ4+Nh0BgMJgGeBRCOABJDo8GPjJZgAGHxEALtAeA5IOAJ4B5DwE0DSm48EkPQzQMLbjwSQ8BNA0puPBJDEMwDb3IYAEqANCsxIIgJIAEmMOra5DQEkQBsUmJFEBJAAkhh1bHMbAkiANigwIwkIfNhGJMCHiOC+RCGABJCocGNjP0QACfAhIrgvUQggASQq3NjYDxFAAnyICO5LFAISRACJiis2liICSACKQKGYeCKABBDPuGKrKCKABKAIFIqJJwJIAPGMK7aKIgJIAIpAibQYOt8hAkiADqHBA5KAABJAEqKMbewQASRAh9DgAUlAAAkgCVHGNnaIABKgQ2jwgDgg0FkbkACdIYTHxRoBJIBYhxcb1xkCSIDOEMLjYo0AEkCsw4uN6wwBJEBnCOFxsUZAjAkg1nHDxvEJASQAn4BEM6KJABJANOOGXvMJASQAn4BEM6KJABJANOOGXvMJASQAn4AUKjPoDGUEkACUoUJBcUQACSCOUcU2UUYACUAZKhQURwSQAOIYVWwTZQSQAJShQkFRQIDURyQAKWIoL1YIIAHEKpzYGFIEkACkiKG8WCGABBCrcGJjSBFAApAihvJihYAYEUCs4oKN6SYEkADdBDRWI5wIIAGEMy7oVTchgAToJqCxGuFEAAkgnHFBr7oJASRANwEt0GrQOG0EkAC0oUNFcUAACSAOUcQ20EYACUAbOlQUBwSQAOIQRWwDbQSQALShQ0VhQKCrPiABuoog6os0AkgAkQ4fOt9VBJAAXUUQ9UUaASQApfBtG16/Y2QrJkEgQCkAAhNCAggMWjQsCgiIMAFEAV70UdgRQAIIe4TQP4EigAQQKLxoXNgRQAIIe4TQP4EigAQQKLxoXNgRQAIIe4S4+YdlfEMACcA3KNGQKCKABBDFqKHPfEMACcA3KNGQKCKABBDFqKHPfEMACcA3KNFQdyDA7zqQAPxGFO2JFAJIAJEKFzrLbwSQAPxGFO2JFAJIAF7hUpDW1FdxGthnSnDOkcdpW+8mrbwev/BWwpI7SSvuJ697lPrD47Qfn6Zvf5G5OyzvZFrZs7KajOaWJl4W8ZiQIYAEaAsIs7eipaPu7PFm+2YOur3cLfZH73ebvIqXuIZOt718P3nN32kb/bP2hOQeDco5GJC190XmjqfpP/2dtulR6vr7yauvxs05Fu69I8D4+8dy2/2MjoYNu/x61tP0/wErGpqq2+rAjLAhIEIE4D90cIE31xw30mTr1w5/b/YqX+keN8X6jyF9l1r2Hq+tbC0rpUSjylZGc0VdVkb5i4j8Px+lfg+s2PRMbX+w462EpTGFlyrqcmjYRBXBISCJBNBRsvU23rDIJWTjsKLZ9nd8TDYM0BguL60qIJRbWpvyKiOCcg6cf/X5dj/DHf4m95LXZFeEtLa2CqhGNEsdAUkhAJspa6Y55hOLw995Zi8bHP1R/62Gqs5MJpM6UvySLKtN98vcdSjUdbtf39uJyzLKA1paW/hlHO2QIiD+BIBR7CfmhzYMK5hjf8/NYKGanAEpRgKSf1ufE5i972iYx/9e6D9MWV9emy2gitAsDwTElgDKMjqeRqtXDI6DUayboa+CtDoPFHr20LuGgmcZ23f4G5+Onpha+rRnnZG02sWQAMbqXjCNs35ozljTnX2ULEUloq2M5riiG8cjfH4JtHyZffi9uSNRaYMI+ik+BGAzZex0ZnzrGvWN01OYxmEx2SIYjn9cLqpOuJm46OcAY/+sXxub6/4pwn8CQ0AcCCAv1cur3/p1npmfDzytqzKIX1jB2LSyLj+r4mV0wUU3A1+YOBo9YAesEow13f1R/23DjTd59fvOo++KQdpfGKi6KEpr8atejp3qhqK7Sct3BvR/mXOkqaWBU4hbviMg2gSQl1If2f+n7zwzRw3YpiKr0xV04HR/UxUfnvfnjYRFv4V57/A32fBYfpuf3uHQwRdip4023QETR8P6rRnSd6mn0Upv4/Uj+m8eNeB/48x+mWZzbrFL8Eavoh+9K791i/7M+oyz3jwtBXMGP/4q6/NuJvjuCjANy/sDPOSHSbTxHgKiSgBZtgpcg9d6ZPgYfy8rpfxemyjvNLc0ppY+uZ+89rcwr01P1fYEWV2JmxWcczi9/BlMVja3kl13wQ1dZVt73emTrI6tGpLww7Ci6bbXnPXnK0hrUPaIuyCsrF2Nm3swxDn7bSh3CSyli4DoEUCarcjp8MA1mN7qVVV9UXjeqTPRkzc/0zgeMfxF5s708ucNze/oYshdT0lGa2CfiZMsf9swtHC23X0H3ZmybBXuotRKYTXtUIjrtbj51Q2l1DTEQUrQbRAtAjAddGetGZICHR4a05owoIwqOHcs3OenFzpX4ma/LrrG95Oea7TYLClzrdFTrU9BN2mK1UlYh+YqRq2wNTTv+O5As5DcY624kEwNMt5SIkMAIzWPJa5hU61PqsgS9/Vz34bfiPeF8/5i7PS0sqetjJ5ZeZViyTrqzVo2OHqewxMLrfEMBs116JrG0uvx3xwL9y6vzWLgX9cQEAECqMsZfWlzeaGzn76KA2ljE4rvHQ4dciDEKTj3SF1TBam6gOT7a3jPsru9fHCshdYE2lWklz/fG2QTlneStgVUBASEmgAsptRQo7Ur3eNttKeAr9RTS2tzdMGFvUG2p6LGZVUEUlfsTkltJatZdrcWOgX0VXOnV299c+XVuDmnoj6GUQ09C6jFEloIDFXdlrpGjjH9WZotT+RkXNEtWEy9EPtFYdUrIsUeETZSd/d1Dphhe11VVp+eAwnFt/cEWaeUPqanLuFawkgAOSnVTy2O+DoH6igPJApPXmUkTGiejv6kpCaZSLHHha37fLrSPcHd8Fsmg05EqhuLf4/46EnaT604MmaQ/dGBm6wGQmlTjVErBse5GixgMgnGiDWNZVdez9kf7Ag9Y8IKhUVcVkppgvmvi11CtJVsaPgEI/u/0n44GTUOoKChLrEqQkQAGbbyRMtjcx0eqMrpEcUjpvDy7kCL8HwYDrYSKVIRhmUsQ1XXuKKbYXl/+Gfu/Tt1853E5UC2i7EzrscvvJe0+nHa1oj801kVL6saiqkY5C2jr+q4xDXU3fBbBoOA/4z/+0squb//pUN+ZfT/FeD/nSAgLAQwVvdaPviVi/68Tvx9/3BlfcGfUZ+cf/VZdUPR+0do7jEZrD6KVk56cydZHl/kHLzJq3STV8kil5eXYmdcjZt7N3nF4/QtAdm/AtmiCs6G5B71y9r9d9rGy69nHg4dvPV5720v9M/FfB6Ufai4mn4fDGZL4VYwx/6+kkwfBvlfeV3mkTCP+KI75KqSqNHzBGAxpccM2Dnf8UkveSOiCCQWP/g1yDa++BaRFldhuPnYak+bbnt1s3f5CvfXk61OOOt/bajmoiDdi6t8R4WV9Xmv3ly6lbgY1qr2BA38O21LWU1GR8K8y800Ry1zi4HVD95iXI82NFfBQMg/61euR7GwPQI9TIBe8ia+zoFD+61mMgnu+M0tjdD3OBk1trqxS70OeSl1B92ZMwfd3uRV/IXN+YF9JslJdelphfbIvql6/Tht886AAXBPyK2MaH+o0zxHQFm2D1wXXA18ObtEWxgS3E1afiPet6W1mUhR0oR7kgB2OtOXuUUZqDoRgQ7dnqNhntD3YDBo9vjhnjNI+8u59o9+GPZmqvUpy97joddB5AN14VZGM9wTDgQ7Hgv3SSp5SF2RI8lmSX9qcWiS5QnwmVNCtA3OPXIuZmpTSz2RlkQJ9wwBpFhy0Mn+fOAZWcIHOXPfhh8Idsp+G0wvSIoyvYcbb1rvmT3N5qyp5kg4vejZoaGVVvb0j8jRB4Kd8yqjSNWd9efOtr8H/TRSRZB/XXT9ZOS4+qYqyGP6LwI9QAB1+X7Q7YFO9n+94V0SU3jpSJgn9LN5i3E9qiSjPc50z3cemSP6b1aW1eYq0w2FuZVhQOC7SasaCL+WZaoxYqGzv7KsLg0nU8seHw/3welRrtB1NwHMNMcsdY3QU7Hn6g2PwoCsfedfTWtqqeUhw/WQnJTaWNPd6zwyPIyWky4qczXYxULoFPln/fJLkFVi8X0iU7rKtr5OAXD5INLiCOdUhh4PH1HTWM7ZxW0bAt1KgGFG62bZ3aHxJPPDlPV3kpaRdvpZTKnBBovXDEn1NFopzZZra7MwZCrqsmAQD7cCokFqL4V+C5z8NBQG0GhC/rvI4+HDhZ4DNFrWJZVuIoAUS37awAujTbezmMQ13kpY+ixjO2krDVScl7iGf2xxQFFGg1S32+ThVnA8fATRCpqanP5CJz9NBVMaTgIHTkSMqGuqpKErrirEpyMNIJRldCBmg3Q+p6ELZ39QzgEiRWmWwgTz/b4uL6HPQKQIwnA9hmXUl9mHL8Z+dSx8+P5gx0Mhbr9HjJpgvg9uJv3UPaFDBWJ8TOnlzw4EO+ZVRlK3CWOYeY5P1OXIlk049vMqI05FjW9sJu5JctTFbytwAmgrDVzsGgIr/DSwg8l+0rPfQNXlW7cod8MlpLealNLHf0Z9uump2r5gu5uJi6IKzqSVPYHTBWackksfOerN+djiwAKnF1u8y791jYK+XC95Yxot4qpSUZd9NGwoOMD1KNdCuA8AB2Bkz/Uo78KMcr+zMVOb8TPu/8IkWAKY9PLxdQ5Uo/U1wucZO/6d7P/XTUobpqfR6oVOAVqKBN2DppYGuN7/EmgJfYP44psNzZ1PF+qqDBptun2tR9p8x6d65O/ocG0K1AuTlQnF97ge5VqooWA8x/4+vbnRxJK7NxIWcjUraYUCJICt9rS59g9IZ/o5AYjMP/sgZR0nT2UrJ6U6y+72WNOdbJYUFXmOTFLJoz1B1nC9L6pO4JQQbU16eS1xCfvM+rSCtCaRIlfh5tb6M9ETk0v+4nqUa6Geit1028tMBp1PgIXlnXiaTjyyYojdn6AI4GawaNrAc2yWNHXE2iQzywOvxn3dtttpRlPBbLFLqIXWuE4l2wTe1b85Ez3pj8hRpTUpbYU0Mkwm0153xmKXkN6KFjTUP1Bpbm04HTMRFvs+KOexa6Y5aqzZbh4CPA49Sv0+vug2DwFJOCRAAsDJQQPByrr8MzGT4XJIURcGpotcgoi6PellL/a9tIMlUopVdCoGvRFf55fG6sM6lexUoLG5+j7JrQ8MevRdpqNkCxny1IqzooIiQHjeH+TxYLS0tpx79XlVQyFFXUutj+faPyJ6ZvNF5u5j4T7vGgooVkFRTF5adabdLW0lslfY/mt8QK8RM2yv/becR0lUwfmCqhgeAh0d8jH+wVFvZkdHJaRcYATIP9VI68OuJZT7JDZ9pk63enbedAAAEABJREFUvUp9hQvYdSthyf3k1bAWK4joykmpzLa/B3O+tI276C+YbX8fuETdQuG719fi51OXb5N01J09sv+PbbsSmxEUAWoaS6ILL5DCCnOXg7SpLhd8bHGQTXnI29LafCl2RlDOQVKXiORhvmu67RUmgxhVUBlntnei5RHqLWIwGNCBOR39KfSaIE+UzDXHTbQ8RqQirsLEoaIORGDWPurCbZKOerPb8rwzySRPF1+NmxtdeJ63Qb4cNVJ3H9ZvLZEpGbYSdJ+gK0+kBRP5Z2OmlNamEmmBcD/1odNtLxMxDbTENQmQANAxJVrc4UCso2xjoOLMyfPeRhde5C3Q/mhqN/7yynCTzTrKVL/SriprAEslRFNYnHbdTlyaVvaEk6e+1VNxnG13R5otT11FvCUFSAAA7mn6/2BLmlwNKL0DlVL6V2U91bGsjfZUUjdoy0uxZKZan2JSmJ7XV3Fa4hoKnGcQ/sFQPjj3CKESQ0fJ9muHR/RWZkjrEhV5wRIgvfxZdkUIKRaDdD5XlOndqVZLa1N43qlOxTgCDrrdOt2hq2zr3ncpp+qOtgP7TF7g9EJZlvjlhJjCy/eT13RktqNybaWB8xwfE82YdWRKnMoFSwBA6kn6T7AlSlIsWVf9BVRUQnJ/a6H2zquO8kBDVTcqNvklM9LkR1XZDj/25tVv/Zc2l2l0RaBXCaN50ifD+yhazXN8oijDhxVrfuEjJHYEToDEkrtZFS9JW+tuuESardipVkVd1us31zsV4wi4G3ZySeaI8WsrK6U03pzLdxnYTJkpVqdGDdhGY6Ew520YTPs0E/5yh46S7XynZ0oyfP4RJ/4A1dNWBE4AaODDlPWwJUpwrXLRo/SNIL9Mqg8C2GhPofc6FZHn7YUH9pk0QGNk+xIFaY2vHf6mt/yU/y7m94hRDRQe12tfIwwz8OxvD8gH+e4gQHr5c6JnvDguehqtYjNlOXke25zK0CRq86EsJtu73/c8TAni0Mfm+1nM//9AlKaC2SKXYONenjQqggWv4+HDa5vKiHSN1DzmOz5RkFYn0pIo4e4gAAD6MHV9K+F3W1Xl9NwMKD2y+zjtR6iCSnLUmwW9YSqS/JLRUjTz6LscrJn08l7sEqyp0B/ypOlNVfyxCB9YWyRSNNMcM9fhoSzhdzeIqhAD4W4iQF5lRBj500Fexutl2Mqdopz99uXrNzc6FQMBuAmMMd0Jme5MPsY/DDNaN9f+oby0Go168yojj4YNrSb89qOD7qyZg27JsBVo1ChRKt1EAMAUbgK1jW8hQz3BuM2z7woq8jAt2NzSSEXSXGsMXIypSPJLRlZKabTpdjZLmobBzPLAY+HepNd+4NtU65NslhSNGjkqSSUPowq6Y+GcU10PbruPAHANe5Levq9CqdWeRiuVZTr/UbDS2tSgbKrP+XxqcUSaJQKXRjgLT0SMrGsiuGowGawJ5vuBb4wu/AVmHzgZOe5i7JdnY6ZU1uV3wZIIqHYfAQAMQLaoOhEy1JOslDLFTstfaRvLa7OpWNZSNKX9EgkV+3yRCck9/s/b6y011K1Bd3Gm3W2YQaau8oFkc0vTjYRFtxOXch6YjX1zdVegGaw6U7y7fmBNJHa7lQAtrY3X478hHQ3b606H2YxO0YT5wRuU33OF4bWZ5phObfaIAODzIPm76/HzW1qbqDugLme0yDnIQmssdZUPJKGDejJyTHDO4fblgOr95NV7g2yI3ldub0HI891KAMAio9wvOIf4IZZPLA4yGZ2/+ZpUcj+q4ByD2t8Uq9/58i4vtdqoStU3VZ17NfV55s9UFf6V66vmvtg1VFvZ+t89OpvSmrTDoW4pZX9zVS6uSTwVNe54+IiCd7FcBUS3kNX9rt9PWUexr9Lmm46yjce/k4ltJR1lbsT7ltakd3S0fbmyrPYM22tSLCF6LhL6hwdDnKHj0d7PTvPO+vPnOz6FCYNOJTsSyCj3Pxji0umXAVLLHu97Oehq3NeVlJ9B7KhG4SnvAQI0NL+7Fk9plbc9TCP7b+1N4cXz+ubKc68+o9hnhTWp6baXWUz6syXtPSTIcxONfXPtQLBzp2dhe1VplsJU6z8nWf4mxZJpX06UD887dTx8eE1jKRWtVkZLWN7vOwMG/J26uYHw+75U7He/TA8QABqZUvpXWN5JyFBP0my5KdaUnjHOqwy/l7yaomULrXFTrMATgp/noGiZuhh0e67Ff3M2ZjJcGqhraSqYLnYJcdD9irrKB5JwmbiduOxK3Ozm1oYPDvHebWyufpy+ZWegKZCnpbWFt7CQH+0ZAgAotxO/Lakhe5vJUNWZ4stWgdn7QnKpvvJnrzt9gvk+cKlHEsz0//pyUChlbzlODuwzZalruHYXOv0wv/lbuBcAxTFIY/uuPh/IcyDYMb3Mj4a6kKj0GAHgancu5rOmFrJrz3CTTfoqTlSwu5mwiPoDSDB1OG3gBRm2EhXL/JKBLsS95DVHwzzLatOo25RhK0+2+gN6brJdeMYhrez5vmD7rIpA6vV2JJn/Luq38KHnX017W5fXkYwwl/cYAQCU/HeRMMUGGeoJOrvTba8oSGt0qtLS2nQ2Zkr+O6rfCxmk8zlcU/soWXdqmS8C0QUXYIrdL3MX9KqpG4Tp4OWDXzlRfm2aq+XnGTuPhw+vanjD9Si9wpjCi/82Z4/I9Yh6kgCAdWD2/riim5ChntTl+34+8CyT0bnnMCA+Hu6TX0n1R3O1FM3+7VUL9t2xvMrII6GeF2K/qKwnuGSymTKjB+z4xul5L3k6H4Vm/PtX11R5Onrig5S1nHWuf8v4toGBwb3klYdD3N5UxfMwKmyHOj+NBO3xlddzSGdFzTRH+Rj/QMUxmNw4Fu6dWxlBRRhkZNgwr3LqM+vTVJ6/AHmilFkR9Efk2P3BDpkV/kSKBqouS1zDh/Vbw2LSj1fBu9j9wY5xRZSeGiRyr71wTmUo1BKZf6Z9oTDn6QPKr1bVNpWfjv60gXBOzcdko4XWBCo+1DaVwx0/ozyAijBHxl53xhqP1JEmW+WkVDklXdk2tzTBMurRsGFHQt2TSsh+FkleSn2i5W+LnF/qKHfpm3NheX8cCnHt4odQKYLQ1FInQjeBnicAwAqDgQux04m6j3At/NLmIsXXfOuaKqAvFJp7AuqimOBW4GOy4fuh+ZOtfqc47P6v5ey3obcTv93mpwfLqBnlL/4rwLvEQXfmqiFJLvrzabw82Wb5Xf2bU1ETrsbNbSR5rKhNnTQjJ6U2c9DNLj6NR1ppV+SFggDQgPjimw+Syb4nJc2Wn2V3R0vBHNQ7Tc2tDdfi591KWArX406F2wSABk56c5a4hu4Jsr4UOzMs72RZTUbb0f9mgMPQ0wjJPXb59ayf/Y0PhbjAIKea8FF+MKurbLfAyW+q9amurO+CHVhcA88Tiu9AvhsSuL3UNcKyN6U7czf4Q6UKYSEA+OqXtTuU5CINKooyGnMdHlLvrwflHIAhQWkNwbQj1AKpojYrsuD01bg5OwKMNz/V2B1gAQPZM9GTYAHrWtx8GFnC7i+Blpueqv360uZ6/DcR+X+W1/KiCtjkmjQVzL60uQynUT91D64CFAtrGysuvJp+NmZyTWMJRZWuiDEZrCGGy3ydgzQU+PbDOYxu+etGAlBoz40E31TCT7jBpNBch0eK0lQ/eQAD0L1BNgFZ++BqTcEjLiK1TWXFNYlg53XRdVjACs07DiNL2C2qTmhofsdFgVqRmlxfmOBf6R5noz2lK30eqA0WQPYEWUcXUn0uEFS6kuAmvNA5YLz5Xmm2XFfs9IiucBGgpbXxTMykPJJfjAPUYIC4wNlPteOP8IBM+wS94TtJy46GeRZWxbUv76l8L3mTCeYHVg9Jhgl+FrPzh155+NnQVH0jYdHvkR8RzbHyMMj7EIspNcxo3bLB0X3VuvWbS7y9IjoqXAQA1+v+GbCOoD55DyqQeiuaL3D2hzMJ8hRTVkXgr0E2F159WVLdpR+JoVgdNzGmqcZHs+zurhmS4m64GNb4uMkQlCUU39370jb4/Qf6CfQJRWEGApZNYLwrxZIlVBUicaEjAGBT21R2PGJ4wbtXkKeeYIVoobN/H0Ur6iqtjJbowvO7Ay2uvJ5D+mAS9Vr+KynDVh5ssHiVe8Jch4cWWmO72OEB+2+qEn6PGHUqanwZyVMVoEgvqcoaTBt4fpFLkJ6KPT0LwqMljAQAdGoaS2HyvpCwi6Iiq/ON0wuTXj5ggXpqZTSH55/cFWAKU/Uwz1Pf1PkPRVI33l4SJvXtdb76atDNjcPefGxxABae2x+ll69pLL+duAxG3smlj+hZINKSZimMMNmyekjSIJ1pRIpCKyykBAC8qhuLYcbmTRXZ7zfCvNDXDo+gY8pgkD7h3ApT9TDPs/WF9sXYr14VXoUZdAY//lRlDVz0F8x1+OuHYUWfDfzTqvfH0mz5rhtuaW1+mXNkV8CAwGwY0BO8PEmvahZT2llvHgxUhpts5Iv/9Nzgu5bwEgCaCjPox8K9cik/yAAqkGAcCR3TrwZdl2WrwC5pamyujio4c+7VlJ9eaO8KMLsaNy8y/0xvJUu4+FE0BdOyFlrjh5tshv79hqGF64dmT7Q8Yqoxgs3i25s3qaVP9720u5ngW0PtRRaKnnMVYzGlHHXnrHZPmmR1TFVOj6uM6BYKNQEA1qqGN0dDPeOKbkGeKFn1/mSJa1gXn+4sqUkOyztx6fVXi11CfhpevWFowULnwC9trkyxOvmx+cHRA36G/sA4s71Trf+cZXcHDq10T9g4rGTDsPxZdrdHmGyC/r2ybB8itzsVzquM+jPqk+MRPoVVAn89l8lgQ59tlXviFOvfeyn0Y4jjn7ATADCHWcsz0RP9M/dCnihpKZoudY0YYbKFzeTPNIWyrLaR2mAb7cmOerMGGy4a1m8t9Ac8+i5z0P3KQmscHOqtaA59MCInqQtnvw09GTl+f7B9fDHx5YB6LRxJKZa8i/6CVUMSoc+moWDCKRTLrQgQAHCH6Zq7yStghhs6vrBLPUmxZOAcXTE41qSXN3UtYZNMLX1yIuKjQyEuiSV3Be0bLCkON9m83vOfbhu9L5kK2kP+2hcNAnDaDDPcp6LG1zcRr7ZqKg6Y7/gEOipC+B0UTtO4bhuaqmGY+0ug1fGI4Smlf3GV4WOhpoLZpxZHv/PMhs6bIt9+SoOPDgrElCgRAABIKnlwMMQF+sGQJ03QUVkzJPWj/v+j8vtLpMb5Kw9rIDC5uc1PD4a5RdWCfb+ExZSy7j1pnsNjWJdwNfhGWgQfZ+gK+CJGAGhqUXXCoRDX5xk7aTzMIy+t6m383XcemRPMD6jJGYI1oUoVdbnQrr1BNr++tA3M3ldH8lVQGg1RlTUYYfLjd57ZMwZd7a/h0/X1OBo+9LiK6BEAIGtubXiQsvZ4uE9FXQ7skiZptry74WK4G8Bkjp6KA6k63+VLqlP8s379LczrZ7++0C5BT6xWHe4AAAerSURBVO/AAHdgnykzB91e55kx3OQHWD3ke4tEyKBIEoCDb3r5c7hYxhRe4uySbtksaZjMWeoavmZI2ugBO/RUHEktdEW+oak6pfTx3aSVuwLMdgWa3k1aDs2BsX5XbPLWha6Oqcaoz6xPwzr0dNvLlr3Hw4IJbxVJOCrCBIDw1DVVnH/1+cXYGVX1RbBLL2koGA/rt2apa9haj4wxprv6qXvKUPhVDhp1lddmA11vJSzdH+y46ZnaiYgR/ll7YKmBhikSFaaR2pBPzA/BIsZchwf2ujNku/A9FZJ6RUNWgAToNgCiCs7uDBjwLOPnxua6rlTaS95oqNGqBU4vfvR+u9o9+Qubi0ON1g7QGAkzg6RmaxrLCqviEovv+2X+cuX13EMhbpueqv3s3xfoGpRzIK8yooXky8+ktXPkdZRs4c62ziNzobO/m6Gv5EzscJpPcSsOBICm1jdXPkz5bnegeXTBhVbCHyMD9Q8SDAc1FQfYan82xvTnrx0ebfQq2u5n+Eug1bHw4edffXE1bt6thCX3ktfcT157O/Hba/HfXIqdeS7ms1NRE+BE3+5ntP5vuS3PNPYGWZ+MGnsveVV4/h/Zb4PrBDyibWuChnx/b+MNKwbHLxscDXc2dXmhG+u3uSoMGTEhAAfKirqsC7FfHAp1y6wI4pTwa1vbWF5UHZ9W9iSm8EJY3omgnIN+mbteZO4MzN4fmnsssuD0qzeXE4rvwIkOPjS31vOrXop2pFhycKcaZ7oHzvs1Hikf9d/aR8mCoq6Ei4kVATixzHkbciTU/WzM1Ny34ZwScd1qKAxwN1w62+7+Zq8yuFN5GC3H85401mJIAA4EsW+uHAhxOhjiGpl/lvQLpBwLwrmVZitaaI2HQS1MXq0ZkjzBfJ+51miY2BVOb4XfK7ElAAd6uBtcej3jf34Gj1I2VNTlMrrpj8/VMBlsXWU7T6PV8xyewMV+lt1tN0NfDQUR+/4CQyj/xJwAHMyrG4qeZmzb4d/vTPRkmH1vaW3mlAvzFq70Jr18fIw3znX4a4t3+bdukWNNd/bX8JZiyQiz2yLnm0QQgBOVltam10XXYPZ96/M+MDWZUHyvqaW7R6scT7huYaFKR3mQk97cTywOL3EN3+JVMd/x8cj+W0w1RuDMPVfE+FIoQQRow6umsRSmJk9FjdvyTPP3iNEvMnbBcLml228L8lLqfdXcnfXnwxm/yCVkq0/VMreoyVYn3AwW6qs4sFlSbQ5jRnAIsARnWvgtNzRXJZc+vJ+yBobLMHMP0/x3k1ZFFZx7UxXPXz7ANKWWgrmpxihXA98J5gegKw/rspu9y3ydAyZZ/uZmsNBQ1VmKxZ+3doQfdqHyUKIJ0D4SsFAF0/z+Wb9cjJ2+J8jq+8fyO/z7AyVg2etJ+jYH3Zk2faaaaY42UhuirWSjLt9PQVoTTmsZtrKitJaqrL6GfP8+StZGah7WvSe66H/jbbxhvNk+WEv2dX4J5/q24bWrhiTMdXjwqcUhd8PF0JVXltVuX7v45EWtJUgA7hFraW0sq00DSsCy11+pGz62OPil7aU59vcXOvsvHxyzziN9k1cxnNZbfSo3ehWtH5oDy08rBscudPabMejaRMujH/XfOqTvUlhL7qvmiuc6d4iFoxQJIBxxQC96CAEkQA8Bj9UKBwJIAOGIA3rRQwggAXoIeKxWOBDgIwGEo0HoBSJAggASgAQtlBU7BJAAYhdSbBAJAkgAErRQVuwQQAKIXUixQSQIIAFI0OpIFstFFgEkgMiGDh3nBwJIAH6giDZEFgEkgMiGDh3nBwJIAEoofv9Ydu1fTEyCQIBSAAQmhAQQGLSSYVjUW4kEEPUIov9dQgAJ0CX4UFnUEUACiHoE0f8uIYAE6BJ8qCzqCCABRD2C6H+XEOgCAbpULyojAkKBABJAKMKATvQUAkiAnkIe6xUKBJAAQhEGdKKnEEAC9BTyWK9QIIAEoBMG1BEbBJAAYhNKbAgdBJAAdFBDHbFBAAkgNqHEhtBBAAlABzXUERsEkABiE8ruaYi41YIEELeIYnuIEEACEMGFwuKGABJA3CKK7SFCAAlABBcKixsCSABxiyi2hwgBAgIQ2UVhREAkEEACiESY0ElBIYAEEBSyaFckEEACiESY0ElBIYAEEBSyaFckEEACUAkTyogtAkgAsQ0tNowKAkgAKiihjNgigAQQ29Biw6gggASgghLKiC0CSACxDS1/GibuVpAA4h5hbB9PBJAAPOHBg+KOABJA3COM7eOJABKAJzx4UNwRQAKIe4SxfTwR4EEAnnp4EBEQCwSQAGIRRmwEXQSQAHSRQz2xQAAJIBZhxEbQRQAJQBc51BMLBJAA3MKIZRKDABJAYkKNDeWGABKAGypYJjEIIAEkJtTYUG4IIAG4oYJlEoMAEkBiQk2toZImhQSQtIhje99DAAnwHhy4I2kIIAEkLeLY3vcQQAK8BwfuSBoCSABJizi29z0E2hHgvXLcQQQkAgEkgESEGRvZEQJIgI6QwXKJQAAJIBFhxkZ2hAASoCNksFwiEEAC/BNm/CexCCABJDb02PB/EEAC/IMC/pNYBJAAEht6bPg/CCAB/kEB/0ksAkgAiQ09p+GSvv1/AAAA//9F1gPJAAAABklEQVQDAI1y8NP1QttlAAAAAElFTkSuQmCC",
  "glas.ico": "data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAYqMdAAC8/wBanhIAAbT0AGSkIQBfoRkAWZ4RAP///wAJt/QAZKQgAF+hGAATuvUAFLr1AFyfFQAVuvUAY6QfAGGiHABbnxQAZqUjAAa29AAHtvQACLb0AGGiGwAQufUAErn1AFufEwBlpSIAYKIaAF2gFwBeoBcA9/f3AAK19AADtfQABLX0AAW19AAMuPUAYqMeAA249QAOuPUAXaAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICCSMjFhUVIyMjIyMgAgICIyMjIyMjIyMjIyMjIwQCAiQGBwgICAgICAgIBwMgAiYCFwcICAgICAgICAcaIQInAhEHBwgfHx8fCAcHEiECAgIBBwcHBwcHBwcHBxIiAgIYJSUBBwcICAcHBygOIwICGRAQBwcICAgIBwcHDiMCAgwKChAlCB8fCAYeHSgUAgINGwUKEAcICAcGCx4oFAICDxMbBwcHBwcHHAseHRQCAiMjIyMjIyMjIyMjIyMUAgIjIyMjIyMjIyMjIyMjIwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAA=",
  "redit.ico": "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAB8lJREFUWAmVl3uMXVUVxr9z7r0zbYFO25mWWoZ2tAGk1rajtWK1QFuxNLEGo1NiFaMCidHWZzRqFCHlHx/RmCFEgwR5hAjVhvAIVaBAHwYCHUsN2jhFbYfKq6/pY+jM3HuPv2+fs2c66XQaV7LPOfux1rfW2mutvU+iM1AmJepQmmxQzUuylWpVXUtpy5h5H0MXKtPEgv0YY/v4/ivvzYw/nfxZPZ7LOlTSBtUTPou1I16Mn05mGgJeqvlq0FqAr1FZLWF1nafFRZGW4pbSTFUdpP8QrTP5k17y0Kky3Y90mgLZlSonz6iardIE9esWFq7Dhsbghyz3BoITwCOsZUV1cpUSOEqM1pAgdcL94+QR9UXZZog0QoG4IFuui7HmAVW0QINhaZWnRY5YH4WM8rYi3royMuyRnfSuTZ7SPyNG5BkSGCeyFexvpsdRYBpMhi/ThtZFxqF3eq7UMBUfsLR2Im8lxiqTAO7LNPB6NahR11vwrCQ2dkQsywiC4/4Ey0vaWoDbaoOfmdIGqW9AcOR0Ea8LaMdpL9Iupc08D6WOWYkycfQmRi0JnijiLMFXCVpkYc9PajuOXlBYbuedmWzlEZAWrZY6viS9cUDq3iU9t0Gas1xa9Rlpx3bpzpukd0zBG4eqyC4je6fG6cMhJsAuO9VIE4fLLcWe2+1jg1utSjNgKPDDT0uXzCVCdksLPyB99gapebo0Acvf/yHpXy9L2x9grKmsau9gwMiD+zvGDnnOvs9H5Loi4MZ2u8G9c5lzEZo5S3pyk7T4o9KNS6Sffk86eiSfq7PGzZTnR7nAWGdMp3oEW4t7GonWs++7wXGc+ntEWZKaJkv79mAt3+PGSRs3So3jpWuuIw7YgmfZknwLrAbMYBirTm1B5SRUuGqoYC1oaT29aHQycLkJ9wN6GNBFn5O+fav0fWJg/5Z8nB3VwTek5xHxHlorxbJ+9FR5riCuIweIiHZH5lI0aiEKaqxyrueUTsjB6tSSWi+pNkMa5L3voNRLwwFa044ih6TfbZZm028m05qnSee/U/oEdoTUfJsJPFM/mcu1gS5orqpgW4HldIbJPqgQtX0I7u7DffSbifjtIM7hu+Pr0nsXSpPJ83cvQBwMD92DIlj5El7Y9CC8rJsL45HXFLJ/Jv0GvDZ4eKR/OVeS7GPU6kTzUMTRkqqE4DcJokuI6Ms7sLRb2nKH9OXbpStWSDOQlp6qMVyR+kHe+4r01KPSL34gXbVKamMftt0tvY4yzWxHLWxHHaQUT+xKsqt0GAUm0ckAT3QE8IWk1k2/kqbi9pMnpEPk+IxZEWY4sl1BTBle8HfsI0qv7IZ/ujQRy//7H2n916Rdj9Anhmq9eRzgNyJG53k9lITy+Rxfq6/PwZ1C484ZBq9S9U5gQQqbWwSN3/ZASE+UmX1pDl5H+Iw26sNXpb8g2yXajMbkOLcCY5OtM/Udk24j4te0EuFb8jHPxfkXtkrXXy7d0ykNEHABIEcJiyuU7VEoxe6jNFOmQdx/GV8b7sxTyZZFgO5/SN9cL/0bRe76CW7EG9EDBuz8rvTyDukL35D27LY/c17LcNZsvEsirFSF30I9D7Y90DOkQA0FphJknX+Qfg+DKe7rhW3USoLyb4x9/PMkLBZF5RpIsxWM7WTuuiukadP5OIUe+yMV8l4y6l1kAtkFZ4HZU+azi+x3FuAv1KoSdPNY0kvgeT+TwgtTpkm3/lr6FtswE0EmK2cl/F79Ran9MqmFdS0oEMZtH9Tbm9eJGjESDGLSU1V1+eU7XEF81FGgme6Oh8ljlIhkgROnSG0XD6ehxyJV8MKcdqy/IAf3OHqF2Ol6QrJTasd5FDz5a3NKEXqaunSAxaUw64p1DoH2bDeHDPls8mJr/jbK3XtbnmLBYYwFi5jfu0e6m9Q96mLDeFRu25PEFApMRmZQAEZjGRNs6yhOpjtwyQ24pEqXKsNwqYWyS2n9zSbpIxQgk9PSZ/yj7OeESVjbloMd6OESwtqr1xBoS+AtClXXNukr9JsoQC6PmcWDkV9OfsuF9caowHz0ep7WyIJgrxKnDU7ZSy1fT1as/JR0LkXE5Nh4dS9bhLWmJpRpncXW2ImQi9fmx6QfXYvl7HJ5fL61Q7K5faRalGzSrlK4jj2s126erSYuC4sJRquJpBrW8WqeKt1+P4q8SBFBUIW7ynje4dCh3p9P85E82E/F2ye9gNWdNwO+nrOCYHKUheDjbesryK7rl1h/X8DG3HzHfA0fvpIVW2EenNTYStHs4UCi+0Fa+0p+S+bmlc7zx4ny/X/nMCJwtxZrnM4D+7EZQ3Ia9UqWb0FxQRzzUhpuulg0AFgv9cLeZ1sD4RDhBDVRthuJHRc0H+HDlIOPdimNa7Irix+Ss13LfSlJQUxJO3+bbKWzp068+A4wTI4ng1dw+1s462pc3xWxvCx4IK6PE5yQFzH2IGxn+TGJ7MYZQR5AK+KdkOEeuBMFRv0xcYgMUfIMv2T2xBPq5oBejO4/Q8V+hJR5G81C3UgDZ4txArgfHsvnvdapZt6qfh6u4aP8FbE+CPV7BMUfFQ8SF/Nw4VpwPolINhgq4HNs+lbNLZpTpcik/Jxyfv7fP6cwBcKkkb/ny/jnKWkZk6f/nvtE9aHmcyWltKdUuMf1qgXZmLF+z/8HuObo1EzDKmUAAAAASUVORK5CYII=",
  "roblo.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC80lEQVR4AdSYgXkUIRCFTyvQDrQDrSBagVqB2oFWYKxAO9AOjBVoKjAdaAemg+T9m3DfHAs7ENhbko/JciwM72dm2eMe7u75Xy3AL/Geyl7Ihig1AIjGPkk5IFe31w+6PpNtUmoAXiUUAvRF7X9k/2U/ZEcFqgFArPRlyyPdeS1LAT1R+yqlFABxtWnCmAD0V+qxb7q+k3UDKgXwVl+a3IJoxAMBDEadNmBdB6kOpQAnqcGNbRaI54fniPQjasVApQA9IuDxkqJsAGwExUAlAKwGzj0Bve8zpwVi6569g0oAjrH6JfDoiN9BpyUAa+R/iWCvD0AnJQA8VJ6zre6fewDsFNhWAr15zzwAwuQ52er+pSa+8ABGzX9p3/3e6c8DGDkC59K/WwIg9zH6jWhuBEZe/Sn/WdWlCAyf/x5AawSea4L3su+yf7KeZcp/HOYiwPeQKP/pXmwIvlBvxAPxVHWMOm362FSm/MdDDqB19c9wHhlQiP8ctdd+xA+LM43LAbTm/z7E0yyH/1oXZ7/6uM0BdJ2EiYx1XZwUAPnPGcDMWVUlvGxzuUFdFycF0HWCiIKNAYuaiz+S/9h+QAqgNcScouyB3QruvjgpgNZJWB1E82sDvzoAEw7sb7nZYLPNIQZAfEv+57TxXBEZ/Of6lLQf7EAMSAHQPqKxORzkPyJjgNb8x+daNlt9JooBWkOMz7Vslv9MZAFGFo9WNwIjA5D/yZejjcC9y3/CYgFGjkAy/y3AyOLRmcx/boQI0OGlGviuTl3VYUo2/1EYAKgjnF9/AXmghjeyrzIc6LJZ+bk0swWI+3Gq+qhGzraPdd0KiIXV9OmyBGBHsIWlgDgizl7vdmCHeheAWEcA4pDOYR2jfgMU977750XxuC2NAH2XjCggHghgMOq0Abs0duledvsMg3oBBH/haoF4fniOeJ5Iwxqgo0UgCM9d2cnY0dgIYqDcGNqHAUCMNQvEls3WHb+DXPE4XCuF8F1jiLXvoADk+rgGAAD///XR0HIAAAAGSURBVAMAy6KF4VwrNYcAAAAASUVORK5CYII=",
  "tt.ico": "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAC4jAAAuIwF4pT92AAAC/ElEQVR42u3XWUhUcRTH8TtzZ5xRJ1PH0Wm1KHOYLNuhxSiEFiorWiiKigkLood6MCyShHYMWoweoh7aC2kTo9JcSK1UCk2iHhRMxtw1SZt07r3fRNQc6Elnxhd/cN7uhc//4Zz/+QvdUbqL4aoRwAhgSABx1CjM+w4w5WgSUxOPEzJzFmqvAkLDWJ6Zy9sOB2VdTvKv3iJGF+xdwKrXObTKMgBU1XJ+dqz3Ac2STF8q014QZTQPHwAFXj15xpTZcxC0Wm8CXFNqr+Hg/UdY1m3AR1B5B6A4OkFR6IsEVN55js0wcegAlU6Pz9QI/BbH4DtvAYJGRG0KdQE43xTx/fIt2hua6M+jTJIDI4cAUKsxLFnK5MvXWJ1fxLGKKlILiomfFI2fyewCkB9nc9E0gx3zY3ifdIG2hy9xJqaSHDRIgEqjwbjbxpLCEm40NFPX5exvt8LodQSHjmXlAIDyNJezwdaef42CyDK9EVtAOAv1QYMDjF4Tx9LiUrJ//sIllXYKZq79L+Cc0eqeOaAJCSHywWPuNrYAgCQj5ZbgSLxC7fYjPJmwiMAwDwIMy2PZWv6NFqcEgPN5HlXW9ST4TyJaNDBOrUPb0wUeAhht8aTU1APAny7adx3nkH84rm0Y6jmAaf8B7je1AkD7b6rjDhIl+rsCzGNYlZX3D5CWxblgNwECN27mbn1T/3itOXYJq8rX5Ru/hYvZ9KmcNkkCQEp9SHJAhHsA2mkWTn7+Ql+kqhoOr9+KoNcjaH3QWayE37hNir0OBaCziw7bCfb4jnMPQBBFYs+cp2XAaG1obSUpPYNlN2+zIreQU9U/aOydDXJBKRXWOKxag/uuY/2EiVzPyWNgFKBRVqh3SkgAgGyvx7ElgbOBFtSCyr37wPhICxnpGdDbjq4aBfnjVxzbEkkzzcUs6jyzE5pHB5GyMx77vXSkd2Xwobyn5RwJF6mYtann5GGizrNLqbq7onwCiDdFcHpsNKeMVvb6jWe6xoBaUI28C0YAQwMMZ/0FmrrK3uRP9CwAAAAASUVORK5CYII=",
  "twit.ico": "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB7ElEQVR4Ae1XMZLCMAwUdw0ldJQ8ATpKnkBJByUd8ALyA/gBdJTQUtHS8QT4AaRM5ctmThmfogQ75CYNmhGTbGJr45Vk0yAiQzXaF9VsHwIZAofDgYwxqo9GI/K16/X6cqyxvdVqmdvtZh6PhwmCIHXcw7vdrpFj8ny9XhsYxhe8lwWHw2EycLFYpNh0Ok2w8/nsFHy1WrkE1wnAN5tNMkGv10ux3W6XIab5fD5P3ovldCGrP2Ap4LiW8uRJAcIwe1wpArYU0FJimhQgxaQ9cqX4BZYCgSVmS8HBfRP1JQEsY1xKGSmAcTC+l0QrIWDraicVMBBA4O1265ScpQnAMbkMwphjub1HAI7EkxoDK7n0/gQQGATsCmDMo+z++Hf8E5CjPZ9PiqKIZrMZhWFIl8slxcbjMTWbTTqdTuRrXoz5i2WXRIL+WxWw2+Uml13rnJUT4K9E9nMFaF3SxiojoO1u2rJzl4z3/+oIcHBMLiUp2rDe3ozg+BIYtNee87KjGzLGndPx7JD/0K7xog2Gl30ymaSY1jm9CPhsrXnnBK1zOhHgCWWtF7l2TtA6p3S1E+73exoMBrRcLul4PJKL3e93arfbSUeMA1O/36eYPHU6nWQu7pyaqRlfZnezV05anhSN34va7PPXrHYCP+VaTG3LBV1KAAAAAElFTkSuQmCC",
  "yt.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAIvElEQVR4nO3dbYwUdwHH8e8se3dywF1pejycILaAUE3RMmnaI7XVGLUa06YvGi3FWDW+UhJaH+ijKfTBxx6RYoy1YBRoAYNAa9LSV9a2IC1D9IgtjxVa5IBDuVvuKPfU8cXMcHt7j7v/2/3v7P4+yeRmZx/4hfvdzP5358HxfR+RXCVsB5B4U4HEiAokRlQgMaICiREVSIyoQGJEBRIjKpAYUYHEiAokRlQgMaICiREVSIyoQGJEBRIjKpAYUYHEiAokRlQgMaICiRHHdoB0Pm41UBtONUA1MBGoDG9/KJxqwmXRfdXhS0wCxgHJ8D6ACUBFOO+Er52uhtz/kHqA9rTbHwCptNudwPvhfCq8vxvoCJe1h6+RArrC2xfC+bbwZ0c4pcJlbQ5e9JrW5a1APm4VMCOc6oE6YGr48wrgMvrKUhveTuYrT4npBloJCxVOrcDZcDoFtADNwAnghIPXmY8gxgXycWuAG4BrgfnA3HCaYvraMqbOAIeBQ8BBwAPecPBSwz5rBDkVyMedCXwV+BqwMNfXEet8YB+wGdjk4L2X7Qtk9Yv3cecADwFLCN5rSOnoBTYAjzl4R0b7pFEVyMcdB/wAWEnwplVKVxfB7/lnDl7PSA8esUA+7jRgK7DIPJvEyB7gdgevebgHDVugcJP1MnDlGAaT+HgX+Nxwm7QhC+Tj1gO7gFl5CCbxcRxoGGpNNOgHaD5uBbAdlUeCDmzzcQf9jG6oT2AfBK7LWySJm+uB5YPdMWAT5uN+EtiLPhWW/rqAT2S+HxpsDbQClUcGqiT4DLCffmsgH/caoKlQiSR2eoE5Dt6xaEHmGujuQqaR2BlH8PXVJZcK5OMmgDsLnUhi5470G+lroAXA9MJmkRha6OPWRTfSC3SjhTASTzdHM+kFarAQROLp0vei6QX6lIUgEk8Lo5kEXNr9dJ61OBI310Yz0RroKrSDmIxejY87BfoKNNtiGImnuaACSe7mgAokuVOBxEi/TdhHLAaReJoFfQXSQYCSrWkAiXBXxboRHiySaToEa6A6yuHI0ueegOs+bjtFKanycScnCFdFJa/hGtjzB1j7Y5h6ue00pWJa+RQIwHHgW7fCoW3w/SVQoT13DU1PAJNtpyi4mgnwy2WwfzPcogNuDVxengWKzJsFL66GF1bBnJm208TR5ATBiZ3K21c+Df/aAj9dCpOqR368RFSgSyorYPk34MBWWPLl4P2SjEQFGqC+DtavhNfXgnu17TTF7rLyfg80nIYF8OYf4ZmHYYqG/UOoTaCjUIfmOPDt2+DwNrhnsYb9A1VrEzYaNROg8V5o2gRf1LEHaSYk0K6sozf/o/DSU7CjEWbPsJ2mGFQkCE7OLdm49SZ460/wk+/BxLIe9tcmgCrbKWKpsgLuuxsOboW7vlSuw/6KBDDedopYq6+DDY/Ca2th4XzbaQptYoLgWhJiatEC2Lsenn6wnIb94xP0XYhETDkOfOd2OPRnWLYYkiU/PqlKEFytRsZS7URYFQ77v3CD7TT5NClBOeyNaMvVV8LONbD9Sbjqw7bT5ENCF5wrhNtuDob9T3wXJpTWmEUFKpSqSrj/m8H7o8W3lMywXwUqtPo62PhYsO9RCdC3g4V2sgV++Ct4bqftJGNCBSqUzi5o3AiPr4OOornkqTEVqBB2vAL3NsI7/7GdZMwlCU4eXfKfeFnx9r9h2ZPw8t9tJ8mXniTBpaYzL4UtJtra4ZGnYc1m6Om1nSafOpLARVSgseH78Mx2eOg3cOZ/ttMUwoWoQGJqVxMs/TnsO2A7SSF1JYEO2yli7WQLLH8KNr4YrIHKSyoJdNtOEUtd3X3D8vYLttPY0p0E2myniJ3n/xYMy4+esJ3EtvPRMF5G48CxYFi+c7ftJMWiMwmkbKcoeqkOeOS3sGYLdPfYTlNM3k8SXAtTBuP7sO55eODX5TIsz1Z7Emi1naIo7W6Cpb8A723bSYpZSgXK1HwWfrS6XIfl2TqnAkW6umHVs/D4WjhftsPybLWqQAB/eRXuaYQj79lOEjfnksA52ymsOXg8GJa/tMt2krgq0wKlOmDl72D1Jg3Lzfw3CTTbTlEwvg+/fwEeWAOnNSwfA6eSwGnbKQpi9364Yzm8+ZbtJKWk2fFxxxF8oVoax5lIoVx08MYnHLxeoMV2GomdZug7Lqw8NmMylk5DX4HetRhE4uk49BXoqMUgEk+Hoa9A71gMIvF0BLQGktypQGLkKPTfhH1gL4vETMrBOwVhgRy8TuCg1UgSJ/+MZtLPD/QPC0EknvZGM+kF2mMhiMTTG9FMeoFesxBE4umv0UzmJkxfachI9kdvoCGtQOGXqpusRJI4eTb9RuZJNtcVMIjEz4CVTL8COXhNwI5CJpJY2eDgHUtfMNhpfu8HtKOwZOoCHs1cOKBATnAo5opCJJJYWengDfjKa9DdWH3cJPAKsCjfqSQWdgM3OXgDtkxD7gft404FXgdm5zGYFL9jwCIHb9Cjd4a81IGDdxr4DPqmvpwdBz4/VHlghGtlOHgnCDZjr45xMCl+e4AGB+/IcA8a8WIrDt4Z4LPAfehcQuWgh2AQdeNwa55IVseC+bhzgIeBr2f7XCl6PrAFWOFkcVKknErg484F7gLuBD6Wy2tI0TgEbAbWO3iHs32y8VrEx60HrgcWAvOAueGkq0EXl/MEA6KDBKXZB+wZzWZqOHnbDPm4tcAMYCYwDZgCXJH2s3aQSUbHJzg9cxvB+Z1S4XxLOJ0FzgCnCI75O+ng5eV0zkX1PsbHraF/oSrDn1XAeGBiuKwmbVl1uMyhr4TRfYSPjQYL44BJGf9sLbn/P/QS/GWnayP4BUNwzoHoSgAd4e3olw/BZSYupt3XSjBQuTDIsqgwbQ5e5r9pjePrPIBiQNdMFSMqkBhRgcSICiRGVCAxogKJERVIjKhAYkQFEiMqkBhRgcSICiRGVCAxogKJERVIjKhAYkQFEiMqkBhRgcSICiRG/g/9AN5y962WWAAAAABJRU5ErkJggg=="
};
const DEFAULT_SETTINGS = {
  panicKey: "Escape",
  panicUrl: "https://classroom.google.com",
  autoCloakEnabled: false,
  cloakTitle: "Classes",
  cloakFavicon: INLINED_ICONS["glas.ico"],
  aboutBlankCloakerEnabled: false,
  cloakType: "blob",
  searchBarPinned: false,
  region: "chicago",
  antiCloseEnabled: true,
  proxyType: "ultraviolet"
};
const SettingsContext = reactExports.createContext(null);
function SettingsProvider({ children }) {
  const [settings, setSettings] = reactExports.useState(() => {
    const saved = localStorage.getItem("fern-settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse settings:", e);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [isRecordingKey, setIsRecordingKey] = reactExports.useState(false);
  reactExports.useEffect(() => {
    localStorage.setItem("fern-settings", JSON.stringify(settings));
  }, [settings]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsContext.Provider, { value: { settings, setSettings, isRecordingKey, setIsRecordingKey }, children });
}
function useSettings() {
  const context = reactExports.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$o);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
];
const Bookmark = createLucideIcon("bookmark", __iconNode$n);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$m);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$l);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$k);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$j);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$i);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock = createLucideIcon("clock", __iconNode$h);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$g);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$f);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$e);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$d);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11", key: "1gktln" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13", key: "qnk9ow" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12", key: "krot7o" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10", key: "1lcuu1" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      key: "mfqc10"
    }
  ]
];
const Gamepad2 = createLucideIcon("gamepad-2", __iconNode$c);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$b);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$a);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$9);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$8);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89", key: "znwnzq" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
      key: "c9qhm2"
    }
  ]
];
const PinOff = createLucideIcon("pin-off", __iconNode$7);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
];
const Pin = createLucideIcon("pin", __iconNode$6);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$5);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings$1 = createLucideIcon("settings", __iconNode$4);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$3);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$2);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$1);
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function GlobalSettings() {
  const { settings, isRecordingKey } = useSettings();
  const [originalTitle] = reactExports.useState(document.title);
  const [originalFavicon] = reactExports.useState(() => {
    const link = document.querySelector("link[rel*='icon']");
    return link?.href || `${"/"}vite.svg`;
  });
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isRecordingKey) return;
      if (e.key === settings.panicKey) {
        window.location.href = settings.panicUrl;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.panicKey, settings.panicUrl, isRecordingKey]);
  reactExports.useEffect(() => {
    if (!settings.autoCloakEnabled) return;
    const handleVisibilityChange = () => {
      const link = document.querySelector("link[rel*='icon']");
      if (document.hidden) {
        document.title = settings.cloakTitle;
        if (link) {
          link.href = settings.cloakFavicon;
        }
      } else {
        document.title = originalTitle;
        if (link) {
          link.href = originalFavicon;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = originalFavicon;
      }
    };
  }, [settings.autoCloakEnabled, settings.cloakTitle, settings.cloakFavicon, originalTitle, originalFavicon]);
  reactExports.useEffect(() => {
    if (!settings.aboutBlankCloakerEnabled) return;
    if (window.self !== window.top) return;
    if (window.location.href === "about:blank" || window.location.href.startsWith("blob:")) return;
    const cloakTriggered = sessionStorage.getItem("fern-cloak-triggered");
    if (cloakTriggered) return;
    sessionStorage.setItem("fern-cloak-triggered", "true");
    const baseUrl = "/";
    const isS3 = window.location.hostname === "s3.amazonaws.com";
    const homeUrl = isS3 ? window.location.origin + baseUrl + "index.html" : window.location.origin + baseUrl;
    if (settings.cloakType === "about:blank") {
      const win = window.open("about:blank", "_blank");
      if (!win) {
        alert("Please allow popups for this site to use about:blank cloaking");
        sessionStorage.removeItem("fern-cloak-triggered");
        return;
      }
      const iframe = win.document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;";
      iframe.src = homeUrl;
      win.document.body.style.cssText = "margin:0;padding:0;";
      win.document.body.appendChild(iframe);
      document.documentElement.className = "dark";
      document.body.innerHTML = `
				<style>
					@import url("https://fonts.googleapis.com/css2?family=Euphoria+Script&display=swap");
					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}
					body {
						background: oklch(0.1776 0 0);
						color: oklch(0.9491 0 0);
						font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
						display: flex;
						align-items: center;
						justify-content: center;
						min-height: 100vh;
					}
					.container {
						text-align: center;
						max-width: 600px;
						padding: 2rem;
					}
					h1 {
						font-family: "Euphoria Script", cursive;
						font-size: 3.75rem;
						font-weight: 700;
						margin-bottom: 2rem;
						color: oklch(0.9491 0 0);
					}
					p {
						color: oklch(0.7699 0 0);
						font-size: 1.125rem;
						line-height: 1.6;
					}
				</style>
				<div class="container">
					<h1>fern</h1>
					<p>Your session is now running in the about:blank tab. You can safely close this tab.</p>
				</div>
			`;
    } else {
      const html = `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Fern</title>
					<style>
						body, html {
							margin: 0;
							padding: 0;
							height: 100%;
							overflow: hidden;
						}
						iframe {
							width: 100%;
							height: 100%;
							border: none;
							position: absolute;
							top: 0;
							left: 0;
						}
					</style>
				</head>
				<body>
					<iframe src="${homeUrl}" allowfullscreen></iframe>
				</body>
				</html>
			`;
      const blob = new Blob([html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.location.replace(blobUrl);
    }
  }, [settings.aboutBlankCloakerEnabled, settings.cloakType]);
  reactExports.useEffect(() => {
    if (!settings.antiCloseEnabled) return;
    const beforeUnloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => window.removeEventListener("beforeunload", beforeUnloadHandler);
  }, [settings.antiCloseEnabled]);
  return null;
}
const RootLayout = () => {
  const router2 = useRouterState();
  const navigate = useNavigate();
  const isSearchPage = router2.location.pathname === "/search";
  const isGamesPage = router2.location.pathname === "/x7k9m2p";
  const isMissingSwPage = router2.location.pathname.startsWith("/scrammy");
  const handleAdClick = () => {
    const actualUrl = "https://fern.best/resources/tuff.html";
    const displayUrl = "https://classroom.google.com/u/0/h";
    const params = {
      query: btoa(displayUrl),
      target: btoa(actualUrl)
    };
    navigate({ to: "/search", search: params });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalSettings, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    !isSearchPage && !isGamesPage && !isMissingSwPage && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAdClick,
          className: "fixed bottom-4 left-1/2 -translate-x-1/2 cursor-pointer",
          "aria-label": "Play game",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: `${"/"}fc/cpvp.png`,
              alt: "Advertisement",
              className: "w-64 md:w-80 h-auto rounded-lg shadow-2xl hover:scale-105 transition-transform"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "fixed bottom-4 right-4 flex gap-3 text-xs text-muted-foreground items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://discord.gg/TV2tWzSU7x",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-primary transition-colors flex items-center gap-1",
            "aria-label": "Join our Discord",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
              "Discord"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "hover:text-primary transition-colors", children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "hover:text-primary transition-colors", children: "Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-primary transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/credits", className: "hover:text-primary transition-colors", children: "Credits" })
      ] })
    ] })
  ] });
};
const Route$a = createRootRoute({ component: RootLayout });
const Route$9 = createFileRoute("/x7k9m2p")({
  component: GamesPage
});
function GamesPage() {
  const [games, setGames] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [selectedGame, setSelectedGame] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedTag, setSelectedTag] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const url2 = `${window.location.origin}/g.json`;
    console.log("Fetching games from:", url2);
    fetch(url2).then((res) => {
      console.log("Response status:", res.status, res.statusText);
      if (!res.ok) throw new Error(`Failed to load games: ${res.status} ${res.statusText}`);
      return res.json();
    }).then((data) => {
      console.log("Loaded games:", data.length);
      setGames(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Error loading games:", err);
      setError(err.message);
      setLoading(false);
    });
  }, []);
  const allTags = reactExports.useMemo(() => {
    const tagSet = /* @__PURE__ */ new Set();
    games.forEach((game) => {
      game.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [games]);
  const filteredGames = reactExports.useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || game.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [games, searchQuery, selectedTag]);
  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };
  const handleBackToList = () => {
    setSelectedGame(null);
  };
  const getGameUrl = (game) => {
    return `${window.location.origin}/resources/${game.directory}/index.html`;
  };
  const getImageUrl = (game) => {
    return `${"/"}resources/${game.directory}/${game.image}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Loading games..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-destructive", children: [
      "Error: ",
      error
    ] }) });
  }
  if (selectedGame) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex flex-col bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b bg-card px-4 py-3 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleBackToList,
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to games"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: selectedGame.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          src: getGameUrl(selectedGame),
          className: "absolute inset-0 w-full h-full border-0",
          title: selectedGame.name,
          allow: "fullscreen; autoplay; encrypted-media; gamepad; microphone; camera",
          allowFullScreen: true
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold font-display mb-2", children: "games" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Browse and play ",
          games.length,
          " games"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search$1, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search games...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-10 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          ),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSearchQuery(""),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Filter:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedTag(null),
              className: cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                !selectedTag ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
              ),
              children: "All"
            }
          ),
          allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedTag(tag),
              className: cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                selectedTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
              ),
              children: tag
            },
            tag
          ))
        ] })
      ] }),
      filteredGames.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No games found" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", children: filteredGames.map((game) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleGameSelect(game),
          className: "group relative aspect-square rounded-md border bg-card hover:bg-accent transition-all overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-muted flex items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: getImageUrl(game),
                  alt: game.name,
                  className: "w-full h-full object-cover",
                  loading: "lazy",
                  onError: (e) => {
                    const target = e.target;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling;
                    if (fallback) fallback.style.display = "flex";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 items-center justify-center hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold text-muted-foreground", children: game.name[0]?.toUpperCase() || "?" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: game.name }),
              game.tags && game.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: game.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary",
                  children: tag
                },
                tag
              )) })
            ] }) })
          ]
        },
        game.directory
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 mb-24 text-center text-sm text-muted-foreground", children: [
        "Showing ",
        filteredGames.length,
        " of ",
        games.length,
        " games"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 text-base text-muted-foreground z-10", children: [
      "brought to you by ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-primary", children: "fern" })
    ] })
  ] });
}
const Route$8 = createFileRoute("/terms")({
  component: Terms
});
function Terms() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-screen flex items-start justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl w-full space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "terms of service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
        "Last updated: ",
        (/* @__PURE__ */ new Date()).toLocaleDateString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Acceptance of Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "By accessing and using fern, you agree to these terms. If you don't agree, please don't use the service." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Acceptable Use" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "You may not use fern for any illegal purposes or activities. This includes but is not limited to: distributing malware, engaging in fraud, violating intellectual property rights, or any activity prohibited by applicable law." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Age Requirements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We do not purposefully collect data from users under 13 years of age. If you are under 13, please do not use this service." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Service Availability" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: 'We provide fern "as is" without warranties. The service may be modified, suspended, or discontinued at any time.' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Liability" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We are not liable for any damages arising from your use of fern. Use at your own risk." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Changes to Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We may update these terms at any time. Continued use constitutes acceptance of updated terms." })
      ] })
    ] })
  ] }) });
}
const instanceOfAny = (object2, constructors) => constructors.some((c2) => object2 instanceof c2);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value2) {
    target[prop] = value2;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(this.request);
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value2) {
  if (typeof value2 === "function")
    return wrapFunction(value2);
  if (value2 instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value2);
  if (instanceOfAny(value2, getIdbProxyableTypes()))
    return new Proxy(value2, idbProxyTraps);
  return value2;
}
function wrap(value2) {
  if (value2 instanceof IDBRequest)
    return promisifyRequest(value2);
  if (transformCache.has(value2))
    return transformCache.get(value2);
  const newValue = transformCachableValue(value2);
  if (newValue !== value2) {
    transformCache.set(value2, newValue);
    reverseTransformCache.set(newValue, value2);
  }
  return newValue;
}
const unwrap = (value2) => reverseTransformCache.get(value2);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
const methodMap = {};
const advanceResults = /* @__PURE__ */ new WeakMap();
const ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
const cursorIteratorTraps = {
  get(target, prop) {
    if (!advanceMethodProps.includes(prop))
      return target[prop];
    let cachedFunc = methodMap[prop];
    if (!cachedFunc) {
      cachedFunc = methodMap[prop] = function(...args) {
        advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
      };
    }
    return cachedFunc;
  }
};
async function* iterate(...args) {
  let cursor = this;
  if (!(cursor instanceof IDBCursor)) {
    cursor = await cursor.openCursor(...args);
  }
  if (!cursor)
    return;
  cursor = cursor;
  const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
  ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
  reverseTransformCache.set(proxiedCursor, unwrap(cursor));
  while (cursor) {
    yield proxiedCursor;
    cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
    advanceResults.delete(proxiedCursor);
  }
}
function isIteratorProp(target, prop) {
  return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get(target, prop, receiver) {
    if (isIteratorProp(target, prop))
      return iterate;
    return oldTraps.get(target, prop, receiver);
  },
  has(target, prop) {
    return isIteratorProp(target, prop) || oldTraps.has(target, prop);
  }
}));
const DB_NAME = "fern-data";
const DB_VERSION = 1;
let dbInstance = null;
async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const historyStore = db.createObjectStore("history", {
        keyPath: "id",
        autoIncrement: true
      });
      historyStore.createIndex("by-date", "visitedAt");
      historyStore.createIndex("by-url", "url");
      const bookmarksStore = db.createObjectStore("bookmarks", {
        keyPath: "id",
        autoIncrement: true
      });
      bookmarksStore.createIndex("by-folder", "folder");
      bookmarksStore.createIndex("by-date", "createdAt");
    }
  });
  return dbInstance;
}
async function addHistoryEntry(entry) {
  const db = await getDB();
  return db.add("history", entry);
}
async function getHistory(limit = 100) {
  const db = await getDB();
  const tx = db.transaction("history", "readonly");
  const index = tx.store.index("by-date");
  const entries = await index.getAll(null, limit);
  return entries.reverse();
}
async function searchHistory(query) {
  const db = await getDB();
  const allEntries = await db.getAll("history");
  const lowerQuery = query.toLowerCase();
  return allEntries.filter(
    (entry) => entry.url.toLowerCase().includes(lowerQuery) || entry.title.toLowerCase().includes(lowerQuery)
  ).sort((a2, b) => b.visitedAt - a2.visitedAt).slice(0, 100);
}
async function deleteHistoryEntry(id2) {
  const db = await getDB();
  await db.delete("history", id2);
}
async function clearHistory() {
  const db = await getDB();
  await db.clear("history");
}
async function addBookmark(bookmark) {
  const db = await getDB();
  return db.add("bookmarks", bookmark);
}
async function getBookmarks() {
  const db = await getDB();
  return db.getAll("bookmarks");
}
async function updateBookmark(id2, updates) {
  const db = await getDB();
  const bookmark = await db.get("bookmarks", id2);
  if (!bookmark) throw new Error("Bookmark not found");
  await db.put("bookmarks", { ...bookmark, ...updates });
}
async function deleteBookmark(id2) {
  const db = await getDB();
  await db.delete("bookmarks", id2);
}
async function searchBookmarks(query) {
  const bookmarks = await getBookmarks();
  const lowerQuery = query.toLowerCase();
  return bookmarks.filter(
    (bookmark) => bookmark.url.toLowerCase().includes(lowerQuery) || bookmark.title.toLowerCase().includes(lowerQuery) || bookmark.notes?.toLowerCase().includes(lowerQuery)
  );
}
function convertLegacyFormat(data) {
  const stores = {};
  for (const [storeName, storeData] of Object.entries(data)) {
    stores[storeName] = {
      config: {
        keyPath: null,
        autoIncrement: false,
        indexes: []
      },
      data: storeData
    };
  }
  return stores;
}
async function exportAllData() {
  const exportData = {
    version: "1.0.0",
    exportedAt: Date.now(),
    history: [],
    bookmarks: [],
    localStorage: {},
    sessionStorage: {},
    cookies: "",
    indexedDBDatabases: []
  };
  try {
    const db = await getDB();
    exportData.history = await db.getAll("history");
    exportData.bookmarks = await db.getAll("bookmarks");
    for (let i2 = 0; i2 < localStorage.length; i2++) {
      const key = localStorage.key(i2);
      if (key) {
        exportData.localStorage[key] = localStorage.getItem(key) || "";
      }
    }
    for (let i2 = 0; i2 < sessionStorage.length; i2++) {
      const key = sessionStorage.key(i2);
      if (key) {
        exportData.sessionStorage[key] = sessionStorage.getItem(key) || "";
      }
    }
    exportData.cookies = document.cookie;
    const databases = await indexedDB.databases();
    for (const dbInfo of databases) {
      if (!dbInfo.name) continue;
      try {
        const dbData = await exportIndexedDB(dbInfo.name);
        if (dbData) {
          exportData.indexedDBDatabases.push(dbData);
        }
      } catch (error) {
        console.error(`Failed to export database ${dbInfo.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
  return exportData;
}
async function exportIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = () => reject(request.error);
    request.onsuccess = async () => {
      const db = request.result;
      const version = db.version;
      const storeNames = Array.from(db.objectStoreNames);
      const stores = {};
      try {
        for (const storeName of storeNames) {
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);
          const indexes = [];
          for (let i2 = 0; i2 < store.indexNames.length; i2++) {
            const indexName = store.indexNames[i2];
            const index = store.index(indexName);
            indexes.push({
              name: indexName,
              keyPath: index.keyPath,
              options: {
                unique: index.unique,
                multiEntry: index.multiEntry
              }
            });
          }
          const config = {
            keyPath: store.keyPath,
            autoIncrement: store.autoIncrement,
            indexes
          };
          const allData = await new Promise((res, rej) => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
          });
          stores[storeName] = {
            config,
            data: allData
          };
        }
        db.close();
        resolve({
          name: dbName,
          version,
          stores
        });
      } catch (error) {
        db.close();
        reject(error);
      }
    };
  });
}
async function importAllData(exportData) {
  try {
    const db = await getDB();
    await db.clear("history");
    await db.clear("bookmarks");
    const historyTx = db.transaction("history", "readwrite");
    for (const entry of exportData.history) {
      await historyTx.store.add(entry);
    }
    await historyTx.done;
    const bookmarksTx = db.transaction("bookmarks", "readwrite");
    for (const bookmark of exportData.bookmarks) {
      await bookmarksTx.store.add(bookmark);
    }
    await bookmarksTx.done;
    for (const [key, value2] of Object.entries(exportData.localStorage)) {
      localStorage.setItem(key, value2);
    }
    for (const [key, value2] of Object.entries(exportData.sessionStorage)) {
      sessionStorage.setItem(key, value2);
    }
    if (exportData.cookies) {
      const cookies = exportData.cookies.split(";");
      for (const cookie of cookies) {
        try {
          document.cookie = cookie.trim();
        } catch (error) {
          console.warn("Failed to restore cookie:", cookie, error);
        }
      }
    }
    for (const dbData of exportData.indexedDBDatabases) {
      if (dbData.name === "fern-data") continue;
      try {
        await importIndexedDB(dbData);
      } catch (error) {
        console.error(`Failed to import database ${dbData.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}
async function importIndexedDB(dbData) {
  return new Promise((resolve, reject) => {
    const stores = dbData.stores || (dbData.data ? convertLegacyFormat(dbData.data) : {});
    const deleteReq = indexedDB.deleteDatabase(dbData.name);
    deleteReq.onsuccess = () => {
      const request = indexedDB.open(dbData.name, dbData.version);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        for (const [storeName, storeInfo] of Object.entries(stores)) {
          if (!db.objectStoreNames.contains(storeName)) {
            const { config } = storeInfo;
            const storeOptions = {
              autoIncrement: config.autoIncrement
            };
            if (config.keyPath) {
              storeOptions.keyPath = config.keyPath;
            }
            const store = db.createObjectStore(storeName, storeOptions);
            for (const indexConfig of config.indexes) {
              store.createIndex(
                indexConfig.name,
                indexConfig.keyPath,
                indexConfig.options
              );
            }
          }
        }
      };
      request.onsuccess = async () => {
        const db = request.result;
        try {
          for (const [storeName, storeInfo] of Object.entries(stores)) {
            if (!db.objectStoreNames.contains(storeName)) continue;
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            for (const item of storeInfo.data) {
              try {
                await new Promise((res, rej) => {
                  const req = store.add(item);
                  req.onsuccess = () => res();
                  req.onerror = () => rej(req.error);
                });
              } catch (error) {
                console.warn(`Failed to import item in ${storeName}:`, error);
              }
            }
            await new Promise((res, rej) => {
              tx.oncomplete = () => res();
              tx.onerror = () => rej(tx.error);
            });
          }
          db.close();
          resolve();
        } catch (error) {
          db.close();
          reject(error);
        }
      };
    };
    deleteReq.onerror = () => reject(deleteReq.error);
  });
}
function downloadExportData(data, filename = "fern-export.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url2 = URL.createObjectURL(blob);
  const a2 = document.createElement("a");
  a2.href = url2;
  a2.download = filename;
  document.body.appendChild(a2);
  a2.click();
  document.body.removeChild(a2);
  URL.revokeObjectURL(url2);
}
async function readImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        resolve(data);
      } catch (error) {
        reject(new Error("Invalid export file format"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
function DataManager() {
  const [exporting, setExporting] = reactExports.useState(false);
  const [importing, setImporting] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState({
    type: null,
    message: ""
  });
  const fileInputRef = reactExports.useRef(null);
  const handleExport = async () => {
    try {
      setExporting(true);
      setStatus({ type: null, message: "" });
      const data = await exportAllData();
      const filename = `fern-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      downloadExportData(data, filename);
      setStatus({
        type: "success",
        message: `Successfully exported all data! File: ${filename}`
      });
    } catch (error) {
      console.error("Export failed:", error);
      setStatus({
        type: "error",
        message: "Failed to export data. Check console for details."
      });
    } finally {
      setExporting(false);
    }
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setImporting(true);
      setStatus({ type: null, message: "" });
      const data = await readImportFile(file);
      await importAllData(data);
      setStatus({
        type: "success",
        message: "Successfully imported all data! Page will reload in 2 seconds..."
      });
      setTimeout(() => {
        window.location.reload();
      }, 2e3);
    } catch (error) {
      console.error("Import failed:", error);
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import data"
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Data Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Export and import all your browsing data including history, bookmarks, localStorage, sessionStorage, cookies, and IndexedDB databases." })
    ] }),
    status.type && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `p-4 rounded-md flex items-start gap-3 ${status.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400"}`,
        children: [
          status.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: status.message })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleExport,
            disabled: exporting,
            className: "flex-1 px-4 py-2 rounded-md border bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm",
            children: exporting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Exporting..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              "Export All Data"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: ".json",
            onChange: handleImportFile,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleImportClick,
            disabled: importing,
            className: "flex-1 px-4 py-2 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm",
            children: importing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Importing..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
              "Import Data"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Export creates a backup of all your history, bookmarks, settings, and site data. Import restores from a backup file." })
    ] })
  ] });
}
const r = globalThis.SharedWorker, a = globalThis.localStorage, s = globalThis.navigator.serviceWorker, o = MessagePort.prototype.postMessage;
async function c() {
  const e = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).map((async (e2) => {
    const t2 = await (function(e3) {
      let t3 = new MessageChannel();
      return new Promise(((r2) => {
        e3.postMessage({ type: "getPort", port: t3.port2 }, [t3.port2]), t3.port1.onmessage = (e4) => {
          r2(e4.data);
        };
      }));
    })(e2);
    return await i(t2), t2;
  })), t = Promise.race([Promise.any(e), new Promise(((e2, t2) => setTimeout(t2, 1e3, new TypeError("timeout"))))]);
  try {
    return await t;
  } catch (e2) {
    if (e2 instanceof AggregateError) throw console.error("bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort."), new Error("All clients returned an invalid MessagePort.");
    return console.warn("bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying"), await c();
  }
}
function i(e) {
  const t = new MessageChannel(), r2 = new Promise(((e2, r3) => {
    t.port1.onmessage = (t2) => {
      "pong" === t2.data.type && e2();
    }, setTimeout(r3, 1500);
  }));
  return o.call(e, { message: { type: "ping" }, port: t.port2 }, [t.port2]), r2;
}
function l(e, t) {
  const a2 = new r(e, "bare-mux-worker");
  return t && s.addEventListener("message", ((t2) => {
    if ("getPort" === t2.data.type && t2.data.port) {
      console.debug("bare-mux: recieved request for port from sw");
      const a3 = new r(e, "bare-mux-worker");
      o.call(t2.data.port, a3.port, [a3.port]);
    }
  })), a2.port;
}
let h = null;
function d() {
  if (null === h) {
    const e = new MessageChannel(), t = new ReadableStream();
    let r2;
    try {
      o.call(e.port1, t, [t]), r2 = true;
    } catch (e2) {
      r2 = false;
    }
    return h = r2, r2;
  }
  return h;
}
class p {
  constructor(e) {
    this.channel = new BroadcastChannel("bare-mux"), e instanceof MessagePort || e instanceof Promise ? this.port = e : this.createChannel(e, true);
  }
  createChannel(e, t) {
    if (self.clients) this.port = c(), this.channel.onmessage = (e2) => {
      "refreshPort" === e2.data.type && (this.port = c());
    };
    else if (e && SharedWorker) {
      if (!e.startsWith("/") && !e.includes("://")) throw new Error("Invalid URL. Must be absolute or start at the root.");
      this.port = l(e, t), console.debug("bare-mux: setting localStorage bare-mux-path to", e), a["bare-mux-path"] = e;
    } else {
      if (!SharedWorker) throw new Error("Unable to get a channel to the SharedWorker.");
      {
        const e2 = a["bare-mux-path"];
        if (console.debug("bare-mux: got localStorage bare-mux-path:", e2), !e2) throw new Error("Unable to get bare-mux workerPath from localStorage.");
        this.port = l(e2, t);
      }
    }
  }
  async sendMessage(e, t) {
    this.port instanceof Promise && (this.port = await this.port);
    try {
      await i(this.port);
    } catch {
      return console.warn("bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead."), this.createChannel(), await this.sendMessage(e, t);
    }
    const r2 = new MessageChannel(), a2 = [r2.port2, ...t || []], s2 = new Promise(((e2, t2) => {
      r2.port1.onmessage = (r3) => {
        const a3 = r3.data;
        "error" === a3.type ? t2(a3.error) : e2(a3);
      };
    }));
    return o.call(this.port, { message: e, port: r2.port2 }, a2), await s2;
  }
}
function u(e, t, r2) {
  console.error(`error while processing '${r2}': `, t), e.postMessage({ type: "error", error: t });
}
class m {
  constructor(e) {
    this.worker = new p(e);
  }
  async getTransport() {
    return (await this.worker.sendMessage({ type: "get" })).name;
  }
  async setTransport(e, t, r2) {
    await this.setManualTransport(`
			const { default: BareTransport } = await import("${e}");
			return [BareTransport, "${e}"];
		`, t, r2);
  }
  async setManualTransport(e, t, r2) {
    if ("bare-mux-remote" === e) throw new Error("Use setRemoteTransport.");
    await this.worker.sendMessage({ type: "set", client: { function: e, args: t } }, r2);
  }
  async setRemoteTransport(e, t) {
    const r2 = new MessageChannel();
    r2.port1.onmessage = async (t2) => {
      const r3 = t2.data.port, a2 = t2.data.message;
      if ("fetch" === a2.type) try {
        e.ready || await e.init(), await (async function(e2, t3, r4) {
          const a3 = await r4.request(new URL(e2.fetch.remote), e2.fetch.method, e2.fetch.body, e2.fetch.headers, null);
          if (!d() && a3.body instanceof ReadableStream) {
            const e3 = new Response(a3.body);
            a3.body = await e3.arrayBuffer();
          }
          a3.body instanceof ReadableStream || a3.body instanceof ArrayBuffer ? o.call(t3, { type: "fetch", fetch: a3 }, [a3.body]) : o.call(t3, { type: "fetch", fetch: a3 });
        })(a2, r3, e);
      } catch (e2) {
        u(r3, e2, "fetch");
      }
      else if ("websocket" === a2.type) try {
        e.ready || await e.init(), await (async function(e2, t3, r4) {
          const [a3, s2] = r4.connect(new URL(e2.websocket.url), e2.websocket.protocols, e2.websocket.requestHeaders, ((t4) => {
            o.call(e2.websocket.channel, { type: "open", args: [t4] });
          }), ((t4) => {
            t4 instanceof ArrayBuffer ? o.call(e2.websocket.channel, { type: "message", args: [t4] }, [t4]) : o.call(e2.websocket.channel, { type: "message", args: [t4] });
          }), ((t4, r5) => {
            o.call(e2.websocket.channel, { type: "close", args: [t4, r5] });
          }), ((t4) => {
            o.call(e2.websocket.channel, { type: "error", args: [t4] });
          }));
          e2.websocket.channel.onmessage = (e3) => {
            "data" === e3.data.type ? a3(e3.data.data) : "close" === e3.data.type && s2(e3.data.closeCode, e3.data.closeReason);
          }, o.call(t3, { type: "websocket" });
        })(a2, r3, e);
      } catch (e2) {
        u(r3, e2, "websocket");
      }
    }, await this.worker.sendMessage({ type: "set", client: { function: "bare-mux-remote", args: [r2.port2, t] } }, [r2.port2]);
  }
  getInnerPort() {
    return this.worker.port;
  }
}
console.debug("bare-mux: running v2.1.7 (build c56d286)");
const _h = async (s2) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s2));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
const _a = atob("d3NzOi8v");
const _b = String.fromCharCode(103, 105, 114, 108, 115, 112, 114, 101, 112, 108, 101, 115);
const _c = String.fromCharCode(111, 114, 103);
const _d = String.fromCharCode(119, 105);
const _checkDomain = async () => {
  const parts = window.location.host.split(".");
  const domain = parts.slice(-2).join(".");
  const hash = await _h(domain);
  return hash === "3b2ddc6f174c6c4e3e163bbf556f5c7ad5077f3dc09ff48bb74a27062a40161d";
};
const _getRegionPath = (region, isAWS) => {
  if (region === "chicago") return isAWS ? `/${_d}/` : "/wisp/";
  return isAWS ? `/${_d}-${region}/` : `/wisp-${region}/`;
};
const _getStoredRegion = () => {
  try {
    const settings = localStorage.getItem("fern-settings");
    if (settings) {
      const parsed2 = JSON.parse(settings);
      return parsed2.region || "chicago";
    }
  } catch (e) {
  }
  return "chicago";
};
const getWispUrl = (region) => {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (isLocalhost) {
    return `wss://fern.best/wisp/`;
  }
  const isAWS = window.location.host.split(".").slice(-2).join(".").includes("amazonaws");
  const path = _getRegionPath(region, isAWS);
  return isAWS ? `${_a}${_b}.${_c}${path}` : `wss://${window.location.host}${path}`;
};
const _isAWS = await _checkDomain();
const _initialRegion = _getStoredRegion();
const _isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const wispUrl = _isLocalhost ? `wss://fern.best/wisp/` : _isAWS ? `${_a}${_b}.${_c}${_getRegionPath(_initialRegion, true)}` : `wss://${window.location.host}${_getRegionPath(_initialRegion, false)}`;
async function setupProxy(region, proxyType) {
  if ("serviceWorker" in navigator) {
    const targetRegion = region || _initialRegion;
    const targetWispUrl = region ? getWispUrl(region) : wispUrl;
    const registrations = await navigator.serviceWorker.getRegistrations();
    for await (const registration2 of registrations) {
      await registration2.unregister();
    }
    if (proxyType === "scramjet") {
      try {
        if (!window.$scramjetLoadController) {
          const script = document.createElement("script");
          script.src = `${"/"}scramjet/scramjet.all.js`;
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        const { ScramjetController } = window.$scramjetLoadController();
        if (!window.scramjetController) {
          window.scramjetController = new ScramjetController({
            prefix: `${"/"}scrammy/`,
            files: {
              wasm: `${"/"}scramjet/scramjet.wasm.wasm`,
              all: `${"/"}scramjet/scramjet.all.js`,
              sync: `${"/"}scramjet/scramjet.sync.js`
            }
          });
        }
        window.scramjetController.init().then(() => {
          console.log("Scramjet controller initialized");
        }).catch((e) => {
          console.error("Scramjet init failed:", e);
        });
      } catch (e) {
        console.error("Failed to load Scramjet:", e);
      }
    }
    const registration = await navigator.serviceWorker.register(`${"/"}sw.js`);
    await registration.update();
    await navigator.serviceWorker.ready;
    console.log("Service worker ready");
    const connection = new m(`${"/"}erab/worker.js`);
    if (proxyType === "scramjet") {
      await connection.setTransport(`${"/"}libcurl/index.mjs`, [{ wisp: targetWispUrl }]);
      console.log("Mode configured for region:", targetRegion, "using scramjet (libcurl)");
    } else {
      await connection.setTransport(`${"/"}epoxy/index.mjs`, [{ wisp: targetWispUrl }]);
      console.log("Mode configured for region:", targetRegion, "using ultraviolet (epoxy)");
    }
  }
}
const sw = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getWispUrl,
  setupProxy,
  wispUrl
});
const Route$7 = createFileRoute("/settings")({
  component: Settings
});
function Settings() {
  const { settings, setSettings, isRecordingKey, setIsRecordingKey } = useSettings();
  const navigate = useNavigate();
  const prevAboutBlankEnabled = reactExports.useRef(settings.aboutBlankCloakerEnabled);
  reactExports.useEffect(() => {
    if (settings.aboutBlankCloakerEnabled && !prevAboutBlankEnabled.current) {
      navigate({ to: "/" });
    }
    prevAboutBlankEnabled.current = settings.aboutBlankCloakerEnabled;
  }, [settings.aboutBlankCloakerEnabled, navigate]);
  const handleKeyCapture = (e) => {
    if (isRecordingKey) {
      e.preventDefault();
      setSettings({ ...settings, panicKey: e.key });
      setIsRecordingKey(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-start justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl w-full space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/history",
            className: "px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
              "Browsing History"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/bookmarks",
            className: "px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4" }),
              "Bookmarks"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Panic Button" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Quickly redirect to another site by pressing a key. Works globally across all pages." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium", children: "Panic Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsRecordingKey(true),
              onKeyDown: handleKeyCapture,
              className: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-mono text-sm",
              children: isRecordingKey ? "Press any key..." : settings.panicKey
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "panic-url", className: "block text-sm font-medium", children: "Redirect URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "panic-url",
              type: "url",
              value: settings.panicUrl,
              onChange: (e) => setSettings({ ...settings, panicUrl: e.target.value }),
              className: "w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm",
              placeholder: "https://classroom.google.com"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Auto Cloak" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Disguise the tab when you switch away from it. Changes the title and favicon automatically." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center cursor-pointer flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.autoCloakEnabled,
              onChange: (e) => setSettings({ ...settings, autoCloakEnabled: e.target.checked }),
              className: "sr-only peer"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" })
        ] })
      ] }) }),
      settings.autoCloakEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "cloak-title", className: "block text-sm font-medium", children: "Disguise Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "cloak-title",
              type: "text",
              value: settings.cloakTitle,
              onChange: (e) => setSettings({ ...settings, cloakTitle: e.target.value }),
              className: "w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm",
              placeholder: "Classes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "cloak-favicon", className: "block text-sm font-medium", children: "Disguise Favicon Path" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "cloak-favicon",
              type: "text",
              value: settings.cloakFavicon,
              onChange: (e) => setSettings({ ...settings, cloakFavicon: e.target.value }),
              className: "w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm",
              placeholder: "data:image/x-icon;base64,..."
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "URL Cloaker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Cloak the site in an iframe to hide the actual site address. Choose your preferred method below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium", children: "Select Cloak Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSettings({ ...settings, cloakType: "blob", aboutBlankCloakerEnabled: false });
              },
              className: `flex-1 px-4 py-3 rounded-md border transition-all ${settings.cloakType === "blob" && !settings.aboutBlankCloakerEnabled ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-accent"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: "Blob URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "blob:https://..." })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSettings({ ...settings, cloakType: "about:blank", aboutBlankCloakerEnabled: false });
              },
              className: `flex-1 px-4 py-3 rounded-md border transition-all ${settings.cloakType === "about:blank" && !settings.aboutBlankCloakerEnabled ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-accent"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: "About Blank" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "about:blank" })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setSettings({ ...settings, aboutBlankCloakerEnabled: true });
          },
          disabled: settings.aboutBlankCloakerEnabled,
          className: `w-full px-4 py-3 rounded-md font-medium transition-all ${settings.aboutBlankCloakerEnabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`,
          children: settings.aboutBlankCloakerEnabled ? "Cloak Applied" : `Apply ${settings.cloakType === "blob" ? "Blob" : "About:Blank"} Cloak`
        }
      ),
      settings.aboutBlankCloakerEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Cloak is active. Refresh the page to disable it." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Anti-Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Show a confirmation popup when attempting to close or reload the tab to prevent accidental closures." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center cursor-pointer flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: settings.antiCloseEnabled,
            onChange: (e) => setSettings({ ...settings, antiCloseEnabled: e.target.checked }),
            className: "sr-only peer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Proxy Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Choose which proxy backend to use. Ultraviolet is the default, while Scramjet is a newer experimental option." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: async () => {
              if (settings.proxyType !== "ultraviolet") {
                setSettings({ ...settings, proxyType: "ultraviolet" });
                await setupProxy(settings.region, "ultraviolet");
              }
            },
            className: `flex-1 px-4 py-3 rounded-md border transition-all ${settings.proxyType === "ultraviolet" ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-accent"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: "Ultraviolet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Stable and proven" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: async () => {
              if (settings.proxyType !== "scramjet") {
                setSettings({ ...settings, proxyType: "scramjet" });
                await setupProxy(settings.region, "scramjet");
              }
            },
            className: `flex-1 px-4 py-3 rounded-md border transition-all ${settings.proxyType === "scramjet" ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-accent"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: "Scramjet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Experimental" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-6 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DataManager, {}) })
  ] }) });
}
function encodeXor(str) {
  if (!str) return str;
  return encodeURIComponent(
    str.toString().split("").map(
      (char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(Number.NaN) ^ 2) : char
    ).join("")
  );
}
function formatSearch(input) {
  if (input.startsWith("/cdn")) {
    return new URL(input, window.location.href).href;
  }
  try {
    return new URL(input).toString();
  } catch (_) {
  }
  try {
    const url2 = new URL(`http://${input}`);
    if (url2.hostname.includes(".")) return url2.toString();
  } catch (_) {
  }
  return new URL(`https://duckduckgo.com/?q=${encodeURIComponent(input)}`).toString();
}
const regex$1 = ((src, flags) => new RegExp(src, flags));
Object.assign(regex$1, { cast: regex$1 });
const liftArray = (data) => Array.isArray(data) ? data : [data];
const spliterate = (arr, predicate) => {
  const result = [[], []];
  for (const item of arr) {
    if (predicate(item))
      result[0].push(item);
    else
      result[1].push(item);
  }
  return result;
};
const ReadonlyArray = Array;
const includes = (array, element) => array.includes(element);
const range = (length, offset = 0) => [...new Array(length)].map((_, i2) => i2 + offset);
const append = (to, value2, opts) => {
  if (to === void 0) {
    return value2 === void 0 ? [] : Array.isArray(value2) ? value2 : [value2];
  }
  {
    if (Array.isArray(value2))
      to.push(...value2);
    else
      to.push(value2);
  }
  return to;
};
const conflatenate = (to, elementOrList) => {
  if (elementOrList === void 0 || elementOrList === null)
    return to ?? [];
  if (to === void 0 || to === null)
    return liftArray(elementOrList);
  return to.concat(elementOrList);
};
const conflatenateAll = (...elementsOrLists) => elementsOrLists.reduce(conflatenate, []);
const appendUnique = (to, value2, opts) => {
  if (to === void 0)
    return Array.isArray(value2) ? value2 : [value2];
  const isEqual = opts?.isEqual ?? ((l2, r2) => l2 === r2);
  for (const v of liftArray(value2))
    if (!to.some((existing) => isEqual(existing, v)))
      to.push(v);
  return to;
};
const groupBy = (array, discriminant) => array.reduce((result, item) => {
  const key = item[discriminant];
  result[key] = append(result[key], item);
  return result;
}, {});
const arrayEquals = (l2, r2, opts) => l2.length === r2.length && l2.every(opts?.isEqual ? (lItem, i2) => opts.isEqual(lItem, r2[i2]) : (lItem, i2) => lItem === r2[i2]);
const hasDomain = (data, kind) => domainOf(data) === kind;
const domainOf = (data) => {
  const builtinType = typeof data;
  return builtinType === "object" ? data === null ? "null" : "object" : builtinType === "function" ? "object" : builtinType;
};
const domainDescriptions = {
  boolean: "boolean",
  null: "null",
  undefined: "undefined",
  bigint: "a bigint",
  number: "a number",
  object: "an object",
  string: "a string",
  symbol: "a symbol"
};
const jsTypeOfDescriptions = {
  ...domainDescriptions,
  function: "a function"
};
class InternalArktypeError extends Error {
}
const throwInternalError = (message) => throwError(message, InternalArktypeError);
const throwError = (message, ctor = Error) => {
  throw new ctor(message);
};
class ParseError extends Error {
  name = "ParseError";
}
const throwParseError = (message) => throwError(message, ParseError);
const noSuggest = (s2) => ` ${s2}`;
const ZeroWidthSpace = "​";
const flatMorph = (o2, flatMapEntry) => {
  const result = {};
  const inputIsArray = Array.isArray(o2);
  let outputShouldBeArray = false;
  for (const [i2, entry] of Object.entries(o2).entries()) {
    const mapped = inputIsArray ? flatMapEntry(i2, entry[1]) : flatMapEntry(...entry, i2);
    outputShouldBeArray ||= typeof mapped[0] === "number";
    const flattenedEntries = Array.isArray(mapped[0]) || mapped.length === 0 ? (
      // if we have an empty array (for filtering) or an array with
      // another array as its first element, treat it as a list
      mapped
    ) : [mapped];
    for (const [k, v] of flattenedEntries) {
      if (typeof k === "object")
        result[k.group] = append(result[k.group], v);
      else
        result[k] = v;
    }
  }
  return outputShouldBeArray ? Object.values(result) : result;
};
const entriesOf = Object.entries;
const isKeyOf = (k, o2) => k in o2;
const hasKey = (o2, k) => k in o2;
class DynamicBase {
  constructor(properties) {
    Object.assign(this, properties);
  }
}
const NoopBase = class {
};
class CastableBase extends NoopBase {
}
const splitByKeys = (o2, leftKeys) => {
  const l2 = {};
  const r2 = {};
  let k;
  for (k in o2) {
    if (k in leftKeys)
      l2[k] = o2[k];
    else
      r2[k] = o2[k];
  }
  return [l2, r2];
};
const omit = (o2, keys) => splitByKeys(o2, keys)[1];
const isEmptyObject = (o2) => Object.keys(o2).length === 0;
const stringAndSymbolicEntriesOf = (o2) => [
  ...Object.entries(o2),
  ...Object.getOwnPropertySymbols(o2).map((k) => [k, o2[k]])
];
const defineProperties = (base, merged) => (
  // declared like this to avoid https://github.com/microsoft/TypeScript/issues/55049
  Object.defineProperties(base, Object.getOwnPropertyDescriptors(merged))
);
const withAlphabetizedKeys = (o2) => {
  const keys = Object.keys(o2).sort();
  const result = {};
  for (let i2 = 0; i2 < keys.length; i2++)
    result[keys[i2]] = o2[keys[i2]];
  return result;
};
const unset = noSuggest(`unset${ZeroWidthSpace}`);
const enumValues = (tsEnum) => Object.values(tsEnum).filter((v) => {
  if (typeof v === "number")
    return true;
  return typeof tsEnum[v] !== "number";
});
const ecmascriptConstructors = {
  Array,
  Boolean,
  Date,
  Error,
  Function,
  Map,
  Number,
  Promise,
  RegExp,
  Set,
  String,
  WeakMap,
  WeakSet
};
const FileConstructor = globalThis.File ?? Blob;
const platformConstructors = {
  ArrayBuffer,
  Blob,
  File: FileConstructor,
  FormData,
  Headers,
  Request,
  Response,
  URL
};
const typedArrayConstructors = {
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array
};
const builtinConstructors = {
  ...ecmascriptConstructors,
  ...platformConstructors,
  ...typedArrayConstructors,
  String,
  Number,
  Boolean
};
const objectKindOf = (data) => {
  let prototype = Object.getPrototypeOf(data);
  while (prototype?.constructor && (!isKeyOf(prototype.constructor.name, builtinConstructors) || !(data instanceof builtinConstructors[prototype.constructor.name])))
    prototype = Object.getPrototypeOf(prototype);
  const name = prototype?.constructor?.name;
  if (name === void 0 || name === "Object")
    return void 0;
  return name;
};
const objectKindOrDomainOf = (data) => typeof data === "object" && data !== null ? objectKindOf(data) ?? "object" : domainOf(data);
const isArray = Array.isArray;
const ecmascriptDescriptions = {
  Array: "an array",
  Function: "a function",
  Date: "a Date",
  RegExp: "a RegExp",
  Error: "an Error",
  Map: "a Map",
  Set: "a Set",
  String: "a String object",
  Number: "a Number object",
  Boolean: "a Boolean object",
  Promise: "a Promise",
  WeakMap: "a WeakMap",
  WeakSet: "a WeakSet"
};
const platformDescriptions = {
  ArrayBuffer: "an ArrayBuffer instance",
  Blob: "a Blob instance",
  File: "a File instance",
  FormData: "a FormData instance",
  Headers: "a Headers instance",
  Request: "a Request instance",
  Response: "a Response instance",
  URL: "a URL instance"
};
const typedArrayDescriptions = {
  Int8Array: "an Int8Array",
  Uint8Array: "a Uint8Array",
  Uint8ClampedArray: "a Uint8ClampedArray",
  Int16Array: "an Int16Array",
  Uint16Array: "a Uint16Array",
  Int32Array: "an Int32Array",
  Uint32Array: "a Uint32Array",
  Float32Array: "a Float32Array",
  Float64Array: "a Float64Array",
  BigInt64Array: "a BigInt64Array",
  BigUint64Array: "a BigUint64Array"
};
const objectKindDescriptions = {
  ...ecmascriptDescriptions,
  ...platformDescriptions,
  ...typedArrayDescriptions
};
const getBuiltinNameOfConstructor = (ctor) => {
  const constructorName = Object(ctor).name ?? null;
  return constructorName && isKeyOf(constructorName, builtinConstructors) && builtinConstructors[constructorName] === ctor ? constructorName : null;
};
const constructorExtends = (ctor, base) => {
  let current = ctor.prototype;
  while (current !== null) {
    if (current === base.prototype)
      return true;
    current = Object.getPrototypeOf(current);
  }
  return false;
};
const deepClone = (input) => _clone(input, /* @__PURE__ */ new Map());
const _clone = (input, seen2) => {
  if (typeof input !== "object" || input === null)
    return input;
  if (seen2?.has(input))
    return seen2.get(input);
  const builtinConstructorName = getBuiltinNameOfConstructor(input.constructor);
  if (builtinConstructorName === "Date")
    return new Date(input.getTime());
  if (builtinConstructorName && builtinConstructorName !== "Array")
    return input;
  const cloned = Array.isArray(input) ? input.slice() : Object.create(Object.getPrototypeOf(input));
  const propertyDescriptors = Object.getOwnPropertyDescriptors(input);
  if (seen2) {
    seen2.set(input, cloned);
    for (const k in propertyDescriptors) {
      const desc = propertyDescriptors[k];
      if ("get" in desc || "set" in desc)
        continue;
      desc.value = _clone(desc.value, seen2);
    }
  }
  Object.defineProperties(cloned, propertyDescriptors);
  return cloned;
};
const cached = (thunk) => {
  let result = unset;
  return () => result === unset ? result = thunk() : result;
};
const isThunk = (value2) => typeof value2 === "function" && value2.length === 0;
const DynamicFunction = class extends Function {
  constructor(...args) {
    const params = args.slice(0, -1);
    const body = args.at(-1);
    try {
      super(...params, body);
    } catch (e) {
      return throwInternalError(`Encountered an unexpected error while compiling your definition:
                Message: ${e} 
                Source: (${args.slice(0, -1)}) => {
                    ${args.at(-1)}
                }`);
    }
  }
};
class Callable {
  constructor(fn, ...[opts]) {
    return Object.assign(Object.setPrototypeOf(fn.bind(opts?.bind ?? this), this.constructor.prototype), opts?.attach);
  }
}
const envHasCsp = cached(() => {
  try {
    return new Function("return false")();
  } catch {
    return true;
  }
});
class Hkt {
  constructor() {
  }
}
var define_globalThis_process_env_default = {};
const fileName = () => {
  try {
    const error = new Error();
    const stackLine = error.stack?.split("\n")[2]?.trim() || "";
    const filePath = stackLine.match(/\(?(.+?)(?::\d+:\d+)?\)?$/)?.[1] || "unknown";
    return filePath.replace(/^file:\/\//, "");
  } catch {
    return "unknown";
  }
};
const env = define_globalThis_process_env_default ?? {};
const isomorphic = {
  fileName,
  env
};
const capitalize$1 = (s2) => s2[0].toUpperCase() + s2.slice(1);
const anchoredRegex = (regex2) => new RegExp(anchoredSource(regex2), typeof regex2 === "string" ? "" : regex2.flags);
const anchoredSource = (regex2) => {
  const source = typeof regex2 === "string" ? regex2 : regex2.source;
  return `^(?:${source})$`;
};
const RegexPatterns = {
  negativeLookahead: (pattern) => `(?!${pattern})`,
  nonCapturingGroup: (pattern) => `(?:${pattern})`
};
const Backslash = "\\";
const whitespaceChars = {
  " ": 1,
  "\n": 1,
  "	": 1
};
const anchoredNegativeZeroPattern = /^-0\.?0*$/.source;
const positiveIntegerPattern = /[1-9]\d*/.source;
const looseDecimalPattern = /\.\d+/.source;
const strictDecimalPattern = /\.\d*[1-9]/.source;
const createNumberMatcher = (opts) => anchoredRegex(RegexPatterns.negativeLookahead(anchoredNegativeZeroPattern) + RegexPatterns.nonCapturingGroup("-?" + RegexPatterns.nonCapturingGroup(RegexPatterns.nonCapturingGroup("0|" + positiveIntegerPattern) + RegexPatterns.nonCapturingGroup(opts.decimalPattern) + "?") + (opts.allowDecimalOnly ? "|" + opts.decimalPattern : "") + "?"));
const wellFormedNumberMatcher = createNumberMatcher({
  decimalPattern: strictDecimalPattern,
  allowDecimalOnly: false
});
const isWellFormedNumber = wellFormedNumberMatcher.test.bind(wellFormedNumberMatcher);
const numericStringMatcher = createNumberMatcher({
  decimalPattern: looseDecimalPattern,
  allowDecimalOnly: true
});
numericStringMatcher.test.bind(numericStringMatcher);
const numberLikeMatcher = /^-?\d*\.?\d*$/;
const isNumberLike = (s2) => s2.length !== 0 && numberLikeMatcher.test(s2);
const wellFormedIntegerMatcher = anchoredRegex(RegexPatterns.negativeLookahead("^-0$") + "-?" + RegexPatterns.nonCapturingGroup(RegexPatterns.nonCapturingGroup("0|" + positiveIntegerPattern)));
const isWellFormedInteger = wellFormedIntegerMatcher.test.bind(wellFormedIntegerMatcher);
const integerLikeMatcher = /^-?\d+$/;
const isIntegerLike = integerLikeMatcher.test.bind(integerLikeMatcher);
const numericLiteralDescriptions = {
  number: "a number",
  bigint: "a bigint",
  integer: "an integer"
};
const writeMalformedNumericLiteralMessage = (def, kind) => `'${def}' was parsed as ${numericLiteralDescriptions[kind]} but could not be narrowed to a literal value. Avoid unnecessary leading or trailing zeros and other abnormal notation`;
const isWellFormed = (def, kind) => kind === "number" ? isWellFormedNumber(def) : isWellFormedInteger(def);
const parseKind = (def, kind) => kind === "number" ? Number(def) : Number.parseInt(def);
const isKindLike = (def, kind) => kind === "number" ? isNumberLike(def) : isIntegerLike(def);
const tryParseNumber = (token, options) => parseNumeric(token, "number", options);
const tryParseWellFormedNumber = (token, options) => parseNumeric(token, "number", { ...options, strict: true });
const tryParseInteger = (token, options) => parseNumeric(token, "integer", options);
const parseNumeric = (token, kind, options) => {
  const value2 = parseKind(token, kind);
  if (!Number.isNaN(value2)) {
    if (isKindLike(token, kind)) {
      if (options?.strict) {
        return isWellFormed(token, kind) ? value2 : throwParseError(writeMalformedNumericLiteralMessage(token, kind));
      }
      return value2;
    }
  }
  return options?.errorOnFail ? throwParseError(options?.errorOnFail === true ? `Failed to parse ${numericLiteralDescriptions[kind]} from '${token}'` : options?.errorOnFail) : void 0;
};
const tryParseWellFormedBigint = (def) => {
  if (def[def.length - 1] !== "n")
    return;
  const maybeIntegerLiteral = def.slice(0, -1);
  let value2;
  try {
    value2 = BigInt(maybeIntegerLiteral);
  } catch {
    return;
  }
  if (wellFormedIntegerMatcher.test(maybeIntegerLiteral))
    return value2;
  if (integerLikeMatcher.test(maybeIntegerLiteral)) {
    return throwParseError(writeMalformedNumericLiteralMessage(def, "bigint"));
  }
};
const arkUtilVersion = "0.50.0";
const initialRegistryContents = {
  version: arkUtilVersion,
  filename: isomorphic.fileName(),
  FileConstructor
};
const registry = initialRegistryContents;
const namesByResolution = /* @__PURE__ */ new Map();
const nameCounts = /* @__PURE__ */ Object.create(null);
const register = (value2) => {
  const existingName = namesByResolution.get(value2);
  if (existingName)
    return existingName;
  let name = baseNameFor(value2);
  if (nameCounts[name])
    name = `${name}${nameCounts[name]++}`;
  else
    nameCounts[name] = 1;
  registry[name] = value2;
  namesByResolution.set(value2, name);
  return name;
};
const isDotAccessible = (keyName) => /^[$A-Z_a-z][\w$]*$/.test(keyName);
const baseNameFor = (value2) => {
  switch (typeof value2) {
    case "object": {
      if (value2 === null)
        break;
      const prefix2 = objectKindOf(value2) ?? "object";
      return prefix2[0].toLowerCase() + prefix2.slice(1);
    }
    case "function":
      return isDotAccessible(value2.name) ? value2.name : "fn";
    case "symbol":
      return value2.description && isDotAccessible(value2.description) ? value2.description : "symbol";
  }
  return throwInternalError(`Unexpected attempt to register serializable value of type ${domainOf(value2)}`);
};
const serializePrimitive = (value2) => typeof value2 === "string" ? JSON.stringify(value2) : typeof value2 === "bigint" ? `${value2}n` : `${value2}`;
const snapshot = (data, opts = {}) => _serialize(data, {
  onUndefined: `$ark.undefined`,
  onBigInt: (n) => `$ark.bigint-${n}`,
  ...opts
}, []);
const printable = (data, opts) => {
  switch (domainOf(data)) {
    case "object":
      const o2 = data;
      const ctorName = o2.constructor.name;
      return ctorName === "Object" || ctorName === "Array" ? opts?.quoteKeys === false ? stringifyUnquoted(o2, opts?.indent ?? 0, "") : JSON.stringify(_serialize(o2, printableOpts, []), null, opts?.indent) : stringifyUnquoted(o2, opts?.indent ?? 0, "");
    case "symbol":
      return printableOpts.onSymbol(data);
    default:
      return serializePrimitive(data);
  }
};
const stringifyUnquoted = (value2, indent2, currentIndent) => {
  if (typeof value2 === "function")
    return printableOpts.onFunction(value2);
  if (typeof value2 !== "object" || value2 === null)
    return serializePrimitive(value2);
  const nextIndent = currentIndent + " ".repeat(indent2);
  if (Array.isArray(value2)) {
    if (value2.length === 0)
      return "[]";
    const items = value2.map((item) => stringifyUnquoted(item, indent2, nextIndent)).join(",\n" + nextIndent);
    return indent2 ? `[
${nextIndent}${items}
${currentIndent}]` : `[${items}]`;
  }
  const ctorName = value2.constructor.name;
  if (ctorName === "Object") {
    const keyValues = stringAndSymbolicEntriesOf(value2).map(([key, val]) => {
      const stringifiedKey = typeof key === "symbol" ? printableOpts.onSymbol(key) : isDotAccessible(key) ? key : JSON.stringify(key);
      const stringifiedValue = stringifyUnquoted(val, indent2, nextIndent);
      return `${nextIndent}${stringifiedKey}: ${stringifiedValue}`;
    });
    if (keyValues.length === 0)
      return "{}";
    return indent2 ? `{
${keyValues.join(",\n")}
${currentIndent}}` : `{${keyValues.join(", ")}}`;
  }
  if (value2 instanceof Date)
    return describeCollapsibleDate(value2);
  if ("expression" in value2 && typeof value2.expression === "string")
    return value2.expression;
  return ctorName;
};
const printableOpts = {
  onCycle: () => "(cycle)",
  onSymbol: (v) => `Symbol(${register(v)})`,
  onFunction: (v) => `Function(${register(v)})`
};
const _serialize = (data, opts, seen2) => {
  switch (domainOf(data)) {
    case "object": {
      const o2 = data;
      if ("toJSON" in o2 && typeof o2.toJSON === "function")
        return o2.toJSON();
      if (typeof o2 === "function")
        return printableOpts.onFunction(o2);
      if (seen2.includes(o2))
        return "(cycle)";
      const nextSeen = [...seen2, o2];
      if (Array.isArray(o2))
        return o2.map((item) => _serialize(item, opts, nextSeen));
      if (o2 instanceof Date)
        return o2.toDateString();
      const result = {};
      for (const k in o2)
        result[k] = _serialize(o2[k], opts, nextSeen);
      for (const s2 of Object.getOwnPropertySymbols(o2)) {
        result[opts.onSymbol?.(s2) ?? s2.toString()] = _serialize(o2[s2], opts, nextSeen);
      }
      return result;
    }
    case "symbol":
      return printableOpts.onSymbol(data);
    case "bigint":
      return opts.onBigInt?.(data) ?? `${data}n`;
    case "undefined":
      return opts.onUndefined ?? "undefined";
    case "string":
      return data.replaceAll("\\", "\\\\");
    default:
      return data;
  }
};
const describeCollapsibleDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  if (month === 0 && dayOfMonth === 1 && hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0)
    return `${year}`;
  const datePortion = `${months[month]} ${dayOfMonth}, ${year}`;
  if (hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0)
    return datePortion;
  let timePortion = date.toLocaleTimeString();
  const suffix2 = timePortion.endsWith(" AM") || timePortion.endsWith(" PM") ? timePortion.slice(-3) : "";
  if (suffix2)
    timePortion = timePortion.slice(0, -suffix2.length);
  if (milliseconds)
    timePortion += `.${pad(milliseconds, 3)}`;
  else if (timeWithUnnecessarySeconds.test(timePortion))
    timePortion = timePortion.slice(0, -3);
  return `${timePortion + suffix2}, ${datePortion}`;
};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const timeWithUnnecessarySeconds = /:\d\d:00$/;
const pad = (value2, length) => String(value2).padStart(length, "0");
const appendStringifiedKey = (path, prop, ...[opts]) => {
  const stringifySymbol = opts?.stringifySymbol ?? printable;
  let propAccessChain = path;
  switch (typeof prop) {
    case "string":
      propAccessChain = isDotAccessible(prop) ? path === "" ? prop : `${path}.${prop}` : `${path}[${JSON.stringify(prop)}]`;
      break;
    case "number":
      propAccessChain = `${path}[${prop}]`;
      break;
    case "symbol":
      propAccessChain = `${path}[${stringifySymbol(prop)}]`;
      break;
    default:
      if (opts?.stringifyNonKey)
        propAccessChain = `${path}[${opts.stringifyNonKey(prop)}]`;
      else {
        throwParseError(`${printable(prop)} must be a PropertyKey or stringifyNonKey must be passed to options`);
      }
  }
  return propAccessChain;
};
const stringifyPath = (path, ...opts) => path.reduce((s2, k) => appendStringifiedKey(s2, k, ...opts), "");
class ReadonlyPath extends ReadonlyArray {
  // alternate strategy for caching since the base object is frozen
  cache = {};
  constructor(...items) {
    super();
    this.push(...items);
  }
  toJSON() {
    if (this.cache.json)
      return this.cache.json;
    this.cache.json = [];
    for (let i2 = 0; i2 < this.length; i2++) {
      this.cache.json.push(typeof this[i2] === "symbol" ? printable(this[i2]) : this[i2]);
    }
    return this.cache.json;
  }
  stringify() {
    if (this.cache.stringify)
      return this.cache.stringify;
    return this.cache.stringify = stringifyPath(this);
  }
  stringifyAncestors() {
    if (this.cache.stringifyAncestors)
      return this.cache.stringifyAncestors;
    let propString = "";
    const result = [propString];
    for (const path of this) {
      propString = appendStringifiedKey(propString, path);
      result.push(propString);
    }
    return this.cache.stringifyAncestors = result;
  }
}
class Scanner {
  chars;
  i;
  def;
  constructor(def) {
    this.def = def;
    this.chars = [...def];
    this.i = 0;
  }
  /** Get lookahead and advance scanner by one */
  shift() {
    return this.chars[this.i++] ?? "";
  }
  get lookahead() {
    return this.chars[this.i] ?? "";
  }
  get nextLookahead() {
    return this.chars[this.i + 1] ?? "";
  }
  get length() {
    return this.chars.length;
  }
  shiftUntil(condition) {
    let shifted = "";
    while (this.lookahead) {
      if (condition(this, shifted))
        break;
      else
        shifted += this.shift();
    }
    return shifted;
  }
  shiftUntilEscapable(condition) {
    let shifted = "";
    while (this.lookahead) {
      if (this.lookahead === Backslash) {
        this.shift();
        if (condition(this, shifted))
          shifted += this.shift();
        else if (this.lookahead === Backslash)
          shifted += this.shift();
        else
          shifted += `${Backslash}${this.shift()}`;
      } else if (condition(this, shifted))
        break;
      else
        shifted += this.shift();
    }
    return shifted;
  }
  shiftUntilLookahead(charOrSet) {
    return typeof charOrSet === "string" ? this.shiftUntil((s2) => s2.lookahead === charOrSet) : this.shiftUntil((s2) => s2.lookahead in charOrSet);
  }
  shiftUntilNonWhitespace() {
    return this.shiftUntil(() => !(this.lookahead in whitespaceChars));
  }
  jumpToIndex(i2) {
    this.i = i2 < 0 ? this.length + i2 : i2;
  }
  jumpForward(count) {
    this.i += count;
  }
  get location() {
    return this.i;
  }
  get unscanned() {
    return this.chars.slice(this.i, this.length).join("");
  }
  get scanned() {
    return this.chars.slice(0, this.i).join("");
  }
  sliceChars(start, end) {
    return this.chars.slice(start, end).join("");
  }
  lookaheadIs(char) {
    return this.lookahead === char;
  }
  lookaheadIsIn(tokens) {
    return this.lookahead in tokens;
  }
}
const writeUnmatchedGroupCloseMessage = (char, unscanned) => `Unmatched ${char}${unscanned === "" ? "" : ` before ${unscanned}`}`;
const writeUnclosedGroupMessage = (missingChar) => `Missing ${missingChar}`;
let _registryName = "$ark";
let suffix = 2;
while (_registryName in globalThis)
  _registryName = `$ark${suffix++}`;
const registryName = _registryName;
globalThis[registryName] = registry;
const $ark = registry;
const reference = (name) => `${registryName}.${name}`;
const registeredReference = (value2) => reference(register(value2));
class CompiledFunction extends CastableBase {
  argNames;
  body = "";
  constructor(...args) {
    super();
    this.argNames = args;
    for (const arg of args) {
      if (arg in this) {
        throw new Error(`Arg name '${arg}' would overwrite an existing property on FunctionBody`);
      }
      this[arg] = arg;
    }
  }
  indentation = 0;
  indent() {
    this.indentation += 4;
    return this;
  }
  dedent() {
    this.indentation -= 4;
    return this;
  }
  prop(key, optional = false) {
    return compileLiteralPropAccess(key, optional);
  }
  index(key, optional = false) {
    return indexPropAccess(`${key}`, optional);
  }
  line(statement) {
    this.body += `${" ".repeat(this.indentation)}${statement}
`;
    return this;
  }
  const(identifier, expression) {
    this.line(`const ${identifier} = ${expression}`);
    return this;
  }
  let(identifier, expression) {
    return this.line(`let ${identifier} = ${expression}`);
  }
  set(identifier, expression) {
    return this.line(`${identifier} = ${expression}`);
  }
  if(condition, then) {
    return this.block(`if (${condition})`, then);
  }
  elseIf(condition, then) {
    return this.block(`else if (${condition})`, then);
  }
  else(then) {
    return this.block("else", then);
  }
  /** Current index is "i" */
  for(until, body, initialValue = 0) {
    return this.block(`for (let i = ${initialValue}; ${until}; i++)`, body);
  }
  /** Current key is "k" */
  forIn(object2, body) {
    return this.block(`for (const k in ${object2})`, body);
  }
  block(prefix2, contents, suffix2 = "") {
    this.line(`${prefix2} {`);
    this.indent();
    contents(this);
    this.dedent();
    return this.line(`}${suffix2}`);
  }
  return(expression = "") {
    return this.line(`return ${expression}`);
  }
  write(name = "anonymous", indent2 = 0) {
    return `${name}(${this.argNames.join(", ")}) { ${indent2 ? this.body.split("\n").map((l2) => " ".repeat(indent2) + `${l2}`).join("\n") : this.body} }`;
  }
  compile() {
    return new DynamicFunction(...this.argNames, this.body);
  }
}
const compileSerializedValue = (value2) => hasDomain(value2, "object") || typeof value2 === "symbol" ? registeredReference(value2) : serializePrimitive(value2);
const compileLiteralPropAccess = (key, optional = false) => {
  if (typeof key === "string" && isDotAccessible(key))
    return `${optional ? "?" : ""}.${key}`;
  return indexPropAccess(serializeLiteralKey(key), optional);
};
const serializeLiteralKey = (key) => typeof key === "symbol" ? registeredReference(key) : JSON.stringify(key);
const indexPropAccess = (key, optional = false) => `${optional ? "?." : ""}[${key}]`;
class NodeCompiler extends CompiledFunction {
  traversalKind;
  optimistic;
  constructor(ctx) {
    super("data", "ctx");
    this.traversalKind = ctx.kind;
    this.optimistic = ctx.optimistic === true;
  }
  invoke(node2, opts) {
    const arg = opts?.arg ?? this.data;
    const requiresContext = typeof node2 === "string" ? true : this.requiresContextFor(node2);
    const id2 = typeof node2 === "string" ? node2 : node2.id;
    if (requiresContext)
      return `${this.referenceToId(id2, opts)}(${arg}, ${this.ctx})`;
    return `${this.referenceToId(id2, opts)}(${arg})`;
  }
  referenceToId(id2, opts) {
    const invokedKind = opts?.kind ?? this.traversalKind;
    const base = `this.${id2}${invokedKind}`;
    return opts?.bind ? `${base}.bind(${opts?.bind})` : base;
  }
  requiresContextFor(node2) {
    return this.traversalKind === "Apply" || node2.allowsRequiresContext;
  }
  initializeErrorCount() {
    return this.const("errorCount", "ctx.currentErrorCount");
  }
  returnIfFail() {
    return this.if("ctx.currentErrorCount > errorCount", () => this.return());
  }
  returnIfFailFast() {
    return this.if("ctx.failFast && ctx.currentErrorCount > errorCount", () => this.return());
  }
  traverseKey(keyExpression, accessExpression, node2) {
    const requiresContext = this.requiresContextFor(node2);
    if (requiresContext)
      this.line(`${this.ctx}.path.push(${keyExpression})`);
    this.check(node2, {
      arg: accessExpression
    });
    if (requiresContext)
      this.line(`${this.ctx}.path.pop()`);
    return this;
  }
  check(node2, opts) {
    return this.traversalKind === "Allows" ? this.if(`!${this.invoke(node2, opts)}`, () => this.return(false)) : this.line(this.invoke(node2, opts));
  }
}
const makeRootAndArrayPropertiesMutable = (o2) => (
  // this cast should not be required, but it seems TS is referencing
  // the wrong parameters here?
  flatMorph(o2, (k, v) => [k, isArray(v) ? [...v] : v])
);
const arkKind = noSuggest("arkKind");
const hasArkKind = (value2, kind) => value2?.[arkKind] === kind;
const isNode = (value2) => hasArkKind(value2, "root") || hasArkKind(value2, "constraint");
const basisKinds = ["unit", "proto", "domain"];
const structuralKinds = [
  "required",
  "optional",
  "index",
  "sequence"
];
const prestructuralKinds = [
  "pattern",
  "divisor",
  "exactLength",
  "max",
  "min",
  "maxLength",
  "minLength",
  "before",
  "after"
];
const refinementKinds = [
  ...prestructuralKinds,
  "structure",
  "predicate"
];
const constraintKinds = [...refinementKinds, ...structuralKinds];
const rootKinds = [
  "alias",
  "union",
  "morph",
  "unit",
  "intersection",
  "proto",
  "domain"
];
const nodeKinds = [...rootKinds, ...constraintKinds];
const constraintKeys = flatMorph(constraintKinds, (i2, kind) => [kind, 1]);
const structureKeys = flatMorph([...structuralKinds, "undeclared"], (i2, k) => [k, 1]);
const precedenceByKind = flatMorph(nodeKinds, (i2, kind) => [kind, i2]);
const isNodeKind = (value2) => typeof value2 === "string" && value2 in precedenceByKind;
const precedenceOfKind = (kind) => precedenceByKind[kind];
const schemaKindsRightOf = (kind) => rootKinds.slice(precedenceOfKind(kind) + 1);
[
  ...schemaKindsRightOf("union"),
  "alias"
];
[
  ...schemaKindsRightOf("morph"),
  "alias"
];
const defaultValueSerializer = (v) => {
  if (typeof v === "string" || typeof v === "boolean" || v === null)
    return v;
  if (typeof v === "number") {
    if (Number.isNaN(v))
      return "NaN";
    if (v === Number.POSITIVE_INFINITY)
      return "Infinity";
    if (v === Number.NEGATIVE_INFINITY)
      return "-Infinity";
    return v;
  }
  return compileSerializedValue(v);
};
const compileObjectLiteral = (ctx) => {
  let result = "{ ";
  for (const [k, v] of Object.entries(ctx))
    result += `${k}: ${compileSerializedValue(v)}, `;
  return result + " }";
};
const implementNode = (_) => {
  const implementation2 = _;
  if (implementation2.hasAssociatedError) {
    implementation2.defaults.expected ??= (ctx) => "description" in ctx ? ctx.description : implementation2.defaults.description(ctx);
    implementation2.defaults.actual ??= (data) => printable(data);
    implementation2.defaults.problem ??= (ctx) => `must be ${ctx.expected}${ctx.actual ? ` (was ${ctx.actual})` : ""}`;
    implementation2.defaults.message ??= (ctx) => {
      if (ctx.path.length === 0)
        return ctx.problem;
      const problemWithLocation = `${ctx.propString} ${ctx.problem}`;
      if (problemWithLocation[0] === "[") {
        return `value at ${problemWithLocation}`;
      }
      return problemWithLocation;
    };
  }
  return implementation2;
};
class ToJsonSchemaError extends Error {
  name = "ToJsonSchemaError";
  code;
  context;
  constructor(code, context) {
    super(printable(context, { quoteKeys: false, indent: 4 }));
    this.code = code;
    this.context = context;
  }
  hasCode(code) {
    return this.code === code;
  }
}
const defaultConfig = {
  dialect: "https://json-schema.org/draft/2020-12/schema",
  useRefs: false,
  fallback: {
    arrayObject: (ctx) => ToJsonSchema.throw("arrayObject", ctx),
    arrayPostfix: (ctx) => ToJsonSchema.throw("arrayPostfix", ctx),
    defaultValue: (ctx) => ToJsonSchema.throw("defaultValue", ctx),
    domain: (ctx) => ToJsonSchema.throw("domain", ctx),
    morph: (ctx) => ToJsonSchema.throw("morph", ctx),
    patternIntersection: (ctx) => ToJsonSchema.throw("patternIntersection", ctx),
    predicate: (ctx) => ToJsonSchema.throw("predicate", ctx),
    proto: (ctx) => ToJsonSchema.throw("proto", ctx),
    symbolKey: (ctx) => ToJsonSchema.throw("symbolKey", ctx),
    unit: (ctx) => ToJsonSchema.throw("unit", ctx),
    date: (ctx) => ToJsonSchema.throw("date", ctx)
  }
};
const ToJsonSchema = {
  Error: ToJsonSchemaError,
  throw: (...args) => {
    throw new ToJsonSchema.Error(...args);
  },
  throwInternalOperandError: (kind, schema) => throwInternalError(`Unexpected JSON Schema input for ${kind}: ${printable(schema)}`),
  defaultConfig
};
$ark.config ??= {};
const mergeConfigs = (base, merged) => {
  if (!merged)
    return base;
  const result = { ...base };
  let k;
  for (k in merged) {
    const keywords2 = { ...base.keywords };
    if (k === "keywords") {
      for (const flatAlias in merged[k]) {
        const v = merged.keywords[flatAlias];
        if (v === void 0)
          continue;
        keywords2[flatAlias] = typeof v === "string" ? { description: v } : v;
      }
      result.keywords = keywords2;
    } else if (k === "toJsonSchema") {
      result[k] = mergeToJsonSchemaConfigs(base.toJsonSchema, merged.toJsonSchema);
    } else if (isNodeKind(k)) {
      result[k] = // not casting this makes TS compute a very inefficient
      // type that is not needed
      {
        ...base[k],
        ...merged[k]
      };
    } else
      result[k] = merged[k];
  }
  return result;
};
const mergeToJsonSchemaConfigs = ((baseConfig, mergedConfig) => {
  if (!baseConfig)
    return mergedConfig ?? {};
  if (!mergedConfig)
    return baseConfig;
  const result = { ...baseConfig };
  let k;
  for (k in mergedConfig) {
    if (k === "fallback") {
      result.fallback = mergeFallbacks(baseConfig.fallback, mergedConfig.fallback);
    } else
      result[k] = mergedConfig[k];
  }
  return result;
});
const mergeFallbacks = (base, merged) => {
  base = normalizeFallback(base);
  merged = normalizeFallback(merged);
  const result = {};
  let code;
  for (code in ToJsonSchema.defaultConfig.fallback) {
    result[code] = merged[code] ?? merged.default ?? base[code] ?? base.default ?? ToJsonSchema.defaultConfig.fallback[code];
  }
  return result;
};
const normalizeFallback = (fallback) => typeof fallback === "function" ? { default: fallback } : fallback ?? {};
class ArkError extends CastableBase {
  [arkKind] = "error";
  path;
  data;
  nodeConfig;
  input;
  ctx;
  // TS gets confused by <code>, so internally we just use the base type for input
  constructor({ prefixPath, relativePath, ...input }, ctx) {
    super();
    this.input = input;
    this.ctx = ctx;
    defineProperties(this, input);
    const data = ctx.data;
    if (input.code === "union") {
      input.errors = input.errors.flatMap((innerError) => {
        const flat = innerError.hasCode("union") ? innerError.errors : [innerError];
        if (!prefixPath && !relativePath)
          return flat;
        return flat.map((e) => e.transform((e2) => ({
          ...e2,
          path: conflatenateAll(prefixPath, e2.path, relativePath)
        })));
      });
    }
    this.nodeConfig = ctx.config[this.code];
    const basePath = [...input.path ?? ctx.path];
    if (relativePath)
      basePath.push(...relativePath);
    if (prefixPath)
      basePath.unshift(...prefixPath);
    this.path = new ReadonlyPath(...basePath);
    this.data = "data" in input ? input.data : data;
  }
  transform(f) {
    return new ArkError(f({
      data: this.data,
      path: this.path,
      ...this.input
    }), this.ctx);
  }
  hasCode(code) {
    return this.code === code;
  }
  get propString() {
    return stringifyPath(this.path);
  }
  get expected() {
    if (this.input.expected)
      return this.input.expected;
    const config = this.meta?.expected ?? this.nodeConfig.expected;
    return typeof config === "function" ? config(this.input) : config;
  }
  get actual() {
    if (this.input.actual)
      return this.input.actual;
    const config = this.meta?.actual ?? this.nodeConfig.actual;
    return typeof config === "function" ? config(this.data) : config;
  }
  get problem() {
    if (this.input.problem)
      return this.input.problem;
    const config = this.meta?.problem ?? this.nodeConfig.problem;
    return typeof config === "function" ? config(this) : config;
  }
  get message() {
    if (this.input.message)
      return this.input.message;
    const config = this.meta?.message ?? this.nodeConfig.message;
    return typeof config === "function" ? config(this) : config;
  }
  get flat() {
    return this.hasCode("intersection") ? [...this.errors] : [this];
  }
  toJSON() {
    return {
      data: this.data,
      path: this.path,
      ...this.input,
      expected: this.expected,
      actual: this.actual,
      problem: this.problem,
      message: this.message
    };
  }
  toString() {
    return this.message;
  }
  throw() {
    throw this;
  }
}
class ArkErrors extends ReadonlyArray {
  [arkKind] = "errors";
  ctx;
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }
  /**
   * Errors by a pathString representing their location.
   */
  byPath = /* @__PURE__ */ Object.create(null);
  /**
   * {@link byPath} flattened so that each value is an array of ArkError instances at that path.
   *
   * ✅ Since "intersection" errors will be flattened to their constituent `.errors`,
   * they will never be directly present in this representation.
   */
  get flatByPath() {
    return flatMorph(this.byPath, (k, v) => [k, v.flat]);
  }
  /**
   * {@link byPath} flattened so that each value is an array of problem strings at that path.
   */
  get flatProblemsByPath() {
    return flatMorph(this.byPath, (k, v) => [k, v.flat.map((e) => e.problem)]);
  }
  /**
   * All pathStrings at which errors are present mapped to the errors occuring
   * at that path or any nested path within it.
   */
  byAncestorPath = /* @__PURE__ */ Object.create(null);
  count = 0;
  mutable = this;
  /**
   * Throw a TraversalError based on these errors.
   */
  throw() {
    throw this.toTraversalError();
  }
  /**
   * Converts ArkErrors to TraversalError, a subclass of `Error` suitable for throwing with nice
   * formatting.
   */
  toTraversalError() {
    return new TraversalError(this);
  }
  /**
   * Append an ArkError to this array, ignoring duplicates.
   */
  add(error) {
    const existing = this.byPath[error.propString];
    if (existing) {
      if (error === existing)
        return;
      if (existing.hasCode("union") && existing.errors.length === 0)
        return;
      const errorIntersection = error.hasCode("union") && error.errors.length === 0 ? error : new ArkError({
        code: "intersection",
        errors: existing.hasCode("intersection") ? [...existing.errors, error] : [existing, error]
      }, this.ctx);
      const existingIndex = this.indexOf(existing);
      this.mutable[existingIndex === -1 ? this.length : existingIndex] = errorIntersection;
      this.byPath[error.propString] = errorIntersection;
      this.addAncestorPaths(error);
    } else {
      this.byPath[error.propString] = error;
      this.addAncestorPaths(error);
      this.mutable.push(error);
    }
    this.count++;
  }
  transform(f) {
    const result = new ArkErrors(this.ctx);
    for (const e of this)
      result.add(f(e));
    return result;
  }
  /**
   * Add all errors from an ArkErrors instance, ignoring duplicates and
   * prefixing their paths with that of the current Traversal.
   */
  merge(errors) {
    for (const e of errors) {
      this.add(new ArkError({ ...e, path: [...this.ctx.path, ...e.path] }, this.ctx));
    }
  }
  /**
   * @internal
   */
  affectsPath(path) {
    if (this.length === 0)
      return false;
    return (
      // this would occur if there is an existing error at a prefix of path
      // e.g. the path is ["foo", "bar"] and there is an error at ["foo"]
      path.stringifyAncestors().some((s2) => s2 in this.byPath) || // this would occur if there is an existing error at a suffix of path
      // e.g. the path is ["foo"] and there is an error at ["foo", "bar"]
      path.stringify() in this.byAncestorPath
    );
  }
  /**
   * A human-readable summary of all errors.
   */
  get summary() {
    return this.toString();
  }
  /**
   * Alias of this ArkErrors instance for StandardSchema compatibility.
   */
  get issues() {
    return this;
  }
  toJSON() {
    return [...this.map((e) => e.toJSON())];
  }
  toString() {
    return this.join("\n");
  }
  addAncestorPaths(error) {
    for (const propString of error.path.stringifyAncestors()) {
      this.byAncestorPath[propString] = append(this.byAncestorPath[propString], error);
    }
  }
}
class TraversalError extends Error {
  name = "TraversalError";
  constructor(errors) {
    if (errors.length === 1)
      super(errors.summary);
    else
      super("\n" + errors.map((error) => `  • ${indent(error)}`).join("\n"));
    Object.defineProperty(this, "arkErrors", {
      value: errors,
      enumerable: false
    });
  }
}
const indent = (error) => error.toString().split("\n").join("\n  ");
class Traversal {
  /**
   * #### the path being validated or morphed
   *
   * ✅ array indices represented as numbers
   * ⚠️ mutated during traversal - use `path.slice(0)` to snapshot
   * 🔗 use {@link propString} for a stringified version
   */
  path = [];
  /**
   * #### {@link ArkErrors} that will be part of this traversal's finalized result
   *
   * ✅ will always be an empty array for a valid traversal
   */
  errors = new ArkErrors(this);
  /**
   * #### the original value being traversed
   */
  root;
  /**
   * #### configuration for this traversal
   *
   * ✅ options can affect traversal results and error messages
   * ✅ defaults < global config < scope config
   * ✅ does not include options configured on individual types
   */
  config;
  queuedMorphs = [];
  branches = [];
  seen = {};
  constructor(root, config) {
    this.root = root;
    this.config = config;
  }
  /**
   * #### the data being validated or morphed
   *
   * ✅ extracted from {@link root} at {@link path}
   */
  get data() {
    let result = this.root;
    for (const segment of this.path)
      result = result?.[segment];
    return result;
  }
  /**
   * #### a string representing {@link path}
   *
   * @propString
   */
  get propString() {
    return stringifyPath(this.path);
  }
  /**
   * #### add an {@link ArkError} and return `false`
   *
   * ✅ useful for predicates like `.narrow`
   */
  reject(input) {
    this.error(input);
    return false;
  }
  /**
   * #### add an {@link ArkError} from a description and return `false`
   *
   * ✅ useful for predicates like `.narrow`
   * 🔗 equivalent to {@link reject}({ expected })
   */
  mustBe(expected) {
    this.error(expected);
    return false;
  }
  error(input) {
    const errCtx = typeof input === "object" ? input.code ? input : { ...input, code: "predicate" } : { code: "predicate", expected: input };
    return this.errorFromContext(errCtx);
  }
  /**
   * #### whether {@link currentBranch} (or the traversal root, outside a union) has one or more errors
   */
  hasError() {
    return this.currentErrorCount !== 0;
  }
  get currentBranch() {
    return this.branches.at(-1);
  }
  queueMorphs(morphs) {
    const input = {
      path: new ReadonlyPath(...this.path),
      morphs
    };
    if (this.currentBranch)
      this.currentBranch.queuedMorphs.push(input);
    else
      this.queuedMorphs.push(input);
  }
  finalize(onFail) {
    if (this.queuedMorphs.length) {
      if (typeof this.root === "object" && this.root !== null && this.config.clone)
        this.root = this.config.clone(this.root);
      this.applyQueuedMorphs();
    }
    if (this.hasError())
      return onFail ? onFail(this.errors) : this.errors;
    return this.root;
  }
  get currentErrorCount() {
    return this.currentBranch ? this.currentBranch.error ? 1 : 0 : this.errors.count;
  }
  get failFast() {
    return this.branches.length !== 0;
  }
  pushBranch() {
    this.branches.push({
      error: void 0,
      queuedMorphs: []
    });
  }
  popBranch() {
    return this.branches.pop();
  }
  /**
   * @internal
   * Convenience for casting from InternalTraversal to Traversal
   * for cases where the extra methods on the external type are expected, e.g.
   * a morph or predicate.
   */
  get external() {
    return this;
  }
  errorFromNodeContext(input) {
    return this.errorFromContext(input);
  }
  errorFromContext(errCtx) {
    const error = new ArkError(errCtx, this);
    if (this.currentBranch)
      this.currentBranch.error = error;
    else
      this.errors.add(error);
    return error;
  }
  applyQueuedMorphs() {
    while (this.queuedMorphs.length) {
      const queuedMorphs = this.queuedMorphs;
      this.queuedMorphs = [];
      for (const { path, morphs } of queuedMorphs) {
        if (this.errors.affectsPath(path))
          continue;
        this.applyMorphsAtPath(path, morphs);
      }
    }
  }
  applyMorphsAtPath(path, morphs) {
    const key = path.at(-1);
    let parent;
    if (key !== void 0) {
      parent = this.root;
      for (let pathIndex = 0; pathIndex < path.length - 1; pathIndex++)
        parent = parent[path[pathIndex]];
    }
    for (const morph of morphs) {
      this.path = [...path];
      const morphIsNode = isNode(morph);
      const result = morph(parent === void 0 ? this.root : parent[key], this);
      if (result instanceof ArkError) {
        this.errors.add(result);
        break;
      }
      if (result instanceof ArkErrors) {
        if (!morphIsNode) {
          this.errors.merge(result);
        }
        this.queuedMorphs = [];
        break;
      }
      if (parent === void 0)
        this.root = result;
      else
        parent[key] = result;
      this.applyQueuedMorphs();
    }
  }
}
const traverseKey = (key, fn, ctx) => {
  if (!ctx)
    return fn();
  ctx.path.push(key);
  const result = fn();
  ctx.path.pop();
  return result;
};
class BaseNode extends Callable {
  attachments;
  $;
  onFail;
  includesTransform;
  includesContextualPredicate;
  isCyclic;
  allowsRequiresContext;
  rootApplyStrategy;
  contextFreeMorph;
  rootApply;
  referencesById;
  shallowReferences;
  flatRefs;
  flatMorphs;
  allows;
  get shallowMorphs() {
    return [];
  }
  constructor(attachments, $) {
    super((data, pipedFromCtx, onFail = this.onFail) => {
      if (pipedFromCtx) {
        this.traverseApply(data, pipedFromCtx);
        return pipedFromCtx.hasError() ? pipedFromCtx.errors : pipedFromCtx.data;
      }
      return this.rootApply(data, onFail);
    }, { attach: attachments });
    this.attachments = attachments;
    this.$ = $;
    this.onFail = this.meta.onFail ?? this.$.resolvedConfig.onFail;
    this.includesTransform = this.hasKind("morph") || this.hasKind("structure") && this.structuralMorph !== void 0 || this.hasKind("sequence") && this.inner.defaultables !== void 0;
    this.includesContextualPredicate = this.hasKind("predicate") && this.inner.predicate.length !== 1;
    this.isCyclic = this.kind === "alias";
    this.referencesById = { [this.id]: this };
    this.shallowReferences = this.hasKind("structure") ? [this, ...this.children] : this.children.reduce((acc, child) => appendUniqueNodes(acc, child.shallowReferences), [this]);
    const isStructural = this.isStructural();
    this.flatRefs = [];
    this.flatMorphs = [];
    for (let i2 = 0; i2 < this.children.length; i2++) {
      this.includesTransform ||= this.children[i2].includesTransform;
      this.includesContextualPredicate ||= this.children[i2].includesContextualPredicate;
      this.isCyclic ||= this.children[i2].isCyclic;
      if (!isStructural) {
        const childFlatRefs = this.children[i2].flatRefs;
        for (let j = 0; j < childFlatRefs.length; j++) {
          const childRef = childFlatRefs[j];
          if (!this.flatRefs.some((existing) => flatRefsAreEqual(existing, childRef))) {
            this.flatRefs.push(childRef);
            for (const branch of childRef.node.branches) {
              if (branch.hasKind("morph") || branch.hasKind("intersection") && branch.structure?.structuralMorph !== void 0) {
                this.flatMorphs.push({
                  path: childRef.path,
                  propString: childRef.propString,
                  node: branch
                });
              }
            }
          }
        }
      }
      Object.assign(this.referencesById, this.children[i2].referencesById);
    }
    this.flatRefs.sort((l2, r2) => l2.path.length > r2.path.length ? 1 : l2.path.length < r2.path.length ? -1 : l2.propString > r2.propString ? 1 : l2.propString < r2.propString ? -1 : l2.node.expression < r2.node.expression ? -1 : 1);
    this.allowsRequiresContext = this.includesContextualPredicate || this.isCyclic;
    this.rootApplyStrategy = !this.allowsRequiresContext && this.flatMorphs.length === 0 ? this.shallowMorphs.length === 0 ? "allows" : this.shallowMorphs.every((morph) => morph.length === 1 || morph.name === "$arkStructuralMorph") ? this.hasKind("union") ? (
      // multiple morphs not yet supported for optimistic compilation
      this.branches.some((branch) => branch.shallowMorphs.length > 1) ? "contextual" : "branchedOptimistic"
    ) : this.shallowMorphs.length > 1 ? "contextual" : "optimistic" : "contextual" : "contextual";
    this.rootApply = this.createRootApply();
    this.allows = this.allowsRequiresContext ? (data) => this.traverseAllows(data, new Traversal(data, this.$.resolvedConfig)) : (data) => this.traverseAllows(data);
  }
  createRootApply() {
    switch (this.rootApplyStrategy) {
      case "allows":
        return (data, onFail) => {
          if (this.allows(data))
            return data;
          const ctx = new Traversal(data, this.$.resolvedConfig);
          this.traverseApply(data, ctx);
          return ctx.finalize(onFail);
        };
      case "contextual":
        return (data, onFail) => {
          const ctx = new Traversal(data, this.$.resolvedConfig);
          this.traverseApply(data, ctx);
          return ctx.finalize(onFail);
        };
      case "optimistic":
        this.contextFreeMorph = this.shallowMorphs[0];
        const clone = this.$.resolvedConfig.clone;
        return (data, onFail) => {
          if (this.allows(data)) {
            return this.contextFreeMorph(clone && (typeof data === "object" && data !== null || typeof data === "function") ? clone(data) : data);
          }
          const ctx = new Traversal(data, this.$.resolvedConfig);
          this.traverseApply(data, ctx);
          return ctx.finalize(onFail);
        };
      case "branchedOptimistic":
        return this.createBranchedOptimisticRootApply();
      default:
        this.rootApplyStrategy;
        return throwInternalError(`Unexpected rootApplyStrategy ${this.rootApplyStrategy}`);
    }
  }
  compiledMeta = compileMeta(this.metaJson);
  cacheGetter(name, value2) {
    Object.defineProperty(this, name, { value: value2 });
    return value2;
  }
  get description() {
    return this.cacheGetter("description", this.meta?.description ?? this.$.resolvedConfig[this.kind].description(this));
  }
  // we don't cache this currently since it can be updated once a scope finishes
  // resolving cyclic references, although it may be possible to ensure it is cached safely
  get references() {
    return Object.values(this.referencesById);
  }
  precedence = precedenceOfKind(this.kind);
  precompilation;
  // defined as an arrow function since it is often detached, e.g. when passing to tRPC
  // otherwise, would run into issues with this binding
  assert = (data, pipedFromCtx) => this(data, pipedFromCtx, (errors) => errors.throw());
  traverse(data, pipedFromCtx) {
    return this(data, pipedFromCtx, null);
  }
  /** rawIn should be used internally instead */
  get in() {
    return this.cacheGetter("in", this.rawIn.isRoot() ? this.$.finalize(this.rawIn) : this.rawIn);
  }
  get rawIn() {
    return this.cacheGetter("rawIn", this.getIo("in"));
  }
  /** rawOut should be used internally instead */
  get out() {
    return this.cacheGetter("out", this.rawOut.isRoot() ? this.$.finalize(this.rawOut) : this.rawOut);
  }
  get rawOut() {
    return this.cacheGetter("rawOut", this.getIo("out"));
  }
  // Should be refactored to use transform
  // https://github.com/arktypeio/arktype/issues/1020
  getIo(ioKind) {
    if (!this.includesTransform)
      return this;
    const ioInner = {};
    for (const [k, v] of this.innerEntries) {
      const keySchemaImplementation = this.impl.keys[k];
      if (keySchemaImplementation.reduceIo)
        keySchemaImplementation.reduceIo(ioKind, ioInner, v);
      else if (keySchemaImplementation.child) {
        const childValue = v;
        ioInner[k] = isArray(childValue) ? childValue.map((child) => ioKind === "in" ? child.rawIn : child.rawOut) : ioKind === "in" ? childValue.rawIn : childValue.rawOut;
      } else
        ioInner[k] = v;
    }
    return this.$.node(this.kind, ioInner);
  }
  toJSON() {
    return this.json;
  }
  toString() {
    return `Type<${this.expression}>`;
  }
  equals(r2) {
    const rNode = isNode(r2) ? r2 : this.$.parseDefinition(r2);
    return this.innerHash === rNode.innerHash;
  }
  ifEquals(r2) {
    return this.equals(r2) ? this : void 0;
  }
  hasKind(kind) {
    return this.kind === kind;
  }
  assertHasKind(kind) {
    if (this.kind !== kind)
      throwError(`${this.kind} node was not of asserted kind ${kind}`);
    return this;
  }
  hasKindIn(...kinds) {
    return kinds.includes(this.kind);
  }
  assertHasKindIn(...kinds) {
    if (!includes(kinds, this.kind))
      throwError(`${this.kind} node was not one of asserted kinds ${kinds}`);
    return this;
  }
  isBasis() {
    return includes(basisKinds, this.kind);
  }
  isConstraint() {
    return includes(constraintKinds, this.kind);
  }
  isStructural() {
    return includes(structuralKinds, this.kind);
  }
  isRefinement() {
    return includes(refinementKinds, this.kind);
  }
  isRoot() {
    return includes(rootKinds, this.kind);
  }
  isUnknown() {
    return this.hasKind("intersection") && this.children.length === 0;
  }
  isNever() {
    return this.hasKind("union") && this.children.length === 0;
  }
  hasUnit(value2) {
    return this.hasKind("unit") && this.allows(value2);
  }
  hasOpenIntersection() {
    return this.impl.intersectionIsOpen;
  }
  get nestableExpression() {
    return this.expression;
  }
  select(selector) {
    const normalized = NodeSelector.normalize(selector);
    return this._select(normalized);
  }
  _select(selector) {
    let nodes = NodeSelector.applyBoundary[selector.boundary ?? "references"](this);
    if (selector.kind)
      nodes = nodes.filter((n) => n.kind === selector.kind);
    if (selector.where)
      nodes = nodes.filter(selector.where);
    return NodeSelector.applyMethod[selector.method ?? "filter"](nodes, this, selector);
  }
  transform(mapper, opts) {
    return this._transform(mapper, this._createTransformContext(opts));
  }
  _createTransformContext(opts) {
    return {
      root: this,
      selected: void 0,
      seen: {},
      path: [],
      parseOptions: {
        prereduced: opts?.prereduced ?? false
      },
      undeclaredKeyHandling: void 0,
      ...opts
    };
  }
  _transform(mapper, ctx) {
    const $ = ctx.bindScope ?? this.$;
    if (ctx.seen[this.id])
      return this.$.lazilyResolve(ctx.seen[this.id]);
    if (ctx.shouldTransform?.(this, ctx) === false)
      return this;
    let transformedNode;
    ctx.seen[this.id] = () => transformedNode;
    if (this.hasKind("structure") && this.undeclared !== ctx.undeclaredKeyHandling) {
      ctx = {
        ...ctx,
        undeclaredKeyHandling: this.undeclared
      };
    }
    const innerWithTransformedChildren = flatMorph(this.inner, (k, v) => {
      if (!this.impl.keys[k].child)
        return [k, v];
      const children = v;
      if (!isArray(children)) {
        const transformed2 = children._transform(mapper, ctx);
        return transformed2 ? [k, transformed2] : [];
      }
      if (children.length === 0)
        return [k, v];
      const transformed = children.flatMap((n) => {
        const transformedChild = n._transform(mapper, ctx);
        return transformedChild ?? [];
      });
      return transformed.length ? [k, transformed] : [];
    });
    delete ctx.seen[this.id];
    const innerWithMeta = Object.assign(innerWithTransformedChildren, {
      meta: this.meta
    });
    const transformedInner = ctx.selected && !ctx.selected.includes(this) ? innerWithMeta : mapper(this.kind, innerWithMeta, ctx);
    if (transformedInner === null)
      return null;
    if (isNode(transformedInner))
      return transformedNode = transformedInner;
    const transformedKeys = Object.keys(transformedInner);
    const hasNoTypedKeys = transformedKeys.length === 0 || transformedKeys.length === 1 && transformedKeys[0] === "meta";
    if (hasNoTypedKeys && // if inner was previously an empty object (e.g. unknown) ensure it is not pruned
    !isEmptyObject(this.inner))
      return null;
    if ((this.kind === "required" || this.kind === "optional" || this.kind === "index") && !("value" in transformedInner)) {
      return ctx.undeclaredKeyHandling ? { ...transformedInner, value: $ark.intrinsic.unknown } : null;
    }
    if (this.kind === "morph") {
      transformedInner.in ??= $ark.intrinsic.unknown;
    }
    return transformedNode = $.node(this.kind, transformedInner, ctx.parseOptions);
  }
  configureReferences(meta, selector = "references") {
    const normalized = NodeSelector.normalize(selector);
    const mapper = typeof meta === "string" ? (kind, inner) => ({
      ...inner,
      meta: { ...inner.meta, description: meta }
    }) : typeof meta === "function" ? (kind, inner) => ({ ...inner, meta: meta(inner.meta) }) : (kind, inner) => ({
      ...inner,
      meta: { ...inner.meta, ...meta }
    });
    if (normalized.boundary === "self") {
      return this.$.node(this.kind, mapper(this.kind, { ...this.inner, meta: this.meta }));
    }
    const rawSelected = this._select(normalized);
    const selected = rawSelected && liftArray(rawSelected);
    const shouldTransform = normalized.boundary === "child" ? (node2, ctx) => ctx.root.children.includes(node2) : normalized.boundary === "shallow" ? (node2) => node2.kind !== "structure" : () => true;
    return this.$.finalize(this.transform(mapper, {
      shouldTransform,
      selected
    }));
  }
}
const NodeSelector = {
  applyBoundary: {
    self: (node2) => [node2],
    child: (node2) => [...node2.children],
    shallow: (node2) => [...node2.shallowReferences],
    references: (node2) => [...node2.references]
  },
  applyMethod: {
    filter: (nodes) => nodes,
    assertFilter: (nodes, from, selector) => {
      if (nodes.length === 0)
        throwError(writeSelectAssertionMessage(from, selector));
      return nodes;
    },
    find: (nodes) => nodes[0],
    assertFind: (nodes, from, selector) => {
      if (nodes.length === 0)
        throwError(writeSelectAssertionMessage(from, selector));
      return nodes[0];
    }
  },
  normalize: (selector) => typeof selector === "function" ? { boundary: "references", method: "filter", where: selector } : typeof selector === "string" ? isKeyOf(selector, NodeSelector.applyBoundary) ? { method: "filter", boundary: selector } : { boundary: "references", method: "filter", kind: selector } : { boundary: "references", method: "filter", ...selector }
};
const writeSelectAssertionMessage = (from, selector) => `${from} had no references matching ${printable(selector)}.`;
const typePathToPropString = (path) => stringifyPath(path, {
  stringifyNonKey: (node2) => node2.expression
});
const referenceMatcher = /"(\$ark\.[^"]+)"/g;
const compileMeta = (metaJson) => JSON.stringify(metaJson).replaceAll(referenceMatcher, "$1");
const flatRef = (path, node2) => ({
  path,
  node: node2,
  propString: typePathToPropString(path)
});
const flatRefsAreEqual = (l2, r2) => l2.propString === r2.propString && l2.node.equals(r2.node);
const appendUniqueFlatRefs = (existing, refs) => appendUnique(existing, refs, {
  isEqual: flatRefsAreEqual
});
const appendUniqueNodes = (existing, refs) => appendUnique(existing, refs, {
  isEqual: (l2, r2) => l2.equals(r2)
});
class Disjoint extends Array {
  static init(kind, l2, r2, ctx) {
    return new Disjoint({
      kind,
      l: l2,
      r: r2,
      path: ctx?.path ?? [],
      optional: ctx?.optional ?? false
    });
  }
  add(kind, l2, r2, ctx) {
    this.push({
      kind,
      l: l2,
      r: r2,
      path: ctx?.path ?? [],
      optional: ctx?.optional ?? false
    });
    return this;
  }
  get summary() {
    return this.describeReasons();
  }
  describeReasons() {
    if (this.length === 1) {
      const { path, l: l2, r: r2 } = this[0];
      const pathString = stringifyPath(path);
      return writeUnsatisfiableExpressionError(`Intersection${pathString && ` at ${pathString}`} of ${describeReasons(l2, r2)}`);
    }
    return `The following intersections result in unsatisfiable types:
• ${this.map(({ path, l: l2, r: r2 }) => `${path}: ${describeReasons(l2, r2)}`).join("\n• ")}`;
  }
  throw() {
    return throwParseError(this.describeReasons());
  }
  invert() {
    const result = this.map((entry) => ({
      ...entry,
      l: entry.r,
      r: entry.l
    }));
    if (!(result instanceof Disjoint))
      return new Disjoint(...result);
    return result;
  }
  withPrefixKey(key, kind) {
    return this.map((entry) => ({
      ...entry,
      path: [key, ...entry.path],
      optional: entry.optional || kind === "optional"
    }));
  }
  toNeverIfDisjoint() {
    return $ark.intrinsic.never;
  }
}
const describeReasons = (l2, r2) => `${describeReason(l2)} and ${describeReason(r2)}`;
const describeReason = (value2) => isNode(value2) ? value2.expression : isArray(value2) ? value2.map(describeReason).join(" | ") || "never" : String(value2);
const writeUnsatisfiableExpressionError = (expression) => `${expression} results in an unsatisfiable type`;
const intersectionCache = {};
const intersectNodesRoot = (l2, r2, $) => intersectOrPipeNodes(l2, r2, {
  $,
  invert: false,
  pipe: false
});
const pipeNodesRoot = (l2, r2, $) => intersectOrPipeNodes(l2, r2, {
  $,
  invert: false,
  pipe: true
});
const intersectOrPipeNodes = ((l2, r2, ctx) => {
  const operator = ctx.pipe ? "|>" : "&";
  const lrCacheKey = `${l2.hash}${operator}${r2.hash}`;
  if (intersectionCache[lrCacheKey] !== void 0)
    return intersectionCache[lrCacheKey];
  if (!ctx.pipe) {
    const rlCacheKey = `${r2.hash}${operator}${l2.hash}`;
    if (intersectionCache[rlCacheKey] !== void 0) {
      const rlResult = intersectionCache[rlCacheKey];
      const lrResult = rlResult instanceof Disjoint ? rlResult.invert() : rlResult;
      intersectionCache[lrCacheKey] = lrResult;
      return lrResult;
    }
  }
  const isPureIntersection = !ctx.pipe || !l2.includesTransform && !r2.includesTransform;
  if (isPureIntersection && l2.equals(r2))
    return l2;
  let result = isPureIntersection ? _intersectNodes(l2, r2, ctx) : l2.hasKindIn(...rootKinds) ? (
    // if l is a RootNode, r will be as well
    _pipeNodes(l2, r2, ctx)
  ) : _intersectNodes(l2, r2, ctx);
  if (isNode(result)) {
    if (l2.equals(result))
      result = l2;
    else if (r2.equals(result))
      result = r2;
  }
  intersectionCache[lrCacheKey] = result;
  return result;
});
const _intersectNodes = (l2, r2, ctx) => {
  const leftmostKind = l2.precedence < r2.precedence ? l2.kind : r2.kind;
  const implementation2 = l2.impl.intersections[r2.kind] ?? r2.impl.intersections[l2.kind];
  if (implementation2 === void 0) {
    return null;
  } else if (leftmostKind === l2.kind)
    return implementation2(l2, r2, ctx);
  else {
    let result = implementation2(r2, l2, { ...ctx, invert: !ctx.invert });
    if (result instanceof Disjoint)
      result = result.invert();
    return result;
  }
};
const _pipeNodes = (l2, r2, ctx) => l2.includesTransform || r2.includesTransform ? ctx.invert ? pipeMorphed(r2, l2, ctx) : pipeMorphed(l2, r2, ctx) : _intersectNodes(l2, r2, ctx);
const pipeMorphed = (from, to, ctx) => from.distribute((fromBranch) => _pipeMorphed(fromBranch, to, ctx), (results) => {
  const viableBranches = results.filter(isNode);
  if (viableBranches.length === 0)
    return Disjoint.init("union", from.branches, to.branches);
  if (viableBranches.length < from.branches.length || !from.branches.every((branch, i2) => branch.rawIn.equals(viableBranches[i2].rawIn)))
    return ctx.$.parseSchema(viableBranches);
  if (viableBranches.length === 1) {
    const onlyBranch = viableBranches[0];
    return onlyBranch;
  }
  const schema = {
    branches: viableBranches
  };
  return ctx.$.parseSchema(schema);
});
const _pipeMorphed = (from, to, ctx) => {
  const fromIsMorph = from.hasKind("morph");
  if (fromIsMorph) {
    const morphs = [...from.morphs];
    if (from.lastMorphIfNode) {
      const outIntersection = intersectOrPipeNodes(from.lastMorphIfNode, to, ctx);
      if (outIntersection instanceof Disjoint)
        return outIntersection;
      morphs[morphs.length - 1] = outIntersection;
    } else
      morphs.push(to);
    return ctx.$.node("morph", {
      morphs,
      in: from.inner.in
    });
  }
  if (to.hasKind("morph")) {
    const inTersection = intersectOrPipeNodes(from, to.rawIn, ctx);
    if (inTersection instanceof Disjoint)
      return inTersection;
    return ctx.$.node("morph", {
      morphs: [to],
      in: inTersection
    });
  }
  return ctx.$.node("morph", {
    morphs: [to],
    in: from
  });
};
class BaseConstraint extends BaseNode {
  constructor(attachments, $) {
    super(attachments, $);
    Object.defineProperty(this, arkKind, {
      value: "constraint",
      enumerable: false
    });
  }
  impliedSiblings;
  intersect(r2) {
    return intersectNodesRoot(this, r2, this.$);
  }
}
class InternalPrimitiveConstraint extends BaseConstraint {
  traverseApply = (data, ctx) => {
    if (!this.traverseAllows(data, ctx))
      ctx.errorFromNodeContext(this.errorContext);
  };
  compile(js) {
    if (js.traversalKind === "Allows")
      js.return(this.compiledCondition);
    else {
      js.if(this.compiledNegation, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
    }
  }
  get errorContext() {
    return {
      code: this.kind,
      description: this.description,
      meta: this.meta,
      ...this.inner
    };
  }
  get compiledErrorContext() {
    return compileObjectLiteral(this.errorContext);
  }
}
const constraintKeyParser = (kind) => (schema, ctx) => {
  if (isArray(schema)) {
    if (schema.length === 0) {
      return;
    }
    const nodes = schema.map((schema2) => ctx.$.node(kind, schema2));
    if (kind === "predicate")
      return nodes;
    return nodes.sort((l2, r2) => l2.hash < r2.hash ? -1 : 1);
  }
  const child = ctx.$.node(kind, schema);
  return child.hasOpenIntersection() ? [child] : child;
};
const intersectConstraints = (s2) => {
  const head = s2.r.shift();
  if (!head) {
    let result = s2.l.length === 0 && s2.kind === "structure" ? $ark.intrinsic.unknown.internal : s2.ctx.$.node(s2.kind, Object.assign(s2.baseInner, unflattenConstraints(s2.l)), { prereduced: true });
    for (const root of s2.roots) {
      if (result instanceof Disjoint)
        return result;
      result = intersectOrPipeNodes(root, result, s2.ctx);
    }
    return result;
  }
  let matched = false;
  for (let i2 = 0; i2 < s2.l.length; i2++) {
    const result = intersectOrPipeNodes(s2.l[i2], head, s2.ctx);
    if (result === null)
      continue;
    if (result instanceof Disjoint)
      return result;
    if (result.isRoot()) {
      s2.roots.push(result);
      s2.l.splice(i2);
      return intersectConstraints(s2);
    }
    if (!matched) {
      s2.l[i2] = result;
      matched = true;
    } else if (!s2.l.includes(result)) {
      return throwInternalError(`Unexpectedly encountered multiple distinct intersection results for refinement ${head}`);
    }
  }
  if (!matched)
    s2.l.push(head);
  if (s2.kind === "intersection") {
    if (head.impliedSiblings)
      for (const node2 of head.impliedSiblings)
        appendUnique(s2.r, node2);
  }
  return intersectConstraints(s2);
};
const flattenConstraints = (inner) => {
  const result = Object.entries(inner).flatMap(([k, v]) => k in constraintKeys ? v : []).sort((l2, r2) => l2.precedence < r2.precedence ? -1 : l2.precedence > r2.precedence ? 1 : l2.kind === "predicate" && r2.kind === "predicate" ? 0 : l2.hash < r2.hash ? -1 : 1);
  return result;
};
const unflattenConstraints = (constraints) => {
  const inner = {};
  for (const constraint of constraints) {
    if (constraint.hasOpenIntersection()) {
      inner[constraint.kind] = append(inner[constraint.kind], constraint);
    } else {
      if (inner[constraint.kind]) {
        return throwInternalError(`Unexpected intersection of closed refinements of kind ${constraint.kind}`);
      }
      inner[constraint.kind] = constraint;
    }
  }
  return inner;
};
const throwInvalidOperandError = (...args) => throwParseError(writeInvalidOperandMessage(...args));
const writeInvalidOperandMessage = (kind, expected, actual) => {
  const actualDescription = actual.hasKind("morph") ? "a morph" : actual.isUnknown() ? "unknown" : actual.exclude(expected).defaultShortDescription;
  return `${capitalize$1(kind)} operand must be ${expected.description} (was ${actualDescription})`;
};
const parseGeneric = (paramDefs, bodyDef, $) => new GenericRoot(paramDefs, bodyDef, $, $, null);
class LazyGenericBody extends Callable {
}
class GenericRoot extends Callable {
  [arkKind] = "generic";
  paramDefs;
  bodyDef;
  $;
  arg$;
  baseInstantiation;
  hkt;
  description;
  constructor(paramDefs, bodyDef, $, arg$, hkt) {
    super((...args) => {
      const argNodes = flatMorph(this.names, (i2, name) => {
        const arg = this.arg$.parse(args[i2]);
        if (!arg.extends(this.constraints[i2])) {
          throwParseError(writeUnsatisfiedParameterConstraintMessage(name, this.constraints[i2].expression, arg.expression));
        }
        return [name, arg];
      });
      if (this.defIsLazy()) {
        const def = this.bodyDef(argNodes);
        return this.$.parse(def);
      }
      return this.$.parse(bodyDef, { args: argNodes });
    });
    this.paramDefs = paramDefs;
    this.bodyDef = bodyDef;
    this.$ = $;
    this.arg$ = arg$;
    this.hkt = hkt;
    this.description = hkt ? new hkt().description ?? `a generic type for ${hkt.constructor.name}` : "a generic type";
    this.baseInstantiation = this(...this.constraints);
  }
  defIsLazy() {
    return this.bodyDef instanceof LazyGenericBody;
  }
  cacheGetter(name, value2) {
    Object.defineProperty(this, name, { value: value2 });
    return value2;
  }
  get json() {
    return this.cacheGetter("json", {
      params: this.params.map((param) => param[1].isUnknown() ? param[0] : [param[0], param[1].json]),
      body: snapshot(this.bodyDef)
    });
  }
  get params() {
    return this.cacheGetter("params", this.paramDefs.map((param) => typeof param === "string" ? [param, $ark.intrinsic.unknown] : [param[0], this.$.parse(param[1])]));
  }
  get names() {
    return this.cacheGetter("names", this.params.map((e) => e[0]));
  }
  get constraints() {
    return this.cacheGetter("constraints", this.params.map((e) => e[1]));
  }
  get internal() {
    return this;
  }
  get referencesById() {
    return this.baseInstantiation.internal.referencesById;
  }
  get references() {
    return this.baseInstantiation.internal.references;
  }
}
const writeUnsatisfiedParameterConstraintMessage = (name, constraint, arg) => `${name} must be assignable to ${constraint} (was ${arg})`;
const implementation$l = implementNode({
  kind: "predicate",
  hasAssociatedError: true,
  collapsibleKey: "predicate",
  keys: {
    predicate: {}
  },
  normalize: (schema) => typeof schema === "function" ? { predicate: schema } : schema,
  defaults: {
    description: (node2) => `valid according to ${node2.predicate.name || "an anonymous predicate"}`
  },
  intersectionIsOpen: true,
  intersections: {
    // as long as the narrows in l and r are individually safe to check
    // in the order they're specified, checking them in the order
    // resulting from this intersection should also be safe.
    predicate: () => null
  }
});
class PredicateNode extends BaseConstraint {
  serializedPredicate = registeredReference(this.predicate);
  compiledCondition = `${this.serializedPredicate}(data, ctx)`;
  compiledNegation = `!${this.compiledCondition}`;
  impliedBasis = null;
  expression = this.serializedPredicate;
  traverseAllows = this.predicate;
  errorContext = {
    code: "predicate",
    description: this.description,
    meta: this.meta
  };
  compiledErrorContext = compileObjectLiteral(this.errorContext);
  traverseApply = (data, ctx) => {
    if (!this.predicate(data, ctx.external) && !ctx.hasError())
      ctx.errorFromNodeContext(this.errorContext);
  };
  compile(js) {
    if (js.traversalKind === "Allows") {
      js.return(this.compiledCondition);
      return;
    }
    js.if(`${this.compiledNegation} && !ctx.hasError()`, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
  }
  reduceJsonSchema(base, ctx) {
    return ctx.fallback.predicate({
      code: "predicate",
      base,
      predicate: this.predicate
    });
  }
}
const Predicate = {
  implementation: implementation$l,
  Node: PredicateNode
};
const implementation$k = implementNode({
  kind: "divisor",
  collapsibleKey: "rule",
  keys: {
    rule: {
      parse: (divisor) => Number.isInteger(divisor) ? divisor : throwParseError(writeNonIntegerDivisorMessage(divisor))
    }
  },
  normalize: (schema) => typeof schema === "number" ? { rule: schema } : schema,
  hasAssociatedError: true,
  defaults: {
    description: (node2) => node2.rule === 1 ? "an integer" : node2.rule === 2 ? "even" : `a multiple of ${node2.rule}`
  },
  intersections: {
    divisor: (l2, r2, ctx) => ctx.$.node("divisor", {
      rule: Math.abs(l2.rule * r2.rule / greatestCommonDivisor(l2.rule, r2.rule))
    })
  },
  obviatesBasisDescription: true
});
class DivisorNode extends InternalPrimitiveConstraint {
  traverseAllows = (data) => data % this.rule === 0;
  compiledCondition = `data % ${this.rule} === 0`;
  compiledNegation = `data % ${this.rule} !== 0`;
  impliedBasis = $ark.intrinsic.number.internal;
  expression = `% ${this.rule}`;
  reduceJsonSchema(schema) {
    schema.type = "integer";
    if (this.rule === 1)
      return schema;
    schema.multipleOf = this.rule;
    return schema;
  }
}
const Divisor = {
  implementation: implementation$k,
  Node: DivisorNode
};
const writeNonIntegerDivisorMessage = (divisor) => `divisor must be an integer (was ${divisor})`;
const greatestCommonDivisor = (l2, r2) => {
  let previous;
  let greatestCommonDivisor2 = l2;
  let current = r2;
  while (current !== 0) {
    previous = current;
    current = greatestCommonDivisor2 % current;
    greatestCommonDivisor2 = previous;
  }
  return greatestCommonDivisor2;
};
class BaseRange extends InternalPrimitiveConstraint {
  boundOperandKind = operandKindsByBoundKind[this.kind];
  compiledActual = this.boundOperandKind === "value" ? `data` : this.boundOperandKind === "length" ? `data.length` : `data.valueOf()`;
  comparator = compileComparator(this.kind, this.exclusive);
  numericLimit = this.rule.valueOf();
  expression = `${this.comparator} ${this.rule}`;
  compiledCondition = `${this.compiledActual} ${this.comparator} ${this.numericLimit}`;
  compiledNegation = `${this.compiledActual} ${negatedComparators[this.comparator]} ${this.numericLimit}`;
  // we need to compute stringLimit before errorContext, which references it
  // transitively through description for date bounds
  stringLimit = this.boundOperandKind === "date" ? dateLimitToString(this.numericLimit) : `${this.numericLimit}`;
  limitKind = this.comparator["0"] === "<" ? "upper" : "lower";
  isStricterThan(r2) {
    const thisLimitIsStricter = this.limitKind === "upper" ? this.numericLimit < r2.numericLimit : this.numericLimit > r2.numericLimit;
    return thisLimitIsStricter || this.numericLimit === r2.numericLimit && this.exclusive === true && !r2.exclusive;
  }
  overlapsRange(r2) {
    if (this.isStricterThan(r2))
      return false;
    if (this.numericLimit === r2.numericLimit && (this.exclusive || r2.exclusive))
      return false;
    return true;
  }
  overlapIsUnit(r2) {
    return this.numericLimit === r2.numericLimit && !this.exclusive && !r2.exclusive;
  }
}
const negatedComparators = {
  "<": ">=",
  "<=": ">",
  ">": "<=",
  ">=": "<"
};
const boundKindPairsByLower = {
  min: "max",
  minLength: "maxLength",
  after: "before"
};
const parseExclusiveKey = {
  // omit key with value false since it is the default
  parse: (flag) => flag || void 0
};
const createLengthSchemaNormalizer = (kind) => (schema) => {
  if (typeof schema === "number")
    return { rule: schema };
  const { exclusive, ...normalized } = schema;
  return exclusive ? {
    ...normalized,
    rule: kind === "minLength" ? normalized.rule + 1 : normalized.rule - 1
  } : normalized;
};
const createDateSchemaNormalizer = (kind) => (schema) => {
  if (typeof schema === "number" || typeof schema === "string" || schema instanceof Date)
    return { rule: schema };
  const { exclusive, ...normalized } = schema;
  if (!exclusive)
    return normalized;
  const numericLimit = typeof normalized.rule === "number" ? normalized.rule : typeof normalized.rule === "string" ? new Date(normalized.rule).valueOf() : normalized.rule.valueOf();
  return exclusive ? {
    ...normalized,
    rule: kind === "after" ? numericLimit + 1 : numericLimit - 1
  } : normalized;
};
const parseDateLimit = (limit) => typeof limit === "string" || typeof limit === "number" ? new Date(limit) : limit;
const writeInvalidLengthBoundMessage = (kind, limit) => `${kind} bound must be a positive integer (was ${limit})`;
const createLengthRuleParser = (kind) => (limit) => {
  if (!Number.isInteger(limit) || limit < 0)
    throwParseError(writeInvalidLengthBoundMessage(kind, limit));
  return limit;
};
const operandKindsByBoundKind = {
  min: "value",
  max: "value",
  minLength: "length",
  maxLength: "length",
  after: "date",
  before: "date"
};
const compileComparator = (kind, exclusive) => `${isKeyOf(kind, boundKindPairsByLower) ? ">" : "<"}${exclusive ? "" : "="}`;
const dateLimitToString = (limit) => typeof limit === "string" ? limit : new Date(limit).toLocaleString();
const writeUnboundableMessage = (root) => `Bounded expression ${root} must be exactly one of number, string, Array, or Date`;
const implementation$j = implementNode({
  kind: "after",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {
      parse: parseDateLimit,
      serialize: (schema) => schema.toISOString()
    }
  },
  normalize: createDateSchemaNormalizer("after"),
  defaults: {
    description: (node2) => `${node2.collapsibleLimitString} or later`,
    actual: describeCollapsibleDate
  },
  intersections: {
    after: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2
  }
});
class AfterNode extends BaseRange {
  impliedBasis = $ark.intrinsic.Date.internal;
  collapsibleLimitString = describeCollapsibleDate(this.rule);
  traverseAllows = (data) => data >= this.rule;
  reduceJsonSchema(base, ctx) {
    return ctx.fallback.date({ code: "date", base, after: this.rule });
  }
}
const After = {
  implementation: implementation$j,
  Node: AfterNode
};
const implementation$i = implementNode({
  kind: "before",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {
      parse: parseDateLimit,
      serialize: (schema) => schema.toISOString()
    }
  },
  normalize: createDateSchemaNormalizer("before"),
  defaults: {
    description: (node2) => `${node2.collapsibleLimitString} or earlier`,
    actual: describeCollapsibleDate
  },
  intersections: {
    before: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2,
    after: (before, after, ctx) => before.overlapsRange(after) ? before.overlapIsUnit(after) ? ctx.$.node("unit", { unit: before.rule }) : null : Disjoint.init("range", before, after)
  }
});
class BeforeNode extends BaseRange {
  collapsibleLimitString = describeCollapsibleDate(this.rule);
  traverseAllows = (data) => data <= this.rule;
  impliedBasis = $ark.intrinsic.Date.internal;
  reduceJsonSchema(base, ctx) {
    return ctx.fallback.date({ code: "date", base, before: this.rule });
  }
}
const Before = {
  implementation: implementation$i,
  Node: BeforeNode
};
const implementation$h = implementNode({
  kind: "exactLength",
  collapsibleKey: "rule",
  keys: {
    rule: {
      parse: createLengthRuleParser("exactLength")
    }
  },
  normalize: (schema) => typeof schema === "number" ? { rule: schema } : schema,
  hasAssociatedError: true,
  defaults: {
    description: (node2) => `exactly length ${node2.rule}`,
    actual: (data) => `${data.length}`
  },
  intersections: {
    exactLength: (l2, r2, ctx) => Disjoint.init("unit", ctx.$.node("unit", { unit: l2.rule }), ctx.$.node("unit", { unit: r2.rule }), { path: ["length"] }),
    minLength: (exactLength, minLength) => exactLength.rule >= minLength.rule ? exactLength : Disjoint.init("range", exactLength, minLength),
    maxLength: (exactLength, maxLength) => exactLength.rule <= maxLength.rule ? exactLength : Disjoint.init("range", exactLength, maxLength)
  }
});
class ExactLengthNode extends InternalPrimitiveConstraint {
  traverseAllows = (data) => data.length === this.rule;
  compiledCondition = `data.length === ${this.rule}`;
  compiledNegation = `data.length !== ${this.rule}`;
  impliedBasis = $ark.intrinsic.lengthBoundable.internal;
  expression = `== ${this.rule}`;
  reduceJsonSchema(schema) {
    switch (schema.type) {
      case "string":
        schema.minLength = this.rule;
        schema.maxLength = this.rule;
        return schema;
      case "array":
        schema.minItems = this.rule;
        schema.maxItems = this.rule;
        return schema;
      default:
        return ToJsonSchema.throwInternalOperandError("exactLength", schema);
    }
  }
}
const ExactLength = {
  implementation: implementation$h,
  Node: ExactLengthNode
};
const implementation$g = implementNode({
  kind: "max",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {},
    exclusive: parseExclusiveKey
  },
  normalize: (schema) => typeof schema === "number" ? { rule: schema } : schema,
  defaults: {
    description: (node2) => {
      if (node2.rule === 0)
        return node2.exclusive ? "negative" : "non-positive";
      return `${node2.exclusive ? "less than" : "at most"} ${node2.rule}`;
    }
  },
  intersections: {
    max: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2,
    min: (max, min, ctx) => max.overlapsRange(min) ? max.overlapIsUnit(min) ? ctx.$.node("unit", { unit: max.rule }) : null : Disjoint.init("range", max, min)
  },
  obviatesBasisDescription: true
});
class MaxNode extends BaseRange {
  impliedBasis = $ark.intrinsic.number.internal;
  traverseAllows = this.exclusive ? (data) => data < this.rule : (data) => data <= this.rule;
  reduceJsonSchema(schema) {
    if (this.exclusive)
      schema.exclusiveMaximum = this.rule;
    else
      schema.maximum = this.rule;
    return schema;
  }
}
const Max = {
  implementation: implementation$g,
  Node: MaxNode
};
const implementation$f = implementNode({
  kind: "maxLength",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {
      parse: createLengthRuleParser("maxLength")
    }
  },
  reduce: (inner, $) => inner.rule === 0 ? $.node("exactLength", inner) : void 0,
  normalize: createLengthSchemaNormalizer("maxLength"),
  defaults: {
    description: (node2) => `at most length ${node2.rule}`,
    actual: (data) => `${data.length}`
  },
  intersections: {
    maxLength: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2,
    minLength: (max, min, ctx) => max.overlapsRange(min) ? max.overlapIsUnit(min) ? ctx.$.node("exactLength", { rule: max.rule }) : null : Disjoint.init("range", max, min)
  }
});
class MaxLengthNode extends BaseRange {
  impliedBasis = $ark.intrinsic.lengthBoundable.internal;
  traverseAllows = (data) => data.length <= this.rule;
  reduceJsonSchema(schema) {
    switch (schema.type) {
      case "string":
        schema.maxLength = this.rule;
        return schema;
      case "array":
        schema.maxItems = this.rule;
        return schema;
      default:
        return ToJsonSchema.throwInternalOperandError("maxLength", schema);
    }
  }
}
const MaxLength = {
  implementation: implementation$f,
  Node: MaxLengthNode
};
const implementation$e = implementNode({
  kind: "min",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {},
    exclusive: parseExclusiveKey
  },
  normalize: (schema) => typeof schema === "number" ? { rule: schema } : schema,
  defaults: {
    description: (node2) => {
      if (node2.rule === 0)
        return node2.exclusive ? "positive" : "non-negative";
      return `${node2.exclusive ? "more than" : "at least"} ${node2.rule}`;
    }
  },
  intersections: {
    min: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2
  },
  obviatesBasisDescription: true
});
class MinNode extends BaseRange {
  impliedBasis = $ark.intrinsic.number.internal;
  traverseAllows = this.exclusive ? (data) => data > this.rule : (data) => data >= this.rule;
  reduceJsonSchema(schema) {
    if (this.exclusive)
      schema.exclusiveMinimum = this.rule;
    else
      schema.minimum = this.rule;
    return schema;
  }
}
const Min = {
  implementation: implementation$e,
  Node: MinNode
};
const implementation$d = implementNode({
  kind: "minLength",
  collapsibleKey: "rule",
  hasAssociatedError: true,
  keys: {
    rule: {
      parse: createLengthRuleParser("minLength")
    }
  },
  reduce: (inner) => inner.rule === 0 ? (
    // a minimum length of zero is trivially satisfied
    $ark.intrinsic.unknown
  ) : void 0,
  normalize: createLengthSchemaNormalizer("minLength"),
  defaults: {
    description: (node2) => node2.rule === 1 ? "non-empty" : `at least length ${node2.rule}`,
    // avoid default message like "must be non-empty (was 0)"
    actual: (data) => data.length === 0 ? "" : `${data.length}`
  },
  intersections: {
    minLength: (l2, r2) => l2.isStricterThan(r2) ? l2 : r2
  }
});
class MinLengthNode extends BaseRange {
  impliedBasis = $ark.intrinsic.lengthBoundable.internal;
  traverseAllows = (data) => data.length >= this.rule;
  reduceJsonSchema(schema) {
    switch (schema.type) {
      case "string":
        schema.minLength = this.rule;
        return schema;
      case "array":
        schema.minItems = this.rule;
        return schema;
      default:
        return ToJsonSchema.throwInternalOperandError("minLength", schema);
    }
  }
}
const MinLength = {
  implementation: implementation$d,
  Node: MinLengthNode
};
const boundImplementationsByKind = {
  min: Min.implementation,
  max: Max.implementation,
  minLength: MinLength.implementation,
  maxLength: MaxLength.implementation,
  exactLength: ExactLength.implementation,
  after: After.implementation,
  before: Before.implementation
};
const boundClassesByKind = {
  min: Min.Node,
  max: Max.Node,
  minLength: MinLength.Node,
  maxLength: MaxLength.Node,
  exactLength: ExactLength.Node,
  after: After.Node,
  before: Before.Node
};
const implementation$c = implementNode({
  kind: "pattern",
  collapsibleKey: "rule",
  keys: {
    rule: {},
    flags: {}
  },
  normalize: (schema) => typeof schema === "string" ? { rule: schema } : schema instanceof RegExp ? schema.flags ? { rule: schema.source, flags: schema.flags } : { rule: schema.source } : schema,
  obviatesBasisDescription: true,
  obviatesBasisExpression: true,
  hasAssociatedError: true,
  intersectionIsOpen: true,
  defaults: {
    description: (node2) => `matched by ${node2.rule}`
  },
  intersections: {
    // for now, non-equal regex are naively intersected:
    // https://github.com/arktypeio/arktype/issues/853
    pattern: () => null
  }
});
class PatternNode extends InternalPrimitiveConstraint {
  instance = new RegExp(this.rule, this.flags);
  expression = `${this.instance}`;
  traverseAllows = this.instance.test.bind(this.instance);
  compiledCondition = `${this.expression}.test(data)`;
  compiledNegation = `!${this.compiledCondition}`;
  impliedBasis = $ark.intrinsic.string.internal;
  reduceJsonSchema(base, ctx) {
    if (base.pattern) {
      return ctx.fallback.patternIntersection({
        code: "patternIntersection",
        base,
        pattern: this.rule
      });
    }
    base.pattern = this.rule;
    return base;
  }
}
const Pattern = {
  implementation: implementation$c,
  Node: PatternNode
};
const schemaKindOf = (schema, allowedKinds) => {
  const kind = discriminateRootKind(schema);
  if (allowedKinds && !allowedKinds.includes(kind)) {
    return throwParseError(`Root of kind ${kind} should be one of ${allowedKinds}`);
  }
  return kind;
};
const discriminateRootKind = (schema) => {
  if (hasArkKind(schema, "root"))
    return schema.kind;
  if (typeof schema === "string") {
    return schema[0] === "$" ? "alias" : schema in domainDescriptions ? "domain" : "proto";
  }
  if (typeof schema === "function")
    return "proto";
  if (typeof schema !== "object" || schema === null)
    return throwParseError(writeInvalidSchemaMessage(schema));
  if ("morphs" in schema)
    return "morph";
  if ("branches" in schema || isArray(schema))
    return "union";
  if ("unit" in schema)
    return "unit";
  if ("reference" in schema)
    return "alias";
  const schemaKeys = Object.keys(schema);
  if (schemaKeys.length === 0 || schemaKeys.some((k) => k in constraintKeys))
    return "intersection";
  if ("proto" in schema)
    return "proto";
  if ("domain" in schema)
    return "domain";
  return throwParseError(writeInvalidSchemaMessage(schema));
};
const writeInvalidSchemaMessage = (schema) => `${printable(schema)} is not a valid type schema`;
const nodeCountsByPrefix = {};
const serializeListableChild = (listableNode) => isArray(listableNode) ? listableNode.map((node2) => node2.collapsibleJson) : listableNode.collapsibleJson;
const nodesByRegisteredId = {};
$ark.nodesByRegisteredId = nodesByRegisteredId;
const registerNodeId = (prefix2) => {
  nodeCountsByPrefix[prefix2] ??= 0;
  return `${prefix2}${++nodeCountsByPrefix[prefix2]}`;
};
const parseNode = (ctx) => {
  const impl = nodeImplementationsByKind[ctx.kind];
  const configuredSchema = impl.applyConfig?.(ctx.def, ctx.$.resolvedConfig) ?? ctx.def;
  const inner = {};
  const { meta: metaSchema, ...innerSchema } = configuredSchema;
  const meta = metaSchema === void 0 ? {} : typeof metaSchema === "string" ? { description: metaSchema } : metaSchema;
  const innerSchemaEntries = entriesOf(innerSchema).sort(([lKey], [rKey]) => isNodeKind(lKey) ? isNodeKind(rKey) ? precedenceOfKind(lKey) - precedenceOfKind(rKey) : 1 : isNodeKind(rKey) ? -1 : lKey < rKey ? -1 : 1).filter(([k, v]) => {
    if (k.startsWith("meta.")) {
      const metaKey = k.slice(5);
      meta[metaKey] = v;
      return false;
    }
    return true;
  });
  for (const entry of innerSchemaEntries) {
    const k = entry[0];
    const keyImpl = impl.keys[k];
    if (!keyImpl)
      return throwParseError(`Key ${k} is not valid on ${ctx.kind} schema`);
    const v = keyImpl.parse ? keyImpl.parse(entry[1], ctx) : entry[1];
    if (v !== unset && (v !== void 0 || keyImpl.preserveUndefined))
      inner[k] = v;
  }
  if (impl.reduce && !ctx.prereduced) {
    const reduced = impl.reduce(inner, ctx.$);
    if (reduced) {
      if (reduced instanceof Disjoint)
        return reduced.throw();
      return withMeta(reduced, meta);
    }
  }
  const node2 = createNode({
    id: ctx.id,
    kind: ctx.kind,
    inner,
    meta,
    $: ctx.$
  });
  return node2;
};
const createNode = ({ id: id2, kind, inner, meta, $, ignoreCache }) => {
  const impl = nodeImplementationsByKind[kind];
  const innerEntries = entriesOf(inner);
  const children = [];
  let innerJson = {};
  for (const [k, v] of innerEntries) {
    const keyImpl = impl.keys[k];
    const serialize = keyImpl.serialize ?? (keyImpl.child ? serializeListableChild : defaultValueSerializer);
    innerJson[k] = serialize(v);
    if (keyImpl.child === true) {
      const listableNode = v;
      if (isArray(listableNode))
        children.push(...listableNode);
      else
        children.push(listableNode);
    } else if (typeof keyImpl.child === "function")
      children.push(...keyImpl.child(v));
  }
  if (impl.finalizeInnerJson)
    innerJson = impl.finalizeInnerJson(innerJson);
  let json2 = { ...innerJson };
  let metaJson = {};
  if (!isEmptyObject(meta)) {
    metaJson = flatMorph(meta, (k, v) => [
      k,
      k === "examples" ? v : defaultValueSerializer(v)
    ]);
    json2.meta = possiblyCollapse(metaJson, "description", true);
  }
  innerJson = possiblyCollapse(innerJson, impl.collapsibleKey, false);
  const innerHash = JSON.stringify({ kind, ...innerJson });
  json2 = possiblyCollapse(json2, impl.collapsibleKey, false);
  const collapsibleJson = possiblyCollapse(json2, impl.collapsibleKey, true);
  const hash = JSON.stringify({ kind, ...json2 });
  if ($.nodesByHash[hash] && !ignoreCache)
    return $.nodesByHash[hash];
  const attachments = {
    id: id2,
    kind,
    impl,
    inner,
    innerEntries,
    innerJson,
    innerHash,
    meta,
    metaJson,
    json: json2,
    hash,
    collapsibleJson,
    children
  };
  if (kind !== "intersection") {
    for (const k in inner)
      if (k !== "in" && k !== "out")
        attachments[k] = inner[k];
  }
  const node2 = new nodeClassesByKind[kind](attachments, $);
  return $.nodesByHash[hash] = node2;
};
const withId = (node2, id2) => {
  if (node2.id === id2)
    return node2;
  if (isNode(nodesByRegisteredId[id2]))
    throwInternalError(`Unexpected attempt to overwrite node id ${id2}`);
  return createNode({
    id: id2,
    kind: node2.kind,
    inner: node2.inner,
    meta: node2.meta,
    $: node2.$,
    ignoreCache: true
  });
};
const withMeta = (node2, meta, id2) => {
  return createNode({
    id: registerNodeId(meta.alias ?? node2.kind),
    kind: node2.kind,
    inner: node2.inner,
    meta,
    $: node2.$
  });
};
const possiblyCollapse = (json2, toKey, allowPrimitive) => {
  const collapsibleKeys = Object.keys(json2);
  if (collapsibleKeys.length === 1 && collapsibleKeys[0] === toKey) {
    const collapsed = json2[toKey];
    if (allowPrimitive)
      return collapsed;
    if (
      // if the collapsed value is still an object
      hasDomain(collapsed, "object") && // and the JSON did not include any implied keys
      (Object.keys(collapsed).length === 1 || Array.isArray(collapsed))
    ) {
      return collapsed;
    }
  }
  return json2;
};
const intersectProps = (l2, r2, ctx) => {
  if (l2.key !== r2.key)
    return null;
  const key = l2.key;
  let value2 = intersectOrPipeNodes(l2.value, r2.value, ctx);
  const kind = l2.required || r2.required ? "required" : "optional";
  if (value2 instanceof Disjoint) {
    if (kind === "optional")
      value2 = $ark.intrinsic.never.internal;
    else {
      return value2.withPrefixKey(l2.key, l2.required && r2.required ? "required" : "optional");
    }
  }
  if (kind === "required") {
    return ctx.$.node("required", {
      key,
      value: value2
    });
  }
  const defaultIntersection = l2.hasDefault() ? r2.hasDefault() ? l2.default === r2.default ? l2.default : throwParseError(writeDefaultIntersectionMessage(l2.default, r2.default)) : l2.default : r2.hasDefault() ? r2.default : unset;
  return ctx.$.node("optional", {
    key,
    value: value2,
    // unset is stripped during parsing
    default: defaultIntersection
  });
};
class BaseProp extends BaseConstraint {
  required = this.kind === "required";
  optional = this.kind === "optional";
  impliedBasis = $ark.intrinsic.object.internal;
  serializedKey = compileSerializedValue(this.key);
  compiledKey = typeof this.key === "string" ? this.key : this.serializedKey;
  flatRefs = append(this.value.flatRefs.map((ref) => flatRef([this.key, ...ref.path], ref.node)), flatRef([this.key], this.value));
  _transform(mapper, ctx) {
    ctx.path.push(this.key);
    const result = super._transform(mapper, ctx);
    ctx.path.pop();
    return result;
  }
  hasDefault() {
    return "default" in this.inner;
  }
  traverseAllows = (data, ctx) => {
    if (this.key in data) {
      return traverseKey(this.key, () => this.value.traverseAllows(data[this.key], ctx), ctx);
    }
    return this.optional;
  };
  traverseApply = (data, ctx) => {
    if (this.key in data) {
      traverseKey(this.key, () => this.value.traverseApply(data[this.key], ctx), ctx);
    } else if (this.hasKind("required"))
      ctx.errorFromNodeContext(this.errorContext);
  };
  compile(js) {
    js.if(`${this.serializedKey} in data`, () => js.traverseKey(this.serializedKey, `data${js.prop(this.key)}`, this.value));
    if (this.hasKind("required")) {
      js.else(() => js.traversalKind === "Apply" ? js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`) : js.return(false));
    }
    if (js.traversalKind === "Allows")
      js.return(true);
  }
}
const writeDefaultIntersectionMessage = (lValue, rValue) => `Invalid intersection of default values ${printable(lValue)} & ${printable(rValue)}`;
const implementation$b = implementNode({
  kind: "optional",
  hasAssociatedError: false,
  intersectionIsOpen: true,
  keys: {
    key: {},
    value: {
      child: true,
      parse: (schema, ctx) => ctx.$.parseSchema(schema)
    },
    default: {
      preserveUndefined: true
    }
  },
  normalize: (schema) => schema,
  reduce: (inner, $) => {
    if ($.resolvedConfig.exactOptionalPropertyTypes === false) {
      if (!inner.value.allows(void 0)) {
        return $.node("optional", { ...inner, value: inner.value.or(intrinsic.undefined) }, { prereduced: true });
      }
    }
  },
  defaults: {
    description: (node2) => `${node2.compiledKey}?: ${node2.value.description}`
  },
  intersections: {
    optional: intersectProps
  }
});
class OptionalNode extends BaseProp {
  constructor(...args) {
    super(...args);
    if ("default" in this.inner)
      assertDefaultValueAssignability(this.value, this.inner.default, this.key);
  }
  get rawIn() {
    const baseIn = super.rawIn;
    if (!this.hasDefault())
      return baseIn;
    return this.$.node("optional", omit(baseIn.inner, { default: true }), {
      prereduced: true
    });
  }
  get outProp() {
    if (!this.hasDefault())
      return this;
    const { default: defaultValue, ...requiredInner } = this.inner;
    return this.cacheGetter("outProp", this.$.node("required", requiredInner, { prereduced: true }));
  }
  expression = this.hasDefault() ? `${this.compiledKey}: ${this.value.expression} = ${printable(this.inner.default)}` : `${this.compiledKey}?: ${this.value.expression}`;
  defaultValueMorph = getDefaultableMorph(this);
  defaultValueMorphRef = this.defaultValueMorph && registeredReference(this.defaultValueMorph);
}
const Optional = {
  implementation: implementation$b,
  Node: OptionalNode
};
const defaultableMorphCache = {};
const getDefaultableMorph = (node2) => {
  if (!node2.hasDefault())
    return;
  const cacheKey = `{${node2.compiledKey}: ${node2.value.id} = ${defaultValueSerializer(node2.default)}}`;
  return defaultableMorphCache[cacheKey] ??= computeDefaultValueMorph(node2.key, node2.value, node2.default);
};
const computeDefaultValueMorph = (key, value2, defaultInput) => {
  if (typeof defaultInput === "function") {
    return value2.includesTransform ? (data, ctx) => {
      traverseKey(key, () => value2(data[key] = defaultInput(), ctx), ctx);
      return data;
    } : (data) => {
      data[key] = defaultInput();
      return data;
    };
  }
  const precomputedMorphedDefault = value2.includesTransform ? value2.assert(defaultInput) : defaultInput;
  return hasDomain(precomputedMorphedDefault, "object") ? (
    // the type signature only allows this if the value was morphed
    (data, ctx) => {
      traverseKey(key, () => value2(data[key] = defaultInput, ctx), ctx);
      return data;
    }
  ) : (data) => {
    data[key] = precomputedMorphedDefault;
    return data;
  };
};
const assertDefaultValueAssignability = (node2, value2, key) => {
  const wrapped = isThunk(value2);
  if (hasDomain(value2, "object") && !wrapped)
    throwParseError(writeNonPrimitiveNonFunctionDefaultValueMessage(key));
  const out = node2.in(wrapped ? value2() : value2);
  if (out instanceof ArkErrors) {
    if (key === null) {
      throwParseError(`Default ${out.summary}`);
    }
    const atPath = out.transform((e) => e.transform((input) => ({ ...input, prefixPath: [key] })));
    throwParseError(`Default for ${atPath.summary}`);
  }
  return value2;
};
const writeNonPrimitiveNonFunctionDefaultValueMessage = (key) => {
  const keyDescription = key === null ? "" : typeof key === "number" ? `for value at [${key}] ` : `for ${compileSerializedValue(key)} `;
  return `Non-primitive default ${keyDescription}must be specified as a function like () => ({my: 'object'})`;
};
class BaseRoot extends BaseNode {
  constructor(attachments, $) {
    super(attachments, $);
    Object.defineProperty(this, arkKind, { value: "root", enumerable: false });
  }
  // doesn't seem possible to override this at a type-level (e.g. via declare)
  // without TS complaining about getters
  get rawIn() {
    return super.rawIn;
  }
  get rawOut() {
    return super.rawOut;
  }
  get internal() {
    return this;
  }
  get "~standard"() {
    return {
      vendor: "arktype",
      version: 1,
      validate: (input) => {
        const out = this(input);
        if (out instanceof ArkErrors)
          return out;
        return { value: out };
      },
      toJSONSchema: (opts) => {
        if (opts.target && opts.target !== "draft-2020-12") {
          return throwParseError(`JSONSchema target '${opts.target}' is not supported (must be "draft-2020-12")`);
        }
        if (opts.io === "input")
          return this.rawIn.toJsonSchema();
        return this.rawOut.toJsonSchema();
      }
    };
  }
  as() {
    return this;
  }
  brand(name) {
    if (name === "")
      return throwParseError(emptyBrandNameMessage);
    return this;
  }
  readonly() {
    return this;
  }
  branches = this.hasKind("union") ? this.inner.branches : [this];
  distribute(mapBranch, reduceMapped) {
    const mappedBranches = this.branches.map(mapBranch);
    return reduceMapped?.(mappedBranches) ?? mappedBranches;
  }
  get shortDescription() {
    return this.meta.description ?? this.defaultShortDescription;
  }
  toJsonSchema(opts = {}) {
    const ctx = mergeToJsonSchemaConfigs(this.$.resolvedConfig.toJsonSchema, opts);
    ctx.useRefs ||= this.isCyclic;
    const schema = typeof ctx.dialect === "string" ? { $schema: ctx.dialect } : {};
    Object.assign(schema, this.toJsonSchemaRecurse(ctx));
    if (ctx.useRefs) {
      schema.$defs = flatMorph(this.references, (i2, ref) => ref.isRoot() && !ref.alwaysExpandJsonSchema ? [ref.id, ref.toResolvedJsonSchema(ctx)] : []);
    }
    return schema;
  }
  toJsonSchemaRecurse(ctx) {
    if (ctx.useRefs && !this.alwaysExpandJsonSchema)
      return { $ref: `#/$defs/${this.id}` };
    return this.toResolvedJsonSchema(ctx);
  }
  get alwaysExpandJsonSchema() {
    return this.isBasis() || this.kind === "alias" || this.hasKind("union") && this.isBoolean;
  }
  toResolvedJsonSchema(ctx) {
    const result = this.innerToJsonSchema(ctx);
    return Object.assign(result, this.metaJson);
  }
  intersect(r2) {
    const rNode = this.$.parseDefinition(r2);
    const result = this.rawIntersect(rNode);
    if (result instanceof Disjoint)
      return result;
    return this.$.finalize(result);
  }
  rawIntersect(r2) {
    return intersectNodesRoot(this, r2, this.$);
  }
  toNeverIfDisjoint() {
    return this;
  }
  and(r2) {
    const result = this.intersect(r2);
    return result instanceof Disjoint ? result.throw() : result;
  }
  rawAnd(r2) {
    const result = this.rawIntersect(r2);
    return result instanceof Disjoint ? result.throw() : result;
  }
  or(r2) {
    const rNode = this.$.parseDefinition(r2);
    return this.$.finalize(this.rawOr(rNode));
  }
  rawOr(r2) {
    const branches = [...this.branches, ...r2.branches];
    return this.$.node("union", branches);
  }
  map(flatMapEntry) {
    return this.$.schema(this.applyStructuralOperation("map", [flatMapEntry]));
  }
  pick(...keys) {
    return this.$.schema(this.applyStructuralOperation("pick", keys));
  }
  omit(...keys) {
    return this.$.schema(this.applyStructuralOperation("omit", keys));
  }
  required() {
    return this.$.schema(this.applyStructuralOperation("required", []));
  }
  partial() {
    return this.$.schema(this.applyStructuralOperation("partial", []));
  }
  _keyof;
  keyof() {
    if (this._keyof)
      return this._keyof;
    const result = this.applyStructuralOperation("keyof", []).reduce((result2, branch) => result2.intersect(branch).toNeverIfDisjoint(), $ark.intrinsic.unknown.internal);
    if (result.branches.length === 0) {
      throwParseError(writeUnsatisfiableExpressionError(`keyof ${this.expression}`));
    }
    return this._keyof = this.$.finalize(result);
  }
  get props() {
    if (this.branches.length !== 1)
      return throwParseError(writeLiteralUnionEntriesMessage(this.expression));
    return [...this.applyStructuralOperation("props", [])[0]];
  }
  merge(r2) {
    const rNode = this.$.parseDefinition(r2);
    return this.$.schema(rNode.distribute((branch) => this.applyStructuralOperation("merge", [
      structureOf(branch) ?? throwParseError(writeNonStructuralOperandMessage("merge", branch.expression))
    ])));
  }
  applyStructuralOperation(operation, args) {
    return this.distribute((branch) => {
      if (branch.equals($ark.intrinsic.object) && operation !== "merge")
        return branch;
      const structure = structureOf(branch);
      if (!structure) {
        throwParseError(writeNonStructuralOperandMessage(operation, branch.expression));
      }
      if (operation === "keyof")
        return structure.keyof();
      if (operation === "get")
        return structure.get(...args);
      if (operation === "props")
        return structure.props;
      const structuralMethodName = operation === "required" ? "require" : operation === "partial" ? "optionalize" : operation;
      return this.$.node("intersection", {
        domain: "object",
        structure: structure[structuralMethodName](...args)
      });
    });
  }
  get(...path) {
    if (path[0] === void 0)
      return this;
    return this.$.schema(this.applyStructuralOperation("get", path));
  }
  extract(r2) {
    const rNode = this.$.parseDefinition(r2);
    return this.$.schema(this.branches.filter((branch) => branch.extends(rNode)));
  }
  exclude(r2) {
    const rNode = this.$.parseDefinition(r2);
    return this.$.schema(this.branches.filter((branch) => !branch.extends(rNode)));
  }
  array() {
    return this.$.schema(this.isUnknown() ? { proto: Array } : {
      proto: Array,
      sequence: this
    }, { prereduced: true });
  }
  overlaps(r2) {
    const intersection = this.intersect(r2);
    return !(intersection instanceof Disjoint);
  }
  extends(r2) {
    const intersection = this.intersect(r2);
    return !(intersection instanceof Disjoint) && this.equals(intersection);
  }
  ifExtends(r2) {
    return this.extends(r2) ? this : void 0;
  }
  subsumes(r2) {
    const rNode = this.$.parseDefinition(r2);
    return rNode.extends(this);
  }
  configure(meta, selector = "shallow") {
    return this.configureReferences(meta, selector);
  }
  describe(description, selector = "shallow") {
    return this.configure({ description }, selector);
  }
  // these should ideally be implemented in arktype since they use its syntax
  // https://github.com/arktypeio/arktype/issues/1223
  optional() {
    return [this, "?"];
  }
  // these should ideally be implemented in arktype since they use its syntax
  // https://github.com/arktypeio/arktype/issues/1223
  default(thunkableValue) {
    assertDefaultValueAssignability(this, thunkableValue, null);
    return [this, "=", thunkableValue];
  }
  from(input) {
    return this.assert(input);
  }
  _pipe(...morphs) {
    const result = morphs.reduce((acc, morph) => acc.rawPipeOnce(morph), this);
    return this.$.finalize(result);
  }
  tryPipe(...morphs) {
    const result = morphs.reduce((acc, morph) => acc.rawPipeOnce(hasArkKind(morph, "root") ? morph : ((In, ctx) => {
      try {
        return morph(In, ctx);
      } catch (e) {
        return ctx.error({
          code: "predicate",
          predicate: morph,
          actual: `aborted due to error:
    ${e}
`
        });
      }
    })), this);
    return this.$.finalize(result);
  }
  pipe = Object.assign(this._pipe.bind(this), {
    try: this.tryPipe.bind(this)
  });
  to(def) {
    return this.$.finalize(this.toNode(this.$.parseDefinition(def)));
  }
  toNode(root) {
    const result = pipeNodesRoot(this, root, this.$);
    if (result instanceof Disjoint)
      return result.throw();
    return result;
  }
  rawPipeOnce(morph) {
    if (hasArkKind(morph, "root"))
      return this.toNode(morph);
    return this.distribute((branch) => branch.hasKind("morph") ? this.$.node("morph", {
      in: branch.inner.in,
      morphs: [...branch.morphs, morph]
    }) : this.$.node("morph", {
      in: branch,
      morphs: [morph]
    }), this.$.parseSchema);
  }
  narrow(predicate) {
    return this.constrainOut("predicate", predicate);
  }
  constrain(kind, schema) {
    return this._constrain("root", kind, schema);
  }
  constrainIn(kind, schema) {
    return this._constrain("in", kind, schema);
  }
  constrainOut(kind, schema) {
    return this._constrain("out", kind, schema);
  }
  _constrain(io, kind, schema) {
    const constraint = this.$.node(kind, schema);
    if (constraint.isRoot()) {
      return constraint.isUnknown() ? this : throwInternalError(`Unexpected constraint node ${constraint}`);
    }
    const operand = io === "root" ? this : io === "in" ? this.rawIn : this.rawOut;
    if (operand.hasKind("morph") || constraint.impliedBasis && !operand.extends(constraint.impliedBasis)) {
      return throwInvalidOperandError(kind, constraint.impliedBasis, this);
    }
    const partialIntersection = this.$.node("intersection", {
      // important this is constraint.kind instead of kind in case
      // the node was reduced during parsing
      [constraint.kind]: constraint
    });
    const result = io === "out" ? pipeNodesRoot(this, partialIntersection, this.$) : intersectNodesRoot(this, partialIntersection, this.$);
    if (result instanceof Disjoint)
      result.throw();
    return this.$.finalize(result);
  }
  onUndeclaredKey(cfg) {
    const rule = typeof cfg === "string" ? cfg : cfg.rule;
    const deep = typeof cfg === "string" ? false : cfg.deep;
    return this.$.finalize(this.transform((kind, inner) => kind === "structure" ? rule === "ignore" ? omit(inner, { undeclared: 1 }) : { ...inner, undeclared: rule } : inner, deep ? void 0 : { shouldTransform: (node2) => !includes(structuralKinds, node2.kind) }));
  }
  hasEqualMorphs(r2) {
    if (!this.includesTransform && !r2.includesTransform)
      return true;
    if (!arrayEquals(this.shallowMorphs, r2.shallowMorphs))
      return false;
    if (!arrayEquals(this.flatMorphs, r2.flatMorphs, {
      isEqual: (l2, r3) => l2.propString === r3.propString && (l2.node.hasKind("morph") && r3.node.hasKind("morph") ? l2.node.hasEqualMorphs(r3.node) : l2.node.hasKind("intersection") && r3.node.hasKind("intersection") ? l2.node.structure?.structuralMorphRef === r3.node.structure?.structuralMorphRef : false)
    }))
      return false;
    return true;
  }
  onDeepUndeclaredKey(behavior) {
    return this.onUndeclaredKey({ rule: behavior, deep: true });
  }
  filter(predicate) {
    return this.constrainIn("predicate", predicate);
  }
  divisibleBy(schema) {
    return this.constrain("divisor", schema);
  }
  matching(schema) {
    return this.constrain("pattern", schema);
  }
  atLeast(schema) {
    return this.constrain("min", schema);
  }
  atMost(schema) {
    return this.constrain("max", schema);
  }
  moreThan(schema) {
    return this.constrain("min", exclusivizeRangeSchema(schema));
  }
  lessThan(schema) {
    return this.constrain("max", exclusivizeRangeSchema(schema));
  }
  atLeastLength(schema) {
    return this.constrain("minLength", schema);
  }
  atMostLength(schema) {
    return this.constrain("maxLength", schema);
  }
  moreThanLength(schema) {
    return this.constrain("minLength", exclusivizeRangeSchema(schema));
  }
  lessThanLength(schema) {
    return this.constrain("maxLength", exclusivizeRangeSchema(schema));
  }
  exactlyLength(schema) {
    return this.constrain("exactLength", schema);
  }
  atOrAfter(schema) {
    return this.constrain("after", schema);
  }
  atOrBefore(schema) {
    return this.constrain("before", schema);
  }
  laterThan(schema) {
    return this.constrain("after", exclusivizeRangeSchema(schema));
  }
  earlierThan(schema) {
    return this.constrain("before", exclusivizeRangeSchema(schema));
  }
}
const emptyBrandNameMessage = `Expected a non-empty brand name after #`;
const exclusivizeRangeSchema = (schema) => typeof schema === "object" && !(schema instanceof Date) ? { ...schema, exclusive: true } : {
  rule: schema,
  exclusive: true
};
const typeOrTermExtends = (t, base) => hasArkKind(base, "root") ? hasArkKind(t, "root") ? t.extends(base) : base.allows(t) : hasArkKind(t, "root") ? t.hasUnit(base) : base === t;
const structureOf = (branch) => {
  if (branch.hasKind("morph"))
    return null;
  if (branch.hasKind("intersection")) {
    return branch.inner.structure ?? (branch.basis?.domain === "object" ? branch.$.bindReference($ark.intrinsic.emptyStructure) : null);
  }
  if (branch.isBasis() && branch.domain === "object")
    return branch.$.bindReference($ark.intrinsic.emptyStructure);
  return null;
};
const writeLiteralUnionEntriesMessage = (expression) => `Props cannot be extracted from a union. Use .distribute to extract props from each branch instead. Received:
${expression}`;
const writeNonStructuralOperandMessage = (operation, operand) => `${operation} operand must be an object (was ${operand})`;
const defineRightwardIntersections = (kind, implementation2) => flatMorph(schemaKindsRightOf(kind), (i2, kind2) => [
  kind2,
  implementation2
]);
const normalizeAliasSchema = (schema) => typeof schema === "string" ? { reference: schema } : schema;
const neverIfDisjoint = (result) => result instanceof Disjoint ? $ark.intrinsic.never.internal : result;
const implementation$a = implementNode({
  kind: "alias",
  hasAssociatedError: false,
  collapsibleKey: "reference",
  keys: {
    reference: {
      serialize: (s2) => s2.startsWith("$") ? s2 : `$ark.${s2}`
    },
    resolve: {}
  },
  normalize: normalizeAliasSchema,
  defaults: {
    description: (node2) => node2.reference
  },
  intersections: {
    alias: (l2, r2, ctx) => ctx.$.lazilyResolve(() => neverIfDisjoint(intersectOrPipeNodes(l2.resolution, r2.resolution, ctx)), `${l2.reference}${ctx.pipe ? "=>" : "&"}${r2.reference}`),
    ...defineRightwardIntersections("alias", (l2, r2, ctx) => {
      if (r2.isUnknown())
        return l2;
      if (r2.isNever())
        return r2;
      if (r2.isBasis() && !r2.overlaps($ark.intrinsic.object)) {
        return Disjoint.init("assignability", $ark.intrinsic.object, r2);
      }
      return ctx.$.lazilyResolve(() => neverIfDisjoint(intersectOrPipeNodes(l2.resolution, r2, ctx)), `${l2.reference}${ctx.pipe ? "=>" : "&"}${r2.id}`);
    })
  }
});
class AliasNode extends BaseRoot {
  expression = this.reference;
  structure = void 0;
  get resolution() {
    const result = this._resolve();
    return nodesByRegisteredId[this.id] = result;
  }
  _resolve() {
    if (this.resolve)
      return this.resolve();
    if (this.reference[0] === "$")
      return this.$.resolveRoot(this.reference.slice(1));
    const id2 = this.reference;
    let resolution = nodesByRegisteredId[id2];
    const seen2 = [];
    while (hasArkKind(resolution, "context")) {
      if (seen2.includes(resolution.id)) {
        return throwParseError(writeShallowCycleErrorMessage(resolution.id, seen2));
      }
      seen2.push(resolution.id);
      resolution = nodesByRegisteredId[resolution.id];
    }
    if (!hasArkKind(resolution, "root")) {
      return throwInternalError(`Unexpected resolution for reference ${this.reference}
Seen: [${seen2.join("->")}] 
Resolution: ${printable(resolution)}`);
    }
    return resolution;
  }
  get resolutionId() {
    if (this.reference.includes("&") || this.reference.includes("=>"))
      return this.resolution.id;
    if (this.reference[0] !== "$")
      return this.reference;
    const alias = this.reference.slice(1);
    const resolution = this.$.resolutions[alias];
    if (typeof resolution === "string")
      return resolution;
    if (hasArkKind(resolution, "root"))
      return resolution.id;
    return throwInternalError(`Unexpected resolution for reference ${this.reference}: ${printable(resolution)}`);
  }
  get defaultShortDescription() {
    return domainDescriptions.object;
  }
  innerToJsonSchema(ctx) {
    return this.resolution.toJsonSchemaRecurse(ctx);
  }
  traverseAllows = (data, ctx) => {
    const seen2 = ctx.seen[this.reference];
    if (seen2?.includes(data))
      return true;
    ctx.seen[this.reference] = append(seen2, data);
    return this.resolution.traverseAllows(data, ctx);
  };
  traverseApply = (data, ctx) => {
    const seen2 = ctx.seen[this.reference];
    if (seen2?.includes(data))
      return;
    ctx.seen[this.reference] = append(seen2, data);
    this.resolution.traverseApply(data, ctx);
  };
  compile(js) {
    const id2 = this.resolutionId;
    js.if(`ctx.seen.${id2} && ctx.seen.${id2}.includes(data)`, () => js.return(true));
    js.if(`!ctx.seen.${id2}`, () => js.line(`ctx.seen.${id2} = []`));
    js.line(`ctx.seen.${id2}.push(data)`);
    js.return(js.invoke(id2));
  }
}
const writeShallowCycleErrorMessage = (name, seen2) => `Alias '${name}' has a shallow resolution cycle: ${[...seen2, name].join("->")}`;
const Alias = {
  implementation: implementation$a,
  Node: AliasNode
};
class InternalBasis extends BaseRoot {
  traverseApply = (data, ctx) => {
    if (!this.traverseAllows(data, ctx))
      ctx.errorFromNodeContext(this.errorContext);
  };
  get errorContext() {
    return {
      code: this.kind,
      description: this.description,
      meta: this.meta,
      ...this.inner
    };
  }
  get compiledErrorContext() {
    return compileObjectLiteral(this.errorContext);
  }
  compile(js) {
    if (js.traversalKind === "Allows")
      js.return(this.compiledCondition);
    else {
      js.if(this.compiledNegation, () => js.line(`ctx.errorFromNodeContext(${this.compiledErrorContext})`));
    }
  }
}
const implementation$9 = implementNode({
  kind: "domain",
  hasAssociatedError: true,
  collapsibleKey: "domain",
  keys: {
    domain: {},
    numberAllowsNaN: {}
  },
  normalize: (schema) => typeof schema === "string" ? { domain: schema } : hasKey(schema, "numberAllowsNaN") && schema.domain !== "number" ? throwParseError(Domain.writeBadAllowNanMessage(schema.domain)) : schema,
  applyConfig: (schema, config) => schema.numberAllowsNaN === void 0 && schema.domain === "number" && config.numberAllowsNaN ? { ...schema, numberAllowsNaN: true } : schema,
  defaults: {
    description: (node2) => domainDescriptions[node2.domain],
    actual: (data) => Number.isNaN(data) ? "NaN" : domainDescriptions[domainOf(data)]
  },
  intersections: {
    domain: (l2, r2) => (
      // since l === r is handled by default, remaining cases are disjoint
      // outside those including options like numberAllowsNaN
      l2.domain === "number" && r2.domain === "number" ? l2.numberAllowsNaN ? r2 : l2 : Disjoint.init("domain", l2, r2)
    )
  }
});
class DomainNode extends InternalBasis {
  requiresNaNCheck = this.domain === "number" && !this.numberAllowsNaN;
  traverseAllows = this.requiresNaNCheck ? (data) => typeof data === "number" && !Number.isNaN(data) : (data) => domainOf(data) === this.domain;
  compiledCondition = this.domain === "object" ? `((typeof data === "object" && data !== null) || typeof data === "function")` : `typeof data === "${this.domain}"${this.requiresNaNCheck ? " && !Number.isNaN(data)" : ""}`;
  compiledNegation = this.domain === "object" ? `((typeof data !== "object" || data === null) && typeof data !== "function")` : `typeof data !== "${this.domain}"${this.requiresNaNCheck ? " || Number.isNaN(data)" : ""}`;
  expression = this.numberAllowsNaN ? "number | NaN" : this.domain;
  get nestableExpression() {
    return this.numberAllowsNaN ? `(${this.expression})` : this.expression;
  }
  get defaultShortDescription() {
    return domainDescriptions[this.domain];
  }
  innerToJsonSchema(ctx) {
    if (this.domain === "bigint" || this.domain === "symbol") {
      return ctx.fallback.domain({
        code: "domain",
        base: {},
        domain: this.domain
      });
    }
    return {
      type: this.domain
    };
  }
}
const Domain = {
  implementation: implementation$9,
  Node: DomainNode,
  writeBadAllowNanMessage: (actual) => `numberAllowsNaN may only be specified with domain "number" (was ${actual})`
};
const implementation$8 = implementNode({
  kind: "intersection",
  hasAssociatedError: true,
  normalize: (rawSchema) => {
    if (isNode(rawSchema))
      return rawSchema;
    const { structure, ...schema } = rawSchema;
    const hasRootStructureKey = !!structure;
    const normalizedStructure = structure ?? {};
    const normalized = flatMorph(schema, (k, v) => {
      if (isKeyOf(k, structureKeys)) {
        if (hasRootStructureKey) {
          throwParseError(`Flattened structure key ${k} cannot be specified alongside a root 'structure' key.`);
        }
        normalizedStructure[k] = v;
        return [];
      }
      return [k, v];
    });
    if (hasArkKind(normalizedStructure, "constraint") || !isEmptyObject(normalizedStructure))
      normalized.structure = normalizedStructure;
    return normalized;
  },
  finalizeInnerJson: ({ structure, ...rest }) => hasDomain(structure, "object") ? { ...structure, ...rest } : rest,
  keys: {
    domain: {
      child: true,
      parse: (schema, ctx) => ctx.$.node("domain", schema)
    },
    proto: {
      child: true,
      parse: (schema, ctx) => ctx.$.node("proto", schema)
    },
    structure: {
      child: true,
      parse: (schema, ctx) => ctx.$.node("structure", schema),
      serialize: (node2) => {
        if (!node2.sequence?.minLength)
          return node2.collapsibleJson;
        const { sequence, ...structureJson } = node2.collapsibleJson;
        const { minVariadicLength, ...sequenceJson } = sequence;
        const collapsibleSequenceJson = sequenceJson.variadic && Object.keys(sequenceJson).length === 1 ? sequenceJson.variadic : sequenceJson;
        return { ...structureJson, sequence: collapsibleSequenceJson };
      }
    },
    divisor: {
      child: true,
      parse: constraintKeyParser("divisor")
    },
    max: {
      child: true,
      parse: constraintKeyParser("max")
    },
    min: {
      child: true,
      parse: constraintKeyParser("min")
    },
    maxLength: {
      child: true,
      parse: constraintKeyParser("maxLength")
    },
    minLength: {
      child: true,
      parse: constraintKeyParser("minLength")
    },
    exactLength: {
      child: true,
      parse: constraintKeyParser("exactLength")
    },
    before: {
      child: true,
      parse: constraintKeyParser("before")
    },
    after: {
      child: true,
      parse: constraintKeyParser("after")
    },
    pattern: {
      child: true,
      parse: constraintKeyParser("pattern")
    },
    predicate: {
      child: true,
      parse: constraintKeyParser("predicate")
    }
  },
  // leverage reduction logic from intersection and identity to ensure initial
  // parse result is reduced
  reduce: (inner, $) => (
    // we cast union out of the result here since that only occurs when intersecting two sequences
    // that cannot occur when reducing a single intersection schema using unknown
    intersectIntersections({}, inner, {
      $,
      invert: false,
      pipe: false
    })
  ),
  defaults: {
    description: (node2) => {
      if (node2.children.length === 0)
        return "unknown";
      if (node2.structure)
        return node2.structure.description;
      const childDescriptions = [];
      if (node2.basis && !node2.prestructurals.some((r2) => r2.impl.obviatesBasisDescription))
        childDescriptions.push(node2.basis.description);
      if (node2.prestructurals.length) {
        const sortedRefinementDescriptions = node2.prestructurals.toSorted((l2, r2) => l2.kind === "min" && r2.kind === "max" ? -1 : 0).map((r2) => r2.description);
        childDescriptions.push(...sortedRefinementDescriptions);
      }
      if (node2.inner.predicate) {
        childDescriptions.push(...node2.inner.predicate.map((p2) => p2.description));
      }
      return childDescriptions.join(" and ");
    },
    expected: (source) => `  ◦ ${source.errors.map((e) => e.expected).join("\n  ◦ ")}`,
    problem: (ctx) => `(${ctx.actual}) must be...
${ctx.expected}`
  },
  intersections: {
    intersection: (l2, r2, ctx) => intersectIntersections(l2.inner, r2.inner, ctx),
    ...defineRightwardIntersections("intersection", (l2, r2, ctx) => {
      if (l2.children.length === 0)
        return r2;
      const { domain, proto, ...lInnerConstraints } = l2.inner;
      const lBasis = proto ?? domain;
      const basis = lBasis ? intersectOrPipeNodes(lBasis, r2, ctx) : r2;
      return basis instanceof Disjoint ? basis : l2?.basis?.equals(basis) ? (
        // if the basis doesn't change, return the original intesection
        l2
      ) : l2.$.node("intersection", { ...lInnerConstraints, [basis.kind]: basis }, { prereduced: true });
    })
  }
});
class IntersectionNode extends BaseRoot {
  basis = this.inner.domain ?? this.inner.proto ?? null;
  prestructurals = [];
  refinements = this.children.filter((node2) => {
    if (!node2.isRefinement())
      return false;
    if (includes(prestructuralKinds, node2.kind))
      this.prestructurals.push(node2);
    return true;
  });
  structure = this.inner.structure;
  expression = writeIntersectionExpression(this);
  get shallowMorphs() {
    return this.inner.structure?.structuralMorph ? [this.inner.structure.structuralMorph] : [];
  }
  get defaultShortDescription() {
    return this.basis?.defaultShortDescription ?? "present";
  }
  innerToJsonSchema(ctx) {
    return this.children.reduce(
      // cast is required since TS doesn't know children have compatible schema prerequisites
      (schema, child) => child.isBasis() ? child.toJsonSchemaRecurse(ctx) : child.reduceJsonSchema(schema, ctx),
      {}
    );
  }
  traverseAllows = (data, ctx) => this.children.every((child) => child.traverseAllows(data, ctx));
  traverseApply = (data, ctx) => {
    const errorCount = ctx.currentErrorCount;
    if (this.basis) {
      this.basis.traverseApply(data, ctx);
      if (ctx.currentErrorCount > errorCount)
        return;
    }
    if (this.prestructurals.length) {
      for (let i2 = 0; i2 < this.prestructurals.length - 1; i2++) {
        this.prestructurals[i2].traverseApply(data, ctx);
        if (ctx.failFast && ctx.currentErrorCount > errorCount)
          return;
      }
      this.prestructurals.at(-1).traverseApply(data, ctx);
      if (ctx.currentErrorCount > errorCount)
        return;
    }
    if (this.structure) {
      this.structure.traverseApply(data, ctx);
      if (ctx.currentErrorCount > errorCount)
        return;
    }
    if (this.inner.predicate) {
      for (let i2 = 0; i2 < this.inner.predicate.length - 1; i2++) {
        this.inner.predicate[i2].traverseApply(data, ctx);
        if (ctx.failFast && ctx.currentErrorCount > errorCount)
          return;
      }
      this.inner.predicate.at(-1).traverseApply(data, ctx);
    }
  };
  compile(js) {
    if (js.traversalKind === "Allows") {
      for (const child of this.children)
        js.check(child);
      js.return(true);
      return;
    }
    js.initializeErrorCount();
    if (this.basis) {
      js.check(this.basis);
      if (this.children.length > 1)
        js.returnIfFail();
    }
    if (this.prestructurals.length) {
      for (let i2 = 0; i2 < this.prestructurals.length - 1; i2++) {
        js.check(this.prestructurals[i2]);
        js.returnIfFailFast();
      }
      js.check(this.prestructurals.at(-1));
      if (this.structure || this.inner.predicate)
        js.returnIfFail();
    }
    if (this.structure) {
      js.check(this.structure);
      if (this.inner.predicate)
        js.returnIfFail();
    }
    if (this.inner.predicate) {
      for (let i2 = 0; i2 < this.inner.predicate.length - 1; i2++) {
        js.check(this.inner.predicate[i2]);
        js.returnIfFail();
      }
      js.check(this.inner.predicate.at(-1));
    }
  }
}
const Intersection = {
  implementation: implementation$8,
  Node: IntersectionNode
};
const writeIntersectionExpression = (node2) => {
  if (node2.structure?.expression)
    return node2.structure.expression;
  const basisExpression = node2.basis && !node2.prestructurals.some((n) => n.impl.obviatesBasisExpression) ? node2.basis.nestableExpression : "";
  const refinementsExpression = node2.prestructurals.map((n) => n.expression).join(" & ");
  const fullExpression = `${basisExpression}${basisExpression ? " " : ""}${refinementsExpression}`;
  if (fullExpression === "Array == 0")
    return "[]";
  return fullExpression || "unknown";
};
const intersectIntersections = (l2, r2, ctx) => {
  const baseInner = {};
  const lBasis = l2.proto ?? l2.domain;
  const rBasis = r2.proto ?? r2.domain;
  const basisResult = lBasis ? rBasis ? intersectOrPipeNodes(lBasis, rBasis, ctx) : lBasis : rBasis;
  if (basisResult instanceof Disjoint)
    return basisResult;
  if (basisResult)
    baseInner[basisResult.kind] = basisResult;
  return intersectConstraints({
    kind: "intersection",
    baseInner,
    l: flattenConstraints(l2),
    r: flattenConstraints(r2),
    roots: [],
    ctx
  });
};
const implementation$7 = implementNode({
  kind: "morph",
  hasAssociatedError: false,
  keys: {
    in: {
      child: true,
      parse: (schema, ctx) => ctx.$.parseSchema(schema)
    },
    morphs: {
      parse: liftArray,
      serialize: (morphs) => morphs.map((m2) => hasArkKind(m2, "root") ? m2.json : registeredReference(m2))
    },
    declaredIn: {
      child: false,
      serialize: (node2) => node2.json
    },
    declaredOut: {
      child: false,
      serialize: (node2) => node2.json
    }
  },
  normalize: (schema) => schema,
  defaults: {
    description: (node2) => `a morph from ${node2.rawIn.description} to ${node2.rawOut?.description ?? "unknown"}`
  },
  intersections: {
    morph: (l2, r2, ctx) => {
      if (!l2.hasEqualMorphs(r2)) {
        return throwParseError(writeMorphIntersectionMessage(l2.expression, r2.expression));
      }
      const inTersection = intersectOrPipeNodes(l2.rawIn, r2.rawIn, ctx);
      if (inTersection instanceof Disjoint)
        return inTersection;
      const baseInner = {
        morphs: l2.morphs
      };
      if (l2.declaredIn || r2.declaredIn) {
        const declaredIn = intersectOrPipeNodes(l2.rawIn, r2.rawIn, ctx);
        if (declaredIn instanceof Disjoint)
          return declaredIn.throw();
        else
          baseInner.declaredIn = declaredIn;
      }
      if (l2.declaredOut || r2.declaredOut) {
        const declaredOut = intersectOrPipeNodes(l2.rawOut, r2.rawOut, ctx);
        if (declaredOut instanceof Disjoint)
          return declaredOut.throw();
        else
          baseInner.declaredOut = declaredOut;
      }
      return inTersection.distribute((inBranch) => ctx.$.node("morph", {
        ...baseInner,
        in: inBranch
      }), ctx.$.parseSchema);
    },
    ...defineRightwardIntersections("morph", (l2, r2, ctx) => {
      const inTersection = l2.inner.in ? intersectOrPipeNodes(l2.inner.in, r2, ctx) : r2;
      return inTersection instanceof Disjoint ? inTersection : inTersection.equals(l2.inner.in) ? l2 : ctx.$.node("morph", {
        ...l2.inner,
        in: inTersection
      });
    })
  }
});
class MorphNode extends BaseRoot {
  serializedMorphs = this.morphs.map(registeredReference);
  compiledMorphs = `[${this.serializedMorphs}]`;
  lastMorph = this.inner.morphs.at(-1);
  lastMorphIfNode = hasArkKind(this.lastMorph, "root") ? this.lastMorph : void 0;
  introspectableIn = this.inner.in;
  introspectableOut = this.lastMorphIfNode ? Object.assign(this.referencesById, this.lastMorphIfNode.referencesById) && this.lastMorphIfNode.rawOut : void 0;
  get shallowMorphs() {
    return Array.isArray(this.inner.in?.shallowMorphs) ? [...this.inner.in.shallowMorphs, ...this.morphs] : this.morphs;
  }
  get rawIn() {
    return this.declaredIn ?? this.inner.in?.rawIn ?? $ark.intrinsic.unknown.internal;
  }
  get rawOut() {
    return this.declaredOut ?? this.introspectableOut ?? $ark.intrinsic.unknown.internal;
  }
  declareIn(declaredIn) {
    return this.$.node("morph", {
      ...this.inner,
      declaredIn
    });
  }
  declareOut(declaredOut) {
    return this.$.node("morph", {
      ...this.inner,
      declaredOut
    });
  }
  expression = `(In: ${this.rawIn.expression}) => ${this.lastMorphIfNode ? "To" : "Out"}<${this.rawOut.expression}>`;
  get defaultShortDescription() {
    return this.rawIn.meta.description ?? this.rawIn.defaultShortDescription;
  }
  innerToJsonSchema(ctx) {
    return ctx.fallback.morph({
      code: "morph",
      base: this.rawIn.toJsonSchemaRecurse(ctx),
      out: this.introspectableOut?.toJsonSchemaRecurse(ctx) ?? null
    });
  }
  compile(js) {
    if (js.traversalKind === "Allows") {
      if (!this.introspectableIn)
        return;
      js.return(js.invoke(this.introspectableIn));
      return;
    }
    if (this.introspectableIn)
      js.line(js.invoke(this.introspectableIn));
    js.line(`ctx.queueMorphs(${this.compiledMorphs})`);
  }
  traverseAllows = (data, ctx) => !this.introspectableIn || this.introspectableIn.traverseAllows(data, ctx);
  traverseApply = (data, ctx) => {
    if (this.introspectableIn)
      this.introspectableIn.traverseApply(data, ctx);
    ctx.queueMorphs(this.morphs);
  };
  /** Check if the morphs of r are equal to those of this node */
  hasEqualMorphs(r2) {
    return arrayEquals(this.morphs, r2.morphs, {
      isEqual: (lMorph, rMorph) => lMorph === rMorph || hasArkKind(lMorph, "root") && hasArkKind(rMorph, "root") && lMorph.equals(rMorph)
    });
  }
}
const Morph = {
  implementation: implementation$7,
  Node: MorphNode
};
const writeMorphIntersectionMessage = (lDescription, rDescription) => `The intersection of distinct morphs at a single path is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;
const implementation$6 = implementNode({
  kind: "proto",
  hasAssociatedError: true,
  collapsibleKey: "proto",
  keys: {
    proto: {
      serialize: (ctor) => getBuiltinNameOfConstructor(ctor) ?? defaultValueSerializer(ctor)
    },
    dateAllowsInvalid: {}
  },
  normalize: (schema) => {
    const normalized = typeof schema === "string" ? { proto: builtinConstructors[schema] } : typeof schema === "function" ? isNode(schema) ? schema : { proto: schema } : typeof schema.proto === "string" ? { ...schema, proto: builtinConstructors[schema.proto] } : schema;
    if (typeof normalized.proto !== "function")
      throwParseError(Proto.writeInvalidSchemaMessage(normalized.proto));
    if (hasKey(normalized, "dateAllowsInvalid") && normalized.proto !== Date)
      throwParseError(Proto.writeBadInvalidDateMessage(normalized.proto));
    return normalized;
  },
  applyConfig: (schema, config) => {
    if (schema.dateAllowsInvalid === void 0 && schema.proto === Date && config.dateAllowsInvalid)
      return { ...schema, dateAllowsInvalid: true };
    return schema;
  },
  defaults: {
    description: (node2) => node2.builtinName ? objectKindDescriptions[node2.builtinName] : `an instance of ${node2.proto.name}`,
    actual: (data) => data instanceof Date && data.toString() === "Invalid Date" ? "an invalid Date" : objectKindOrDomainOf(data)
  },
  intersections: {
    proto: (l2, r2) => l2.proto === Date && r2.proto === Date ? (
      // since l === r is handled by default,
      // exactly one of l or r must have allow invalid dates
      l2.dateAllowsInvalid ? r2 : l2
    ) : constructorExtends(l2.proto, r2.proto) ? l2 : constructorExtends(r2.proto, l2.proto) ? r2 : Disjoint.init("proto", l2, r2),
    domain: (proto, domain) => domain.domain === "object" ? proto : Disjoint.init("domain", $ark.intrinsic.object.internal, domain)
  }
});
class ProtoNode extends InternalBasis {
  builtinName = getBuiltinNameOfConstructor(this.proto);
  serializedConstructor = this.json.proto;
  requiresInvalidDateCheck = this.proto === Date && !this.dateAllowsInvalid;
  traverseAllows = this.requiresInvalidDateCheck ? (data) => data instanceof Date && data.toString() !== "Invalid Date" : (data) => data instanceof this.proto;
  compiledCondition = `data instanceof ${this.serializedConstructor}${this.requiresInvalidDateCheck ? ` && data.toString() !== "Invalid Date"` : ""}`;
  compiledNegation = `!(${this.compiledCondition})`;
  innerToJsonSchema(ctx) {
    switch (this.builtinName) {
      case "Array":
        return {
          type: "array"
        };
      case "Date":
        return ctx.fallback.date?.({ code: "date", base: {} }) ?? ctx.fallback.proto({ code: "proto", base: {}, proto: this.proto });
      default:
        return ctx.fallback.proto({
          code: "proto",
          base: {},
          proto: this.proto
        });
    }
  }
  expression = this.dateAllowsInvalid ? "Date | InvalidDate" : this.proto.name;
  get nestableExpression() {
    return this.dateAllowsInvalid ? `(${this.expression})` : this.expression;
  }
  domain = "object";
  get defaultShortDescription() {
    return this.description;
  }
}
const Proto = {
  implementation: implementation$6,
  Node: ProtoNode,
  writeBadInvalidDateMessage: (actual) => `dateAllowsInvalid may only be specified with constructor Date (was ${actual.name})`,
  writeInvalidSchemaMessage: (actual) => `instanceOf operand must be a function (was ${domainOf(actual)})`
};
const implementation$5 = implementNode({
  kind: "union",
  hasAssociatedError: true,
  collapsibleKey: "branches",
  keys: {
    ordered: {},
    branches: {
      child: true,
      parse: (schema, ctx) => {
        const branches = [];
        for (const branchSchema of schema) {
          const branchNodes = hasArkKind(branchSchema, "root") ? branchSchema.branches : ctx.$.parseSchema(branchSchema).branches;
          for (const node2 of branchNodes) {
            if (node2.hasKind("morph")) {
              const matchingMorphIndex = branches.findIndex((matching) => matching.hasKind("morph") && matching.hasEqualMorphs(node2));
              if (matchingMorphIndex === -1)
                branches.push(node2);
              else {
                const matchingMorph = branches[matchingMorphIndex];
                branches[matchingMorphIndex] = ctx.$.node("morph", {
                  ...matchingMorph.inner,
                  in: matchingMorph.rawIn.rawOr(node2.rawIn)
                });
              }
            } else
              branches.push(node2);
          }
        }
        if (!ctx.def.ordered)
          branches.sort((l2, r2) => l2.hash < r2.hash ? -1 : 1);
        return branches;
      }
    }
  },
  normalize: (schema) => isArray(schema) ? { branches: schema } : schema,
  reduce: (inner, $) => {
    const reducedBranches = reduceBranches(inner);
    if (reducedBranches.length === 1)
      return reducedBranches[0];
    if (reducedBranches.length === inner.branches.length)
      return;
    return $.node("union", {
      ...inner,
      branches: reducedBranches
    }, { prereduced: true });
  },
  defaults: {
    description: (node2) => node2.distribute((branch) => branch.description, describeBranches),
    expected: (ctx) => {
      const byPath = groupBy(ctx.errors, "propString");
      const pathDescriptions = Object.entries(byPath).map(([path, errors]) => {
        const branchesAtPath = [];
        for (const errorAtPath of errors)
          appendUnique(branchesAtPath, errorAtPath.expected);
        const expected = describeBranches(branchesAtPath);
        const actual = errors.every((e) => e.actual === errors[0].actual) ? errors[0].actual : printable(errors[0].data);
        return `${path && `${path} `}must be ${expected}${actual && ` (was ${actual})`}`;
      });
      return describeBranches(pathDescriptions);
    },
    problem: (ctx) => ctx.expected,
    message: (ctx) => {
      if (ctx.problem[0] === "[") {
        return `value at ${ctx.problem}`;
      }
      return ctx.problem;
    }
  },
  intersections: {
    union: (l2, r2, ctx) => {
      if (l2.isNever !== r2.isNever) {
        return Disjoint.init("presence", l2, r2);
      }
      let resultBranches;
      if (l2.ordered) {
        if (r2.ordered) {
          throwParseError(writeOrderedIntersectionMessage(l2.expression, r2.expression));
        }
        resultBranches = intersectBranches(r2.branches, l2.branches, ctx);
        if (resultBranches instanceof Disjoint)
          resultBranches.invert();
      } else
        resultBranches = intersectBranches(l2.branches, r2.branches, ctx);
      if (resultBranches instanceof Disjoint)
        return resultBranches;
      return ctx.$.parseSchema(l2.ordered || r2.ordered ? {
        branches: resultBranches,
        ordered: true
      } : { branches: resultBranches });
    },
    ...defineRightwardIntersections("union", (l2, r2, ctx) => {
      const branches = intersectBranches(l2.branches, [r2], ctx);
      if (branches instanceof Disjoint)
        return branches;
      if (branches.length === 1)
        return branches[0];
      return ctx.$.parseSchema(l2.ordered ? { branches, ordered: true } : { branches });
    })
  }
});
class UnionNode extends BaseRoot {
  isBoolean = this.branches.length === 2 && this.branches[0].hasUnit(false) && this.branches[1].hasUnit(true);
  get branchGroups() {
    const branchGroups = [];
    let firstBooleanIndex = -1;
    for (const branch of this.branches) {
      if (branch.hasKind("unit") && branch.domain === "boolean") {
        if (firstBooleanIndex === -1) {
          firstBooleanIndex = branchGroups.length;
          branchGroups.push(branch);
        } else
          branchGroups[firstBooleanIndex] = $ark.intrinsic.boolean;
        continue;
      }
      branchGroups.push(branch);
    }
    return branchGroups;
  }
  unitBranches = this.branches.filter((n) => n.rawIn.hasKind("unit"));
  discriminant = this.discriminate();
  discriminantJson = this.discriminant ? discriminantToJson(this.discriminant) : null;
  expression = this.distribute((n) => n.nestableExpression, expressBranches);
  createBranchedOptimisticRootApply() {
    return (data, onFail) => {
      const optimisticResult = this.traverseOptimistic(data);
      if (optimisticResult !== unset)
        return optimisticResult;
      const ctx = new Traversal(data, this.$.resolvedConfig);
      this.traverseApply(data, ctx);
      return ctx.finalize(onFail);
    };
  }
  get shallowMorphs() {
    return this.branches.reduce((morphs, branch) => appendUnique(morphs, branch.shallowMorphs), []);
  }
  get defaultShortDescription() {
    return this.distribute((branch) => branch.defaultShortDescription, describeBranches);
  }
  innerToJsonSchema(ctx) {
    if (this.branchGroups.length === 1 && this.branchGroups[0].equals($ark.intrinsic.boolean))
      return { type: "boolean" };
    const jsonSchemaBranches = this.branchGroups.map((group) => group.toJsonSchemaRecurse(ctx));
    if (jsonSchemaBranches.every((branch) => (
      // iff all branches are pure unit values with no metadata,
      // we can simplify the representation to an enum
      Object.keys(branch).length === 1 && hasKey(branch, "const")
    ))) {
      return {
        enum: jsonSchemaBranches.map((branch) => branch.const)
      };
    }
    return {
      anyOf: jsonSchemaBranches
    };
  }
  traverseAllows = (data, ctx) => this.branches.some((b) => b.traverseAllows(data, ctx));
  traverseApply = (data, ctx) => {
    const errors = [];
    for (let i2 = 0; i2 < this.branches.length; i2++) {
      ctx.pushBranch();
      this.branches[i2].traverseApply(data, ctx);
      if (!ctx.hasError()) {
        if (this.branches[i2].includesTransform)
          return ctx.queuedMorphs.push(...ctx.popBranch().queuedMorphs);
        return ctx.popBranch();
      }
      errors.push(ctx.popBranch().error);
    }
    ctx.errorFromNodeContext({ code: "union", errors, meta: this.meta });
  };
  traverseOptimistic = (data) => {
    for (let i2 = 0; i2 < this.branches.length; i2++) {
      const branch = this.branches[i2];
      if (branch.traverseAllows(data)) {
        if (branch.contextFreeMorph)
          return branch.contextFreeMorph(data);
        return data;
      }
    }
    return unset;
  };
  compile(js) {
    if (!this.discriminant || // if we have a union of two units like `boolean`, the
    // undiscriminated compilation will be just as fast
    this.unitBranches.length === this.branches.length && this.branches.length === 2)
      return this.compileIndiscriminable(js);
    let condition = this.discriminant.optionallyChainedPropString;
    if (this.discriminant.kind === "domain")
      condition = `typeof ${condition} === "object" ? ${condition} === null ? "null" : "object" : typeof ${condition} === "function" ? "object" : typeof ${condition}`;
    const cases = this.discriminant.cases;
    const caseKeys = Object.keys(cases);
    const { optimistic } = js;
    js.optimistic = false;
    js.block(`switch(${condition})`, () => {
      for (const k in cases) {
        const v = cases[k];
        const caseCondition = k === "default" ? k : `case ${k}`;
        let caseResult;
        if (v === true)
          caseResult = optimistic ? "data" : "true";
        else if (optimistic) {
          if (v.rootApplyStrategy === "branchedOptimistic")
            caseResult = js.invoke(v, { kind: "Optimistic" });
          else if (v.contextFreeMorph)
            caseResult = `${js.invoke(v)} ? ${registeredReference(v.contextFreeMorph)}(data) : "${unset}"`;
          else
            caseResult = `${js.invoke(v)} ? data : "${unset}"`;
        } else
          caseResult = js.invoke(v);
        js.line(`${caseCondition}: return ${caseResult}`);
      }
      return js;
    });
    if (js.traversalKind === "Allows") {
      js.return(optimistic ? `"${unset}"` : false);
      return;
    }
    const expected = describeBranches(this.discriminant.kind === "domain" ? caseKeys.map((k) => {
      const jsTypeOf = k.slice(1, -1);
      return jsTypeOf === "function" ? domainDescriptions.object : domainDescriptions[jsTypeOf];
    }) : caseKeys);
    const serializedPathSegments = this.discriminant.path.map((k) => typeof k === "symbol" ? registeredReference(k) : JSON.stringify(k));
    const serializedExpected = JSON.stringify(expected);
    const serializedActual = this.discriminant.kind === "domain" ? `${serializedTypeOfDescriptions}[${condition}]` : `${serializedPrintable}(${condition})`;
    js.line(`ctx.errorFromNodeContext({
	code: "predicate",
	expected: ${serializedExpected},
	actual: ${serializedActual},
	relativePath: [${serializedPathSegments}],
	meta: ${this.compiledMeta}
})`);
  }
  compileIndiscriminable(js) {
    if (js.traversalKind === "Apply") {
      js.const("errors", "[]");
      for (const branch of this.branches) {
        js.line("ctx.pushBranch()").line(js.invoke(branch)).if("!ctx.hasError()", () => js.return(branch.includesTransform ? "ctx.queuedMorphs.push(...ctx.popBranch().queuedMorphs)" : "ctx.popBranch()")).line("errors.push(ctx.popBranch().error)");
      }
      js.line(`ctx.errorFromNodeContext({ code: "union", errors, meta: ${this.compiledMeta} })`);
    } else {
      const { optimistic } = js;
      js.optimistic = false;
      for (const branch of this.branches) {
        js.if(`${js.invoke(branch)}`, () => js.return(optimistic ? branch.contextFreeMorph ? `${registeredReference(branch.contextFreeMorph)}(data)` : "data" : true));
      }
      js.return(optimistic ? `"${unset}"` : false);
    }
  }
  get nestableExpression() {
    return this.isBoolean ? "boolean" : `(${this.expression})`;
  }
  discriminate() {
    if (this.branches.length < 2 || this.isCyclic)
      return null;
    if (this.unitBranches.length === this.branches.length) {
      const cases2 = flatMorph(this.unitBranches, (i2, n) => [
        `${n.rawIn.serializedValue}`,
        n.hasKind("morph") ? n : true
      ]);
      return {
        kind: "unit",
        path: [],
        optionallyChainedPropString: "data",
        cases: cases2
      };
    }
    const candidates = [];
    for (let lIndex = 0; lIndex < this.branches.length - 1; lIndex++) {
      const l2 = this.branches[lIndex];
      for (let rIndex = lIndex + 1; rIndex < this.branches.length; rIndex++) {
        const r2 = this.branches[rIndex];
        const result = intersectNodesRoot(l2.rawIn, r2.rawIn, l2.$);
        if (!(result instanceof Disjoint))
          continue;
        for (const entry of result) {
          if (!entry.kind || entry.optional)
            continue;
          let lSerialized;
          let rSerialized;
          if (entry.kind === "domain") {
            const lValue = entry.l;
            const rValue = entry.r;
            lSerialized = `"${typeof lValue === "string" ? lValue : lValue.domain}"`;
            rSerialized = `"${typeof rValue === "string" ? rValue : rValue.domain}"`;
          } else if (entry.kind === "unit") {
            lSerialized = entry.l.serializedValue;
            rSerialized = entry.r.serializedValue;
          } else
            continue;
          const matching = candidates.find((d2) => arrayEquals(d2.path, entry.path) && d2.kind === entry.kind);
          if (!matching) {
            candidates.push({
              kind: entry.kind,
              cases: {
                [lSerialized]: {
                  branchIndices: [lIndex],
                  condition: entry.l
                },
                [rSerialized]: {
                  branchIndices: [rIndex],
                  condition: entry.r
                }
              },
              path: entry.path
            });
          } else {
            if (matching.cases[lSerialized]) {
              matching.cases[lSerialized].branchIndices = appendUnique(matching.cases[lSerialized].branchIndices, lIndex);
            } else {
              matching.cases[lSerialized] ??= {
                branchIndices: [lIndex],
                condition: entry.l
              };
            }
            if (matching.cases[rSerialized]) {
              matching.cases[rSerialized].branchIndices = appendUnique(matching.cases[rSerialized].branchIndices, rIndex);
            } else {
              matching.cases[rSerialized] ??= {
                branchIndices: [rIndex],
                condition: entry.r
              };
            }
          }
        }
      }
    }
    const viableCandidates = this.ordered ? viableOrderedCandidates(candidates, this.branches) : candidates;
    if (!viableCandidates.length)
      return null;
    const ctx = createCaseResolutionContext(viableCandidates, this);
    const cases = {};
    for (const k in ctx.best.cases) {
      const resolution = resolveCase(ctx, k);
      if (resolution === null) {
        cases[k] = true;
        continue;
      }
      if (resolution.length === this.branches.length)
        return null;
      if (this.ordered) {
        resolution.sort((l2, r2) => l2.originalIndex - r2.originalIndex);
      }
      const branches = resolution.map((entry) => entry.branch);
      const caseNode = branches.length === 1 ? branches[0] : this.$.node("union", this.ordered ? { branches, ordered: true } : branches);
      Object.assign(this.referencesById, caseNode.referencesById);
      cases[k] = caseNode;
    }
    if (ctx.defaultEntries.length) {
      const branches = ctx.defaultEntries.map((entry) => entry.branch);
      cases.default = this.$.node("union", this.ordered ? { branches, ordered: true } : branches, {
        prereduced: true
      });
      Object.assign(this.referencesById, cases.default.referencesById);
    }
    return Object.assign(ctx.location, {
      cases
    });
  }
}
const createCaseResolutionContext = (viableCandidates, node2) => {
  const ordered = viableCandidates.sort((l2, r2) => l2.path.length === r2.path.length ? Object.keys(r2.cases).length - Object.keys(l2.cases).length : l2.path.length - r2.path.length);
  const best = ordered[0];
  const location = {
    kind: best.kind,
    path: best.path,
    optionallyChainedPropString: optionallyChainPropString(best.path)
  };
  const defaultEntries = node2.branches.map((branch, originalIndex) => ({
    originalIndex,
    branch
  }));
  return {
    best,
    location,
    defaultEntries,
    node: node2
  };
};
const resolveCase = (ctx, key) => {
  const caseCtx = ctx.best.cases[key];
  const discriminantNode = discriminantCaseToNode(caseCtx.condition, ctx.location.path, ctx.node.$);
  let resolvedEntries = [];
  const nextDefaults = [];
  for (let i2 = 0; i2 < ctx.defaultEntries.length; i2++) {
    const entry = ctx.defaultEntries[i2];
    if (caseCtx.branchIndices.includes(entry.originalIndex)) {
      const pruned = pruneDiscriminant(ctx.node.branches[entry.originalIndex], ctx.location);
      if (pruned === null) {
        resolvedEntries = null;
      } else {
        resolvedEntries?.push({
          originalIndex: entry.originalIndex,
          branch: pruned
        });
      }
    } else if (
      // we shouldn't need a special case for alias to avoid the below
      // once alias resolution issues are improved:
      // https://github.com/arktypeio/arktype/issues/1026
      entry.branch.hasKind("alias") && discriminantNode.hasKind("domain") && discriminantNode.domain === "object"
    )
      resolvedEntries?.push(entry);
    else {
      if (entry.branch.rawIn.overlaps(discriminantNode)) {
        const overlapping = pruneDiscriminant(entry.branch, ctx.location);
        resolvedEntries?.push({
          originalIndex: entry.originalIndex,
          branch: overlapping
        });
      }
      nextDefaults.push(entry);
    }
  }
  ctx.defaultEntries = nextDefaults;
  return resolvedEntries;
};
const viableOrderedCandidates = (candidates, originalBranches) => {
  const viableCandidates = candidates.filter((candidate) => {
    const caseGroups = Object.values(candidate.cases).map((caseCtx) => caseCtx.branchIndices);
    for (let i2 = 0; i2 < caseGroups.length - 1; i2++) {
      const currentGroup = caseGroups[i2];
      for (let j = i2 + 1; j < caseGroups.length; j++) {
        const nextGroup = caseGroups[j];
        for (const currentIndex of currentGroup) {
          for (const nextIndex of nextGroup) {
            if (currentIndex > nextIndex) {
              if (originalBranches[currentIndex].overlaps(originalBranches[nextIndex])) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  });
  return viableCandidates;
};
const discriminantCaseToNode = (caseDiscriminant, path, $) => {
  let node2 = caseDiscriminant === "undefined" ? $.node("unit", { unit: void 0 }) : caseDiscriminant === "null" ? $.node("unit", { unit: null }) : caseDiscriminant === "boolean" ? $.units([true, false]) : caseDiscriminant;
  for (let i2 = path.length - 1; i2 >= 0; i2--) {
    const key = path[i2];
    node2 = $.node("intersection", typeof key === "number" ? {
      proto: "Array",
      // create unknown for preceding elements (could be optimized with safe imports)
      sequence: [...range(key).map((_) => ({})), node2]
    } : {
      domain: "object",
      required: [{ key, value: node2 }]
    });
  }
  return node2;
};
const optionallyChainPropString = (path) => path.reduce((acc, k) => acc + compileLiteralPropAccess(k, true), "data");
const serializedTypeOfDescriptions = registeredReference(jsTypeOfDescriptions);
const serializedPrintable = registeredReference(printable);
const Union = {
  implementation: implementation$5,
  Node: UnionNode
};
const discriminantToJson = (discriminant) => ({
  kind: discriminant.kind,
  path: discriminant.path.map((k) => typeof k === "string" ? k : compileSerializedValue(k)),
  cases: flatMorph(discriminant.cases, (k, node2) => [
    k,
    node2 === true ? node2 : node2.hasKind("union") && node2.discriminantJson ? node2.discriminantJson : node2.json
  ])
});
const describeExpressionOptions = {
  delimiter: " | ",
  finalDelimiter: " | "
};
const expressBranches = (expressions) => describeBranches(expressions, describeExpressionOptions);
const describeBranches = (descriptions, opts) => {
  const delimiter = opts?.delimiter ?? ", ";
  const finalDelimiter = opts?.finalDelimiter ?? " or ";
  if (descriptions.length === 0)
    return "never";
  if (descriptions.length === 1)
    return descriptions[0];
  if (descriptions.length === 2 && descriptions[0] === "false" && descriptions[1] === "true" || descriptions[0] === "true" && descriptions[1] === "false")
    return "boolean";
  const seen2 = {};
  const unique = descriptions.filter((s2) => seen2[s2] ? false : seen2[s2] = true);
  const last2 = unique.pop();
  return `${unique.join(delimiter)}${unique.length ? finalDelimiter : ""}${last2}`;
};
const intersectBranches = (l2, r2, ctx) => {
  const batchesByR = r2.map(() => []);
  for (let lIndex = 0; lIndex < l2.length; lIndex++) {
    let candidatesByR = {};
    for (let rIndex = 0; rIndex < r2.length; rIndex++) {
      if (batchesByR[rIndex] === null) {
        continue;
      }
      if (l2[lIndex].equals(r2[rIndex])) {
        batchesByR[rIndex] = null;
        candidatesByR = {};
        break;
      }
      const branchIntersection = intersectOrPipeNodes(l2[lIndex], r2[rIndex], ctx);
      if (branchIntersection instanceof Disjoint) {
        continue;
      }
      if (branchIntersection.equals(l2[lIndex])) {
        batchesByR[rIndex].push(l2[lIndex]);
        candidatesByR = {};
        break;
      }
      if (branchIntersection.equals(r2[rIndex])) {
        batchesByR[rIndex] = null;
      } else {
        candidatesByR[rIndex] = branchIntersection;
      }
    }
    for (const rIndex in candidatesByR) {
      batchesByR[rIndex][lIndex] = candidatesByR[rIndex];
    }
  }
  const resultBranches = batchesByR.flatMap(
    // ensure unions returned from branchable intersections like sequence are flattened
    (batch2, i2) => batch2?.flatMap((branch) => branch.branches) ?? r2[i2]
  );
  return resultBranches.length === 0 ? Disjoint.init("union", l2, r2) : resultBranches;
};
const reduceBranches = ({ branches, ordered }) => {
  if (branches.length < 2)
    return branches;
  const uniquenessByIndex = branches.map(() => true);
  for (let i2 = 0; i2 < branches.length; i2++) {
    for (let j = i2 + 1; j < branches.length && uniquenessByIndex[i2] && uniquenessByIndex[j]; j++) {
      if (branches[i2].equals(branches[j])) {
        uniquenessByIndex[j] = false;
        continue;
      }
      const intersection = intersectNodesRoot(branches[i2].rawIn, branches[j].rawIn, branches[0].$);
      if (intersection instanceof Disjoint)
        continue;
      if (!ordered)
        assertDeterminateOverlap(branches[i2], branches[j]);
      if (intersection.equals(branches[i2].rawIn)) {
        uniquenessByIndex[i2] = !!ordered;
      } else if (intersection.equals(branches[j].rawIn))
        uniquenessByIndex[j] = false;
    }
  }
  return branches.filter((_, i2) => uniquenessByIndex[i2]);
};
const assertDeterminateOverlap = (l2, r2) => {
  if (!l2.includesTransform && !r2.includesTransform)
    return;
  if (!arrayEquals(l2.shallowMorphs, r2.shallowMorphs)) {
    throwParseError(writeIndiscriminableMorphMessage(l2.expression, r2.expression));
  }
  if (!arrayEquals(l2.flatMorphs, r2.flatMorphs, {
    isEqual: (l3, r3) => l3.propString === r3.propString && (l3.node.hasKind("morph") && r3.node.hasKind("morph") ? l3.node.hasEqualMorphs(r3.node) : l3.node.hasKind("intersection") && r3.node.hasKind("intersection") ? l3.node.structure?.structuralMorphRef === r3.node.structure?.structuralMorphRef : false)
  })) {
    throwParseError(writeIndiscriminableMorphMessage(l2.expression, r2.expression));
  }
};
const pruneDiscriminant = (discriminantBranch, discriminantCtx) => discriminantBranch.transform((nodeKind, inner) => {
  if (nodeKind === "domain" || nodeKind === "unit")
    return null;
  return inner;
}, {
  shouldTransform: (node2, ctx) => {
    const propString = optionallyChainPropString(ctx.path);
    if (!discriminantCtx.optionallyChainedPropString.startsWith(propString))
      return false;
    if (node2.hasKind("domain") && node2.domain === "object")
      return true;
    if ((node2.hasKind("domain") || discriminantCtx.kind === "unit") && propString === discriminantCtx.optionallyChainedPropString)
      return true;
    return node2.children.length !== 0 && node2.kind !== "index";
  }
});
const writeIndiscriminableMorphMessage = (lDescription, rDescription) => `An unordered union of a type including a morph and a type with overlapping input is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;
const writeOrderedIntersectionMessage = (lDescription, rDescription) => `The intersection of two ordered unions is indeterminate:
Left: ${lDescription}
Right: ${rDescription}`;
const implementation$4 = implementNode({
  kind: "unit",
  hasAssociatedError: true,
  keys: {
    unit: {
      preserveUndefined: true,
      serialize: (schema) => schema instanceof Date ? schema.toISOString() : defaultValueSerializer(schema)
    }
  },
  normalize: (schema) => schema,
  defaults: {
    description: (node2) => printable(node2.unit),
    problem: ({ expected, actual }) => `${expected === actual ? `must be reference equal to ${expected} (serialized to the same value)` : `must be ${expected} (was ${actual})`}`
  },
  intersections: {
    unit: (l2, r2) => Disjoint.init("unit", l2, r2),
    ...defineRightwardIntersections("unit", (l2, r2) => {
      if (r2.allows(l2.unit))
        return l2;
      const rBasis = r2.hasKind("intersection") ? r2.basis : r2;
      if (rBasis) {
        const rDomain = rBasis.hasKind("domain") ? rBasis : $ark.intrinsic.object;
        if (l2.domain !== rDomain.domain) {
          const lDomainDisjointValue = l2.domain === "undefined" || l2.domain === "null" || l2.domain === "boolean" ? l2.domain : $ark.intrinsic[l2.domain];
          return Disjoint.init("domain", lDomainDisjointValue, rDomain);
        }
      }
      return Disjoint.init("assignability", l2, r2.hasKind("intersection") ? r2.children.find((rConstraint) => !rConstraint.allows(l2.unit)) : r2);
    })
  }
});
class UnitNode extends InternalBasis {
  compiledValue = this.json.unit;
  serializedValue = typeof this.unit === "string" || this.unit instanceof Date ? JSON.stringify(this.compiledValue) : `${this.compiledValue}`;
  compiledCondition = compileEqualityCheck(this.unit, this.serializedValue);
  compiledNegation = compileEqualityCheck(this.unit, this.serializedValue, "negated");
  expression = printable(this.unit);
  domain = domainOf(this.unit);
  get defaultShortDescription() {
    return this.domain === "object" ? domainDescriptions.object : this.description;
  }
  innerToJsonSchema(ctx) {
    return (
      // this is the more standard JSON schema representation, especially for Open API
      this.unit === null ? { type: "null" } : $ark.intrinsic.jsonPrimitive.allows(this.unit) ? { const: this.unit } : ctx.fallback.unit({ code: "unit", base: {}, unit: this.unit })
    );
  }
  traverseAllows = this.unit instanceof Date ? (data) => data instanceof Date && data.toISOString() === this.compiledValue : Number.isNaN(this.unit) ? (data) => Number.isNaN(data) : (data) => data === this.unit;
}
const Unit = {
  implementation: implementation$4,
  Node: UnitNode
};
const compileEqualityCheck = (unit, serializedValue, negated) => {
  if (unit instanceof Date) {
    const condition = `data instanceof Date && data.toISOString() === ${serializedValue}`;
    return negated ? `!(${condition})` : condition;
  }
  if (Number.isNaN(unit))
    return `${negated ? "!" : ""}Number.isNaN(data)`;
  return `data ${negated ? "!" : "="}== ${serializedValue}`;
};
const implementation$3 = implementNode({
  kind: "index",
  hasAssociatedError: false,
  intersectionIsOpen: true,
  keys: {
    signature: {
      child: true,
      parse: (schema, ctx) => {
        const key = ctx.$.parseSchema(schema);
        if (!key.extends($ark.intrinsic.key)) {
          return throwParseError(writeInvalidPropertyKeyMessage(key.expression));
        }
        const enumerableBranches = key.branches.filter((b) => b.hasKind("unit"));
        if (enumerableBranches.length) {
          return throwParseError(writeEnumerableIndexBranches(enumerableBranches.map((b) => printable(b.unit))));
        }
        return key;
      }
    },
    value: {
      child: true,
      parse: (schema, ctx) => ctx.$.parseSchema(schema)
    }
  },
  normalize: (schema) => schema,
  defaults: {
    description: (node2) => `[${node2.signature.expression}]: ${node2.value.description}`
  },
  intersections: {
    index: (l2, r2, ctx) => {
      if (l2.signature.equals(r2.signature)) {
        const valueIntersection = intersectOrPipeNodes(l2.value, r2.value, ctx);
        const value2 = valueIntersection instanceof Disjoint ? $ark.intrinsic.never.internal : valueIntersection;
        return ctx.$.node("index", { signature: l2.signature, value: value2 });
      }
      if (l2.signature.extends(r2.signature) && l2.value.subsumes(r2.value))
        return r2;
      if (r2.signature.extends(l2.signature) && r2.value.subsumes(l2.value))
        return l2;
      return null;
    }
  }
});
class IndexNode extends BaseConstraint {
  impliedBasis = $ark.intrinsic.object.internal;
  expression = `[${this.signature.expression}]: ${this.value.expression}`;
  flatRefs = append(this.value.flatRefs.map((ref) => flatRef([this.signature, ...ref.path], ref.node)), flatRef([this.signature], this.value));
  traverseAllows = (data, ctx) => stringAndSymbolicEntriesOf(data).every((entry) => {
    if (this.signature.traverseAllows(entry[0], ctx)) {
      return traverseKey(entry[0], () => this.value.traverseAllows(entry[1], ctx), ctx);
    }
    return true;
  });
  traverseApply = (data, ctx) => {
    for (const entry of stringAndSymbolicEntriesOf(data)) {
      if (this.signature.traverseAllows(entry[0], ctx)) {
        traverseKey(entry[0], () => this.value.traverseApply(entry[1], ctx), ctx);
      }
    }
  };
  _transform(mapper, ctx) {
    ctx.path.push(this.signature);
    const result = super._transform(mapper, ctx);
    ctx.path.pop();
    return result;
  }
  compile() {
  }
}
const Index = {
  implementation: implementation$3,
  Node: IndexNode
};
const writeEnumerableIndexBranches = (keys) => `Index keys ${keys.join(", ")} should be specified as named props.`;
const writeInvalidPropertyKeyMessage = (indexSchema) => `Indexed key definition '${indexSchema}' must be a string or symbol`;
const implementation$2 = implementNode({
  kind: "required",
  hasAssociatedError: true,
  intersectionIsOpen: true,
  keys: {
    key: {},
    value: {
      child: true,
      parse: (schema, ctx) => ctx.$.parseSchema(schema)
    }
  },
  normalize: (schema) => schema,
  defaults: {
    description: (node2) => `${node2.compiledKey}: ${node2.value.description}`,
    expected: (ctx) => ctx.missingValueDescription,
    actual: () => "missing"
  },
  intersections: {
    required: intersectProps,
    optional: intersectProps
  }
});
class RequiredNode extends BaseProp {
  expression = `${this.compiledKey}: ${this.value.expression}`;
  errorContext = Object.freeze({
    code: "required",
    missingValueDescription: this.value.defaultShortDescription,
    relativePath: [this.key],
    meta: this.meta
  });
  compiledErrorContext = compileObjectLiteral(this.errorContext);
}
const Required$1 = {
  implementation: implementation$2,
  Node: RequiredNode
};
const implementation$1 = implementNode({
  kind: "sequence",
  hasAssociatedError: false,
  collapsibleKey: "variadic",
  keys: {
    prefix: {
      child: true,
      parse: (schema, ctx) => {
        if (schema.length === 0)
          return void 0;
        return schema.map((element) => ctx.$.parseSchema(element));
      }
    },
    optionals: {
      child: true,
      parse: (schema, ctx) => {
        if (schema.length === 0)
          return void 0;
        return schema.map((element) => ctx.$.parseSchema(element));
      }
    },
    defaultables: {
      child: (defaultables) => defaultables.map((element) => element[0]),
      parse: (defaultables, ctx) => {
        if (defaultables.length === 0)
          return void 0;
        return defaultables.map((element) => {
          const node2 = ctx.$.parseSchema(element[0]);
          assertDefaultValueAssignability(node2, element[1], null);
          return [node2, element[1]];
        });
      },
      serialize: (defaults) => defaults.map((element) => [
        element[0].collapsibleJson,
        defaultValueSerializer(element[1])
      ]),
      reduceIo: (ioKind, inner, defaultables) => {
        if (ioKind === "in") {
          inner.optionals = defaultables.map((d2) => d2[0].rawIn);
          return;
        }
        inner.prefix = defaultables.map((d2) => d2[0].rawOut);
        return;
      }
    },
    variadic: {
      child: true,
      parse: (schema, ctx) => ctx.$.parseSchema(schema, ctx)
    },
    minVariadicLength: {
      // minVariadicLength is reflected in the id of this node,
      // but not its IntersectionNode parent since it is superceded by the minLength
      // node it implies
      parse: (min) => min === 0 ? void 0 : min
    },
    postfix: {
      child: true,
      parse: (schema, ctx) => {
        if (schema.length === 0)
          return void 0;
        return schema.map((element) => ctx.$.parseSchema(element));
      }
    }
  },
  normalize: (schema) => {
    if (typeof schema === "string")
      return { variadic: schema };
    if ("variadic" in schema || "prefix" in schema || "defaultables" in schema || "optionals" in schema || "postfix" in schema || "minVariadicLength" in schema) {
      if (schema.postfix?.length) {
        if (!schema.variadic)
          return throwParseError(postfixWithoutVariadicMessage);
        if (schema.optionals?.length || schema.defaultables?.length)
          return throwParseError(postfixAfterOptionalOrDefaultableMessage);
      }
      if (schema.minVariadicLength && !schema.variadic) {
        return throwParseError("minVariadicLength may not be specified without a variadic element");
      }
      return schema;
    }
    return { variadic: schema };
  },
  reduce: (raw, $) => {
    let minVariadicLength = raw.minVariadicLength ?? 0;
    const prefix2 = raw.prefix?.slice() ?? [];
    const defaultables = raw.defaultables?.slice() ?? [];
    const optionals = raw.optionals?.slice() ?? [];
    const postfix = raw.postfix?.slice() ?? [];
    if (raw.variadic) {
      while (optionals.at(-1)?.equals(raw.variadic))
        optionals.pop();
      if (optionals.length === 0 && defaultables.length === 0) {
        while (prefix2.at(-1)?.equals(raw.variadic)) {
          prefix2.pop();
          minVariadicLength++;
        }
      }
      while (postfix[0]?.equals(raw.variadic)) {
        postfix.shift();
        minVariadicLength++;
      }
    } else if (optionals.length === 0 && defaultables.length === 0) {
      prefix2.push(...postfix.splice(0));
    }
    if (
      // if any variadic adjacent elements were moved to minVariadicLength
      minVariadicLength !== raw.minVariadicLength || // or any postfix elements were moved to prefix
      raw.prefix && raw.prefix.length !== prefix2.length
    ) {
      return $.node("sequence", {
        ...raw,
        // empty lists will be omitted during parsing
        prefix: prefix2,
        defaultables,
        optionals,
        postfix,
        minVariadicLength
      }, { prereduced: true });
    }
  },
  defaults: {
    description: (node2) => {
      if (node2.isVariadicOnly)
        return `${node2.variadic.nestableExpression}[]`;
      const innerDescription = node2.tuple.map((element) => element.kind === "defaultables" ? `${element.node.nestableExpression} = ${printable(element.default)}` : element.kind === "optionals" ? `${element.node.nestableExpression}?` : element.kind === "variadic" ? `...${element.node.nestableExpression}[]` : element.node.expression).join(", ");
      return `[${innerDescription}]`;
    }
  },
  intersections: {
    sequence: (l2, r2, ctx) => {
      const rootState = _intersectSequences({
        l: l2.tuple,
        r: r2.tuple,
        disjoint: new Disjoint(),
        result: [],
        fixedVariants: [],
        ctx
      });
      const viableBranches = rootState.disjoint.length === 0 ? [rootState, ...rootState.fixedVariants] : rootState.fixedVariants;
      return viableBranches.length === 0 ? rootState.disjoint : viableBranches.length === 1 ? ctx.$.node("sequence", sequenceTupleToInner(viableBranches[0].result)) : ctx.$.node("union", viableBranches.map((state) => ({
        proto: Array,
        sequence: sequenceTupleToInner(state.result)
      })));
    }
    // exactLength, minLength, and maxLength don't need to be defined
    // here since impliedSiblings guarantees they will be added
    // directly to the IntersectionNode parent of the SequenceNode
    // they exist on
  }
});
class SequenceNode extends BaseConstraint {
  impliedBasis = $ark.intrinsic.Array.internal;
  tuple = sequenceInnerToTuple(this.inner);
  prefixLength = this.prefix?.length ?? 0;
  defaultablesLength = this.defaultables?.length ?? 0;
  optionalsLength = this.optionals?.length ?? 0;
  postfixLength = this.postfix?.length ?? 0;
  defaultablesAndOptionals = [];
  prevariadic = this.tuple.filter((el) => {
    if (el.kind === "defaultables" || el.kind === "optionals") {
      this.defaultablesAndOptionals.push(el.node);
      return true;
    }
    return el.kind === "prefix";
  });
  variadicOrPostfix = conflatenate(this.variadic && [this.variadic], this.postfix);
  // have to wait until prevariadic and variadicOrPostfix are set to calculate
  flatRefs = this.addFlatRefs();
  addFlatRefs() {
    appendUniqueFlatRefs(this.flatRefs, this.prevariadic.flatMap((element, i2) => append(element.node.flatRefs.map((ref) => flatRef([`${i2}`, ...ref.path], ref.node)), flatRef([`${i2}`], element.node))));
    appendUniqueFlatRefs(this.flatRefs, this.variadicOrPostfix.flatMap((element) => (
      // a postfix index can't be directly represented as a type
      // key, so we just use the same matcher for variadic
      append(element.flatRefs.map((ref) => flatRef([$ark.intrinsic.nonNegativeIntegerString.internal, ...ref.path], ref.node)), flatRef([$ark.intrinsic.nonNegativeIntegerString.internal], element))
    )));
    return this.flatRefs;
  }
  isVariadicOnly = this.prevariadic.length + this.postfixLength === 0;
  minVariadicLength = this.inner.minVariadicLength ?? 0;
  minLength = this.prefixLength + this.minVariadicLength + this.postfixLength;
  minLengthNode = this.minLength === 0 ? null : this.$.node("minLength", this.minLength);
  maxLength = this.variadic ? null : this.tuple.length;
  maxLengthNode = this.maxLength === null ? null : this.$.node("maxLength", this.maxLength);
  impliedSiblings = this.minLengthNode ? this.maxLengthNode ? [this.minLengthNode, this.maxLengthNode] : [this.minLengthNode] : this.maxLengthNode ? [this.maxLengthNode] : [];
  defaultValueMorphs = getDefaultableMorphs(this);
  defaultValueMorphsReference = this.defaultValueMorphs.length ? registeredReference(this.defaultValueMorphs) : void 0;
  elementAtIndex(data, index) {
    if (index < this.prevariadic.length)
      return this.tuple[index];
    const firstPostfixIndex = data.length - this.postfixLength;
    if (index >= firstPostfixIndex)
      return { kind: "postfix", node: this.postfix[index - firstPostfixIndex] };
    return {
      kind: "variadic",
      node: this.variadic ?? throwInternalError(`Unexpected attempt to access index ${index} on ${this}`)
    };
  }
  // minLength/maxLength should be checked by Intersection before either traversal
  traverseAllows = (data, ctx) => {
    for (let i2 = 0; i2 < data.length; i2++) {
      if (!this.elementAtIndex(data, i2).node.traverseAllows(data[i2], ctx))
        return false;
    }
    return true;
  };
  traverseApply = (data, ctx) => {
    let i2 = 0;
    for (; i2 < data.length; i2++) {
      traverseKey(i2, () => this.elementAtIndex(data, i2).node.traverseApply(data[i2], ctx), ctx);
    }
  };
  get element() {
    return this.cacheGetter("element", this.$.node("union", this.children));
  }
  // minLength/maxLength compilation should be handled by Intersection
  compile(js) {
    if (this.prefix) {
      for (const [i2, node2] of this.prefix.entries())
        js.traverseKey(`${i2}`, `data[${i2}]`, node2);
    }
    for (const [i2, node2] of this.defaultablesAndOptionals.entries()) {
      const dataIndex = `${i2 + this.prefixLength}`;
      js.if(`${dataIndex} >= data.length`, () => js.traversalKind === "Allows" ? js.return(true) : js.return());
      js.traverseKey(dataIndex, `data[${dataIndex}]`, node2);
    }
    if (this.variadic) {
      if (this.postfix) {
        js.const("firstPostfixIndex", `data.length${this.postfix ? `- ${this.postfix.length}` : ""}`);
      }
      js.for(`i < ${this.postfix ? "firstPostfixIndex" : "data.length"}`, () => js.traverseKey("i", "data[i]", this.variadic), this.prevariadic.length);
      if (this.postfix) {
        for (const [i2, node2] of this.postfix.entries()) {
          const keyExpression = `firstPostfixIndex + ${i2}`;
          js.traverseKey(keyExpression, `data[${keyExpression}]`, node2);
        }
      }
    }
    if (js.traversalKind === "Allows")
      js.return(true);
  }
  _transform(mapper, ctx) {
    ctx.path.push($ark.intrinsic.nonNegativeIntegerString.internal);
    const result = super._transform(mapper, ctx);
    ctx.path.pop();
    return result;
  }
  // this depends on tuple so needs to come after it
  expression = this.description;
  reduceJsonSchema(schema, ctx) {
    if (this.prevariadic.length) {
      schema.prefixItems = this.prevariadic.map((el) => {
        const valueSchema = el.node.toJsonSchemaRecurse(ctx);
        if (el.kind === "defaultables") {
          const value2 = typeof el.default === "function" ? el.default() : el.default;
          valueSchema.default = $ark.intrinsic.jsonData.allows(value2) ? value2 : ctx.fallback.defaultValue({
            code: "defaultValue",
            base: valueSchema,
            value: value2
          });
        }
        return valueSchema;
      });
    }
    if (this.minLength)
      schema.minItems = this.minLength;
    if (this.variadic) {
      const variadicSchema = Object.assign(schema, {
        items: this.variadic.toJsonSchemaRecurse(ctx)
      });
      if (this.maxLength)
        variadicSchema.maxItems = this.maxLength;
      if (this.postfix) {
        const elements = this.postfix.map((el) => el.toJsonSchemaRecurse(ctx));
        schema = ctx.fallback.arrayPostfix({
          code: "arrayPostfix",
          base: variadicSchema,
          elements
        });
      }
    } else {
      schema.items = false;
      delete schema.maxItems;
    }
    return schema;
  }
}
const defaultableMorphsCache$1 = {};
const getDefaultableMorphs = (node2) => {
  if (!node2.defaultables)
    return [];
  const morphs = [];
  let cacheKey = "[";
  const lastDefaultableIndex = node2.prefixLength + node2.defaultablesLength - 1;
  for (let i2 = node2.prefixLength; i2 <= lastDefaultableIndex; i2++) {
    const [elementNode, defaultValue] = node2.defaultables[i2 - node2.prefixLength];
    morphs.push(computeDefaultValueMorph(i2, elementNode, defaultValue));
    cacheKey += `${i2}: ${elementNode.id} = ${defaultValueSerializer(defaultValue)}, `;
  }
  cacheKey += "]";
  return defaultableMorphsCache$1[cacheKey] ??= morphs;
};
const Sequence = {
  implementation: implementation$1,
  Node: SequenceNode
};
const sequenceInnerToTuple = (inner) => {
  const tuple = [];
  if (inner.prefix)
    for (const node2 of inner.prefix)
      tuple.push({ kind: "prefix", node: node2 });
  if (inner.defaultables) {
    for (const [node2, defaultValue] of inner.defaultables)
      tuple.push({ kind: "defaultables", node: node2, default: defaultValue });
  }
  if (inner.optionals)
    for (const node2 of inner.optionals)
      tuple.push({ kind: "optionals", node: node2 });
  if (inner.variadic)
    tuple.push({ kind: "variadic", node: inner.variadic });
  if (inner.postfix)
    for (const node2 of inner.postfix)
      tuple.push({ kind: "postfix", node: node2 });
  return tuple;
};
const sequenceTupleToInner = (tuple) => tuple.reduce((result, element) => {
  if (element.kind === "variadic")
    result.variadic = element.node;
  else if (element.kind === "defaultables") {
    result.defaultables = append(result.defaultables, [
      [element.node, element.default]
    ]);
  } else
    result[element.kind] = append(result[element.kind], element.node);
  return result;
}, {});
const postfixAfterOptionalOrDefaultableMessage = "A postfix required element cannot follow an optional or defaultable element";
const postfixWithoutVariadicMessage = "A postfix element requires a variadic element";
const _intersectSequences = (s2) => {
  const [lHead, ...lTail] = s2.l;
  const [rHead, ...rTail] = s2.r;
  if (!lHead || !rHead)
    return s2;
  const lHasPostfix = lTail.at(-1)?.kind === "postfix";
  const rHasPostfix = rTail.at(-1)?.kind === "postfix";
  const kind = lHead.kind === "prefix" || rHead.kind === "prefix" ? "prefix" : lHead.kind === "postfix" || rHead.kind === "postfix" ? "postfix" : lHead.kind === "variadic" && rHead.kind === "variadic" ? "variadic" : lHasPostfix || rHasPostfix ? "prefix" : lHead.kind === "defaultables" || rHead.kind === "defaultables" ? "defaultables" : "optionals";
  if (lHead.kind === "prefix" && rHead.kind === "variadic" && rHasPostfix) {
    const postfixBranchResult = _intersectSequences({
      ...s2,
      fixedVariants: [],
      r: rTail.map((element) => ({ ...element, kind: "prefix" }))
    });
    if (postfixBranchResult.disjoint.length === 0)
      s2.fixedVariants.push(postfixBranchResult);
  } else if (rHead.kind === "prefix" && lHead.kind === "variadic" && lHasPostfix) {
    const postfixBranchResult = _intersectSequences({
      ...s2,
      fixedVariants: [],
      l: lTail.map((element) => ({ ...element, kind: "prefix" }))
    });
    if (postfixBranchResult.disjoint.length === 0)
      s2.fixedVariants.push(postfixBranchResult);
  }
  const result = intersectOrPipeNodes(lHead.node, rHead.node, s2.ctx);
  if (result instanceof Disjoint) {
    if (kind === "prefix" || kind === "postfix") {
      s2.disjoint.push(...result.withPrefixKey(
        // ideally we could handle disjoint paths more precisely here,
        // but not trivial to serialize postfix elements as keys
        kind === "prefix" ? s2.result.length : `-${lTail.length + 1}`,
        // both operands must be required for the disjoint to be considered required
        elementIsRequired(lHead) && elementIsRequired(rHead) ? "required" : "optional"
      ));
      s2.result = [...s2.result, { kind, node: $ark.intrinsic.never.internal }];
    } else if (kind === "optionals" || kind === "defaultables") {
      return s2;
    } else {
      return _intersectSequences({
        ...s2,
        fixedVariants: [],
        // if there were any optional elements, there will be no postfix elements
        // so this mapping will never occur (which would be illegal otherwise)
        l: lTail.map((element) => ({ ...element, kind: "prefix" })),
        r: lTail.map((element) => ({ ...element, kind: "prefix" }))
      });
    }
  } else if (kind === "defaultables") {
    if (lHead.kind === "defaultables" && rHead.kind === "defaultables" && lHead.default !== rHead.default) {
      throwParseError(writeDefaultIntersectionMessage(lHead.default, rHead.default));
    }
    s2.result = [
      ...s2.result,
      {
        kind,
        node: result,
        default: lHead.kind === "defaultables" ? lHead.default : rHead.kind === "defaultables" ? rHead.default : throwInternalError(`Unexpected defaultable intersection from ${lHead.kind} and ${rHead.kind} elements.`)
      }
    ];
  } else
    s2.result = [...s2.result, { kind, node: result }];
  const lRemaining = s2.l.length;
  const rRemaining = s2.r.length;
  if (lHead.kind !== "variadic" || lRemaining >= rRemaining && (rHead.kind === "variadic" || rRemaining === 1))
    s2.l = lTail;
  if (rHead.kind !== "variadic" || rRemaining >= lRemaining && (lHead.kind === "variadic" || lRemaining === 1))
    s2.r = rTail;
  return _intersectSequences(s2);
};
const elementIsRequired = (el) => el.kind === "prefix" || el.kind === "postfix";
const createStructuralWriter = (childStringProp) => (node2) => {
  if (node2.props.length || node2.index) {
    const parts = node2.index?.map((index) => index[childStringProp]) ?? [];
    for (const prop of node2.props)
      parts.push(prop[childStringProp]);
    if (node2.undeclared)
      parts.push(`+ (undeclared): ${node2.undeclared}`);
    const objectLiteralDescription = `{ ${parts.join(", ")} }`;
    return node2.sequence ? `${objectLiteralDescription} & ${node2.sequence.description}` : objectLiteralDescription;
  }
  return node2.sequence?.description ?? "{}";
};
const structuralDescription = createStructuralWriter("description");
const structuralExpression = createStructuralWriter("expression");
const intersectPropsAndIndex = (l2, r2, $) => {
  const kind = l2.required ? "required" : "optional";
  if (!r2.signature.allows(l2.key))
    return null;
  const value2 = intersectNodesRoot(l2.value, r2.value, $);
  if (value2 instanceof Disjoint) {
    return kind === "optional" ? $.node("optional", {
      key: l2.key,
      value: $ark.intrinsic.never.internal
    }) : value2.withPrefixKey(l2.key, l2.kind);
  }
  return null;
};
const implementation = implementNode({
  kind: "structure",
  hasAssociatedError: false,
  normalize: (schema) => schema,
  applyConfig: (schema, config) => {
    if (!schema.undeclared && config.onUndeclaredKey !== "ignore") {
      return {
        ...schema,
        undeclared: config.onUndeclaredKey
      };
    }
    return schema;
  },
  keys: {
    required: {
      child: true,
      parse: constraintKeyParser("required"),
      reduceIo: (ioKind, inner, nodes) => {
        inner.required = append(inner.required, nodes.map((node2) => ioKind === "in" ? node2.rawIn : node2.rawOut));
        return;
      }
    },
    optional: {
      child: true,
      parse: constraintKeyParser("optional"),
      reduceIo: (ioKind, inner, nodes) => {
        if (ioKind === "in") {
          inner.optional = nodes.map((node2) => node2.rawIn);
          return;
        }
        for (const node2 of nodes) {
          inner[node2.outProp.kind] = append(inner[node2.outProp.kind], node2.outProp.rawOut);
        }
      }
    },
    index: {
      child: true,
      parse: constraintKeyParser("index")
    },
    sequence: {
      child: true,
      parse: constraintKeyParser("sequence")
    },
    undeclared: {
      parse: (behavior) => behavior === "ignore" ? void 0 : behavior,
      reduceIo: (ioKind, inner, value2) => {
        if (value2 === "reject") {
          inner.undeclared = "reject";
          return;
        }
        if (ioKind === "in")
          delete inner.undeclared;
        else
          inner.undeclared = "reject";
      }
    }
  },
  defaults: {
    description: structuralDescription
  },
  intersections: {
    structure: (l2, r2, ctx) => {
      const lInner = { ...l2.inner };
      const rInner = { ...r2.inner };
      const disjointResult = new Disjoint();
      if (l2.undeclared) {
        const lKey = l2.keyof();
        for (const k of r2.requiredKeys) {
          if (!lKey.allows(k)) {
            disjointResult.add("presence", $ark.intrinsic.never.internal, r2.propsByKey[k].value, {
              path: [k]
            });
          }
        }
        if (rInner.optional)
          rInner.optional = rInner.optional.filter((n) => lKey.allows(n.key));
        if (rInner.index) {
          rInner.index = rInner.index.flatMap((n) => {
            if (n.signature.extends(lKey))
              return n;
            const indexOverlap = intersectNodesRoot(lKey, n.signature, ctx.$);
            if (indexOverlap instanceof Disjoint)
              return [];
            const normalized = normalizeIndex(indexOverlap, n.value, ctx.$);
            if (normalized.required) {
              rInner.required = conflatenate(rInner.required, normalized.required);
            }
            if (normalized.optional) {
              rInner.optional = conflatenate(rInner.optional, normalized.optional);
            }
            return normalized.index ?? [];
          });
        }
      }
      if (r2.undeclared) {
        const rKey = r2.keyof();
        for (const k of l2.requiredKeys) {
          if (!rKey.allows(k)) {
            disjointResult.add("presence", l2.propsByKey[k].value, $ark.intrinsic.never.internal, {
              path: [k]
            });
          }
        }
        if (lInner.optional)
          lInner.optional = lInner.optional.filter((n) => rKey.allows(n.key));
        if (lInner.index) {
          lInner.index = lInner.index.flatMap((n) => {
            if (n.signature.extends(rKey))
              return n;
            const indexOverlap = intersectNodesRoot(rKey, n.signature, ctx.$);
            if (indexOverlap instanceof Disjoint)
              return [];
            const normalized = normalizeIndex(indexOverlap, n.value, ctx.$);
            if (normalized.required) {
              lInner.required = conflatenate(lInner.required, normalized.required);
            }
            if (normalized.optional) {
              lInner.optional = conflatenate(lInner.optional, normalized.optional);
            }
            return normalized.index ?? [];
          });
        }
      }
      const baseInner = {};
      if (l2.undeclared || r2.undeclared) {
        baseInner.undeclared = l2.undeclared === "reject" || r2.undeclared === "reject" ? "reject" : "delete";
      }
      const childIntersectionResult = intersectConstraints({
        kind: "structure",
        baseInner,
        l: flattenConstraints(lInner),
        r: flattenConstraints(rInner),
        roots: [],
        ctx
      });
      if (childIntersectionResult instanceof Disjoint)
        disjointResult.push(...childIntersectionResult);
      if (disjointResult.length)
        return disjointResult;
      return childIntersectionResult;
    }
  },
  reduce: (inner, $) => {
    if (inner.index) {
      if (!(inner.required || inner.optional))
        return;
      let updated = false;
      const requiredProps = inner.required ?? [];
      const optionalProps = inner.optional ?? [];
      const newOptionalProps = [...optionalProps];
      for (const index of inner.index) {
        for (const requiredProp of requiredProps) {
          const intersection = intersectPropsAndIndex(requiredProp, index, $);
          if (intersection instanceof Disjoint)
            return intersection;
        }
        for (const [indx, optionalProp] of optionalProps.entries()) {
          const intersection = intersectPropsAndIndex(optionalProp, index, $);
          if (intersection instanceof Disjoint)
            return intersection;
          if (intersection === null)
            continue;
          newOptionalProps[indx] = intersection;
          updated = true;
        }
      }
      if (updated) {
        return $.node("structure", { ...inner, optional: newOptionalProps }, { prereduced: true });
      }
    }
  }
});
class StructureNode extends BaseConstraint {
  impliedBasis = $ark.intrinsic.object.internal;
  impliedSiblings = this.children.flatMap((n) => n.impliedSiblings ?? []);
  props = conflatenate(this.required, this.optional);
  propsByKey = flatMorph(this.props, (i2, node2) => [node2.key, node2]);
  propsByKeyReference = registeredReference(this.propsByKey);
  expression = structuralExpression(this);
  requiredKeys = this.required?.map((node2) => node2.key) ?? [];
  optionalKeys = this.optional?.map((node2) => node2.key) ?? [];
  literalKeys = [...this.requiredKeys, ...this.optionalKeys];
  _keyof;
  keyof() {
    if (this._keyof)
      return this._keyof;
    let branches = this.$.units(this.literalKeys).branches;
    if (this.index) {
      for (const { signature } of this.index)
        branches = branches.concat(signature.branches);
    }
    return this._keyof = this.$.node("union", branches);
  }
  map(flatMapProp) {
    return this.$.node("structure", this.props.flatMap(flatMapProp).reduce((structureInner, mapped) => {
      const originalProp = this.propsByKey[mapped.key];
      if (isNode(mapped)) {
        if (mapped.kind !== "required" && mapped.kind !== "optional") {
          return throwParseError(`Map result must have kind "required" or "optional" (was ${mapped.kind})`);
        }
        structureInner[mapped.kind] = append(structureInner[mapped.kind], mapped);
        return structureInner;
      }
      const mappedKind = mapped.kind ?? originalProp?.kind ?? "required";
      const mappedPropInner = flatMorph(mapped, (k, v) => k in Optional.implementation.keys ? [k, v] : []);
      structureInner[mappedKind] = append(structureInner[mappedKind], this.$.node(mappedKind, mappedPropInner));
      return structureInner;
    }, {}));
  }
  assertHasKeys(keys) {
    const invalidKeys = keys.filter((k) => !typeOrTermExtends(k, this.keyof()));
    if (invalidKeys.length) {
      return throwParseError(writeInvalidKeysMessage(this.expression, invalidKeys));
    }
  }
  get(indexer, ...path) {
    let value2;
    let required = false;
    const key = indexerToKey(indexer);
    if ((typeof key === "string" || typeof key === "symbol") && this.propsByKey[key]) {
      value2 = this.propsByKey[key].value;
      required = this.propsByKey[key].required;
    }
    if (this.index) {
      for (const n of this.index) {
        if (typeOrTermExtends(key, n.signature))
          value2 = value2?.and(n.value) ?? n.value;
      }
    }
    if (this.sequence && typeOrTermExtends(key, $ark.intrinsic.nonNegativeIntegerString)) {
      if (hasArkKind(key, "root")) {
        if (this.sequence.variadic)
          value2 = value2?.and(this.sequence.element) ?? this.sequence.element;
      } else {
        const index = Number.parseInt(key);
        if (index < this.sequence.prevariadic.length) {
          const fixedElement = this.sequence.prevariadic[index].node;
          value2 = value2?.and(fixedElement) ?? fixedElement;
          required ||= index < this.sequence.prefixLength;
        } else if (this.sequence.variadic) {
          const nonFixedElement = this.$.node("union", this.sequence.variadicOrPostfix);
          value2 = value2?.and(nonFixedElement) ?? nonFixedElement;
        }
      }
    }
    if (!value2) {
      if (this.sequence?.variadic && hasArkKind(key, "root") && key.extends($ark.intrinsic.number)) {
        return throwParseError(writeNumberIndexMessage(key.expression, this.sequence.expression));
      }
      return throwParseError(writeInvalidKeysMessage(this.expression, [key]));
    }
    const result = value2.get(...path);
    return required ? result : result.or($ark.intrinsic.undefined);
  }
  pick(...keys) {
    this.assertHasKeys(keys);
    return this.$.node("structure", this.filterKeys("pick", keys));
  }
  omit(...keys) {
    this.assertHasKeys(keys);
    return this.$.node("structure", this.filterKeys("omit", keys));
  }
  optionalize() {
    const { required, ...inner } = this.inner;
    return this.$.node("structure", {
      ...inner,
      optional: this.props.map((prop) => prop.hasKind("required") ? this.$.node("optional", prop.inner) : prop)
    });
  }
  require() {
    const { optional, ...inner } = this.inner;
    return this.$.node("structure", {
      ...inner,
      required: this.props.map((prop) => prop.hasKind("optional") ? {
        key: prop.key,
        value: prop.value
      } : prop)
    });
  }
  merge(r2) {
    const inner = this.filterKeys("omit", [r2.keyof()]);
    if (r2.required)
      inner.required = append(inner.required, r2.required);
    if (r2.optional)
      inner.optional = append(inner.optional, r2.optional);
    if (r2.index)
      inner.index = append(inner.index, r2.index);
    if (r2.sequence)
      inner.sequence = r2.sequence;
    if (r2.undeclared)
      inner.undeclared = r2.undeclared;
    else
      delete inner.undeclared;
    return this.$.node("structure", inner);
  }
  filterKeys(operation, keys) {
    const result = makeRootAndArrayPropertiesMutable(this.inner);
    const shouldKeep = (key) => {
      const matchesKey = keys.some((k) => typeOrTermExtends(key, k));
      return operation === "pick" ? matchesKey : !matchesKey;
    };
    if (result.required)
      result.required = result.required.filter((prop) => shouldKeep(prop.key));
    if (result.optional)
      result.optional = result.optional.filter((prop) => shouldKeep(prop.key));
    if (result.index)
      result.index = result.index.filter((index) => shouldKeep(index.signature));
    return result;
  }
  traverseAllows = (data, ctx) => this._traverse("Allows", data, ctx);
  traverseApply = (data, ctx) => this._traverse("Apply", data, ctx);
  _traverse = (traversalKind, data, ctx) => {
    const errorCount = ctx?.currentErrorCount ?? 0;
    for (let i2 = 0; i2 < this.props.length; i2++) {
      if (traversalKind === "Allows") {
        if (!this.props[i2].traverseAllows(data, ctx))
          return false;
      } else {
        this.props[i2].traverseApply(data, ctx);
        if (ctx.failFast && ctx.currentErrorCount > errorCount)
          return false;
      }
    }
    if (this.sequence) {
      if (traversalKind === "Allows") {
        if (!this.sequence.traverseAllows(data, ctx))
          return false;
      } else {
        this.sequence.traverseApply(data, ctx);
        if (ctx.failFast && ctx.currentErrorCount > errorCount)
          return false;
      }
    }
    if (this.index || this.undeclared === "reject") {
      const keys = Object.keys(data);
      keys.push(...Object.getOwnPropertySymbols(data));
      for (let i2 = 0; i2 < keys.length; i2++) {
        const k = keys[i2];
        if (this.index) {
          for (const node2 of this.index) {
            if (node2.signature.traverseAllows(k, ctx)) {
              if (traversalKind === "Allows") {
                const result = traverseKey(k, () => node2.value.traverseAllows(data[k], ctx), ctx);
                if (!result)
                  return false;
              } else {
                traverseKey(k, () => node2.value.traverseApply(data[k], ctx), ctx);
                if (ctx.failFast && ctx.currentErrorCount > errorCount)
                  return false;
              }
            }
          }
        }
        if (this.undeclared === "reject" && !this.declaresKey(k)) {
          if (traversalKind === "Allows")
            return false;
          ctx.errorFromNodeContext({
            code: "predicate",
            expected: "removed",
            actual: "",
            relativePath: [k],
            meta: this.meta
          });
          if (ctx.failFast)
            return false;
        }
      }
    }
    if (this.structuralMorph && ctx && !ctx.hasError())
      ctx.queueMorphs([this.structuralMorph]);
    return true;
  };
  get defaultable() {
    return this.cacheGetter("defaultable", this.optional?.filter((o2) => o2.hasDefault()) ?? []);
  }
  declaresKey = (k) => k in this.propsByKey || this.index?.some((n) => n.signature.allows(k)) || this.sequence !== void 0 && $ark.intrinsic.nonNegativeIntegerString.allows(k);
  _compileDeclaresKey(js) {
    const parts = [];
    if (this.props.length)
      parts.push(`k in ${this.propsByKeyReference}`);
    if (this.index) {
      for (const index of this.index)
        parts.push(js.invoke(index.signature, { kind: "Allows", arg: "k" }));
    }
    if (this.sequence)
      parts.push("$ark.intrinsic.nonNegativeIntegerString.allows(k)");
    return parts.join(" || ") || "false";
  }
  get structuralMorph() {
    return this.cacheGetter("structuralMorph", getPossibleMorph(this));
  }
  structuralMorphRef = this.structuralMorph && registeredReference(this.structuralMorph);
  compile(js) {
    if (js.traversalKind === "Apply")
      js.initializeErrorCount();
    for (const prop of this.props) {
      js.check(prop);
      if (js.traversalKind === "Apply")
        js.returnIfFailFast();
    }
    if (this.sequence) {
      js.check(this.sequence);
      if (js.traversalKind === "Apply")
        js.returnIfFailFast();
    }
    if (this.index || this.undeclared === "reject") {
      js.const("keys", "Object.keys(data)");
      js.line("keys.push(...Object.getOwnPropertySymbols(data))");
      js.for("i < keys.length", () => this.compileExhaustiveEntry(js));
    }
    if (js.traversalKind === "Allows")
      return js.return(true);
    if (this.structuralMorphRef) {
      js.if("ctx && !ctx.hasError()", () => {
        js.line(`ctx.queueMorphs([`);
        precompileMorphs(js, this);
        return js.line("])");
      });
    }
  }
  compileExhaustiveEntry(js) {
    js.const("k", "keys[i]");
    if (this.index) {
      for (const node2 of this.index) {
        js.if(`${js.invoke(node2.signature, { arg: "k", kind: "Allows" })}`, () => js.traverseKey("k", "data[k]", node2.value));
      }
    }
    if (this.undeclared === "reject") {
      js.if(`!(${this._compileDeclaresKey(js)})`, () => {
        if (js.traversalKind === "Allows")
          return js.return(false);
        return js.line(`ctx.errorFromNodeContext({ code: "predicate", expected: "removed", actual: "", relativePath: [k], meta: ${this.compiledMeta} })`).if("ctx.failFast", () => js.return());
      });
    }
    return js;
  }
  reduceJsonSchema(schema, ctx) {
    switch (schema.type) {
      case "object":
        return this.reduceObjectJsonSchema(schema, ctx);
      case "array":
        const arraySchema = this.sequence?.reduceJsonSchema(schema, ctx) ?? schema;
        if (this.props.length || this.index) {
          return ctx.fallback.arrayObject({
            code: "arrayObject",
            base: arraySchema,
            object: this.reduceObjectJsonSchema({ type: "object" }, ctx)
          });
        }
        return arraySchema;
      default:
        return ToJsonSchema.throwInternalOperandError("structure", schema);
    }
  }
  reduceObjectJsonSchema(schema, ctx) {
    if (this.props.length) {
      schema.properties = {};
      for (const prop of this.props) {
        const valueSchema = prop.value.toJsonSchemaRecurse(ctx);
        if (typeof prop.key === "symbol") {
          ctx.fallback.symbolKey({
            code: "symbolKey",
            base: schema,
            key: prop.key,
            value: valueSchema,
            optional: prop.optional
          });
          continue;
        }
        if (prop.hasDefault()) {
          const value2 = typeof prop.default === "function" ? prop.default() : prop.default;
          valueSchema.default = $ark.intrinsic.jsonData.allows(value2) ? value2 : ctx.fallback.defaultValue({
            code: "defaultValue",
            base: valueSchema,
            value: value2
          });
        }
        schema.properties[prop.key] = valueSchema;
      }
      if (this.requiredKeys.length && schema.properties) {
        schema.required = this.requiredKeys.filter((k) => typeof k === "string" && k in schema.properties);
      }
    }
    if (this.index) {
      for (const index of this.index) {
        const valueJsonSchema = index.value.toJsonSchemaRecurse(ctx);
        if (index.signature.equals($ark.intrinsic.string)) {
          schema.additionalProperties = valueJsonSchema;
          continue;
        }
        for (const keyBranch of index.signature.branches) {
          if (!keyBranch.extends($ark.intrinsic.string)) {
            schema = ctx.fallback.symbolKey({
              code: "symbolKey",
              base: schema,
              key: null,
              value: valueJsonSchema,
              optional: false
            });
            continue;
          }
          let keySchema = { type: "string" };
          if (keyBranch.hasKind("morph")) {
            keySchema = ctx.fallback.morph({
              code: "morph",
              base: keyBranch.rawIn.toJsonSchemaRecurse(ctx),
              out: keyBranch.rawOut.toJsonSchemaRecurse(ctx)
            });
          }
          if (!keyBranch.hasKind("intersection")) {
            return throwInternalError(`Unexpected index branch kind ${keyBranch.kind}.`);
          }
          const { pattern } = keyBranch.inner;
          if (pattern) {
            const keySchemaWithPattern = Object.assign(keySchema, {
              pattern: pattern[0].rule
            });
            for (let i2 = 1; i2 < pattern.length; i2++) {
              keySchema = ctx.fallback.patternIntersection({
                code: "patternIntersection",
                base: keySchemaWithPattern,
                pattern: pattern[i2].rule
              });
            }
            schema.patternProperties ??= {};
            schema.patternProperties[keySchemaWithPattern.pattern] = valueJsonSchema;
          }
        }
      }
    }
    if (this.undeclared && !schema.additionalProperties)
      schema.additionalProperties = false;
    return schema;
  }
}
const defaultableMorphsCache = {};
const constructStructuralMorphCacheKey = (node2) => {
  let cacheKey = "";
  for (let i2 = 0; i2 < node2.defaultable.length; i2++)
    cacheKey += node2.defaultable[i2].defaultValueMorphRef;
  if (node2.sequence?.defaultValueMorphsReference)
    cacheKey += node2.sequence?.defaultValueMorphsReference;
  if (node2.undeclared === "delete") {
    cacheKey += "delete !(";
    if (node2.required)
      for (const n of node2.required)
        cacheKey += n.compiledKey + " | ";
    if (node2.optional)
      for (const n of node2.optional)
        cacheKey += n.compiledKey + " | ";
    if (node2.index)
      for (const index of node2.index)
        cacheKey += index.signature.id + " | ";
    if (node2.sequence) {
      if (node2.sequence.maxLength === null)
        cacheKey += intrinsic.nonNegativeIntegerString.id;
      else {
        for (let i2 = 0; i2 < node2.sequence.tuple.length; i2++)
          cacheKey += i2 + " | ";
      }
    }
    cacheKey += ")";
  }
  return cacheKey;
};
const getPossibleMorph = (node2) => {
  const cacheKey = constructStructuralMorphCacheKey(node2);
  if (!cacheKey)
    return void 0;
  if (defaultableMorphsCache[cacheKey])
    return defaultableMorphsCache[cacheKey];
  const $arkStructuralMorph = (data, ctx) => {
    for (let i2 = 0; i2 < node2.defaultable.length; i2++) {
      if (!(node2.defaultable[i2].key in data))
        node2.defaultable[i2].defaultValueMorph(data, ctx);
    }
    if (node2.sequence?.defaultables) {
      for (let i2 = data.length - node2.sequence.prefixLength; i2 < node2.sequence.defaultables.length; i2++)
        node2.sequence.defaultValueMorphs[i2](data, ctx);
    }
    if (node2.undeclared === "delete") {
      for (const k in data)
        if (!node2.declaresKey(k))
          delete data[k];
    }
    return data;
  };
  return defaultableMorphsCache[cacheKey] = $arkStructuralMorph;
};
const precompileMorphs = (js, node2) => {
  const requiresContext = node2.defaultable.some((node3) => node3.defaultValueMorph.length === 2) || node2.sequence?.defaultValueMorphs.some((morph) => morph.length === 2);
  const args = `(data${requiresContext ? ", ctx" : ""})`;
  return js.block(`${args} => `, (js2) => {
    for (let i2 = 0; i2 < node2.defaultable.length; i2++) {
      const { serializedKey, defaultValueMorphRef } = node2.defaultable[i2];
      js2.if(`!(${serializedKey} in data)`, (js3) => js3.line(`${defaultValueMorphRef}${args}`));
    }
    if (node2.sequence?.defaultables) {
      js2.for(`i < ${node2.sequence.defaultables.length}`, (js3) => js3.set(`data[i]`, 5), `data.length - ${node2.sequence.prefixLength}`);
    }
    if (node2.undeclared === "delete") {
      js2.forIn("data", (js3) => js3.if(`!(${node2._compileDeclaresKey(js3)})`, (js4) => js4.line(`delete data[k]`)));
    }
    return js2.return("data");
  });
};
const Structure = {
  implementation,
  Node: StructureNode
};
const indexerToKey = (indexable) => {
  if (hasArkKind(indexable, "root") && indexable.hasKind("unit"))
    indexable = indexable.unit;
  if (typeof indexable === "number")
    indexable = `${indexable}`;
  return indexable;
};
const writeNumberIndexMessage = (indexExpression, sequenceExpression) => `${indexExpression} is not allowed as an array index on ${sequenceExpression}. Use the 'nonNegativeIntegerString' keyword instead.`;
const normalizeIndex = (signature, value2, $) => {
  const [enumerableBranches, nonEnumerableBranches] = spliterate(signature.branches, (k) => k.hasKind("unit"));
  if (!enumerableBranches.length)
    return { index: $.node("index", { signature, value: value2 }) };
  const normalized = {};
  for (const n of enumerableBranches) {
    const prop = $.node("required", { key: n.unit, value: value2 });
    normalized[prop.kind] = append(normalized[prop.kind], prop);
  }
  if (nonEnumerableBranches.length) {
    normalized.index = $.node("index", {
      signature: nonEnumerableBranches,
      value: value2
    });
  }
  return normalized;
};
const typeKeyToString = (k) => hasArkKind(k, "root") ? k.expression : printable(k);
const writeInvalidKeysMessage = (o2, keys) => `Key${keys.length === 1 ? "" : "s"} ${keys.map(typeKeyToString).join(", ")} ${keys.length === 1 ? "does" : "do"} not exist on ${o2}`;
const nodeImplementationsByKind = {
  ...boundImplementationsByKind,
  alias: Alias.implementation,
  domain: Domain.implementation,
  unit: Unit.implementation,
  proto: Proto.implementation,
  union: Union.implementation,
  morph: Morph.implementation,
  intersection: Intersection.implementation,
  divisor: Divisor.implementation,
  pattern: Pattern.implementation,
  predicate: Predicate.implementation,
  required: Required$1.implementation,
  optional: Optional.implementation,
  index: Index.implementation,
  sequence: Sequence.implementation,
  structure: Structure.implementation
};
$ark.defaultConfig = withAlphabetizedKeys(Object.assign(flatMorph(nodeImplementationsByKind, (kind, implementation2) => [
  kind,
  implementation2.defaults
]), {
  jitless: envHasCsp(),
  clone: deepClone,
  onUndeclaredKey: "ignore",
  exactOptionalPropertyTypes: true,
  numberAllowsNaN: false,
  dateAllowsInvalid: false,
  onFail: null,
  keywords: {},
  toJsonSchema: ToJsonSchema.defaultConfig
}));
$ark.resolvedConfig = mergeConfigs($ark.defaultConfig, $ark.config);
const nodeClassesByKind = {
  ...boundClassesByKind,
  alias: Alias.Node,
  domain: Domain.Node,
  unit: Unit.Node,
  proto: Proto.Node,
  union: Union.Node,
  morph: Morph.Node,
  intersection: Intersection.Node,
  divisor: Divisor.Node,
  pattern: Pattern.Node,
  predicate: Predicate.Node,
  required: Required$1.Node,
  optional: Optional.Node,
  index: Index.Node,
  sequence: Sequence.Node,
  structure: Structure.Node
};
class RootModule extends DynamicBase {
  // ensure `[arkKind]` is non-enumerable so it doesn't get spread on import/export
  get [arkKind]() {
    return "module";
  }
}
const bindModule = (module, $) => new RootModule(flatMorph(module, (alias, value2) => [
  alias,
  hasArkKind(value2, "module") ? bindModule(value2, $) : $.bindReference(value2)
]));
const schemaBranchesOf = (schema) => isArray(schema) ? schema : "branches" in schema && isArray(schema.branches) ? schema.branches : void 0;
const throwMismatchedNodeRootError = (expected, actual) => throwParseError(`Node of kind ${actual} is not valid as a ${expected} definition`);
const writeDuplicateAliasError = (alias) => `#${alias} duplicates public alias ${alias}`;
const scopesByName = {};
$ark.ambient ??= {};
let rawUnknownUnion;
const rootScopeFnName = "function $";
const precompile = (references) => bindPrecompilation(references, precompileReferences(references));
const bindPrecompilation = (references, precompiler) => {
  const precompilation = precompiler.write(rootScopeFnName, 4);
  const compiledTraversals = precompiler.compile()();
  for (const node2 of references) {
    if (node2.precompilation) {
      continue;
    }
    node2.traverseAllows = compiledTraversals[`${node2.id}Allows`].bind(compiledTraversals);
    if (node2.isRoot() && !node2.allowsRequiresContext) {
      node2.allows = node2.traverseAllows;
    }
    node2.traverseApply = compiledTraversals[`${node2.id}Apply`].bind(compiledTraversals);
    if (compiledTraversals[`${node2.id}Optimistic`]) {
      node2.traverseOptimistic = compiledTraversals[`${node2.id}Optimistic`].bind(compiledTraversals);
    }
    node2.precompilation = precompilation;
  }
};
const precompileReferences = (references) => new CompiledFunction().return(references.reduce((js, node2) => {
  const allowsCompiler = new NodeCompiler({ kind: "Allows" }).indent();
  node2.compile(allowsCompiler);
  const allowsJs = allowsCompiler.write(`${node2.id}Allows`);
  const applyCompiler = new NodeCompiler({ kind: "Apply" }).indent();
  node2.compile(applyCompiler);
  const applyJs = applyCompiler.write(`${node2.id}Apply`);
  const result = `${js}${allowsJs},
${applyJs},
`;
  if (!node2.hasKind("union"))
    return result;
  const optimisticCompiler = new NodeCompiler({
    kind: "Allows",
    optimistic: true
  }).indent();
  node2.compile(optimisticCompiler);
  const optimisticJs = optimisticCompiler.write(`${node2.id}Optimistic`);
  return `${result}${optimisticJs},
`;
}, "{\n") + "}");
class BaseScope {
  config;
  resolvedConfig;
  name;
  get [arkKind]() {
    return "scope";
  }
  referencesById = {};
  references = [];
  resolutions = {};
  exportedNames = [];
  aliases = {};
  resolved = false;
  nodesByHash = {};
  intrinsic;
  constructor(def, config) {
    this.config = mergeConfigs($ark.config, config);
    this.resolvedConfig = mergeConfigs($ark.resolvedConfig, config);
    this.name = this.resolvedConfig.name ?? `anonymousScope${Object.keys(scopesByName).length}`;
    if (this.name in scopesByName)
      throwParseError(`A Scope already named ${this.name} already exists`);
    scopesByName[this.name] = this;
    const aliasEntries = Object.entries(def).map((entry) => this.preparseOwnAliasEntry(...entry));
    for (const [k, v] of aliasEntries) {
      let name = k;
      if (k[0] === "#") {
        name = k.slice(1);
        if (name in this.aliases)
          throwParseError(writeDuplicateAliasError(name));
        this.aliases[name] = v;
      } else {
        if (name in this.aliases)
          throwParseError(writeDuplicateAliasError(k));
        this.aliases[name] = v;
        this.exportedNames.push(name);
      }
      if (!hasArkKind(v, "module") && !hasArkKind(v, "generic") && !isThunk(v)) {
        const preparsed = this.preparseOwnDefinitionFormat(v, { alias: name });
        this.resolutions[name] = hasArkKind(preparsed, "root") ? this.bindReference(preparsed) : this.createParseContext(preparsed).id;
      }
    }
    rawUnknownUnion ??= this.node("union", {
      branches: [
        "string",
        "number",
        "object",
        "bigint",
        "symbol",
        { unit: true },
        { unit: false },
        { unit: void 0 },
        { unit: null }
      ]
    }, { prereduced: true });
    this.nodesByHash[rawUnknownUnion.hash] = this.node("intersection", {}, { prereduced: true });
    this.intrinsic = $ark.intrinsic ? flatMorph($ark.intrinsic, (k, v) => (
      // don't include cyclic aliases from JSON scope
      k.startsWith("json") ? [] : [k, this.bindReference(v)]
    )) : {};
  }
  cacheGetter(name, value2) {
    Object.defineProperty(this, name, { value: value2 });
    return value2;
  }
  get internal() {
    return this;
  }
  // json is populated when the scope is exported, so ensure it is populated
  // before allowing external access
  _json;
  get json() {
    if (!this._json)
      this.export();
    return this._json;
  }
  defineSchema(def) {
    return def;
  }
  generic = (...params) => {
    const $ = this;
    return (def, possibleHkt) => new GenericRoot(params, possibleHkt ? new LazyGenericBody(def) : def, $, $, possibleHkt ?? null);
  };
  units = (values, opts) => {
    const uniqueValues = [];
    for (const value2 of values)
      if (!uniqueValues.includes(value2))
        uniqueValues.push(value2);
    const branches = uniqueValues.map((unit) => this.node("unit", { unit }, opts));
    return this.node("union", branches, {
      ...opts,
      prereduced: true
    });
  };
  lazyResolutions = [];
  lazilyResolve(resolve, syntheticAlias) {
    const node2 = this.node("alias", {
      reference: syntheticAlias ?? "synthetic",
      resolve
    }, { prereduced: true });
    if (!this.resolved)
      this.lazyResolutions.push(node2);
    return node2;
  }
  schema = (schema, opts) => this.finalize(this.parseSchema(schema, opts));
  parseSchema = (schema, opts) => this.node(schemaKindOf(schema), schema, opts);
  preparseNode(kinds, schema, opts) {
    let kind = typeof kinds === "string" ? kinds : schemaKindOf(schema, kinds);
    if (isNode(schema) && schema.kind === kind)
      return schema;
    if (kind === "alias" && !opts?.prereduced) {
      const { reference: reference2 } = Alias.implementation.normalize(schema, this);
      if (reference2.startsWith("$")) {
        const resolution = this.resolveRoot(reference2.slice(1));
        schema = resolution;
        kind = resolution.kind;
      }
    } else if (kind === "union" && hasDomain(schema, "object")) {
      const branches = schemaBranchesOf(schema);
      if (branches?.length === 1) {
        schema = branches[0];
        kind = schemaKindOf(schema);
      }
    }
    if (isNode(schema) && schema.kind === kind)
      return schema;
    const impl = nodeImplementationsByKind[kind];
    const normalizedSchema = impl.normalize?.(schema, this) ?? schema;
    if (isNode(normalizedSchema)) {
      return normalizedSchema.kind === kind ? normalizedSchema : throwMismatchedNodeRootError(kind, normalizedSchema.kind);
    }
    return {
      ...opts,
      $: this,
      kind,
      def: normalizedSchema,
      prefix: opts.alias ?? kind
    };
  }
  bindReference(reference2) {
    let bound;
    if (isNode(reference2)) {
      bound = reference2.$ === this ? reference2 : new reference2.constructor(reference2.attachments, this);
    } else {
      bound = reference2.$ === this ? reference2 : new GenericRoot(reference2.params, reference2.bodyDef, reference2.$, this, reference2.hkt);
    }
    if (!this.resolved) {
      Object.assign(this.referencesById, bound.referencesById);
    }
    return bound;
  }
  resolveRoot(name) {
    return this.maybeResolveRoot(name) ?? throwParseError(writeUnresolvableMessage(name));
  }
  maybeResolveRoot(name) {
    const result = this.maybeResolve(name);
    if (hasArkKind(result, "generic"))
      return;
    return result;
  }
  /** If name is a valid reference to a submodule alias, return its resolution  */
  maybeResolveSubalias(name) {
    return maybeResolveSubalias(this.aliases, name) ?? maybeResolveSubalias(this.ambient, name);
  }
  get ambient() {
    return $ark.ambient;
  }
  maybeResolve(name) {
    const cached2 = this.resolutions[name];
    if (cached2) {
      if (typeof cached2 !== "string")
        return this.bindReference(cached2);
      const v = nodesByRegisteredId[cached2];
      if (hasArkKind(v, "root"))
        return this.resolutions[name] = v;
      if (hasArkKind(v, "context")) {
        if (v.phase === "resolving") {
          return this.node("alias", { reference: `$${name}` }, { prereduced: true });
        }
        if (v.phase === "resolved") {
          return throwInternalError(`Unexpected resolved context for was uncached by its scope: ${printable(v)}`);
        }
        v.phase = "resolving";
        const node2 = this.bindReference(this.parseOwnDefinitionFormat(v.def, v));
        v.phase = "resolved";
        nodesByRegisteredId[node2.id] = node2;
        nodesByRegisteredId[v.id] = node2;
        return this.resolutions[name] = node2;
      }
      return throwInternalError(`Unexpected nodesById entry for ${cached2}: ${printable(v)}`);
    }
    let def = this.aliases[name] ?? this.ambient?.[name];
    if (!def)
      return this.maybeResolveSubalias(name);
    def = this.normalizeRootScopeValue(def);
    if (hasArkKind(def, "generic"))
      return this.resolutions[name] = this.bindReference(def);
    if (hasArkKind(def, "module")) {
      if (!def.root)
        throwParseError(writeMissingSubmoduleAccessMessage(name));
      return this.resolutions[name] = this.bindReference(def.root);
    }
    return this.resolutions[name] = this.parse(def, {
      alias: name
    });
  }
  createParseContext(input) {
    const id2 = input.id ?? registerNodeId(input.prefix);
    return nodesByRegisteredId[id2] = Object.assign(input, {
      [arkKind]: "context",
      $: this,
      id: id2,
      phase: "unresolved"
    });
  }
  traversal(root) {
    return new Traversal(root, this.resolvedConfig);
  }
  import(...names) {
    return new RootModule(flatMorph(this.export(...names), (alias, value2) => [
      `#${alias}`,
      value2
    ]));
  }
  precompilation;
  _exportedResolutions;
  _exports;
  export(...names) {
    if (!this._exports) {
      this._exports = {};
      for (const name of this.exportedNames) {
        const def = this.aliases[name];
        this._exports[name] = hasArkKind(def, "module") ? bindModule(def, this) : bootstrapAliasReferences(this.maybeResolve(name));
      }
      for (const node2 of this.lazyResolutions)
        node2.resolution;
      this._exportedResolutions = resolutionsOfModule(this, this._exports);
      this._json = resolutionsToJson(this._exportedResolutions);
      Object.assign(this.resolutions, this._exportedResolutions);
      this.references = Object.values(this.referencesById);
      if (!this.resolvedConfig.jitless) {
        const precompiler = precompileReferences(this.references);
        this.precompilation = precompiler.write(rootScopeFnName, 4);
        bindPrecompilation(this.references, precompiler);
      }
      this.resolved = true;
    }
    const namesToExport = names.length ? names : this.exportedNames;
    return new RootModule(flatMorph(namesToExport, (_, name) => [
      name,
      this._exports[name]
    ]));
  }
  resolve(name) {
    return this.export()[name];
  }
  node = (kinds, nodeSchema, opts = {}) => {
    const ctxOrNode = this.preparseNode(kinds, nodeSchema, opts);
    if (isNode(ctxOrNode))
      return this.bindReference(ctxOrNode);
    const ctx = this.createParseContext(ctxOrNode);
    const node2 = parseNode(ctx);
    const bound = this.bindReference(node2);
    return nodesByRegisteredId[ctx.id] = bound;
  };
  parse = (def, opts = {}) => this.finalize(this.parseDefinition(def, opts));
  parseDefinition(def, opts = {}) {
    if (hasArkKind(def, "root"))
      return this.bindReference(def);
    const ctxInputOrNode = this.preparseOwnDefinitionFormat(def, opts);
    if (hasArkKind(ctxInputOrNode, "root"))
      return this.bindReference(ctxInputOrNode);
    const ctx = this.createParseContext(ctxInputOrNode);
    nodesByRegisteredId[ctx.id] = ctx;
    let node2 = this.bindReference(this.parseOwnDefinitionFormat(def, ctx));
    if (node2.isCyclic)
      node2 = withId(node2, ctx.id);
    nodesByRegisteredId[ctx.id] = node2;
    return node2;
  }
  finalize(node2) {
    bootstrapAliasReferences(node2);
    if (!node2.precompilation && !this.resolvedConfig.jitless)
      precompile(node2.references);
    return node2;
  }
}
class SchemaScope extends BaseScope {
  parseOwnDefinitionFormat(def, ctx) {
    return parseNode(ctx);
  }
  preparseOwnDefinitionFormat(schema, opts) {
    return this.preparseNode(schemaKindOf(schema), schema, opts);
  }
  preparseOwnAliasEntry(k, v) {
    return [k, v];
  }
  normalizeRootScopeValue(v) {
    return v;
  }
}
const bootstrapAliasReferences = (resolution) => {
  const aliases = resolution.references.filter((node2) => node2.hasKind("alias"));
  for (const aliasNode of aliases) {
    Object.assign(aliasNode.referencesById, aliasNode.resolution.referencesById);
    for (const ref of resolution.references) {
      if (aliasNode.id in ref.referencesById)
        Object.assign(ref.referencesById, aliasNode.referencesById);
    }
  }
  return resolution;
};
const resolutionsToJson = (resolutions) => flatMorph(resolutions, (k, v) => [
  k,
  hasArkKind(v, "root") || hasArkKind(v, "generic") ? v.json : hasArkKind(v, "module") ? resolutionsToJson(v) : throwInternalError(`Unexpected resolution ${printable(v)}`)
]);
const maybeResolveSubalias = (base, name) => {
  const dotIndex = name.indexOf(".");
  if (dotIndex === -1)
    return;
  const dotPrefix = name.slice(0, dotIndex);
  const prefixSchema = base[dotPrefix];
  if (prefixSchema === void 0)
    return;
  if (!hasArkKind(prefixSchema, "module"))
    return throwParseError(writeNonSubmoduleDotMessage(dotPrefix));
  const subalias = name.slice(dotIndex + 1);
  const resolution = prefixSchema[subalias];
  if (resolution === void 0)
    return maybeResolveSubalias(prefixSchema, subalias);
  if (hasArkKind(resolution, "root") || hasArkKind(resolution, "generic"))
    return resolution;
  if (hasArkKind(resolution, "module")) {
    return resolution.root ?? throwParseError(writeMissingSubmoduleAccessMessage(name));
  }
  throwInternalError(`Unexpected resolution for alias '${name}': ${printable(resolution)}`);
};
const schemaScope = (aliases, config) => new SchemaScope(aliases, config);
const rootSchemaScope = new SchemaScope({});
const resolutionsOfModule = ($, typeSet) => {
  const result = {};
  for (const k in typeSet) {
    const v = typeSet[k];
    if (hasArkKind(v, "module")) {
      const innerResolutions = resolutionsOfModule($, v);
      const prefixedResolutions = flatMorph(innerResolutions, (innerK, innerV) => [`${k}.${innerK}`, innerV]);
      Object.assign(result, prefixedResolutions);
    } else if (hasArkKind(v, "root") || hasArkKind(v, "generic"))
      result[k] = v;
    else
      throwInternalError(`Unexpected scope resolution ${printable(v)}`);
  }
  return result;
};
const writeUnresolvableMessage = (token) => `'${token}' is unresolvable`;
const writeNonSubmoduleDotMessage = (name) => `'${name}' must reference a module to be accessed using dot syntax`;
const writeMissingSubmoduleAccessMessage = (name) => `Reference to submodule '${name}' must specify an alias`;
rootSchemaScope.export();
const rootSchema = rootSchemaScope.schema;
const node = rootSchemaScope.node;
rootSchemaScope.defineSchema;
const genericNode = rootSchemaScope.generic;
const arrayIndexSource = `^(?:0|[1-9]\\d*)$`;
const arrayIndexMatcher = new RegExp(arrayIndexSource);
registeredReference(arrayIndexMatcher);
const intrinsicBases = schemaScope({
  bigint: "bigint",
  // since we know this won't be reduced, it can be safely cast to a union
  boolean: [{ unit: false }, { unit: true }],
  false: { unit: false },
  never: [],
  null: { unit: null },
  number: "number",
  object: "object",
  string: "string",
  symbol: "symbol",
  true: { unit: true },
  unknown: {},
  undefined: { unit: void 0 },
  Array,
  Date
}, { prereducedAliases: true }).export();
$ark.intrinsic = { ...intrinsicBases };
const intrinsicRoots = schemaScope({
  integer: {
    domain: "number",
    divisor: 1
  },
  lengthBoundable: ["string", Array],
  key: ["string", "symbol"],
  nonNegativeIntegerString: { domain: "string", pattern: arrayIndexSource }
}, { prereducedAliases: true }).export();
Object.assign($ark.intrinsic, intrinsicRoots);
const intrinsicJson = schemaScope({
  jsonPrimitive: [
    "string",
    "number",
    { unit: true },
    { unit: false },
    { unit: null }
  ],
  jsonObject: {
    domain: "object",
    index: {
      signature: "string",
      value: "$jsonData"
    }
  },
  jsonData: ["$jsonPrimitive", "$jsonObject"]
}, { prereducedAliases: true }).export();
const intrinsic = {
  ...intrinsicBases,
  ...intrinsicRoots,
  ...intrinsicJson,
  emptyStructure: node("structure", {}, { prereduced: true })
};
$ark.intrinsic = { ...intrinsic };
const isDateLiteral = (value2) => typeof value2 === "string" && value2[0] === "d" && (value2[1] === "'" || value2[1] === '"') && value2.at(-1) === value2[1];
const isValidDate = (d2) => d2.toString() !== "Invalid Date";
const extractDateLiteralSource = (literal) => literal.slice(2, -1);
const writeInvalidDateMessage = (source) => `'${source}' could not be parsed by the Date constructor`;
const tryParseDate = (source, errorOnFail) => maybeParseDate(source, errorOnFail);
const maybeParseDate = (source, errorOnFail) => {
  const stringParsedDate = new Date(source);
  if (isValidDate(stringParsedDate))
    return stringParsedDate;
  const epochMillis = tryParseNumber(source);
  if (epochMillis !== void 0) {
    const numberParsedDate = new Date(epochMillis);
    if (isValidDate(numberParsedDate))
      return numberParsedDate;
  }
  return errorOnFail ? throwParseError(errorOnFail === true ? writeInvalidDateMessage(source) : errorOnFail) : void 0;
};
const parseEnclosed = (s2, enclosing) => {
  const enclosed = s2.scanner.shiftUntilEscapable(untilLookaheadIsClosing[enclosingTokens[enclosing]]);
  if (s2.scanner.lookahead === "")
    return s2.error(writeUnterminatedEnclosedMessage(enclosed, enclosing));
  s2.scanner.shift();
  if (enclosing === "/") {
    try {
      new RegExp(enclosed);
    } catch (e) {
      throwParseError(String(e));
    }
    s2.root = s2.ctx.$.node("intersection", {
      domain: "string",
      pattern: enclosed
    }, { prereduced: true });
  } else if (isKeyOf(enclosing, enclosingQuote))
    s2.root = s2.ctx.$.node("unit", { unit: enclosed });
  else {
    const date = tryParseDate(enclosed, writeInvalidDateMessage(enclosed));
    s2.root = s2.ctx.$.node("unit", { meta: enclosed, unit: date });
  }
};
const enclosingQuote = {
  "'": 1,
  '"': 1
};
const enclosingChar = {
  "/": 1,
  "'": 1,
  '"': 1
};
const enclosingLiteralTokens = {
  "d'": "'",
  'd"': '"',
  "'": "'",
  '"': '"'
};
const enclosingTokens = {
  ...enclosingLiteralTokens,
  "/": "/"
};
const untilLookaheadIsClosing = {
  "'": (scanner) => scanner.lookahead === `'`,
  '"': (scanner) => scanner.lookahead === `"`,
  "/": (scanner) => scanner.lookahead === `/`
};
const enclosingCharDescriptions = {
  '"': "double-quote",
  "'": "single-quote",
  "/": "forward slash"
};
const writeUnterminatedEnclosedMessage = (fragment, enclosingStart) => `${enclosingStart}${fragment} requires a closing ${enclosingCharDescriptions[enclosingTokens[enclosingStart]]}`;
const writePrefixedPrivateReferenceMessage = (name) => `Private type references should not include '#'. Use '${name}' instead.`;
const shallowOptionalMessage = "Optional definitions like 'string?' are only valid as properties in an object or tuple";
const shallowDefaultableMessage = "Defaultable definitions like 'number = 0' are only valid as properties in an object or tuple";
const terminatingChars = {
  "<": 1,
  ">": 1,
  "=": 1,
  "|": 1,
  "&": 1,
  ")": 1,
  "[": 1,
  "%": 1,
  ",": 1,
  ":": 1,
  "?": 1,
  "#": 1,
  ...whitespaceChars
};
const lookaheadIsFinalizing = (lookahead, unscanned) => lookahead === ">" ? unscanned[0] === "=" ? (
  // >== would only occur in an expression like Array<number>==5
  // otherwise, >= would only occur as part of a bound like number>=5
  unscanned[1] === "="
) : unscanned.trimStart() === "" || isKeyOf(unscanned.trimStart()[0], terminatingChars) : lookahead === "=" ? unscanned[0] !== "=" : lookahead === "," || lookahead === "?";
const parseGenericArgs = (name, g, s2) => _parseGenericArgs(name, g, s2, []);
const _parseGenericArgs = (name, g, s2, argNodes) => {
  const argState = s2.parseUntilFinalizer();
  argNodes.push(argState.root);
  if (argState.finalizer === ">") {
    if (argNodes.length !== g.params.length) {
      return s2.error(writeInvalidGenericArgCountMessage(name, g.names, argNodes.map((arg) => arg.expression)));
    }
    return argNodes;
  }
  if (argState.finalizer === ",")
    return _parseGenericArgs(name, g, s2, argNodes);
  return argState.error(writeUnclosedGroupMessage(">"));
};
const writeInvalidGenericArgCountMessage = (name, params, argDefs) => `${name}<${params.join(", ")}> requires exactly ${params.length} args (got ${argDefs.length}${argDefs.length === 0 ? "" : `: ${argDefs.join(", ")}`})`;
const parseUnenclosed = (s2) => {
  const token = s2.scanner.shiftUntilLookahead(terminatingChars);
  if (token === "keyof")
    s2.addPrefix("keyof");
  else
    s2.root = unenclosedToNode(s2, token);
};
const parseGenericInstantiation = (name, g, s2) => {
  s2.scanner.shiftUntilNonWhitespace();
  const lookahead = s2.scanner.shift();
  if (lookahead !== "<")
    return s2.error(writeInvalidGenericArgCountMessage(name, g.names, []));
  const parsedArgs = parseGenericArgs(name, g, s2);
  return g(...parsedArgs);
};
const unenclosedToNode = (s2, token) => maybeParseReference(s2, token) ?? maybeParseUnenclosedLiteral(s2, token) ?? s2.error(token === "" ? s2.scanner.lookahead === "#" ? writePrefixedPrivateReferenceMessage(s2.shiftedByOne().scanner.shiftUntilLookahead(terminatingChars)) : writeMissingOperandMessage(s2) : writeUnresolvableMessage(token));
const maybeParseReference = (s2, token) => {
  if (s2.ctx.args?.[token]) {
    const arg = s2.ctx.args[token];
    if (typeof arg !== "string")
      return arg;
    return s2.ctx.$.node("alias", { reference: arg }, { prereduced: true });
  }
  const resolution = s2.ctx.$.maybeResolve(token);
  if (hasArkKind(resolution, "root"))
    return resolution;
  if (resolution === void 0)
    return;
  if (hasArkKind(resolution, "generic"))
    return parseGenericInstantiation(token, resolution, s2);
  return throwParseError(`Unexpected resolution ${printable(resolution)}`);
};
const maybeParseUnenclosedLiteral = (s2, token) => {
  const maybeNumber = tryParseWellFormedNumber(token);
  if (maybeNumber !== void 0)
    return s2.ctx.$.node("unit", { unit: maybeNumber });
  const maybeBigint = tryParseWellFormedBigint(token);
  if (maybeBigint !== void 0)
    return s2.ctx.$.node("unit", { unit: maybeBigint });
};
const writeMissingOperandMessage = (s2) => {
  const operator = s2.previousOperator();
  return operator ? writeMissingRightOperandMessage(operator, s2.scanner.unscanned) : writeExpressionExpectedMessage(s2.scanner.unscanned);
};
const writeMissingRightOperandMessage = (token, unscanned = "") => `Token '${token}' requires a right operand${unscanned ? ` before '${unscanned}'` : ""}`;
const writeExpressionExpectedMessage = (unscanned) => `Expected an expression${unscanned ? ` before '${unscanned}'` : ""}`;
const parseOperand = (s2) => s2.scanner.lookahead === "" ? s2.error(writeMissingOperandMessage(s2)) : s2.scanner.lookahead === "(" ? s2.shiftedByOne().reduceGroupOpen() : s2.scanner.lookaheadIsIn(enclosingChar) ? parseEnclosed(s2, s2.scanner.shift()) : s2.scanner.lookaheadIsIn(whitespaceChars) ? parseOperand(s2.shiftedByOne()) : s2.scanner.lookahead === "d" ? s2.scanner.nextLookahead in enclosingQuote ? parseEnclosed(s2, `${s2.scanner.shift()}${s2.scanner.shift()}`) : parseUnenclosed(s2) : parseUnenclosed(s2);
const minComparators = {
  ">": true,
  ">=": true
};
const maxComparators = {
  "<": true,
  "<=": true
};
const invertedComparators = {
  "<": ">",
  ">": "<",
  "<=": ">=",
  ">=": "<=",
  "==": "=="
};
const writeOpenRangeMessage = (min, comparator) => `Left bounds are only valid when paired with right bounds (try ...${comparator}${min})`;
const writeUnpairableComparatorMessage = (comparator) => `Left-bounded expressions must specify their limits using < or <= (was ${comparator})`;
const writeMultipleLeftBoundsMessage = (openLimit, openComparator, limit, comparator) => `An expression may have at most one left bound (parsed ${openLimit}${invertedComparators[openComparator]}, ${limit}${invertedComparators[comparator]})`;
const parseBound = (s2, start) => {
  const comparator = shiftComparator(s2, start);
  if (s2.root.hasKind("unit")) {
    if (typeof s2.root.unit === "number") {
      s2.reduceLeftBound(s2.root.unit, comparator);
      s2.unsetRoot();
      return;
    }
    if (s2.root.unit instanceof Date) {
      const literal = `d'${s2.root.description ?? s2.root.unit.toISOString()}'`;
      s2.unsetRoot();
      s2.reduceLeftBound(literal, comparator);
      return;
    }
  }
  return parseRightBound(s2, comparator);
};
const comparatorStartChars = {
  "<": 1,
  ">": 1,
  "=": 1
};
const shiftComparator = (s2, start) => s2.scanner.lookaheadIs("=") ? `${start}${s2.scanner.shift()}` : start;
const getBoundKinds = (comparator, limit, root, boundKind) => {
  if (root.extends($ark.intrinsic.number)) {
    if (typeof limit !== "number") {
      return throwParseError(writeInvalidLimitMessage(comparator, limit, boundKind));
    }
    return comparator === "==" ? ["min", "max"] : comparator[0] === ">" ? ["min"] : ["max"];
  }
  if (root.extends($ark.intrinsic.lengthBoundable)) {
    if (typeof limit !== "number") {
      return throwParseError(writeInvalidLimitMessage(comparator, limit, boundKind));
    }
    return comparator === "==" ? ["exactLength"] : comparator[0] === ">" ? ["minLength"] : ["maxLength"];
  }
  if (root.extends($ark.intrinsic.Date)) {
    return comparator === "==" ? ["after", "before"] : comparator[0] === ">" ? ["after"] : ["before"];
  }
  return throwParseError(writeUnboundableMessage(root.expression));
};
const openLeftBoundToRoot = (leftBound) => ({
  rule: isDateLiteral(leftBound.limit) ? extractDateLiteralSource(leftBound.limit) : leftBound.limit,
  exclusive: leftBound.comparator.length === 1
});
const parseRightBound = (s2, comparator) => {
  const previousRoot = s2.unsetRoot();
  const previousScannerIndex = s2.scanner.location;
  s2.parseOperand();
  const limitNode = s2.unsetRoot();
  const limitToken = s2.scanner.sliceChars(previousScannerIndex, s2.scanner.location);
  s2.root = previousRoot;
  if (!limitNode.hasKind("unit") || typeof limitNode.unit !== "number" && !(limitNode.unit instanceof Date))
    return s2.error(writeInvalidLimitMessage(comparator, limitToken, "right"));
  const limit = limitNode.unit;
  const exclusive = comparator.length === 1;
  const boundKinds = getBoundKinds(comparator, typeof limit === "number" ? limit : limitToken, previousRoot, "right");
  for (const kind of boundKinds) {
    s2.constrainRoot(kind, comparator === "==" ? { rule: limit } : { rule: limit, exclusive });
  }
  if (!s2.branches.leftBound)
    return;
  if (!isKeyOf(comparator, maxComparators))
    return s2.error(writeUnpairableComparatorMessage(comparator));
  const lowerBoundKind = getBoundKinds(s2.branches.leftBound.comparator, s2.branches.leftBound.limit, previousRoot, "left");
  s2.constrainRoot(lowerBoundKind[0], openLeftBoundToRoot(s2.branches.leftBound));
  s2.branches.leftBound = null;
};
const writeInvalidLimitMessage = (comparator, limit, boundKind) => `Comparator ${boundKind === "left" ? invertedComparators[comparator] : comparator} must be ${boundKind === "left" ? "preceded" : "followed"} by a corresponding literal (was ${limit})`;
const parseBrand = (s2) => {
  s2.scanner.shiftUntilNonWhitespace();
  const brandName = s2.scanner.shiftUntilLookahead(terminatingChars);
  s2.root = s2.root.brand(brandName);
};
const parseDivisor = (s2) => {
  s2.scanner.shiftUntilNonWhitespace();
  const divisorToken = s2.scanner.shiftUntilLookahead(terminatingChars);
  const divisor = tryParseInteger(divisorToken, {
    errorOnFail: writeInvalidDivisorMessage(divisorToken)
  });
  if (divisor === 0)
    s2.error(writeInvalidDivisorMessage(0));
  s2.root = s2.root.constrain("divisor", divisor);
};
const writeInvalidDivisorMessage = (divisor) => `% operator must be followed by a non-zero integer literal (was ${divisor})`;
const parseOperator = (s2) => {
  const lookahead = s2.scanner.shift();
  return lookahead === "" ? s2.finalize("") : lookahead === "[" ? s2.scanner.shift() === "]" ? s2.setRoot(s2.root.array()) : s2.error(incompleteArrayTokenMessage) : lookahead === "|" ? s2.scanner.lookahead === ">" ? s2.shiftedByOne().pushRootToBranch("|>") : s2.pushRootToBranch(lookahead) : lookahead === "&" ? s2.pushRootToBranch(lookahead) : lookahead === ")" ? s2.finalizeGroup() : lookaheadIsFinalizing(lookahead, s2.scanner.unscanned) ? s2.finalize(lookahead) : isKeyOf(lookahead, comparatorStartChars) ? parseBound(s2, lookahead) : lookahead === "%" ? parseDivisor(s2) : lookahead === "#" ? parseBrand(s2) : lookahead in whitespaceChars ? parseOperator(s2) : s2.error(writeUnexpectedCharacterMessage(lookahead));
};
const writeUnexpectedCharacterMessage = (char, shouldBe = "") => `'${char}' is not allowed here${shouldBe && ` (should be ${shouldBe})`}`;
const incompleteArrayTokenMessage = `Missing expected ']'`;
const parseDefault = (s2) => {
  const baseNode = s2.unsetRoot();
  s2.parseOperand();
  const defaultNode = s2.unsetRoot();
  if (!defaultNode.hasKind("unit"))
    return s2.error(writeNonLiteralDefaultMessage(defaultNode.expression));
  const defaultValue = defaultNode.unit instanceof Date ? () => new Date(defaultNode.unit) : defaultNode.unit;
  return [baseNode, "=", defaultValue];
};
const writeNonLiteralDefaultMessage = (defaultDef) => `Default value '${defaultDef}' must be a literal value`;
const parseString = (def, ctx) => {
  const aliasResolution = ctx.$.maybeResolveRoot(def);
  if (aliasResolution)
    return aliasResolution;
  if (def.endsWith("[]")) {
    const possibleElementResolution = ctx.$.maybeResolveRoot(def.slice(0, -2));
    if (possibleElementResolution)
      return possibleElementResolution.array();
  }
  const s2 = new RuntimeState(new Scanner(def), ctx);
  const node2 = fullStringParse(s2);
  if (s2.finalizer === ">")
    throwParseError(writeUnexpectedCharacterMessage(">"));
  return node2;
};
const fullStringParse = (s2) => {
  s2.parseOperand();
  let result = parseUntilFinalizer(s2).root;
  if (!result) {
    return throwInternalError(`Root was unexpectedly unset after parsing string '${s2.scanner.scanned}'`);
  }
  if (s2.finalizer === "=")
    result = parseDefault(s2);
  else if (s2.finalizer === "?")
    result = [result, "?"];
  s2.scanner.shiftUntilNonWhitespace();
  if (s2.scanner.lookahead) {
    throwParseError(writeUnexpectedCharacterMessage(s2.scanner.lookahead));
  }
  return result;
};
const parseUntilFinalizer = (s2) => {
  while (s2.finalizer === void 0)
    next(s2);
  return s2;
};
const next = (s2) => s2.hasRoot() ? s2.parseOperator() : s2.parseOperand();
class RuntimeState {
  root;
  branches = {
    prefixes: [],
    leftBound: null,
    intersection: null,
    union: null,
    pipe: null
  };
  finalizer;
  groups = [];
  scanner;
  ctx;
  constructor(scanner, ctx) {
    this.scanner = scanner;
    this.ctx = ctx;
  }
  error(message) {
    return throwParseError(message);
  }
  hasRoot() {
    return this.root !== void 0;
  }
  setRoot(root) {
    this.root = root;
  }
  unsetRoot() {
    const value2 = this.root;
    this.root = void 0;
    return value2;
  }
  constrainRoot(...args) {
    this.root = this.root.constrain(args[0], args[1]);
  }
  finalize(finalizer) {
    if (this.groups.length)
      return this.error(writeUnclosedGroupMessage(")"));
    this.finalizeBranches();
    this.finalizer = finalizer;
  }
  reduceLeftBound(limit, comparator) {
    const invertedComparator = invertedComparators[comparator];
    if (!isKeyOf(invertedComparator, minComparators))
      return this.error(writeUnpairableComparatorMessage(comparator));
    if (this.branches.leftBound) {
      return this.error(writeMultipleLeftBoundsMessage(this.branches.leftBound.limit, this.branches.leftBound.comparator, limit, invertedComparator));
    }
    this.branches.leftBound = {
      comparator: invertedComparator,
      limit
    };
  }
  finalizeBranches() {
    this.assertRangeUnset();
    if (this.branches.pipe) {
      this.pushRootToBranch("|>");
      this.root = this.branches.pipe;
      return;
    }
    if (this.branches.union) {
      this.pushRootToBranch("|");
      this.root = this.branches.union;
      return;
    }
    if (this.branches.intersection) {
      this.pushRootToBranch("&");
      this.root = this.branches.intersection;
      return;
    }
    this.applyPrefixes();
  }
  finalizeGroup() {
    this.finalizeBranches();
    const topBranchState = this.groups.pop();
    if (!topBranchState) {
      return this.error(writeUnmatchedGroupCloseMessage(")", this.scanner.unscanned));
    }
    this.branches = topBranchState;
  }
  addPrefix(prefix2) {
    this.branches.prefixes.push(prefix2);
  }
  applyPrefixes() {
    while (this.branches.prefixes.length) {
      const lastPrefix = this.branches.prefixes.pop();
      this.root = lastPrefix === "keyof" ? this.root.keyof() : throwInternalError(`Unexpected prefix '${lastPrefix}'`);
    }
  }
  pushRootToBranch(token) {
    this.assertRangeUnset();
    this.applyPrefixes();
    const root = this.root;
    this.root = void 0;
    this.branches.intersection = this.branches.intersection?.rawAnd(root) ?? root;
    if (token === "&")
      return;
    this.branches.union = this.branches.union?.rawOr(this.branches.intersection) ?? this.branches.intersection;
    this.branches.intersection = null;
    if (token === "|")
      return;
    this.branches.pipe = this.branches.pipe?.rawPipeOnce(this.branches.union) ?? this.branches.union;
    this.branches.union = null;
  }
  parseUntilFinalizer() {
    return parseUntilFinalizer(new RuntimeState(this.scanner, this.ctx));
  }
  parseOperator() {
    return parseOperator(this);
  }
  parseOperand() {
    return parseOperand(this);
  }
  assertRangeUnset() {
    if (this.branches.leftBound) {
      return this.error(writeOpenRangeMessage(this.branches.leftBound.limit, this.branches.leftBound.comparator));
    }
  }
  reduceGroupOpen() {
    this.groups.push(this.branches);
    this.branches = {
      prefixes: [],
      leftBound: null,
      union: null,
      intersection: null,
      pipe: null
    };
  }
  previousOperator() {
    return this.branches.leftBound?.comparator ?? this.branches.prefixes.at(-1) ?? (this.branches.intersection ? "&" : this.branches.union ? "|" : this.branches.pipe ? "|>" : void 0);
  }
  shiftedByOne() {
    this.scanner.shift();
    return this;
  }
}
const emptyGenericParameterMessage = "An empty string is not a valid generic parameter name";
const parseGenericParamName = (scanner, result, ctx) => {
  scanner.shiftUntilNonWhitespace();
  const name = scanner.shiftUntilLookahead(terminatingChars);
  if (name === "") {
    if (scanner.lookahead === "" && result.length)
      return result;
    return throwParseError(emptyGenericParameterMessage);
  }
  scanner.shiftUntilNonWhitespace();
  return _parseOptionalConstraint(scanner, name, result, ctx);
};
const extendsToken = "extends ";
const _parseOptionalConstraint = (scanner, name, result, ctx) => {
  scanner.shiftUntilNonWhitespace();
  if (scanner.unscanned.startsWith(extendsToken))
    scanner.jumpForward(extendsToken.length);
  else {
    if (scanner.lookahead === ",")
      scanner.shift();
    result.push(name);
    return parseGenericParamName(scanner, result, ctx);
  }
  const s2 = parseUntilFinalizer(new RuntimeState(scanner, ctx));
  result.push([name, s2.root]);
  return parseGenericParamName(scanner, result, ctx);
};
class InternalFnParser extends Callable {
  constructor($) {
    const attach = {
      $,
      raw: $.fn
    };
    super((...signature) => {
      const returnOperatorIndex = signature.indexOf(":");
      const lastParamIndex = returnOperatorIndex === -1 ? signature.length - 1 : returnOperatorIndex - 1;
      const paramDefs = signature.slice(0, lastParamIndex + 1);
      const paramTuple = $.parse(paramDefs).assertHasKind("intersection");
      let returnType = $.intrinsic.unknown;
      if (returnOperatorIndex !== -1) {
        if (returnOperatorIndex !== signature.length - 2)
          return throwParseError(badFnReturnTypeMessage);
        returnType = $.parse(signature[returnOperatorIndex + 1]);
      }
      return (impl) => new InternalTypedFn(impl, paramTuple, returnType);
    }, { attach });
  }
}
class InternalTypedFn extends Callable {
  raw;
  params;
  returns;
  expression;
  constructor(raw, params, returns) {
    const typedName = `typed ${raw.name}`;
    const typed = {
      // assign to a key with the expected name to force it to be created that way
      [typedName]: (...args) => {
        const validatedArgs = params.assert(args);
        const returned = raw(...validatedArgs);
        return returns.assert(returned);
      }
    }[typedName];
    super(typed);
    this.raw = raw;
    this.params = params;
    this.returns = returns;
    let argsExpression = params.expression;
    if (argsExpression[0] === "[" && argsExpression.at(-1) === "]")
      argsExpression = argsExpression.slice(1, -1);
    else if (argsExpression.endsWith("[]"))
      argsExpression = `...${argsExpression}`;
    this.expression = `(${argsExpression}) => ${returns?.expression ?? "unknown"}`;
  }
}
const badFnReturnTypeMessage = `":" must be followed by exactly one return type e.g:
fn("string", ":", "number")(s => s.length)`;
class InternalMatchParser extends Callable {
  $;
  constructor($) {
    super((...args) => new InternalChainedMatchParser($)(...args), {
      bind: $
    });
    this.$ = $;
  }
  in(def) {
    return new InternalChainedMatchParser(this.$, def === void 0 ? void 0 : this.$.parse(def));
  }
  at(key, cases) {
    return new InternalChainedMatchParser(this.$).at(key, cases);
  }
  case(when, then) {
    return new InternalChainedMatchParser(this.$).case(when, then);
  }
}
class InternalChainedMatchParser extends Callable {
  $;
  in;
  key;
  branches = [];
  constructor($, In) {
    super((cases) => this.caseEntries(Object.entries(cases).map(([k, v]) => k === "default" ? [k, v] : [this.$.parse(k), v])));
    this.$ = $;
    this.in = In;
  }
  at(key, cases) {
    if (this.key)
      throwParseError(doubleAtMessage);
    if (this.branches.length)
      throwParseError(chainedAtMessage);
    this.key = key;
    return cases ? this.match(cases) : this;
  }
  case(def, resolver) {
    return this.caseEntry(this.$.parse(def), resolver);
  }
  caseEntry(node2, resolver) {
    const wrappableNode = this.key ? this.$.parse({ [this.key]: node2 }) : node2;
    const branch = wrappableNode.pipe(resolver);
    this.branches.push(branch);
    return this;
  }
  match(cases) {
    return this(cases);
  }
  strings(cases) {
    return this.caseEntries(Object.entries(cases).map(([k, v]) => k === "default" ? [k, v] : [this.$.node("unit", { unit: k }), v]));
  }
  caseEntries(entries) {
    for (let i2 = 0; i2 < entries.length; i2++) {
      const [k, v] = entries[i2];
      if (k === "default") {
        if (i2 !== entries.length - 1) {
          throwParseError(`default may only be specified as the last key of a switch definition`);
        }
        return this.default(v);
      }
      if (typeof v !== "function") {
        return throwParseError(`Value for case "${k}" must be a function (was ${domainOf(v)})`);
      }
      this.caseEntry(k, v);
    }
    return this;
  }
  default(defaultCase) {
    if (typeof defaultCase === "function")
      this.case(intrinsic.unknown, defaultCase);
    const schema = {
      branches: this.branches,
      ordered: true
    };
    if (defaultCase === "never" || defaultCase === "assert")
      schema.meta = { onFail: throwOnDefault };
    const cases = this.$.node("union", schema);
    if (!this.in)
      return this.$.finalize(cases);
    let inputValidatedCases = this.in.pipe(cases);
    if (defaultCase === "never" || defaultCase === "assert") {
      inputValidatedCases = inputValidatedCases.configureReferences({
        onFail: throwOnDefault
      }, "self");
    }
    return this.$.finalize(inputValidatedCases);
  }
}
const throwOnDefault = (errors) => errors.throw();
const chainedAtMessage = `A key matcher must be specified before the first case i.e. match.at('foo') or match.in<object>().at('bar')`;
const doubleAtMessage = `At most one key matcher may be specified per expression`;
const parseProperty = (def, ctx) => {
  if (isArray(def)) {
    if (def[1] === "=")
      return [ctx.$.parseOwnDefinitionFormat(def[0], ctx), "=", def[2]];
    if (def[1] === "?")
      return [ctx.$.parseOwnDefinitionFormat(def[0], ctx), "?"];
  }
  return parseInnerDefinition(def, ctx);
};
const invalidOptionalKeyKindMessage = `Only required keys may make their values optional, e.g. { [mySymbol]: ['number', '?'] }`;
const invalidDefaultableKeyKindMessage = `Only required keys may specify default values, e.g. { value: 'number = 0' }`;
const parseObjectLiteral = (def, ctx) => {
  let spread;
  const structure = {};
  const defEntries = stringAndSymbolicEntriesOf(def);
  for (const [k, v] of defEntries) {
    const parsedKey = preparseKey(k);
    if (parsedKey.kind === "spread") {
      if (!isEmptyObject(structure))
        return throwParseError(nonLeadingSpreadError);
      const operand = ctx.$.parseOwnDefinitionFormat(v, ctx);
      if (operand.equals(intrinsic.object))
        continue;
      if (!operand.hasKind("intersection") || // still error on attempts to spread proto nodes like ...Date
      !operand.basis?.equals(intrinsic.object)) {
        return throwParseError(writeInvalidSpreadTypeMessage(operand.expression));
      }
      spread = operand.structure;
      continue;
    }
    if (parsedKey.kind === "undeclared") {
      if (v !== "reject" && v !== "delete" && v !== "ignore")
        throwParseError(writeInvalidUndeclaredBehaviorMessage(v));
      structure.undeclared = v;
      continue;
    }
    const parsedValue = parseProperty(v, ctx);
    const parsedEntryKey = parsedKey;
    if (parsedKey.kind === "required") {
      if (!isArray(parsedValue)) {
        appendNamedProp(structure, "required", {
          key: parsedKey.normalized,
          value: parsedValue
        }, ctx);
      } else {
        appendNamedProp(structure, "optional", parsedValue[1] === "=" ? {
          key: parsedKey.normalized,
          value: parsedValue[0],
          default: parsedValue[2]
        } : {
          key: parsedKey.normalized,
          value: parsedValue[0]
        }, ctx);
      }
      continue;
    }
    if (isArray(parsedValue)) {
      if (parsedValue[1] === "?")
        throwParseError(invalidOptionalKeyKindMessage);
      if (parsedValue[1] === "=")
        throwParseError(invalidDefaultableKeyKindMessage);
    }
    if (parsedKey.kind === "optional") {
      appendNamedProp(structure, "optional", {
        key: parsedKey.normalized,
        value: parsedValue
      }, ctx);
      continue;
    }
    const signature = ctx.$.parseOwnDefinitionFormat(parsedEntryKey.normalized, ctx);
    const normalized = normalizeIndex(signature, parsedValue, ctx.$);
    if (normalized.index)
      structure.index = append(structure.index, normalized.index);
    if (normalized.required)
      structure.required = append(structure.required, normalized.required);
  }
  const structureNode = ctx.$.node("structure", structure);
  return ctx.$.parseSchema({
    domain: "object",
    structure: spread?.merge(structureNode) ?? structureNode
  });
};
const appendNamedProp = (structure, kind, inner, ctx) => {
  structure[kind] = append(
    // doesn't seem like this cast should be necessary
    structure[kind],
    ctx.$.node(kind, inner)
  );
};
const writeInvalidUndeclaredBehaviorMessage = (actual) => `Value of '+' key must be 'reject', 'delete', or 'ignore' (was ${printable(actual)})`;
const nonLeadingSpreadError = "Spread operator may only be used as the first key in an object";
const preparseKey = (key) => typeof key === "symbol" ? { kind: "required", normalized: key } : key.at(-1) === "?" ? key.at(-2) === Backslash ? { kind: "required", normalized: `${key.slice(0, -2)}?` } : {
  kind: "optional",
  normalized: key.slice(0, -1)
} : key[0] === "[" && key.at(-1) === "]" ? { kind: "index", normalized: key.slice(1, -1) } : key[0] === Backslash && key[1] === "[" && key.at(-1) === "]" ? { kind: "required", normalized: key.slice(1) } : key === "..." ? { kind: "spread" } : key === "+" ? { kind: "undeclared" } : {
  kind: "required",
  normalized: key === "\\..." ? "..." : key === "\\+" ? "+" : key
};
const writeInvalidSpreadTypeMessage = (def) => `Spread operand must resolve to an object literal type (was ${def})`;
const maybeParseTupleExpression = (def, ctx) => isIndexZeroExpression(def) ? indexZeroParsers[def[0]](def, ctx) : isIndexOneExpression(def) ? indexOneParsers[def[1]](def, ctx) : null;
const parseKeyOfTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[1], ctx).keyof();
const parseBranchTuple = (def, ctx) => {
  if (def[2] === void 0)
    return throwParseError(writeMissingRightOperandMessage(def[1], ""));
  const l2 = ctx.$.parseOwnDefinitionFormat(def[0], ctx);
  const r2 = ctx.$.parseOwnDefinitionFormat(def[2], ctx);
  if (def[1] === "|")
    return ctx.$.node("union", { branches: [l2, r2] });
  const result = def[1] === "&" ? intersectNodesRoot(l2, r2, ctx.$) : pipeNodesRoot(l2, r2, ctx.$);
  if (result instanceof Disjoint)
    return result.throw();
  return result;
};
const parseArrayTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[0], ctx).array();
const parseMorphTuple = (def, ctx) => {
  if (typeof def[2] !== "function") {
    return throwParseError(writeMalformedFunctionalExpressionMessage("=>", def[2]));
  }
  return ctx.$.parseOwnDefinitionFormat(def[0], ctx).pipe(def[2]);
};
const writeMalformedFunctionalExpressionMessage = (operator, value2) => `${operator === ":" ? "Narrow" : "Morph"} expression requires a function following '${operator}' (was ${typeof value2})`;
const parseNarrowTuple = (def, ctx) => {
  if (typeof def[2] !== "function") {
    return throwParseError(writeMalformedFunctionalExpressionMessage(":", def[2]));
  }
  return ctx.$.parseOwnDefinitionFormat(def[0], ctx).constrain("predicate", def[2]);
};
const parseMetaTuple = (def, ctx) => ctx.$.parseOwnDefinitionFormat(def[0], ctx).configure(def[2], def[3]);
const defineIndexOneParsers = (parsers) => parsers;
const postfixParsers = defineIndexOneParsers({
  "[]": parseArrayTuple,
  "?": () => throwParseError(shallowOptionalMessage)
});
const infixParsers = defineIndexOneParsers({
  "|": parseBranchTuple,
  "&": parseBranchTuple,
  ":": parseNarrowTuple,
  "=>": parseMorphTuple,
  "|>": parseBranchTuple,
  "@": parseMetaTuple,
  // since object and tuple literals parse there via `parseProperty`,
  // they must be shallow if parsed directly as a tuple expression
  "=": () => throwParseError(shallowDefaultableMessage)
});
const indexOneParsers = { ...postfixParsers, ...infixParsers };
const isIndexOneExpression = (def) => indexOneParsers[def[1]] !== void 0;
const defineIndexZeroParsers = (parsers) => parsers;
const indexZeroParsers = defineIndexZeroParsers({
  keyof: parseKeyOfTuple,
  instanceof: (def, ctx) => {
    if (typeof def[1] !== "function") {
      return throwParseError(writeInvalidConstructorMessage(objectKindOrDomainOf(def[1])));
    }
    const branches = def.slice(1).map((ctor) => typeof ctor === "function" ? ctx.$.node("proto", { proto: ctor }) : throwParseError(writeInvalidConstructorMessage(objectKindOrDomainOf(ctor))));
    return branches.length === 1 ? branches[0] : ctx.$.node("union", { branches });
  },
  "===": (def, ctx) => ctx.$.units(def.slice(1))
});
const isIndexZeroExpression = (def) => indexZeroParsers[def[0]] !== void 0;
const writeInvalidConstructorMessage = (actual) => `Expected a constructor following 'instanceof' operator (was ${actual})`;
const parseTupleLiteral = (def, ctx) => {
  let sequences = [{}];
  let i2 = 0;
  while (i2 < def.length) {
    let spread = false;
    if (def[i2] === "..." && i2 < def.length - 1) {
      spread = true;
      i2++;
    }
    const parsedProperty = parseProperty(def[i2], ctx);
    const [valueNode, operator, possibleDefaultValue] = !isArray(parsedProperty) ? [parsedProperty] : parsedProperty;
    i2++;
    if (spread) {
      if (!valueNode.extends($ark.intrinsic.Array))
        return throwParseError(writeNonArraySpreadMessage(valueNode.expression));
      sequences = sequences.flatMap((base) => (
        // since appendElement mutates base, we have to shallow-ish clone it for each branch
        valueNode.distribute((branch) => appendSpreadBranch(makeRootAndArrayPropertiesMutable(base), branch))
      ));
    } else {
      sequences = sequences.map((base) => {
        if (operator === "?")
          return appendOptionalElement(base, valueNode);
        if (operator === "=")
          return appendDefaultableElement(base, valueNode, possibleDefaultValue);
        return appendRequiredElement(base, valueNode);
      });
    }
  }
  return ctx.$.parseSchema(sequences.map((sequence) => isEmptyObject(sequence) ? {
    proto: Array,
    exactLength: 0
  } : {
    proto: Array,
    sequence
  }));
};
const appendRequiredElement = (base, element) => {
  if (base.defaultables || base.optionals) {
    return throwParseError(base.variadic ? (
      // e.g. [boolean = true, ...string[], number]
      postfixAfterOptionalOrDefaultableMessage
    ) : requiredPostOptionalMessage);
  }
  if (base.variadic) {
    base.postfix = append(base.postfix, element);
  } else {
    base.prefix = append(base.prefix, element);
  }
  return base;
};
const appendOptionalElement = (base, element) => {
  if (base.variadic)
    return throwParseError(optionalOrDefaultableAfterVariadicMessage);
  base.optionals = append(base.optionals, element);
  return base;
};
const appendDefaultableElement = (base, element, value2) => {
  if (base.variadic)
    return throwParseError(optionalOrDefaultableAfterVariadicMessage);
  if (base.optionals)
    return throwParseError(defaultablePostOptionalMessage);
  base.defaultables = append(base.defaultables, [[element, value2]]);
  return base;
};
const appendVariadicElement = (base, element) => {
  if (base.postfix)
    throwParseError(multipleVariadicMesage);
  if (base.variadic) {
    if (!base.variadic.equals(element)) {
      throwParseError(multipleVariadicMesage);
    }
  } else {
    base.variadic = element.internal;
  }
  return base;
};
const appendSpreadBranch = (base, branch) => {
  const spread = branch.select({ method: "find", kind: "sequence" });
  if (!spread) {
    return appendVariadicElement(base, $ark.intrinsic.unknown);
  }
  if (spread.prefix)
    for (const node2 of spread.prefix)
      appendRequiredElement(base, node2);
  if (spread.optionals)
    for (const node2 of spread.optionals)
      appendOptionalElement(base, node2);
  if (spread.variadic)
    appendVariadicElement(base, spread.variadic);
  if (spread.postfix)
    for (const node2 of spread.postfix)
      appendRequiredElement(base, node2);
  return base;
};
const writeNonArraySpreadMessage = (operand) => `Spread element must be an array (was ${operand})`;
const multipleVariadicMesage = "A tuple may have at most one variadic element";
const requiredPostOptionalMessage = "A required element may not follow an optional element";
const optionalOrDefaultableAfterVariadicMessage = "An optional element may not follow a variadic element";
const defaultablePostOptionalMessage = "A defaultable element may not follow an optional element without a default";
const parseCache = {};
const parseInnerDefinition = (def, ctx) => {
  if (typeof def === "string") {
    if (ctx.args && Object.keys(ctx.args).some((k) => def.includes(k))) {
      return parseString(def, ctx);
    }
    const scopeCache = parseCache[ctx.$.name] ??= {};
    return scopeCache[def] ??= parseString(def, ctx);
  }
  return hasDomain(def, "object") ? parseObject(def, ctx) : throwParseError(writeBadDefinitionTypeMessage(domainOf(def)));
};
const parseObject = (def, ctx) => {
  const objectKind = objectKindOf(def);
  switch (objectKind) {
    case void 0:
      if (hasArkKind(def, "root"))
        return def;
      return parseObjectLiteral(def, ctx);
    case "Array":
      return parseTuple(def, ctx);
    case "RegExp":
      return ctx.$.node("intersection", {
        domain: "string",
        pattern: def
      }, { prereduced: true });
    case "Function": {
      const resolvedDef = isThunk(def) ? def() : def;
      if (hasArkKind(resolvedDef, "root"))
        return resolvedDef;
      return throwParseError(writeBadDefinitionTypeMessage("Function"));
    }
    default:
      return throwParseError(writeBadDefinitionTypeMessage(objectKind ?? printable(def)));
  }
};
const parseTuple = (def, ctx) => maybeParseTupleExpression(def, ctx) ?? parseTupleLiteral(def, ctx);
const writeBadDefinitionTypeMessage = (actual) => `Type definitions must be strings or objects (was ${actual})`;
class InternalTypeParser extends Callable {
  constructor($) {
    const attach = Object.assign(
      {
        errors: ArkErrors,
        hkt: Hkt,
        $,
        raw: $.parse,
        module: $.constructor.module,
        scope: $.constructor.scope,
        declare: $.declare,
        define: $.define,
        match: $.match,
        generic: $.generic,
        schema: $.schema,
        // this won't be defined during bootstrapping, but externally always will be
        keywords: $.ambient,
        unit: $.unit,
        enumerated: $.enumerated,
        instanceOf: $.instanceOf,
        valueOf: $.valueOf,
        or: $.or,
        and: $.and,
        merge: $.merge,
        pipe: $.pipe,
        fn: $.fn
      },
      // also won't be defined during bootstrapping
      $.ambientAttachments
    );
    super((...args) => {
      if (args.length === 1) {
        return $.parse(args[0]);
      }
      if (args.length === 2 && typeof args[0] === "string" && args[0][0] === "<" && args[0].at(-1) === ">") {
        const paramString = args[0].slice(1, -1);
        const params = $.parseGenericParams(paramString, {});
        return new GenericRoot(params, args[1], $, $, null);
      }
      return $.parse(args);
    }, {
      attach
    });
  }
}
const $arkTypeRegistry = $ark;
class InternalScope extends BaseScope {
  get ambientAttachments() {
    if (!$arkTypeRegistry.typeAttachments)
      return;
    return this.cacheGetter("ambientAttachments", flatMorph($arkTypeRegistry.typeAttachments, (k, v) => [
      k,
      this.bindReference(v)
    ]));
  }
  preparseOwnAliasEntry(alias, def) {
    const firstParamIndex = alias.indexOf("<");
    if (firstParamIndex === -1) {
      if (hasArkKind(def, "module") || hasArkKind(def, "generic"))
        return [alias, def];
      const qualifiedName = this.name === "ark" ? alias : alias === "root" ? this.name : `${this.name}.${alias}`;
      const config = this.resolvedConfig.keywords?.[qualifiedName];
      if (config)
        def = [def, "@", config];
      return [alias, def];
    }
    if (alias.at(-1) !== ">") {
      throwParseError(`'>' must be the last character of a generic declaration in a scope`);
    }
    const name = alias.slice(0, firstParamIndex);
    const paramString = alias.slice(firstParamIndex + 1, -1);
    return [
      name,
      // use a thunk definition for the generic so that we can parse
      // constraints within the current scope
      () => {
        const params = this.parseGenericParams(paramString, { alias: name });
        const generic = parseGeneric(params, def, this);
        return generic;
      }
    ];
  }
  parseGenericParams(def, opts) {
    return parseGenericParamName(new Scanner(def), [], this.createParseContext({
      ...opts,
      def,
      prefix: "generic"
    }));
  }
  normalizeRootScopeValue(resolution) {
    if (isThunk(resolution) && !hasArkKind(resolution, "generic"))
      return resolution();
    return resolution;
  }
  preparseOwnDefinitionFormat(def, opts) {
    return {
      ...opts,
      def,
      prefix: opts.alias ?? "type"
    };
  }
  parseOwnDefinitionFormat(def, ctx) {
    const isScopeAlias = ctx.alias && ctx.alias in this.aliases;
    if (!isScopeAlias && !ctx.args)
      ctx.args = { this: ctx.id };
    const result = parseInnerDefinition(def, ctx);
    if (isArray(result)) {
      if (result[1] === "=")
        return throwParseError(shallowDefaultableMessage);
      if (result[1] === "?")
        return throwParseError(shallowOptionalMessage);
    }
    return result;
  }
  unit = (value2) => this.units([value2]);
  valueOf = (tsEnum) => this.units(enumValues(tsEnum));
  enumerated = (...values) => this.units(values);
  instanceOf = (ctor) => this.node("proto", { proto: ctor }, { prereduced: true });
  or = (...defs) => this.schema(defs.map((def) => this.parse(def)));
  and = (...defs) => defs.reduce((node2, def) => node2.and(this.parse(def)), this.intrinsic.unknown);
  merge = (...defs) => defs.reduce((node2, def) => node2.merge(this.parse(def)), this.intrinsic.object);
  pipe = (...morphs) => this.intrinsic.unknown.pipe(...morphs);
  fn = new InternalFnParser(this);
  match = new InternalMatchParser(this);
  declare = () => ({
    type: this.type
  });
  define(def) {
    return def;
  }
  type = new InternalTypeParser(this);
  static scope = ((def, config = {}) => new InternalScope(def, config));
  static module = ((def, config = {}) => this.scope(def, config).export());
}
const scope = Object.assign(InternalScope.scope, {
  define: (def) => def
});
const Scope = InternalScope;
class MergeHkt extends Hkt {
  description = 'merge an object\'s properties onto another like `Merge(User, { isAdmin: "true" })`';
}
const Merge = genericNode(["base", intrinsic.object], ["props", intrinsic.object])((args) => args.base.merge(args.props), MergeHkt);
const arkBuiltins = Scope.module({
  Key: intrinsic.key,
  Merge
});
class liftFromHkt extends Hkt {
}
const liftFrom = genericNode("element")((args) => {
  const nonArrayElement = args.element.exclude(intrinsic.Array);
  const lifted = nonArrayElement.array();
  return nonArrayElement.rawOr(lifted).pipe(liftArray).distribute((branch) => branch.assertHasKind("morph").declareOut(lifted), rootSchema);
}, liftFromHkt);
const arkArray = Scope.module({
  root: intrinsic.Array,
  readonly: "root",
  index: intrinsic.nonNegativeIntegerString,
  liftFrom
}, {
  name: "Array"
});
const value = rootSchema(["string", registry.FileConstructor]);
const parsedFormDataValue = value.rawOr(value.array());
const parsed = rootSchema({
  meta: "an object representing parsed form data",
  domain: "object",
  index: {
    signature: "string",
    value: parsedFormDataValue
  }
});
const arkFormData = Scope.module({
  root: ["instanceof", FormData],
  value,
  parsed,
  parse: rootSchema({
    in: FormData,
    morphs: (data) => {
      const result = {};
      for (const [k, v] of data) {
        if (k in result) {
          const existing = result[k];
          if (typeof existing === "string" || existing instanceof registry.FileConstructor)
            result[k] = [existing, v];
          else
            existing.push(v);
        } else
          result[k] = v;
      }
      return result;
    },
    declaredOut: parsed
  })
}, {
  name: "FormData"
});
const TypedArray = Scope.module({
  Int8: ["instanceof", Int8Array],
  Uint8: ["instanceof", Uint8Array],
  Uint8Clamped: ["instanceof", Uint8ClampedArray],
  Int16: ["instanceof", Int16Array],
  Uint16: ["instanceof", Uint16Array],
  Int32: ["instanceof", Int32Array],
  Uint32: ["instanceof", Uint32Array],
  Float32: ["instanceof", Float32Array],
  Float64: ["instanceof", Float64Array],
  BigInt64: ["instanceof", BigInt64Array],
  BigUint64: ["instanceof", BigUint64Array]
}, {
  name: "TypedArray"
});
const omittedPrototypes = {
  Boolean: 1,
  Number: 1,
  String: 1
};
const arkPrototypes = Scope.module({
  ...flatMorph({ ...ecmascriptConstructors, ...platformConstructors }, (k, v) => k in omittedPrototypes ? [] : [k, ["instanceof", v]]),
  Array: arkArray,
  TypedArray,
  FormData: arkFormData
});
const epoch$1 = rootSchema({
  domain: {
    domain: "number",
    meta: "a number representing a Unix timestamp"
  },
  divisor: {
    rule: 1,
    meta: `an integer representing a Unix timestamp`
  },
  min: {
    rule: -864e13,
    meta: `a Unix timestamp after -8640000000000000`
  },
  max: {
    rule: 864e13,
    meta: "a Unix timestamp before 8640000000000000"
  },
  meta: "an integer representing a safe Unix timestamp"
});
const integer = rootSchema({
  domain: "number",
  divisor: 1
});
const number$1 = Scope.module({
  root: intrinsic.number,
  integer,
  epoch: epoch$1,
  safe: rootSchema({
    domain: {
      domain: "number",
      numberAllowsNaN: false
    },
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
  }),
  NaN: ["===", Number.NaN],
  Infinity: ["===", Number.POSITIVE_INFINITY],
  NegativeInfinity: ["===", Number.NEGATIVE_INFINITY]
}, {
  name: "number"
});
const regexStringNode = (regex2, description, jsonSchemaFormat) => {
  const schema = {
    domain: "string",
    pattern: {
      rule: regex2.source,
      flags: regex2.flags,
      meta: description
    }
  };
  if (jsonSchemaFormat)
    schema.meta = { format: jsonSchemaFormat };
  return node("intersection", schema);
};
const stringIntegerRoot = regexStringNode(wellFormedIntegerMatcher, "a well-formed integer string");
const stringInteger = Scope.module({
  root: stringIntegerRoot,
  parse: rootSchema({
    in: stringIntegerRoot,
    morphs: (s2, ctx) => {
      const parsed2 = Number.parseInt(s2);
      return Number.isSafeInteger(parsed2) ? parsed2 : ctx.error("an integer in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER");
    },
    declaredOut: intrinsic.integer
  })
}, {
  name: "string.integer"
});
const hex$1 = regexStringNode(/^[\dA-Fa-f]+$/, "hex characters only");
const base64 = Scope.module({
  root: regexStringNode(/^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}==|[\d+/A-Za-z]{3}=)?$/, "base64-encoded"),
  url: regexStringNode(/^(?:[\w-]{4})*(?:[\w-]{2}(?:==|%3D%3D)?|[\w-]{3}(?:=|%3D)?)?$/, "base64url-encoded")
}, {
  name: "string.base64"
});
const preformattedCapitalize = regexStringNode(/^[A-Z].*$/, "capitalized");
const capitalize = Scope.module({
  root: rootSchema({
    in: "string",
    morphs: (s2) => s2.charAt(0).toUpperCase() + s2.slice(1),
    declaredOut: preformattedCapitalize
  }),
  preformatted: preformattedCapitalize
}, {
  name: "string.capitalize"
});
const isLuhnValid = (creditCardInput) => {
  const sanitized = creditCardInput.replaceAll(/[ -]+/g, "");
  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble = false;
  for (let i2 = sanitized.length - 1; i2 >= 0; i2--) {
    digit = sanitized.substring(i2, i2 + 1);
    tmpNum = Number.parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      sum += tmpNum >= 10 ? tmpNum % 10 + 1 : tmpNum;
    } else
      sum += tmpNum;
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
};
const creditCardMatcher = /^(?:4\d{12}(?:\d{3,6})?|5[1-5]\d{14}|(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}|6(?:011|5\d\d)\d{12,15}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|(?:2131|1800|35\d{3})\d{11}|6[27]\d{14}|^(81\d{14,17}))$/;
const creditCard = rootSchema({
  domain: "string",
  pattern: {
    meta: "a credit card number",
    rule: creditCardMatcher.source
  },
  predicate: {
    meta: "a credit card number",
    predicate: isLuhnValid
  }
});
const iso8601Matcher = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))(T((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([,.]\d+(?!:))?)?(\17[0-5]\d([,.]\d+)?)?([Zz]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const isParsableDate = (s2) => !Number.isNaN(new Date(s2).valueOf());
const parsableDate = rootSchema({
  domain: "string",
  predicate: {
    meta: "a parsable date",
    predicate: isParsableDate
  }
}).assertHasKind("intersection");
const epochRoot = stringInteger.root.internal.narrow((s2, ctx) => {
  const n = Number.parseInt(s2);
  const out = number$1.epoch(n);
  if (out instanceof ArkErrors) {
    ctx.errors.merge(out);
    return false;
  }
  return true;
}).configure({
  description: "an integer string representing a safe Unix timestamp"
}, "self").assertHasKind("intersection");
const epoch = Scope.module({
  root: epochRoot,
  parse: rootSchema({
    in: epochRoot,
    morphs: (s2) => new Date(s2),
    declaredOut: intrinsic.Date
  })
}, {
  name: "string.date.epoch"
});
const isoRoot = regexStringNode(iso8601Matcher, "an ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) date").internal.assertHasKind("intersection");
const iso = Scope.module({
  root: isoRoot,
  parse: rootSchema({
    in: isoRoot,
    morphs: (s2) => new Date(s2),
    declaredOut: intrinsic.Date
  })
}, {
  name: "string.date.iso"
});
const stringDate = Scope.module({
  root: parsableDate,
  parse: rootSchema({
    declaredIn: parsableDate,
    in: "string",
    morphs: (s2, ctx) => {
      const date = new Date(s2);
      if (Number.isNaN(date.valueOf()))
        return ctx.error("a parsable date");
      return date;
    },
    declaredOut: intrinsic.Date
  }),
  iso,
  epoch
}, {
  name: "string.date"
});
const email = regexStringNode(
  // considered https://colinhacks.com/essays/reasonable-email-regex but it includes a lookahead
  // which breaks some integrations e.g. fast-check
  // regex based on:
  // https://www.regular-expressions.info/email.html
  /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/,
  "an email address",
  "email"
);
const ipv4Segment = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const ipv4Address = `(${ipv4Segment}[.]){3}${ipv4Segment}`;
const ipv4Matcher = new RegExp(`^${ipv4Address}$`);
const ipv6Segment = "(?:[0-9a-fA-F]{1,4})";
const ipv6Matcher = new RegExp(`^((?:${ipv6Segment}:){7}(?:${ipv6Segment}|:)|(?:${ipv6Segment}:){6}(?:${ipv4Address}|:${ipv6Segment}|:)|(?:${ipv6Segment}:){5}(?::${ipv4Address}|(:${ipv6Segment}){1,2}|:)|(?:${ipv6Segment}:){4}(?:(:${ipv6Segment}){0,1}:${ipv4Address}|(:${ipv6Segment}){1,3}|:)|(?:${ipv6Segment}:){3}(?:(:${ipv6Segment}){0,2}:${ipv4Address}|(:${ipv6Segment}){1,4}|:)|(?:${ipv6Segment}:){2}(?:(:${ipv6Segment}){0,3}:${ipv4Address}|(:${ipv6Segment}){1,5}|:)|(?:${ipv6Segment}:){1}(?:(:${ipv6Segment}){0,4}:${ipv4Address}|(:${ipv6Segment}){1,6}|:)|(?::((?::${ipv6Segment}){0,5}:${ipv4Address}|(?::${ipv6Segment}){1,7}|:)))(%[0-9a-zA-Z.]{1,})?$`);
const ip = Scope.module({
  root: ["v4 | v6", "@", "an IP address"],
  v4: regexStringNode(ipv4Matcher, "an IPv4 address", "ipv4"),
  v6: regexStringNode(ipv6Matcher, "an IPv6 address", "ipv6")
}, {
  name: "string.ip"
});
const jsonStringDescription = "a JSON string";
const writeJsonSyntaxErrorProblem = (error) => {
  if (!(error instanceof SyntaxError))
    throw error;
  return `must be ${jsonStringDescription} (${error})`;
};
const jsonRoot = rootSchema({
  meta: jsonStringDescription,
  domain: "string",
  predicate: {
    meta: jsonStringDescription,
    predicate: (s2, ctx) => {
      try {
        JSON.parse(s2);
        return true;
      } catch (e) {
        return ctx.reject({
          code: "predicate",
          expected: jsonStringDescription,
          problem: writeJsonSyntaxErrorProblem(e)
        });
      }
    }
  }
});
const parseJson = (s2, ctx) => {
  if (s2.length === 0) {
    return ctx.error({
      code: "predicate",
      expected: jsonStringDescription,
      actual: "empty"
    });
  }
  try {
    return JSON.parse(s2);
  } catch (e) {
    return ctx.error({
      code: "predicate",
      expected: jsonStringDescription,
      problem: writeJsonSyntaxErrorProblem(e)
    });
  }
};
const json$1 = Scope.module({
  root: jsonRoot,
  parse: rootSchema({
    meta: "safe JSON string parser",
    in: "string",
    morphs: parseJson,
    declaredOut: intrinsic.jsonObject
  })
}, {
  name: "string.json"
});
const preformattedLower = regexStringNode(/^[a-z]*$/, "only lowercase letters");
const lower = Scope.module({
  root: rootSchema({
    in: "string",
    morphs: (s2) => s2.toLowerCase(),
    declaredOut: preformattedLower
  }),
  preformatted: preformattedLower
}, {
  name: "string.lower"
});
const normalizedForms = ["NFC", "NFD", "NFKC", "NFKD"];
const preformattedNodes = flatMorph(normalizedForms, (i2, form) => [
  form,
  rootSchema({
    domain: "string",
    predicate: (s2) => s2.normalize(form) === s2,
    meta: `${form}-normalized unicode`
  })
]);
const normalizeNodes = flatMorph(normalizedForms, (i2, form) => [
  form,
  rootSchema({
    in: "string",
    morphs: (s2) => s2.normalize(form),
    declaredOut: preformattedNodes[form]
  })
]);
const NFC = Scope.module({
  root: normalizeNodes.NFC,
  preformatted: preformattedNodes.NFC
}, {
  name: "string.normalize.NFC"
});
const NFD = Scope.module({
  root: normalizeNodes.NFD,
  preformatted: preformattedNodes.NFD
}, {
  name: "string.normalize.NFD"
});
const NFKC = Scope.module({
  root: normalizeNodes.NFKC,
  preformatted: preformattedNodes.NFKC
}, {
  name: "string.normalize.NFKC"
});
const NFKD = Scope.module({
  root: normalizeNodes.NFKD,
  preformatted: preformattedNodes.NFKD
}, {
  name: "string.normalize.NFKD"
});
const normalize = Scope.module({
  root: "NFC",
  NFC,
  NFD,
  NFKC,
  NFKD
}, {
  name: "string.normalize"
});
const numericRoot = regexStringNode(numericStringMatcher, "a well-formed numeric string");
const stringNumeric = Scope.module({
  root: numericRoot,
  parse: rootSchema({
    in: numericRoot,
    morphs: (s2) => Number.parseFloat(s2),
    declaredOut: intrinsic.number
  })
}, {
  name: "string.numeric"
});
const regexPatternDescription = "a regex pattern";
const regex = rootSchema({
  domain: "string",
  predicate: {
    meta: regexPatternDescription,
    predicate: (s2, ctx) => {
      try {
        new RegExp(s2);
        return true;
      } catch (e) {
        return ctx.reject({
          code: "predicate",
          expected: regexPatternDescription,
          problem: String(e)
        });
      }
    }
  },
  meta: { format: "regex" }
});
const semverMatcher = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/;
const semver = regexStringNode(semverMatcher, "a semantic version (see https://semver.org/)");
const preformattedTrim = regexStringNode(
  // no leading or trailing whitespace
  /^\S.*\S$|^\S?$/,
  "trimmed"
);
const trim = Scope.module({
  root: rootSchema({
    in: "string",
    morphs: (s2) => s2.trim(),
    declaredOut: preformattedTrim
  }),
  preformatted: preformattedTrim
}, {
  name: "string.trim"
});
const preformattedUpper = regexStringNode(/^[A-Z]*$/, "only uppercase letters");
const upper = Scope.module({
  root: rootSchema({
    in: "string",
    morphs: (s2) => s2.toUpperCase(),
    declaredOut: preformattedUpper
  }),
  preformatted: preformattedUpper
}, {
  name: "string.upper"
});
const isParsableUrl = (s2) => URL.canParse(s2);
const urlRoot = rootSchema({
  domain: "string",
  predicate: {
    meta: "a URL string",
    predicate: isParsableUrl
  },
  // URL.canParse allows a subset of the RFC-3986 URI spec
  // since there is no other serializable validation, best include a format
  meta: { format: "uri" }
});
const url = Scope.module({
  root: urlRoot,
  parse: rootSchema({
    declaredIn: urlRoot,
    in: "string",
    morphs: (s2, ctx) => {
      try {
        return new URL(s2);
      } catch {
        return ctx.error("a URL string");
      }
    },
    declaredOut: rootSchema(URL)
  })
}, {
  name: "string.url"
});
const uuid = Scope.module({
  // the meta tuple expression ensures the error message does not delegate
  // to the individual branches, which are too detailed
  root: [
    "versioned | nil | max",
    "@",
    { description: "a UUID", format: "uuid" }
  ],
  "#nil": "'00000000-0000-0000-0000-000000000000'",
  "#max": "'ffffffff-ffff-ffff-ffff-ffffffffffff'",
  "#versioned": /[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}/i,
  v1: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-1[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv1"),
  v2: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-2[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv2"),
  v3: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-3[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv3"),
  v4: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv4"),
  v5: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-5[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv5"),
  v6: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-6[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv6"),
  v7: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-7[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv7"),
  v8: regexStringNode(/^[\da-f]{8}-[\da-f]{4}-8[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i, "a UUIDv8")
}, {
  name: "string.uuid"
});
const string = Scope.module({
  root: intrinsic.string,
  alpha: regexStringNode(/^[A-Za-z]*$/, "only letters"),
  alphanumeric: regexStringNode(/^[\dA-Za-z]*$/, "only letters and digits 0-9"),
  hex: hex$1,
  base64,
  capitalize,
  creditCard,
  date: stringDate,
  digits: regexStringNode(/^\d*$/, "only digits 0-9"),
  email,
  integer: stringInteger,
  ip,
  json: json$1,
  lower,
  normalize,
  numeric: stringNumeric,
  regex,
  semver,
  trim,
  upper,
  url,
  uuid
}, {
  name: "string"
});
const arkTsKeywords = Scope.module({
  bigint: intrinsic.bigint,
  boolean: intrinsic.boolean,
  false: intrinsic.false,
  never: intrinsic.never,
  null: intrinsic.null,
  number: intrinsic.number,
  object: intrinsic.object,
  string: intrinsic.string,
  symbol: intrinsic.symbol,
  true: intrinsic.true,
  unknown: intrinsic.unknown,
  undefined: intrinsic.undefined
});
const unknown = Scope.module({
  root: intrinsic.unknown,
  any: intrinsic.unknown
}, {
  name: "unknown"
});
const json = Scope.module({
  root: intrinsic.jsonObject,
  stringify: node("morph", {
    in: intrinsic.jsonObject,
    morphs: (data) => JSON.stringify(data),
    declaredOut: intrinsic.string
  })
}, {
  name: "object.json"
});
const object = Scope.module({
  root: intrinsic.object,
  json
}, {
  name: "object"
});
class RecordHkt extends Hkt {
  description = 'instantiate an object from an index signature and corresponding value type like `Record("string", "number")`';
}
const Record = genericNode(["K", intrinsic.key], "V")((args) => ({
  domain: "object",
  index: {
    signature: args.K,
    value: args.V
  }
}), RecordHkt);
class PickHkt extends Hkt {
  description = 'pick a set of properties from an object like `Pick(User, "name | age")`';
}
const Pick = genericNode(["T", intrinsic.object], ["K", intrinsic.key])((args) => args.T.pick(args.K), PickHkt);
class OmitHkt extends Hkt {
  description = 'omit a set of properties from an object like `Omit(User, "age")`';
}
const Omit = genericNode(["T", intrinsic.object], ["K", intrinsic.key])((args) => args.T.omit(args.K), OmitHkt);
class PartialHkt extends Hkt {
  description = "make all named properties of an object optional like `Partial(User)`";
}
const Partial = genericNode(["T", intrinsic.object])((args) => args.T.partial(), PartialHkt);
class RequiredHkt extends Hkt {
  description = "make all named properties of an object required like `Required(User)`";
}
const Required = genericNode(["T", intrinsic.object])((args) => args.T.required(), RequiredHkt);
class ExcludeHkt extends Hkt {
  description = 'exclude branches of a union like `Exclude("boolean", "true")`';
}
const Exclude = genericNode("T", "U")((args) => args.T.exclude(args.U), ExcludeHkt);
class ExtractHkt extends Hkt {
  description = 'extract branches of a union like `Extract("0 | false | 1", "number")`';
}
const Extract = genericNode("T", "U")((args) => args.T.extract(args.U), ExtractHkt);
const arkTsGenerics = Scope.module({
  Exclude,
  Extract,
  Omit,
  Partial,
  Pick,
  Record,
  Required
});
const ark = scope({
  ...arkTsKeywords,
  ...arkTsGenerics,
  ...arkPrototypes,
  ...arkBuiltins,
  string,
  number: number$1,
  object,
  unknown
}, { prereducedAliases: true, name: "ark" });
const keywords = ark.export();
Object.assign($arkTypeRegistry.ambient, keywords);
$arkTypeRegistry.typeAttachments = {
  string: keywords.string.root,
  number: keywords.number.root,
  bigint: keywords.bigint,
  boolean: keywords.boolean,
  symbol: keywords.symbol,
  undefined: keywords.undefined,
  null: keywords.null,
  object: keywords.object.root,
  unknown: keywords.unknown.root,
  false: keywords.false,
  true: keywords.true,
  never: keywords.never,
  arrayIndex: keywords.Array.index,
  Key: keywords.Key,
  Record: keywords.Record,
  Array: keywords.Array.root,
  Date: keywords.Date
};
const type = Object.assign(
  ark.type,
  // assign attachments newly parsed in keywords
  // future scopes add these directly from the
  // registry when their TypeParsers are instantiated
  $arkTypeRegistry.typeAttachments
);
ark.match;
ark.fn;
ark.generic;
ark.schema;
ark.define;
ark.declare;
const LayoutGroupContext = reactExports.createContext({});
function useConstant(init) {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? reactExports.useLayoutEffect : reactExports.useEffect;
const PresenceContext = /* @__PURE__ */ reactExports.createContext(null);
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
const clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};
let invariant = () => {
};
const MotionGlobalConfig = {};
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
function isObject(value2) {
  return typeof value2 === "object" && value2 !== null;
}
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
const combineFunctions = (a2, b) => (v) => b(a2(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value2) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value2 - from) / toFromDifference;
};
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a2, b, c2) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a2, b, c2);
    } else {
      for (let i2 = 0; i2 < numSubscriptions; i2++) {
        const handler = this.subscriptions[i2];
        handler && handler(a2, b, c2);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i2 = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i2 < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const mirrorEasing = (easing) => (p2) => p2 <= 0.5 ? easing(2 * p2) / 2 : (2 - easing(2 * (1 - p2))) / 2;
const reverseEasing = (easing) => (p2) => 1 - easing(1 - p2);
const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = /* @__PURE__ */ reverseEasing(backOut);
const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
const anticipate = (p2) => (p2 *= 2) < 1 ? 0.5 * backIn(p2) : 0.5 * (2 - Math.pow(2, -10 * (p2 - 1)));
const circIn = (p2) => 1 - Math.sin(Math.acos(p2));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);
const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
const isEasingArray = (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};
const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
const easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
const isValidEasing = (easing) => {
  return typeof easing === "string";
};
const easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4);
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition)) {
    return easingLookup[definition];
  }
  return definition;
};
const stepsOrder = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (!queue.has(callback))
        queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      [thisFrame, nextFrame] = [nextFrame, thisFrame];
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
    runNextFrame = false;
    if (!MotionGlobalConfig.useManualTiming) {
      state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
    }
    state.timestamp = timestamp;
    state.isProcessing = true;
    setup.process(state);
    read.process(state);
    resolveKeyframes.process(state);
    preUpdate.process(state);
    update.process(state);
    preRender.process(state);
    render.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process) => {
    for (let i2 = 0; i2 < stepsOrder.length; i2++) {
      steps[stepsOrder[i2]].cancel(process);
    }
  };
  return { schedule, cancel, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
const isCSSVariableToken = (value2) => {
  const startsWithToken = startsAsVariableToken(value2);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value2.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
const number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = {
  ...number,
  transform: (v) => clamp(0, 1, v)
};
const scale = {
  ...number,
  default: 1
};
const sanitize = (v) => Math.round(v * 1e5) / 1e5;
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v) {
  return v == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
const isColorString = (type2, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type2) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a2, b, c2, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a2),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c2),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const clampRgbUnit = (v) => clamp(0, 255, v);
const rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
};
const rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r2 = "";
  let g = "";
  let b = "";
  let a2 = "";
  if (v.length > 5) {
    r2 = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a2 = v.substring(7, 9);
  } else {
    r2 = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a2 = v.substring(4, 5);
    r2 += r2;
    g += g;
    b += b;
    a2 += a2;
  }
  return {
    red: parseInt(r2, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a2 ? parseInt(a2, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = /* @__PURE__ */ createUnitType("deg");
const percent = /* @__PURE__ */ createUnitType("%");
const px = /* @__PURE__ */ createUnitType("px");
const vh = /* @__PURE__ */ createUnitType("vh");
const vw = /* @__PURE__ */ createUnitType("vw");
const progressPercentage = /* @__PURE__ */ (() => ({
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
}))();
const hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  },
  getAnimatableNone: (v) => {
    const parsed2 = color.parse(v);
    parsed2.alpha = 0;
    return color.transform(parsed2);
  }
};
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v) {
  return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value2) {
  const originalValue = value2.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i2 = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i2);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i2);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i2);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i2;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function createTransformer(source) {
  const { split, types } = analyseComplexValue(source);
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i2 = 0; i2 < numSections; i2++) {
      output += split[i2];
      if (v[i2] !== void 0) {
        const type2 = types[i2];
        if (type2 === NUMBER_TOKEN) {
          output += sanitize(v[i2]);
        } else if (type2 === COLOR_TOKEN) {
          output += color.transform(v[i2]);
        } else {
          output += v[i2];
        }
      }
    }
    return output;
  };
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
function getAnimatableNone$1(v) {
  const parsed2 = parseComplexValue(v);
  const transformer = createTransformer(v);
  return transformer(parsed2.map(convertNumbersToZero));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
function hueToRgb(p2, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p2 + (q - p2) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p2 + (q - p2) * (2 / 3 - t) * 6;
  return p2;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p2 = 2 * lightness - q;
    red = hueToRgb(p2, q, hue + 1 / 3);
    green = hueToRgb(p2, q, hue);
    blue = hueToRgb(p2, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
function mixImmediate(a2, b) {
  return (p2) => p2 > 0 ? b : a2;
}
const mixNumber$1 = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type2) => type2.test(v));
function asRGBA(color2) {
  const type2 = getColorType(color2);
  if (!Boolean(type2))
    return false;
  let model = type2.parse(color2);
  if (type2 === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p2) => p2 <= 0 ? origin : target;
  } else {
    return (p2) => p2 >= 1 ? target : origin;
  }
}
function mixNumber(a2, b) {
  return (p2) => mixNumber$1(a2, b, p2);
}
function getMixer(a2) {
  if (typeof a2 === "number") {
    return mixNumber;
  } else if (typeof a2 === "string") {
    return isCSSVariableToken(a2) ? mixImmediate : color.test(a2) ? mixColor : mixComplex;
  } else if (Array.isArray(a2)) {
    return mixArray;
  } else if (typeof a2 === "object") {
    return color.test(a2) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a2, b) {
  const output = [...a2];
  const numValues = output.length;
  const blendValue = a2.map((v, i2) => getMixer(v)(v, b[i2]));
  return (p2) => {
    for (let i2 = 0; i2 < numValues; i2++) {
      output[i2] = blendValue[i2](p2);
    }
    return output;
  };
}
function mixObject(a2, b) {
  const output = { ...a2, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a2[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer(a2[key])(a2[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i2 = 0; i2 < target.values.length; i2++) {
    const type2 = target.types[i2];
    const originIndex = origin.indexes[type2][pointers[type2]];
    const originValue = origin.values[originIndex] ?? 0;
    orderedOrigin[i2] = originValue;
    pointers[type2]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    return mixImmediate(origin, target);
  }
};
function mix(from, to, p2) {
  if (typeof from === "number" && typeof to === "number" && typeof p2 === "number") {
    return mixNumber$1(from, to, p2);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
const generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i2 = 0; i2 < numPoints; i2++) {
    points += Math.round(easing(i2 / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] });
  const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => {
      return generator.next(duration * progress2).value / scale2;
    },
    duration: /* @__PURE__ */ millisecondsToSeconds(duration)
  };
}
const velocitySampleDuration = 5;
function calcGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
const safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a2 = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c2 = Math.exp(-delta);
      return safeMin - a2 / b * c2;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d2 = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d2 - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a2 * b;
    };
    derivative = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a2 * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = /* @__PURE__ */ secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i2 = 1; i2 < rootIterations; i2++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring(options);
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  if (dampingRatio < 1) {
    const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    next: (t) => {
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        let currentVelocity = t === 0 ? initialVelocity : 0;
        if (dampingRatio < 1) {
          currentVelocity = t === 0 ? /* @__PURE__ */ secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
        }
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {
    }
  };
  return generator;
}
spring.applyToOptions = (options) => {
  const generatorOptions = createGeneratorEasing(options, 100, spring);
  options.ease = generatorOptions.ease;
  options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration);
  options.type = "keyframes";
  return options;
};
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
  const nearestBoundary = (v) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: calcGeneratorVelocity(calcLatest, t, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state;
      }
    }
  };
}
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
  const numMixers = output.length - 1;
  for (let i2 = 0; i2 < numMixers; i2++) {
    let mixer = mixerFactory(output[i2], output[i2 + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i2] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i2 = 0;
    if (numMixers > 1) {
      for (; i2 < input.length - 2; i2++) {
        if (v < input[i2 + 1])
          break;
      }
    }
    const progressInRange = /* @__PURE__ */ progress(input[i2], input[i2 + 1], v);
    return mixers[i2](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i2 = 1; i2 <= remaining; i2++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i2);
    offset.push(mixNumber$1(min, 1, offsetProgress));
  }
}
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o2) => o2 * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state.value = mapTimeToKeyframe(t);
      state.done = t >= duration;
      return state;
    }
  };
}
const isNotNull$1 = (value2) => value2 !== null;
function getFinalKeyframe$1(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull$1);
  const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
  const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
const transitionTypeMap = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
function replaceTransitionType(transition) {
  if (typeof transition.type === "string") {
    transition.type = transitionTypeMap[transition.type];
  }
}
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
const percentToProgress = (percent2) => percent2 / 100;
class JSAnimation extends WithPromise {
  constructor(options) {
    super();
    this.state = "idle";
    this.startTime = null;
    this.isStopped = false;
    this.currentTime = 0;
    this.holdTime = null;
    this.playbackSpeed = 1;
    this.stop = () => {
      const { motionValue: motionValue2 } = this.options;
      if (motionValue2 && motionValue2.updatedAt !== time.now()) {
        this.tick(time.now());
      }
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      this.options.onStop?.();
    };
    this.options = options;
    this.initAnimation();
    this.play();
    if (options.autoplay === false)
      this.pause();
  }
  initAnimation() {
    const { options } = this;
    replaceTransitionType(options);
    const { type: type2 = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
    let { keyframes: keyframes$1 } = options;
    const generatorFactory = type2 || keyframes;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      this.mirroredGenerator = generatorFactory({
        ...options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    this.calculatedDuration = calculatedDuration;
    this.resolvedDuration = calculatedDuration + repeatDelay;
    this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
    this.generator = generator;
  }
  updateTime(timestamp) {
    const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
    if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = animationTime;
    }
  }
  tick(timestamp, sample = false) {
    const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type: type2, onUpdate, finalKeyframe } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else {
      this.updateTime(timestamp);
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
    const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    const state = isInDelayPhase ? { done: false, value: keyframes2[0] } : frameGenerator.next(elapsed);
    if (mixKeyframes) {
      state.value = mixKeyframes(state.value);
    }
    let { done } = state;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && type2 !== inertia) {
      state.value = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
    }
    if (onUpdate) {
      onUpdate(state.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve, reject) {
    return this.finished.then(resolve, reject);
  }
  get duration() {
    return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.playbackSpeed;
    }
    this.driver?.start(false);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    this.updateTime(time.now());
    const hasChanged = this.playbackSpeed !== newSpeed;
    this.playbackSpeed = newSpeed;
    if (hasChanged) {
      this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    this.options.onPlay?.();
    const now2 = this.driver.now();
    if (this.state === "finished") {
      this.updateFinished();
      this.startTime = now2;
    } else if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime ?? now2;
    }
    if (this.state === "finished" && this.speed < 0) {
      this.startTime += this.calculatedDuration;
    }
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    this.state = "paused";
    this.updateTime(time.now());
    this.holdTime = this.currentTime;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    this.notifyFinished();
    this.teardown();
    this.state = "finished";
    this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null;
    this.startTime = 0;
    this.tick(0);
    this.teardown();
    this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.startTime = this.holdTime = null;
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(sampleTime) {
    this.startTime = 0;
    return this.tick(sampleTime, true);
  }
  attachTimeline(timeline) {
    if (this.options.allowFlatten) {
      this.options.type = "keyframes";
      this.options.ease = "linear";
      this.initAnimation();
    }
    this.driver?.stop();
    return timeline.observe(this);
  }
}
function fillWildcards(keyframes2) {
  for (let i2 = 1; i2 < keyframes2.length; i2++) {
    keyframes2[i2] ?? (keyframes2[i2] = keyframes2[i2 - 1]);
  }
}
const radToDeg = (rad) => rad * 180 / Math.PI;
const rotate = (v) => {
  const angle = radToDeg(Math.atan2(v[1], v[0]));
  return rebaseAngle(angle);
};
const matrix2dParsers = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
  rotate,
  rotateZ: rotate,
  skewX: (v) => radToDeg(Math.atan(v[1])),
  skewY: (v) => radToDeg(Math.atan(v[2])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
};
const rebaseAngle = (angle) => {
  angle = angle % 360;
  if (angle < 0)
    angle += 360;
  return angle;
};
const rotateZ = rotate;
const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
const matrix3dParsers = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX,
  scaleY,
  scale: (v) => (scaleX(v) + scaleY(v)) / 2,
  rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
  rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
  rotateZ,
  rotate: rotateZ,
  skewX: (v) => radToDeg(Math.atan(v[4])),
  skewY: (v) => radToDeg(Math.atan(v[1])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
  if (!transform || transform === "none") {
    return defaultTransformValue(name);
  }
  const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers;
  let match;
  if (matrix3dMatch) {
    parsers = matrix3dParsers;
    match = matrix3dMatch;
  } else {
    const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers;
    match = matrix2dMatch;
  }
  if (!match) {
    return defaultTransformValue(name);
  }
  const valueParser = parsers[name];
  const values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
  const { transform = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform, name);
};
function convertTransformToNumber(value2) {
  return parseFloat(value2.trim());
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
const transformProps = /* @__PURE__ */ (() => new Set(transformPropOrder))();
const isNumOrPxType = (v) => v === number || v === px;
const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value2 = visualElement.getValue(key);
    if (value2 !== void 0) {
      removedTransforms.push([key, value2.get()]);
      value2.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
  height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
  y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
let isForced = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value2]) => {
          element.getValue(key)?.set(value2);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete(isForced));
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  isForced = true;
  readAllKeyframes();
  measureAllKeyframes();
  isForced = false;
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.state = "pending";
    this.isAsync = false;
    this.needsMeasurement = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled";
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue2?.get();
      const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== void 0) {
        unresolvedKeyframes[0] = currentValue;
      } else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        if (valueAsRead !== void 0 && valueAsRead !== null) {
          unresolvedKeyframes[0] = valueAsRead;
        }
      }
      if (unresolvedKeyframes[0] === void 0) {
        unresolvedKeyframes[0] = finalKeyframe;
      }
      if (motionValue2 && currentValue === void 0) {
        motionValue2.set(unresolvedKeyframes[0]);
      }
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(isForcedComplete = false) {
    this.state = "complete";
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
    toResolve.delete(this);
  }
  cancel() {
    if (this.state === "scheduled") {
      toResolve.delete(this);
      this.state = "pending";
    }
  }
  resume() {
    if (this.state === "pending")
      this.scheduleResolve();
  }
}
const isCSSVar = (name) => name.startsWith("--");
function setStyle(element, name, value2) {
  isCSSVar(name) ? element.style.setProperty(name, value2) : element.style[name] = value2;
}
const supportsScrollTimeline = /* @__PURE__ */ memo(() => window.ScrollTimeline !== void 0);
const supportsFlags = {};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");
const cubicBezierAsString = ([a2, b, c2, d2]) => `cubic-bezier(${a2}, ${b}, ${c2}, ${d2})`;
const supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function") {
    return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  const options = {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  if (pseudoElement)
    options.pseudoElement = pseudoElement;
  const animation = element.animate(keyframeOptions, options);
  return animation;
}
function isGenerator(type2) {
  return typeof type2 === "function" && "applyToOptions" in type2;
}
function applyGeneratorOptions({ type: type2, ...options }) {
  if (isGenerator(type2) && supportsLinearEasing()) {
    return type2.applyToOptions(options);
  } else {
    options.duration ?? (options.duration = 300);
    options.ease ?? (options.ease = "easeOut");
  }
  return options;
}
class NativeAnimation extends WithPromise {
  constructor(options) {
    super();
    this.finishedTime = null;
    this.isStopped = false;
    if (!options)
      return;
    const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
    this.isPseudoElement = Boolean(pseudoElement);
    this.allowFlatten = allowFlatten;
    this.options = options;
    invariant(typeof options.type !== "string");
    const transition = applyGeneratorOptions(options);
    this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
    if (transition.autoplay === false) {
      this.animation.pause();
    }
    this.animation.onfinish = () => {
      this.finishedTime = this.time;
      if (!pseudoElement) {
        const keyframe = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
        if (this.updateMotionValue) {
          this.updateMotionValue(keyframe);
        } else {
          setStyle(element, name, keyframe);
        }
        this.animation.cancel();
      }
      onComplete?.();
      this.notifyFinished();
    };
  }
  play() {
    if (this.isStopped)
      return;
    this.animation.play();
    if (this.state === "finished") {
      this.updateFinished();
    }
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e) {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = true;
    const { state } = this;
    if (state === "idle" || state === "finished") {
      return;
    }
    if (this.updateMotionValue) {
      this.updateMotionValue();
    } else {
      this.commitStyles();
    }
    if (!this.isPseudoElement)
      this.cancel();
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    if (!this.isPseudoElement) {
      this.animation.commitStyles?.();
    }
  }
  get duration() {
    const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
  }
  set time(newTime) {
    this.finishedTime = null;
    this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(newSpeed) {
    if (newSpeed < 0)
      this.finishedTime = null;
    this.animation.playbackRate = newSpeed;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(newStartTime) {
    this.animation.startTime = newStartTime;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline, observe }) {
    if (this.allowFlatten) {
      this.animation.effect?.updateTiming({ easing: "linear" });
    }
    this.animation.onfinish = null;
    if (timeline && supportsScrollTimeline()) {
      this.animation.timeline = timeline;
      return noop;
    } else {
      return observe(this);
    }
  }
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
    transition.ease = unsupportedEasingFunctions[transition.ease];
  }
}
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options);
    replaceTransitionType(options);
    super(options);
    if (options.startTime) {
      this.startTime = options.startTime;
    }
    this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value2) {
    const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue2)
      return;
    if (value2 !== void 0) {
      motionValue2.set(value2);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: false
    });
    const sampleTime = /* @__PURE__ */ secondsToMilliseconds(this.finishedTime ?? this.time);
    motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
    sampleAnimation.stop();
  }
}
const isAnimatable = (value2, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value2 === "number" || Array.isArray(value2))
    return true;
  if (typeof value2 === "string" && // It's animatable if we have a string
  (complex.test(value2) || value2 === "0") && // And it contains numbers and/or colors
  !value2.startsWith("url(")) {
    return true;
  }
  return false;
};
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i2 = 0; i2 < keyframes2.length; i2++) {
    if (keyframes2[i2] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type2, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null)
    return false;
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type2 === "spring" || isGenerator(type2)) && velocity;
}
function makeAnimationInstant(options) {
  options.duration = 0;
  options.type = "keyframes";
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]);
const supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
  const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type: type2 } = options;
  const subject = motionValue2?.owner?.current;
  if (!(subject instanceof HTMLElement)) {
    return false;
  }
  const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
  return supportsWaapi() && name && acceleratedValues.has(name) && (name !== "transform" || !transformTemplate) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type2 !== "inertia";
}
const MAX_RESOLVE_DELAY = 40;
class AsyncMotionValueAnimation extends WithPromise {
  constructor({ autoplay = true, delay: delay2 = 0, type: type2 = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
    super();
    this.stop = () => {
      if (this._animation) {
        this._animation.stop();
        this.stopTimeline?.();
      }
      this.keyframeResolver?.cancel();
    };
    this.createdAt = time.now();
    const optionsWithDefaults = {
      autoplay,
      delay: delay2,
      type: type2,
      repeat,
      repeatDelay,
      repeatType,
      name,
      motionValue: motionValue2,
      element,
      ...options
    };
    const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
    this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
    this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
    this.keyframeResolver = void 0;
    const { name, type: type2, velocity, delay: delay2, isHandoff, onUpdate } = options;
    this.resolvedAt = time.now();
    if (!canAnimate(keyframes2, name, type2, velocity)) {
      if (MotionGlobalConfig.instantAnimations || !delay2) {
        onUpdate?.(getFinalKeyframe$1(keyframes2, options, finalKeyframe));
      }
      keyframes2[0] = keyframes2[keyframes2.length - 1];
      makeAnimationInstant(options);
      options.repeat = 0;
    }
    const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
    const resolvedOptions = {
      startTime,
      finalKeyframe,
      ...options,
      keyframes: keyframes2
    };
    const animation = !isHandoff && supportsBrowserAnimation(resolvedOptions) ? new NativeAnimationExtended({
      ...resolvedOptions,
      element: resolvedOptions.motionValue.owner.current
    }) : new JSAnimation(resolvedOptions);
    animation.finished.then(() => this.notifyFinished()).catch(noop);
    if (this.pendingTimeline) {
      this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
      this.pendingTimeline = void 0;
    }
    this._animation = animation;
  }
  get finished() {
    if (!this._animation) {
      return this._finished;
    } else {
      return this.animation.finished;
    }
  }
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
  get animation() {
    if (!this._animation) {
      this.keyframeResolver?.resume();
      flushKeyframeResolvers();
    }
    return this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(newTime) {
    this.animation.time = newTime;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(newSpeed) {
    this.animation.speed = newSpeed;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(timeline) {
    if (this._animation) {
      this.stopTimeline = this.animation.attachTimeline(timeline);
    } else {
      this.pendingTimeline = timeline;
    }
    return () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    if (this._animation) {
      this.animation.cancel();
    }
    this.keyframeResolver?.cancel();
  }
}
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
function getVariableValue(current, element, depth = 1) {
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
function getValueTransition(transition, key) {
  return transition?.[key] ?? transition?.["default"] ?? transition;
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);
const auto = {
  test: (v) => v === "auto",
  parse: (v) => v
};
const testValueType = (v) => (type2) => type2.test(v);
const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
function isNone(value2) {
  if (typeof value2 === "number") {
    return value2 === 0;
  } else if (value2 !== null) {
    return value2 === "none" || value2 === "0" || isZeroValueString(value2);
  } else {
    return true;
  }
}
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value2] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value2.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value2.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value2)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
};
const int = {
  ...number,
  transform: Math.round
};
const transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};
const numberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px,
  ...transformValueTypes,
  zIndex: int,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter
};
const getDefaultValueType = (key) => defaultValueTypes[key];
function getAnimatableNone(key, value2) {
  let defaultValueType = getDefaultValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value2) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i2 = 0;
  let animatableTemplate = void 0;
  while (i2 < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i2];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i2];
    }
    i2++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
    }
  }
}
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
      let keyframe = unresolvedKeyframes[i2];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i2] = resolved;
          }
          if (i2 === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
        const value2 = unresolvedKeyframes[i2];
        if (typeof value2 === "string") {
          unresolvedKeyframes[i2] = parseFloat(value2);
        }
      }
    } else if (positionalValues[name]) {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
      if (unresolvedKeyframes[i2] === null || isNone(unresolvedKeyframes[i2])) {
        noneKeyframeIndexes.push(i2);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value2 = element.getValue(name);
    value2 && value2.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if (this.removedTransforms?.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
}
function resolveElements(elementOrSelector, scope2, selectorCache) {
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector);
}
const getValueAsType = (value2, type2) => {
  return type2 && typeof value2 === "number" ? type2.transform(value2) : value2;
};
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element;
}
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value2) => {
  return !isNaN(parseFloat(value2));
};
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init, options = {}) {
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev) {
        this.events.change?.notify(this.current);
        if (this.dependents) {
          for (const dependent of this.dependents) {
            dependent.dirty();
          }
        }
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v) {
    if (!this.passiveEffect) {
      this.updateAndNotify(v);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(dependent) {
    if (!this.dependents) {
      this.dependents = /* @__PURE__ */ new Set();
    }
    this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    if (this.dependents) {
      this.dependents.delete(dependent);
    }
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear();
    this.events.destroy?.notify();
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
const { schedule: microtask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);
const isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  const onPointerEnter = (enterEvent) => {
    if (!isValidHover(enterEvent))
      return;
    const { target } = enterEvent;
    const onHoverEnd = onHoverStart(target, enterEvent);
    if (typeof onHoverEnd !== "function" || !target)
      return;
    const onPointerLeave = (leaveEvent) => {
      if (!isValidHover(leaveEvent))
        return;
      onHoverEnd(leaveEvent);
      target.removeEventListener("pointerleave", onPointerLeave);
    };
    target.addEventListener("pointerleave", onPointerLeave, eventOptions);
  };
  elements.forEach((element) => {
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
  });
  return cancel;
}
const isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
const isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
const focusableElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return focusableElements.has(element.tagName) || element.tabIndex !== -1;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type2) {
  target.dispatchEvent(new PointerEvent("pointer" + type2, { isPrimary: true, bubbles: true }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
  const startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    isPressing.add(target);
    const onPressEnd = onPressStart(target, startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (isPressing.has(target)) {
        isPressing.delete(target);
      }
      if (!isValidPressEvent(endEvent)) {
        return;
      }
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  targets.forEach((target) => {
    const pointerDownTarget = options.useGlobalTarget ? window : target;
    pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
    if (isHTMLElement(target)) {
      target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
      if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
        target.tabIndex = 0;
      }
    }
  });
  return cancelEvents;
}
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
const isMotionValue = (value2) => Boolean(value2 && value2.getVelocity);
const valueTypes = [...dimensionValueTypes, color, complex];
const findValueType = (v) => valueTypes.find(testValueType(v));
const MotionConfigContext = reactExports.createContext({
  transformPagePoint: (p2) => p2,
  isStatic: false,
  reducedMotion: "never"
});
function setRef(ref, value2) {
  if (typeof ref === "function") {
    return ref(value2);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value2;
  }
}
function composeRefs(...refs) {
  return (node2) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node2);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i2 = 0; i2 < cleanups.length; i2++) {
          const cleanup = cleanups[i2];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i2], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (element && prevProps.isPresent && !this.props.isPresent) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const size = this.props.sizeRef.current;
      size.height = element.offsetHeight || 0;
      size.width = element.offsetWidth || 0;
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, root }) {
  const id2 = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const composedRef = useComposedRefs(ref, children?.ref);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right } = size.current;
    if (isPresent || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            top: ${top}px !important;
          }
        `);
    }
    return () => {
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, children: reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id2 = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id: id2,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  if (mode === "popLayout") {
    children = jsxRuntimeExports.jsx(PopChild, { isPresent, anchorX, root, children });
  }
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
function usePresence(subscribe2 = true) {
  const context = reactExports.useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register: register2 } = context;
  const id2 = reactExports.useId();
  reactExports.useEffect(() => {
    if (subscribe2) {
      return register2(id2);
    }
  }, [subscribe2]);
  const safeToRemove = reactExports.useCallback(() => subscribe2 && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe2]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i2 = 0; i2 < renderedChildren.length; i2++) {
      const key = getChildKey(renderedChildren[i2]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i2 = 0; i2 < renderedChildren.length; i2++) {
      const child = renderedChildren[i2];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i2, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitComplete.has(key)) {
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, children: child }, key);
  }) });
};
const LazyContext = reactExports.createContext({ strict: false });
const featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
const featureDefinitions = {};
for (const key in featureProps) {
  featureDefinitions[key] = {
    isEnabled: (props) => featureProps[key].some((name) => !!props[name])
  };
}
function loadFeatures(features) {
  for (const key in features) {
    featureDefinitions[key] = {
      ...featureDefinitions[key],
      ...features[key]
    };
  }
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
let shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (typeof isValidProp !== "function")
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
} catch {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const MotionContext = /* @__PURE__ */ reactExports.createContext({});
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
const variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, reactExports.useContext(MotionContext));
  return reactExports.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
const scaleCorrectors = {};
function addScaleCorrector(correctors) {
  for (const key in correctors) {
    scaleCorrectors[key] = correctors[key];
    if (isCSSVariableName(key)) {
      scaleCorrectors[key].isCSSVariable = true;
    }
  }
}
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i2 = 0; i2 < numTransforms; i2++) {
    const key = transformPropOrder[i2];
    const value2 = latestValues[key];
    if (value2 === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value2 === "number") {
      valueIsDefault = value2 === (key.startsWith("scale") ? 1 : 0);
    } else {
      valueIsDefault = parseFloat(value2) === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value2, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value2 = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value2;
      continue;
    } else {
      const valueAsType = getValueAsType(value2, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return reactExports.useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
const camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = px.transform(-offset);
  const pathLength = px.transform(length);
  const pathSpacing = px.transform(spacing);
  attrs[keys.array] = `${pathLength} ${pathSpacing}`;
}
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate, styleProp) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag2) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style } = state;
  if (attrs.transform) {
    style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (style.transform || attrs.transformOrigin) {
    style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
    delete attrs.transformOrigin;
  }
  if (style.transform) {
    style.transformBox = styleProp?.transformBox ?? "fill-box";
    delete attrs.transformBox;
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
function useSVGProps(props, visualState, _isStatic, Component) {
  const visualProps = reactExports.useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component), props.transformTemplate, props.style);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component)
  ) {
    return true;
  }
  return false;
}
function useRender(Component, props, ref, { latestValues }, isStatic, forwardMotionProps = false) {
  const useVisualProps = isSVGComponent(Component) ? useSVGProps : useHTMLProps;
  const visualProps = useVisualProps(props, latestValues, isStatic, Component);
  const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
  const elementProps = Component !== reactExports.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
  const { children } = props;
  const renderedChildren = reactExports.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return reactExports.createElement(Component, {
    ...elementProps,
    children: renderedChildren
  });
}
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement?.values.forEach((value2, key) => {
    state[0][key] = value2.get();
    state[1][key] = value2.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
function resolveMotionValue(value2) {
  return isMotionValue(value2) ? value2.get() : value2;
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  return state;
}
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i2 = 0; i2 < list.length; i2++) {
      const resolved = resolveVariantFromProps(props, list[i2]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context = reactExports.useContext(MotionContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  const { style } = props;
  const newValues = {};
  for (const key in style) {
    if (isMotionValue(style[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
});
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState
});
const motionComponentSymbol = Symbol.for("motionComponentSymbol");
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useMotionRef(visualState, visualElement, externalRef) {
  return reactExports.useCallback(
    (instance) => {
      if (instance) {
        visualState.onMount && visualState.onMount(instance);
      }
      if (visualElement) {
        if (instance) {
          visualElement.mount(instance);
        } else {
          visualElement.unmount();
        }
      }
      if (externalRef) {
        if (typeof externalRef === "function") {
          externalRef(instance);
        } else if (isRefObject(externalRef)) {
          externalRef.current = instance;
        }
      }
    },
    /**
     * Include externalRef in dependencies to ensure the callback updates
     * when the ref changes, allowing proper ref forwarding.
     */
    [visualElement]
  );
}
const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
const SwitchLayoutGroupContext = reactExports.createContext({});
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor) {
  const { visualElement: parent } = reactExports.useContext(MotionContext);
  const lazyContext = reactExports.useContext(LazyContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const reducedMotionConfig = reactExports.useContext(MotionConfigContext).reducedMotion;
  const visualElementRef = reactExports.useRef(null);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig
    });
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = reactExports.useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = reactExports.useRef(false);
  reactExports.useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = reactExports.useRef(Boolean(optimisedAppearId) && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
  useIsomorphicLayoutEffect(() => {
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    visualElement.scheduleRenderMicrotask();
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  reactExports.useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
    visualElement.enteringChildren = void 0;
  });
  return visualElement;
}
function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createMotionComponent(Component, { forwardMotionProps = false } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const useVisualState = isSVGComponent(Component) ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...reactExports.useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && isBrowser) {
      useStrictMode();
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
    }
    return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${Component.displayName ?? Component.name ?? ""})`}`;
  const ForwardRefMotionComponent = reactExports.forwardRef(MotionDOMComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = reactExports.useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  reactExports.useContext(LazyContext).strict;
}
function getProjectionFunctionality(props) {
  const { drag: drag2, layout: layout2 } = featureDefinitions;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy === "undefined") {
    return createMotionComponent;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const factory = (Component, options) => {
    return createMotionComponent(Component, options, preloadedFeatures, createVisualElement);
  };
  const deprecatedFactoryFunction = (Component, options) => {
    return factory(Component, options);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return factory;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
      }
      return componentCache.get(key);
    }
  });
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top });
  const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value2) {
  return value2 && value2 !== "0%";
}
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node2;
  let delta;
  for (let i2 = 0; i2 < treeLength; i2++) {
    node2 = treePath[i2];
    delta = node2.projectionDelta;
    const { visualElement } = node2.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node2.options.layoutScroll && node2.scroll && node2 !== node2.root) {
      transformBox(box, {
        x: -node2.scroll.offset.x,
        y: -node2.scroll.offset.y
      });
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node2.latestValues)) {
      transformBox(box, node2.latestValues);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min = axis.min + distance2;
  axis.max = axis.max + distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function transformBox(box, transform) {
  transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX);
  transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode2;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
const createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
const createAxis = () => ({ min: 0, max: 0 });
const createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
const visualElementStore = /* @__PURE__ */ new WeakMap();
function updateMotionValuesFromProps(element, next2, prev) {
  for (const key in next2) {
    const nextValue = next2[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next2[key] === void 0)
      element.removeValue(key);
  }
  return next2;
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value2 = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value2)) {
        value2.set(latestValues[key]);
      }
    }
  }
  mount(instance) {
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value2, key) => this.bindToMotionValue(key, value2));
    if (!hasReducedMotionListener.current) {
      initPrefersReducedMotion();
    }
    this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
    this.parent?.addChild(this);
    this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent?.removeChild(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child);
    this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
    this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child);
    this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key, value2) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    const valueIsTransform = transformProps.has(key);
    if (valueIsTransform && this.onBindTransform) {
      this.onBindTransform();
    }
    const removeOnChange = value2.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
      this.scheduleRender();
    });
    let removeSyncCheck;
    if (window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value2);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value2.owner)
        value2.stop();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value2) {
    this.latestValues[key] = value2;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i2 = 0; i2 < propEventHandlers.length; i2++) {
      const key = propEventHandlers[i2];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value2) {
    const existingValue = this.values.get(key);
    if (value2 !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value2);
      this.values.set(key, value2);
      this.latestValues[key] = value2.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value2 = this.values.get(key);
    if (value2 === void 0 && defaultValue !== void 0) {
      value2 = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value2);
    }
    return value2;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    let value2 = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
    if (value2 !== void 0 && value2 !== null) {
      if (typeof value2 === "string" && (isNumericalString(value2) || isZeroValueString(value2))) {
        value2 = parseFloat(value2);
      } else if (!findValueType(value2) && complex.test(target)) {
        value2 = getAnimatableNone(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value2) ? value2.get() : value2);
    }
    return isMotionValue(value2) ? value2.get() : value2;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value2) {
    this.baseTarget[key] = value2;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a2, b) {
    return a2.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    return props.style ? props.style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key;
  for (key in style) {
    elementStyle[key] = style[key];
  }
  projection?.applyProjectionStyles(elementStyle, styleProp);
  for (key in vars) {
    elementStyle.setProperty(key, vars[key]);
  }
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
    } else {
      const computedStyle = getComputedStyle$1(instance);
      const value2 = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value2 === "string" ? value2.trim() : value2;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
}
const createDomVisualElement = (Component, options) => {
  return isSVGComponent(Component) ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component !== reactExports.Fragment
  });
};
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
const isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
function setMotionValue(visualElement, key, value2) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value2);
  } else {
    visualElement.addValue(key, motionValue(value2));
  }
}
function resolveFinalValueInKeyframes(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value2 = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value2);
  }
}
function isWillChangeMotionValue(value2) {
  return Boolean(isMotionValue(value2) && value2.add);
}
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  } else if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange);
    newWillChange.add(key);
  }
}
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
const isNotNull = (value2) => value2 !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
  return resolvedKeyframes[index];
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
const keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
const ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
  return !!Object.keys(transition).length;
}
const animateMotionValue = (name, value2, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value2.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value2.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value2,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    Object.assign(options, getDefaultTransition(name, options));
  }
  options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration));
  options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay));
  if (options.from !== void 0) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    makeAnimationInstant(options);
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations) {
    shouldSkip = true;
    makeAnimationInstant(options);
    options.delay = 0;
  }
  options.allowFlatten = !valueTransition.type && !valueTransition.ease;
  if (shouldSkip && !isHandoff && value2.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type: type2 } = {}) {
  let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type2 && visualElement.animationState && visualElement.animationState.getState()[type2];
  for (const key in target) {
    const value2 = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    const currentValue = value2.get();
    if (currentValue !== void 0 && !value2.isAnimating && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
      continue;
    }
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    value2.start(animateMotionValue(key, value2, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value2.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    Promise.all(animations2).then(() => {
      frame.update(() => {
        transitionEnd && setTarget(visualElement, transitionEnd);
      });
    });
  }
  return animations2;
}
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index = Array.from(children).sort((a2, b) => a2.sortNodePosition(b)).indexOf(child);
  const numChildren = children.size;
  const maxStaggerDuration = (numChildren - 1) * staggerChildren;
  const delayIsFunction = typeof delayChildren === "function";
  return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
}
function animateVariant(visualElement, variant, options = {}) {
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last2] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last2());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  for (const child of visualElement.variantChildren) {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  }
  return Promise.all(animations2);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
function shallowCompare(next2, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next2.length)
    return false;
  for (let i2 = 0; i2 < prevLength; i2++) {
    if (prev[i2] !== next2[i2])
      return false;
  }
  return true;
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i2 = 0; i2 < numVariantProps; i2++) {
    const name = variantProps[i2];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse();
const numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
  return (animations2) => Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
}
function createAnimationState(visualElement) {
  let animate = animateList(visualElement);
  let state = createState();
  let isInitialRender = true;
  const buildResolvedTypeValues = (type2) => (acc, definition) => {
    const resolved = resolveVariant(visualElement, definition, type2 === "exit" ? visualElement.presenceContext?.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i2 = 0; i2 < numAnimationTypes; i2++) {
      const type2 = reversePriorityOrder[i2];
      const typeState = state[type2];
      const prop = props[type2] !== void 0 ? props[type2] : context[type2];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type2 === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i2;
      let isInherited = prop === context[type2] && prop !== props[type2] && propIsVariant;
      if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type2 === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i2 > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type2), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next2 = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next2) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next2, prev);
        } else {
          valueHasChanged = next2 !== prev;
        }
        if (valueHasChanged) {
          if (next2 !== void 0 && next2 !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next2 !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if (isInitialRender && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => {
          const options = { type: type2 };
          if (typeof animation === "string" && isInitialRender && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
            const { parent } = visualElement;
            const parentVariant = resolveVariant(parent, animation);
            if (parent.enteringChildren && parentVariant) {
              const { delayChildren } = parentVariant.transition || {};
              options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
            }
          }
          return {
            animation,
            options
          };
        }));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial !== "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        if (initialTransition && initialTransition.transition) {
          fallbackAnimation.transition = initialTransition.transition;
        }
      }
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget ?? null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type2, isActive) {
    if (state[type2].isActive === isActive)
      return Promise.resolve();
    visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type2, isActive));
    state[type2].isActive = isActive;
    const animations2 = animateChanges(type2);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
    }
  };
}
function checkVariantsDidChange(prev, next2) {
  if (typeof next2 === "string") {
    return next2 !== prev;
  } else if (Array.isArray(next2)) {
    return !shallowCompare(next2, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
class Feature {
  constructor(node2) {
    this.isMounted = false;
    this.node = node2;
  }
  update() {
  }
}
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node2) {
    super(node2);
    node2.animationState || (node2.animationState = createAnimationState(node2));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    this.node.animationState.reset();
    this.unmountControls?.();
  }
}
let id$1 = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments);
    this.id = id$1++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => {
        onExitComplete(this.id);
      });
    }
  }
  mount() {
    const { register: register2, onExitComplete } = this.node.presenceContext || {};
    if (onExitComplete) {
      onExitComplete(this.id);
    }
    if (register2) {
      this.unmount = register2(this.id);
    }
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => {
  return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
};
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const SCALE_PRECISION = 1e-4;
const SCALE_MIN = 1 - SCALE_PRECISION;
const SCALE_MAX = 1 + SCALE_PRECISION;
const TRANSLATE_PRECISION = 0.01;
const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value2, target, maxDistance) {
  return Math.abs(value2 - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
  target.min = parent.min + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
  calcRelativeAxis(target.x, relative.x, parent.x);
  calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout2, parent) {
  target.min = layout2.min - parent.min;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y);
}
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
const getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
const distance = (a2, b) => Math.abs(a2 - b);
function distance2D(a2, b) {
  const xDelta = distance(a2.x, b.x);
  const yDelta = distance(a2.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3 } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin)
        resumeAnimation && resumeAnimation();
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.distanceThreshold = distanceThreshold;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a2, b) {
  return { x: a2.x - b.x, y: a2.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i2 = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i2 >= 0) {
    timestampedPoint = history[i2];
    if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) {
      break;
    }
    i2--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
function applyConstraints(point, { min, max }, elastic) {
  if (min !== void 0 && point < min) {
    point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.latestPointerEvent = null;
    this.latestPanInfo = null;
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
      dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation();
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.postRender(() => onDragStart(event, info));
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      onDrag && onDrag(event, info);
    };
    const onSessionEnd = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.stop(event, info);
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
    };
    const resumeAnimation = () => eachAxis((axis) => this.getAnimationState(axis) === "paused" && this.getAxisMotionValue(axis).animation?.play());
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent;
    const finalPanInfo = panInfo || this.latestPanInfo;
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
    }
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.panSession && this.panSession.end();
    this.panSession = void 0;
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next2 = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next2 = applyConstraints(next2, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next2);
  }
  resolveConstraints() {
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  pauseAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
  }
  getAnimationState(axis) {
    return this.getAxisMotionValue(axis).animation?.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        axisValue.set(point[axis] - mixNumber$1(min, max, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      drag2 && dragListener && this.start(event);
    });
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    }));
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
class DragGesture extends Feature {
  constructor(node2) {
    super(node2);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node2);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
  }
}
const asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.postRender(() => handler(event, info));
  }
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: onPan,
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node2) => {
    if (!node2.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x = pixelsToPercent(latest, node2.target.x);
    const y = pixelsToPercent(latest, node2.target.y);
    return `${x}% ${y}%`;
  }
};
const correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};
let hasTakenAnySnapshot = false;
class MeasureLayoutWithContext extends reactExports.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    addScaleCorrector(defaultScaleCorrectors);
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      if (hasTakenAnySnapshot) {
        projection.root.didUpdate();
      }
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const { projection } = visualElement;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    hasTakenAnySnapshot = true;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { projection } = this.props.visualElement;
    if (projection) {
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    hasTakenAnySnapshot = true;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: reactExports.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
const defaultScaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function animateSingleValue(value2, keyframes2, options) {
  const motionValue$1 = isMotionValue(value2) ? value2 : motionValue(value2);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
const compareByDepth = (a2, b) => a2.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.setup(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
const borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
const numBorders = borders.length;
const asNumber = (value2) => typeof value2 === "string" ? parseFloat(value2) : value2;
const isPx = (value2) => typeof value2 === "number" || px.test(value2);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
    target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
  }
  for (let i2 = 0; i2 < numBorders; i2++) {
    const borderLabel = `border${borders[i2]}Radius`;
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p2) => {
    if (p2 < min)
      return 0;
    if (p2 > max)
      return 1;
    return easing(/* @__PURE__ */ progress(min, max, p2));
  };
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"];
const yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a2, b) {
  return a2.min === b.min && a2.max === b.max;
}
function boxEquals(a2, b) {
  return axisEquals(a2.x, b.x) && axisEquals(a2.y, b.y);
}
function axisEqualsRounded(a2, b) {
  return Math.round(a2.min) === Math.round(b.min) && Math.round(a2.max) === Math.round(b.max);
}
function boxEqualsRounded(a2, b) {
  return axisEqualsRounded(a2.x, b.x) && axisEqualsRounded(a2.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a2, b) {
  return a2.translate === b.translate && a2.scale === b.scale && a2.originPoint === b.originPoint;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node2) {
    addUniqueItem(this.members, node2);
    node2.scheduleRender();
  }
  remove(node2) {
    removeItem(this.members, node2);
    if (node2 === this.prevLead) {
      this.prevLead = void 0;
    }
    if (node2 === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead) {
        this.promote(prevLead);
      }
    }
  }
  relegate(node2) {
    const indexOfNode = this.members.findIndex((member) => node2 === member);
    if (indexOfNode === 0)
      return false;
    let prevLead;
    for (let i2 = indexOfNode; i2 >= 0; i2--) {
      const member = this.members[i2];
      if (member.isPresent !== false) {
        prevLead = member;
        break;
      }
    }
    if (prevLead) {
      this.promote(prevLead);
      return true;
    } else {
      return false;
    }
  }
  promote(node2, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node2 === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node2;
    node2.show();
    if (prevLead) {
      prevLead.instance && prevLead.scheduleRender();
      node2.scheduleRender();
      node2.resumeFrom = prevLead;
      if (preserveFollowOpacity) {
        node2.resumeFrom.preserveOpacity = true;
      }
      if (prevLead.snapshot) {
        node2.snapshot = prevLead.snapshot;
        node2.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
      }
      if (node2.root && node2.root.isUpdating) {
        node2.isLayoutDirty = true;
      }
      const { crossfade } = node2.options;
      if (crossfade === false) {
        prevLead.hide();
      }
    }
  }
  exitAnimationComplete() {
    this.members.forEach((node2) => {
      const { options, resumingFrom } = node2;
      options.onExitComplete && options.onExitComplete();
      if (resumingFrom) {
        resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
      }
    });
  }
  scheduleRender() {
    this.members.forEach((node2) => {
      node2.instance && node2.scheduleRender(false);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    if (this.lead && this.lead.snapshot) {
      this.lead.snapshot = void 0;
    }
  }
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = latestTransform?.z || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform = `perspective(${transformPerspective}px) ${transform}`;
    if (rotate2)
      transform += `rotate(${rotate2}deg) `;
    if (rotateX)
      transform += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform += `skewX(${skewX}deg) `;
    if (skewY)
      transform += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform || "none";
}
const transformAxes = ["", "X", "Y", "Z"];
const animationTarget = 1e3;
let id = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent?.()) {
      this.id = id++;
      this.animationId = 0;
      this.animationCommitId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
      };
      this.resolvedRelativeTargetAt = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i2 = 0; i2 < this.path.length; i2++) {
        this.path[i2].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        let innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        frame.read(() => {
          innerWidth = window.innerWidth;
        });
        attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          if (newInnerWidth === innerWidth)
            return;
          innerWidth = newInnerWidth;
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
          if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      this.eventHandlers.clear();
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i2 = 0; i2 < this.path.length; i2++) {
        const node2 = this.path[i2];
        node2.shouldResetTransform = true;
        node2.updateScroll("snapshot");
        if (node2.options.layoutRoot) {
          node2.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        this.unblockUpdate();
        this.clearAllSnapshots();
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId;
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      } else {
        this.isUpdating = false;
        this.nodes.forEach(resetTransformStyle);
        this.nodes.forEach(updateLayout);
        this.nodes.forEach(notifyLayoutUpdate);
      }
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
      if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
        this.snapshot = void 0;
      }
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i2 = 0; i2 < this.path.length; i2++) {
          const node2 = this.path[i2];
          node2.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if (this.scroll?.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i2 = 0; i2 < this.path.length; i2++) {
        const node2 = this.path[i2];
        const { scroll, options } = node2;
        if (node2 !== this.root && scroll && options.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false) {
      const withTransforms = createBox();
      copyBoxInto(withTransforms, box);
      for (let i2 = 0; i2 < this.path.length; i2++) {
        const node2 = this.path[i2];
        if (!transformOnly && node2.options.layoutScroll && node2.scroll && node2 !== node2.root) {
          transformBox(withTransforms, {
            x: -node2.scroll.offset.x,
            y: -node2.scroll.offset.y
          });
        }
        if (!hasTransform(node2.latestValues))
          continue;
        transformBox(withTransforms, node2.latestValues);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i2 = 0; i2 < this.path.length; i2++) {
        const node2 = this.path[i2];
        if (!node2.instance)
          continue;
        if (!hasTransform(node2.latestValues))
          continue;
        hasScale(node2.latestValues) && node2.updateSnapshot();
        const sourceBox = createBox();
        const nodeBox = node2.measurePageBox();
        copyBoxInto(sourceBox, nodeBox);
        removeBoxTransforms(boxWithoutTransform, node2.latestValues, node2.snapshot ? node2.snapshot.layoutBox : void 0, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      if (!this.targetDelta && !this.relativeTarget) {
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.target = this.applyTransform(this.layout.layoutBox);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll = true) {
      this.options.visualElement?.scheduleRender();
      if (notifyAll) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot2 = this.snapshot;
      const snapshotLatestValues = snapshot2 ? snapshot2.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot2 ? snapshot2.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart");
      this.currentAnimation?.stop();
      this.resumingFrom?.currentAnimation?.stop();
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.motionValue || (this.motionValue = motionValue(0));
        this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
          ...options,
          velocity: 0,
          isSync: true,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
          },
          onComplete: () => {
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node2) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node2);
      const config = node2.options.initialPromotionConfig;
      node2.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node2) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i2 = 0; i2 < transformAxes.length; i2++) {
        resetDistortingTransform(`rotate${transformAxes[i2]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i2]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        targetStyle.visibility = "";
        targetStyle.opacity = "";
        targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        if (this.options.layoutId) {
          targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        transform = transformTemplate(valuesToRender, transform);
      }
      targetStyle.transform = transform;
      const { x, y } = this.projectionDelta;
      targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
        const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i2 = 0; i2 < num; i2++) {
            targetStyle[applyTo[i2]] = corrected;
          }
        } else {
          if (isCSSVariable) {
            this.options.visualElement.renderState.vars[key] = corrected;
          } else {
            targetStyle[key] = corrected;
          }
        }
      }
      if (this.options.layoutId) {
        targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
      }
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node2) => node2.currentAnimation?.stop());
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node2) {
  node2.updateLayout();
}
function notifyLayoutUpdate(node2) {
  const snapshot2 = node2.resumeFrom?.snapshot || node2.snapshot;
  if (node2.isLead() && node2.layout && snapshot2 && node2.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node2.layout;
    const { animationType } = node2.options;
    const isShared = snapshot2.source !== node2.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot2.measuredBox[axis] : snapshot2.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (shouldAnimatePositionOnly(animationType, snapshot2.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot2.measuredBox[axis] : snapshot2.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node2.relativeTarget && !node2.currentAnimation) {
          node2.isProjectionDirty = true;
          node2.relativeTarget[axis].max = node2.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot2.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node2.applyTransform(measuredLayout, true), snapshot2.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot2.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = false;
    if (!node2.resumeFrom) {
      const relativeParent = node2.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot2.layoutBox, parentSnapshot.layoutBox);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeLayoutChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node2.relativeTarget = relativeLayout;
            node2.relativeTargetOrigin = relativeSnapshot;
            node2.relativeParent = relativeParent;
          }
        }
      }
    }
    node2.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot: snapshot2,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node2.isLead()) {
    const { onExitComplete } = node2.options;
    onExitComplete && onExitComplete();
  }
  node2.options.transition = void 0;
}
function propagateDirtyNodes(node2) {
  if (!node2.parent)
    return;
  if (!node2.isProjecting()) {
    node2.isProjectionDirty = node2.parent.isProjectionDirty;
  }
  node2.isSharedProjectionDirty || (node2.isSharedProjectionDirty = Boolean(node2.isProjectionDirty || node2.parent.isProjectionDirty || node2.parent.isSharedProjectionDirty));
  node2.isTransformDirty || (node2.isTransformDirty = node2.parent.isTransformDirty);
}
function cleanDirtyNodes(node2) {
  node2.isProjectionDirty = node2.isSharedProjectionDirty = node2.isTransformDirty = false;
}
function clearSnapshot(node2) {
  node2.clearSnapshot();
}
function clearMeasurements(node2) {
  node2.clearMeasurements();
}
function clearIsLayoutDirty(node2) {
  node2.isLayoutDirty = false;
}
function resetTransformStyle(node2) {
  const { visualElement } = node2.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node2.resetTransform();
}
function finishAnimation(node2) {
  node2.finishAnimation();
  node2.targetDelta = node2.relativeTarget = node2.target = void 0;
  node2.isProjectionDirty = true;
}
function resolveTargetDelta(node2) {
  node2.resolveTargetDelta();
}
function calcProjection(node2) {
  node2.calcProjection();
}
function resetSkewAndRotation(node2) {
  node2.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p2) {
  output.translate = mixNumber$1(delta.translate, 0, p2);
  output.scale = mixNumber$1(delta.scale, 1, p2);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p2) {
  output.min = mixNumber$1(from.min, to.min, p2);
  output.max = mixNumber$1(from.max, to.max, p2);
}
function mixBox(output, from, to, p2) {
  mixAxis(output.x, from.x, to.x, p2);
  mixAxis(output.y, from.y, to.y, p2);
}
function hasOpacityCrossfade(node2) {
  return node2.animationValues && node2.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
const userAgentContains = (string2) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string2);
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot2, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot2), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node2) {
  return node2 !== node2.root && node2.scroll?.wasRoot;
}
const DocumentProjectionNode = createProjectionNode({
  attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => true
});
const rootProjectionNode = {
  current: void 0
};
const HTMLProjectionNode = createProjectionNode({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value2) => {
    instance.style.transform = value2 !== void 0 ? value2 : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
const drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function handleHoverEvent(node2, event, lifecycle) {
  const { props } = node2;
  if (node2.animationState && props.whileHover) {
    node2.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (_element, startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function handlePressEvent(node2, event, lifecycle) {
  const { props } = node2;
  if (node2.current instanceof HTMLButtonElement && node2.current.disabled) {
    return;
  }
  if (node2.animationState && props.whileTap) {
    node2.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = press(current, (_element, startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, { useGlobalTarget: this.node.props.globalTapTarget });
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap();
const observers = /* @__PURE__ */ new WeakMap();
const fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
const fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    this.unmount();
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    return observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};
const layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
const featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
};
const motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
function AnimatedBorder({ isActive, children, borderRadius = 6, className = "" }) {
  const containerRef = reactExports.useRef(null);
  const [dimensions, setDimensions] = reactExports.useState({ width: 0, height: 0 });
  const [animationKey, setAnimationKey] = reactExports.useState(0);
  const gradientId = reactExports.useMemo(() => `snakeGradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const updateDimensions = reactExports.useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);
  reactExports.useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);
  reactExports.useEffect(() => {
    if (isActive) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isActive]);
  const { width, height } = dimensions;
  const strokeWidth = 3;
  const offset = strokeWidth / 2;
  const perimeter = 2 * (width + height - 2 * borderRadius) + 2 * Math.PI * borderRadius;
  const snakeLength = perimeter * 0.3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: `relative ${className}`, children: [
    children,
    isActive && width > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        className: "absolute inset-0 pointer-events-none z-10",
        width,
        height,
        style: { overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `${gradientId}-glow`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "2", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: "#c2ffe0", floodOpacity: "0.3", result: "color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "color", in2: "blur", operator: "in", result: "glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.rect,
            {
              x: offset,
              y: offset,
              width: width - strokeWidth,
              height: height - strokeWidth,
              rx: borderRadius,
              ry: borderRadius,
              fill: "none",
              stroke: "#c2ffe0",
              strokeWidth,
              strokeLinecap: "round",
              strokeDasharray: `${snakeLength} ${perimeter - snakeLength}`,
              filter: `url(#${gradientId}-glow)`,
              initial: { strokeDashoffset: 0 },
              animate: {
                strokeDashoffset: [-perimeter, 0]
              },
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }
            },
            animationKey
          )
        ]
      }
    )
  ] });
}
function Input({ className, type: type2, onFocus, onBlur, ...props }) {
  const [isFocused, setIsFocused] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBorder, { isActive: !isFocused, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: type2,
      "data-slot": "input",
      ...props,
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      onFocus: (e) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      onBlur: (e) => {
        setIsFocused(false);
        onBlur?.(e);
      }
    }
  ) });
}
function isLikelyUrl(v) {
  if (!v) return false;
  if (/\s/.test(v)) return false;
  if (/^https?:\/\//i.test(v)) return true;
  if (v.includes(".") && !v.startsWith(".")) return true;
  return false;
}
function Omnibox({ value: value2, onChange, onSubmit, placeholder, className }) {
  const [open, setOpen] = reactExports.useState(false);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [highlight, setHighlight] = reactExports.useState(-1);
  const controllerRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!value2 || isLikelyUrl(value2)) {
      setSuggestions([]);
      return;
    }
    const ac = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = ac;
    const id2 = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(value2)}`, {
          signal: ac.signal
        });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data[1]?.slice(0, 8) || []);
      } catch (_) {
      }
    }, 150);
    return () => {
      clearTimeout(id2);
      ac.abort();
    };
  }, [value2]);
  reactExports.useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    if (suggestions.length === 0) setHighlight(-1);
  }, [suggestions]);
  const visible = open && value2.length > 0 && !isLikelyUrl(value2);
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlight((h2) => (h2 + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlight((h2) => h2 <= 0 ? suggestions.length - 1 : h2 - 1);
      }
    } else if (e.key === "Enter") {
      if (highlight >= 0 && suggestions[highlight]) {
        e.preventDefault();
        onSubmit(suggestions[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };
  const items = reactExports.useMemo(() => suggestions, [suggestions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: containerRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        value: value2,
        onChange: (e) => onChange(e.currentTarget.value),
        placeholder,
        className,
        onBlur: () => setTimeout(() => setOpen(false), 200),
        onKeyDown,
        onKeyUp: (e) => {
          if (e.key === "Enter" && highlight === -1) onSubmit(value2);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.ul,
      {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0.12 },
        className: "absolute z-50 mt-1 w-full rounded-md border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg overflow-hidden",
        role: "listbox",
        children: [
          items.map((s2, i2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              role: "option",
              "aria-selected": i2 === highlight,
              className: `px-3 py-2 text-sm cursor-pointer hover:bg-accent ${i2 === highlight ? "bg-accent" : ""}`,
              onMouseDown: (e) => {
                e.preventDefault();
                onSubmit(s2);
              },
              onMouseEnter: () => setHighlight(i2),
              children: s2
            },
            s2 + i2
          )),
          items.length === 0 && value2 && !isLikelyUrl(value2) && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-3 py-2 text-sm text-muted-foreground", children: [
            'Search DuckDuckGo for "',
            value2,
            '"'
          ] })
        ]
      }
    ) })
  ] });
}
var _excluded14 = ["title"], _excluded32 = ["title"], _excluded58 = ["title"], _excluded117 = ["title"], _excluded237 = ["title"];
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i2;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
      key = sourceSymbolKeys[i2];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var AU = function AU2(_ref14) {
  var title = _ref14.title, rest = _objectWithoutProperties(_ref14, _excluded14);
  return /* @__PURE__ */ React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 513 342"
  }, rest), title && /* @__PURE__ */ React.createElement("title", null, title), /* @__PURE__ */ React.createElement("path", {
    fill: "#10338c",
    d: "M0 0h513v342H0z"
  }), /* @__PURE__ */ React.createElement("g", {
    fill: "#FFF"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M222.2 170.7c.3-.3.5-.6.8-.9-.2.3-.5.6-.8.9zM188 212.6l11 22.9 24.7-5.7-11 22.8 19.9 15.8-24.8 5.6.1 25.4-19.9-15.9-19.8 15.9.1-25.4-24.8-5.6 19.9-15.8-11.1-22.8 24.8 5.7zm197.9 28.5 5.2 10.9 11.8-2.7-5.3 10.9 9.5 7.5-11.8 2.6v12.2l-9.4-7.6-9.5 7.6.1-12.2-11.8-2.6 9.5-7.5-5.3-10.9 11.8 2.7zm-48.6-116 5.2 10.9 11.8-2.7-5.3 10.9 9.5 7.5-11.8 2.7v12.1l-9.4-7.6-9.5 7.6.1-12.1-11.9-2.7 9.5-7.5-5.3-10.9L332 136zm48.6-66.2 5.2 10.9 11.8-2.7-5.3 10.9 9.5 7.5-11.8 2.7v12.1l-9.4-7.6-9.5 7.6.1-12.1-11.8-2.7 9.5-7.5-5.3-10.9 11.8 2.7zm42.5 49.7 5.2 10.9 11.8-2.7-5.3 10.9 9.5 7.5-11.8 2.6V150l-9.4-7.6-9.5 7.6v-12.2l-11.8-2.6 9.5-7.5-5.3-10.9 11.8 2.7zM398 166.5l4.1 12.7h13.3l-10.8 7.8 4.2 12.7-10.8-7.9-10.8 7.9 4.1-12.7-10.7-7.8h13.3z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M254.8 0v30.6l-45.1 25.1h45.1V115h-59.1l59.1 32.8v22.9h-26.7l-73.5-40.9v40.9H99v-48.6l-87.4 48.6H-1.2v-30.6L44 115H-1.2V55.7h59.1L-1.2 22.8V0h26.7L99 40.8V0h55.6v48.6L242.1 0z"
  })), /* @__PURE__ */ React.createElement("path", {
    fill: "#D80027",
    d: "M142.8 0h-32v69.3h-112v32h112v69.4h32v-69.4h112v-32h-112z"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#0052B4",
    d: "m154.6 115 100.2 55.7v-15.8L183 115z"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#FFF",
    d: "m154.6 115 100.2 55.7v-15.8L183 115z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "m154.6 115 100.2 55.7v-15.8L183 115zm-83.9 0-71.9 39.9v15.8L99 115z",
    fill: "#D80027"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#0052B4",
    d: "M99 55.7-1.2 0v15.7l71.9 40z"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#FFF",
    d: "M99 55.7-1.2 0v15.7l71.9 40z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M99 55.7-1.2 0v15.7l71.9 40zm84 0 71.8-40V0L154.6 55.7z",
    fill: "#D80027"
  }));
};
var BR = function BR2(_ref32) {
  var title = _ref32.title, rest = _objectWithoutProperties(_ref32, _excluded32);
  return /* @__PURE__ */ React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 513 342"
  }, rest), title && /* @__PURE__ */ React.createElement("title", null, title), /* @__PURE__ */ React.createElement("path", {
    fill: "#009b3a",
    d: "M0 0h513v342H0z"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#fedf00",
    d: "m256.5 19.3 204.9 151.4L256.5 322 50.6 170.7z"
  }), /* @__PURE__ */ React.createElement("circle", {
    fill: "#FFF",
    cx: 256.5,
    cy: 171,
    r: 80.4
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#002776",
    d: "M215.9 165.7c-13.9 0-27.4 2.1-40.1 6 .6 43.9 36.3 79.3 80.3 79.3 27.2 0 51.3-13.6 65.8-34.3-24.9-31-63.2-51-106-51zm119 20.3c.9-5 1.5-10.1 1.5-15.4 0-44.4-36-80.4-80.4-80.4-33.1 0-61.5 20.1-73.9 48.6 10.9-2.2 22.1-3.4 33.6-3.4 46.8.1 89 19.5 119.2 50.6z"
  }));
};
var DE = function DE2(_ref58) {
  var title = _ref58.title, rest = _objectWithoutProperties(_ref58, _excluded58);
  return /* @__PURE__ */ React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 513 342"
  }, rest), title && /* @__PURE__ */ React.createElement("title", null, title), /* @__PURE__ */ React.createElement("path", {
    fill: "#D80027",
    d: "M0 0h513v342H0z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M0 0h513v114H0z"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#FFDA44",
    d: "M0 228h513v114H0z"
  }));
};
var JP = function JP2(_ref117) {
  var title = _ref117.title, rest = _objectWithoutProperties(_ref117, _excluded117);
  return /* @__PURE__ */ React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 513 342"
  }, rest), title && /* @__PURE__ */ React.createElement("title", null, title), /* @__PURE__ */ React.createElement("path", {
    fill: "#FFF",
    d: "M0 0h512v342H0z"
  }), /* @__PURE__ */ React.createElement("circle", {
    fill: "#D80027",
    cx: 256.5,
    cy: 171,
    r: 96
  }));
};
var US = function US2(_ref237) {
  var title = _ref237.title, rest = _objectWithoutProperties(_ref237, _excluded237);
  return /* @__PURE__ */ React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 513 342"
  }, rest), title && /* @__PURE__ */ React.createElement("title", null, title), /* @__PURE__ */ React.createElement("path", {
    fill: "#FFF",
    d: "M0 0h513v342H0z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M0 0h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.7h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513V342H0z",
    fill: "#D80027"
  }), /* @__PURE__ */ React.createElement("path", {
    fill: "#2E52B2",
    d: "M0 0h256.5v184.1H0z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "m47.8 138.9-4-12.8-4.4 12.8H26.2l10.7 7.7-4 12.8 10.9-7.9 10.6 7.9-4.1-12.8 10.9-7.7zm56.3 0-4.1-12.8-4.2 12.8H82.6l10.7 7.7-4 12.8 10.7-7.9 10.8 7.9-4-12.8 10.7-7.7zm56.5 0-4.3-12.8-4 12.8h-13.5l11 7.7-4.2 12.8 10.7-7.9 11 7.9-4.2-12.8 10.7-7.7zm56.2 0-4-12.8-4.2 12.8h-13.3l10.8 7.7-4 12.8 10.7-7.9 10.8 7.9-4.3-12.8 11-7.7zM100 75.3l-4.2 12.8H82.6L93.3 96l-4 12.6 10.7-7.8 10.8 7.8-4-12.6 10.7-7.9h-13.4zm-56.2 0-4.4 12.8H26.2L36.9 96l-4 12.6 10.9-7.8 10.6 7.8L50.3 96l10.9-7.9H47.8zm112.5 0-4 12.8h-13.5l11 7.9-4.2 12.6 10.7-7.8 11 7.8-4.2-12.6 10.7-7.9h-13.2zm56.5 0-4.2 12.8h-13.3l10.8 7.9-4 12.6 10.7-7.8 10.8 7.8-4.3-12.6 11-7.9h-13.5zm-169-50.6-4.4 12.6H26.2l10.7 7.9-4 12.7L43.8 50l10.6 7.9-4.1-12.7 10.9-7.9H47.8zm56.2 0-4.2 12.6H82.6l10.7 7.9-4 12.7L100 50l10.8 7.9-4-12.7 10.7-7.9h-13.4zm56.3 0-4 12.6h-13.5l11 7.9-4.2 12.7 10.7-7.9 11 7.9-4.2-12.7 10.7-7.9h-13.2zm56.5 0-4.2 12.6h-13.3l10.8 7.9-4 12.7 10.7-7.9 10.8 7.9-4.3-12.7 11-7.9h-13.5z",
    fill: "#FFF"
  }));
};
const REGIONS = [
  { id: "chicago", name: "Chicago", country: "USA", code: "US", FlagComponent: US },
  { id: "tokyo", name: "Tokyo", country: "Japan", code: "JP", FlagComponent: JP },
  { id: "sydney", name: "Sydney", country: "Australia", code: "AU", FlagComponent: AU },
  { id: "frankfurt", name: "Frankfurt", country: "Germany", code: "DE", FlagComponent: DE },
  { id: "new-york", name: "New York", country: "USA", code: "US", FlagComponent: US },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", code: "BR", FlagComponent: BR }
];
function RegionSwitcher() {
  const { settings, setSettings } = useSettings();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isChanging, setIsChanging] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const currentRegion = REGIONS.find((r2) => r2.id === settings.region) || REGIONS[0];
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleRegionChange = async (regionId) => {
    if (regionId === settings.region || isChanging) return;
    setIsChanging(true);
    setIsOpen(false);
    try {
      setSettings({ ...settings, region: regionId });
      await setupProxy(regionId, settings.proxyType);
    } catch (error) {
      console.error("Failed to change region:", error);
    } finally {
      setIsChanging(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: containerRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        disabled: isChanging,
        className: "flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs w-full",
        title: `VPN Region: ${currentRegion.name}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            currentRegion.FlagComponent,
            {
              title: currentRegion.country,
              className: "w-5 h-3.5 rounded-sm shadow-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-3.5 h-3.5 text-muted-foreground transition-transform ml-auto ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0.12 },
        className: "absolute top-full mt-1 right-0 w-64 rounded-md border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg overflow-hidden z-50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2.5 py-2 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "VPN Region" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 grid grid-cols-2 gap-1.5", children: REGIONS.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleRegionChange(region.id),
              className: `relative flex flex-col items-center justify-center p-2 rounded-md text-sm transition-all ${region.id === settings.region ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-primary/20" : "bg-card hover:bg-accent border border-border/50 hover:border-border hover:shadow-xs"}`,
              children: [
                region.id === settings.region && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 absolute top-1 right-1 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  region.FlagComponent,
                  {
                    title: region.country,
                    className: "w-12 h-8 rounded shadow-sm mb-1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-[11px] leading-tight", children: region.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground leading-tight", children: region.country })
                ] })
              ]
            },
            region.id
          )) })
        ]
      }
    ) })
  ] });
}
function BrowserOverlay({
  initialUrl,
  onNavigate,
  onRefresh,
  onBack,
  onForward,
  canGoBack,
  canGoForward
}) {
  const { settings, setSettings } = useSettings();
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [urlInput, setUrlInput] = reactExports.useState(initialUrl);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    setUrlInput(initialUrl);
  }, [initialUrl]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate(urlInput);
  };
  const handleHome = () => {
    navigate({ to: "/" });
  };
  const togglePin = () => {
    setSettings({ ...settings, searchBarPinned: !settings.searchBarPinned });
  };
  const shouldBeVisible = settings.searchBarPinned || isVisible;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed bottom-0 left-1/2 -translate-x-1/2 z-50 cursor-pointer",
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.5 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/90 backdrop-blur-sm border border-b-0 border-border rounded-t-lg px-4 py-1 shadow-lg flex items-center gap-2 hover:bg-accent/50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Browser Controls" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: shouldBeVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
        transition: { duration: 0.2 },
        className: "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl",
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleHome,
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: "Home",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onBack,
              disabled: !canGoBack,
              className: "p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Back",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onForward,
              disabled: !canGoForward,
              className: "p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              title: "Forward",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onRefresh,
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: "Refresh",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Omnibox,
            {
              value: urlInput,
              onChange: setUrlInput,
              placeholder: "Enter URL or search...",
              onSubmit: (val) => onNavigate(val)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RegionSwitcher, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/history" }),
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: "History",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/bookmarks" }),
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: "Bookmarks",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/settings" }),
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: "Settings",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$1, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: togglePin,
              className: "p-2 rounded-lg hover:bg-accent transition-colors",
              title: settings.searchBarPinned ? "Unpin" : "Pin",
              children: settings.searchBarPinned ? /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-5 h-5" })
            }
          )
        ] }) })
      }
    ) })
  ] });
}
const searchSchema = type({
  query: "string",
  "target?": "string",
  "forceProxyType?": "string"
  // Force specific mode (e.g., 'scramjet' for GeForce NOW)
});
const Route$6 = createFileRoute("/search")({
  component: Search,
  validateSearch: searchSchema
});
function Search() {
  const search = Route$6.useSearch();
  const displayUrl = atob(search.query);
  const actualUrl = search.target ? atob(search.target) : displayUrl;
  const { settings, setSettings } = useSettings();
  reactExports.useEffect(() => {
    if (window.aclib) {
      window.aclib.runPop({ zoneId: "10602038" });
      window.aclib.runInterstitial({ zoneId: "10602046" });
      window.aclib.runInPagePush({ zoneId: "10602050", maxAds: 2 });
    }
  }, []);
  const [currentUrl, setCurrentUrl] = reactExports.useState(displayUrl);
  const [actualProxyUrl, setActualProxyUrl] = reactExports.useState(actualUrl);
  const [history, setHistory] = reactExports.useState([displayUrl]);
  const [historyIndex, setHistoryIndex] = reactExports.useState(0);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const iframeRef = reactExports.useRef(null);
  const effectiveProxyType = search.forceProxyType || settings.proxyType;
  const proxiedUrl = effectiveProxyType === "scramjet" ? `${"/"}scrammy/${formatSearch(actualProxyUrl)}` : `${"/"}~/${encodeXor(formatSearch(actualProxyUrl))}`;
  reactExports.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const handleLoad = () => {
      setIsLoading(false);
      addHistoryEntry({
        url: currentUrl,
        title: currentUrl,
        // We don't have access to iframe title, so use URL
        visitedAt: Date.now(),
        favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${currentUrl}`
      }).catch(() => {
      });
    };
    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [proxiedUrl, currentUrl]);
  const handleNavigate = (newUrl) => {
    const formattedUrl = formatSearch(newUrl);
    setCurrentUrl(newUrl);
    setActualProxyUrl(newUrl);
    setIsLoading(true);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    if (iframeRef.current) {
      if (settings.proxyType === "scramjet") {
        iframeRef.current.src = `${"/"}scrammy/${formattedUrl}`;
      } else {
        iframeRef.current.src = `${"/"}~/${encodeXor(formattedUrl)}`;
      }
    }
  };
  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const url2 = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(url2);
      setActualProxyUrl(url2);
      setIsLoading(true);
      if (iframeRef.current) {
        if (settings.proxyType === "scramjet") {
          iframeRef.current.src = `${"/"}scrammy/${formatSearch(url2)}`;
        } else {
          iframeRef.current.src = `${"/"}~/${encodeXor(formatSearch(url2))}`;
        }
      }
    }
  };
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const url2 = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(url2);
      setActualProxyUrl(url2);
      setIsLoading(true);
      if (iframeRef.current) {
        if (settings.proxyType === "scramjet") {
          iframeRef.current.src = `${"/"}scrammy/${formatSearch(url2)}`;
        } else {
          iframeRef.current.src = `${"/"}~/${encodeXor(formatSearch(url2))}`;
        }
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-background/80 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-12 h-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 border-4 border-primary/20 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        ref: iframeRef,
        title: "content-viewer",
        src: proxiedUrl,
        className: "fixed inset-0 w-screen border-0",
        style: {
          display: "block",
          height: settings.searchBarPinned ? "calc(100vh - 70px)" : "100vh"
        },
        allowFullScreen: true,
        ...{}
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BrowserOverlay,
      {
        initialUrl: currentUrl,
        onNavigate: handleNavigate,
        onRefresh: handleRefresh,
        onBack: handleBack,
        onForward: handleForward,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < history.length - 1
      }
    )
  ] });
}
const Route$5 = createFileRoute("/privacy")({
  component: Privacy
});
function Privacy() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-screen flex items-start justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl w-full space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "privacy policy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
        "Last updated: ",
        (/* @__PURE__ */ new Date()).toLocaleDateString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Information We Collect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "When you use fern, we automatically collect your IP address for operational purposes. We also use Google Analytics to understand how our service is used, which may collect additional usage data." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "How We Use Your Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We use collected information to operate and improve fern. IP addresses help us prevent abuse and maintain service quality. Analytics data helps us understand usage patterns." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Children's Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete it." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Third-Party Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We use Google Analytics, which is governed by Google's privacy policy. Google may use cookies and other tracking technologies to collect information about your use of the service." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Data Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We implement reasonable security measures to protect your information, but no method of transmission over the internet is 100% secure." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Changes to Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "We may update this privacy policy from time to time. Changes will be posted on this page with an updated date." })
      ] })
    ] })
  ] }) });
}
function HistoryPanel() {
  const navigate = useNavigate();
  const [history, setHistory] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    loadHistory();
  }, []);
  const loadHistory = async () => {
    try {
      setLoading(true);
      const entries = await getHistory(500);
      setHistory(entries);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadHistory();
      return;
    }
    try {
      const results = await searchHistory(query);
      setHistory(results);
    } catch (error) {
      console.error("Failed to search history:", error);
    }
  };
  const handleDelete = async (id2) => {
    try {
      await deleteHistoryEntry(id2);
      setHistory((prev) => prev.filter((entry) => entry.id !== id2));
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };
  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all browsing history?")) return;
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };
  const handleVisit = (entry) => {
    navigate({
      to: "/search",
      search: { query: btoa(entry.url) }
    });
  };
  const groupByDate = (entries) => {
    const groups = {};
    const now2 = Date.now();
    for (const entry of entries) {
      const diff = now2 - entry.visitedAt;
      let label;
      if (diff < 864e5) {
        label = "Today";
      } else if (diff < 1728e5) {
        label = "Yesterday";
      } else if (diff < 6048e5) {
        label = "This week";
      } else {
        const date = new Date(entry.visitedAt);
        label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    }
    return groups;
  };
  const grouped = groupByDate(history);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search$1, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => handleSearch(e.target.value),
            placeholder: "Search history...",
            className: cn(
              "w-full h-10 pl-10 pr-10 rounded-md border border-input bg-background",
              "placeholder:text-muted-foreground outline-none transition-colors",
              "focus:border-ring"
            )
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleClearAll,
          disabled: history.length === 0,
          className: "px-3 py-1.5 text-sm rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
            "Clear All"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Loading history..." }) }) : history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-16 h-16 text-muted-foreground/40 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery ? "No results found" : "No browsing history yet" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: Object.entries(grouped).map(([label, entries]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground sticky top-0 bg-background py-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded overflow-hidden bg-muted flex items-center justify-center flex-shrink-0", children: entry.favicon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: entry.favicon,
                alt: "",
                className: "size-8 object-contain",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", onClick: () => handleVisit(entry), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: entry.title || entry.url }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: entry.url }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(entry.visitedAt).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => entry.id && handleDelete(entry.id),
                className: "opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-destructive/10 text-destructive transition-opacity",
                title: "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ]
        },
        entry.id
      )) })
    ] }, label)) })
  ] });
}
const Route$4 = createFileRoute("/history")({
  component: History
});
function History() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-screen flex items-start justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl w-full space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "browsing history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "View and search your browsing history. Click any entry to revisit the page." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryPanel, {})
  ] }) });
}
const Route$3 = createFileRoute("/credits")({
  component: Credits
});
function Credits() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-full flex items-start justify-center p-8 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl w-full space-y-8 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "credits" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "The team behind fern" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Development" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "fern is made possible by the contributions of dedicated developers who have helped shape and build this project." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Core Team" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "akane" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Main development and UI design" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "proudparrot2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Helped build the initial site and architecture" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "slqnt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Advice and guidance along the way" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Technologies & Libraries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "fern is powered by the following open source projects:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://github.com/mercuryworkshop/scramjet",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline",
                children: "Scramjet"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "A powerful web proxy framework by Mercury Workshop" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://github.com/titaniumnetwork-dev/ultraviolet",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline",
                children: "Ultraviolet"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "A highly sophisticated proxy used for evading internet censorship by Titanium Network" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://github.com/MercuryWorkshop/EpoxyTransport",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline",
                children: "EpoxyTransport"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "A flexible network transport library by Mercury Workshop" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://github.com/MercuryWorkshop/wisp-server-python",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline",
                children: "wisp-server-python"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "A Python implementation of the WISP protocol by Mercury Workshop" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://github.com/MercuryWorkshop/CurlTransport",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline",
                children: "CurlTransport"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "A libcurl-based transport implementation by Mercury Workshop" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Open Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "This project is built with open source technologies and is grateful for the broader community's contributions to the tools and libraries that make fern possible." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Source Code Availability" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Due to dependencies using the AGPL license, the complete source code for this application is available upon request. To receive a copy of the source code, please send a written request with 100 ZAR (to cover postage costs) to:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "877 Pretorius St, Arcadia, Pretoria, 0083, South Africa (PO Box 34)" })
      ] })
    ] })
  ] }) });
}
function BookmarksPanel() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState({});
  const [selectedFolder, setSelectedFolder] = reactExports.useState("all");
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadBookmarks();
  }, []);
  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadBookmarks();
      return;
    }
    try {
      const results = await searchBookmarks(query);
      setBookmarks(results);
    } catch (error) {
      console.error("Failed to search bookmarks:", error);
    }
  };
  const handleDelete = async (id2) => {
    if (!confirm("Delete this bookmark?")) return;
    try {
      await deleteBookmark(id2);
      setBookmarks((prev) => prev.filter((b) => b.id !== id2));
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };
  const handleEdit = (bookmark) => {
    setEditingId(bookmark.id);
    setEditForm(bookmark);
  };
  const handleSave = async () => {
    if (!editingId || !editForm.title || !editForm.url) return;
    try {
      await updateBookmark(editingId, editForm);
      setBookmarks((prev) => prev.map((b) => b.id === editingId ? { ...b, ...editForm } : b));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };
  const handleAdd = async () => {
    if (!editForm.title || !editForm.url) {
      alert("Please fill in title and URL");
      return;
    }
    try {
      const id2 = await addBookmark({
        title: editForm.title,
        url: editForm.url,
        folder: editForm.folder || "Default",
        favicon: editForm.favicon,
        notes: editForm.notes,
        createdAt: Date.now()
      });
      const newBookmark = {
        id: id2,
        title: editForm.title,
        url: editForm.url,
        folder: editForm.folder || "Default",
        favicon: editForm.favicon,
        notes: editForm.notes,
        createdAt: Date.now()
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      setShowAddForm(false);
      setEditForm({});
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };
  const handleVisit = (bookmark) => {
    navigate({
      to: "/search",
      search: { query: btoa(bookmark.url) }
    });
  };
  const folders = Array.from(new Set(bookmarks.map((b) => b.folder)));
  const filteredBookmarks = selectedFolder === "all" ? bookmarks : bookmarks.filter((b) => b.folder === selectedFolder);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search$1, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => handleSearch(e.target.value),
            placeholder: "Search bookmarks...",
            className: cn(
              "w-full h-10 pl-10 pr-10 rounded-md border border-input bg-background",
              "placeholder:text-muted-foreground outline-none transition-colors",
              "focus:border-ring"
            )
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleSearch(""),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setShowAddForm(true);
            setEditForm({ folder: "Default" });
          },
          className: "px-3 py-1.5 text-sm rounded-md border bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5" }),
            "Add Bookmark"
          ]
        }
      )
    ] }),
    folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedFolder("all"),
          className: cn(
            "px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap",
            selectedFolder === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          ),
          children: [
            "All (",
            bookmarks.length,
            ")"
          ]
        }
      ),
      folders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedFolder(folder),
          className: cn(
            "px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap",
            selectedFolder === folder ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-3.5 h-3.5" }),
            folder,
            " (",
            bookmarks.filter((b) => b.folder === folder).length,
            ")"
          ]
        },
        folder
      ))
    ] }),
    showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-md border bg-card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-medium flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5" }),
        "Add New Bookmark"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Title",
            value: editForm.title || "",
            onChange: (e) => setEditForm((prev) => ({ ...prev, title: e.target.value })),
            className: cn(
              "h-9 px-3 rounded-md border border-input bg-background text-sm",
              "placeholder:text-muted-foreground outline-none focus:border-ring"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Folder",
            value: editForm.folder || "",
            onChange: (e) => setEditForm((prev) => ({ ...prev, folder: e.target.value })),
            className: cn(
              "h-9 px-3 rounded-md border border-input bg-background text-sm",
              "placeholder:text-muted-foreground outline-none focus:border-ring"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "url",
          placeholder: "URL (https://example.com)",
          value: editForm.url || "",
          onChange: (e) => setEditForm((prev) => ({ ...prev, url: e.target.value })),
          className: cn(
            "w-full h-9 px-3 rounded-md border border-input bg-background text-sm",
            "placeholder:text-muted-foreground outline-none focus:border-ring"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          placeholder: "Notes (optional)",
          value: editForm.notes || "",
          onChange: (e) => setEditForm((prev) => ({ ...prev, notes: e.target.value })),
          rows: 2,
          className: cn(
            "w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none",
            "placeholder:text-muted-foreground outline-none focus:border-ring"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowAddForm(false);
              setEditForm({});
            },
            className: "px-3 py-1.5 text-sm rounded-md border hover:bg-accent",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleAdd,
            className: "px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
            children: "Save"
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Loading bookmarks..." }) }) : filteredBookmarks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-16 h-16 text-muted-foreground/40 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery ? "No bookmarks found" : "No bookmarks yet" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredBookmarks.map((bookmark) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group p-3 rounded-md border border-border hover:bg-accent transition-colors", children: editingId === bookmark.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: editForm.title || "",
            onChange: (e) => setEditForm((prev) => ({ ...prev, title: e.target.value })),
            className: cn(
              "h-9 px-3 rounded-md border border-input bg-background text-sm",
              "outline-none focus:border-ring"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: editForm.folder || "",
            onChange: (e) => setEditForm((prev) => ({ ...prev, folder: e.target.value })),
            className: cn(
              "h-9 px-3 rounded-md border border-input bg-background text-sm",
              "outline-none focus:border-ring"
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "url",
          value: editForm.url || "",
          onChange: (e) => setEditForm((prev) => ({ ...prev, url: e.target.value })),
          className: cn(
            "w-full h-9 px-3 rounded-md border border-input bg-background text-sm",
            "outline-none focus:border-ring"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: editForm.notes || "",
          onChange: (e) => setEditForm((prev) => ({ ...prev, notes: e.target.value })),
          rows: 2,
          className: cn(
            "w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none",
            "outline-none focus:border-ring"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setEditingId(null);
              setEditForm({});
            },
            className: "px-3 py-1.5 text-sm rounded-md border hover:bg-accent",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSave,
            className: "px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
              "Save"
            ]
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded overflow-hidden bg-muted flex items-center justify-center flex-shrink-0", children: bookmark.favicon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: bookmark.favicon,
          alt: "",
          className: "size-8 object-contain",
          onError: (e) => {
            e.currentTarget.style.display = "none";
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", onClick: () => handleVisit(bookmark), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: bookmark.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap", children: bookmark.folder })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: bookmark.url }),
        bookmark.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: bookmark.notes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleEdit(bookmark),
            className: "p-2 rounded hover:bg-accent",
            title: "Edit",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => bookmark.id && handleDelete(bookmark.id),
            className: "p-2 rounded hover:bg-destructive/10 text-destructive",
            title: "Delete",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }) }, bookmark.id)) })
  ] });
}
const Route$2 = createFileRoute("/bookmarks")({
  component: Bookmarks
});
function Bookmarks() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen w-screen flex items-start justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl w-full space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary hover:underline text-sm", children: "← Back to fern" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-bold font-display", children: "bookmarks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Save and organize your favorite sites. Organize bookmarks into folders for easy access." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarksPanel, {})
  ] }) });
}
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p2) => Promise.resolve(p2).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]"), cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen)
        return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css"), cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`))
        return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss)
        link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce)
        link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss)
        return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej(Error(`Unable to preload CSS for ${dep}`)));
        });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented)
      throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected")
        continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const ENC_DEFAULT_APPS = "PR5QBwJHSEwfEVBCRAsTAwNHSEw/Cgc6EwcXTEpHBxwKR0hMDhEGHhVfXUEfEVwBCwQWD0gGEwgDR15MDwYdADMXHkxcRzsgKiw8KyJfCxpIFRwJRBheFUQMFkxcRxUGRElQAAcIF0xcRzUHEi0HDERJUBsUCVBURA0GGhYWSEFJAhsaDhAQQAUKH0xKRxsNCQsnHApHSEwOEQYeFV9dQQEMBgYTB1wJDxEaGwQEAR0DEQFABQofQQAEBAcFChwdSQMTGA8GHQBIFRwJRBheFUQMFkxcRxYNRElQAAcIF0xcRzYHFQYdHAJHXkwTFx5MXEcaGhIVAVRJShYHFQYdHAJLEQELShMeFkdeTA8GHQAzFx5MXEc7ICosPCsiXxYHFQYdHEgVHAlEGF4VRAwWTFxHBhpESVAABwgXTFxHJgcNMR0FRElQGxQJUFREDQYaFhZIQUkSBRlIERsFEgoZQAUKH0xKRxsNCQsnHApHSEwvKz4nKCA2VBIRXAcFClATSh5QBwJHSEwBCVBCRAsTAwNHSEwhCh0JCgBQQkQQAAJEX1AGEhECHVxKXRkRElwJCQoVAgNLEQELR15MDwYdADMXHkxcRxoaEhUBVElKBRkRSxUBCQIeC0gGHQNJAxMYDwYdAEgMEQFEGF4VRAwWTFxHBhlESVAABwgXTFxHJhkPEQYLFEoqTEpHBxwKR0hMDhEGHhVfXUEeSxEBC0deTA8GHQAzFx5MXEc7ICosPCsiXwYZDxFcBwUKUBNKHlAHAkdITBQKEAIJHVBCRAsTAwNHSEw0ChACCR1QQkQQAAJEX1AGEhECHVxKXQAJElwJAUoCAgccXRwJBx4BHkgRARQVHRwHERsBCEpHXVJcXRwJBx4BHkdeTA8GHQAzFx5MXEc7ICosPCsiXwABBAkdQBYLFUwbSQlMDwFQVEQCFABESVAABwgXTFxHNQsgCgANA0U8ITFHXkwTFx5MXEcaGhIVAVRJSgICBxxcCQMDHRwFABwBEUsRAQtHXkwPBh0AMxceTFxHOyAqLDwrIl8VCEgVHAlEGF4VRAwWTFxHEBlESVAABwgXTFxHPwEQDBcdRElQGxQJUFREDQYaFhZIQUkHFwsFDVwZBxERBkQYXhVEDBZMXEcVDwsAAUxKRxwPCwBQVEQiEwMDFlBCRBAAAkRfUAYSEQIdXEpdCAMXHEAEAAEaSR1FBV8IQB5IDQYDCkdeTA8GHQAzFx5MXEdQEzs=";
const DEFAULT_KEY = "fern";
function decodeXorBase64(b64, key) {
  const bin = atob(b64);
  let out = "";
  for (let i2 = 0; i2 < bin.length; i2++) {
    out += String.fromCharCode(bin.charCodeAt(i2) ^ key.charCodeAt(i2 % key.length));
  }
  return out;
}
const DEFAULT_APPS = (() => {
  try {
    return JSON.parse(decodeXorBase64(ENC_DEFAULT_APPS, DEFAULT_KEY));
  } catch {
    return [];
  }
})();
const APPS_VERSION = 2;
function loadApps() {
  try {
    const raw = localStorage.getItem("quickApps");
    const version = parseInt(localStorage.getItem("quickAppsVersion") || "0", 10);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored)) {
        if (version < APPS_VERSION) {
          const storedIds = new Set(stored.map((app) => app.id));
          const newApps = DEFAULT_APPS.filter((app) => !storedIds.has(app.id));
          const merged = [...stored, ...newApps];
          localStorage.setItem("quickApps", JSON.stringify(merged));
          localStorage.setItem("quickAppsVersion", APPS_VERSION.toString());
          return merged;
        }
        return stored;
      }
    }
    localStorage.setItem("quickAppsVersion", APPS_VERSION.toString());
  } catch {
  }
  return DEFAULT_APPS;
}
function saveApps(apps) {
  try {
    localStorage.setItem("quickApps", JSON.stringify(apps));
  } catch {
  }
}
const LOCAL_FAVICONS = {
  "www.youtube.com": INLINED_ICONS["yt.png"],
  "youtube.com": INLINED_ICONS["yt.png"],
  "yt.omada.cafe": INLINED_ICONS["yt.png"],
  "discord.com": INLINED_ICONS["discor.png"],
  "discordapp.com": INLINED_ICONS["discor.png"],
  "www.reddit.com": INLINED_ICONS["redit.ico"],
  "reddit.com": INLINED_ICONS["redit.ico"],
  "www.tiktok.com": INLINED_ICONS["tt.ico"],
  "tiktok.com": INLINED_ICONS["tt.ico"],
  "x.com": INLINED_ICONS["twit.ico"],
  "www.x.com": INLINED_ICONS["twit.ico"],
  "twitter.com": INLINED_ICONS["twit.ico"],
  "www.twitter.com": INLINED_ICONS["twit.ico"],
  "beech.watch": INLINED_ICONS["beech.ico"],
  "www.beech.watch": INLINED_ICONS["beech.ico"]
};
function faviconFor(url2, explicit) {
  try {
    const u2 = new URL(url2);
    if (LOCAL_FAVICONS[u2.hostname]) return LOCAL_FAVICONS[u2.hostname];
    if (explicit) {
      if (explicit.startsWith("INLINED:")) {
        const iconName = explicit.substring(8);
        return INLINED_ICONS[iconName] || explicit;
      }
      if (explicit.startsWith("/")) {
        return `${"/"}${explicit.slice(1)}`;
      }
      return explicit;
    }
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${u2.protocol}//${u2.hostname}`;
  } catch {
    if (explicit) {
      if (explicit.startsWith("INLINED:")) {
        const iconName = explicit.substring(8);
        return INLINED_ICONS[iconName] || explicit;
      }
      if (explicit.startsWith("/")) {
        return `${"/"}${explicit.slice(1)}`;
      }
    }
    return explicit || void 0;
  }
}
function QuickApps() {
  const navigate = useNavigate();
  const [apps, setApps] = reactExports.useState(() => loadApps());
  const [editMode, setEditMode] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [draft, setDraft] = reactExports.useState(null);
  const [loadingAppId, setLoadingAppId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    saveApps(apps);
  }, [apps]);
  const startEdit = (app) => {
    setEditMode(true);
    if (app) {
      setEditingId(app.id);
      setDraft({ ...app });
    } else {
      setEditingId("new");
      setDraft({ id: crypto.randomUUID(), name: "", url: "", iconUrl: "" });
    }
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };
  const saveEdit = () => {
    if (!draft) return;
    const clean = {
      id: draft.id || crypto.randomUUID(),
      name: draft.name?.trim() || "App",
      url: draft.url?.trim(),
      iconUrl: draft.iconUrl?.trim() || void 0
    };
    if (!clean.url) return;
    setApps((prev) => {
      const exists = prev.some((a2) => a2.id === clean.id);
      const next2 = exists ? prev.map((a2) => a2.id === clean.id ? clean : a2) : [...prev, clean];
      return next2;
    });
    setEditingId(null);
    setDraft(null);
  };
  const removeApp = (id2) => {
    setApps((prev) => prev.filter((a2) => a2.id !== id2));
    if (editingId === id2) cancelEdit();
  };
  const openApp = async (app) => {
    if (loadingAppId) return;
    try {
      setLoadingAppId(app.id);
      if (app.id === "gfn") {
        const { setupProxy: setupProxy2 } = await __vitePreload(async () => {
          const { setupProxy: setupProxy3 } = await Promise.resolve().then(function() {
            return sw;
          });
          return { setupProxy: setupProxy3 };
        }, true ? void 0 : void 0);
        const settingsStr = localStorage.getItem("fern-settings");
        const settings = settingsStr ? JSON.parse(settingsStr) : {};
        if (settings.proxyType !== "scramjet") {
          settings.proxyType = "scramjet";
          localStorage.setItem("fern-settings", JSON.stringify(settings));
          await setupProxy2(settings.region, "scramjet");
        }
        const params2 = {
          query: btoa(app.url),
          ...app.proxyUrl ? { target: btoa(app.proxyUrl) } : {},
          forceProxyType: "scramjet"
        };
        navigate({ to: "/search", search: params2 });
        return;
      }
      if (app.id === "games") {
        const { setupProxy: setupProxy2 } = await __vitePreload(async () => {
          const { setupProxy: setupProxy3 } = await Promise.resolve().then(function() {
            return sw;
          });
          return { setupProxy: setupProxy3 };
        }, true ? void 0 : void 0);
        const settingsStr = localStorage.getItem("fern-settings");
        const settings = settingsStr ? JSON.parse(settingsStr) : {};
        if (settings.proxyType !== "ultraviolet") {
          settings.proxyType = "ultraviolet";
          localStorage.setItem("fern-settings", JSON.stringify(settings));
          await setupProxy2(settings.region, "ultraviolet");
        }
        const params2 = {
          query: btoa(app.url),
          ...app.proxyUrl ? { target: btoa(app.proxyUrl) } : {},
          forceProxyType: "ultraviolet"
        };
        navigate({ to: "/search", search: params2 });
        return;
      }
      if (app.id === "roblox" && false) ;
      const params = {
        query: btoa(app.url),
        ...app.proxyUrl ? { target: btoa(app.proxyUrl) } : {}
      };
      navigate({ to: "/search", search: params });
    } finally {
      setLoadingAppId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium text-muted-foreground", children: "Quick apps" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "text-xs px-2 py-1 rounded-md border hover:bg-accent",
          onClick: () => setEditMode((v) => !v),
          children: editMode ? "Done" : "Edit"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
      apps.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "w-full h-20 rounded-md border bg-card hover:bg-accent transition-colors flex flex-col items-center justify-center gap-2 px-2 relative",
            onClick: () => !editMode && openApp(app),
            disabled: loadingAppId === app.id,
            children: loadingAppId === app.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-md overflow-hidden bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate max-w-full", children: "Loading..." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-md overflow-hidden bg-muted flex items-center justify-center", children: app.id === "bw" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "size-5 text-foreground" }) : app.id === "games" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Gamepad2, { className: "size-5 text-foreground" }) : faviconFor(app.url, app.iconUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: faviconFor(app.url, app.iconUrl),
                    alt: "",
                    className: "size-7 object-contain",
                    loading: "lazy"
                  }
                )
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: app.name?.[0]?.toUpperCase() || "?" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate max-w-full", children: app.name })
            ] })
          }
        ),
        editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-2 -right-2 flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "size-6 rounded-full border bg-background hover:bg-accent text-xs",
              onClick: () => startEdit(app),
              title: "Edit",
              children: "✎"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "size-6 rounded-full border bg-background hover:bg-destructive text-destructive-foreground text-xs",
              onClick: () => removeApp(app.id),
              title: "Remove",
              children: "×"
            }
          )
        ] })
      ] }, app.id)),
      editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "h-20 rounded-md border border-dashed hover:bg-accent flex items-center justify-center text-sm text-muted-foreground",
          onClick: () => startEdit(),
          "aria-label": "Add app",
          children: "+ Add"
        }
      )
    ] }),
    editMode && draft && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border bg-card p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: draft.name,
            onChange: (e) => setDraft({ ...draft, name: e.currentTarget.value }),
            placeholder: "My App",
            className: cn(
              "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
              "placeholder:text-muted-foreground outline-none transition-colors",
              "focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: draft.url,
            onChange: (e) => setDraft({ ...draft, url: e.currentTarget.value }),
            placeholder: "https://example.com",
            className: cn(
              "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
              "placeholder:text-muted-foreground outline-none transition-colors",
              "focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Icon URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: draft.iconUrl || "",
            onChange: (e) => setDraft({ ...draft, iconUrl: e.currentTarget.value }),
            placeholder: "https://.../favicon.png (optional)",
            className: cn(
              "h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
              "placeholder:text-muted-foreground outline-none transition-colors",
              "focus:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 text-sm rounded-md border hover:bg-accent", onClick: cancelEdit, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 py-1 text-sm rounded-md border bg-primary text-primary-foreground hover:opacity-90", onClick: saveEdit, children: "Save" })
      ] })
    ] })
  ] });
}
const ShootingStars = () => {
  const canvasRef = reactExports.useRef(null);
  const starsRef = reactExports.useRef([]);
  const constellationsRef = reactExports.useRef([]);
  const shootingStarsRef = reactExports.useRef([]);
  const animationFrameRef = reactExports.useRef();
  const getThemeColor = () => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    return primaryColor || "oklch(0.4679 0.0592 152.3811)";
  };
  const oklchToRgb = (oklchString) => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? "rgba(168, 247, 213, " : "rgba(79, 141, 107, ";
  };
  const generateStars = (width, height, count) => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 5e-3,
      twinklePhase: Math.random() * Math.PI * 2
    }));
  };
  const generateConstellations = (width, height) => {
    const constellations = [];
    const numConstellations = 5;
    for (let i2 = 0; i2 < numConstellations; i2++) {
      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      const numStars = Math.floor(Math.random() * 4) + 4;
      const radius = Math.random() * 80 + 60;
      const stars = Array.from({ length: numStars }, (_, j) => {
        const angle = j / numStars * Math.PI * 2 + Math.random() * 0.5;
        const dist = radius * (0.6 + Math.random() * 0.4);
        return {
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist
        };
      });
      const connections = [];
      for (let j = 0; j < numStars; j++) {
        const numConnections = Math.random() > 0.5 ? 2 : 1;
        for (let k = 1; k <= numConnections; k++) {
          const nextIndex = (j + k) % numStars;
          connections.push([j, nextIndex]);
        }
      }
      constellations.push({ stars, connections });
    }
    return constellations;
  };
  const createShootingStar = (width, height) => {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      // Upper half of screen
      length: Math.random() * 80 + 60,
      speed: Math.random() * 3 + 2,
      angle: Math.PI / 4 + Math.random() * 0.3,
      // ~45 degrees with variation
      opacity: 1
    };
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = generateStars(canvas.width, canvas.height, 200);
      constellationsRef.current = generateConstellations(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    let lastShootingStarTime = Date.now();
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseColor = oklchToRgb(getThemeColor());
      starsRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const opacity = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = baseColor + opacity + ")";
        ctx.fill();
      });
      constellationsRef.current.forEach((constellation) => {
        ctx.strokeStyle = baseColor + "0.15)";
        ctx.lineWidth = 1;
        constellation.connections.forEach(([i2, j]) => {
          const star1 = constellation.stars[i2];
          const star2 = constellation.stars[j];
          ctx.beginPath();
          ctx.moveTo(star1.x, star1.y);
          ctx.lineTo(star2.x, star2.y);
          ctx.stroke();
        });
        constellation.stars.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = baseColor + "0.6)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = baseColor + "0.2)";
          ctx.fill();
        });
      });
      const now2 = Date.now();
      if (now2 - lastShootingStarTime > 1500 + Math.random() * 2e3) {
        shootingStarsRef.current.push(createShootingStar(canvas.width, canvas.height));
        lastShootingStarTime = now2;
      }
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        if (star.opacity <= 0) return false;
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        gradient.addColorStop(0, baseColor + star.opacity + ")");
        gradient.addColorStop(1, baseColor + "0)");
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = baseColor + star.opacity + ")";
        ctx.fill();
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.01;
        return star.opacity > 0 && star.x < canvas.width + 100 && star.y < canvas.height + 100;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "fixed inset-0 pointer-events-none",
      style: { zIndex: 0 }
    }
  );
};
const Route$1 = createFileRoute("/")({
  component: Home
});
function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-screen flex items-center justify-center flex-col space-y-8 relative py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShootingStars, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-6xl font-bold font-display relative z-10", children: "fern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-96 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Omnibox,
          {
            value: query,
            onChange: setQuery,
            placeholder: "search...",
            onSubmit: (val) => {
              navigate({
                to: "/search",
                search: { query: btoa(val) }
              });
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RegionSwitcher, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickApps, {}) })
    ] })
  ] });
}
const Route2 = createFileRoute("/scrammy/$")({
  component: RouteComponent
});
function RouteComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "looks like you tried to make a request to Scramjet but it didn't go through correctly - please report this in our discord server" });
}
const X7k9m2pRoute = Route$9.update({
  id: "/x7k9m2p",
  path: "/x7k9m2p",
  getParentRoute: () => Route$a
});
const TermsRoute = Route$8.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$a
});
const SettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$a
});
const SearchRoute = Route$6.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$a
});
const PrivacyRoute = Route$5.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$a
});
const HistoryRoute = Route$4.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => Route$a
});
const CreditsRoute = Route$3.update({
  id: "/credits",
  path: "/credits",
  getParentRoute: () => Route$a
});
const BookmarksRoute = Route$2.update({
  id: "/bookmarks",
  path: "/bookmarks",
  getParentRoute: () => Route$a
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const ScrammySplatRoute = Route2.update({
  id: "/scrammy/$",
  path: "/scrammy/$",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  BookmarksRoute,
  CreditsRoute,
  HistoryRoute,
  PrivacyRoute,
  SearchRoute,
  SettingsRoute,
  TermsRoute,
  X7k9m2pRoute,
  ScrammySplatRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const router = createRouter({
  routeTree,
  basepath: void 0
});
if (window.location.pathname.endsWith("/index.html")) {
  const newPath = window.location.pathname.replace("/index.html", "/");
  window.history.replaceState({}, "", newPath + window.location.search + window.location.hash);
}
const getInitialProxyType = () => {
  try {
    const settings = localStorage.getItem("fern-settings");
    if (settings) {
      const parsed2 = JSON.parse(settings);
      return parsed2.proxyType || DEFAULT_SETTINGS.proxyType;
    }
  } catch (e) {
  }
  return DEFAULT_SETTINGS.proxyType;
};
await setupProxy(void 0, getInitialProxyType());
const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router }) })
  );
}
