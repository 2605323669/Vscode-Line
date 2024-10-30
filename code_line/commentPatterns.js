module.exports ={
    js: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    java: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    py: {
        singleLine: /#.*$/gm,
        multiLine: /(['"]{3})[\s\S]*?\1/g,
        regex: /^#/
    },
    xml: {
        multiLine: /<!--\s*[\s\S]*?\s*-->/g,
        regex: /^<!/,
        xml: "xml"
    },
    html: {
        singleLine: /\/\/.*$/gm,
        multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    lua: {
        singleLine: /--.*$/gm,
        multiLine: /--\[\[[\s\S]*?\]\]/g,
        regex: /^--.*/,
        regex1: /^--\[\[/,
        regex2: /^--\]\]/
    },
    cs: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    php: {
        singleLine: /\/\/.*$|#.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^(?:\/\/|\#).*$/
    },
    css: {
        multiLine: /\/\*[\s\S]*?\*\//g
    }
}