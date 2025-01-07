// import ViteLogo from '@/assets/vite.svg'
import { useEffect } from "react";
import { UserAuthForm } from "./components/user-auth-form";
import { toast } from "@/hooks/use-toast";
import { Store } from "@tauri-apps/plugin-store";
import React from "react";
import { DeviceInfoForm } from "./components/device-info-form";
import { ToastAction } from "@/components/ui/toast";

export default function LogIn() {
  const [open, setOpen] = React.useState(false)

  const checkHasDevice = async () => {
    const store = await Store.load("setting.json");
    const devices = await store.get<{}>("devices");
    return !!devices
  }

  const handleAddDevice = () => {
    setOpen(true)
  }

  useEffect(() => {
    checkHasDevice().then((hasDevice) => {
      if (!hasDevice) {
        toast({
          title: "当前未添加设备, 将使用默认设备信息",
          description: (
            <>设备信息用于 TS 打卡校验，可进行自定义。<ToastAction onClick={handleAddDevice} altText={"新增"} >新增</ToastAction></>
          ),
        });
      }
    });
  }, [])
  return (
    <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-zinc-900 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url(./bg.png)" }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Hippius
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your phone and authentication info below <br />
              to log into your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking login, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <DeviceInfoForm open={open} setOpen={setOpen}/>
    </div>
  );
}
