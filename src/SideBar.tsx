import { Capacitor } from "@capacitor/core";
import { signOut } from "firebase/auth";
import { allIcons, signInAccount } from "water-fetch/ui/apis";
import {
  Line,
  Icon,
  EmptyComponent,
  Button,
  Translate,
} from "water-fetch/ui/components";
import {
  openDialog,
  showProfile,
  useColorMerge,
  useUserFromDB,
} from "water-fetch/ui/hooks";
import { auth } from "./server";
export const SideBar = () => {
  const user = useUserFromDB();
  const colorMerge = useColorMerge();
  return (
    <div
      className="border-transparent border-r border-solid rounded-ee-3xl rounded-se-3xl h-full"
      style={{
        ...colorMerge("secondary.background", {
          borderColor: "borders",
        }),
      }}
    >
      <div className="flex flex-col justify-center items-center w-[300px] h-full">
        {user && (
          <EmptyComponent>
            <div className="flex flex-col items-center gap-y-3 p-2">
              <div
                onClick={() => {
                  showProfile();
                }}
                className="inline-flex flex-none justify-center items-center rounded-full w-[100px] h-[100px] cursor-pointer overflow-hidden"
              >
                {user?.photo && (
                  <img
                    src={user?.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                )}
                {!user?.photo && (
                  <span
                    style={{
                      ...colorMerge({
                        color: "gray.opacity",
                      }),
                    }}
                  >
                    <Icon
                      icon={allIcons.solid.faUser}
                      iconClassName="w-2/3 h-2/3"
                    />
                  </span>
                )}
              </div>
              <div className="w-full">
                {user?.firstname} {user?.lastname}{" "}
                {user?.nickname && `(${user.nickname})`}
              </div>
            </div>
            <Line />
            <div className="w-full h-full"></div>
            <Line />
            <div className="p-2 w-full">
              <Button
                className="rounded-full"
                style={{}}
                onClick={async () => {
                  const { response } = await openDialog({
                    title: "logout",
                    message: "Are You Sure Want to logout!",
                    buttons: ["Yes", "No"],
                    defaultId: 0,
                  });
                  if (response) {
                    return;
                  }
                  await signOut(auth);
                }}
              >
                <Translate content="logout" />
              </Button>
            </div>
          </EmptyComponent>
        )}
        {!user && (
          <Button
            icon={allIcons.solid.faArrowRight}
            className="rounded-full w-1/2"
            onClick={async () => {
              await signInAccount({
                place: "window",
                projectId: import.meta.env.VITE_PROJECT_ID,
                isDev: import.meta.env.DEV,
                key: import.meta.env.DEV ? "test" : Capacitor.getPlatform(),
              });
            }}
          >
            <Translate content="login" />
          </Button>
        )}
      </div>
    </div>
  );
};
