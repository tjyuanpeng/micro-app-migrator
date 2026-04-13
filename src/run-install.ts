import fs from 'node:fs'
import path from 'node:path'
import command from './utils/run-command'

const main = async (options: Options) => {
  const pkgPath = path.resolve(options.root, './package.json')
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`❌ 未找到 \'package.json\'，请在项目根目录执行`)
  }

  await command(options.pkgManager, [
    'add',
    '@falconix/micro-app',
    '@falconix/fep@latest',
    '--registry=http://10.168.2.110:31001/repository/ym-group',
  ], options)
  await command(options.pkgManager, [
    'remove',
    'wujie',
    'wujie-vue3',
  ], { ...options, ignoreError: true })
}

export default main
