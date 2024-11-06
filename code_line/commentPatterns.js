module.exports = {
    js: {
        // singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        singleLine: /^\/\/.*/
    },
    java: {
        // singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        singleLine: /^\/\/.*/
    },
    py: {
        // singleLine: /#.*$/gm,
        multiLine: /(['"]{3})[\s\S]*?\1/g,
        singleLine: /^#/
    },
    xml: {
        singleLine: /^<!--.*?-->/,
        multiLine: /<!--[^\n]*\n(?:.*\n)*?[^-]*-->/g,//<!-- 这是一个XML文件 -->
    },
    html: {
        // singleLine: /\/\/.*$/gm,
        multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g,
        singleLine: /^\/\/.*/
    },
    lua: {
        // singleLine: /--.*$/gm,
        multiLine: /--\[\[[\s\S]*?\]\]/g,
        singleLine: /^(?<!\[)--(?!\[|\])/
    },
    cs: {
        // singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        singleLine: /^\/\/.*/
    },
    php: {
        // singleLine: /\/\/.*$|#.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        singleLine: /^(?:\/\/|\#).*$/
    },
    css: {
        multiLine: /\/\*[\s\S]*?\*\//g
    },
    vue: {
        singleLine: /^\/\/.*|^<!--.*?-->/,
        multiLine: /\/\*[\s\S]*?\*\/|<!--[^\n]*\n(?:.*\n)*?[^-]*-->/g
    },
    ts: {
        multiLine: /\/\*[\s\S]*?\*\//g,
        singleLine: /^\/\/.*/
    }
}