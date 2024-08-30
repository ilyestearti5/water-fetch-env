import { Card, Line, MarkDown } from "@water-fetch/ui/dist/components";
import {} from "@water-fetch/ui/dist/hooks"; /* Hooks Of Water Fetch */
import {} from "@water-fetch/ui/dist/app"; /* App Of Water Fetch */
import {} from "@water-fetch/ui/dist/layouts"; /* Layouts Of Water Fetch */
import {} from "@water-fetch/ui/dist/apis"; /* Apis Of Water Fetch */
import {} from "@water-fetch/ui/dist/utils"; /* Utils Of Water Fetch */
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
