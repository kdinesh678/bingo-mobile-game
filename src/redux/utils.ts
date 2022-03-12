export function setNumberInArray(
  array: number[],
  number: number,
  position: number,
) {
  if (!array[position]) {
    const newArray = [...array];
    newArray[position] = number;
    return newArray;
  }

  return array;
}

export function getJoinLineDirection(
  numbers: number[],
  sequencesFormed: Set<number>[] = [],
) {
  const result: Record<number, string[]> = {};

  for (let i = 0; i < numbers.length; i++) {
    // there are direction in which a line can form and two numbers can always be in one set
    for (let j = 0; j < sequencesFormed.length; j++) {
      if (!sequencesFormed[j].has(numbers[i])) {
        continue;
      }
      // top
      if (i - 5 >= 0 && sequencesFormed[j].has(numbers[i - 5])) {
        result[i] = [...(result[i] || []), 'top'];
      }
      //right
      if ((i + 1) % 5 !== 0 && sequencesFormed[j].has(numbers[i + 1])) {
        result[i] = [...(result[i] || []), 'right'];
      }
      // bottom
      if (i + 5 < 25 && sequencesFormed[j].has(numbers[i + 5])) {
        result[i] = [...(result[i] || []), 'bottom'];
      }
      // left
      if (i % 5 !== 0 && sequencesFormed[j].has(numbers[i - 1])) {
        result[i] = [...(result[i] || []), 'left'];
      }

      // check if the number on main diagonal
      if (i % 6 === 0) {
        // top-left
        if (i && sequencesFormed[j].has(numbers[i - 6])) {
          result[i] = [...(result[i] || []), 'topLeft'];
        }

        // botttom-right
        if (i !== 24 && sequencesFormed[j].has(numbers[i + 6])) {
          result[i] = [...(result[i] || []), 'bottomRight'];
        }
      }

      if (i && i !== 24 && i % 4 === 0) {
        //top-right
        if (i - 4 && sequencesFormed[j].has(numbers[i - 4])) {
          result[i] = [...(result[i] || []), 'topRight'];
        }
        // bottom-left
        if (i + 4 !== 24 && sequencesFormed[j].has(numbers[i + 4])) {
          result[i] = [...(result[i] || []), 'bottomLeft'];
        }
      }
    }
  }

  return result;
}

export function generateEmptyArray() {
  const numbers = [];
  for (let i = 0; i < 25; i++) {
    numbers.push(0);
  }
  return numbers;
}

export function generateRandomArray() {
  const numbers = [];
  for (let i = 0; i < 25; i++) {
    numbers.push(i + 1);
  }

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

export function selectRandomNumber(
  numbers: number[],
  selectedNumbers: number[],
) {
  const unselectNumbers = numbers.filter(
    num => !selectedNumbers.find(selNum => selNum === num),
  );

  const randomIndex = Math.floor(Math.random() * unselectNumbers.length);

  return unselectNumbers[randomIndex];
}

export function nextGoodNumber(
  numbers: number[],
  selectedNumbers: number[],
): number {
  let allNumberSets = getIncompletedSetsWithoutSelectedNumber(
    numbers,
    selectedNumbers,
  );

  let setsWithLeastSize = [allNumberSets[0]];
  let allNumbers = [...allNumberSets[0]];

  for (let i = 1; i < allNumberSets.length; i++) {
    if (allNumberSets[i].size < setsWithLeastSize[0].size) {
      setsWithLeastSize = [allNumberSets[i]];
      allNumbers = [...allNumberSets[i]];
    } else if (allNumberSets[i].size === setsWithLeastSize[0].size) {
      setsWithLeastSize.push(allNumberSets[i]);
      allNumbers.push(...allNumberSets[i]);
    }
  }

  if (setsWithLeastSize.length === 1) {
    const [number] = mostFrequentInSets(
      [...setsWithLeastSize[0]],
      allNumberSets,
    );

    return number;
  } else {
    let commonNumbers = [...setsWithLeastSize[0]];

    for (let i = 1; i < setsWithLeastSize.length; i++) {
      commonNumbers = commonNumbers.filter(num =>
        setsWithLeastSize[i].has(num),
      );
    }

    if (commonNumbers.length && commonNumbers.length === 1) {
      return commonNumbers[0];
    }

    //find the numbers with maximum occurrence
    const [num, freq] = mostFrequentInSets(allNumbers, setsWithLeastSize);
    if (freq === 1) {
      const [finalNum] = mostFrequentInSets(allNumbers, allNumberSets);

      return finalNum;
    }
    return num;
  }
}

export function getCompleteSets(
  numbers: number[],
  selectedNumbers: number[],
): Set<number>[] {
  const allSets = generateSets(numbers);
  const selectedNumbersSet = new Set(selectedNumbers);
  const completeSets = [];

  for (let i = 0; i < allSets.length; i++) {
    let isCompleteSet = true;
    for (const ele of allSets[i]) {
      if (!selectedNumbersSet.has(ele)) {
        isCompleteSet = false;
        break;
      }
    }

    if (isCompleteSet) {
      completeSets.push(allSets[i]);
    }
  }

  return completeSets;
}

function getIncompletedSetsWithoutSelectedNumber(
  numbers: number[],
  selectedNumbers: number[],
) {
  const allSets = generateSets(numbers);
  const selectedNumbersSet = new Set(selectedNumbers);
  const incompleteSets = [];

  for (let i = 0; i < allSets.length; i++) {
    for (const ele of allSets[i]) {
      if (selectedNumbersSet.has(ele)) {
        allSets[i].delete(ele);
      }
    }

    if (allSets[i].size > 0) {
      incompleteSets.push(allSets[i]);
    }
  }

  return incompleteSets;
}

function generateSets(numbers: number[]): Set<number>[] {
  const horizonatalSets: Set<number>[] = [];

  for (let i = 0; i < numbers.length; i += 5) {
    horizonatalSets.push(new Set(numbers.slice(i, i + 5)));
  }

  const verticalSets: Set<number>[] = [];
  for (let i = 0; i < numbers.length; i++) {
    const index = i % 5;

    verticalSets[index] = new Set([...(verticalSets[index] || []), numbers[i]]);
  }

  const diagonalSets: Set<number>[] = [];

  for (let i = 0, j = 0; i < numbers.length; i += 5, j++) {
    diagonalSets[0] = new Set([...(diagonalSets[0] || []), numbers[i + j]]);

    diagonalSets[1] = new Set([...(diagonalSets[1] || []), numbers[i + 4 - j]]);
  }

  const allSet = [...horizonatalSets, ...verticalSets, ...diagonalSets];

  return allSet;
}

function mostFrequentInSets(numbers: number[], sets: Set<number>[]) {
  const countObj: any = {};
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    countObj[num] = 0;

    for (let j = 0; j < sets.length; j++) {
      if (sets[j].has(num)) {
        countObj[num]++;
      }
    }
  }

  let maxCount = 0;
  let res = 0;

  for (const key of Object.keys(countObj)) {
    if (countObj[key] > maxCount) {
      maxCount = countObj[key];
      res = Number(key);
    }
  }

  return [res, maxCount];
}
