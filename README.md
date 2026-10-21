# Dune II: The Battle for Arrakis — ReArrakis Modern Port

[![Platform: WebAssembly](https://img.shields.io/badge/Platform-WebAssembly%20%2F%20HTML5-orange.svg)](#quick-start)
[![Play Online: GitHub Pages](https://img.shields.io/badge/Play%20Online-GitHub%20Pages-brightgreen.svg)](https://andvolodko.github.io/dune2-sega-web/)
[![Engine: ReArrakis AOT](https://img.shields.io/badge/Engine-ReArrakis%20Static%20Decompilation-red.svg)](https://github.com/kruzeman/ReArrakis)
[![Audio: Yamaha YM2612](https://img.shields.io/badge/Audio-YM2612%20FM%20Stereo-green.svg)](#audio--features)

A modern, high-performance port of the legendary Sega Genesis RTS **Dune II: The Battle for Arrakis** powered by **ReArrakis** ahead-of-time (AOT) static binary recompilation into native C11/C++ and WebAssembly.

---

## 🌟 Highlights

- **Play Online:** Play instantly in any web browser without installation at **[https://andvolodko.github.io/dune2-sega-web/](https://andvolodko.github.io/dune2-sega-web/)**
- **Native RTS Mouse Controls:** Point-and-click unit selection, right-click orders, build placement, context menus, and mouse wheel tactical zoom (50% - 100%).
- **Adaptive Widescreen:** Extended battlefield rendering up to 1080p, beyond the original 320×224 Sega viewport.
- **60 FPS Hardware Acceleration:** Fluid simulation with zero frame drops on modern hardware.
- **Authentic Yamaha FM Audio:** Emulated Yamaha YM2612 and PSG sound chip synthesis.
- **Local Play:** Play locally via `node server.js` at [http://localhost:8000](http://localhost:8000).

---

## 🚀 Quick Start (Web Edition)

Start the local web server configured with required COOP/COEP headers for WebAssembly:

```bash
node server.js
```

Then open your browser at: **[http://localhost:8000](http://localhost:8000)**

---

## 🛠️ Building from Source (WebAssembly)

If you need to rebuild the WebAssembly artifacts from an original Sega Genesis ROM image (`Dune - The Battle for Arrakis (USA)`):

1. **Decompile ROM to C source code:**
   ```bash
   cd rearrakis_src
   python tools/build_dune.py "/path/to/Dune - The Battle for Arrakis (U) [!].bin" --emit-only
   ```
   *Generates `rearrakis_src/build/dune.c` with translated code and embedded assets.*

2. **Compile Sound Engine & WebAssembly via Emscripten:**
   ```bash
   # 1. Compile Yamaha YM2612 / PSG sound synthesis runtime
   em++ -std=c++17 -O2 -c genesis_recompiler/audio_ymfm.cpp -o build/sound_wasm.o

   # 2. Link into WebAssembly module (HTML, JS, WASM)
   em++ -O2 -Wno-unused-function -DGENESIS_SDL2 -DGENESIS_DUNE_MOUSE -DGENESIS_AUDIO \
     -sUSE_SDL=2 -sASYNCIFY=1 -sALLOW_MEMORY_GROWTH=1 \
     -sTOTAL_STACK=16777216 -sINITIAL_MEMORY=67108864 \
     build/dune.c build/sound_wasm.o -o build/dune_web.html
   ```

   **Alternative: Build with Docker (if Emscripten SDK is not installed locally):**
   ```bash
   # Windows PowerShell / CMD:
   docker run --rm -v "%cd%/rearrakis_src:/src" -w /src emscripten/emsdk:latest em++ -std=c++17 -O2 -c genesis_recompiler/audio_ymfm.cpp -o build/sound_wasm.o
   docker run --rm -v "%cd%/rearrakis_src:/src" -w /src emscripten/emsdk:latest em++ -O2 -Wno-unused-function -DGENESIS_SDL2 -DGENESIS_DUNE_MOUSE -DGENESIS_AUDIO -sUSE_SDL=2 -sASYNCIFY=1 -sALLOW_MEMORY_GROWTH=1 -sTOTAL_STACK=16777216 -sINITIAL_MEMORY=67108864 build/dune.c build/sound_wasm.o -o build/dune_web.html
   ```

---

## 🖱️ RTS Controls & Keybindings

| Action | Control | Function |
| :--- | :--- | :--- |
| **Select / Order** | **Left Click (LMB)** / `C` key | Select unit, confirm building placement, issue movement orders |
| **Cancel / Deselect** | **Right Click (RMB)** / `X` key | Deselect active unit, cancel construction |
| **Command Action Menu** | **Wheel Click (MMB)** / `Z` key | Unit context actions (Move, Attack, Harvest, Guard) |
| **Tactical Zoom** | **Mouse Wheel** | Zoom in / out between 50% (wide map) and 100% (close-up) |
| **Edge Scrolling** | **Screen Edge Hover** | Move mouse towards window borders to smoothly pan the camera |
| **Speed Boost** | **TAB Key** | Toggle 3x Fast-Forward speed |
| **Pause / Briefing** | **SPACE / ENTER** | Mentat tactical advisor & in-game options menu |
| **Quit Game** | **ESC** | Release mouse pointer / Exit fullscreen |

---

## 🔑 Level Passwords & Cheats

### Secret Master Cheats
Enter in the **Password** menu from the game start screen:
- **`PLAYTESTER`** — Divine Shield: All your units and structures become completely invulnerable.
- **`LOOKAROUND`** — Orbital Radar: Clears the entire fog of war / shroud across the map.
- **`SPLURGEOLA`** — CHOAM Grant: Instantly adds **+25,000 Spice Credits** to your treasury.
- **`DUNEFINALE`** — Final Mission: Jump directly to the final mission 10 for any house.
- **`VERSIONNUM`** — Version Info: Displays engine version and build details dialog.

### Campaign Passwords (Sega Genesis USA)

| Mission | House Atreides | House Harkonnen | House Ordos |
| :---: | :---: | :---: | :---: |
| **2** | `DIPLOMATIC` | `DEMOLITION` | `DOMINATION` |
| **3** | `SPICEDANCE` | `SPICESATYR` | `SPICESABRE` |
| **4** | `ETERNALSUN` | `BURNINGSUN` | `ARRAKISSUN` |
| **5** | `DEFTHUNTER` | `DARKHUNTER` | `COLDHUNTER` |
| **6** | `FAIRMENTAT` | `EVILMENTAT` | `WILYMENTAT` |
| **7** | `ASHLIKENNY` | `ITSJOEBWAN` | `SLYMELANIE` |
| **8** | `SONICBLAST` | `DEVASTATOR` | `STEALTHWAR` |
| **9** | `DUNERUNNER` | `DEATHRULER` | `POWERCRUSH` |
| **Final** | `DUNEFINALE` | `DUNEFINALE` | `DUNEFINALE` |

---

## 🏗️ Technical Architecture

- **Translator:** `kruzeman/ReArrakis` Motorola 68000 and Z80 disassembly pipeline.
- **Frontend:** SDL2 (Simple DirectMedia Layer 2) video, audio, and event loop.
- **Sound Synthesis:** `ymfm` Yamaha YM2612 and Texas Instruments SN76489 PSG emulator.
- **WebAssembly Core:** Compiled via Emscripten `emsdk` with native 60 FPS `emscripten_set_main_loop` hardware `requestAnimationFrame` synchronization.

---

## 📜 License & Notices

- **Engine Code:** [MIT License](LICENSE.md)
- **Third-Party Notices:** [THIRD_PARTY_NOTICES.md](rearrakis_src/THIRD_PARTY_NOTICES.md) (`ymfm` BSD 3-Clause, `SDL2` zlib).
- **Trademarks & Assets:** *Dune* is a trademark of The Herbert Limited Partnership. Original *Dune II* assets (c) Westwood Studios / Sega / Virgin Games.

*The Spice must flow.*
