export function getCurrentOrigin(): string {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case "production": {
      return "https://www.phuctm97.com";
    }
    default: {
      return "http://localhost:43815";
    }
  }
}

export function getCurrentURL(path = "/"): URL {
  return new URL(path, getCurrentOrigin());
}
