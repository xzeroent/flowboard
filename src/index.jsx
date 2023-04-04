// React + ThreeJS stuff
import React from "react";
import { createRoot } from "react-dom/client";
import { useGLTF } from "@react-three/drei";
// GSAP + SplitType to include the logic to animate text - not related to GSAP with ThreeJS
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
// Lenis for smooth scrolling
import Lenis from "@studio-freight/lenis";
// This is where the magic happens
import App from "./App";
// Small helper function that catches custom events and trigger events outside the canvas.
// Usefull to trigger interactions in Webflow.
import webflowEvents from "./Events";

// Register ScrollTrigger plugin for GSAP
gsap.registerPlugin(ScrollTrigger);

// Initializing custom code to trigger events on elements with data-attributes from ThreeJS
webflowEvents();

// Grab the .gltf file url to be loaded dynamically. This way we can create our root element
// directly on Webflow and use data attributes to point to the gltf file.
const rootElement = document.getElementById("root");
const modelSrc = rootElement.dataset.model || null;

if (modelSrc) {
  // Initializes the main React element and preloads the GLTF.
  const root = createRoot(rootElement);
  root.render(<App model={modelSrc} />);
  useGLTF.preload(modelSrc);
}

window.addEventListener("DOMContentLoaded", () => {
  // Page smooth scrolling behavior
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: "vertical", // vertical, horizontal
    gestureDirection: "vertical", // vertical, horizontal, both
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Required for Lenis
  function raf(time) {
    lenis.raf(time);
    // Required to sync ScrollTrigger with Lenis smooth scroll.
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }

  // Grab all elements that have a "data-target" attribute
  const scrollButtons = document.querySelectorAll("[data-target]");

  // For each element, listen to a "click" event
  scrollButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();

      // get the DOM element by the ID (data-target value)
      var target = button.dataset.target,
        immediate = "immediate" in button.dataset !== -1 ? true : false,
        $el = document.getElementById(target.replace("#", ""));

      // Use lenis.scrollTo() to scroll the page to the right element
      lenis.scrollTo($el, {
        offset: 0,
        immediate: immediate,
        duration: 2,
        easing: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), // https://easings.net
      });
    });
  });

  requestAnimationFrame(raf);

  // GSAP ======================================//

  // Split text into spans
  new SplitType("[text-split]", {
    types: "lines, words, chars",
    tagName: "span",
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      onEnter: () => timeline.play(),
      once: true,
    });
  }

  // text stagger type 1 - random letters
  gsap.utils.toArray("[letters-random]").forEach(function (item) {
    const delayRaw = item.dataset["start-delay"];
    const delay = delayRaw ? Number(delayRaw) : 0.15;
    let tl = gsap.timeline({ paused: true });
    tl.from(item.querySelectorAll(".char"), {
      opacity: 0,
      delay: delay,
      ease: "power1.out",
      stagger: { each: 0.02, from: "random" },
    });
    createScrollTrigger(item, tl);
  });

  // text stagger type 1 - fading lines
  gsap.utils.toArray("[lines-fade]").forEach(function (item) {
    const delayRaw = item.dataset["start-delay"];
    const delay = delayRaw ? Number(delayRaw) : 0.15;
    let tl = gsap.timeline({ paused: true });
    tl.from(item.querySelectorAll(".line"), {
      opacity: 0,
      translateY: 50,
      delay: delay,
      duration: 0.4,
      ease: "power1.out",
      stagger: { each: 0.08 },
    });
    createScrollTrigger(item, tl);
  });
});
