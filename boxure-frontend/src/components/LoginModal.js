import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

export const LoginModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleClose = () => onClose();

  return (
    <div className="bg-linear-to-r from-sky-400 to-indigo-500 p-12 rounded-lg flex items-center justify-center">
      <ModalOverlay
        className={({ isEntering, isExiting }) => `
          fixed inset-0 top-0 left-0 w-full h-(--page-height) z-10 bg-black/25 backdrop-blur isolate
          ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
          ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
        `}
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
            w-full h-full flex items-center justify-center p-4 box-border text-center
            ${isEntering ? "animate-in zoom-in-95 ease-out duration-300" : ""}
            ${isExiting ? "animate-out zoom-out-95 ease-in duration-200" : ""}
          `}
        >
          <Dialog
            role="alertdialog"
            className="max-w-md max-h-full overflow-hidden rounded-2xl bg-white p-6 box-border text-left align-middle shadow-xl outline-hidden relative"
          >
            <Heading slot="title" className="text-xxl font-semibold leading-6 my-0 text-slate-700">
              You must be logged in to add Item to your cart
            </Heading>
            <div className="w-6 h-6 text-red-500 absolute right-6 top-6 stroke-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="mt-3 text-slate-500">
              Please login below or close the modal to continue browsing the marketplace
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <DialogButton
                className="bg-slate-200 text-slate-800 hover:border-slate-300 pressed:bg-slate-300"
                onPress={handleClose}
              >
                Close
              </DialogButton>
              <DialogButton
                className="bg-red-500 text-white hover:border-red-600 pressed:bg-red-600"
                onPress={handleLogin}
              >
                Login
              </DialogButton>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
};

function DialogButton({ className, ...props }) {
  return (
    <Button
      {...props}
      className={`inline-flex justify-center rounded-md border border-solid border-transparent px-5 py-2 font-semibold font-[inherit] text-base transition-colors cursor-default outline-hidden focus-visible:ring-2 ring-blue-500 ring-offset-2 ${className}`}
    />
  );
}

export default LoginModal;
