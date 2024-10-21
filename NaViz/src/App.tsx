import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-lg text-center font-bold">Hello world!</h1>
      <div className="text-center">
        <button
          className="bg-slate-600 rounded-md text-white p-2 active:bg-slate-400"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
