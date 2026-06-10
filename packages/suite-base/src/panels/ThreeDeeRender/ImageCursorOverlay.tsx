// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import tc from "tinycolor2";
import { makeStyles } from "tss-react/mui";

import { customTypography } from "@lichtblick/theme";

import { useRendererEvent } from "./RendererContext";
import type { ImagePixelCoords } from "./renderables/ImageMode/screenToImagePixel";

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(1),
    pointerEvents: "none",
    padding: theme.spacing(0.75, 1),
    backgroundColor: tc(theme.palette.background.paper).setAlpha(0.85).toString(),
  },
  label: {
    fontFamily: customTypography.fontMonospace,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.4,
  },
}));

type ImageCursorOverlayProps = {
  canvas: HTMLCanvasElement | ReactNull;
};

export function ImageCursorOverlay({
  canvas,
}: ImageCursorOverlayProps): React.JSX.Element | ReactNull {
  const { classes } = useStyles();
  const [pixel, setPixel] = useState<ImagePixelCoords | undefined>(undefined);

  useRendererEvent(
    "imageCursorPixelMoved",
    useCallback((newPixel) => {
      setPixel(newPixel);
    }, []),
  );

  useEffect(() => {
    if (!canvas) {
      return;
    }
    const onMouseLeave = () => {
      setPixel(undefined);
    };
    canvas.addEventListener("mouseleave", onMouseLeave);
    return () => {
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvas]);

  if (!pixel) {
    return ReactNull;
  }

  return (
    <Paper square={false} elevation={2} className={classes.root} data-testid="image-cursor-overlay">
      <Typography className={classes.label}>X: {pixel.x}</Typography>
      <Typography className={classes.label}>Y: {pixel.y}</Typography>
    </Paper>
  );
}
