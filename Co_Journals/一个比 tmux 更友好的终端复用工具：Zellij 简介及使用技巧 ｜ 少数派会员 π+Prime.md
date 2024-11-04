---
created: 2024-11-04T11:19:13 (UTC +08:00)
tags: []
source: https://sspai.com/prime/story/get-started-with-zellij
author: so1ar
---

# 一个比 tmux 更友好的终端复用工具：Zellij 简介及使用技巧 ｜ 少数派会员 π+Prime

> ## Excerpt
> 一个比 tmux 界面更加友好的界面，键位更容易理解的终端复用器。

---
## 前言

在终端环境下，一种特别实用的工具就是「复用器」（multiplexer），它的功能是将一个终端会话划分为多个。这样的好处除了可以「一心多用」，还便于管理会话，不会仅仅因为误关终端窗口、SSH 断开而丢失正在执行的任务。

对于大多数用户，最熟悉的终端复用器大概就是经典的 [tmux](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Ftmux%2Ftmux)——这个名字就是 terminal multiplexer 的缩写。围绕 tmux 也存在着一个庞大的插件生态，从而使 tmux 成为了一个功能强大，且拥有近乎无限可能性的工具。

但即使知道 tmux 的好处，一直以来我都很少用过，主要原因在于操作还是有些复杂了。tmux 迷惑的默认键位设置则更是雪上加霜；网上分享的自定义配置有相当比例都以大批量修改快捷键开头，足以说明默认设定的离谱。（有理由怀疑 tmux 的作者是一个拥有 20 根手指的外星人，同时还在使用一个十分小众的非 Qwerty 排列的键盘。）

