"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

interface ParameterContextType {
  parameter: string;
  setParameter: React.Dispatch<React.SetStateAction<string | null>>;
}

const ParameterContext = createContext<ParameterContextType | undefined>(undefined);

export const ParameterProvider = ({ children }: { children: ReactNode }) => {
  const [parameter, setParameter] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParameter = sessionStorage.getItem("parameter");
      if (storedParameter) {
        setParameter(storedParameter);
      }
      else{
        setParameter("image")
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (parameter)
        sessionStorage.setItem("parameter", parameter);
    }
  }, [parameter])

  if (parameter === null) {
    return null;
  }
  
  return (
    <ParameterContext.Provider value={{ parameter, setParameter }}>
      {children}
    </ParameterContext.Provider>
  );
};

export const useParameter = () => {
  const context = useContext(ParameterContext);
  if (!context) {
    throw new Error("useParameter must be used within a ParameterProvider");
  }
  return context;
}
