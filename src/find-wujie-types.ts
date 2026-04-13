import fs from 'node:fs'
import path from 'node:path'
import { globbySync } from 'globby'
import { parseSync } from 'oxc-parser'

interface WujieWindowDefinition {
  path: string
  line: number
  type: 'property'
  content: string
}

const findWujieInAST = (code: string, filename: string): WujieWindowDefinition[] => {
  const results: WujieWindowDefinition[] = []
  const { program } = parseSync(filename, code, { lang: 'tsx', sourceType: 'module' })

  // Convert byte offset to line number
  const getLineNumber = (offset: number): number => {
    const before = code.slice(0, offset)
    return before.split('\n').length
  }

  // Get full line content from line number
  const getLineContent = (lineNumber: number): string => {
    const lines = code.split('\n')
    return lines[lineNumber - 1] || ''
  }

  const traverse = (node: any) => {
    if (!node) {
      return
    }

    // Check for $wujie property definitions
    if (node.type === 'TSPropertySignature' || node.type === 'TSMethodSignature') {
      const name = node.key?.name || node.key?.value
      if (name === '$wujie') {
        const line = getLineNumber(node.start)
        const content = getLineContent(line)
        results.push({
          path: filename,
          line,
          type: 'property',
          content,
        })
      }
    }

    // Recursively traverse children
    for (const key in node) {
      if (Array.isArray(node[key])) {
        for (const child of node[key]) {
          if (typeof child === 'object' && child !== null) {
            traverse(child)
          }
        }
      } else if (typeof node[key] === 'object' && node[key] !== null) {
        traverse(node[key])
      }
    }
  }

  traverse(program)
  return results
}

const finder = async (options: Options) => {
  const fileList = globbySync([options.root, ...options.exclude.map(i => `!${i}`)], {
    absolute: true,
    onlyFiles: true,
    gitignore: true,
    expandDirectories: {
      extensions: ['ts', 'tsx', 'd.ts', 'vue'],
    },
    ignore: ['**/node_modules', '**/public'],
  })

  const allResults: WujieWindowDefinition[] = []

  for (const file of fileList) {
    try {
      const content = fs.readFileSync(file, { encoding: 'utf-8' })
      const results = findWujieInAST(content, file)
      allResults.push(...results)
    } catch {
      // Skip files that can't be parsed
    }
  }

  if (allResults.length === 0) {
    return
  }

  console.log(`\n⚠️  发现 ${allResults.length} 处可能与 wujie 相关的 TypeScript 定义。请删除`)
  allResults.forEach((i) => {
    const relativePath = path.relative(options.root, i.path)
    console.log(`➡️  ${relativePath}:${i.line}`)
    console.log(`   ${i.content}`)
  })
}

export default finder
