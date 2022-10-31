import { useCallback } from "react";
import { useBlocker } from "./useBlocker";

export default function usePrompt(message, when = true) {
    const blocker = useCallback(
      (tx) => {
        if (window.confirm(message)) tx.retry();
      },
      [message]
    );
  
    useBlocker(blocker, when);
  }