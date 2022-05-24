import React, { useCallback, useReducer } from 'react';

const enum formReducerTypes {
  CHANGE_VALUE = '@FORMREDUCER/CHANGE_VALUE',
  SET_FORM = '@FORMREDUCER/SET_FORM',
  CLEAR_FORM = '@FORMREDUCER/CLEAR_FORM'
}

type action =
  | { type: formReducerTypes.CHANGE_VALUE; payload: { name: string; value: string } }
  | { type: formReducerTypes.SET_FORM; payload: any }
  | { type: formReducerTypes.CLEAR_FORM; payload: any };

const formReducer = (state: any, action: action) => {
  switch (action.type) {
    case formReducerTypes.CHANGE_VALUE: {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value
      };
    }

    case formReducerTypes.SET_FORM:
      return action.payload;

    case formReducerTypes.CLEAR_FORM:
      return action.payload;

    default:
      return state;
  }
};

export const useFormReducer = <Type extends Object>(initialState: Type) => {
  const [form, dispatch] = useReducer(formReducer, initialState);
  const setForm = useCallback((a: any) => dispatch({ type: formReducerTypes.SET_FORM, payload: a }), []);
  const clearForm = useCallback(() => dispatch({ type: formReducerTypes.CLEAR_FORM, payload: initialState }), []);
  const changeForm = useCallback(
    (name: string, value: string) => dispatch({ type: formReducerTypes.CHANGE_VALUE, payload: { name, value } }),
    []
  );
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    changeForm(name, value);
  };

  return {
    form,
    setForm,
    clearForm,
    handleChange
  };
};
