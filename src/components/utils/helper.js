export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
export function replaceUrls(value) {
    var text = value.replace(/<br\s*[\\/]?>/gi, " </br>").replace(/(https?:\/\/)(www\.)?([\S]*)/g, '<a href="$1$2$3" target="_blank">$1$2$3</a>');
    return text;
}