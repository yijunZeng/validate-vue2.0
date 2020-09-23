export function isEmptyArray(arr){
    return Array.isArray(arr) && arr.length === 0
}

export function isNullOrUndef (val) {
    return val === null || val === undefined
}

export function isFunction (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
}
// 空字符串
export function isNullString (val) {
    return !String(val).trim().length;
    // 双重取反 !!String(val).trim().length
}
/**
 * 校验方法断言：如果没有设置ID或者传给指令的参数，就输出报错信息
 * @param {*} name 
 * @param {*} message 
 */
export function hasName (name,message){
    if(!name){
         console.error('[validator-warn]:',message)
    }
}