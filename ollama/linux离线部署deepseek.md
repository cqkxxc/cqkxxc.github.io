
uname -a 查看cpu架构

根据cpu型号下载安装对应ollama包：https://link.zhihu.com/?target=https%3A//github.com/ollama/ollama/releases/

解压：

```text
sudo tar -C /usr -xzf ollama-linux-amd64.tgz
```

添加权限：

```text
chmod +x /usr/bin/ollama
```

创建 ollama 用户

```text
useradd -r -s /bin/false -m -d /usr/share/ollama ollama
```

启动：

```text
ollama serve
```

配置 ollama

nano /etc/systemd/system/ollama.service

```text
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin"
#代表让ollama能识别到第几张显卡
Environment="CUDA_VISIBLE_DEVICES=0,1"
#这几张卡均衡使用
Environment="OLLAMA_SCHED_SPREAD=1" 
#模型一直加载, 不自动卸载
Environment="OLLAMA_KEEP_ALIVE=-1" 
#配置远程访问
Environment="OLLAMA_HOST=0.0.0.0"
#配置跨域请求
Environment="OLLAMA_ORIGINS=*"
#配置OLLAMA的模型存放路径，默认路径是/usr/share/ollama/.ollama/models/
Environment="OLLAMA_MODELS=/data/soft/ollama/.ollama/models"
[Install]
WantedBy=default.target
```

执行命令

```text
sudo systemctl daemon-reload
sudo systemctl start ollama
```

测试

```text
ollama --version
```

找一台联网机器在线下载大语言模型

```text
# deepseek 7B版本
ollama run deepseek-r1
```

打包模型文件

打包 blobs 和manifests文件

```text
cd ~/.ollama/models
tar -zcvf blobs.tar.gz blobs
tar -zcvf manifests.tar.gz manifests
```

上传到未联网服务器 /data/soft/ollama/.ollama/models路径下，解压

```text
tar -zxvf blobs.tar.gz
tar -zxvf manifests.tar.gz
```

测试

```text
ollama list 
```