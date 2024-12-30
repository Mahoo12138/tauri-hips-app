import { SelectDropdown } from "@/components/select-dropdown";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  status: z.string().min(1, "Please select a status."),
  label: z.string().min(1, "Please select a label."),
  priority: z.string().min(1, "Please choose a priority."),
  check: z.boolean().default(false),
  desc: z.string().optional(),
});
type TasksForm = z.infer<typeof formSchema>;

export const TimesheetForm = () => {
  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "",
      label: "",
      priority: "",
      check: false,
    },
  });
  const onSubmit = (data: TasksForm) => {
    // do something with the form data
    // onOpenChange(false)
    form.reset();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };
  return (
    <Form {...form}>
      <form
        id="tasks-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 flex-1"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>项目</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder="选择项目"
                items={[
                  { label: "In Progress", value: "in progress" },
                  { label: "Backlog", value: "backlog" },
                  { label: "Todo", value: "todo" },
                  { label: "Canceled", value: "canceled" },
                  { label: "Done", value: "done" },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>地点</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder="选择地点"
                items={[
                  { label: "In Progress", value: "in progress" },
                  { label: "Backlog", value: "backlog" },
                  { label: "Todo", value: "todo" },
                  { label: "Canceled", value: "canceled" },
                  { label: "Done", value: "done" },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>办公地点</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder="选择办公地点"
                items={[
                  { label: "In Progress", value: "in progress" },
                  { label: "Backlog", value: "backlog" },
                  { label: "Todo", value: "todo" },
                  { label: "Canceled", value: "canceled" },
                  { label: "Done", value: "done" },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>审批人</FormLabel>
          <Input disabled placeholder="审批人" value="陈刀仔" />
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="check"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>津贴</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入描述"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
