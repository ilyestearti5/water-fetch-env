import logoSrc from "./images/logo.png";

import {
  useEffectDelay,
  useUserFromDB,
} from "water-fetch/ui/hooks"; /* Hooks Of Water Fetch */
import {} from "water-fetch/ui/app"; /* App Of Water Fetch */
import { signInAccount } from "water-fetch/ui/apis"; /* Apis Of Water Fetch */
import { delay } from "water-fetch/ui/utils"; /* Utils Of Water Fetch */
import { Header, Layoutes, Window } from "water-fetch/ui/layouts";
import {
  AsyncComponent,
  Button,
  Card,
  EmptyComponent,
  Feild,
  Line,
  Translate,
} from "water-fetch/ui/components";
import { SideBar } from "./SideBar";
import { WindowContent } from "./WindowContent";
import { Redirect, Route, Switch } from "react-router";
import { AuthRoute } from "water-fetch/ui/routes";
import { HeaderContent } from "./HeaderContent";
import { Capacitor } from "@capacitor/core";
export const App = () => {
  const user = useUserFromDB();
  // useEffectDelay(
  //   async () => {
  //     await delay(1000);
  //     if (!user) {
  //       await signInAccount({
  //         place: "redirect",
  //         projectId: import.meta.env.VITE_PROJECT_ID,
  //         isDev: import.meta.env.DEV,
  //         key: import.meta.env.DEV ? "test" : Capacitor.getPlatform(),
  //       });
  //     }
  //   },
  //   [user],
  //   1000
  // );
  return (
    <EmptyComponent>
      <Switch>
        <Route exact path="/__/auth">
          <AuthRoute successComponent={<Redirect to="/" />} />
        </Route>
        <Route path="/">
          {user && (
            <EmptyComponent>
              <Header>
                <HeaderContent />
              </Header>
              <Window>
                <div className="flex justify-between items-stretch gap-2 w-full h-full overflow-hidden">
                  {/* <SideBar /> */}
                  <WindowContent />
                </div>
              </Window>
              <Layoutes>
                <EmptyComponent />
              </Layoutes>
            </EmptyComponent>
          )}
          {!user && (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <Card className="justify-center items-center gap-3 p-4 w-fit">
                <div
                  className={
                    "rounded-full md:w-[150px] max-md:w-[100px] transform transition-[border-radius,width,height] md:h-[150px] max-md:h-[100px] overflow-hidden"
                  }
                >
                  <img src={logoSrc} className="w-full h-full object-cover" />
                </div>
                <Button
                  onClick={async () => {
                    await signInAccount({
                      place: "redirect",
                      projectId: import.meta.env.VITE_PROJECT_ID,
                      isDev: import.meta.env.DEV,
                      key: import.meta.env.DEV
                        ? "test"
                        : Capacitor.getPlatform(),
                    });
                  }}
                  className="p-4 rounded-full w-fit text-2xl"
                >
                  <Translate content="login" />
                </Button>
              </Card>
            </div>
          )}
        </Route>
      </Switch>
    </EmptyComponent>
  );
};
