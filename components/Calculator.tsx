'use client';

import { useReducer } from 'react';
import {
  calculatorReducer,
  initialCalculatorState,
  CalculatorAction,
} from '@/lib/calculator';

const buttons = [
  { label: 'AC', action: { type: 'CLEAR' } },
  { label: 'DEL', action: { type: 'DELETE' } },
  { label: '÷', action: { type: 'INPUT_OPERATOR', payload: '÷' } },
  { label: '×', action: { type: 'INPUT_OPERATOR', payload: '×' } },
  { label: '7', action: { type: 'INPUT_DIGIT', payload: '7' } },
  { label: '8', action: { type: 'INPUT_DIGIT', payload: '8' } },
  { label: '9', action: { type: 'INPUT_DIGIT', payload: '9' } },
  { label: '−', action: { type: 'INPUT_OPERATOR', payload: '−' } },
  { label: '4', action: { type: 'INPUT_DIGIT', payload: '4' } },
  { label: '5', action: { type: 'INPUT_DIGIT', payload: '5' } },
  { label: '6', action: { type: 'INPUT_DIGIT', payload: '6' } },
  { label: '+', action: { type: 'INPUT_OPERATOR', payload: '+' } },
  { label: '1', action: { type: 'INPUT_DIGIT', payload: '1' } },
  { label: '2', action: { type: 'INPUT_DIGIT', payload: '2' } },
  { label: '3', action: { type: 'INPUT_DIGIT', payload: '3' } },
  { label: '=', action: { type: 'EQUALS' } },
  { label: '0', action: { type: 'INPUT_DIGIT', payload: '0' } },
  { label: '.', action: { type: 'INPUT_DECIMAL' } },
];

interface ButtonConfig {
  label: string;
  action: CalculatorAction;
}

const handleButtonClick = (
  dispatch: React.Dispatch<CalculatorAction>,
  config: ButtonConfig
) => {
  dispatch(config.action);
};

export default function Calculator() {
  const [state, dispatch] = useReducer(
    calculatorReducer,
    initialCalculatorState
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Calculator
        </h1>

        {/* Display Section */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
          {/* Expression Display (upper) */}
          <div className="text-right">
            <p className="text-gray-400 text-sm min-h-6 break-words">
              {state.expression || '\u00A0'}
            </p>
          </div>

          {/* Result Display (lower) */}
          <div className="text-right">
            <p className="text-white text-4xl font-semibold break-words truncate">
              {state.result}
            </p>
          </div>
        </div>

        {/* Button Grid - 4 columns */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, index) => {
            const isOperator =
              btn.label === '+' ||
              btn.label === '−' ||
              btn.label === '×' ||
              btn.label === '÷';
            const isEquals = btn.label === '=';
            const isFunction = btn.label === 'AC' || btn.label === 'DEL';
            const isZero = btn.label === '0';

            let buttonClass = 'h-16 rounded-lg font-semibold text-lg transition-all duration-150 active:scale-95 ';
            
            if (isZero) {
              buttonClass += 'col-span-2 bg-gray-600 hover:bg-gray-700 text-white';
            } else if (isOperator) {
              buttonClass += 'bg-orange-500 hover:bg-orange-600 text-white';
            } else if (isEquals) {
              buttonClass += 'bg-green-500 hover:bg-green-600 text-white';
            } else if (isFunction) {
              buttonClass += 'bg-red-500 hover:bg-red-600 text-white';
            } else {
              buttonClass += 'bg-gray-300 hover:bg-gray-400 text-gray-900';
            }

            return (
              <button
                key={index}
                onClick={() => handleButtonClick(dispatch, btn)}
                className={buttonClass}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}