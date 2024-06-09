import { ACTIONS } from "./App"

export default function IncrementButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_INCREMENT, payload: { digit } })}
    >
      {digit}
    </button>
  )
}