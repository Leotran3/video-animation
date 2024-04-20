import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger from GSAP

const AnimationComponent = () => {
  const coolVideoRef = useRef(null);

  useEffect(() => {
    const coolVideo = coolVideoRef.current;

    if (coolVideo) {
      gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: coolVideo,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: true,
          onUpdate: self => {
            const scrollDirection = self.direction;
            const video = coolVideoRef.current;

            if (scrollDirection === 1) {
              video.currentTime += 0.1; // Scroll down, play forward
            } else if (scrollDirection === -1) {
              video.currentTime -= 0.1; // Scroll up, play backward
            }
          },
        },
      });

      coolVideo.onloadedmetadata = function () {
        tl.to(coolVideo, {
          currentTime: coolVideo.duration,
        });
      };

      return () => {
        tl.kill(); // Clean up ScrollTrigger instance
      };
    }
  }, []);

  return (
    <div>
      <video ref={coolVideoRef} controls autoPlay>
        <source src="video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AnimationComponent;