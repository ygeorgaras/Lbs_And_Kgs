import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"
import IncrementButton from "./IncrementButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  ADD_INCREMENT: "add-increment",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  SWITCH_UNIT: "switch-unit"
}

const lbsValues = [55, 45, 35, 25, 10, 5, 2.5]
const kgsValues = [25, 20, 15, 10, 5, 2, 1]

const initialState = {
  currentWeight: null,
  convertedWeight: null,
  operation: null,
  unit: "lbs",
  incrementValues: lbsValues
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
          ...state,
          overwrite: false,
          convertedWeight: payload.digit,
          operation: null,
          currentWeight: payload.digit
        }
      }else if(state.currentWeight != null){
        return{
          ...state,
          overwrite: false,
          convertedWeight: evaluateIncrement(state.currentWeight, payload, state.unit === "lbs" ? "kg" : "lbs"),
          operation: null,
          currentWeight: evaluateIncrement(state.currentWeight, payload, null)
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
      return {
        ...state,
        currentWeight: null,
        convertedWeight: null,
        operation: null
      };//Returns to empty state
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
    case ACTIONS.SWITCH_UNIT:
      let tempConverted = state.convertedWeight
      return {
        ...state,
        overwrite: false,
        convertedWeight: state.currentWeight,
        currentWeight: state.convertedWeight,
        unit: state.unit === "lbs" ? "kg" : "lbs",
        incrementValues: state.unit === "lbs" ? kgsValues : lbsValues
      }
    default:
      return state;
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

function evaluateIncrement(weight, payload, unit){
  const weightInt = parseFloat(weight)
  const digitInt = parseFloat(payload.digit)

  if(unit != null){
    let result;
    if (unit === "kg") {
      // Convert digit to kgs if needed and then add
      const digitInKgs = digitInt ;
      result = parseFloat((weightInt + digitInKgs) * 0.453592).toFixed(1);
    } else {
      // Convert digit to lbs if needed and then add
      const digitInLbs = digitInt ;
      result = (weightInt + digitInLbs) * 2.20462;
    }
    return formatWeight(result);
  }


  return formatWeight(weightInt + digitInt);
}


function formatWeight(newWeight) {
  // Round to the nearest 0.5
  const roundedWeight = Math.round(newWeight * 2) / 2;

  // Return as string
  return roundedWeight.toString();
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
  const [{ currentWeight, convertedWeight, operation, unit = "lbs", incrementValues = lbsValues}, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(convertedWeight)}{operation}{unit === "lbs" ? "kg" : "lbs"}</div>
        <div className="current-operand">{formatOperand(currentWeight)}{unit}</div>
      </div>
      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })} >DEL</button>
      <OperationButton operation="+" dispatch={dispatch} />
      <button>barb</button>
      <button onClick={() => dispatch({ type: ACTIONS.SWITCH_UNIT })}>KG</button>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <IncrementButton digit={incrementValues[0].toString()} dispatch={dispatch} />
      <IncrementButton digit={incrementValues[1].toString()} dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <IncrementButton digit={incrementValues[2].toString()} dispatch={dispatch} />
      <IncrementButton digit={incrementValues[3].toString()} dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <IncrementButton digit={incrementValues[4].toString()} dispatch={dispatch} />
      <IncrementButton digit={incrementValues[5].toString()} dispatch={dispatch} />
      <IncrementButton digit={incrementValues[6].toString()} dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <IncrementButton digit={incrementValues[6].toString()} dispatch={dispatch} />


    </div>
  )
}

export default App;
