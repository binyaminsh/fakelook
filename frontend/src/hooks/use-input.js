import { useReducer } from "react";

const initialInputState = {
  value: "",
  isTouched: false,
};

const inputStateReducer = (state, action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "BLUR") {
    if (state.value.trim() === "") {
      return { value: state.value, isTouched: false };
    }
    return { value: state.value, isTouched: true };
  }
  if (action.type === "RESET") {
    return { value: "", isTouched: false };
  }

  return initialInputState;
};

const useInput = (validateValue) => {
  const [inputState, dispatchInputAction] = useReducer(
    inputStateReducer,
    initialInputState
  );

  let valueIsValid;
  let hasError;
  if (validateValue) {
    valueIsValid = validateValue(inputState.value);
    hasError = !valueIsValid && inputState.isTouched;
  }

  const valueChangeHandler = (e) => {
    dispatchInputAction({ type: "INPUT", value: e.target.value });
  };

  const inputBlurHandler = (e) => {
    dispatchInputAction({ type: "BLUR" });
  };

  const reset = () => {
    dispatchInputAction({ type: "RESET" });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
