# 参与贡献

## 先读这个

这是研究原型，不是产品。改动前请读 [SECURITY.md](SECURITY.md) 和 [README](README.md)
里"这个项目不做什么"一节——很多看起来像缺失的功能是**故意的**。

## 本地验证

改动前后都要跑，四条命令全绿才算通过：

```bash
npm install --ignore-scripts
npm run build
npm test                                  # 单元测试
node test/verify-goal.mjs                 # 目标验证
node test/verify-coverage.mjs             # 打包完整性
node test/verify-host-contract.mjs        # 宿主契约
node test/verify-bundle-path.mjs          # 证据链
node test/verify-distributed-identity.mjs # 分布式与身份
node test/verify-container-live.mjs       # 容器（无 daemon 会跳过）
```

## 这个项目接受的改动方式

**先写测试。** 这里的测试不是覆盖率装饰，它们抓过真实的缺陷：
路径守卫对字符串简写失效、审计不覆盖字节数、医疗守卫在属性访问抛异常时崩溃。

**限制要写在代码里，不是文档里。** `reproducible: false`、`clinicalUse: 'not-authorized'`、
`selfSigned: true` 都是常量。加功能时不要把这类常量删掉来"让功能可用"。

**失败要带稳定的错误码。** "它没工作"不是可行动的信息。

## 提交信息

说清**为什么**，而不只是改了什么。如果修复的是一个能被误判成"正常"的缺陷，写出来。

## 不接受

- 声称临床可用、合规认证、或"已通过验证"的措辞
- 移除能力边界常量（`reproducible`、`clinicalValidationStatus`、`selfSigned`）
- 在医疗模式下放宽工具白名单
- 让容器后端在没有 daemon 时静默回退到进程执行
