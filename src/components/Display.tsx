import { formatDisplayValue } from '../hooks/useCalculator';

interface DisplayProps {
  expressionLine: string;
  value: string;
}

export function Display({ expressionLine, value }: DisplayProps) {
  const formatted = formatDisplayValue(value);
  const len = formatted.length;
  let sizeClass: string;

  if (len <= 6) {
    sizeClass = 'text-6xl sm:text-7xl';
  } else if (len <= 9) {
    sizeClass = 'text-5xl sm:text-6xl';
  } else {
    sizeClass = 'text-4xl sm:text-5xl';
  }

  return (
    <div className="flex flex-col items-end justify-end w-full px-3 sm:px-4 pb-2 gap-0 min-h-36">
      <span
        className="text-2xl sm:text-3xl font-normal text-[#c1c1c0] opacity-70 tracking-widest select-none min-h-8 transition-all duration-200 block mb-1"
        aria-label={expressionLine ? `Expression: ${expressionLine}` : undefined}
      >
        {expressionLine}
      </span>
      <span
        className={`${sizeClass} font-light text-[#c1c1c0] tracking-tight leading-none transition-all duration-150 select-none block mt-1`}
        aria-live="polite"
        aria-label={`Display: ${formatted}`}
      >
        {formatted}
      </span>
    </div>
  );
}
