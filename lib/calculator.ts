/**
 * Convert display operator symbols to standard operators for evaluation
 */
function normalizeOperator(op: string): string {
  const operatorMap: Record<string, string> = {
    '÷': '/',
    '×': '*',
    '−': '-',
  };
  return operatorMap[op] || op;
}

/**
 * Evaluates a mathematical expression with proper operator precedence.
 * Supports +, -, *, / operators.
 * @param expression - The mathematical expression as a string
 * @returns The result of the evaluation, or NaN if invalid
 */
export function evaluate(expression: string): number {
  // Normalize display symbols to standard operators
  let normalized = expression;
  normalized = normalized.replace(/÷/g, '/');
  normalized = normalized.replace(/×/g, '*');
  normalized = normalized.replace(/−/g, '-');

  // Trim whitespace
  normalized = normalized.trim();

  // Handle empty expression
  if (!normalized) {
    return 0;
  }

  // Check for division by zero
  if (/\d+\s*\/\s*0(?![0-9.])/.test(normalized)) {
    return NaN; // Indicate error
  }

  try {
    // Split by + and - (lowest precedence)
    const addSubTokens = normalized.split(/(?=[+-])/);
    let result = 0;
    let currentOp = '+';

    for (const token of addSubTokens) {
      const trimmedToken = token.trim();
      if (!trimmedToken) continue;

      // Check if token starts with operator
      let operator = currentOp;
      let operand = trimmedToken;

      if (trimmedToken[0] === '+' || trimmedToken[0] === '-') {
        operator = trimmedToken[0];
        operand = trimmedToken.slice(1).trim();
      }

      // Evaluate multiplication and division in operand
      const value = evaluateMultDiv(operand);

      if (isNaN(value)) {
        return NaN;
      }

      if (operator === '+') {
        result += value;
      } else if (operator === '-') {
        result -= value;
      }

      currentOp = operator;
    }

    return result;
  } catch (error) {
    return NaN;
  }
}

/**
 * Evaluates multiplication and division operations
 * @param expression - Expression containing only * and / operations
 * @returns The result
 */
function evaluateMultDiv(expression: string): number {
  const tokens = expression.split(/(?=[*/])/);
  let result = 1;
  let currentOp = '*';

  for (const token of tokens) {
    const trimmedToken = token.trim();
    if (!trimmedToken) continue;

    let operator = currentOp;
    let operand = trimmedToken;

    if (trimmedToken[0] === '*' || trimmedToken[0] === '/') {
      operator = trimmedToken[0];
      operand = trimmedToken.slice(1).trim();
    }

    const value = parseFloat(operand);

    if (isNaN(value)) {
      return NaN;
    }

    if (operator === '*') {
      result *= value;
    } else if (operator === '/') {
      if (value === 0) {
        return NaN;
      }
      result /= value;
    }

    currentOp = operator;
  }

  return result;
}

/**
 * Calculator state interface
 */
export interface CalculatorState {
  input: string; // Current number/operand being entered
  expression: string; // Full expression accumulated without intermediate evaluation
  result: string; // Display result
  lastWasEquals: boolean; // Track if last action was equals
}

/**
 * Action types for calculator reducer
 */
export type CalculatorAction =
  | { type: 'INPUT_DIGIT'; payload: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_OPERATOR'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'DELETE' };

/**
 * Initial state for calculator
 */
export const initialCalculatorState: CalculatorState = {
  input: '0',
  expression: '',
  result: '0',
  lastWasEquals: false,
};

/**
 * Reducer function for calculator state management
 */
export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT': {
      const digit = action.payload;

      // If last action was equals, start fresh
      if (state.lastWasEquals) {
        return {
          ...state,
          input: digit,
          expression: '',
          result: digit,
          lastWasEquals: false,
        };
      }

      // Replace leading 0 with new digit (unless input is "0.")
      if (state.input === '0' && !state.input.includes('.')) {
        return {
          ...state,
          input: digit,
          result: digit,
        };
      }

      // Limit display to 10 digits
      if (state.input.length >= 10) {
        return state;
      }

      const newInput = state.input + digit;
      return {
        ...state,
        input: newInput,
        result: newInput,
      };
    }

    case 'INPUT_DECIMAL': {
      // If last action was equals, start fresh
      if (state.lastWasEquals) {
        return {
          ...state,
          input: '0.',
          expression: '',
          result: '0.',
          lastWasEquals: false,
        };
      }

      // Don't add decimal if already present
      if (state.input.includes('.')) {
        return state;
      }

      return {
        ...state,
        input: state.input + '.',
        result: state.input + '.',
      };
    }

    case 'INPUT_OPERATOR': {
      const operator = action.payload;

      // If last action was equals, use result as starting point
      if (state.lastWasEquals) {
        return {
          ...state,
          expression: state.result + ' ' + operator + ' ',
          input: '0',
          lastWasEquals: false,
        };
      }

      // If expression is empty, start new expression
      if (state.expression === '') {
        return {
          ...state,
          expression: state.input + ' ' + operator + ' ',
          input: '0',
        };
      }

      // If input is still 0 (no new number entered), replace operator
      if (state.input === '0') {
        // Replace last operator
        const newExpression = state.expression.slice(0, -2) + operator + ' ';
        return {
          ...state,
          expression: newExpression,
        };
      }

      // Accumulate the operand to the expression WITHOUT evaluating yet
      // This preserves operator precedence for chain operations like 2 + 3 * 4
      const newExpression = state.expression + state.input + ' ' + operator + ' ';
      return {
        ...state,
        expression: newExpression,
        input: '0',
        result: state.input, // Keep displaying the current input
      };
    }

    case 'EQUALS': {
      // If expression is empty, no operation to perform
      if (state.expression === '') {
        return {
          ...state,
          lastWasEquals: true,
        };
      }

      // Evaluate the full expression (complete accumulation)
      const fullExpression = state.expression + state.input;
      const evalResult = evaluate(fullExpression);

      if (isNaN(evalResult)) {
        return {
          ...state,
          result: 'Error',
          input: '0',
          expression: '',
          lastWasEquals: true,
        };
      }

      const resultStr = String(evalResult);
      const displayResult = resultStr.length > 10 ? resultStr.slice(0, 10) : resultStr;

      return {
        ...state,
        result: displayResult,
        input: displayResult,
        expression: '',
        lastWasEquals: true,
      };
    }

    case 'CLEAR': {
      return initialCalculatorState;
    }

    case 'DELETE': {
      // Can't delete if displaying error
      if (state.result === 'Error') {
        return initialCalculatorState;
      }

      // If input is single digit or empty, reset to 0
      if (state.input.length <= 1) {
        return {
          ...state,
          input: '0',
          result: '0',
        };
      }

      // Remove last character
      const newInput = state.input.slice(0, -1);
      return {
        ...state,
        input: newInput,
        result: newInput,
      };
    }

    default:
      return state;
  }
}
