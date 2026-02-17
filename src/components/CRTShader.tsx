import React, { useRef, useEffect, useCallback } from 'react';

// Fragment shader: CRT curvature, scanlines, vignette, chromatic aberration, bloom
const FRAG_SHADER = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
varying vec2 vUV;

// Barrel distortion for CRT curvature
vec2 curveUV(vec2 uv) {
  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
  uv = uv + uv * offset * offset * uIntensity;
  uv = uv * 0.5 + 0.5;
  return uv;
}

void main() {
  vec2 uv = curveUV(vUV);

  // Out of bounds: black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Chromatic aberration
  float caAmount = 0.0008 * uIntensity;
  float r = texture2D(uTexture, vec2(uv.x + caAmount, uv.y)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, vec2(uv.x - caAmount, uv.y)).b;
  vec3 color = vec3(r, g, b);

  // Scanlines
  float scanline = sin(uv.y * uResolution.y * 1.5) * 0.04 * uIntensity;
  color -= scanline;

  // Horizontal scanline travel
  float travel = sin(uv.y * 80.0 + uTime * 2.0) * 0.003 * uIntensity;
  color += travel;

  // Bloom / glow: simple box blur weighted towards center
  vec3 bloom = vec3(0.0);
  float bloomSize = 2.0 / uResolution.x * uIntensity;
  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      vec2 off = vec2(x, y) * bloomSize;
      bloom += texture2D(uTexture, uv + off).rgb;
    }
  }
  bloom /= 25.0;
  color = mix(color, bloom, 0.12 * uIntensity);

  // Vignette
  vec2 vigUV = vUV * (1.0 - vUV.yx);
  float vig = vigUV.x * vigUV.y * 15.0;
  vig = pow(vig, 0.3 * uIntensity);
  color *= vig;

  // Brightness boost to compensate darkening
  color *= 1.05;

  gl_FragColor = vec4(color, 1.0);
}
`;

const VERT_SHADER = `
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface CRTShaderProps {
  enabled?: boolean;
  intensity?: number; // 0-2, default 1
}

const CRTShader: React.FC<CRTShaderProps> = ({ enabled = true, intensity = 1.0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());

  const captureAndRender = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    const program = programRef.current;
    if (!canvas || !gl || !program || !enabled) return;

    // Match canvas size to window
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    const time = (Date.now() - startTimeRef.current) / 1000;

    gl.useProgram(program);

    // Set uniforms
    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uIntensity = gl.getUniformLocation(program, 'uIntensity');
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uIntensity, intensity);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animRef.current = requestAnimationFrame(captureAndRender);
  }, [enabled, intensity]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL not available for CRT shader');
      return;
    }
    glRef.current = gl;

    // Create program
    const vert = createShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Create texture from content behind
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    textureRef.current = texture;

    startTimeRef.current = Date.now();
    animRef.current = requestAnimationFrame(captureAndRender);

    return () => {
      cancelAnimationFrame(animRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
    };
  }, [enabled, captureAndRender]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[999] pointer-events-none"
      style={{
        width: '100vw',
        height: '100vh',
        mixBlendMode: 'multiply',
        opacity: 0.15,
      }}
    />
  );
};

export default CRTShader;
