import { useEffect, useState } from "preact/hooks";
import { createIslandComponent } from "../lib/islands/builder";

export const About = createIslandComponent<{ name: string }, {}>(
  "island-about",
  function ({ name }) {
    const [time, setTime] = useState(new Date().toISOString());
    useEffect(() => {
      const id = setInterval(() => {
        setTime(new Date().toISOString());
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }, []);
    return (
      <h1>
        Greetings {name}, {time}
      </h1>
    );
  }
);
