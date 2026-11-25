import { useState, useEffect } from "react";
import { read, write } from "../services/storage";

export function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      write(key, value);
      setError(false);
    } catch {
      setError(true);
    }
  }, [key, value]);
  return [value, setValue, error];
}
