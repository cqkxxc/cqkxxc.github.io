---
title: "Python异步编程入门指南"
date: 2024-01-15
draft: false
categories: ["技术笔记"]
tags: ["Python", "异步编程", "asyncio"]
description: "本文介绍Python异步编程的基础知识，包括async/await语法、协程、任务等概念。"
---

## 前言

Python 3.5 引入了 async/await 语法，使得异步编程变得更加直观。本文将介绍异步编程的基础概念和实际应用。

## 什么是异步编程

异步编程是一种并发编程模式，允许程序在等待某些操作（如网络请求、文件I/O）完成时，继续执行其他任务。

### 同步 vs 异步

```python
import time

def sync_task():
    print("开始任务")
    time.sleep(2)  # 阻塞2秒
    print("任务完成")

# 同步执行 - 总耗时约4秒
sync_task()
sync_task()
```

```python
import asyncio

async def async_task():
    print("开始任务")
    await asyncio.sleep(2)  # 非阻塞
    print("任务完成")

# 异步执行 - 总耗时约2秒
async def main():
    await asyncio.gather(async_task(), async_task())

asyncio.run(main())
```

## 核心概念

### 1. 协程 (Coroutine)

使用 `async def` 定义的函数就是协程：

```python
async def my_coroutine():
    await some_async_operation()
    return "完成"
```

### 2. 任务 (Task)

任务是协程的包装器，可以并发执行：

```python
import asyncio

async def main():
    task = asyncio.create_task(my_coroutine())
    result = await task
    print(result)

asyncio.run(main())
```

### 3. 并发执行多个任务

```python
import asyncio

async def fetch_data(url, delay):
    await asyncio.sleep(delay)
    return f"数据来自 {url}"

async def main():
    tasks = [
        asyncio.create_task(fetch_data("api1", 1)),
        asyncio.create_task(fetch_data("api2", 2)),
        asyncio.create_task(fetch_data("api3", 1.5)),
    ]
    results = await asyncio.gather(*tasks)
    for result in results:
        print(result)

asyncio.run(main())
```

## 实际应用示例

使用 aiohttp 进行异步HTTP请求：

```python
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/delay/3",
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        print(f"获取了 {len(results)} 个响应")

asyncio.run(main())
```

## 注意事项

1. **避免阻塞操作**：在异步代码中不要使用 `time.sleep()` 或同步的 I/O 操作
2. **异常处理**：使用 try/except 处理协程中的异常
3. **资源管理**：使用 `async with` 管理异步资源

```python
async def safe_task():
    try:
        result = await risky_operation()
    except Exception as e:
        print(f"错误: {e}")
        return None
    return result
```

## 总结

异步编程适合 I/O 密集型任务，可以显著提高程序效率。但需要注意：

- 不是所有场景都适合异步
- CPU密集型任务应使用多进程
- 代码复杂度会增加

## 参考资料

- [Python官方文档 - asyncio](https://docs.python.org/zh-cn/3/library/asyncio.html)
- [aiohttp文档](https://docs.aiohttp.org/)
