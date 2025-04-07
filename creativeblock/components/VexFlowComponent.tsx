import React, { useRef, useEffect } from 'react';
import { Svg, G } from 'react-native-svg';
import * as Vex from 'vexflow';

const VexFlowComponent = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const { Factory } = Vex.Flow;
      const renderer = new Factory({
        renderer: { elementId: 'svgCanvas', width: 500, height: 200, backend: 'SVG' },
      }).renderer;
      renderer.getContext().svg = svgRef.current;

      const score = new Vex.Flow.EasyScore();
      const system = new Vex.Flow.System(renderer);

      system.addStave({
        voices: [
          score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
          score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
        ],
      }).addClef('treble').addTimeSignature('4/4');

      renderer.draw();
    }
  }, []);

  return (
    <Svg width={500} height={200} ref={svgRef} id="svgCanvas">
      <G />
    </Svg>
  );
};

export default VexFlowComponent;