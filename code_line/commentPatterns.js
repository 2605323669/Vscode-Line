module.exports = {
    js: {
        singleLine: /^\/\/.*$/,
        multiLine: /\/\*[\s\S]*?\*\//g,
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
        multiLine: /<!--[^\n]*\n(?:.*\n)*?[^-]*-->/g,
    },
    html: {
        singleLine: /^\/\/.*/,
        multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g
    },
    lua: {
        singleLine: /^(?<!\[)--(?!\[|\])/,
        multiLine: /--\[\[[\s\S]*?\]\]/g
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
    }
}