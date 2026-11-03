# 发布到公网

## 现在的状态

| 项 | 状态 |
| --- | --- |
| 站点代码 | 完成，两种布局都验证过 |
| Pages workflow | 已提交 |
| CI | 通过 |
| **Pages 仓库开关** | **未开启（需要你在 GitHub 上点一下）** |

Pages 是**仓库设置**，不是代码。`configure-pages` 在开关关闭时必然失败，
任何 workflow 都无法自己打开它。

## 开一次就好

1. 打开 https://github.com/lijianxingis/BioDSH/settings/pages
2. **Source** 选 **GitHub Actions**（不是 "Deploy from a branch"）
3. 保存
4. 到 https://github.com/lijianxingis/BioDSH/actions 点 **pages** → **Re-run all jobs**

完成后地址是：

```
https://lijianxingis.github.io/BioDSH/
```

## 为什么之前会白屏

页面原来从 `/site/site.bundle.js` 加载 bundle。这在「仓库根被服务」时正确，
在「site/ 作为根发布」时 404——而 Pages 就是后者。

**本地全过，上线白屏。** 这类失败不会在文本检查里露出来，因为字符串是对的。

现在 bundle 的 URL 从文档位置推导，同一份文件在 /site/ 和 / 下都能工作。

## 验证方式

`test/verify-site-layouts.mjs` 用**真实浏览器**渲染两种布局：

```
repository-root-renders-the-panel              9 cards
repository-root-draws-the-helix                2 canvas
repository-root-has-no-failed-requests         none
site-as-root-renders-the-panel                 9 cards
site-as-root-draws-the-helix                   2 canvas
site-as-root-has-no-failed-requests            none
```

不是检查字符串，是看页面有没有真的画出来。

## workflow 里的三道闸

部署前会检查：

1. site/index.html 存在
2. site/site.bundle.js 存在且大于 100 KiB（忘了构建会在这里挡住）
3. 页面里没有绝对 /site/ 引用（有就说明会白屏）

这三条都是「本地通过、上线失败」的典型原因。

## 一个 CI 的教训

第一次推送后**所有 CI job 都失败**，本地却全过。

原因是测试命令用了 `--test-isolation=none`，**那是 Node 24 才有的 flag**：

```
node: bad option: --test-isolation=none
```

Node 20 和 22 直接拒绝这个参数，所以**一个测试都没跑就失败了**。

现在这个 flag 已移除，并在 workflow 里加了闸：重新引入它会直接报错。

## 本机预览

不想等 Pages，本地随时能看：

```bash
npm run serve:site
# http://127.0.0.1:4173/
```

详见 [site.md](site.md)。
