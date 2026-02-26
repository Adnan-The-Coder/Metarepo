import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OU Results Analytics | CSE Semester 3 - Feb 2026 | Osmania University",
  description: "Live analytics dashboard for Osmania University B.E. Computer Science Semester 3 results (Feb 2026). Division-wise leaderboards, subject pass rates, grade distributions, and individual student performance - all data scraped live from official OU results.",
  keywords: "Osmania University, OU results, CSE results, Semester 3, B.E. Computer Science, result analytics, SGPA, CGPA, pass percentage, grade distribution, division wise results, Hyderabad, Telangana, Feb 2026",
  authors: [
    {
      name: "Syed Adnan Ali",
      url: "https://adnanthecoder.com",
    },
  ],
  creator: "Syed Adnan Ali",
  publisher: "Syed Adnan Ali",
  openGraph: {
    title: "OU Results Analytics | CSE Sem-3 Feb 2026",
    description: "Live analytics for Osmania University CSE Semester 3 results. Division leaderboards, subject pass rates, grade breakdowns - data scraped from official OU portal.",
    url: "https://metrics.ou-results.adnanthecoder.com",
    siteName: "OU Results Analytics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OU Results Analytics Dashboard - CSE Semester 3",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OU Results Analytics | CSE Sem-3 Feb 2026",
    description: "Live analytics for Osmania University CSE Semester 3 results. Division leaderboards, subject pass rates, grade breakdowns.",
    images: ["/og-image.png"],
    creator: "@SyedAdnanAli",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://metrics.ou-results.adnanthecoder.com",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={'antialiased'}
      >
        {children}
        <Script id="schema-script" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "OU Results Analytics",
            url: "https://metrics.ou-results.adnanthecoder.com",
            description: "Live analytics dashboard for Osmania University B.E. Computer Science Semester 3 results (Feb 2026)",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR"
            },
            creator: {
              "@type": "Person",
              name: "Syed Adnan Ali",
              url: "https://adnanthecoder.com",
              sameAs: [
                "https://www.linkedin.com/in/syedadnanali99",
                "https://github.com/Adnan-The-Coder"
              ]
            },
            sourceOrganization: {
              "@type": "EducationalOrganization",
              name: "Osmania University",
              url: "https://osmania.ac.in",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                addressCountry: "IN"
              }
            },
            about: {
              "@type": "Course",
              name: "B.E. Computer Science Engineering",
              provider: {
                "@type": "EducationalOrganization",
                name: "Osmania University"
              }
            }
          })}
        </Script>
      </body>
    </html>
  );
}