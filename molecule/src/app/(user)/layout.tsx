import "@/app/global.css";
import Navbar from "@/components/navbar/navbar";
import NavbarLink from "@/components/navbar/navbar-link";
import StoreProvider from "@/components/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Ion",
    default: "Ion",
  },
  description: "IonSpace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} text-sm`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <Navbar>
              <NavbarLink></NavbarLink>
            </Navbar>
            <Separator />

            <main className="min-h-screen min-w-[375px] border bg-gray-100 px-4 dark:bg-gray-800 xl:p-8 xl:shadow-inner">
              <div className="mx-auto xl:max-w-screen-xl">{children}</div>
            </main>

            <footer className="w-full bg-gray-900 text-slate-400">
              <div className="mx-auto flex max-w-screen-xl flex-1 justify-between gap-3 px-3 py-10 text-xs md:gap-5 md:p-10 md:text-base">
                <span>Copyright {new Date().getFullYear()} dothack.</span>
                <div className="flex flex-none items-center gap-3">
                  <Link className="transition hover:text-gray-300 dark:hover:text-gray-200" href="/policy/privacy">
                    <span>개인정보처리방침</span>
                  </Link>
                  <Separator orientation="vertical" className="bg-slate-400" />
                  <Link className="transition hover:text-gray-300 dark:hover:text-gray-200" href="/policy/rules">
                    <span>이용수칙</span>
                  </Link>
                </div>
              </div>
            </footer>

            <ToastContainer
              position="bottom-right"
              autoClose={1500}
              hideProgressBar={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              theme="light"
            />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
