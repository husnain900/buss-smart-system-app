import "./globals.css";

export const metadata = {
  title: "Bus Smart System Application | Ayesha Batool (M245004)",
  description: "Enterprise Smart Bus & Automotive Fleet Management Simulator and Thesis Portal engineered by Ayesha Batool (Roll No: M245004), Department of Computer Science, Gomal University Faisalabad.",
  authors: [{ name: "Ayesha Batool" }],
  creator: "Ayesha Batool",
  publisher: "Gomal University Faisalabad",
  keywords: [
    "Bus Smart System",
    "Car Management",
    "Ayesha Batool",
    "M245004",
    "Gomal University",
    "IoT Fleet Tracking",
    "RFID Attendance",
    "Digital Ticketing",
    "Automotive Telemetry"
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Ayesha Batool (Roll No: M245004)" />
        <meta name="application-name" content="Bus Smart System Application" />
      </head>
      <body>{children}</body>
    </html>
  );
}
