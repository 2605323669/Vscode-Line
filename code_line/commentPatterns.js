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
}