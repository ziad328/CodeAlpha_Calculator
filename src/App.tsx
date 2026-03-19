import { Calculator } from './components/Calculator';

function App() {
  return (
    /*
     * Black page background.
     * On screens it's centred as a compact card (max-w-[380px] limits the width).
     * On mobile, the wrapper constraint ensures it keeps an iPhone-like ratio without breaking aspect-square.
     */
    <div className="min-h-dvh w-full bg-[#303737] flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-xs">
        <Calculator />
      </div>
    </div>
  );
}

export default App;
