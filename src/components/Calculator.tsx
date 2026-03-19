import { useCalculator } from '../hooks/useCalculator';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';

export function Calculator() {
  const { state, dispatch, expressionLine } = useCalculator();

  return (
    <div className="w-full bg-[#303737] flex flex-col overflow-hidden">
      {/* Number display — grows to push buttons to the bottom */}
      <div className="flex-1 flex items-end">
        <Display value={state.displayValue} expressionLine={expressionLine} />
      </div>

      {/* Button grid */}
      <ButtonGrid state={state} dispatch={dispatch} />
    </div>
  );
}
