import {
  getSlotData,
  openDialog,
  setTemp,
  showBottomSheet,
  showToast,
  slotHooks,
  useAsyncEffect,
  useColorMerge,
  useCopyState,
  useEffectDelay,
  UserDB,
  useTemp,
  useUserFromDB,
} from "water-fetch/ui/hooks";
import { Message } from "./WindowContent";
import {
  AsyncComponent,
  Card,
  CardWait,
  CircleLoading,
  CircleTip,
  ClickedView,
  EmptyComponent,
  Icon,
  Line,
  List,
  MarkDown,
  TitleView,
  Translate,
} from "water-fetch/ui/components";
import { mergeArray, range, setFocused, tw } from "water-fetch/ui/utils";
import {
  collection,
  count,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./server";
import { allIcons } from "water-fetch/ui/apis";
import React from "react";
export interface MessageRecord {
  message: Message;
}
export const MessageRecord = ({ message }: MessageRecord) => {
  let user = useUserFromDB();
  const isMe = React.useMemo(
    () => message.sender == user?.uid,
    [user, message]
  );
  const colorMerge = useColorMerge();
  let cashedUser = useTemp<Record<string, UserDB>>("cashedUser");
  const senderUser = React.useMemo(() => {
    if (isMe) {
      return user;
    }
    if (message.sender) {
      return cashedUser.get?.[message.sender] || null;
    }
    return null;
  }, [isMe, user, cashedUser.get, message.sender]);
  useEffectDelay(
    async () => {
      if (senderUser) {
        return;
      }
      if (!message.sender) {
        return;
      }
      const userinfo = await getDoc(doc(firestore, "users", message.sender));
      let userData: UserDB | undefined = userinfo.data();
      if (!userData) {
        return;
      }
      cashedUser.set((prev) => {
        return {
          ...prev,
          [userinfo.id]: {
            uid: userinfo.id,
            ...userData,
          },
        };
      });
    },
    [senderUser, message.sender],
    500
  );
  const senderUserFocused = useCopyState(false);
  const userInfoElementRef = React.createRef<HTMLDivElement>();
  const marked = useTemp<null | number>(`marked-messages.${message.id}`);
  React.useEffect(() => {
    return onSnapshot(
      query(
        collection(
          firestore,
          "projects",
          import.meta.env.VITE_PROJECT_ID,
          "messages",
          message.id,
          "favs"
        ),
        where("value", "==", true)
      ),
      (record) => {
        marked.set(record.size);
      }
    );
  }, [message]);
  const heighlight = useTemp<boolean>(`messages-heighlight.${message.id}`);
  React.useEffect(() => {
    if (heighlight.get) {
      const timer = setTimeout(() => {
        heighlight.set(false);
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [heighlight.get]);

  const tipsData = React.useMemo(() => {
    return mergeArray(
      user?.uid != message.sender && {
        icon: allIcons.solid.faShare,
        content: "repley",
        onClick() {
          setTemp("repley", {
            ...message,
            senderUser,
          });
          setFocused("message");
        },
      },
      user?.uid == message.sender && {
        icon: allIcons.solid.faTrash,
        content: "remove",
        async onClick() {
          const { response } = await openDialog({
            title: "Delete Message",
            message: "Are You Sure About Delete This Message!",
            buttons: ["Yes", "No"],
            defaultId: 0,
            checkboxLabel: "Direct",
          });
          if (response) {
            return;
          }
          await deleteDoc(
            doc(
              firestore,
              "projects",
              import.meta.env.VITE_PROJECT_ID,
              "messages",
              message.id
            )
          );
        },
      },
      {
        icon: allIcons.solid.faInfo,
        onClick() {
          const date = message.createdAt;
          if (date) {
            showToast(
              "Sent At : " + new Date(date).toLocaleString(),
              "info",
              `info-${message.id}`
            );
          }
        },
        content: "more info",
      },
      {
        icon: allIcons.regular.faCopy,
        async onClick() {
          await navigator.clipboard.writeText(message.value!);
          showToast("Text Copyed", "info", "text.copyed");
        },
        content: "Copy",
      }
    );
  }, [message]);

  const slotId = React.useMemo(() => {
    return `slot-${message.id}`;
  }, [message.id]);

  const submited = getSlotData(tipsData, slotId, "submited");
  React.useEffect(() => {
    if (submited) {
      slotHooks.setOneFeild(slotId, "submited", null);
      slotHooks.setOneFeild(slotId, "focused", null);
      submited.onClick();
    }
  }, [submited, slotId]);
  const tips = useTemp<string>("message-tip");
  return (
    <div
      className={tw(
        "flex cursor-pointer gap-2 items-center transition-[background] px-2 py-[2px]",
        isMe && "flex-row-reverse rounded-ss-full rounded-es-full",
        !isMe && "rounded-se-full rounded-ee-full"
      )}
      style={{
        ...colorMerge(
          heighlight.get && "gray.opacity",
          tips.get == message.id && "gray.opacity.2"
        ),
      }}
      onClick={() => {
        tips.set((s) => {
          if (s != message.id) {
            return message.id;
          }
          return s ? null : message.id;
        });
      }}
    >
      {!isMe && (
        <div className="relative w-fit h-fit">
          <div
            onClick={() => {
              senderUserFocused.set((s) => !s);
            }}
            className="rounded-full w-[20px] h-[20px] cursor-pointer overflow-hidden"
          >
            <img
              draggable
              src={senderUser?.photo ?? undefined}
              className="w-full h-full object-cover"
            />
          </div>
          {senderUserFocused.get && (
            <div
              ref={userInfoElementRef}
              className="top-full left-full z-[1000] absolute"
            >
              <Card className="w-[200px]">
                <div className="flex items-center gap-2 p-1">
                  <div className="rounded-full w-[40px] h-[40px] cursor-pointer overflow-hidden">
                    <img
                      draggable
                      src={senderUser?.photo ?? undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1>
                    {senderUser?.firstname} {senderUser?.lastname}{" "}
                    {senderUser?.nickname && <sub>{senderUser.nickname}</sub>}
                  </h1>
                </div>
                <Line />
                <div className="flex justify-center items-center p-1">
                  <AsyncComponent
                    render={async () => {
                      const q = query(
                        collection(
                          firestore,
                          "projects",
                          import.meta.env.VITE_PROJECT_ID,
                          "messages"
                        ),
                        where("sender", "==", message.sender)
                      );
                      const result = await getCountFromServer(q);
                      return (
                        <EmptyComponent>
                          <span
                            className="inline-flex items-center gap-1 px-2 rounded-full font-bold"
                            style={{
                              ...colorMerge("secondary", {
                                color: "secondary.content",
                              }),
                            }}
                          >
                            {result.data().count}
                            <Icon icon={allIcons.solid.faArrowRightArrowLeft} />
                          </span>
                        </EmptyComponent>
                      );
                    }}
                    loading={<CircleLoading />}
                    error={
                      <EmptyComponent>
                        <Translate content="problem found!" />
                      </EmptyComponent>
                    }
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
      <div
        className={tw(
          "inline-flex gap-1 transform transition-[transform,width] w-[0px] scale-0",
          tips.get == message.id && "scale-100 w-[80px]"
        )}
      >
        {tips.get == message.id && (
          <List
            slotId={slotId}
            data={tipsData}
            component={({ item, status }) => {
              const { icon, content, onClick } = item;
              const colorMerge = useColorMerge();
              return (
                <TitleView
                  title={content}
                  onClick={() => {
                    onClick?.();
                  }}
                >
                  <CircleTip
                    tabIndex={0}
                    className={tw(
                      "w-[20px] outline outline-0 outline-transparent h-[20px] transition-[width,height]",
                      status.isFocused && "outline-2"
                    )}
                    style={{
                      ...colorMerge(
                        status.isFocused && {
                          outlineColor: "primary",
                        }
                      ),
                    }}
                    iconClassName="text-xs"
                    icon={icon}
                  />
                </TitleView>
              );
            }}
          />
        )}
      </div>
      <div className={tw("inline-flex flex-col gap-1", isMe && "items-end")}>
        {!!message.mediaFiles?.length && (
          <div
            onClick={async () => {
              setTemp("show-images", message.mediaFiles);
            }}
            className="relative w-[80px] h-[120px] cursor-pointer"
          >
            {message.mediaFiles?.map((file, index) => {
              return (
                <div
                  key={index}
                  className="top-1/2 left-1/2 absolute rounded-2xl w-[80px] h-[80px] transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                  style={{
                    rotate: `${
                      ((index * 20) / (message.mediaFiles?.length || 1)) *
                      (isMe ? -1 : 1)
                    }deg`,
                  }}
                >
                  <img
                    draggable
                    loading="lazy"
                    src={file}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
        {!!message.loadingFiles && (
          <div className="relative w-[80px] h-[120px] cursor-pointer">
            {range(0, message.loadingFiles ? message.loadingFiles - 1 : 0).map(
              (_, index) => {
                return (
                  <CardWait
                    key={index}
                    className="top-1/2 left-1/2 absolute rounded-2xl w-[80px] h-[80px] transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                    style={{
                      rotate: `${
                        ((index * 20) / (message.loadingFiles || 0)) *
                        (isMe ? -1 : 1)
                      }deg`,
                    }}
                  />
                );
              }
            )}
          </div>
        )}
        <div
          className={tw(
            "inline-flex relative flex-col w-fit",
            isMe && "items-end",
            !isMe && "items-start"
          )}
        >
          <a draggable={false} href={`#msg-${message.id}`}>
            <ClickedView
              style={{
                ...colorMerge(
                  "primary.background",
                  isMe && "primary",
                  isMe && {
                    color: "primary.content",
                  }
                ),
              }}
              className={tw("p-2 cursor-pointer w-fit rounded-xl")}
              onClick={() => {
                // showBottomSheet();
                // setTemp("bottom-sheet-message", message);
                // setTemp("bottom-sheet-type", "message");
              }}
            >
              <MarkDown value={message.value} />
            </ClickedView>
          </a>
          {message.repleyId && (
            <div
              style={{
                ...colorMerge("gray.opacity"),
              }}
              onClick={() => {
                setTemp(`messages-heighlight.${message.repleyId}`, true);
              }}
              className={tw(
                "cursor-pointer px-2 py-1 translate-y-[-3px] flex justify-center items-center rounded-xl"
              )}
            >
              <AsyncComponent
                render={async () => {
                  const repleyMessageDoc = await getDoc(
                    doc(
                      firestore,
                      "projects",
                      import.meta.env.VITE_PROJECT_ID,
                      "messages",
                      message.repleyId!
                    )
                  );
                  const repleyMessageData = repleyMessageDoc.data();
                  if (!repleyMessageData) {
                    return <EmptyComponent />;
                  }
                  const repleyMessage: Message = {
                    id: repleyMessageDoc.id,
                    ...repleyMessageData,
                  };
                  return (
                    <span className="text-nowrap">
                      {repleyMessage.value?.slice(0, 10)}
                      ...
                    </span>
                  );
                }}
                loading={<CircleLoading className="w-[10px] h-[10px]" />}
              />
            </div>
          )}
          <span
            className={tw(
              "absolute bottom-0 m-1",
              isMe && "right-full",
              !isMe && "left-full"
            )}
          >
            {marked.get === null && (
              <CircleLoading className="w-[10px] h-[10px]" />
            )}
            {!!marked.get && (
              <span
                style={{
                  backgroundColor: "red",
                }}
                className={"inline-block text-xs rounded-xl text-white px-1"}
              >
                {marked.get >= 10 ? "9+" : marked.get}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
