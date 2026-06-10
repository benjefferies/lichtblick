// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

import * as THREE from "three";

import { screenToImagePixel } from "./screenToImagePixel";

const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = 50;
const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 100;

function createTestSetup(): {
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  canvasSize: THREE.Vector2;
} {
  const camera = new THREE.PerspectiveCamera(90, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 10);
  camera.position.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const geometry = new THREE.PlaneGeometry(2, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);

  const canvasSize = new THREE.Vector2(CANVAS_WIDTH, CANVAS_HEIGHT);
  return { camera, mesh, canvasSize };
}

describe("screenToImagePixel", () => {
  it("returns pixel coordinates at the canvas center", () => {
    // given a camera facing a plane mesh mapped to image dimensions
    const { camera, mesh, canvasSize } = createTestSetup();

    // when the cursor is at the center of the canvas
    const result = screenToImagePixel(
      new THREE.Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
      camera,
      canvasSize,
      mesh,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    // then the pixel coordinates are at the image center
    expect(result).toEqual({ x: IMAGE_WIDTH / 2, y: IMAGE_HEIGHT / 2 });
  });

  it("returns pixel coordinates within image bounds for on-mesh hits", () => {
    // given a camera facing a plane mesh mapped to image dimensions
    const { camera, mesh, canvasSize } = createTestSetup();

    // when the cursor is on the canvas over the mesh
    const result = screenToImagePixel(
      new THREE.Vector2(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4),
      camera,
      canvasSize,
      mesh,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    // then the pixel coordinates are within the image dimensions
    expect(result).toBeDefined();
    expect(result!.x).toBeGreaterThanOrEqual(0);
    expect(result!.x).toBeLessThanOrEqual(IMAGE_WIDTH);
    expect(result!.y).toBeGreaterThanOrEqual(0);
    expect(result!.y).toBeLessThanOrEqual(IMAGE_HEIGHT);
  });

  it("returns undefined when the ray misses the mesh", () => {
    // given a camera facing a plane mesh mapped to image dimensions
    const { camera, mesh, canvasSize } = createTestSetup();

    // when the cursor is far outside the canvas where the ray misses the mesh
    const result = screenToImagePixel(
      new THREE.Vector2(-1000, -1000),
      camera,
      canvasSize,
      mesh,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    // then no pixel coordinates are returned
    expect(result).toBeUndefined();
  });

  it("returns undefined for zero-sized canvas or image", () => {
    // given a valid camera and mesh setup
    const { camera, mesh } = createTestSetup();

    // when the canvas has zero width
    const zeroCanvasResult = screenToImagePixel(
      new THREE.Vector2(10, 10),
      camera,
      new THREE.Vector2(0, CANVAS_HEIGHT),
      mesh,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    // then no pixel coordinates are returned
    expect(zeroCanvasResult).toBeUndefined();

    // when the image has zero height
    const zeroImageResult = screenToImagePixel(
      new THREE.Vector2(10, 10),
      camera,
      new THREE.Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
      mesh,
      IMAGE_WIDTH,
      0,
    );

    // then no pixel coordinates are returned
    expect(zeroImageResult).toBeUndefined();
  });
});
