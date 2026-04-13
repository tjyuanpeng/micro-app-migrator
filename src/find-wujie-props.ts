import ripgrep from './utils/run-ripgrep'

const finder = async (options: Options) => {
  const searchText = 'window\\??\\.\\$wujie\\??\\.props\\??\\.'
  const stdout = await ripgrep(searchText, options)
  if (!stdout) {
    return
  }

  const list = stdout.split('\n').map(line => JSON.parse(line))
  list.filter(i => i.type === 'summary').forEach((i) => {
    console.log(`\n⚠️  发现 ${i.data.stats.searches_with_match} 个文件，可能调用了' window.$wujie.props '。请用 microApp 相关方法代替`)
  })
  list.filter(i => i.type === 'match').forEach((i) => {
    console.log(`➡️  ${i.data.path.text}:${i.data.line_number}`)
    console.log(i.data.lines.text.replace('\n', ''))
  })
}

export default finder
