arch踩坑笔记

# 1.git clone时time out

安装梯子解决

# 2.使用edge时中文输入法失效

wayland引起，实测通过此官方文档解决问题：https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland/zh-cn#KDE_Plasma\

 步骤：
 
1.sudo nano /etc/environment，添加XMODIFIERS=@im=fcitx
然后source /etc/environment使设置生效

2.测试启动：microsoft-edge-stable --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime，发现成功启用中文输入法

3.因为上面是在终端用命令行启动，日常使用肯定是用桌面快捷方式或者任务栏快捷方式。

桌面快捷方式：sudo nano microsoft-edge.desktop，找到exec=这一行，后面的%U改为第二步的启动指令

任务栏快捷方式的地址：/usr/share/application，修改方式同理。

竟然是在刷B站视频时在评论区有人说有官方文档提供解决方法，又是感谢互联网精神的一天

# 3.Obsidian

常用命令

1.系统更新：sudo pacman -Syu

2.查找软件包：sudo pacman -Ss 软件名

一个查看天气预报的好玩的命令：curl wttr.in/Chongqing?lang=zh
