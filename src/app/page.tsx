import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main>
        {
          <div className="min-h-screen flex flex-col items-center justify-center p-20">
            <h1
              className="text-4xl text-center"
              style={{ fontFamily: "var(--font-main)" }}
            >
              Shane Kanterman -- Software Developer
            </h1>
            <p
              className="text-center"
              style={{ fontFamily: "var(--font-main)" }}
            >
              I am a full stack developer with a passion for creating and
              maintaining applications both on and off the web. I have experience with a variety of
              technologies, including C++, C#, React, React Native, Node.js, and Python. I am always
              looking to learn new things and improve my skills.
            </p>            
          </div>
        }
      </main>
    </div>
  );
}
