# 简历上传页面

使用 React、TypeScript 和 Vite 实现提供的简历上传设计稿，并适配不同屏幕宽度。

## 安装与运行

需要 Node.js 22.12 或更新版本。

```sh
npm ci
npm run dev
```

开发地址：<http://127.0.0.1:4180/>。

```sh
npm run build
npm run preview
```

生产预览地址：<http://127.0.0.1:4181/>。构建文件生成到 `dist/`，资源使用相对路径，支持部署到仓库子路径。

## 页面功能

- 按 1920 × 1080 的参考画布核对桌面布局；窗口宽度不超过 1100px 时改为上下排列。
- 支持文件选择、键盘操作、拖放，以及文件替换、移除和重新选择。
- 显示文件名、文件大小和校验信息。
- 允许单个 PDF、DOC 或 DOCX 文件，大小不超过 10 MiB，拒绝空文件。
- 包含悬停、按下、焦点、拖入、错误、回看和完成状态。
- 简历为选填项，未选择文件也可点击 Finish。
- 步骤指示器提供可访问的当前步骤说明。

文件仅保存在当前页面内存中。当前实现没有连接文件上传、持久化、解析或简历优化服务；浏览器中的扩展名与大小检查只负责交互反馈，服务端仍需自行验证。

设计材料只提供了最后的上传页面。Last step 对应本地回看状态，Continue 返回上传页面并保留文件选择，Finish 显示本地完成状态。这些补充状态用于使页面交互完整。

## 验证

```sh
npm run lint
npm run format:check
npx playwright install chromium
npm test
```

已通过 15 项 Playwright 测试，覆盖参考尺寸、文件选择与拖放、无效替换、空文件、超大文件、多文件、移除后重新选择、回看与完成、跳过上传、键盘操作、长文件名，以及 320/390/768/1280px 的窗口宽度。

已安装 Chrome 时，可通过环境变量 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 指定浏览器可执行文件；默认使用 Playwright 安装的 Chromium。

## 项目结构

```text
src/
  App.tsx                       页面布局与本地流程状态
  components/ResumeDropzone.tsx  文件选择和拖放交互
  components/StepIndicator.tsx   步骤指示器
  components/Icons.tsx           装饰图标
  lib/resume.ts                 文件规则与大小格式化
  assets/                       题目插图与云朵矢量图
  styles.css                    设计变量与响应式样式
tests/resume-upload.spec.ts      浏览器测试
```

## 设计与素材依据

使用题目提供的 PNG 插图；云朵矢量图和对勾路径来自提供的设计材料。字体 Inter 通过 `@fontsource/inter` 本地打包，采用 SIL Open Font License，页面运行时无需请求外部字体服务。

原 PDF 中的文字以 `FigmaGlyphs` 形式提供，不能据此确认原始字体名。实现通过字形外观和标题实测宽度选择 Inter，因此将它作为匹配方案，而非已经确认的原字体。颜色使用提供的数值；导出的对勾保留 Display P3 填充及 sRGB 回退值。

设计来源：[Figma 设计稿](https://www.figma.com/design/D0jjN7Twkq0DGm3ZJvQabz/?node-id=0-1)。
