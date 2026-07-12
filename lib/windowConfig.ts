export const WINDOW_CONSTRAINTS = {
  MIN_WIDTH: 900,
  MIN_HEIGHT: 650,
  MAX_WIDTH_PX: 1400,
  DEFAULT_WIDTH_VW: 0.85,
  DEFAULT_HEIGHT_VH: 0.85,
  MAX_HEIGHT_VH: 0.9,
  MAXIMIZED_WIDTH_VW: 0.96,
  MAXIMIZED_HEIGHT_VH: 0.94,
  MAXIMIZED_TOP_VH: 0.03,
  MAXIMIZED_LEFT_VW: 0.02,
  VIEWPORT_MARGIN: 0.05,
  TITLE_BAR_HEIGHT: 48,
  TASKBAR_HEIGHT: 56,
} as const;

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getViewport() {
  if (typeof window === "undefined") {
    return { width: 1400, height: 900 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

export function getEffectiveMinSize() {
  const { width: vw, height: vh } = getViewport();
  const margin = WINDOW_CONSTRAINTS.VIEWPORT_MARGIN;
  return {
    width: Math.min(WINDOW_CONSTRAINTS.MIN_WIDTH, vw * (1 - margin * 2)),
    height: Math.min(
      WINDOW_CONSTRAINTS.MIN_HEIGHT,
      (vh - WINDOW_CONSTRAINTS.TASKBAR_HEIGHT) * (1 - margin * 2)
    ),
  };
}

export function getMaxWindowSize() {
  const { width: vw, height: vh } = getViewport();
  const margin = WINDOW_CONSTRAINTS.VIEWPORT_MARGIN;
  return {
    width: Math.min(
      WINDOW_CONSTRAINTS.MAX_WIDTH_PX,
      vw * (1 - margin * 2)
    ),
    height: Math.min(
      vh * WINDOW_CONSTRAINTS.MAX_HEIGHT_VH,
      (vh - WINDOW_CONSTRAINTS.TASKBAR_HEIGHT) * (1 - margin * 2)
    ),
  };
}

export function getDefaultWindowSize() {
  const { width: vw, height: vh } = getViewport();
  const max = getMaxWindowSize();
  const min = getEffectiveMinSize();

  const width = Math.max(
    min.width,
    Math.min(max.width, Math.min(WINDOW_CONSTRAINTS.MAX_WIDTH_PX, vw * WINDOW_CONSTRAINTS.DEFAULT_WIDTH_VW))
  );
  const height = Math.max(
    min.height,
    Math.min(max.height, vh * WINDOW_CONSTRAINTS.DEFAULT_HEIGHT_VH)
  );

  return { width, height };
}

export function getCenteredPosition(size: { width: number; height: number }) {
  const { width: vw, height: vh } = getViewport();
  const availableHeight = vh - WINDOW_CONSTRAINTS.TASKBAR_HEIGHT;

  return {
    x: Math.max(0, (vw - size.width) / 2),
    y: Math.max(0, (availableHeight - size.height) / 2),
  };
}

export function getMaximizedBounds(): WindowBounds {
  const { width: vw, height: vh } = getViewport();
  const availableHeight = vh - WINDOW_CONSTRAINTS.TASKBAR_HEIGHT;

  return {
    x: vw * WINDOW_CONSTRAINTS.MAXIMIZED_LEFT_VW,
    y: vh * WINDOW_CONSTRAINTS.MAXIMIZED_TOP_VH,
    width: vw * WINDOW_CONSTRAINTS.MAXIMIZED_WIDTH_VW,
    height: Math.min(
      availableHeight * WINDOW_CONSTRAINTS.MAXIMIZED_HEIGHT_VH,
      vh * WINDOW_CONSTRAINTS.MAXIMIZED_HEIGHT_VH
    ),
  };
}

export function clampWindowSize(size: { width: number; height: number }) {
  const min = getEffectiveMinSize();
  const max = getMaxWindowSize();

  return {
    width: Math.max(min.width, Math.min(max.width, size.width)),
    height: Math.max(min.height, Math.min(max.height, size.height)),
  };
}

export function clampWindowPosition(
  pos: { x: number; y: number },
  size: { width: number; height: number }
) {
  const { width: vw, height: vh } = getViewport();
  const titleBar = WINDOW_CONSTRAINTS.TITLE_BAR_HEIGHT;
  const minVisible = titleBar * 0.3;
  const availableHeight = vh - WINDOW_CONSTRAINTS.TASKBAR_HEIGHT;

  // Enforce a minimum safe margin (in pixels) around window bounds
  const SAFE_MARGIN_PX = 32;

  const minX = SAFE_MARGIN_PX;
  const maxX = Math.max(SAFE_MARGIN_PX, vw - size.width - SAFE_MARGIN_PX);

  const minY = SAFE_MARGIN_PX - (titleBar - minVisible); // allow a small titlebar peek
  const maxY = Math.max(SAFE_MARGIN_PX, availableHeight - size.height - SAFE_MARGIN_PX + minVisible);

  return {
    x: Math.max(minX, Math.min(pos.x, maxX)),
    y: Math.max(minY, Math.min(pos.y, maxY)),
  };
}
