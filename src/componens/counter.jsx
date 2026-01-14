import { useState } from "react";


function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>{count}</h2>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
            <button onClick={() => {
                if (count > 0) {
                    setCount(count - 1)
                }else{
                  setCount(0)
                }
            }}>
                Decrement
            </button>
            <button onClick={() => setCount(0)}>
                reset
            </button>
        </div>
    );
}

export default Counter;
