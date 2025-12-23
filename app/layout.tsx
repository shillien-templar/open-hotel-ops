import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "next-themes";

export const metadata: Metadata = {
    title: "Open Hotel Ops",
    description: "A hotel operations management application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-screen flex flex-col">
                {children}
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
