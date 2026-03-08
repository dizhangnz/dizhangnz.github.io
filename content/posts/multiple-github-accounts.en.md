---
title: "Multiple Github Accounts"
date: 2025-11-15
draft: false
description: "Manage multiple GitHub accounts by using SSH config."
tags: ["git", "github"]
---

If you have multiple GitHub accounts, say one for work and one for personal projects, you have likely faced the same question: what is the best way to manage and switch between them?

Fortunately, it can easily be done by using SSH config.

## Step 1. Generate ssh key for each account

```bash
# Personal account
ssh-keygen -t ed25519 -C "your_personal_email@example.com"
# Save as: ~/.ssh/id_ed25519_personal

# Work account
ssh-keygen -t ed25519 -C "your_work_email@example.com"
# Save as: ~/.ssh/id_ed25519_work
```

Add the public key to its corresponding GitHub account.

## Step 2. Configure SSH config file

Edit the `~/.ssh/config` file and add the following content:

```bash
# Personal GitHub
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# Work GitHub
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

## Step 3. Check if the setup is correct

```bash
# Test Personal Github
ssh -T github-personal
# Successful response looks like
# Hi github-personal! You've successfully authenticated, but GitHub does not provide shell access.

# Test Work Github
ssh -T github-work
# Successful response looks like
# Hi github-work! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 4. Check-out repos

```bash
# Personal repo
git clone git@github-personal:your_personal_username/personal-repo.git

# Work repo
git clone git@github-work:your_work_username/work-repo.git
```
