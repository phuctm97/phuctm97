export function setDragVisible(visible: boolean): void {
  if (visible) document.documentElement.dataset.dragVisible = "";
  else delete document.documentElement.dataset.dragVisible;
}
