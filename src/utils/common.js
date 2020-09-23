/**
 * 将字符串以 s 分割成数组
 * @export
 * @param {*} str 
 * @param {*} s 
 */
export function splitToArray(str,s) {
    let arr = []
    if(str.indexOf(s)>-1){
        arr = str.split(s)
    } else {
        arr.push(str)
    }
    return arr
}
/**
 * 银行卡2121校验
 *
 * @export
 * @param {any} bankno
 * @returns
 */
export function luhnCheck(bankno) {
    const lastNum = bankno.substr(bankno.length - 1, 1); // 取出最后一位（与luhn进行比较）
  
    const first15Num = bankno.substr(0, bankno.length - 1); // 前15或18位
    const newArr = new Array();
    for (let i = first15Num.length - 1; i > -1; i--) {
      // 前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
    const arrJiShu = new Array(); // 奇数位*2的积 <9
    const arrJiShu2 = new Array(); // 奇数位*2的积 >9
  
    const arrOuShu = new Array(); // 偶数位数组
    for (let j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) {
        // 奇数位
        if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
        else arrJiShu2.push(parseInt(newArr[j]) * 2);
      } else arrOuShu.push(newArr[j]); // 偶数位
    }
  
    const jishu_child1 = new Array(); // 奇数位*2 >9 的分割之后的数组个位数
    const jishu_child2 = new Array(); // 奇数位*2 >9 的分割之后的数组十位数
    for (let h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }
  
    let sumJiShu = 0; // 奇数位*2 < 9 的数组之和
    let sumOuShu = 0; // 偶数位数组之和
    let sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
    let sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
    let sumTotal = 0;
    for (let m = 0; m < arrJiShu.length; m++) {
      sumJiShu += parseInt(arrJiShu[m]);
    }
  
    for (let n = 0; n < arrOuShu.length; n++) {
      sumOuShu += parseInt(arrOuShu[n]);
    }
  
    for (let p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 += parseInt(jishu_child1[p]);
      sumJiShuChild2 += parseInt(jishu_child2[p]);
    }
    // 计算总和
    sumTotal =
      parseInt(sumJiShu) +
      parseInt(sumOuShu) +
      parseInt(sumJiShuChild1) +
      parseInt(sumJiShuChild2) +
      parseInt(lastNum);
    if (parseInt(sumTotal) % 10 === 0) {
      return true;
    }
    return false;
  }