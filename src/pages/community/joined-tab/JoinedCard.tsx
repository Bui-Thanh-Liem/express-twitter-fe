import { PiIcon, Pin, Settings } from "lucide-react";
import { VerifyIcon } from "~/components/icons/verify";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { WrapIcon } from "~/components/wrapIcon";

export function JoinedCard() {
  return (
    <Card className="p-0 overflow-hidden cursor-pointer hover:shadow relative">
      <div className="w-full h-24">
        <img
          alt=""
          className="h-full w-full object-cover"
          src="https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/89.jpg"
        />
      </div>
      <CardHeader className="p-0 px-3 mb-3">
        <CardTitle className="flex items-center gap-1">
          <p className="max-w-[90%] line-clamp-1">Card Title Card Title</p>
          <VerifyIcon active={true} size={20} color="orange" />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          Card Description Card Description Card Description Card Description
          Card Description Card Description Card Description Card Description
        </CardDescription>
        <div className="absolute top-0 right-0">
          <WrapIcon className="block bg-transparent p-1 rotate-45 hover:bg-transparent">
            <Pin size={20} color="#00bcff" />
          </WrapIcon>
          <WrapIcon className="bg-transparent p-1">
            <Settings size={20} />
          </WrapIcon>
        </div>
      </CardHeader>
    </Card>
  );
}
