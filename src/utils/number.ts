export function areAllNumbersSame(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[0]) {
      return false;
    }
  }
  return true;
}

export function findIndexOfMin(arr: number[]) {
  if (arr.length === 0) {
    return -1; // Return -1 for an empty array (or handle it as you see fit)
  }

  let minIndex = 0;
  let minValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }

  return minIndex;
}




