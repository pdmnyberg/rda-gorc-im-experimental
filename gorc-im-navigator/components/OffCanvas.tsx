import { PropsWithChildren, useEffect, useEffectEvent, useId, useRef, useState } from "react";

type OffCanvasProps = {
  position: "start" | "end" | "top" | "bottom";
  isOpen: boolean;
  title: string;
  onClose?: () => void;
}

export function OffCanvas({position, isOpen, onClose, title, children}: PropsWithChildren<OffCanvasProps>) {
  const [deferredIsOpen, setDeferredIsOpen] = useState<boolean>(isOpen);
  const labelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const stateClass = deferredIsOpen ? (
    isOpen ? "show" : "show hiding"
  ) : (
    isOpen ? "showing" : "hide"
  )
  const finalizeState = useEffectEvent((nextIsOpen: boolean) => {
    setDeferredIsOpen(nextIsOpen)
  })
  useEffect(() => {
    const current = ref.current;
    if (current) {
      const listener = () => finalizeState(isOpen);
      current.addEventListener("transitionend", listener);
      return () => {
        current.removeEventListener("transitionend", listener);
      }
    }
  }, [isOpen, ref])
  return (
    <div ref={ref} className={`offcanvas offcanvas-${position} ${stateClass}`} data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} aria-labelledby={labelId}>
      <div className="offcanvas-header align-items-start">
        <h5 className="offcanvas-title" id={labelId}>{title}</h5>
        <button type="button" className="btn-close flex-shrink-0" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {children}
      </div>
    </div>
  )
}