// @ts-check
import { defineConfig } from '@archoleat/prettier-define-config';

export default defineConfig({
  arrowParens: 'always', // 箭头函数参数周围加上括号
  bracketSameLine: true, // 大括号与代码在同一行
  bracketSpacing: true, // 大括号内部加空格
  semi: true, // 分号结尾
  experimentalTernaries: false, // 不使用实验性三元表达式
  singleQuote: true, // 使用单引号
  jsxSingleQuote: true, // JSX属性值使用单引号
  quoteProps: 'preserve', // 保留引号样式
  trailingComma: 'all', // 尾随逗号保留
  singleAttributePerLine: false, // 不强制单个属性换行
  htmlWhitespaceSensitivity: 'css', // HTML空格敏感性为css
  vueIndentScriptAndStyle: false, // Vue脚本和样式不缩进
  proseWrap: 'never', // 文本不换行
  insertPragma: false, // 不插入格式化标记
  printWidth: 100, // 打印宽度为80个字符
  requirePragma: false, // 不要求格式化标记
  useTabs: false, // 不使用Tab缩进
  embeddedLanguageFormatting: 'auto', // 嵌入语言格式自动
  tabWidth: 2, // Tab宽度为2个空格
  endOfLine: 'auto', // 行尾自动
});
