import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"
import IncrementButton from "./IncrementButton";

//We can add actions here that will be passed into the reducer
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  ADD_INCREMENT: "add-increment",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentWeight: payload.digit,
          overwrite:false,
        }
      }
      if(payload.digit === "0" && state.currentWeight === "0"){
        return state;
      }
      if(payload.digit === "." && state.currentWeight.includes(".")){
        return state;
      }
      return {
        ...state,
        currentWeight: `${state.currentWeight || ""}${payload.digit}`,
      }
    case ACTIONS.ADD_INCREMENT:
      if(state.currentWeight == null){
        return {
          // ...state,
          overwrite: false,
          convertedWeight: payload.digit,
          operation: null,
          currentWeight: payload.digit
        }
      }else if(state.currentWeight != null){
        return{
          ...state,
          overwrite: false,
          convertedWeight: evaluateIncrement(state.currentWeight, payload),
          operation: null,
          currentWeight: evaluateIncrement(state.currentWeight, payload)
        }
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentWeight == null && state.convertedWeight == null){
        return state;
      }
      
      if(state.currentWeight == null){
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if(state.convertedWeight == null){
        return{
          ...state,
          operation: payload.operation,
          convertedWeight: state.currentWeight,
          currentWeight: null,
        }
      }

      return{
        ...state,
        convertedWeight: evaluate(state),
        operation:payload.operation,
        currentWeight:null
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return{
          ...state,
          overwrite:false,
          currentWeight: null
        }
      }
      if(state.currentWeight == null){
        return state
      }
      if(state.currentWeight.className === 1){
        return {
          ...state,
          currentWeight: null
        }
      }

      return {
        ...state,
        currentWeight: state.currentWeight.slice(0, -1)
      }
    case ACTIONS.CLEAR:
      return {};//Returns to empty state
    case ACTIONS.EVALUATE:
      if(state.operation == null || 
         state.currentWeight == null || 
         state.convertedWeight == null)
        {
          return state
        }
      return{
        ...state,
        overwrite: true,
        convertedWeight: null,
        operation: null,
        currentWeight: evaluate(state)
      }
  }
}

function evaluate({currentWeight, convertedWeight, operation} ){
  const prev = parseFloat(convertedWeight)
  const current = parseFloat(currentWeight)
  if(isNaN(prev) || isNaN(current)){
    return ""
  }
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current 
      break
    case "-":
      computation = prev - current 
      break
    case "/":
      computation = prev / current 
      break
    case "*":
      computation = prev * current 
      break
  }

  return computation.toString()
}

function evaluateIncrement(weight, payload){
  const weightInt = parseFloat(weight)
  const digitInt = parseFloat(payload.digit)

  
  return (weightInt + digitInt).toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
  }

function App() {
  //current/prev/oper will be our lbs and kgs and oper
  const [{ currentWeight, convertedWeight, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  return(
    <div className="calculator-grid">
      {/* we will have two output in the future. One for KG and one for LBS */}
      <div className="output">
        {/* We could have it inline so it shows both. */}
        <div className="previous-operand">{formatOperand(convertedWeight)}{operation}</div>
        <div className="current-operand">{formatOperand(currentWeight)}</div>
      </div>
      {/* span-two means spans two collumns. IMPORTANT */}
      <button onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})} >DEL</button>
      <OperationButton operation="ph" dispatch={dispatch}/>
      <IncrementButton digit="+55" dispatch={dispatch}/>
      <IncrementButton digit="+45" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <IncrementButton digit="+35" dispatch={dispatch}/>
      <IncrementButton digit="+25" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <IncrementButton digit="+15" dispatch={dispatch}/>
      <IncrementButton digit="+10" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <IncrementButton digit="+5" dispatch={dispatch}/>
      <IncrementButton digit="+2.5" dispatch={dispatch}/>
      <button onClick={() => dispatch({type: ACTIONS.EVALUATE})}>KG</button>
      <DigitButton digit="0" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <button>ph</button>
      <button>ph</button>
      </div>
  )
}

export default App;
