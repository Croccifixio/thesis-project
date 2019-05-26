export const arrToObj = (arr) => arr.reduce((acc, item, index) => ({...acc, [index]: item}), {})
