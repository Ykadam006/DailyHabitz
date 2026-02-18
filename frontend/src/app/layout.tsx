import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import QueryProvider from "@/components/QueryProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
                <Toaster position="top-center" richColors closeButton />
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
