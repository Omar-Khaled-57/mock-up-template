# Device Mockup Template

A drag-and-drop scene builder for creating device mockup images with desktop, tablet, and phone frames. Built with React + Tailwind CSS + Vite.

## Features

- **3 device frames** — Desktop monitor (with stand), iPad, and Phone
- **Drag & drop** — Freely reposition any device inside the scene using pointer events
- **Overflow mode** — Toggle to allow devices to extend partially off-screen for cut-off composition effects
- **Background gradient** — 4-color pickers + angle slider, updates live
- **Upload screenshots** — Click any device screen to upload an image (shown with `object-fit: contain` — no cropping)
- **Export PNG** — Captures the scene at 2× via html2canvas
- **Editable title & slogan** — Click to edit inline, with independent font size sliders
- **Unlimited text boxes** — Press `+` to add draggable, editable text overlays with per-box colour, background toggle, font-size slider, and Title/Slogan style presets
- **Arrow-key nudge** — Focus a text box's handle bar, then use arrow keys (1px) or Shift+arrow (10px) for precise positioning

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Edit `src/` components to customise.

## Build

```bash
npm run build        # output → dist/
npm run preview      # serve the build locally
```

## Project Structure

```
src/
├── App.jsx                      # Root: gradient/text-box state, export handler
├── main.jsx                     # Entry point
├── index.css                    # Tailwind directives + custom styles
└── components/
    ├── Controls.jsx             # Toolbar: gradient pickers, overflow toggle,
    │                            #   text-box adder, font-size sliders, export
    ├── Scene.jsx                # Canvas: title, slogan, 3 devices, text overlays
    ├── EditableText.jsx         # Inline contentEditable with placeholder
    ├── DeviceIcons.jsx          # Shared SVG icon components
    ├── DraggableDevice.jsx      # Pointer-event drag wrapper (for devices)
    ├── DraggableTextOverlay.jsx # Draggable text box with options menu
    ├── ScreenContainer.jsx      # Image upload area (object-fit: contain)
    ├── Monitor.jsx              # Desktop monitor device frame
    ├── Ipad.jsx                 # Tablet device frame
    └── Phone.jsx                # Phone device frame
```

## Usage

| Action | How |
|---|---|
| Change gradient | Pick the 4 colors and drag the Angle slider in the toolbar |
| Upload a screenshot | Click any device screen, select an image file |
| Move a device | Drag the device body (tap first on touch devices) |
| Let devices overflow | Toggle **Overflow** in the toolbar |
| Edit title / slogan | Click the text directly on the scene |
| Resize title / slogan | Use the **Title** / **Slogan** sliders in the toolbar |
| Add a text box | Click **+** next to the Text colour picker in the toolbar |
| Change text-box colour | Open its ⚙ menu, use the colour picker or type a hex code |
| Toggle text-box background | ⚙ menu → **Background** toggle |
| Change text-box font size | ⚙ menu → **Size** slider |
| Apply Title / Slogan style | ⚙ menu → **Imitate Title** / **Imitate Slogan** |
| Delete a text box | Click **×** on its handle bar |
| Nudge a text box | Click its handle bar, then press arrow keys (Shift = 10px) |
| Export | Click **Export PNG** in the toolbar |

## Tech

- [React 18](https://react.dev)
- [Vite 6](https://vitejs.dev)
- [Tailwind CSS 3](https://tailwindcss.com)
- [html2canvas](https://html2canvas.hertzen.com) (loaded dynamically on export)
