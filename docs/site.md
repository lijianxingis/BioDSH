# 自己开一个网站

展示页是静态的，**克隆下来就能开**，不用构建、不用装依赖、不用连任何服务。

## 三种开法

### 1. 用自带的服务器（推荐）

```bash
git clone https://github.com/lijianxingis/BioDSH.git
cd BioDSH
npm run serve:site
```

```
site: http://127.0.0.1:4173/
press Ctrl+C to stop
```

换端口：

```bash
PORT=8080 npm run serve:site
```

```powershell
# PowerShell
$env:PORT = "8080"; npm run serve:site
```

让局域网里别人也能看：

```bash
HOST=0.0.0.0 PORT=8080 npm run serve:site
```

然后他们访问 `http://你的IP:8080/`。

### 2. 用任何静态服务器

`site/` 就是一个普通静态目录，没有构建步骤：

```bash
python -m http.server 8080 --directory site
# 或
npx serve site
```

**注意**：页面里用的是 `/site/site.bundle.js` 这样的绝对路径，所以服务器的根目录必须是
仓库根目录，不是 `site/` 目录本身。用 `--directory site` 会 404。

正确做法：

```bash
python -m http.server 8080
# 然后访问 http://127.0.0.1:8080/site/
```

### 3. 部署到 GitHub Pages

`site/` 是纯静态的，推到 Pages 即可。仓库里已经有一个 workflow 可以照抄：

```yaml
name: pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - uses: actions/deploy-pages@v4
```

**但要注意**：Pages 的根是 `site/`，而页面里的资源路径是 `/site/site.bundle.js`。
部署前需要改成相对路径：

```bash
sed -i 's|/site/site.bundle.js|./site.bundle.js|' site/index.html
```

或者用一个 `base` 前缀。这一步不改，线上会白屏。

## 打开后是什么

页面里有：

- 首屏：圆点网格背景（跟随鼠标）+ 审计链双螺旋
- 真实的工作台面板（概览视图、工作流视图）
- 五个真实运行的记录（含字节数和哈希前缀）
- 「三件事不做」和可复现的验证数字
- 命令行示例

**数据是演示用的固定样本**，不是实时数据。想接真实数据，看下面的「接自己的后端」。

## 接自己的后端

页面通过一个 `api(action, payload)` 函数取数据。`site/demo-api.js` 是演示实现，
换成真的 HTTP 调用即可：

```js
export function createApi(baseUrl) {
  return async function api(action, payload = {}) {
    const response = await fetch(baseUrl + "/api/" + action.replace("/", "-"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error((await response.json()).error)
    return response.json()
  }
}
```

真实的 API 服务用 `npm run serve:api` 起（见 [capabilities.md](capabilities.md)）。

## 页面是怎么来的

页面不是手写的 HTML 贴图，是**真实的 React 组件**：

| 文件 | 作用 |
| --- | --- |
| `site/index.html` | 外壳、样式、文案 |
| `site/site.js` | 挂载真实组件 + 效果 |
| `site/demo-api.js` | 假宿主（换掉它就能接真数据） |
| `site/effects.js` | 圆点网格、滚动计数 |
| `site/parallax.js` | 分层视差 |
| `site/serve.mjs` | 静态服务器 |

`client/Home.jsx` 和 `client/WorkflowPanel.jsx` 是**同一份代码**，DSH 插件里跑的和这个页面上
跑的是同一个组件。换掉的只有传输层。

## 改完要重新构建

如果改了 `client/` 里的组件，页面不会自动更新——需要重新打包：

```bash
npm run build        # 插件用的 client.js
npm run build:site   # 站点用的 site.bundle.js
```

`site.bundle.js` 是**提交进仓库的**，所以别人克隆后不用构建就能看。改完记得一起提交。

## 已验证

```bash
node test/verify-site.mjs
```

```
the-bundle-is-committed                 552 KiB
the-page-exists                         11 KiB
the-page-has-no-external-dependency
the-server-serves-the-page              status 200
the-server-serves-the-bundle            552 KiB
refuses--package-json                   status 403
refuses--site-package-json              status 403
refuses--2e-2e-package-json             status 403
refuses--2fpackage-json                 status 403
refuses--etc-passwd                     status 403
a-missing-file-is-404                   status 404
```

## 一个真实的安全缺陷（已修）

最初的服务器**能被路径穿越读取任意文件**：

```bash
curl --path-as-is http://127.0.0.1:4173/../package.json
# 200，返回了 package.json 的完整内容
```

守卫代码是有的，但**在错误的位置**：

```js
// 错的：new URL() 在解析时就把 ".." 消掉了，url.pathname 里根本看不到穿越
const url = new URL(request.url, base)
const target = resolve(join(root, normalize(url.pathname)))
```

`normalize` 和 `new URL()` 都会在检查之前把 `..` 折叠掉，所以 `resolve(root, pathname)`
得到的永远是 root 内的路径——**守卫看着对，实际什么也没做**。

现在的做法：读**原始请求目标**，解码后先拒含 `..` 的路径，再用 `resolve(root, "." + pathname)`
并比对带分隔符的前缀。

这个缺陷值得记一笔，因为**普通 fetch 测不出来**：浏览器、PowerShell、`new URL()` 都会在
请求发出前把 `..` 规范化掉。只有原始 socket 才能测出真实行为。

`test/verify-site.mjs` 用的就是原始 socket。
