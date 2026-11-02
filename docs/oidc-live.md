# 真实 OIDC 验证

`verify-oidc-live.mjs` 和一个真实的 Keycloak 对接过。这里记录怎么复现，以及**测出了什么**。

## 复现

```bash
# 1. 启动 Keycloak（镜像按 digest 钉死）
docker run -d --name dsh-keycloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -v "$PWD/docker/keycloak:/opt/keycloak/data/import:ro" \
  quay.io/keycloak/keycloak@sha256:... start-dev --import-realm

# 2. 取公钥
curl -s http://127.0.0.1:8080/realms/dsh/protocol/openid-connect/certs > .build/oidc/jwks.json

# 3. 用 OIDC 模式起服务
export DSH_AUTH_MODE=oidc
export DSH_JWKS_FILE=$PWD/.build/oidc/jwks.json
export DSH_JWT_ISSUER=http://127.0.0.1:8080/realms/dsh
node bin/dsh-research-server.mjs

# 4. 跑验证
node test/verify-oidc-live.mjs
node test/verify-tenancy-live.mjs
```

## 结果

```
verify-oidc-live    17 passed
verify-tenancy-live 11 passed
```

## 测出的一个真实缺陷

**密钥集只有一把密钥时，`kid` 不匹配被忽略了。**

```js
// 原来的写法
const jwk = keys.find(k => k.kid === header.kid) ?? (keys.length === 1 ? keys[0] : undefined)
```

这行的意图是「兼容只发布一把密钥、且不带 kid 的 provider」。但它没区分两种情况：

- 密钥**没有** kid：只能靠唯一性匹配，这是对的
- 密钥**有** kid 但和 token 里的不一致：token 要么过期要么伪造，**必须拒绝**

实测用真 Keycloak 签的 token，把 kid 改成伪造值，**原来会验签通过**。

修复：只有当唯一那把密钥自身不带 kid 时才回退。现在两种伪造都被拒绝。

这个缺陷用自造 JWT 测不出来——我原来 `verify-capabilities` 里的测试就是用人造 token，
它通过了。**只有真实 IdP 的密钥集形状才暴露它。**

## 另一个缺陷

**缺少 roles claim 时静默变成 `viewer`。**

```js
const roles = claims.roles ?? (claims.scope ? String(claims.scope).split(' ') : ['viewer'])
```

`viewer` 是我编的。provider 没告诉你权限，和你被告知「只读」不是一回事。

现在：没有 roles 时 roles 为空数组，`requiresRole` 自然返回 false，请求得到明确的 403 而不是
一个看起来像权限决策的默认值。

同时接受三种真实存在的形状：`roles: []`、`role: "operator"`、`scope: "a b c"`。

## 跨租户隔离

两个真实用户，两个真实租户：

| 用户 | tenant claim |
| --- | --- |
| researcher | `acme` |
| outsider | `globex` |

```
alice 提交 → 202
alice 读自己的 → 200
bob 读 alice 的 → 404（不是 403）
bob 列运行 → 0 条
bob 读报告 → 404
bob 导出 bundle → 404
```

**404 而不是 403 是有意的**：告诉调用者「这条存在但属于别人」是一个枚举预言机，
可以让他逐条试探哪些 id 存在。

## 过程中踩的坑

1. **导入目录被扫描**：把 `jwks.json` 和 `realm.json` 放在同一个挂载目录，Keycloak 试图把
   jwks 当 realm 导入，启动失败。
2. **用户资料不完整**：`Account is not fully set up` —— Keycloak 拒绝给缺少必填字段的用户发 token。
3. **硬编码 claim mapper**：所有用户拿到同一个 tenant，多租户测试也就失去意义。
4. **JSON 类型 mapper 无法序列化多值属性**：`cannot map type for token claim`。

前三个是我配置错，第四个是 Keycloak 的限制。**这四个都不是产品缺陷**，但都会让测试
因为错误的原因通过或失败，所以要记下来。
