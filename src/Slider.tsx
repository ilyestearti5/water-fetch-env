import React from "react";
import { ReactElement } from "water-fetch/ui/app";
import {
  ChangableComponent,
  EmptyComponent,
  Line,
} from "water-fetch/ui/components";
import { useColorMerge, useCopyState } from "water-fetch/ui/hooks";
import { tw } from "water-fetch/ui/utils";
export interface SliderProps extends ReactElement {
  onOpen?: () => void;
  onClose?: () => void;
}
export const Slider = ({
  onClose,
  onOpen,
  onMouseDown,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  ...props
}: SliderProps) => {
  const isOpen = useCopyState<boolean>(false);
  const colorMerge = useColorMerge();
  const transformState = useCopyState<null | number>(null);
  React.useEffect(() => {
    if (isOpen.get) {
      transformState.set(0);
    }
  }, [isOpen.get]);
  const height = useCopyState<null | number>(null);
  const start = useCopyState(false);
  const isMove = useCopyState(false);
  const touchMove = useCopyState(false);
  React.useEffect(() => {
    if (!start.get) {
      return;
    }
    const move = (e: MouseEvent) => {
      e.preventDefault();
      const { clientY } = e;
      const h = innerHeight - (height.get ?? 0);
      const value = -h + clientY - 28 / 2;
      transformState.set(value);
      isMove.set(true);
    };
    const up = (e: MouseEvent) => {
      start.set(false);
      if (e.clientY) {
        if (e.clientY >= (height.get ?? 0) / 3) {
          isOpen.set(false);
          transformState.set(10000);
          isMove.set(false);
        } else {
          transformState.set(0);
        }
      }
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      isMove.set(false);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [start.get]);
  return (
    <div
      onTouchStart={(e) => {
        onTouchStart?.(e);
        isMove.set(true);
      }}
      // for mobile
      onTouchMove={(e) => {
        onTouchMove?.(e);
        e.preventDefault();
        touchMove.set(true);
        const { clientY } = e.touches[0];
        const h = innerHeight - (height.get ?? 0);
        const value = -h + clientY - 28 / 2;
        transformState.set(value);
      }}
      onTouchEnd={(e) => {
        onTouchEnd?.(e);
        touchMove.set(false);
        isMove.set(false);
        const value = transformState.get;
        if (value) {
          if (value >= (height.get ?? 0) / 3) {
            transformState.set(10000);
            isOpen.set(false);
          } else {
            transformState.set(0);
          }
        }
      }}
      // for desktop & start state
      onMouseDown={(e) => {
        onMouseDown?.(e);
        start.set(true);
        e.preventDefault();
      }}
      {...props}
    >
      <ChangableComponent
        onContentChange={(props) => {
          height.set(props.height);
        }}
        style={{
          ...colorMerge("secondary.background", {
            borderColor: "borders",
          }),
        }}
        className={tw(
          `fixed overflow-hidden z-[1000] flex-none min-h-[100px] flex flex-col max-h-[60vh] inset-x-0 bottom-0 border-x border-t border-solid border-transparent shadow-lg transform translate-y-full rounded-ss-3xl rounded-se-3xl`,
          isOpen.get && "translate-y-0",
          !isMove.get && "transition-transform duration-300"
        )}
      />
    </div>
  );
};
