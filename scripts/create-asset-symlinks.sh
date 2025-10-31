#!/bin/bash
###############################################################################
# Create Asset Symlinks for Backwards Compatibility
#
# This script creates symlinks from the legacy asset paths to the new modular
# structure, ensuring existing code continues to work during migration.
#
# Usage:
#   chmod +x scripts/create-asset-symlinks.sh
#   ./scripts/create-asset-symlinks.sh
#
# Note: On Windows, use Git Bash or WSL, or use mklink instead
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$ROOT_DIR/assets/images"

echo -e "${BLUE}🔗 Creating Asset Symlinks${NC}"
echo -e "${BLUE}===========================${NC}\n"

# Counter for created symlinks
LINK_COUNT=0

###############################################################################
# Helper function to create symlink
###############################################################################
create_symlink() {
  local target="$1"
  local link_name="$2"
  local description="$3"

  # Check if target exists
  if [ ! -e "$target" ]; then
    echo -e "${YELLOW}⚠ Skipping (target doesn't exist): $description${NC}"
    return
  fi

  # Check if symlink already exists
  if [ -L "$link_name" ]; then
    echo -e "${YELLOW}⚠ Symlink already exists: $description${NC}"
    return
  fi

  # Check if regular file/dir exists at link location
  if [ -e "$link_name" ]; then
    echo -e "${YELLOW}⚠ File already exists (not a symlink): $description${NC}"
    return
  fi

  # Ensure parent directory exists
  mkdir -p "$(dirname "$link_name")"

  # Create relative symlink
  # Use realpath to create relative path
  local link_dir="$(dirname "$link_name")"
  cd "$link_dir"
  local rel_target="$(realpath --relative-to=. "$target" 2>/dev/null || echo "$target")"
  cd - > /dev/null

  # Create symlink (use relative if possible, absolute as fallback)
  ln -s "$rel_target" "$link_name"

  echo -e "${GREEN}✓ Created: $description${NC}"
  ((LINK_COUNT++))
}

###############################################################################
# Shared UI Elements
###############################################################################
echo -e "\n${BLUE}📦 Shared UI Elements${NC}"
create_symlink \
  "$ASSETS_DIR/game/ui-elements/health-bar.png" \
  "$ASSETS_DIR/shared/ui/health-bar.png" \
  "health-bar.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/duit-bar.png" \
  "$ASSETS_DIR/shared/ui/duit-bar.png" \
  "duit-bar.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/bg-nation.png" \
  "$ASSETS_DIR/shared/ui/bg-nation.png" \
  "bg-nation.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/star.png" \
  "$ASSETS_DIR/shared/ui/star.png" \
  "star.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/flare.png" \
  "$ASSETS_DIR/shared/ui/flare.png" \
  "flare.png"

###############################################################################
# Shared Backgrounds
###############################################################################
echo -e "\n${BLUE}📦 Shared Backgrounds${NC}"
create_symlink \
  "$ASSETS_DIR/game/backgrounds/bg-main.png" \
  "$ASSETS_DIR/shared/backgrounds/bg-main.png" \
  "bg-main.png"

create_symlink \
  "$ASSETS_DIR/game/backgrounds/board-bg.png" \
  "$ASSETS_DIR/shared/backgrounds/board-bg.png" \
  "board-bg.png"

###############################################################################
# Shared Buttons
###############################################################################
echo -e "\n${BLUE}📦 Shared Buttons${NC}"
create_symlink \
  "$ASSETS_DIR/game/buttons/menu-button.png" \
  "$ASSETS_DIR/shared/buttons/menu-button.png" \
  "menu-button.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/next-button.png" \
  "$ASSETS_DIR/shared/buttons/next-button.png" \
  "next-button.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/ok-button.png" \
  "$ASSETS_DIR/shared/buttons/ok-button.png" \
  "ok-button.png"

###############################################################################
# Game-Specific: DBP Sejarah
###############################################################################
echo -e "\n${BLUE}📦 DBP Sejarah Game Assets${NC}"
create_symlink \
  "$ASSETS_DIR/game/backgrounds/soalan-board.png" \
  "$ASSETS_DIR/games/dbp-sejarah/soalan-board.png" \
  "soalan-board.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/crossword-box.png" \
  "$ASSETS_DIR/games/dbp-sejarah/crossword-box.png" \
  "crossword-box.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/jawapan-button.png" \
  "$ASSETS_DIR/games/dbp-sejarah/jawapan-button.png" \
  "jawapan-button.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/betul-button.png" \
  "$ASSETS_DIR/games/dbp-sejarah/betul-button.png" \
  "betul-button.png"

create_symlink \
  "$ASSETS_DIR/game/buttons/salah-button.png" \
  "$ASSETS_DIR/games/dbp-sejarah/salah-button.png" \
  "salah-button.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/isi-tempat-kosong.png" \
  "$ASSETS_DIR/games/dbp-sejarah/isi-tempat-kosong.png" \
  "isi-tempat-kosong.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/tahniah-bg.png" \
  "$ASSETS_DIR/games/dbp-sejarah/tahniah-bg.png" \
  "tahniah-bg.png"

create_symlink \
  "$ASSETS_DIR/game/ui-elements/button-teruskan.png" \
  "$ASSETS_DIR/games/dbp-sejarah/button-teruskan.png" \
  "button-teruskan.png"

###############################################################################
# Branding Assets
###############################################################################
echo -e "\n${BLUE}📦 Branding Assets${NC}"
create_symlink \
  "$ASSETS_DIR/game/LOGO DBP/logo-dbp.png" \
  "$ASSETS_DIR/branding/logo-dbp.png" \
  "logo-dbp.png"

create_symlink \
  "$ASSETS_DIR/game/LOGO DBP/LOGO DBP.svg" \
  "$ASSETS_DIR/branding/logo-dbp.svg" \
  "logo-dbp.svg"

create_symlink \
  "$ASSETS_DIR/game/MASTHEAD/TITLE.svg" \
  "$ASSETS_DIR/branding/title-masthead.svg" \
  "title-masthead.svg"

###############################################################################
# Summary
###############################################################################
echo -e "\n${GREEN}✅ Done! Created $LINK_COUNT symlinks${NC}"

if [ $LINK_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⚠ No new symlinks were created. They may already exist.${NC}"
fi

echo -e "\n${BLUE}📝 Next steps:${NC}"
echo "1. Verify symlinks: ls -la $ASSETS_DIR/shared/"
echo "2. Test asset loading in app"
echo "3. Begin component migration to use new paths"
echo ""
echo -e "${YELLOW}💡 Tip: To remove all symlinks later, run:${NC}"
echo "   find $ASSETS_DIR -type l -delete"

