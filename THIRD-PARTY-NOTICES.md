# 第三方声明 / Third-Party Notices

`lib/client.js` 是把前端打包成单文件分发的。它内联了下列第三方模块——这些模块
**不在**本仓库的 `dependencies` 中，而是构建时打包进来的。按 MIT 许可，此处保留
归属与许可声明。

The built `lib/client.js` inlines the modules below. They are bundled at build time
rather than resolved at runtime, so their attribution is recorded here as the MIT
licence requires.

## 汇总（30 个模块）

全部为 **MIT** 许可。版权人为 Marijn Haverbeke 及其他贡献者。

| 包 | 版本 | 许可 |
| --- | --- | --- |
| `@codemirror/autocomplete` | 6.20.4 | MIT |
| `@codemirror/commands` | 6.11.1 | MIT |
| `@codemirror/lang-css` | 6.3.1 | MIT |
| `@codemirror/lang-html` | 6.4.12 | MIT |
| `@codemirror/lang-javascript` | 6.2.5 | MIT |
| `@codemirror/lang-json` | 6.0.2 | MIT |
| `@codemirror/lang-markdown` | 6.5.2 | MIT |
| `@codemirror/lang-python` | 6.2.1 | MIT |
| `@codemirror/lang-sql` | 6.10.0 | MIT |
| `@codemirror/language` | 6.13.1 | MIT |
| `@codemirror/legacy-modes` | 6.5.5 | MIT |
| `@codemirror/lint` | 6.9.7 | MIT |
| `@codemirror/search` | 6.7.2 | MIT |
| `@codemirror/state` | 6.7.6 | MIT |
| `@codemirror/streamparser` | 6.0.0 | MIT |
| `@codemirror/view` | 6.43.15 | MIT |
| `@lezer/common` | 1.5.5 | MIT |
| `@lezer/css` | 1.3.9 | MIT |
| `@lezer/highlight` | 1.2.5 | MIT |
| `@lezer/html` | 1.3.13 | MIT |
| `@lezer/javascript` | 1.5.6 | MIT |
| `@lezer/json` | 1.0.3 | MIT |
| `@lezer/lr` | 1.4.12 | MIT |
| `@lezer/markdown` | 1.8.1 | MIT |
| `@lezer/python` | 1.1.19 | MIT |
| `@marijn/find-cluster-break` | 1.0.4 | MIT |
| `codemirror` | 6.0.2 | MIT |
| `crelt` | 1.0.7 | MIT |
| `style-mod` | 4.1.4 | MIT |
| `w3c-keyname` | 2.2.8 | MIT |

React 与 React DOM **没有**内联，它们是 DSH 宿主提供的外部依赖。

## MIT 许可证全文

```
MIT License

Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

本文件在包的 `files` 中被包含，因此随 npm 包一起分发。
