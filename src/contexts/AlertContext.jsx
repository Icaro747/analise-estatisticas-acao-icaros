/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { createContext, useRef } from "react";

export const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const msgs = useRef(null);

  const NotificationMessage = (Type, message, time = 3000) => {
    switch (Type) {
      case "info":
        msgs.current.show([
          {
            severity: "info",
            summary: "Informado",
            detail: message,
            life: time
          }
        ]);
        break;
      case "success":
        msgs.current.show([
          {
            severity: "success",
            summary: "Sucesso",
            detail: message,
            life: time
          }
        ]);
        break;
      case "warn":
        msgs.current.show([
          {
            severity: "warn",
            summary: "Aviso",
            detail: message,
            life: time
          }
        ]);
        break;
      case "error":
        msgs.current.show([
          {
            severity: "error",
            summary: "Erro",
            detail: message,
            life: time
          }
        ]);
        break;
      default:
        break;
    }
  };

  return (
    <AlertContext.Provider value={{ msgs, NotificationMessage }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
