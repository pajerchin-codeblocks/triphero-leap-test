

# Oprava pozadia na bielu farbu

## Problem
Aktualne `--background` je nastaveny na `0 0% 98%` (~#FAFAFA), ale referencny web pouziva cisty biely background `0 0% 100%` (#FFFFFF).

## Zmena

### `src/index.css` -- Light mode
Zmena jednej hodnoty:
- `--background: 0 0% 98%` --> `--background: 0 0% 100%`

Rovnako aktualizovat sidebar:
- `--sidebar-background: 0 0% 98%` --> `--sidebar-background: 0 0% 100%`

Vsetko ostatne zostava bez zmeny.

