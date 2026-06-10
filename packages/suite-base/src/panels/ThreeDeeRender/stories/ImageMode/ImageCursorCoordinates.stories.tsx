// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { StoryObj } from "@storybook/react";
import { fireEvent, screen, waitFor } from "@storybook/testing-library";

import { makeRawImageAndCalibration } from "@lichtblick/suite-base/panels/ThreeDeeRender/stories/ImageMode/imageCommon";
import PanelSetup, { Fixture } from "@lichtblick/suite-base/stories/PanelSetup";

import { ImagePanel } from "../../index";

export default {
  title: "panels/ThreeDeeRender/Images/CursorCoordinates",
  component: ImagePanel,
  parameters: { colorScheme: "light" },
};

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 45;

function makeFixture(): Fixture {
  const { calibrationMessage, cameraMessage } = makeRawImageAndCalibration({
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    frameId: "camera",
    imageTopic: "camera",
    calibrationTopic: "calibration",
  });

  return {
    topics: [
      { name: "calibration", schemaName: "foxglove.CameraCalibration" },
      { name: "camera", schemaName: "foxglove.RawImage" },
    ],
    frame: {
      calibration: [calibrationMessage],
      camera: [cameraMessage],
    },
    capabilities: [],
    activeData: {
      currentTime: { sec: 10, nsec: 0 },
    },
  };
}

export const ShowsPixelCoordinates: StoryObj<{ cursorX: number; cursorY: number }> = {
  render: () => (
    <div style={{ width: 800, height: 600, flex: "0 0 auto" }}>
      <PanelSetup fixture={makeFixture()} includeSettings={false}>
        <ImagePanel
          overrideConfig={{
            ...ImagePanel.defaultConfig,
            imageMode: {
              calibrationTopic: "calibration",
              imageTopic: "camera",
            },
          }}
        />
      </PanelSetup>
    </div>
  ),
  args: {
    cursorX: 400,
    cursorY: 300,
  },
  play: async ({ args }) => {
    const canvas = await waitFor(() => {
      const el = document.querySelector("canvas");
      if (!el) {
        throw new Error("canvas not found");
      }
      return el;
    });

    const rect = canvas.getBoundingClientRect();
    const clientX = rect.left + args.cursorX;
    const clientY = rect.top + args.cursorY;

    // given an image is displayed on the canvas
    // when the cursor moves over the image
    fireEvent.mouseMove(canvas, { clientX, clientY });

    // then pixel coordinates are shown in the overlay
    const overlay = await screen.findByTestId("image-cursor-overlay");
    expect(overlay.textContent).toMatch(/X: \d+/);
    expect(overlay.textContent).toMatch(/Y: \d+/);
  },
};

export const PixelCoordinatesStableAcrossZoom: StoryObj<{ cursorX: number; cursorY: number }> = {
  ...ShowsPixelCoordinates,
  play: async ({ args }) => {
    const canvas = await waitFor(() => {
      const el = document.querySelector("canvas");
      if (!el) {
        throw new Error("canvas not found");
      }
      return el;
    });

    const rect = canvas.getBoundingClientRect();
    const clientX = rect.left + args.cursorX;
    const clientY = rect.top + args.cursorY;

    // given an image is displayed and the cursor is over a pixel
    fireEvent.mouseMove(canvas, { clientX, clientY });
    const overlay = await screen.findByTestId("image-cursor-overlay");
    const coordsBeforeZoom = overlay.textContent;

    // when the view is zoomed at the same cursor position
    fireEvent.wheel(canvas, { clientX, clientY, deltaY: -100 });
    fireEvent.mouseMove(canvas, { clientX, clientY });

    // then the pixel coordinates remain the same
    await waitFor(() => {
      expect(screen.getByTestId("image-cursor-overlay").textContent).toBe(coordsBeforeZoom);
    });
  },
};
