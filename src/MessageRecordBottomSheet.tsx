import { allIcons } from "water-fetch/ui/apis";
import {
  Button,
  CircleTip,
  EmptyComponent,
  IconProps,
  Line,
  Translate,
} from "water-fetch/ui/components";
import {
  closeBottomSheet,
  getTemp,
  setTemp,
  useColorMerge,
  useCopyState,
  useTemp,
  useUserFromDB,
} from "water-fetch/ui/hooks";
import { Message } from "./WindowContent";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "./server";
import { tw } from "water-fetch/ui/utils";
export interface BottomSheetRecordProps {
  icon?: IconProps["icon"];
  onClick?: Function;
  content: string;
  tool?: string | number;
}
const BottomSheetRecord = ({
  icon,
  onClick,
  content,
  tool,
}: BottomSheetRecordProps) => {
  const colorMerge = useColorMerge();
  const isLoading = useCopyState(false);
  return (
    <Button
      style={{
        ...colorMerge("gray.opacity", {
          color: "text.color",
        }),
      }}
      className="gap-3 h-[40px]"
      onClick={async () => {
        isLoading.set(true);
        try {
          let result = onClick?.();
          if (result instanceof Promise) {
            await result;
          }
        } catch {}
        isLoading.set(false);
      }}
      iconClassName={tw(isLoading.get && "animate-spin")}
      icon={isLoading.get ? allIcons.solid.faSpinner : icon}
    >
      {!isLoading.get && (
        <EmptyComponent>
          <Translate content={content} />{" "}
          {!!tool && <EmptyComponent>({tool})</EmptyComponent>}
        </EmptyComponent>
      )}
    </Button>
  );
};
export const MessageRecordBottomSheet = () => {
  const message = getTemp<Message>("bottom-sheet-message");
  const user = useUserFromDB();
  const marked = useTemp<Record<string, number>>(`marked-messages`);
  return (
    <EmptyComponent>
      <div className="flex justify-between items-center p-2">
        <h1 className="text-xl capitalize">
          <Translate content="message" />
        </h1>
        <CircleTip
          icon={allIcons.solid.faXmark}
          onClick={() => {
            closeBottomSheet();
            setTemp("bottom-sheet-type", null);
            setTemp("bottom-sheet-message", null);
          }}
        />
      </div>
      <Line />
      {message && user?.uid && (
        <div className="flex flex-col gap-1 p-2">
          {[
            {
              icon: allIcons.regular.faCopy,
              content: "copy",
              async onClick() {
                if (message?.value) {
                  await navigator.clipboard.writeText(message.value);
                }
              },
            },
            {
              icon: allIcons.solid.faHeart,
              content: "mark",
              onClick: async () => {
                const docRef = doc(
                  firestore,
                  "projects",
                  import.meta.env.VITE_PROJECT_ID,
                  "messages",
                  message.id,
                  "favs",
                  user.uid!
                );
                const info = await getDoc(docRef);
                await setDoc(docRef, {
                  value: !info.data()?.value,
                });
              },
              tool: marked.get?.[message.id],
            },
          ].map((props, index) => {
            return <BottomSheetRecord key={index} {...props} />;
          })}
        </div>
      )}
    </EmptyComponent>
  );
};
