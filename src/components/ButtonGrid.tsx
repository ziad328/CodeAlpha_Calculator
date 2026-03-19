import type { Dispatch } from 'react';
import { Button } from './Button';
import type { CalculatorState, CalculatorAction } from '../types/calculator';

interface ButtonGridProps {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}

type ButtonDef = {
  label: string;
  action: CalculatorAction;
  variant: 'lightGray' | 'darkGray' | 'orange';
  wide?: boolean;
  isBackspace?: boolean;
};

export function ButtonGrid({ state, dispatch }: ButtonGridProps) {
  const buttons: ButtonDef[] = [
    { label: '⌫',   action: { type: 'BACKSPACE' },                         variant: 'lightGray',  isBackspace: true },
    { label: 'AC',  action: { type: 'ALL_CLEAR' },                          variant: 'lightGray' },
    { label: '%',   action: { type: 'PERCENT' },                             variant: 'lightGray' },
    { label: '÷',   action: { type: 'OPERATOR', payload: '÷' },             variant: 'orange' },

    { label: '7',   action: { type: 'DIGIT', payload: '7' },                variant: 'darkGray' },
    { label: '8',   action: { type: 'DIGIT', payload: '8' },                variant: 'darkGray' },
    { label: '9',   action: { type: 'DIGIT', payload: '9' },                variant: 'darkGray' },
    { label: '×',   action: { type: 'OPERATOR', payload: '×' },             variant: 'orange' },

    { label: '4',   action: { type: 'DIGIT', payload: '4' },                variant: 'darkGray' },
    { label: '5',   action: { type: 'DIGIT', payload: '5' },                variant: 'darkGray' },
    { label: '6',   action: { type: 'DIGIT', payload: '6' },                variant: 'darkGray' },
    { label: '-',   action: { type: 'OPERATOR', payload: '-' },             variant: 'orange' },

    { label: '1',   action: { type: 'DIGIT', payload: '1' },                variant: 'darkGray' },
    { label: '2',   action: { type: 'DIGIT', payload: '2' },                variant: 'darkGray' },
    { label: '3',   action: { type: 'DIGIT', payload: '3' },                variant: 'darkGray' },
    { label: '+',   action: { type: 'OPERATOR', payload: '+' },             variant: 'orange' },

    { label: '+/-', action: { type: 'TOGGLE_SIGN' },                        variant: 'darkGray' },
    { label: '0',   action: { type: 'DIGIT', payload: '0' },                variant: 'darkGray' },
    { label: '.',   action: { type: 'DECIMAL' },                             variant: 'darkGray' },
    { label: '=',   action: { type: 'EQUALS' },                             variant: 'orange' },
  ];

  function isActiveOperator(btn: ButtonDef): boolean {
    if (btn.action.type !== 'OPERATOR') return false;
    if (btn.action.payload !== state.operator) return false;
    return state.waitingForSecond;
  }

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-3 pb-4 sm:p-4 sm:pb-6 w-full shrink-0">
      {buttons.map((btn) => (
        <Button
          key={btn.label}
          label={btn.label}
          variant={btn.variant}
          isActive={isActiveOperator(btn)}
          wide={btn.wide}
          isBackspace={btn.isBackspace}
          onClick={() => dispatch(btn.action)}
        />
      ))}
    </div>
  );
}
