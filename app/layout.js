import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://m245004-buss-connected.vercel.app"),
  title: "NEBULA TRANSIT — Smart Mobility Intelligence | Bus Connected (M245004)",
  description: "Enterprise Smart Bus Fleet Operations, Interactive 3D Telematics & Safety Interlock Platform engineered by Ayesha Batool (Roll No: M245004), Department of Computer Science, Gomal University Faisalabad. Supervised by Mam Mehwish.",
  authors: [{ name: "Ayesha Batool", url: "https://m245004-buss-connected.vercel.app/" }],
  creator: "Ayesha Batool",
  publisher: "Gomal University Faisalabad",
  applicationName: "NEBULA TRANSIT",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/assets/nextrans-symbol.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/assets/nextrans-symbol.svg"
  },
  keywords: [
    "NEXTRANS",
    "Bus Smart System Application",
    "Ayesha Batool",
    "M245004",
    "Mam Mehwish",
    "Gomal University Faisalabad",
    "Connected Bus Platform",
    "Fleet Telematics",
    "3D Bus Inspector",
    "Safety Interlock",
    "TPMS Diagnostics",
    "RFID Passenger Density",
    "AI Exterior Inspection"
  ],
  openGraph: {
    title: "NEXTRANS — Smart Mobility Intelligence",
    description: "Production-grade Connected Bus Fleet Simulator & Academic Thesis Portal by Ayesha Batool (M245004).",
    url: "https://m245004-buss-connected.vercel.app/",
    siteName: "NEXTRANS",
    images: [
      {
        url: "/assets/images/smart_transit_bus.png",
        width: 1200,
        height: 630,
        alt: "NEXTRANS Electric Transit Bus Studio Render"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1264E9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="author" content="Ayesha Batool (Roll No: M245004)" />
        <meta name="supervisor" content="Mam Mehwish" />
        <meta name="institution" content="Gomal University Faisalabad" />
        <meta name="theme-color" content="#1264E9" />
      </head>
      <body>{children}</body>
    </html>
  );
}
