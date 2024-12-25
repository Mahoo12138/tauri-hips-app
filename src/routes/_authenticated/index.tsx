import {createFileRoute, redirect} from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import {Store} from "@tauri-apps/plugin-store";

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
  beforeLoad: async ({location}) => {
    console.log("location: ",location)
    const store = await Store.load("user.json");
    const token = await store.get<{ value: number }>("token");
    if(!token) {
      throw redirect({
        to: '/log-in',
        search: {
          // Use the current location to power a redirect after auth.ts
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  }
})
