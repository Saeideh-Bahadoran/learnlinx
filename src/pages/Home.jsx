import { Overlay, Container, Title, Button, Text } from "@mantine/core";
import herologo from "../images/heropage-image.webp";
import "../styles/Home.css";
import sal from "sal.js";
import "sal.js/dist/sal.css";
import { useEffect } from "react";

export function Home() {
  // Initialize sal.js on component mount
  useEffect(() => {
    sal();
  }, []);

  return (
    <div>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 20%)"
        opacity={0.5}
        zIndex={-1}
      />
      <img src={herologo} alt="Hero Logo" className="hero-image" />
      <div
        data-sal="slide-right"
        data-sal-delay="500"
        data-sal-duration="500"
        data-sal-easing="ease-in-bounce"
        className="hero-head-text"
      >
        Dive into Learning with LearnLinx
      </div>
      <div
        className="hero-head-subtext"
        data-sal="slide-up"
        data-sal-delay="500"
        data-sal-duration="500"
        data-sal-easing="ease-in-bounce"
      >
        Your journey to knowledge begins here! Access a world of information at
        your fingertips and discover learning made easy and enjoyable.
      </div>
    </div>
  );
}

export default Home;
