export type Operator = '+' | '-' | '×' | '÷';

export type ButtonVariant = 'lightGray' | 'darkGray' | 'orange';

export interface CalculatorState {
  /** The number currently being built or shown on the display */
  displayValue: string;
  /** The stored first operand (as a number) */
  firstOperand: number | null;
  /** The formatted display string of the first operand (for expression line) */
  expressionFirst: string;
  /** The chosen operator */
  operator: Operator | null;
  /** True once the user presses an operator and starts entering the second operand */
  waitingForSecond: boolean;
  /** Tracks whether the last action was Equals (for chained operations) */
  lastActionWasEquals: boolean;
  /** Stored complete expression shown above result (e.g. "38,670÷50,000") */
  expression: string;
}

export type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'DECIMAL' }
  | { type: 'OPERATOR'; payload: Operator }
  | { type: 'EQUALS' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'BACKSPACE' }
  | { type: 'ALL_CLEAR' };
