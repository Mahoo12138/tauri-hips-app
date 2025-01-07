import { HTMLAttributes, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { IconMessageMinus, IconPassword } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

import { loginByCode, loginByPasswd, sendVerificationCode } from "@/commands/auth.ts";
import { useToast } from "@/hooks/use-toast.ts";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const authFormSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "手机号不能为空" })
    .regex(/^1[3-9]\d{9}$/, "Invalid phone format"),
  password: z
    .string()
    .min(1, {
      message: "密码手不能为空",
    })
    .min(7, {
      message: "密码至少需要 7 位长度",
    })
    .optional(),
  code: z
    .string()
    .min(4, {
      message: "验证码不能为空",
    })
    .optional()
})
  .superRefine((data, ctx) => {
    // If using password mode, password is required
    if (data.password === undefined && !data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required when not using verification code",
        path: ["password"]
      });
    }

    // If using code mode, code is required
    if (data.code === undefined && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Verification code is required when not using password",
        path: ["code"]
      });
    }

    // Prevent both password and code being filled
    if (data.password && data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot use both password and verification code",
        path: ["password", "code"]
      });
    }
  });
// .refine((data) => {
//   // If usePasswd is false, ensure code is provided
//   // If usePasswd is true, ensure password is provided
//   return (data.password && !data.code) || (!data.password && data.code);
// }, {
//   message: "Either password or code must be provided, but not both",
//   path: ["password", "code"]
// });

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [usePasswd, setUsePasswd] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [canSendCode, setCanSendCode] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [captchaKey, setCaptchaKey] = useState('');

  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      phone: "",
      password: usePasswd ? "" : undefined,
      code: !usePasswd ? "" : undefined
    },
  });



  const handleSendCode = async () => {
    const phone = form.getValues('phone');

    // Validate phone first
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      form.setError('phone', {
        type: 'manual',
        message: '请输入合法的手机号'
      });
      return;
    }

    try {
      // Implement your actual code sending logic here
      // For example, call an API to send verification code
      const { success, message, data } = await sendVerificationCode(phone);
      console.log("sendVerificationCode", data)
      if (success && data) {
        setCaptchaKey(data.captchaKey)
        // Start countdown
        setCanSendCode(false);
        setCountdown(60);

        // Countdown timer
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanSendCode(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast({
          title: "发送失败",
          description: message || "未知错误",
        })
      }
    } catch (error) {
      // Handle sending code error
      console.error('发送验证码失败', error);
    }
  };

  async function onSubmit(data: z.infer<typeof authFormSchema>) {
    setIsLoading(true);
    console.log("data", data, "captchaKey", captchaKey);
    const { phone, password, code } = data

    if (usePasswd) {
      await loginByPasswd(phone, password!);
      // TODO
    } else {
      const { success, message, data } = await loginByCode(phone, code!, captchaKey);
      if (success) {
        console.log(data);
        await navigate({ to: '/' })
      } else {
        toast({
          title: "Login error",
          description: message || "Unknown error occurred.",
        })
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    form.reset({
      phone: form.getValues('phone'),
      password: usePasswd ? "" : undefined,
      code: !usePasswd ? "" : undefined
    });
  }, [usePasswd, form.reset]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入您的手机号" {...field} autoComplete='off' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {usePasswd ? (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FormLabel>密码</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-muted-foreground hover:opacity-75"
                      >
                        忘记密码?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput
                        placeholder="请输入您的密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>手机验证码</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl className="flex-grow">
                        <Input
                          type="text"
                          placeholder="6 位手机验证码"
                          maxLength={6}
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!canSendCode}
                        onClick={handleSendCode}
                      >
                        {canSendCode ? '发送验证码' : `再次发送 (${countdown}s)`}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="mt-2" disabled={isLoading}>
              登录
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或 通过
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={isLoading}
                onClick={() => setUsePasswd((use) => !use)}
              >
                {
                  usePasswd
                    ? (<><IconMessageMinus className="h-4 w-4" />手机验证码</>)
                    : (<> <IconPassword className="h-4 w-4" />密码</>)
                }
              </Button>
              {/*<Button*/}
              {/*  variant="outline"*/}
              {/*  className="w-full"*/}
              {/*  type="button"*/}
              {/*  disabled={isLoading}*/}
              {/*  onClick={testHTTP}*/}
              {/*>*/}
              {/*  <IconBrandFacebook className="h-4 w-4" /> Facebook*/}
              {/*</Button>*/}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
