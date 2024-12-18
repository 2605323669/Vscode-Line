module.exports = {
    js: {
        singleLine: /^\/\/.*$/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    java: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    py: {
        singleLine: /^#/,
        multiLine: /(['"]{3})[\s\S]*?\1/g
    },
    xml: {
        singleLine: /^<!--.*?-->/,
        multiLine: /<!--([\s\S]*?)-->/g
    },
    html: {
        singleLine: /^\/\/.*/,
        multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g
    },
    lua: {
        singleLine: /^(?<!\[)--(?!\[|\])/,
        multiLine: /--\[\[[\s\S]*?\]\]|--\[\=(=*)\[\[\s\S]*?\]\]\1\]=\]/g
    },
    cs: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    php: {
        singleLine: /^(?:\/\/|\#).*$/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    css: {
        singleLine: /^$/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    vue: {
        singleLine: /^\/\/.*|^<!--.*?-->/,
        multiLine: /\/\*[\s\S]*?\*\/|<!--[^\n]*\n(?:.*\n)*?[^-]*-->/g
    },
    ts: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    go: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    c: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    cpp: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    h: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    cc: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    inl: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    rs: {
        singleLine: /^\/\/.*/,
        multiLine: /\/\*[\s\S]*?\*\//g
    }
    // js: {
    //     singleLine: /^\/\/.*$/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // java: {
    //     singleLine: /^\/\/.*/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // py: {
    //     singleLine: /^#/,
    //     multiLine: /(['"]{3})[\s\S]*?\1/g
    // },
    // xml: {
    //     singleLine: /^<!--.*?-->/,
    //     multiLine: /<!--[\s\S]*?-->/g,
    //     xml: "xml"
    // },
    // html: {
    //     singleLine: /^\/\/.*/,
    //     multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g
    // },
    // lua: {
    //     singleLine: /^(?<!\[)--(?!\[|\])/,
    //     multiLine: /--\[\[[\s\S]*?\]\]/g
    // },
    // cs: {
    //     singleLine: /^\/\/.*/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // php: {
    //     singleLine: /^(?:\/\/|\#).*$/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // css: {
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // vue: {
    //     singleLine: /^\/\/.*|^<!--.*?-->/,
    //     multiLine: /\/\*[\s\S]*?\*\/|<!--[^\n]*\n(?:.*\n)*?[^-]*-->/g
    // },
    // ts: {
    //     singleLine: /^\/\/.*/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // },
    // go: {
    //     singleLine: /^\/\/.*/,
    //     multiLine: /\/\*[\s\S]*?\*\//g
    // }
    // js: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释  未解决问题：如果*/ 和/*在同一行
    // },
    // py: {
    //     lineComments: ['#'], // 单行注释
    //     blockComments: [['\'\'\'', '\'\'\''], ['"""', '"""']], // 多行注释
    // },
    // java: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
    // xml: {
    //     blockComments: [['<!--', '-->']], // 块注释
    // },
    // html: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['<!--', '-->'], ['/*', '*/']], // 块注释
    // },
    // lua: {
    //     lineComments: ['--'], // 单行注释
    //     blockComments: [['--[[', ']]']], // 多行注释
    // },
    // cs: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
    // php: {
    //     lineComments: ['//', '#'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
    // css: {
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
    // vue: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/'], ['<!--', '-->']], // 多行注释和模板注释
    // },
    // ts: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
    // go: {
    //     lineComments: ['//'], // 单行注释
    //     blockComments: [['/*', '*/']], // 多行注释
    // },
}