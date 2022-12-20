function merge(arr1: any[], arr2: any[], type: string = "id") {
  const seen = new Set();

  const data = [...arr1, ...arr2];

  const result = data.filter((el) => {
    const duplicate = seen.has(el[type]);
    seen.add(el[type]);
    return !duplicate;
  });

  return result;
}

export default merge;
