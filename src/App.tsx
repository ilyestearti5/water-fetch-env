import { Card, Line, MarkDown } from "water-fetch/ui/components";
import {} from "water-fetch/ui/hooks"; /* Hooks Of Water Fetch */
import {} from "water-fetch/ui/app"; /* App Of Water Fetch */
import {} from "water-fetch/ui/layouts"; /* Layouts Of Water Fetch */
import {} from "water-fetch/ui/apis"; /* Apis Of Water Fetch */
import {} from "water-fetch/ui/utils"; /* Utils Of Water Fetch */
export const App = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card>
        <div className="p-2">
          <h1 className="text-3xl">Water Fetch Frame 💦</h1>
        </div>
        <Line />
        <div className="p-2 text-capitalize">
          <MarkDown value="edit **./src/App.tsx** file for start devlope your *Application*" />
        </div>
      </Card>
    </div>
  );
};
