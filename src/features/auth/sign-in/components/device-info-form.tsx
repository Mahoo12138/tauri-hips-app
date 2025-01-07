import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Store } from "@tauri-apps/plugin-store";
import { toast } from "@/hooks/use-toast";

const deviceFormSchema = z.object({
    deviceBrand: z
        .string()
        .min(1, { message: "设备品牌不能为空" }),
    deviceType: z
        .string()
        .min(1, { message: "设备型号不能为空" }),
    ime: z
        .string()
        .min(4, {
            message: "IMEI 不能为空",
        })
        .optional()
})
export function DeviceInfoForm({ open, setOpen }: DeviceInfoFormProps) {
    const form = useForm<z.infer<typeof deviceFormSchema>>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: {
            deviceBrand: "Redmi",
            deviceType: "M2012K11AC",
            ime: "5497b300-dbcc-33ee-bdf0-95ab7473a29e"
        },
    });

    const onSubmit = async (data: z.infer<typeof deviceFormSchema>) => {
        const device = {
            "bundleId": "com.hand_china.hrms",
            "clientVersion": "6.0.1",
            "height": "2400",
            "operationSystem": "Android",
            "operationSystemVersion": "14",
            "pixelRatio": "440dpi",
            "width": "1080",
            ...data
        }
        const store = await Store.load("setting.json");
        await store.set("devices", [device]);
        setOpen(false);
        toast({title: "设备已成功添加"})
    }

    const handleGenerateIMEI = () => {

    }
    return (<Dialog open={open} >
        <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
                <DialogTitle>添加设备</DialogTitle>
                {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription> */}
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="deviceBrand"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>设备品牌</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Redmi" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceType"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>设备型号</FormLabel>
                                    <FormControl>
                                        <Input placeholder="M2012K11AC" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceType"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>IMEI</FormLabel>
                                    <div className="flex space-x-2">
                                        <FormControl className="flex-grow">
                                            <Input
                                                type="text"
                                                placeholder="5497b300-dbcc-33ee-bdf0-95ab7473a29e"
                                                maxLength={6}
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleGenerateIMEI}
                                        >
                                            生成
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-2">
                            添加
                        </Button>


                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>)
}

export interface DeviceInfoFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}