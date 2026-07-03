// Manual verification of calculator logic

// Tokenizer
function tokenize(expression) {
  const tokens = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (/[\d.]/.test(char)) {
      currentNumber += char;
    } else if (/[+\-*/]/.test(char)) {
      if (currentNumber) {
        const num = parseFloat(currentNumber);
        if (isNaN(num)) return [];
        tokens.push(num);
        currentNumber = '';
      }
      tokens.push(char);
    } else if (char === ' ') {
      continue;
    } else {
      return [];
    }
  }

  if (currentNumber) {
    const num = parseFloat(currentNumber);
    if (isNaN(num)) return [];
    tokens.push(num);
  }

  return tokens;
}

// Validator
function validateTokens(tokens) {
  if (tokens.length === 0) return false;
  if (typeof tokens[0] !== 'number') return false;
  if (typeof tokens[tokens.length - 1] !== 'number') return false;
  for (let i = 0; i < tokens.length; i++) {
    const isNumber = typeof tokens[i] === 'number';
    const shouldBeNumber = i % 2 === 0;
    if (isNumber !== shouldBeNumber) return false;
  }
  return true;
}

// Parser with precedence
function parseExpression(tokens) {
  let working = [...tokens];

  // First pass: * and /
  while (true) {
    let foundOperator = false;
    for (let i = 1; i < working.length; i += 2) {
      const operator = working[i];
      if (operator === '*' || operator === '/') {
        const left = working[i - 1];
        const right = working[i + 1];
        let result;
        if (operator === '*') {
          result = left * right;
        } else {
          if (right === 0) return null;
          result = left / right;
        }
        working.splice(i - 1, 3, result);
        foundOperator = true;
        break;
      }
    }
    if (!foundOperator) break;
  }

  // Second pass: + and -
  while (true) {
    let foundOperator = false;
    for (let i = 1; i < working.length; i += 2) {
      const operator = working[i];
      if (operator === '+' || operator === '-') {
        const left = working[i - 1];
        const right = working[i + 1];
        let result;
        if (operator === '+') {
          result = left + right;
        } else {
          result = left - right;
        }
        working.splice(i - 1, 3, result);
        foundOperator = true;
        break;
      }
    }
    if (!foundOperator) break;
  }

  if (working.length !== 1 || typeof working[0] !== 'number') return null;
  return working[0];
}

function truncateTo10Digits(num) {
  const str = Math.abs(num).toString();
  const parts = str.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  const isNegative = num < 0;

  if (isNegative) {
    const truncated = Math.abs(num).toString().substring(0, 10);
    return parseFloat((isNegative ? '-' : '') + truncated);
  } else {
    if (integerPart.length >= 10) {
      return parseFloat(integerPart.substring(0, 10));
    }
    const totalDigits = integerPart.length + decimalPart.length;
    if (totalDigits > 10) {
      const availableDecimal = 10 - integerPart.length;
      return parseFloat(integerPart + '.' + decimalPart.substring(0, availableDecimal));
    }
    return num;
  }
}

function evaluate(expression) {
  const trimmed = expression.trim();
  if (!trimmed) return 0;
  try {
    const tokens = tokenize(trimmed);
    if (tokens.length === 0) return 0;
    if (!validateTokens(tokens)) return 'Error';
    const result = parseExpression(tokens);
    if (result === null || isNaN(result)) return 'Error';
    return truncateTo10Digits(result);
  } catch {
    return 'Error';
  }
}

// Run tests
console.log('\n=== CALCULATOR TESTS ===\n');

let passCount = 0;
let totalCount = 0;

function test(description, expression, expected) {
  totalCount++;
  const result = evaluate(expression);
  const pass = result === expected;
  if (pass) passCount++;
  const status = pass ? '✓' : '✗';
  console.log(`${status} Test ${totalCount}: ${description}`);
  console.log(`  Expression: ${expression}`);
  console.log(`  Expected: ${expected}, Got: ${result}`);
  if (!pass) console.log(`  FAILED!`);
  console.log();
}

test('3+5 = 8', '3+5', 8);
test('4*2 = 8', '4*2', 8);
test('2+3*4 = 14 (precedence)', '2+3*4', 14);
test('3.5+2.5 = 6', '3.5+2.5', 6);
test('5/0 = Error', '5/0', 'Error');
test('10-3 = 7', '10-3', 7);
test('12/3 = 4', '12/3', 4);
test('100+50*2 = 200 (precedence)', '100+50*2', 200);

console.log(`\n=== RESULTS ===`);
console.log(`Passed: ${passCount}/${totalCount}`);

if (passCount === totalCount) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
