import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) =>{

  return (
    <html lang="en">
      <body className={`${inter.className} text-navy-900 dark:text-white`}>{children}</body>
    </html>
  );
}

export default RootLayout; 
