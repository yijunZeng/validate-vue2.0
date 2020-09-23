import {createVNodeValidate} from './validate'

let Validator = {}
Validator.install = function(Vue) {
    Vue.directive('validate',{
        bind:function(el,binding,vnode){
            
            let vm = vnode.context   // context: Component | void; // rendered in this component's scope
            
            createVNodeValidate(el,vm,binding)
        }
    })

}
// 判断是否是直接引入文件
// if (typeof window !== "undefined" && window.Vue) {
//     install(window.Vue);
// }
export default Validator