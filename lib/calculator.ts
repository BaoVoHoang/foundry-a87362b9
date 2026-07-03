/**
 * Core arithmetic engine with operator precedence and pure functions.
 * Handles single-pass expression evaluation with proper precedence for *, / before +, -.
 */

/**
 * Evaluates a mathematical expression with proper operator precedence.
 * Supports +, -, *, / operators.
 * Handles division by zero by returning 'Error'.
 * Handles decimal inputs.
 * Truncates results to 10 digits.
 * 
 * @param expression - The mathematical expression as a string
 * @returns The result of the evaluation as a number, or 'Error' string
 */
export function evaluate(expression: string): number | 'Error' {
  const trimmed = expression.trim();
  
  if (!trimmed) {
    return 0;
  }

  try {
    // Tokenize the expression
    const tokens = tokenize(trimmed);
    
    if (tokens.length === 0) {
      return 0;
    }

    // Validate tokens
    if (!validateTokens(tokens)) {
      return 'Error';
    }

    // Parse and evaluate with operator precedence
    const result = parseExpression(tokens);

    if (result === null || isNaN(result)) {
      return 'Error';
    }

    // Truncate to 10 digits
    return truncateTo10Digits(result);
  } catch {
    return 'Error';
  }
}

/**
 * Tokenizes an expression string into numbers and operators.
 */
function tokenize(expression: string): (number | string)[] {
  const tokens: (number | string)[] = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (/[\d.]/.test(char)) {
      currentNumber += char;
    } else if (/[+\-*/]/.test(char)) {
      if (currentNumber) {
        const num = parseFloat(currentNumber);
        if (isNaN(num)) {
          return [];
        }
        tokens.push(num);
        currentNumber = '';
      }
      tokens.push(char);
    } else if (char === ' ') {
      // Skip whitespace
      continue;
    } else {
      // Invalid character
      return [];
    }
  }

  if (currentNumber) {
    const num = parseFloat(currentNumber);
    if (isNaN(num)) {
      return [];
    }
    tokens.push(num);
  }

  return tokens;
}

/**
 * Validates token sequence (must alternate number-operator-number...).
 */
function validateTokens(tokens: (number | string)[]): boolean {
  if (tokens.length === 0) {
    return false;
  }

  // Must start with a number
  if (typeof tokens[0] !== 'number') {
    return false;
  }

  // Must end with a number
  if (typeof tokens[tokens.length - 1] !== 'number') {
    return false;
  }

  // Must alternate number-operator-number
  for (let i = 0; i < tokens.length; i++) {
    const isNumber = typeof tokens[i] === 'number';
    const shouldBeNumber = i % 2 === 0;

    if (isNumber !== shouldBeNumber) {
      return false;
    }
  }

  return true;
}

/**
 * Parses and evaluates tokens with proper operator precedence.
 * First pass: handle * and /
 * Second pass: handle + and -
 */
function parseExpression(tokens: (number | string)[]): number | null {
  let working = [...tokens];

  // First pass: handle * and / (higher precedence)
  while (true) {
    let foundOperator = false;

    for (let i = 1; i < working.length; i += 2) {
      const operator = working[i];

      if (operator === '*' || operator === '/') {
        const left = working[i - 1] as number;
        const right = working[i + 1] as number;

        let result: number;

        if (operator === '*') {
          result = left * right;
        } else {
          // Division by zero check
          if (right === 0) {
            return null;
          }
          result = left / right;
        }

        // Replace the three tokens with the result
        working.splice(i - 1, 3, result);
        foundOperator = true;
        break;
      }
    }

    if (!foundOperator) {
      break;
    }
  }

  // Second pass: handle + and - (lower precedence)
  while (true) {
    let foundOperator = false;

    for (let i = 1; i < working.length; i += 2) {
      const operator = working[i];

      if (operator === '+' || operator === '-') {
        const left = working[i - 1] as number;
        const right = working[i + 1] as number;

        let result: number;

        if (operator === '+') {
          result = left + right;
        } else {
          result = left - right;
        }

        // Replace the three tokens with the result
        working.splice(i - 1, 3, result);
        foundOperator = true;
        break;
      }
    }

    if (!foundOperator) {
      break;
    }
  }

  // Should be left with a single number
  if (working.length !== 1 || typeof working[0] !== 'number') {
    return null;
  }

  return working[0];
}

