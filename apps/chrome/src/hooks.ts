import type { AppDispatch, AppState } from "~store";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;

// RootState is null because of poor code by the redux-persist-webextension-storage package
// I need to create my own TypedUseSelectorHook that pushes through AppState
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
