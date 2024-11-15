# 代码统计工具开发日志

---

## 10月25日

- **功能实现**：对给定的目录进行遍历，获得所有文件的路径。（默认用户输入的是文件夹路径）

---

## 10月26日

- **功能实现**：对文件实现简单的统计代码行量，包括代码的总行数和空行数。

---

## 10月27日

- **功能拆分**：把统计代码的功能独立出来。
- **功能实现**：实现统计注释行数。
- **现存问题（已解决）**：处理注释内包含"//"和注释在代码后面的情况，如 `let commentLineCount = 0; // 注释行数`。

---

## 10月28日

- **问题解决**：解决10月27日遗留的问题。
- **功能实现**：完成对七大编程语言（Java、XML、Python、C#、PHP、JavaScript、CSS）的单行和多行注释的统计。

---

## 10月29日

- **功能优化**：对Lua、HTML文件的注释正则匹配进行调整，并正确统计注释行数。
- **功能增强**：对目录的输入方式进行优化，允许用户自己输入目录。
- **逻辑判断**：对用户输入的目录进行判断，如果是文件夹则继续处理，如果是文件则直接进行统计。

---

## 10月30日

- **代码重构**：把文件注释匹配的正则表达式拆分出去。
- **文件过滤**：对文件进行判断，不符合后缀名的文件不进行统计代码行量。

---

## 现阶段存在的问题

1. **依赖包统计**：会对依赖包进行统计，需要进一步优化。
2. **注释行数统计重构**：Lua文件和XML文件的处理逻辑需要重构，以提高代码的可读性和规范性。

---

## 11月2日

- **问题解决**：解决会对依赖包进行统计的问题，通过默认配置文件对文件目录进行匹配，若匹配成功则忽略。
- **代码重构**：对Lua文件和XML文件的正则表达式进行修改，与其他文件的格式一致，提高代码的规范性和可读性。

---

## 11月3日

- **功能增强**：增加对Vue文件的统计。

---

## 11月4日

- **功能实现**：对每种编程语言的代码行数进行累加并输出。

---

## 11月5日

- **功能增强**：添加一个 `--summary` 参数来只显示汇总信息。
- **功能扩展**：增加对TS文件的统计。

---

## 11月6日

- **界面优化**：对输出结果进行优化，使其看起来更美观。

---

## 11月7日

- **功能增强**：增加对go文件的统计。

---

## 11月8日

- **路径验证增强**：在程序开始执行时，首先检查用户是否提供了路径参数。然后验证该路径是否存在，以及是否是一个目录。如果路径验证失败，程序将输出错误信息并退出。

---

## 11月9日

- **文件系统操作异常处理**：在 readDirectory.js 中的 findFiles 函数里，为 fs.statSync 和 fs.readdirSync 方法添加 try-catch 结构，以捕获文件读取和目录访问的异常，避免程序因文件系统错误中断。
- **文件读取错误处理**：在 fileCounter.js 文件的 countLinesInDirectory 函数中，修改 fs.readFile 异常处理方式，若文件读取失败，使用 reject 将错误传递给调用方，以便进一步处理。
- **注释模式匹配错误处理**：在 getCommentPatternsByExtension 函数中，若无法找到文件类型对应的注释模式，返回 null 并在调用处检查，确保未找到匹配模式时直接终止统计操作并抛出错误提示。
- **Promise 异常处理**：在 calculateTotalLines 函数中增加 try-catch 或 .catch 异常捕获，确保 Promise.all 处理文件统计时的错误得到正确处理并输出错误信息。

---

## 11月12日

- **用户自定义排除目录**：允许用户通过命令行在执行时手动输入他们想要排除的目录或文件。用户可以连续输入排除项，通过输入 'done' 来结束输入过程。

---

## 11月15日

- **命令行参数处理优化及错误检查增强**

**参数检查增强**：

- 我们对命令行参数进行了严格的检查，确保用户至少提供了一个必需的参数，即目录路径。如果用户未能提供该路径，程序将打印出正确的使用方法，并立即退出，从而避免后续的无效操作。

**错误处理优化**：

- 路径验证的代码块已被提前至处理其他逻辑之前，以确保路径的有效性在程序继续执行前得到确认。这一改进有效避免了在后续代码中可能因无效路径而引发的错误。

**--summary 标志处理**：

- 我们对 --summary 标志的处理逻辑进行了完善，明确规定该选项必须是命令行中的第二个参数，并且其后不能跟随其他参数。如果用户未按照此规定使用 --summary，程序将打印出正确的使用方法，并立即退出。

**代码结构优化**：

- 通过将路径验证和 --summary 标志的处理逻辑进行分离，我们使得代码结构更加清晰明了，从而提高了代码的可读性和可维护性。

**用户输入提示优化**：

- 在收集用户要排除的目录或文件之前，我们增加了一个简洁明了的提示信息，以指导用户进行正确的操作。这一改进显著提升了用户体验。

---