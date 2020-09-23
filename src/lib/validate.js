import {isNullString,isEmptyArray,isNullOrUndef,isFunction, hasName} from '../utils/assertion'
import {splitToArray} from '../utils/common'
import {addMethods} from './validateConfig'

// 类：校验字段
class VaForm {
    constructor(el,vn,rule,name){
        this.dom = el
        this.vnode = vn
        this.rules = rule
        this.filedName = name
    }
}
// 类：校验表单
class Validator {
    constructor () {
        this.form = {}
        this.checkAll = checkAll
        this.errorList = []
    }
}


// 创建挂在vue实例上面的  $validator
function createValidator (vm,validator) {
    if(vm.$validator){
        return vm.$validator
    } else {
        return vm.$validator = validator
    }
}
/**
 * 类：表单校验
 */
class FormValidate {
    constructor(filedName,value,paramsValue){
        this.filedName = filedName
        this.value = value
        this.params = []
        this.validFlag = false
        this.result = {} // 返回的结果
        this.paramsValue=paramsValue  // string
        
    }
    handleResult(fn) {
        let cbValidate = fn.validate,
            cbMessage = fn.message,
            _params = this.params = fn.params || [],
            _result = {};
        if(!isFunction(cbValidate)) { console.error("请添加校验规则") ;return }
        if(!isFunction(cbMessage)) { console.error("请添加错误提示语") ;return }
        this.validFlag = cbValidate(this.value)  // 校验的结果
        _result.filedName = this.filedName
        _result.value = this.value
        if(this.validFlag){
            _result.valid = true
            _result.message = null
        }else {
            _result.valid = false
            let paramsObj = {}
            if(_params.length>0) {
                if(isNullOrUndef(this.paramsValue)|| isNullString(this.paramsValue) ){
                    console.error(_params+"参数-->缺少赋值")
                    return
                }
                // 把校验参数变成数组   paramsValueArr 与  params 必须一一对应
                let paramsValueArr = splitToArray(this.paramsValue,',')
                if (_params.length !== paramsValueArr.length) return
                
                for(let p=0;p<_params.length;p++){
                    paramsObj[_params[p]]=paramsValueArr[p]
                }
            }
            const message = cbMessage(this.filedName,paramsObj)
            _result.message = message || '该项填写错误'
        }
        this.result =Object.assign(_result) 
        return this.result
    }
}

/**
 * 处理校验规则 （校验规则可带参数，格式为： --> " [validateMethod]:[param] "） 
 * @param {*} r 
 * return ruleObj={ rule :  [validateMethod] , params : 'params '}
 */
function splitValidParams (r) {
    let rule = r,
        ruleObj = {}
    if(rule.indexOf(':')>-1){
        ruleObj.rule = rule.split(':')[0]
        ruleObj.params =  rule.split(':')[1]
    }else {
        ruleObj.rule = rule
    }
    return ruleObj
}
/**
 * function 校验全部
 */
function checkAll() {
    let _errorList = [],  // 置空
        _forms = this.form;
    this.errorList = []
    for(var key in _forms) {
        let rules = _forms[key].rules  // []
        if(rules.length <1) {
            console.error('缺少校验规则')
        }
        const name = _forms[key].filedName
        const value = _forms[key].dom.value || _forms[key].dom.dataset.validval || undefined   // 如果是基础的input框，则取value值，若是组件，组件最外层包值
        for(let r=0;r<rules.length;r++) {
            const ruleObj = splitValidParams(rules[r])  // 处理 校验规则 带有参数 
            let rule = addMethods[ruleObj.rule]
            let valid = new FormValidate(name,value,ruleObj.params)
            let validRes = valid.handleResult(rule)
            console.log('validRes-->',validRes)
            if(!validRes.valid){
                // 只验第一个规则，如果第一个规则不通过，取第一条错误信息 ，其他不再校验，确保每一个字段只有一条错误信息就够了
                validRes.dom = _forms[key].dom
                _errorList.push(validRes)
                let errMsg = {
                    filedName:validRes.filedName,
                    message:validRes.message
                }
                this.errorList.push(errMsg)
                break
            }
        }
        
    }
    handleFormClass(_forms,_errorList)
    return isEmptyArray(_errorList)
    
}

/**
 * 比较当前的错误数组与上一次的错误数组，
 * @param {*} errorList 当前的错误信息数组
 * @param {*} lastErrorList  上一次的错误信息数组
 * return 新增的错误信息 和删除的错误信息 
 */
// function compareErrorList (errorList,lastErrorList) {
//     let newErr = errorList,
//         lastErr = lastErrorList,
//         addList = [],
//         removeList = [],
//         sameList = []
//     if(isEmptyArray(newErr)){
//         handleFormClass([],lastErrorList)
//         return 
//     }
//     if(isEmptyArray(lastErrorList)){
//         handleFormClass(errorList,[])
//         return 
//     }
//     // console.log('compareErrorList',newErr,lastErr)
//     for(let n = 0;n<newErr.length;n++){
//         for (let o = 0;o<lastErr.length;o++){
//             if(isEmptyArray(lastErr)) return
//             if(newErr[n].filedName === lastErr[o].filedName) { // 如果新增数组有和旧数组相同filedNmae的item 比较两者
//                 if(newErr[n].message === lastErr[o].message) {  // 如果报错信息也相同，就push进 samelist
//                     sameList.push(newErr[n])
//                     newErr.splice(n--,1)
//                 }
//                 lastErr.splice(o--,1) // 如果不相同，则删除就数组的item 始终保持以newErr的为准
//                 break   // 找到相同的 就退出循环
//             }
//         }
//     }
//     addList = newErr
//     removeList = lastErr
//     handleFormClass(addList,removeList) 
// }

/**
 * 操作错误信息有变化的DOM
 * @param {*} form 
 * @param {*} errlist 
 */
function handleFormClass (form,errlist) {
    // 先把表单的结果清空
    let _form = form,
        _errorList = errlist;
    for(var key in _form) {
        _form[key].dom.classList.remove('has-error')
    }
    if (isEmptyArray(_errorList)) return;
     _errorList.forEach(e=>{
         e.dom.classList.add('has-error')
     })
 }

export function createVNodeValidate (el,vm,binding) {
    let finalRules = [], // 最终的校验规则
        domSelect = binding.arg || el.dataset.name,   // 获得校验字段的ID 或者是 传给指令的参数
        filedName = el.dataset.label || '必填项',
        options = binding.value || []; // 规则
    hasName(domSelect,'error:you did not set id or binding.arg')
    const va = new Validator()
    let validator = createValidator(vm,va)  // 创建 validator
    finalRules = splitToArray(options,'|')  // 校验规则语法： 以 | 分割开来
    let vaForm = new VaForm(el,vm,finalRules,filedName,options)
    validator.form[domSelect] = vaForm
}