最近，我发现了一个名叫 [Zellij](https://sspai.com/link?target=https%3A%2F%2Fzellij.dev%2F) 的工具，虽然开发者并不将其宣传为 tmux 的替代品，但它确实可以很好地替代 tmux，并且有更加友好的界面，和更容易理解的键位，并且还有十分详尽的使用[文档](https://sspai.com/link?target=https%3A%2F%2Fzellij.dev%2Fdocumentation%2F)。这篇文章中，我就来介绍一下自己的使用体验和经验。

## 安装与初次使用

Zellij 目前支持 macOS 与大多数 Linux 发行版，并存在于很多软件包仓库中，可以使用自己常用的包管理器来安装，同时因为它是一个 rust 程序，也可以使用 cargo 来安装。安装完成后，运行 `zellij` 就可以开始使用了。

在正式开始使用之前，需要先了解一些基本概念。用过 tmux 的朋友知道，它把终端操作分为三个层级，分别是会话（session）、窗口（window）和窗格（pane）：

-   tmux 可以同时运行多个会话，各个会话之间是相互独立的；
-   每个会话之下可以分出一个或多个窗口，每个窗口占据一整个终端页面；
-   在每个窗口之下，又可以分出多个小的窗格。

Zellij 也采用了相似的层级，不过窗口改名叫标签（tab），我个人觉得更符合当今图形界面下的称呼习惯。

在默认配置下，Zellij 的界面如下图所示，终端位于中间，上方和下方各有一个状态栏：

-   上方的状态栏显示了当前的会话名称与标签，如果没有指定会话名称，就会随机生成一个；
-   下方的状态栏则是显示的是可用的按键绑定。

![](https://cdnfile.sspai.com/2024/10/21/94ca570c6ffe0d091492cc97a15463fe.png?imageView2/2/format/webp)

另一个与 tmux 的不同之处在于，Zellij 没有将 prefix 键（必须前置于其他快捷键按下的组合键）限定为一个，而是允许定义多个，每个对应了不同的「模式」。比如说 pane 模式专门针对各个窗格，tab 模式专门针对标签，等等。这样更便于记忆，也更方便分配键位。

下面我们来看看如何设置终端分屏，这主要是在 pane 模式下操作的，默认的 prefix 键位是 `ctrl+p`。此时，下方的快捷键提示就会显示可用的快捷键，比如 `n` 是新建窗格，`x` 是关闭当前选中窗格，`c` 是重命名当前窗格，`h/j/k/l` 或方向键是在不同窗格之间移动；等等。

（如果你嫌麻烦，Zellij 还提供了一些不需要进入 pane 模式就可以操作窗格的快捷键，都是 `alt` 组合键：`alt+n` 创建新窗格，`alt + h/j/k/l` 或方向键在窗格之间移动，还有 `alt + [/]` 可以在预设的几种布局之间切换。）

![](https://cdnfile.sspai.com/2024/10/21/28672ffa4ab0e555d3c5ae3dfdaf1865.gif)

![](https://cdnfile.sspai.com/2024/10/21/2a1e5dca93939d15ccdb88bd794d963d.gif)

要想调整窗格尺寸，可以使用快捷键 `alt + +/-` 来调整横向尺寸，或是按 `ctrl+n` 进入 resize 模式，使用 `h/j/k/l` 或方向键来精细调整。

![](https://cdnfile.sspai.com/2024/10/21/80266e0da4c91ab6c71dbd079641579a.gif)

要想滚动查看终端中的历史，可以按下 `ctrl+s` 进入 search 模式，然后使用 `j` 和 `k` 上下滚动，使用 `d` 和 `u` 翻页，或者按 `e` 使用默认的文本编辑器浏览终端历史输出。

![](https://cdnfile.sspai.com/2024/10/21/323734e426d24d9369654f73512eafb2.gif)

再看按下 `ctrl+t` 进入的 tab 模式，在这个模式下，`n` 是创建新标签，`x` 是关闭当前标签，`r` 是重命名当前标签，`h` 和 `l` 是在不同标签之间切换，数字键切换到对应序号的标签，`b` 是将当前窗格转移到一个新的标签，两个中括号则是将当前窗格在不同标签之间移动。还有一个特殊的 sync 模式，按 `s` 进入，可以让当前标签内所有窗格同时输入相同的内容。

![](https://cdnfile.sspai.com/2024/10/21/5f9e315fcfafe17984ebb83879d55b95.gif)

最后看看按下 `ctrl+o` 进入的 session 模式。在这个模式下只有两个可用的快捷键：

-   d 是将当前会话断开连接，会话仍会在后台运行不会停止；
-   w 会在一个浮动窗格中打开一个会话管理器。会话管理器中又有三个标签，可以使用 TAB 键 切换。默认是在第二标签，显示当前正在运行的会话，使用方向键选中，按下回车键重新连接到会话，ctrl+r 是重命名会话，delete 键是关闭选中的会话，ctrl+d 是关闭除了当前会话以外的所有会话，这些都在下方的快捷键提示中。第三个标签则显示的是之前关闭的会话，可以选择将会话恢复到关闭前的状态，这个功能在 tmux 里需要借助外部插件才能实现，而 Zellij 是开箱即用的。第一个标签是创建新的会话，可以指定会话名称，或是留空让它随机生成。

![](https://cdnfile.sspai.com/2024/10/21/6aa3af9c04090242255ca5929b772ccc.gif)

Zellij 默认的 prefix 键有时可能会与其他的终端程序产生键位冲突，为了缓解这个问题，Zellij 又提供了一个特殊的 locked 模式，按下 ctrl+g 进入，在这个模式下，Zellij 其他的 prefix 键都会被禁用，只有重新按下 ctrl+g 解除 locked 模式才可以重新使用 prefix 键。

![](https://cdnfile.sspai.com/2024/10/21/0bb0531a3f62fa3b607cb87e14c9caab.png?imageView2/2/format/webp)

对于 tmux 遗老，Zellij 也提供了一个 tmux 模式，按下 ctrl+b 就可以进入，在这个模式下的快捷键与 tmux 相同，不过并不是所有 tmux 快捷键都有，只有一些常用的键位。

![](https://cdnfile.sspai.com/2024/10/21/a392ea7978ed8d447383092a6f5576b2.gif)

在终端中，运行 `zellij list-sessions` 可以列出打开过的会话，包括正在运行的和已经关闭的，运行 `zellij attach session_name` 就可以连接到指定名字的会话，如果会话已经关闭，就将会话恢复到关闭前的状态。

## 一些高级用法

### 跟随终端启动

对于 bash，需要在 `.bashrc` 中添加一行

```
eval "$(zellij setup --generate-auto-start bash)"
```

对于 zsh 用户，需要在 `.zshrc` 中添加一行

```
 eval "$(zellij setup --generate-auto-start zsh)"
```

另外还有两个相关环境变量：

-   如果 `ZELLIJ_AUTO_ATTACH` 设为 `true`，后台已经有会话在运行的话，Zellij 会自动连接到最近的会话；
-   如果 `ZELLIJ_AUTO_EXIT` 设为 `true`，退出 Zellij 后也会一起退出上层的终端，这样一来，Zellij 就和终端融为一体，不需要每次手动打开 Zellij 了。

不过因为 Zellij 是一个比较年轻的项目，难免运行不稳定，这时就很有可能连终端也无法打开（因为我自己就遇到过这种情况🤣）。另外这样自动启动 Zellij，会导致有一个额外的 shell 进程在后台运行，对强迫症不太友好。

目前我自己的使用方法是，将一个快捷键绑定到 `foot zellij attach -c my_zellij_session` 命令，它的作用是使用 foot 终端模拟器（你可以改成自己惯用的终端模拟器）打开 Zellij，并自动连接到名为 `my_zellij_session` 的会话；如果会话不存在，就自动创建一个。

更多细节可以看官方[文档](https://sspai.com/link?target=https%3A%2F%2Fzellij.dev%2Fdocumentation%2Fintegration%23autostart-on-shell-creation)。

### 使用更简洁的布局

如果你已经熟悉了 Zellij 的快捷键，又觉得默认的布局有些太杂乱了，Zellij 也内置了其他布局可供选择，具体可以看[这里](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fzellij-org%2Fzellij%2Ftree%2Fmain%2Fzellij-utils%2Fassets%2Flayouts)。

例如，如果想要一个比较简洁的布局，可以运行 `zellij -l compact` 使用 compact 布局。这个布局去掉了快捷键提示的状态栏，并把顶部的 tab 状态栏移到了下方，看起来要干净不少。

![](https://cdnfile.sspai.com/2024/10/21/6a7b36785baeac2b1b91f148340fa086.png?imageView2/2/format/webp)

除此之外，如果觉得窗格的边框太扎眼而且占用空间，进入 pane 模式后，按 `z` 就可以禁用窗格的边框，再按一次就可以重新启用边框。不过这个操作是一次性的，下次重新打开 Zellij 还需要重复上述操作，这个行为可以通过配置文件修改，详见下一节。

![](https://cdnfile.sspai.com/2024/10/21/104b0bad539469ee0e0aba2a9d74c9bb.gif)

## 配置文件

Zellij 默认会在 `~/.config/zellij/` 目录下寻找名为 `config.kdl` 的配置文件，关于 kdl 格式的详细介绍可以查看相关的[文档](https://sspai.com/link?target=https%3A%2F%2Fkdl.dev%2F)。

运行 `zellij setup --dump-config > ~/.config/zellij/config.kdl` 可以生成默认的配置文件，所有的可配置选项都有很详尽的注释。

Zellij 的主配置文件有三个部分，第一部分是默认键位，第二部分是内置插件，第三部分是功能选项。默认情况下，第三部分的所有选项都是注释掉的。

### 快捷键

Zellij 虽然提供了 locked 模式来防止快捷键冲突，但是这个解决方案算不上完美，每次遇到快捷键冲突都要手动进入 locked 模式。

如果你也嫌麻烦，可以将 locked 模式作为默认的模式：在配置文件中搜索 `default_mode`，删除这行前面的斜杠注释，并确保后面的值是 `"locked"` 即可。

注：

1.  不过我个人觉得这样的配置还是不太方便，所以没有改默认模式，而是将所有的 prefix 所需的修饰键从 ctrl 改成了 alt。因为绝大多数终端程序都很少使用 alt 当作快捷键，这样就可以比较有效地避免键位冲突，具体可以看我的[配置文件](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fso1ar%2Fdotfiles%2Fblob%2Fmaster%2Froles%2Fzellij%2Ffiles%2Fzellij%2Fconfig.kdl)。需要注意的是，要将第一行的 `keybinds` 改成 `keybinds clear-defaults=true` 从而禁用默认的快捷键，不然默认的快捷键仍然会生效。
2.  在最近的更新日志中，提到了合并了一个 [pr](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fzellij-org%2Fzellij%2Fpull%2F3383)，支持同时使用多个修饰键，这个功能应该会随着下一个大版本推出。

### 外观定制

Zellij [内置](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fzellij-org%2Fzellij%2Ftree%2Fmain%2Fzellij-utils%2Fassets%2Fthemes)了一些配色方案。在配置文件中搜索 `theme`，将其值改成自己喜欢的配色方案即可。此外，也可以在配置文件中定义自己的配色方案，比如：

```
themes {
   gruvbox-dark {
      fg 213 196 161
      bg 40 40 40
      black 60 56 54
      red 204 36 29
      green 152 151 26
      yellow 215 153 33
      blue 69 133 136
      magenta 177 98 134
      cyan 104 157 106
      white 251 241 199
      orange 214 93 14
   }
}
```

就是 gruvbox-dark 配色。颜色代码可以是 rgb 值，也可以是 hex 值。

默认的布局（`default_layout`，字符串）和边框（`pane_frames`，布尔值）也可以在配置文件中调整。

![](https://cdnfile.sspai.com/2024/10/21/e34383ab92ca3c67535c9556142c172b.png?imageView2/2/format/webp)

### 杂项配置

-   `session_serialization` 控制是否支持恢复已关闭的会话。已关闭的会话状态会存储到缓存文件夹中，占用磁盘空间。如果不需要这个功能，可以选择将此选项设为 false 以节省磁盘空间。
-   `scroll_buffer_size` 控制 Zellij 中每个 shell 回滚历史的行数，默认是 10000，可以根据需要修改对应大小。行数越多，占用的内存也就越多。
-   `copy_on_select` 控制在使用鼠标选中内容后是否自动复制到剪贴板，有时这个功能挺烦人的。我个人习惯使用 neovim 打开 shell 历史再复制，所以设置为了 false。
-   `scrollback_editor` 控制了在 search 模式中按下 e 使用哪一个编辑器打开 shell 历史，默认是使用环境变量 $EDITOR 或 $VISUAL 定义的编辑器。如果想要使用其他的编辑器，或是定义了环境变量但没生效的话，可以手动指定其他编辑器。
-   `mouse_mode` 控制 Zellij 是否启用鼠标支持。启用鼠标支持可能会影响某些终端的行为，又或者使用时不需要鼠标，则可以将此项设为 false 来禁用鼠标支持。

更多的配置项可以参看 Zellij 的[默认配置文件](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fzellij-org%2Fzellij%2Fblob%2Fmain%2Fexample%2Fdefault.kdl)，每个选项都有很详尽的注释。

### 自定义布局

除了 Zellij 内置的布局，我们也可以自定义自己的布局。Zellij 默认会在 `~/.config/zellij/layouts` 目录下寻找布局配置文件，需要提前创建好这个目录。

比如说在 [compact](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fzellij-org%2Fzellij%2Fblob%2Fmain%2Fzellij-utils%2Fassets%2Flayouts%2Fcompact.kdl) 布局的基础上，我们想要默认打开两个窗格，并在其中一个窗格中运行 htop，则可以创建 `~/.config/zellij/layouts/compact_htop.kdl`：
