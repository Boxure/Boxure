import "../styles/globals.css";

export const metadata = {
  title: "Boxure",
  description: "A platform for buying and selling blind box pulls",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
