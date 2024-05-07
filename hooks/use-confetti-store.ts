// Importing the 'create' function from the 'zustand' library
import { create } from "zustand";

// Defining a TypeScript type 'ConfettiStore' to represent the structure of the state object
type ConfettiStore = {
  isOpen: boolean; // Indicates whether the confetti is currently open or not
  onOpen: () => void; // Function to open the confetti
  onClose: () => void; // Function to close the confetti
};

// Creating a custom hook 'useConfettiStore' using the 'create' function from Zustand
export const useConfettiStore = create<ConfettiStore>((set) => ({
  // Initializing the state object with 'isOpen' set to 'false' (confetti is initially closed)
  isOpen: false,
  // Defining the 'onOpen' function which sets 'isOpen' to 'true' (opens the confetti)
  onOpen: () => set({ isOpen: true }),
  // Defining the 'onClose' function which sets 'isOpen' to 'false' (closes the confetti)
  onClose: () => set({ isOpen: false }),
}));
