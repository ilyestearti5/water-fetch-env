import React from "react";
import { firestore, storage } from "./server";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Message } from "postcss";
import { allIcons } from "water-fetch/ui/apis";
import "./message.css";
import {
  EmptyComponent,
  Icon,
  Line,
  CircleTip,
  Feild,
  Tip,
  ImageFeild,
} from "water-fetch/ui/components";
import {
  fieldHooks,
  getTemp,
  UserDB,
  useUserFromDB,
  useCopyState,
  useAction,
  setTemp,
  execAction,
  openPath,
  useTemp,
  useColorMerge,
  openCamera,
} from "water-fetch/ui/hooks";
import { mapAsync, mergeArray, Shortcut, tw } from "water-fetch/ui/utils";
export const SenderField = () => {
  let message = fieldHooks.getOneFeild("message", "value");
  const repley = getTemp<Message & { senderUser?: UserDB }>("repley");
  const user = useUserFromDB();
  const filesBase64 = useCopyState<string[]>([]);
  const rows = React.useMemo(() => {
    return message?.split("\n").length || 1;
  }, [message]);
  const sendAudio = useTemp<string>("send-audio");
  const sendMessageAction = useAction(
    "send-message",
    async () => {
      if (!message) {
        return;
      }
      // reset
      setTemp("repley", null);
      fieldHooks.setOneFeild("message", "value", "");
      sendAudio.set(null);
      const id = crypto.randomUUID();
      execAction("update-message-files", id);
      // upload files
      await setDoc(
        doc(
          firestore,
          "projects",
          import.meta.env.VITE_PROJECT_ID,
          "messages",
          id
        ),
        {
          sender: user?.uid,
          value: message,
          type: "text",
          createdAt: Date.now(),
          loadingFiles: filesBase64.get.length,
          repleyId: repley?.id || null,
        }
      );
      document.getElementById(`msg-${id}`)?.click();
    },
    [sendAudio.get, filesBase64.get, repley]
  );
  const colorMerge = useColorMerge();
  const updateMessageFilesAction = useAction(
    "update-message-files",
    async (id: string) => {
      filesBase64.set([]);
      const mediaFiles = await mapAsync(filesBase64.get, async (fileBase64) => {
        const messagesRef = ref(
          storage,
          `projects/${
            import.meta.env.VITE_PROJECT_ID
          }/messages/${crypto.randomUUID()}`
        );
        const blob = await fetch(fileBase64).then((res) => res.blob());
        await uploadBytes(messagesRef, blob);
        return getDownloadURL(messagesRef);
      });
      await setDoc(
        doc(
          firestore,
          "projects",
          import.meta.env.VITE_PROJECT_ID,
          "messages",
          id
        ),
        {
          mediaFiles,
          loadingFiles: null,
        },
        {
          merge: true,
        }
      );
    },
    [filesBase64.get]
  );
  return (
    <div
      style={{
        ...colorMerge({
          borderColor: "borders",
        }),
      }}
      className="flex flex-col gap-y-1 backdrop-blur-lg border border-transparent border-solid rounded-xl w-3/4"
    >
      {!!filesBase64.get.length && (
        <EmptyComponent>
          <div className="flex gap-1 p-2">
            {filesBase64.get.map((fileBase64, index) => {
              const isImage = fileBase64.startsWith("data:image");
              const isVideo = fileBase64.startsWith("data:video");
              const isAudio = fileBase64.startsWith("data:audio");
              const isPdf = fileBase64.startsWith("data:application/pdf");
              return (
                <div
                  onClick={() => {
                    // delete
                    filesBase64.set(
                      filesBase64.get.filter((_, i) => i !== index)
                    );
                  }}
                  key={index}
                  className="rounded-xl md:w-[100px] max-md:w-[70px] md:h-[100px] max-md:h-[70px] cursor-pointer overflow-hidden"
                >
                  {isImage && (
                    <img
                      src={fileBase64}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isVideo && (
                    <video
                      src={fileBase64}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isPdf && (
                    <div
                      style={{
                        ...colorMerge("gray.opacity", {
                          outlineColor: "borders",
                        }),
                      }}
                      className="flex justify-center p-1 w-full h-full -outline-offset-1 outline-solid outline-transparent"
                    >
                      <div className="inline-flex justify-center items-center p-2 text-4xl">
                        <Icon icon={allIcons.solid.faFilePdf} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Line />
        </EmptyComponent>
      )}
      {repley && (
        <EmptyComponent>
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center gap-2">
              <div className="flex justify-center items-center rounded-full w-[40px] h-[40px] overflow-hidden">
                {repley.senderUser?.photo && (
                  <img
                    className="w-full h-full object-cover"
                    src={repley.senderUser?.photo}
                  />
                )}
                {!repley.senderUser?.photo && (
                  <Icon iconClassName="w-1/3 h-1/3" />
                )}
              </div>
              <span
                style={{
                  ...colorMerge({
                    color: "gray.opacity.2",
                  }),
                }}
              >
                {repley.value}
              </span>
            </div>
            <CircleTip
              onClick={() => {
                setTemp("repley", null);
              }}
              icon={allIcons.solid.faXmark}
            />
          </div>
          <Line />
        </EmptyComponent>
      )}
      <div className="flex items-center gap-2 p-2 border border-transparent border-solid rounded-xl">
        <div className="relative w-full">
          <Feild
            onPaste={(e) => {
              const items = e.clipboardData.items;
              for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                  const file = items[i].getAsFile();
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const dataUri = e.target?.result?.toString();
                      if (dataUri && !filesBase64.get.includes(dataUri)) {
                        filesBase64.set([...filesBase64.get, dataUri]);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }
            }}
            onKeyDown={(e) => {
              const shortcut = new Shortcut("enter");
              if (!shortcut.test(e)) {
                return;
              }
              e.preventDefault();
              execAction("send-message");
            }}
            multiLines
            placeholder="Enter Your Message"
            rows={rows > 5 ? 5 : rows}
            className="rounded-xl md:text-lg"
            inputName="message"
          />
          <div className="top-1/2 right-2 absolute flex gap-1 h-2/3 transform -translate-y-1/2">
            <Tip
              className="w-full h-full"
              icon={allIcons.solid.faUpload}
              onClick={async () => {
                const paths = await openPath({
                  title: "Select File",
                  properties: ["multiSelections"],
                });
                filesBase64.set((prev) => {
                  return [...prev, ...paths];
                });
              }}
            />
            <Tip
              className="w-full h-full"
              icon={allIcons.solid.faCamera}
              onClick={async () => {
                const photo = await openCamera("take");
                filesBase64.set((prev) => {
                  return [...prev, ...photo];
                });
              }}
            />
            {/* <Tip
          icon={allIcons.solid.faVoicemail}
          onClick={async () => {
            setTemp("audio.recording", true);
          }}
        /> */}
          </div>
        </div>
        <CircleTip
          onClick={() => {
            execAction("send-message");
          }}
          icon={
            sendMessageAction?.status == "loading"
              ? allIcons.solid.faSpinner
              : allIcons.solid.faPaperPlane
          }
          className={tw(
            "transition-[width,height,transform] w-[35px] h-[35px] scale-100",
            sendMessageAction?.status != "loading" &&
              !message &&
              "scale-0 w-[0px] h-[0px]"
          )}
          iconClassName={tw(
            sendMessageAction?.status === "loading" && "animate-spin"
          )}
        />
      </div>
    </div>
  );
};
