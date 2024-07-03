uniform vec3 uLightPosition;
uniform bool uEdge;
uniform float uEdgeRatio;

varying vec2 vUv;
varying vec3 vEyeDirection;
varying vec3 vLightDirection;

void main() {
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

  if(uEdge) {
    worldPosition += normal * uEdgeRatio;
  } else {

    vec3 viewPosition = (viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;

    vec3 eyeDirection = normalize(cameraPosition - worldPosition);

    vec3 lightDirection = normalize(uLightPosition - worldPosition);

    vec3 transformedNormal = normalize(normalMatrix * normal);

    vec3 tangent = normalize(cross(transformedNormal, vec3(0.0, 1.0, 0.0)));

    vec3 bitangent = normalize(cross(transformedNormal, tangent));

    vEyeDirection = normalize(vec3(dot(tangent, eyeDirection), dot(bitangent, eyeDirection), dot(transformedNormal, eyeDirection)));

    vLightDirection = normalize(vec3(dot(tangent, lightDirection), dot(bitangent, lightDirection), dot(transformedNormal, lightDirection)));

    vUv = uv;
  }

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
}