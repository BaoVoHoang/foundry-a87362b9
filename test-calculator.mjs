// Quick test file to verify calculator.ts exports work correctly
import { evaluate, calculatorReducer, initialState } from './lib/calculator.ts';

console.log('Testing calculator.ts implementation...\n');

// Test 1: evaluate('3+5') returns 8
console.log('Test 1: evaluate("3+5") should return 8');
const test1 = evaluate('3+5');
console.log(`  Result: ${test1}, Pass: ${test1 === 8}`);

// Test 2: evaluate('4*2') returns 8
console.log('\nTest 2: evaluate("4*2") should return 8');
const test2 = evaluate('4*2');
console.log(`  Result: ${test2}, Pass: ${test2 === 8}`);

// Test 3: evaluate('2+3*4') returns 14 (operator precedence)
console.log('\nTest 3: evaluate("2+3*4") should return 14 (precedence, not 20)');
const test3 = evaluate('2+3*4');
console.log(`  Result: ${test3}, Pass: ${test3 === 14}`);

// Test 4: evaluate('3.5+2.5') returns 6
console.log('\nTest 4: evaluate("3.5+2.5") should return 6');
const test4 = evaluate('3.5+2.5');
console.log(`  Result: ${test4}, Pass: ${test4 === 6}`);

// Test 5: evaluate('5/0') returns 'Error'
console.log('\nTest 5: evaluate("5/0") should return "Error"');
const test5 = evaluate('5/0');
console.log(`  Result: ${test5}, Pass: ${test5 === 'Error'}`);

// Test 6: Result strings are truncated to 10 digits
console.log('\nTest 6: Result truncation to 10 digits');
const test6 = evaluate('123456789*1000');
console.log(`  Result: ${test6}, Length: ${test6.toString().length}, Pass: ${test6.toString().length <= 10}`);

// Test 7: Reducer CLEAR action resets state
console.log('\nTest 7: Reducer CLEAR action should reset state');
const state7 = { display: '123', previousValue: 100, operation: '+', waitingForNewValue: false };
const cleared = calculatorReducer(state7, { type: 'CLEAR' });
console.log(`  Result display: ${cleared.display}, Pass: ${cleared.display === '0' && cleared.operation === null}`);

// Test 8: Reducer DELETE action on single digit returns '0'
console.log('\nTest 8: Reducer DELETE on single digit should return "0"');
const state8 = { display: '5', previousValue: null, operation: null, waitingForNewValue: false };
const deleted = calculatorReducer(state8, { type: 'DELETE' });
console.log(`  Result display: ${deleted.display}, Pass: ${deleted.display === '0'}`);

console.log('\n✅ All manual tests completed!');
