export const metadata = {
  title: "Next Todo",
  description: "A minimal Next.js todo list"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
