  import {luhnCheck} from '../utils/common'
  import {isNullString,isEmptyArray,isNullOrUndef} from '../utils/assertion'
/**
 * 添加校验的方法
 */
export const addMethods = {
    required:{
        validate:(value) => {
            return !(isNullOrUndef(value) || isEmptyArray(value) || isNullString(value))
        },
        params:['type'],
        message: (filedName, place)=>{
            switch (place.type) {
                case 'check':
                    return  `请检查${filedName}`;
                    break;
                case 'pick':
                    return  `请选择${filedName}`;
                    break;
                case 'bank':
                    return '请添加银行卡';
                    break;
                case 'companyName':
                    return `请检查${filedName}（4-30个字，不支持标点符号）`;
                    break;
                case 'addr':
                    return `请检查${filedName}（4-30个字，支持输入-和～）`;
                    break;
                default:
                    return `${filedName}不能为空`;
                    break;
            }
        }
    },
    // compare:{   // 两两相等
    //     validate:(val1,val2)=>{
    //         if(!val1 || !val2)  return true
    //         if(val1 === val2) return false
    //     }
    // },
    bankAccount:{
        validate:value => /^\d{15,19}$/.test(value) && luhnCheck(value),
        message: field => '银行卡号输入错误',
    },
    mobilePhone: {
        validate:value => /^1\d{10}$/.test(value),
        message: field => `请检查${field}`,
    },
    contactMobilePhone:{
        validate: value => /^1[3-9]\d{9}$/.test(value),
        message: field => `请检查${field}`,
    },
    smsCode:{
        validate: value => /^\d{1,8}$/.test(value),
        message: field => `${field}格式不对`,
    },
    homeAddrDetail:{
        validate: value => {
            const reg = new RegExp('^[\\u4e00-\\u9fa5a-zA-Z0-9-~～ 　]{4,30}$');
            console.log(reg.test(value));
            return reg.test(value);
        },
        message: field => `请检查${field}（4-30个字，支持输入-和～）`,
    },
    companyName: {
        validate: value => /^[\u4e00-\u9fa5a-zA-Z0-9]{4,30}$/.test(value),
        message: field => `请检查${field}（4-30个字，不支持标点符号）`,
    },
    name:{
        validate: value => /^[\u4e00-\u9fa5•]{1,10}$/.test(value),
        message: field => `请检查${field}是否正确`,
    },
    idNo:{
        validate: value => /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(value),
        message: field => '身份证号输入错误',
    },
    companyTel:{  // TODO:  如果传进来是一个对象，怎么校验？？？
        validate: value =>
        /^0\d{2,3}$/.test(value.companyTelArea) &&
        /\d{6,8}$/.test(value.companyTelNo),
        message: field => `${field}格式不对`,
    },
    photos:{  // TODO:  如果传进来是一个对象，怎么校验？？？
        validate:value => value.identityFront && value.identityBack && value.facePhoto,
        message: field => '请拍三张照片',
    },
    

}