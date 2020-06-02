const compileUtil = {
  getVal(expr, vm) {
    return expr.split(".").reduce((data, currentVal) => {
      return data[currentVal];
    }, vm.$data);
  },
  serVal(expr, vm, inputVal) {
    return expr.split(".").reduce((data, currentVal) => {
      data[currentVal] = inputVal;
    }, vm.$data);
  },
  getContentVal(expr, vm) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(args[1], vm);
    });
  },
  text(node, expr, vm) {
    let value;
    if (expr.indexOf("{{") !== -1) {
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        new Watcher(vm, args[1], () => {
          this.updater.textUpdater(node, this.getContentVal(expr, vm));
        });
        return this.getVal(args[1], vm);
      });
    } else {
      value = this.getVal(expr, vm);
    }
    this.updater.textUpdater(node, value);
  },
  html(node, expr, vm) {
    const value = this.getVal(expr, vm);
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal);
    });
    this.updater.htmlUpdater(node, value);
  },
  model(node, expr, vm) {
    const value = this.getVal(expr, vm);
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    });
    node.addEventListener("input", (e) => {
      this.serVal(expr, vm, e.target.value);
    });
    this.updater.modelUpdater(node, value);
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr];
    node.addEventListener(eventName, fn.bind(vm), false);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};
class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    const fragment = this.node2Fragment(this.el);

    this.compile(fragment);

    this.el.appendChild(fragment);
  }
  compile(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        this.compileElement(child);
      } else {
        this.compileText(child);
      }

      if (child.childNodes && child.childNodes.length) {
        this.compile(child);
      }
    });
  }
  compileElement(node) {
    const attributes = node.attributes;
    [...attributes].forEach((attr) => {
      const { name, value } = attr;
      if (this.isDirective(name)) {
        const [, dirctive] = name.split("-");
        const [dirName, eventName] = dirctive.split(":");
        compileUtil[dirName](node, value, this.vm, eventName);
        node.removeAttribute("v-" + dirctive);
      } else if (this.isEventName(name)) {
        let [, eventName] = name.split("@");
        compileUtil["on"](node, value, this.vm, eventName);
      }
    });
  }
  compileText(node) {
    const content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      compileUtil["text"](node, content, this.vm);
    }
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isEventName(attrName) {
    return attrName.startsWith("@");
  }
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  node2Fragment(el) {
    const f = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      f.appendChild(firstChild);
    }
    return f;
  }
}
class MVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) {
      //1.实现一个数据观察者
      //2.实现一个指令解析器
      new Observer(this.$data);
      new Compile(this.$el, this);
      this.proxyData(this.$data);
    }
  }
  proxyData(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        },
      });
    }
  }
}
