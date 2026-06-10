// SPDX-FileCopyrightText: Copyright (C) 2023-2026 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PaletteOptions } from "@mui/material/styles";
import { CSSProperties } from "react";

declare module "@mui/material/styles" {
  interface Palette {
    name: string;
    appBar: {
      main: CSSProperties["color"];
      primary: CSSProperties["color"];
      text: CSSProperties["color"];
    };
  }
  interface PaletteOptions {
    name: string;
    appBar: {
      main: CSSProperties["color"];
      primary: CSSProperties["color"];
      text: CSSProperties["color"];
    };
  }
  interface TypeBackground {
    menu: CSSProperties["color"];
  }
}

// Prolific design system colors (rebranding theme)
// https://github.com/prolific-oss/design-system
const prolific = {
  primary400: "#0C4BBA",
  primary500: "#00389A",
  primary700: "#002B75",
  primary100: "#76A3F0",
  neutral50: "#FCFCFD",
  neutral100: "#F8FAFC",
  neutral150: "#EEF3F6",
  neutral200: "#E0E8EE",
  neutral250: "#CDDAE4",
  neutral300: "#B7C7D5",
  neutral350: "#9EB0C2",
  neutral500: "#67778E",
  neutral600: "#4D5A6B",
  neutral700: "#333B46",
  neutral800: "#191D22",
  danger400: "#D92929",
  alarm400: "#D47E15",
  success400: "#008033",
  accent800: "#63B0B3",
};

export const dark: PaletteOptions = {
  name: "dark",
  mode: "dark",
  tonalOffset: 0.15,
  appBar: {
    main: prolific.primary700,
    primary: prolific.primary100,
    text: prolific.neutral50,
  },
  primary: { main: prolific.primary400 },
  secondary: { main: prolific.neutral300 },
  error: { main: prolific.danger400 },
  warning: { main: prolific.alarm400 },
  success: { main: prolific.success400 },
  info: { main: prolific.accent800 },
  text: {
    primary: prolific.neutral50,
    secondary: prolific.neutral300,
  },
  divider: prolific.neutral600,
  background: {
    default: prolific.neutral800,
    paper: prolific.neutral700,
    menu: prolific.neutral700,
  },
  grey: {
    50: prolific.neutral800,
    100: prolific.neutral700,
    200: prolific.neutral600,
    300: prolific.neutral500,
    400: prolific.neutral350,
    500: prolific.neutral300,
    600: prolific.neutral250,
    700: prolific.neutral200,
    800: prolific.neutral150,
    900: prolific.neutral100,
    A100: prolific.neutral700,
    A200: prolific.neutral500,
    A400: prolific.neutral300,
    A700: prolific.neutral100,
  },
};

export const light: PaletteOptions = {
  name: "light",
  mode: "light",
  tonalOffset: 0.22,
  appBar: {
    main: prolific.primary700,
    primary: prolific.primary400,
    text: prolific.neutral50,
  },
  primary: { main: prolific.primary400 },
  secondary: { main: prolific.neutral500 },
  error: { main: prolific.danger400 },
  warning: { main: prolific.alarm400 },
  success: { main: prolific.success400 },
  info: { main: prolific.accent800 },
  background: {
    default: prolific.neutral100,
    paper: prolific.neutral50,
    menu: prolific.neutral50,
  },
  text: {
    primary: prolific.neutral800,
    secondary: prolific.neutral500,
  },
  divider: prolific.neutral250,
  grey: {
    50: prolific.neutral50,
    100: prolific.neutral100,
    200: prolific.neutral150,
    300: prolific.neutral200,
    400: prolific.neutral250,
    500: prolific.neutral350,
    600: prolific.neutral500,
    700: prolific.neutral600,
    800: prolific.neutral700,
    900: prolific.neutral800,
    A100: prolific.neutral200,
    A200: prolific.neutral350,
    A400: prolific.neutral600,
    A700: prolific.neutral800,
  },
};
