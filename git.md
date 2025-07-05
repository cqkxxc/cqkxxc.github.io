## 全局设置本地仓库的提交身份

git config --global user.name "cqkxxc" 

git config --global user.email "chuaxu2022@outlook.com"

## 设置代理

```
git config --global http.proxy http://127.0.0.1:7890 
git config --global https.proxy http://127.0.0.1:7890
```

## 临时禁用代理

```
git config --global --unset http.proxy 
git config --global --unset https.proxy
```