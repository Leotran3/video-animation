import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AnimationComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const frameRef = useRef(frames);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas.getContext('2d');

    const extractFrames = () => {
      const frameList = [];
      const frameRate = 30;
      const interval = 1000 / frameRate;

      const captureFrame = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg');
        frameList.push(frameData);
        if (video.currentTime < video.duration) {
          setTimeout(captureFrame, interval * 5);
          video.currentTime += 1 / frameRate;
          console.log(video.currentTime, "videotime")
          if (video.currentTime === 2) {
            document.getElementById('loading').style.display = "none";
            document.getElementById('videoFrame').style.display = "block";
          } else {
            document.getElementById('videoFrame').style.display = "none";
          }
        } else {
          setFrames(frameList);
          frameRef.current = frameList;
          console.log("done", frameList.length)
        }
      };

      video.onloadeddata = () => {
        console.log("capturing")
        captureFrame();
      };
    };

    extractFrames();

    if (image) {
      gsap.registerPlugin(ScrollTrigger);

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: image,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: true,
          onUpdate: self => {
            const scrollDirection = self.direction;
            // const video = videoRef.current;
            // if (scrollDirection === 1) {
            //   video.currentTime += 0.001;
            // } else if (scrollDirection === -1) {
            //   video.currentTime -= 0.001;
            // }
            const length = frameRef.current.length;
            if (length > 0) {

              const index = Math.floor(length * self.progress);
              image.src = frameRef.current[index];
              console.log(scrollDirection, self.progress, frameRef.current.length, index)
            }
          },
        },
      });

      // video.onloadedmetadata = function () {
      //   tl.to(video, {
      //     currentTime: video.duration,
      //   });
      // };

      return () => {
        tl.kill();
      };
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <img id='loading' src="200w.gif" style={{ width: "30%", zIndex: '4', position: 'absolute' }} />
      <img ref={imageRef} id="videoFrame" src={frameRef.current[0]} style={{ width: '100%', height: 'auto', zIndex: '1' }} />

      <video ref={videoRef} autoPlay controls={false} style={{ width: '100%', height: '100vh', objectFit: 'cover',display:'none' }}>
        <source src="video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <canvas ref={canvasRef} width="1024" height="768" style={{ width: '100vw', height: '100vh', display: "none" }} />
    </div>
  );
};

export default AnimationComponent;