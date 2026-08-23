export const styles = `
.xcv-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.xcv-mic {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #6965db;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(105, 101, 219, 0.45);
  transition: transform 0.15s ease, background 0.15s ease;
}

.xcv-mic:hover {
  transform: scale(1.05);
  background: #7c78e6;
}

.xcv-mic--active {
  background: #e0566f;
  box-shadow: 0 6px 18px rgba(224, 86, 111, 0.45);
  animation: xcv-pulse 1.4s ease-in-out infinite;
}

@keyframes xcv-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.xcv-panel {
  width: 280px;
  background: #26262b;
  border: 1px solid #3a3a42;
  border-radius: 12px;
  color: #ededf0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.xcv-panel[hidden] {
  display: none;
}

.xcv-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #2f2f36;
  border-bottom: 1px solid #3a3a42;
}

.xcv-panel__title {
  font-size: 13px;
  font-weight: 600;
}

.xcv-close {
  border: none;
  background: transparent;
  color: #a0a0ab;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}

.xcv-close:hover {
  color: #ededf0;
}

.xcv-panel__body {
  padding: 12px;
  min-height: 64px;
}

.xcv-transcript {
  margin: 0;
  font-size: 13px;
  color: #ededf0;
  white-space: pre-wrap;
  word-break: break-word;
}

.xcv-transcript:empty::before {
  content: attr(data-empty);
  color: #a0a0ab;
  font-style: italic;
}

.xcv-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid #3a3a42;
  font-size: 12px;
  color: #a0a0ab;
}

.xcv-state {
  color: #6965db;
  font-weight: 500;
}
`;
