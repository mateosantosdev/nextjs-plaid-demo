import { useState, useEffect } from "react";

export const useDebounce = (value: any, delay = 600) => {
  const [debouncedValue, setDebouncedvalue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedvalue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
