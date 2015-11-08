# UPYUN 自定义菜单插件

这是一个可以向 UPYUN 网页控制台插入自定义菜单的插件，插件自带一个“上传文件”的自定义菜单，可以在“通用”菜单下找到。

# 添加菜单

这个插件可以通过二次开发添加自定义菜单。

## 添加自定义菜单数据

编辑`js/custom-menu.js`，以菜单名作为`key`扩充`customMenuData`对象，每个自定义菜单包含3个属性，`parentMenu`、`layout`和`controller`，其中`parentMenu`为必选项，代表自定义菜单要插入的父系菜单名，“通用”为“general”，“CDN 设置”为“cdn”，“防盗链”为“antileech”，“监控”为“monitor”，“日志”为“logs”，“工具箱”为“toolbox”，“费用中心”为“billing”，“
帐号管理”为“account”。注意，应避免选择`cdn`作为`parent`，因为“CDN 设置”菜单并不总是可用的。

`layout`可选，如果制定了`layout`，应在`layout/`下创建相应名称的HTML文件，带有`layout`属性的自定义菜单被点击后会在UPYUN控制台上弹出包含此`layout`的浮动层。

`controller`也是可选的，标明自定义菜单被点击时要运行的函数。`controller`指定的函数会在`layout`载入完毕之后运行，所以可以放心使用`controller`操纵`layout`中的DOM。

同时，插件会根据`customMenuData`的`key`自动到`_local/<languange>/message.json`中查找`CM_<key>`的值作为菜单中显示的名称，如果找不到，就会显示`__CM_<key>__`。

## 编写自定义菜单控制器

自定义菜单控制器通过`js/custom-menu.js`中定义的`controller`指明。指明`controller`之后，需要到`js/controller.js`中将控制器按照指明的名称，通过`prototype`扩展到`customMenuController`中。

如果插件找不到`customMenuController`包含指定的控制器，点击相应菜单时会弹出错误提示。

`controller`需要用到的辅助函数不要写在`js/controller.js`里面，`js/controller.js`应只包含与`customMenuController`相关的代码，辅助函数请写进`js/functions.js`里面。

## Layout样式

对于提供弹出浮动层的菜单，可以通过`css/custom-menu-layout.css`添加相关的样式。

## 利用已有的API

`js/content.js`里面已经定义了一些常用的函数，可以直接调用：

* `getViewName` - 获取UPYUN控制台当前视图名
* `getTemplete` - 获取UPYUN控制台当前视图模板名
* `isBuckets` - 当前页面是否为空间管理页面
* `getBucketName` - 获取当前空间名

`js/background.js`里面包含了上传文件的API，具体工作方法可以参见`js/functions.js`中的实现。

# 授权许可

MIT协议开源，请随意使用。