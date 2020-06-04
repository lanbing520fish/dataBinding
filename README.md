# dataBinding

双向数据绑定

你理解的 MVVM 响应式原理
vue 是采用数据劫持配合发布者-订阅者模式的方式，通过 object.defineproperty()来劫持各个属性的 setter 和 getter，在数据变动时，发布消息给依赖收集器，去通知观察者，作出对应的回调函数，去更新视图
MVVM 作为绑定的入口，整合 observer，compile 和 watcher 三者，通过 observer 来监听 model 数据变化，通过 compile 来解析编译模版指令，最终利用 watcher 搭起 observer、compile 之间的通信桥梁，达到数据变化影响视图更新；视图交互变化对应的数据 model 变更的双向绑定效果。
#------------------------------------------#
在 new Vue 的时候，在 Observer 中通过 Object.defineProperty()达到数据劫持，代理所有数据的 getter 和 setter 属性，在每次触发 setter 的时候，都会通过 Dep 来通知 Watcher，Watcher 作为 Observer 数据监听器与 Compile 模板解析器之间的桥梁，当 Observer 监听到数据发生改变的时候，通过 Updater 来通知 Compile 更新视图

而 Compile 通过 Watcher 订阅对应数据，绑定更新函数，通过 Dep 来添加订阅者，达到双向绑定
#------------------------------------------#
Vue 实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter,getter,在数据变动时发布消息给订阅者，触发相应监听回调。
第一步：需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter，给这个对象的某个值赋值，就会触发 setter，这样就可以监听到了数据变化
第二步：compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。
地散步：watcher 订阅者是 observer 和 compile 之间通信的桥梁，主要做的事情是：
① 在自身实例化时往属性订阅器里面添加自己
② 自身必须有一个 update()方法
③ 待属性变动 dep.notice()通知时，能调用自身的 uodata()方法，并触发 compile 中绑定的回调
第四步：MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。
#------------------------------------------#
输入框内容变化时，Data 中的数据同步变化。即 View => Data 的变化。
Data 中的数据变化时，文本节点的内容同步变化。即 Data => View 的变化。
其中，View 变化更新 Data ，可以通过事件监听的方式来实现，所以 Vue 的数据双向绑定的工作主要是如何根据 Data 变化更新 View。
Vue 主要通过以下 4 个步骤来实现数据双向绑定的：
实现一个监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
实现一个解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。
实现一个订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。
