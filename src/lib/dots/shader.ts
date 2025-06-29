interface ShaderUniform {
  type: 'uniform1f' | 'uniform3f' | 'uniform1fv' | 'uniform3fv';
  value: number | number[] | number[][];
}

interface TextureInfo {
  width: number;
  height: number;
  texture: WebGLTexture;
  location: WebGLUniformLocation | null;
}

type TextureUnit =
  | 'TEXTURE0'
  | 'TEXTURE1'
  | 'TEXTURE2'
  | 'TEXTURE3'
  | 'TEXTURE4'
  | 'TEXTURE5'
  | 'TEXTURE6'
  | 'TEXTURE7'
  | 'TEXTURE8'
  | 'TEXTURE9'
  | 'TEXTURE10'
  | 'TEXTURE11'
  | 'TEXTURE12'
  | 'TEXTURE13'
  | 'TEXTURE14'
  | 'TEXTURE15';

export class Shader {
  private readonly DEFAULT_VERTEX_SHADER = `#version 300 es
    precision mediump float;
    in vec2 coordinates;
    uniform vec2 u_resolution;
    out vec2 fragCoord;

    void main(void) {
      gl_Position = vec4(coordinates, 0.0, 1.0);
      fragCoord = (coordinates + 1.0) * 0.5 * u_resolution;
      fragCoord.y = u_resolution.y - fragCoord.y;
    }`;

  private gl!: WebGL2RenderingContext;
  private ctx!: CanvasRenderingContext2D;
  private program: WebGLProgram | null = null;
  private animationFrameId?: number;
  private startTime: number | null = null;
  private currentTime = 0;
  private eventTime = 0;
  private lastFrameTime = 0;
  private textureObjects: TextureInfo[] = [];
  private resizeObserver?: ResizeObserver;
  private state: 'playing' | 'paused';
  private canvas: HTMLCanvasElement;
  private offscreenCanvas: HTMLCanvasElement;

  constructor(
    element: HTMLElement,
    private source: string,
    private uniforms: Record<string, ShaderUniform> = {},
    private textures: string[] = [],
    private maxFps = Infinity,
    initialState: 'playing' | 'paused' = 'playing'
  ) {
    this.state = initialState;
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('absolute', 'inset-0', 'h-full', 'w-full');
    this.canvas.setAttribute('aria-hidden', 'true');
    element.appendChild(this.canvas);

    this.offscreenCanvas = document.createElement('canvas');
    this.init();
  }

  play(): void {
    this.state = 'playing';
  }

  pause(): void {
    this.state = 'paused';
  }

  fireEvent(): void {
    this.eventTime = this.currentTime;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader;
    }

