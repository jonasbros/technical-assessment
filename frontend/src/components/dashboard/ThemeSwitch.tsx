import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ThemeSwitch() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="theme-switch" className=" cursor-pointer" />
      <Label htmlFor="theme-switch" className=" cursor-pointer">
        Dark Mode
      </Label>
    </div>
  );
}
