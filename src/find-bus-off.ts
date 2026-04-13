import ripgrep from './utils/run-ripgrep'

const finder = async (options: Options) => {
  const searchText = 'bus\\.\\$off\\('
  const stdout = await ripgrep(searchText, options)
  if (!stdout) {
    return
  }

  const list = stdout.split('\n').map(line => JSON.parse(line))
  list.filter(i => i.type === 'summary').forEach((i) => {
    console.log(`\n⚠️  发现 ${i.data.stats.searches_with_match} 个文件，可能调用了' bus.$off() '。请用 microApp.$off(event, callback) 代替`)
  })
  list.filter(i => i.type === 'match').forEach((i) => {
    console.log(`➡️  ${i.data.path.text}:${i.data.line_number}`)
    console.log(i.data.lines.text.replace('\n', ''))
  })
}

export default finder
