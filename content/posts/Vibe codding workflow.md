---
title: vibe codding工作流
date: 2026-03-31
draft: false
tags:
description: 独立开发者的文档驱动 AI 编程实践
categories: AI
---
【裸辞回国做独立游戏，花了2万8摸索出的AI编程工作流】 https://www.bilibili.com/video/BV1DVwLz2EGv/?share_source=copy_web&vd_source=8f4035504ed72f1d67b1d953f5dc40a3

[#001 独立开发者的文档驱动 AI 编程实践 | tyk dev logs](https://tyksworks.com/posts/ai-coding-workflow-zh/)
## 文档主导工作流
 
 1. 发散需求，让AI进行调研和需求细节补充，禁止任何技术性内容。
![](Pasted%20image%2020260331102332.png)
 2. RPD文档（最耗时），如下几点一定要包含：
- 术语表：准确描述系统行为，避免歧义，才能规范AI的行为
- 交互方式：用户如何和这个系统产生交互，手动还是自动
- 验收标准（边界定义）：定义系统关键功能，说明遇到边界情况如何处理，这类自然语言后续还可以改为测试代码

3. plan+review：让AI基于前一步文档进行plan并反复review，修正。这个过程可以用不同AI交叉验证，一般两轮就不会有什么致命的问题了。注：显示要求agent做TDD可以有效提高开发效率，减少出错空间。

4. 实现：可以在agent实现时做其他worktree

5. 功能测试+迭代：让AI review几轮代码实现的内容，让它自己修改，不用关注代码具体内容。对关键部分进行手动功能测试。若有微调，重新审视文档内容是否匹配，并重新从第3步开始

6. 人工review（第二耗时）：让AI画出review重点

![](Pasted%20image%2020260331102300.png)

7. 重复这6个阶段，直到满意。注：可让AI对当前功能进行单元测试：
![](Pasted%20image%2020260331102550.png)

## 原型主导工作流（需求非常模糊时）

![](Pasted%20image%2020260331102849.png)

## 文档的生命周期
![](Pasted%20image%2020260331103049.png)


![](Pasted%20image%2020260331194454.png)