    this.gl.deleteShader(shader);
    return null;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      return program;
    }

    return null;
  }

  private getTextureUnit(index: number): TextureUnit {
    if (index < 0 || index > 15) {
      throw new Error('Texture unit index out of range');
    }
    return `TEXTURE${index}` as TextureUnit;
  }

  private async loadTexture(url: string, index: number): Promise<TextureInfo> {
    return new Promise((resolve, reject) => {
      const texture = this.gl.createTexture();
      if (!texture) return reject(new Error('Failed to create texture'));

      const textureUnit = this.getTextureUnit(index);
      this.gl.activeTexture(this.gl[textureUnit]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

      const textureInfo: TextureInfo = {
        width: 1,
        height: 1,
        texture,
        location: this.gl.getUniformLocation(this.program!, `u_texture_${index}`),
      };

      const image = new Image();
      image.addEventListener('load', () => {
        textureInfo.width = image.width;
        textureInfo.height = image.height;

        this.gl.activeTexture(this.gl[textureUnit]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureInfo.texture);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image
        );

        resolve(textureInfo);
      });

      image.src = url;
    });
  }

  private bindTexture(textureInfo: TextureInfo, index: number): void {
    if (textureInfo.location) {
      const textureUnit = this.getTextureUnit(index);

      this.gl.uniform1i(textureInfo.location, index);
      this.gl.activeTexture(this.gl[textureUnit]);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureInfo.texture);
    }
  }

  private init(): void {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio ?? 1, 2));

    this.canvas.width = this.offscreenCanvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = this.offscreenCanvas.height = this.canvas.offsetHeight * dpr;

    this.gl = this.offscreenCanvas.getContext('webgl2')!;
    this.ctx = this.canvas.getContext('2d')!;

    if (!this.gl || !this.ctx) {
      return;
    }

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.DEFAULT_VERTEX_SHADER);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.source);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    this.program = this.createProgram(vertexShader, fragmentShader);
    if (!this.program) {
      return;
    }

    this.gl.useProgram(this.program);

    // Set up vertex buffer
    const vertexBuffer = this.gl.createBuffer();
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const coordinatesLocation = this.gl.getAttribLocation(this.program, 'coordinates');
    this.gl.enableVertexAttribArray(coordinatesLocation);
    this.gl.vertexAttribPointer(coordinatesLocation, 2, this.gl.FLOAT, false, 0, 0);

    const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.gl.uniform2f(resolutionLocation, this.canvas.width / dpr, this.canvas.height / dpr);

    for (const [name, uniform] of Object.entries(this.uniforms)) {
      const location = this.gl.getUniformLocation(this.program, name);

      switch (uniform.type) {
        case 'uniform1f':
          this.gl.uniform1f(location, uniform.value as number);
          break;
        case 'uniform3f':
          const [x, y, z] = uniform.value as [number, number, number];
          this.gl.uniform3f(location, x, y, z);
          break;
        case 'uniform1fv':
          this.gl.uniform1fv(location, uniform.value as number[]);
          break;
        case 'uniform3fv':
          this.gl.uniform3fv(location, (uniform.value as number[][]).flat());
          break;
      }
    }

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.gl.disable(this.gl.DEPTH_TEST);

    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    this.resizeObserver = new ResizeObserver(() => {
      this.canvas.width = this.offscreenCanvas.width = this.canvas.offsetWidth * dpr;
      this.canvas.height = this.offscreenCanvas.height = this.canvas.offsetHeight * dpr;
      this.gl?.uniform2f(resolutionLocation, this.canvas.width / dpr, this.canvas.height / dpr);
    });

    this.resizeObserver.observe(this.canvas);

    this.startAnimation();
  }

  private animate(timestamp: number): void {
    if (!this.gl || !this.ctx || !this.program) return;

    if (this.state === 'paused') {
      this.scheduleNextFrame();
      return;
    }

    const currentTime = timestamp / 1000;

    if (this.startTime === null) {
      this.startTime = currentTime;
    }

    if (this.maxFps !== Infinity) {
      if (timestamp - this.lastFrameTime < 1000 / this.maxFps) {
        this.scheduleNextFrame();
        return;
      }
      this.lastFrameTime = timestamp;
    }

    this.currentTime = currentTime - this.startTime;

    const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    const scrollLocation = this.gl.getUniformLocation(this.program, 'u_scroll');
    const eventTimeLocation = this.gl.getUniformLocation(this.program, 'u_event_time');

    this.gl.uniform1f(timeLocation, this.currentTime);
    this.gl.uniform1f(scrollLocation, window.scrollY);
    this.gl.uniform1f(eventTimeLocation, this.eventTime);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.textureObjects.forEach((textureObject, index) => {
      this.bindTexture(textureObject, index);
    });

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.gl.canvas, 0, 0);

    this.scheduleNextFrame();
  }

  private scheduleNextFrame(): void {
    this.animationFrameId = requestAnimationFrame((timestamp) => this.animate(timestamp));
  }

  private startAnimation(): void {
    Promise.all(this.textures.map((url, index) => this.loadTexture(url, index)))
      .then((textureInfos) => {
        this.textureObjects = textureInfos;
        this.scheduleNextFrame();
      })
      .catch((err) => {});
  }

  destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.resizeObserver?.disconnect();

    if (this.gl && this.program) {
      this.textureObjects.forEach(({ texture }) => {
        this.gl.deleteTexture(texture);
      });
      this.gl.deleteProgram(this.program);
    }

    this.canvas.remove();
  }
}
