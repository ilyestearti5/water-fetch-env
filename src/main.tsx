import "./index.css";
import "water-fetch/ui/style.css";
import "./server";
import { startApplication } from "water-fetch/ui/app";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { addCommand } from "water-fetch/ui/hooks";
startApplication({
  app: (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  isDev: import.meta.env.DEV,
  onPrepare() {
    const toolsWhen = "!focused && state.object.data['message-tip']";
    addCommand(
      {
        commandId: "message-tips-next",
        commands: [
          {
            type: "actions/exec",
            payload: ["message-tips-next"],
          },
        ],
      },
      [
        {
          repeation: true,
          value: "arrowright",
          when: toolsWhen,
        },
        {
          repeation: true,
          value: "arrowdown",
          when: toolsWhen,
        },
      ]
    );
    addCommand(
      {
        commandId: "message-tips-back",
        commands: [
          {
            type: "actions/exec",
            payload: ["message-tips-back"],
          },
        ],
      },
      [
        {
          repeation: true,
          value: "arrowleft",
          when: toolsWhen,
        },
        {
          repeation: true,
          value: "arrowup",
          when: toolsWhen,
        },
      ]
    );
    addCommand(
      {
        commandId: "message-tips-submit",
        commands: [
          {
            type: "actions/exec",
            payload: ["message-tips-submit"],
          },
        ],
      },
      [
        {
          repeation: true,
          value: "enter",
          when: toolsWhen,
        },
      ]
    );
  },
});
