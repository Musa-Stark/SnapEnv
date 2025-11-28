import "./globals.css";

export const metadata = {
  title: "SnapEnv",
  description: "A cross-tech automation tool that lets you create custom “work environments” (VS Code workspace, browser tabs, desktop windows, etc.) and launch them instantly with one command. Stop repeating your daily setup routine, automate it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
