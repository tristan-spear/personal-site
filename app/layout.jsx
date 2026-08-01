import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import Links from '@/components/links/links';

export const metadata = {
  title: 'Tristan Spear',
  icons: {
    icon: [{ url: '/newfavicon.png', type: 'image/png', sizes: '96x96' }],
    shortcut: [{ url: '/favicon.png?v=4', type: 'image/png' }],
    apple: [{ url: '/favicon.png?v=4', type: 'image/png' }],
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <Header />
          <main>{children}</main>
          <Links />
          <Footer />
        </div>
      </body>
    </html>
  );
}
