常用命令
## 安装到R盘

```
wsl --install archlinux --location R:\WSL\archlinux
```

## 使用windows的文本编辑工具修改为国内源

```
explorer.exe \\wsl.localhost\archlinux\etc\pacman.d
```

## 使用`useradd`命令添加用户：

```
sudo useradd -m -G wheel -s /bin/bash xc
```
## 设置密码

```
passwd xc
```

## 添加sudo权限

```
nano /etc/sudoers
```

```
# %wheel ALL=(ALL:ALL) ALL  → 改为 →  %wheel ALL=(ALL:ALL) ALL
```

## 彻底删除用户

```
sudo userdel -r xc
```

## 切换到新用户并测试


```
su - xc
```

```
sudo ls /root
```

