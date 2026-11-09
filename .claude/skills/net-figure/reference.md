# Data reference

Types live in `src/components/figures/types.ts`. Coordinates are viewBox units.

## Figure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Name used in `<NetFigure id="…" />`. Must match the key in `src/figures/index.ts`. |
| `kicker` | `string` | Yes | Short mono label above the title, for example `DHCP`. |
| `title` | `string` | Yes | The claim the figure proves. One sentence. |
| `size` | `[number, number]` | Yes | viewBox width and height. Width `640`; height `200`–`300`. |
| `devices` | `FigDevice[]` | Yes | Devices on the canvas. |
| `links` | `FigLink[]` | Yes | Cables between devices. |
| `steps` | `FigStep[]` | Yes | Three to six steps. |

## FigDevice

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique id. Used in `path`, `focus`, `notes` and `ports` keys. |
| `kind` | `'pc' \| 'switch' \| 'router' \| 'server' \| 'cloud'` | Yes | Glyph drawn in the tile. |
| `label` | `string` | No | Text under the tile. Defaults to `id`. |
| `x`, `y` | `number` | Yes | Centre of the tile. The tile is 52 × 52. |
| `note` | `string` | No | Second line under the label. Replaced by `notes` in a step. |
| `labelTop` | `boolean` | No | Draws the label and note above the tile. |

## FigLink

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `a`, `b` | `string` | Yes | Device ids at each end. |
| `aPort`, `bPort` | `string` | No | Interface names. Shown beside each plug; used as `ports` keys. |
| `color` | `'orange' \| 'green' \| 'blue' \| 'brown'` | No | T568B pair colour. Default `blue`. |
| `striped` | `boolean` | No | Adds cream bands: the white conductor of the pair. |
| `label` | `string` | No | Chip at the middle of the cable, for example `trunk`. |
| `route` | `Route` | No | Cable shape. See [Routes](#routes). |

### Routes

| Value | Shape |
| --- | --- |
| `straight` | Direct line. Default when the devices share an `x` or `y`. |
| `hv` | Horizontal, then vertical. |
| `vh` | Vertical, then horizontal. Enters the second device from the side. |
| `hvh` | Z-shape through the middle `x`. Default otherwise. |
| `vhv` | Z-shape through the middle `y`. |

## FigStep

| Field | Type | Carries forward | Description |
| --- | --- | --- | --- |
| `caption` | `string` | No | One sentence, 20 words or fewer. Read by screen readers. |
| `packets` | `FigPacket[]` | No | Packets that move in this step, all at the same time. |
| `focus` | `string[]` | No | Device ids kept at full strength. Other devices and cables dim. |
| `ports` | `Record<string, PortState>` | Yes | Port states keyed `DEVICE:port`. `PortState` is `'forwarding' \| 'blocking' \| 'down'`. |
| `notes` | `Record<string, string>` | Yes | Replaces device notes, keyed by device id. |
| `cli` | `FigCli` | Yes | Console shown in the side panel. |
| `table` | `FigTable` | Yes | Table shown in the side panel. |

## FigPacket

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string[]` | Yes | Device ids in travel order. Each pair must share a link. |
| `label` | `string` | Yes | Message name. 10 characters or fewer. |
| `tag` | `string` | No | Dark prefix segment, for example `VLAN 10`. |
| `color` | `Conductor` | No | Chip colour. Default `orange`. |
| `drop` | `boolean` | No | Stops at the last device's port and shows ✕. |

## FigCli

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `device` | `string` | Yes | Hostname in the prompt: `R1` shows `R1#`. |
| `cmd` | `string` | Yes | Command, typed character by character. |
| `out` | `string[]` | No | Output lines, printed after the command finishes. |

## FigTable

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Panel heading, for example `SW1 · mac address-table`. |
| `cols` | `string[]` | Yes | Column headings. |
| `rows` | `string[][]` | Yes | Cell text. An empty array shows `(empty)`. |
| `fresh` | `number[]` | No | Row indexes highlighted as new. |

## Component

`<NetFigure id="…" />` renders a registered figure. `<NetFigure figure={…} />` renders a figure object directly.

| Behaviour | Detail |
| --- | --- |
| Autoplay | Plays once when 45% of the figure is in view. |
| Reduced motion | With `prefers-reduced-motion`, packets show as still frames. Autoplay is off. |
| Text version | Generated from the captions and commands. |
| Phone width | The stage keeps a 540px minimum and scrolls sideways. |
