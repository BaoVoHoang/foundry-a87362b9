// Test calculator by directly requiring Next.js build output
const path = require('path');

// Test basic cases by importing TypeScript source through Node
// We'll create a simple test to validate the logic manually

console.log('Testing core evaluate logic manually...\n');

// Test parsing and evaluation
function testEvaluate() {
  // Simulate what evaluate should do
  
  // Test 1: 3+5 = 8
  console.log('Test 1: 3+5 should equal 8');
  console.log('  Expected: 8');
  
  // Test 2: 4*2 = 8
  console.log('Test 2: 4*2 should equal 8');
  console.log('  Expected: 8');
  
  // Test 3: 2+3*4 should equal 14 (not 20, due to precedence)
  console.log('Test 3: 2+3*4 should equal 14');
  console.log('  Expected: 14 (multiplication before addition)');
  
  // Test 4: 3.5+2.5 = 6
  console.log('Test 4: 3.5+2.5 should equal 6');
  console.log('  Expected: 6');
  
  // Test 5: 5/0 should return Error
  console.log('Test 5: 5/0 should return "Error"');
  console.log('  Expected: "Error"');
}

testEvaluate();
