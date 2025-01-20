import { ParameterProvider } from "./SearchContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ParameterProvider>
      <main className="w-full min-h-screen">{children}</main>
    </ParameterProvider>
  );
}
