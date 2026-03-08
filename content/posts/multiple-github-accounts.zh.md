---
title: "多个 GitHub 账户"
date: 2025-11-15
draft: false
description: "通过使用 SSH 配置管理多个 GitHub 账户。"
tags: ["git", "github"]
---

如果您有多个 GitHub 账户，例如一个用于工作，一个用于个人项目，您可能也会问同样的问题：管理和切换它们的最佳方式是什么？

幸运的是，通过使用 SSH 配置可以轻松完成。

## 第一步：为每个账户生成 SSH 密钥

```bash
# 个人账户
ssh-keygen -t ed25519 -C "your_personal_email@example.com"
# 保存为: ~/.ssh/id_ed25519_personal

# 工作账户
ssh-keygen -t ed25519 -C "your_work_email@example.com"
# 保存为: ~/.ssh/id_ed25519_work
```

将公钥添加到对应的 GitHub 账户。

## 第二步：配置 SSH 配置文件

编辑 `~/.ssh/config` 文件，添加以下内容：

```bash
# 个人 GitHub
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# 工作 GitHub
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

## 第三步：检查设置是否正确

```bash
# 测试个人 GitHub
ssh -T github-personal
# 成功响应类似于
# Hi github-personal! You've successfully authenticated, but GitHub does not provide shell access.

# 测试工作 GitHub
ssh -T github-work
# 成功响应类似于
# Hi github-work! You've successfully authenticated, but GitHub does not provide shell access.
```

## 第四步：检出仓库

```bash
# 个人仓库
git clone git@github-personal:your_personal_username/personal-repo.git

# 工作仓库
git clone git@github-work:your_work_username/work-repo.git
```
