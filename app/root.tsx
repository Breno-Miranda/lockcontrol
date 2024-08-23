import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./app.css";
import { Provider } from "react-redux";
import{ store , persistor } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";
import { AxiosProvider } from "./services/intercept";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AxiosProvider token={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Outlet context={store}/>
        </PersistGate>
      </AxiosProvider>
    </Provider>
  );
}
