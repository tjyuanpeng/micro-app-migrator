# micro-app-migrator

wujie 到 @falconix/micro-app 迁移工具

## 使用

在项目根目录执行命令

```shell
npx micro-app-migrator
```

## 选项

- `--pkg-manager` 或 `-p` 指定包管理器，默认值为 `pnpm`

- `--exclude` 或 `-e` 排除指定目录

  使用glob语法，支持设置多个目录，例如：

  ```shell
  micro-app-migrator --exclude "**/public" --exclude "**/assets"
  ```

- `--dry-run` 或 `-d` 模拟运行，不实际修改文件

- `--root` 或 `-r` 指定项目根目录

## 功能

`micro-app-migrator` 会执行以下操作：

1. **依赖迁移**
   - 安装 `@falconix/micro-app`
   - 更新 `@falconix/fep` 到最新版本
   - 移除 `wujie` 和 `wujie-vue3`

2. **代码检测**
   - 检测 `window.$wujie` 相关的 TypeScript 类型定义，提示删除
   - 检测 `window.$wujie.props` 访问，提示使用 microApp 相关方法代替
   - 检测 `window.$wujie.bus.$on/$emit/$off` 调用，提示使用 microApp 相关方法代替
   - 检测 `window.open` 调用，提示检查是否需要修改成 `microApp.openNewWindow(url, { frameMode: true })`

## 注意事项

使用前请备份好文件，确保文件已经提交到git仓库
