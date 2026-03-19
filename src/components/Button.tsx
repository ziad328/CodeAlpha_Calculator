import type { ButtonVariant } from '../types/calculator';

interface ButtonProps {
  label: string;
  variant: ButtonVariant;
  isActive?: boolean;
  wide?: boolean;
  /** Render the label as an SVG backspace icon */
  isBackspace?: boolean;
  onClick: () => void;
}

export function Button({
  label,
  variant,
  isActive = false,
  wide = false,
  isBackspace = false,
  onClick,
}: ButtonProps) {
  // Exact colour values from the user
  let colourClass: string;
  if (variant === 'orange') {
    colourClass = isActive
      ? 'bg-[#c1c1c0] text-[#f88d06]'
      : 'bg-[#f88d06] text-[#c1c1c0] active:bg-[#d97c06]';
  } else if (variant === 'lightGray') {
    // Top utility buttons
    colourClass = 'bg-[#717274] text-[#c1c1c0] active:bg-[#606163]';
  } else {
    // Number buttons
    colourClass = 'bg-[#878c8c] text-[#c1c1c0] active:bg-[#727777]';
  }

  // Use the new Datatype font (it will fall back gracefully, but usually it needs tracking normal)
  const sharedBase =
    'select-none cursor-pointer text-xl sm:text-2xl font-normal leading-none transition-all duration-75 outline-none active:brightness-125';

  const content = isBackspace ? (
    // Inline backspace SVG icon
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 sm:w-7 sm:h-7"
      aria-hidden="true"
    >
      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.29 13.29a1 1 0 0 1-1.42 0L15 14l-2.29 2.29a1 1 0 0 1-1.42-1.42L13.59 13l-2.3-2.29a1 1 0 0 1 1.42-1.42L15 11.59l2.29-2.3a1 1 0 0 1 1.42 1.42L16.41 13l2.3 2.29a1 1 0 0 1-.01 1.42-.01 0 0 1 0 0z" />
    </svg>
  ) : (
    label
  );

  if (wide) {
    return (
      <button
        className={`col-span-2 self-stretch flex items-center justify-start rounded-full px-8 sm:px-10 ${sharedBase} ${colourClass}`}
        onClick={onClick}
        aria-label={label}
      >
        {content}
      </button>
    );
  }

  return (
    <button
      className={`aspect-square flex items-center justify-center rounded-full ${sharedBase} ${colourClass}`}
      onClick={onClick}
      aria-label={label}
    >
      {content}
    </button>
  );
}
