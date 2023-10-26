function DecreaseDecimal(number) {
  const res = parseFloat(+number).toFixed(2);
  return +res;
}
export function DecimalFunction(value) {
  const newArray = value.map((e) => {
    return [`${DecreaseDecimal(e[0])}`, `${DecreaseDecimal(e[1])}`];
  });
  return newArray;
}
