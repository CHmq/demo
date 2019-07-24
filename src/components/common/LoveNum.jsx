import React from "react";
import Love from "components/common/Love";

/**
 * @name LoveNum (和Love组件配合使用)
 * @num 数量
 * @activenum 显示被选择状态
 *  
 **/ 
export default function LoveNum(num = 1,activenum = num) {
  let arr = [];
  for (let i = 0;i<num;i++) {
    let act = activenum>=i+1? true:false
    arr.push(
      <Love key={i} active={act}></Love>
    )
  }
  return arr;
}

 