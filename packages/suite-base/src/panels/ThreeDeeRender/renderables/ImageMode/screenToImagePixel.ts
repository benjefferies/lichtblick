// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import * as THREE from "three";

export type ImagePixelCoords = {
  x: number;
  y: number;
};

const ndcCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

/**
 * Converts canvas screen coordinates to image pixel coordinates by raycasting
 * against the image mesh. Returns undefined when the cursor is outside the image
 * (e.g. letterbox areas).
 */
export function screenToImagePixel(
  screenCoords: THREE.Vector2,
  camera: THREE.Camera,
  canvasSize: THREE.Vector2,
  mesh: THREE.Mesh,
  imageWidth: number,
  imageHeight: number,
): ImagePixelCoords | undefined {
  if (canvasSize.width <= 0 || canvasSize.height <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return undefined;
  }

  ndcCoords.set(
    (screenCoords.x / canvasSize.width) * 2 - 1,
    -((screenCoords.y / canvasSize.height) * 2 - 1),
  );

  raycaster.setFromCamera(ndcCoords, camera);
  const intersections = raycaster.intersectObject(mesh, false);
  const hit = intersections[0];
  if (!hit?.uv) {
    return undefined;
  }

  return {
    x: Math.round(hit.uv.x * imageWidth),
    y: Math.round(hit.uv.y * imageHeight),
  };
}
