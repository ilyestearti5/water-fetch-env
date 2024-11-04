import logoSrc from "./images/logo.png";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { allIcons } from "water-fetch/ui/apis";
import {
  Button,
  Card,
  CircleTip,
  DownOverlay,
  EmptyComponent,
  Line,
  RecorderFeild,
  Scroll,
  Translate,
} from "water-fetch/ui/components";
import {
  addCommand,
  back,
  commandsHooks,
  getTemp,
  next,
  setTemp,
  slotHooks,
  submit,
  useAction,
  useColorMerge,
  useCopyState,
  useTemp,
} from "water-fetch/ui/hooks";
import { tw } from "water-fetch/ui/utils";
import { firestore } from "./server";
import { MessageRecord } from "./MessageRecord";
import { BottomSheetLayout } from "water-fetch/ui/layouts";
import { MessageRecordBottomSheet } from "./MessageRecordBottomSheet";
import { SenderField } from "./SenderFeild";
export interface Message {
  id: string;
  sender?: string;
  value?: string;
  type?: "text" | "image" | "file";
  createdAt?: number;
  mediaFiles?: string[];
  loadingFiles?: number;
  repleyId?: string;
}
const scrollerViewId = "scroll-" + crypto.randomUUID();
export const WindowContent = () => {
  const colorMerge = useColorMerge();
  const messages = useCopyState<Message[]>([]);
  React.useEffect(() => {
    let createdAt = Date.now();
    let startDay = new Date(createdAt).setHours(0, 0, 0, 0);
    let endDay = new Date(createdAt).setHours(23, 59, 59, 999);
    let q = query(
      collection(
        firestore,
        "projects",
        import.meta.env.VITE_PROJECT_ID,
        "messages"
      ),
      where("createdAt", ">=", startDay),
      where("createdAt", "<=", endDay),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (users) => {
      messages.set(
        users.docs.map((user) => {
          let result: Message = { id: user.id, ...user.data() };
          return result;
        })
      );
    });
  }, []);
  const sendAudio = useTemp<string>("send-audio");
  const audioRecording = getTemp<boolean>("audio.recording");
  const bottomSheetType = getTemp<"message">("bottom-sheet-type");
  const tips = useTemp<string>("message-tip");
  useAction(
    "message-tips-next",
    () => {
      if (typeof tips.get == "string") {
        next("slot-" + tips.get);
      }
    },
    [tips.get]
  );
  useAction(
    "message-tips-back",
    () => {
      if (typeof tips.get == "string") {
        back("slot-" + tips.get);
      }
    },
    [tips.get]
  );
  useAction(
    "message-tips-submit",
    () => {
      if (typeof tips.get == "string") {
        submit("slot-" + tips.get);
      }
    },
    [tips.get]
  );
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex justify-center h-full overflow-hidden">
        <div
          className="md:w-1/2 max-md:w-full h-full overflow-hidden"
          style={{
            ...colorMerge("secondary.background"),
          }}
        >
          <Scroll id={scrollerViewId}>
            <div
              className={tw(
                "flex flex-col justify-center transform transition-[height] items-center gap-3 h-full",
                messages.get.length && "h-[200px]"
              )}
            >
              <div
                className={tw(
                  "rounded-full md:w-[150px] max-md:w-[100px] transform transition-[border-radius,width,height] md:h-[150px] max-md:h-[100px] overflow-hidden",
                  messages.get.length && "w-full h-full rounded-[0px] delay-300"
                )}
              >
                <img src={logoSrc} className="w-full h-full object-cover" />
              </div>
              {!messages.get.length && (
                <h1 className="text-2xl capitalize">
                  <Translate content="no messages sent today 📮" />
                </h1>
              )}
            </div>
            {messages.get.map((message, index) => {
              return <MessageRecord key={index} message={message} />;
            })}
            <div className="h-[200px]" />
          </Scroll>
        </div>
      </div>
      <div className="bottom-10 absolute inset-x-0 flex justify-center">
        <SenderField />
      </div>
      <DownOverlay hidden={!audioRecording}>
        <Card>
          <div className="flex justify-between items-center p-2">
            <h1 className="text-2xl capitalize">
              <Translate content="send voice" />
            </h1>
            <div>
              <CircleTip
                icon={allIcons.solid.faXmark}
                onClick={() => {
                  setTemp("audio.recording", false);
                }}
              />
            </div>
          </div>
          <Line />
          <div className="flex justify-center items-center p-2">
            <RecorderFeild id="send-audio" state={sendAudio} />
          </div>
          {sendAudio.get && (
            <EmptyComponent>
              <Line />
              <div className="p-2">
                <Button onClick={() => {}}>
                  <Translate content="send" />
                </Button>
              </div>
            </EmptyComponent>
          )}
        </Card>
      </DownOverlay>
      <BottomSheetLayout>
        {bottomSheetType == "message" && <MessageRecordBottomSheet />}
      </BottomSheetLayout>
    </div>
  );
};
