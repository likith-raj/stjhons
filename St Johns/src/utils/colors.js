export const PLAYER_COLORS = [
  '#39FF14', // neon green
  '#00D9FF', // neon cyan
  '#FF10F0', // neon magenta
  '#FF6B00', // neon orange
  '#FFFF00', // neon yellow
  '#BF00FF', // neon violet
  '#FF0080', // deep magenta
  '#00FF88', // bright green
]

export const TEAM_COLORS = [
  '#FF1744', // deep red
  '#00BCD4', // cyan
  '#FFC400', // amber
  '#76FF03', // lime
  '#E040FB', // deep purple
  '#00E5FF', // bright cyan
  '#FF9100', // deep orange
  '#F50057', // pink
]

export const getPlayerColor = (index) => {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

export const getTeamColor = (index) => {
  return TEAM_COLORS[index % TEAM_COLORS.length]
}
