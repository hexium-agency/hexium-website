import { Shader } from "./shader";

interface DotsOptions {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  center?: ("x" | "y")[];
  init?: string;
  shader?: string;
  maxFps?: number;
}

export class Dots {
  private shader: Shader | null = null;

  constructor(private element: HTMLElement, private options: DotsOptions = {}) {
    this.init();
  }

  private init(): void {
    const options = this.getDefaultOptions();
    const shaderSource = this.getShaderSource(options);

    this.shader = new Shader(
      this.element,
      shaderSource,
      this.getUniforms(options),
      [],
      options.maxFps || 60
    );
  }

  private getDefaultOptions(): Required<DotsOptions> {
    return {
      colors: this.options.colors || [[0, 0, 0]],
      opacities: this.options.opacities || [
        0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14,
      ],
      totalSize: this.options.totalSize || 4,
      dotSize: this.options.dotSize || 2,
      center: this.options.center || ["x", "y"],
      init: this.options.init || "",
      shader: this.options.shader || "",
      maxFps: this.options.maxFps || 60,
    };
  }

  private getUniforms(options: Required<DotsOptions>): Record<string, any> {
    // Expand colors array to 6 items for the shader
    let expandedColors = [
      options.colors[0],
      options.colors[0],
      options.colors[0],
      options.colors[0],
      options.colors[0],
      options.colors[0],
    ];

    if (options.colors.length === 2) {
      expandedColors = [
        ...Array(3).fill(options.colors[0]),
        ...Array(3).fill(options.colors[1]),
      ];
    } else if (options.colors.length === 3) {
      expandedColors = [
        options.colors[0],
        options.colors[0],
        options.colors[1],
        options.colors[1],
        options.colors[2],
        options.colors[2],
      ];
    }

    return {
      u_colors: {
        type: "uniform3fv",
        value: expandedColors.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
      },
      u_opacities: {
        type: "uniform1fv",
        value: options.opacities,
      },
      u_total_size: {
        type: "uniform1f",
        value: options.totalSize,
      },
      u_dot_size: {
        type: "uniform1f",
        value: options.dotSize,
      },
    };
  }

  private getShaderSource(options: Required<DotsOptions>): string {
    return `#version 300 es
precision mediump float;

in vec2 fragCoord;

uniform float u_time;
uniform float u_opacities[10];
uniform vec3 u_colors[6];
uniform float u_total_size;
uniform float u_dot_size;
uniform vec2 u_resolution;
${options.init}

out vec4 fragColor;

float PHI = 1.61803398874989484820459;
float random(vec2 xy) {
  return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vec2 st = fragCoord.xy;

  ${
    options.center.includes("x")
      ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
      : ""
  }
  ${
    options.center.includes("y")
      ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
      : ""
  }

  float opacity = step(0.0, st.x);
  opacity *= step(0.0, st.y);

  vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

  float frequency = 5.0;
  float show_offset = random(st2);
  float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
  opacity *= u_opacities[int(rand * 10.0)];
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
  opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

  vec3 color = u_colors[int(show_offset * 6.0)];

  ${options.shader}

  fragColor = vec4(color, opacity);
  fragColor.rgb *= fragColor.a;
}`;
  }

  destroy(): void {
    this.shader?.destroy();
  }
}
