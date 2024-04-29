import { RxExclamationTriangle } from "react-icons/rx";

export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center p-3 text-sm rounded-md bg-destructive/15 gap-x-2 text-destructive">
      <RxExclamationTriangle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
