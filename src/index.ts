#!/usr/bin/env node

import process from 'node:process'
import { cac } from 'cac'
import findBusEmit from './find-bus-emit'
import findBusOff from './find-bus-off'
import findBusOn from './find-bus-on'
import findWindowOpen from './find-window-open'
import findWujieProps from './find-wujie-props'
import findWujieTypes from './find-wujie-types'
import runInstall from './run-install'

const cli = cac('fep-migrator')
cli.option('-e, --exclude <dir>', '排除目录', { default: [], type: [String] })
  .option('-p, --pkg-manager', '指定包管理工具，可选值：pnpm、npm、yarn', { default: 'pnpm' })
  .option('-d, --dry-run', '模拟运行，不实际修改文件', { default: false })
  .option('-r, --root <dir>', '指定项目根目录', { default: '' })
cli.version(process.env.npm_package_version ?? '-.-.-')
cli.help()

const run = async () => {
  const { options } = cli.parse() as unknown as { options: Options & { root: string } }
  options.root = options.root || process.cwd()

  // // deps
  await runInstall(options)

  // // wujie types
  await findWujieTypes(options)

  // wujie props
  await findWujieProps(options)

  // // wujie bus
  await findBusOn(options)
  await findBusOff(options)
  await findBusEmit(options)

  // // jump
  await findWindowOpen(options)
}
run()
