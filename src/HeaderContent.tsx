import { allIcons } from "water-fetch/ui/apis";
import { DarkLightIcon, Icon, Translate } from "water-fetch/ui/components";
import { showProfile, useUserFromDB } from "water-fetch/ui/hooks";
export function HeaderContent() {
  const user = useUserFromDB();
  return (
    <div className="flex justify-between items-center p-2 w-full">
      <h1 className="text-2xl">
        <Translate content="Talk" />
      </h1>
      <div className="flex items-center gap-1">
        <DarkLightIcon />
        {user && (
          <div
            onClick={() => {
              showProfile();
            }}
            className="rounded-full w-[40px] h-[40px] cursor-pointer overflow-hidden"
          >
            {user.photo && (
              <img className="w-full h-full object-cover" src={user.photo} />
            )}
            {!user.photo && (
              <Icon iconClassName="w-1/3 h-1/3" icon={allIcons.solid.faUser} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
