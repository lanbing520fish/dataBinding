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
        console.log(name, "true");
      }
    });
  }
  compileText(node) {}
  isElementNode(node) {
    return node.nodeType === 1;
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
      new Compile(this.$el, this);
    }
  }
}
