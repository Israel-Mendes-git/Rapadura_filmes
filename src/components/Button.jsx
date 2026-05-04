// Botão primário - Roxo (60%)
export function PrimaryButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all ${className}`}
    >
      {children}
    </button>
  );
}

// Botão secundário - Verde (40%)
export function SecondaryButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all ${className}`}
    >
      {children}
    </button>
  );
}

// Botão outline - Roxo
export function OutlineButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all ${className}`}
    >
      {children}
    </button>
  );
}