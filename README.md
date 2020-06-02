# dataBinding

双向数据绑定

你理解的 MVVM 响应式原理
vue 是采用数据劫持配合发布者-订阅者模式的方式，通过 object.defineproperty()来劫持各个属性的 setter 和 getter，在数据变动时，发布消息给依赖收集器，去通知观察者，作出对应的回调函数，去更新视图

MVVM 作为绑定的入口，整合 observer，compile 和 watcher 三者，通过 observer 来监听 model 数据变化，通过 compile 来解析编译模版指令，最终利用 watcher 搭起 observer、compile 之间的通信桥梁，达到数据变化影响视图更新；视图交互变化对应的数据 model 变更的双向绑定效果。
