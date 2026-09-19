import ToastContainer, { useToastManager } from "@/components/base/Toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toasts, removeToast } = useToastManager();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default ToastProvider;