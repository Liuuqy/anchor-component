//节流。计时结束后再执行回调
function throttle(fn, delay) {
  //定时器
  let pretime = Date.now();
  console.log("开始延迟", pretime);
  return function() {
    console.log("现在时间戳", Date.now() - pretime);
    if (Date.now() - pretime > delay) {
      console.log("可以开始执行函数");
      fn();
      pretime = Date.now();
    }
  };
}
export default throttle;
