import "@/app/global.css";
import Navbar from "@/components/admin/navbar/navbar";
import Sidebar from "@/components/admin/sidebar";
import StoreProvider from "@/components/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    <html lang="ko">
      <body className={`${inter.className} text-sm`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />

            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
              <Sidebar />
              <main className="flex-1 px-12 py-8 shadow-inner">{children}</main>
            </div>

            <footer className="w-full bg-gray-900 text-slate-400">
              <div className="mx-auto max-w-screen-xl flex-1 p-4">
                <span>Copyright {new Date().getFullYear()} IonSpace.</span>
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
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
