import { Link } from "react-router";
import reactLogo from "./assets/react.svg";
import "./Home.css";
import viteLogo from "/vite.svg";

function getGoogleAuthUrl() {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URIS } = import.meta.env;

  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URIS,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };

  const queryString = new URLSearchParams(query).toString();
  console.log(queryString);

  return `${url}?${queryString}`;
}

export function Home() {
  const googleOAuthUrl = getGoogleAuthUrl();
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Login OAuth 2.0</h1>
      <div className="card">
        <Link to={googleOAuthUrl}>Login google</Link>
      </div>
    </>
  );
}
