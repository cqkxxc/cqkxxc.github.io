1、换源
（1）换国内镜像源
sudo nano /etc/pacman.d/mirrorlist
#清华源
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
#阿里源
Server = http://mirrors.aliyun.com/archlinux/$repo/os/$arch
#中科大源
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch

最后更新一下源sudo pacman -Syyu

（2）添加非官方源
sudo nano /etc/pacman.conf
[archlinuxcn]
SigLevel = Optional TrustedOnly
#清华源
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
#中科大源
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
# 阿里源
Server = https://mirrors.aliyun.com/archlinuxcn/$arch

（3）导入 archlinuxcn key
sudo pacman -Sy archlinuxcn-keyring

2、安装yay  base-devel
sudo pacman -Sy yay base-devel

3、设置中文字体
（1）字体安装
sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-extra noto-fonts-emoji ttf-dejavu ttf-liberation
（2）系统设置
sudo nano /etc/locale.gen
把以下内容前的#去掉
zh_CN.UTF-8 UTF-8
su
locale-gen && echo 'LANG=zh_CN.UTF-8' > /etc/locale.conf
exit
System Settings->Region & Language->Language->Modify->Change Language->简体中文
（3）安装自己喜欢的字体（可选）
开始菜单->系统设置->文字和字体->字体->字体管理->安装字体文件
选择自己喜欢的字体上传，安装为系统字体，然后重启电脑
字体->调整所有字体->勾选“字体”，选择刚刚上传的->勾选“字体样式”，按照喜好选择粗细，最后点击“应用”

4、安裝输入法
（1）安装
sudo pacman -S fcitx5-im fcitx5-rime
（2）启动输入法
设置->键盘->虚拟键盘->Fcitx 5 Wayland启动器
（3）启用雾凇输入拼音方案
cd ~/.local/share/fcitx5/rime
git clone https://github.com/iDvel/rime-ice.git
cp -r ./rime-ice/* .
重启fcitx5

5、启用应用商店
（1）Discover
sudo pacman -S packagekit-qt6 packagekit appstream-qt appstream
（2）pamac
yay -Syu pamac-aur

6、设置串口权限允许普通用户访问
sudo usermod -a -G uucp $USER
设定完重启电脑生效

7、其他
(1)终端显示异常
sudo pacman -S ttf-dejavu
然后在终端右上角三条横线，新建配置方案->外观->字体->选择->DejaVu Sans Mono
(2)锁屏页面不好看
开始菜单->系统设置->颜色和主题->登录屏幕(SDDM)->Breeze微风



