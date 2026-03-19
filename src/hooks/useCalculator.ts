import { useReducer, useEffect } from 'react';
import type { CalculatorState, CalculatorAction, Operator } from '../types/calculator';

// ─── Helpers ────────────────────────────────────────────────────────────────

const MAX_DIGITS = 9;

function calculate(a: number, op: Operator, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
  }
}

/** Format a raw number for storage/display (commas, trim noise). */
function formatNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'Error';
  const str = parseFloat(value.toPrecision(MAX_DIGITS)).toString();
  const [intPart, fracPart] = str.split('.');
  const formattedInt = new Intl.NumberFormat('en-US').format(parseInt(intPart, 10));
  return fracPart !== undefined ? `${formattedInt}.${fracPart}` : formattedInt;
}

/**
 * Format a raw display string (digits + optional decimal point) for the expression line.
 * E.g. "38670" → "38,670" ; "38670.5" → "38,670.5" ; "Error" → "Error"
 */
export function formatDisplayValue(raw: string): string {
  if (raw === 'Error') return 'Error';
  const trailingDot = raw.endsWith('.');
  const clean = raw.replace(/,/g, '').replace(/\.$/, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return raw;
  const [intPart, fracPart] = clean.split('.');
  const formattedInt = new Intl.NumberFormat('en-US').format(parseInt(intPart, 10));
  const base = fracPart !== undefined ? `${formattedInt}.${fracPart}` : formattedInt;
  return trailingDot ? base + '.' : base;
}

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: CalculatorState = {
  displayValue: '0',
  firstOperand: null,
  expressionFirst: '',
  operator: null,
  waitingForSecond: false,
  lastActionWasEquals: false,
  expression: '',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'ALL_CLEAR':
      return { ...initialState };

    case 'BACKSPACE': {
      // Cannot backspace into a computed result
      if (state.lastActionWasEquals || state.waitingForSecond) return state;
      if (state.displayValue === 'Error') return { ...state, displayValue: '0' };
      if (state.displayValue.length <= 1) return { ...state, displayValue: '0' };
      const trimmed = state.displayValue.slice(0, -1);
      return { ...state, displayValue: trimmed === '-' ? '0' : trimmed };
    }

    case 'DIGIT': {
      const digit = action.payload;

      // After = we start a brand-new calculation
      if (state.lastActionWasEquals) {
        return {
          ...initialState,
          displayValue: digit,
        };
      }

      if (state.waitingForSecond) {
        return { ...state, displayValue: digit, waitingForSecond: false };
      }

      // Prevent leading zeros
      if (state.displayValue === '0' && digit !== '.') {
        return { ...state, displayValue: digit };
      }

      // Enforce digit cap
      const raw = state.displayValue.replace(/,/g, '').replace('-', '').replace('.', '');
      if (raw.length >= MAX_DIGITS) return state;

      return { ...state, displayValue: state.displayValue + digit };
    }

    case 'DECIMAL': {
      if (state.waitingForSecond) {
        return { ...state, displayValue: '0.', waitingForSecond: false };
      }
      if (state.displayValue.includes('.')) return state;
      return { ...state, displayValue: state.displayValue + '.', lastActionWasEquals: false };
    }

    case 'OPERATOR': {
      const current = parseFloat(state.displayValue.replace(/,/g, ''));

      // Chain: already have an operator and user hasn't started second operand yet
      if (state.operator !== null && !state.waitingForSecond && !state.lastActionWasEquals) {
        const result = calculate(state.firstOperand ?? current, state.operator, current);
        const resultStr = formatNumber(result);
        return {
          ...state,
          displayValue: resultStr,
          firstOperand: result,
          expressionFirst: resultStr,
          operator: action.payload,
          waitingForSecond: true,
          lastActionWasEquals: false,
          expression: '',
        };
      }

      const firstVal = state.lastActionWasEquals ? current : current;
      const firstStr = formatDisplayValue(state.displayValue);
      return {
        ...state,
        firstOperand: firstVal,
        expressionFirst: firstStr,
        operator: action.payload,
        waitingForSecond: true,
        lastActionWasEquals: false,
        expression: '',
      };
    }

    case 'EQUALS': {
      if (state.operator === null || state.firstOperand === null) return state;
      const second = parseFloat(state.displayValue.replace(/,/g, ''));
      const result = calculate(state.firstOperand, state.operator, second);
      const resultStr = formatNumber(result);
      return {
        ...initialState,
        displayValue: resultStr,
        lastActionWasEquals: true,
        // Store the full expression for the display line, including =
        expression: `${state.expressionFirst}${state.operator}${formatDisplayValue(state.displayValue)}=`,
      };
    }

    case 'TOGGLE_SIGN': {
      if (state.displayValue === '0' || state.displayValue === 'Error') return state;
      const toggled = parseFloat(state.displayValue.replace(/,/g, '')) * -1;
      return { ...state, displayValue: formatNumber(toggled) };
    }

    case 'PERCENT': {
      if (state.displayValue === 'Error') return state;
      const pct = parseFloat(state.displayValue.replace(/,/g, '')) / 100;
      return { ...state, displayValue: formatNumber(pct) };
    }

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;

      if (key >= '0' && key <= '9') {
        dispatch({ type: 'DIGIT', payload: key });
      } else if (key === '.') {
        dispatch({ type: 'DECIMAL' });
      } else if (key === '+') {
        dispatch({ type: 'OPERATOR', payload: '+' });
      } else if (key === '-') {
        dispatch({ type: 'OPERATOR', payload: '-' });
      } else if (key === '*') {
        dispatch({ type: 'OPERATOR', payload: '×' });
      } else if (key === '/') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '÷' });
      } else if (key === 'Enter' || key === '=') {
        dispatch({ type: 'EQUALS' });
      } else if (key === 'Escape') {
        dispatch({ type: 'ALL_CLEAR' });
      } else if (key === 'Backspace') {
        dispatch({ type: 'BACKSPACE' });
      } else if (key === '%') {
        dispatch({ type: 'PERCENT' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * The expression string shown above the main result.
   * - After =   : shows the complete expression (e.g. "38,670÷50,000")
   * - During op  : shows first operand + operator (e.g. "38,670÷")
   * - While typing second : shows first op + live second (e.g. "38,670÷5")
   */
  let expressionLine = '';
  if (state.lastActionWasEquals) {
    expressionLine = state.expression;
  } else if (state.operator !== null) {
    if (state.waitingForSecond) {
      expressionLine = `${state.expressionFirst}${state.operator}`;
    } else {
      expressionLine = `${state.expressionFirst}${state.operator}${formatDisplayValue(state.displayValue)}`;
    }
  }

  return { state, dispatch, expressionLine };
}