/**
 * Truncates a number to 10 digits for display.
 */
function truncateTo10Digits(num: number): number {
  const str = Math.abs(num).toString();
  const parts = str.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  const isNegative = num < 0;

  // Total digits available for display (10 including decimal point if negative includes minus sign)
  if (isNegative) {
    // If negative, we have the minus sign consuming space
    // "−1234567890" is 11 characters, but we count 10 digits + sign
    // For simplicity, truncate the string representation to 10 chars total
    const truncated = Math.abs(num).toString().substring(0, 10);
    return parseFloat((isNegative ? '-' : '') + truncated);
  } else {
    // For positive numbers, truncate to 10 digits
    if (integerPart.length >= 10) {
      return parseFloat(integerPart.substring(0, 10));
    }
    // If we have decimals and total exceeds 10, truncate
    const totalDigits = integerPart.length + decimalPart.length;
    if (totalDigits > 10) {
      const availableDecimal = 10 - integerPart.length;
      return parseFloat(integerPart + '.' + decimalPart.substring(0, availableDecimal));
    }
    return num;
  }
}

/**
 * Calculator state type for useReducer.
 */
export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
}

/**
 * Action types for the calculator reducer.
 */
export type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'DELETE' };

/**
 * Initial state for the calculator.
 */
export const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForNewValue: true,
};

/**
 * Reducer function for calculator state transitions.
 * Handles DIGIT, OPERATOR, EQUALS, CLEAR, and DELETE actions.
 */
export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      // Handle digit input
      if (state.waitingForNewValue) {
        // Replace '0' or start new number after operator
        return {
          ...state,
          display: action.payload,
          waitingForNewValue: false,
        };
      } else {
        // Append digit, but enforce 10-digit display limit
        if (state.display.length < 10) {
          return {
            ...state,
            display: state.display + action.payload,
          };
        }
        return state;
      }
    }

    case 'OPERATOR': {
      const currentValue = parseFloat(state.display);

      if (state.operation && !state.waitingForNewValue && state.previousValue !== null) {
        // Chain operations: evaluate previous operation first
        const result = evaluate(
          `${state.previousValue}${state.operation}${currentValue}`
        );

        if (result === 'Error') {
          return {
            ...state,
            display: 'Error',
            previousValue: null,
            operation: action.payload,
            waitingForNewValue: true,
          };
        }

        const truncated = truncateTo10Digits(result as number);
        return {
          ...state,
          display: truncated.toString(),
          previousValue: truncated,
          operation: action.payload,
          waitingForNewValue: true,
        };
      }

      // Normal operator input
      return {
        ...state,
        previousValue: currentValue,
        operation: action.payload,
        waitingForNewValue: true,
      };
    }

    case 'EQUALS': {
      if (state.operation === null || state.previousValue === null) {
        return state;
      }

      const currentValue = parseFloat(state.display);
      const result = evaluate(
        `${state.previousValue}${state.operation}${currentValue}`
      );

      if (result === 'Error') {
        return {
          ...state,
          display: 'Error',
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      }

      const truncated = truncateTo10Digits(result as number);
      return {
        ...state,
        display: truncated.toString(),
        previousValue: null,
        operation: null,
        waitingForNewValue: true,
      };
    }

    case 'CLEAR': {
      return initialState;
    }

    case 'DELETE': {
      if (state.waitingForNewValue) {
        return state;
      }

      if (state.display.length === 1) {
        return {
          ...state,
          display: '0',
          waitingForNewValue: true,
        };
      }

      return {
        ...state,
        display: state.display.slice(0, -1),
      };
    }

    default:
      return state;
  }
}
