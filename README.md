#10月29日
对lua、html文件的注释正则匹配进行了调整，对两个类型的文件进行测试，正确统计了注释行数。
对目录的输入从自己在代码中给定到用户自己输入目录。
对用户输入的目录进行判断，如果是文件夹，继续进一步的处理，如果是文件，直接进行统计。
#10月30日
把文件注释匹配的正则表达式拆分出去
对文件进行判断，不符合的文件不进行统计代码行量