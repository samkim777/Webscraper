function swap(list, left, right) {
  const valueLeft = list[left];
  list[left] = list[right];
  list[right] = valueLeft;
}

function partition(arr, left, right) {
  const pivot = arr[Math.floor((left + right) / 2)]; // Midpoint as pivot
  let i = left;
  let j = right;

  while (i <= j) {
    while (arr[i] < pivot) {
      i++;
    }

    while (arr[j] > pivot) {
      j--;
    }

    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }

  return i;
}

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (arr.length < 2) return arr;

  const index = partition(arr, left, right);

  if (left < index - 1) {
    quickSort(arr, left, index - 1);
  }
  if (right > index) {
    quickSort(arr, index, right);
  }
  return arr;
}
