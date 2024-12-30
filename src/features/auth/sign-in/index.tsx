import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>登录</h1>
          <p className='text-sm text-muted-foreground'>
            在下方输入您的手机号及认证信息，以完成您的登录
          </p>
        </div>
        <UserAuthForm className='pt-2' />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          点击登录，默认您同意我们的{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            服务条款
          </a>{' '}
          和{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            隐私政策
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
