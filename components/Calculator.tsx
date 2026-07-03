'use client';

import { useReducer } from 'react';
import { calculatorReducer, initialState } from '@/lib/calculator';

export default function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const handleDigit = (digit: string) => {
    dispatch({ type: 'DIGIT', payload: digit });
  };

  const handleOperator = (operator: string) => {
    dispatch({ type: 'OPERATOR', payload: operator });
  };

  const handleEquals = () => {
    dispatch({ type: 'EQUALS' });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE' });
  };

  const isDeleteDisabled = state.display === '0';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h1 className="text-2xl font-bold text-center mb-6">Calculator</h1>
        
        {/* Display */}
        <div className="bg-gray-200 rounded mb-6 p-4 text-right text-4xl font-bold text-gray-800 break-words">
          {state.display}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1: AC, DEL, /, * */}
          <button
            onClick={handleClear}
            className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded"
          >
            AC
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className={`bg-orange-500 text-white font-bold py-4 rounded ${
              isDeleteDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-orange-600'
            }`}
          >
            DEL
          </button>
          <button
            onClick={() => handleOperator('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded"
          >
            /
          </button>

          {/* Row 2: 7, 8, 9, * */}
          <button
            onClick={() => handleDigit('7')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('*')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded"
          >
            *
          </button>

          {/* Row 3: 4, 5, 6, - */}
          <button
            onClick={() => handleDigit('4')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded"
          >
            -
          </button>

          {/* Row 4: 1, 2, 3, + */}
          <button
            onClick={() => handleDigit('1')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded"
          >
            +
          </button>

          {/* Row 5: 0, ., = */}
          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
