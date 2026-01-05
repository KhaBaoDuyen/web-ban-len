export const formatCompact = (value:number) =>{
  if(value >= 1_000_000){
    const num = value/ 1_000_000;
    return num % 1 ===0 ? `${num}tr` : `${num.toFixed(1)}tr`;
  }
  if (value >= 1_000) {
    const num = value / 1_000;
    return num % 1 === 0 ? `${num}k` : `${num.toFixed(1)}k`;
  }

  return value.toString();
}