import {
  StrictMode,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import axios, { AxiosError } from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryFunction,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuth, useAuthStore } from "@/stores/authStore";
import { handleServerError } from "@/utils/handle-server-error";
import { toast } from "@/hooks/use-toast";
import { ThemeProvider } from "./context/theme-context";
import "./index.css";

// Generated Routes
import { routeTree } from "./routeTree.gen";
import { BASE_API_URL } from "./lib/http";
import { Store } from "@tauri-apps/plugin-store";
import { AuthToken } from "./lib/resp";
import { Spinner } from "./components/ui/spinner";

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const store = useAuthStore.getState();
  const { data } = await axios.get(`${BASE_API_URL}${queryKey[0]}`, {
    headers: {
      Authorization: `bearer ${store.auth.accessToken}`,
    },
  });
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast({
              variant: "destructive",
              title: "Content not modified!",
            });
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast({
            variant: "destructive",
            title: "Session expired!",
          });
          useAuthStore.getState().auth.reset();
          const redirect = `${router.history.location.href}`;
          router.navigate({ to: "/sign-in", search: { redirect } });
        }
        if (error.response?.status === 500) {
          toast({
            variant: "destructive",
            title: "Internal Server Error!",
          });
          router.navigate({ to: "/500" });
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, token: null },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { accessToken, setAccessToken } = useAuth();

  console.log("accessToken", accessToken);

  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      console.log("fetchToken");
      const store = await Store.load("auth.json");
      const token = await store.get<AuthToken>("token");
      if (token?.accessToken) {
        setPending(false);
        setAccessToken(token.accessToken);
      }
    };

    fetchToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="hips-ui-theme">
        {isPending ? (
          <div className="w-full h-[100vh] flex justify-center items-center">
            <Spinner size="lg" className="bg-black dark:bg-white" />
          </div>
        ) : (
          <RouterProvider
            router={router}
            context={{ queryClient, token: accessToken }}
          />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

if (import.meta.env.MODE === "production") {
  window.addEventListener("contextmenu", (e) => e.preventDefault(), false);
}
