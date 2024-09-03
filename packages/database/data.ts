import prisma from '.'

export async function getPositions() {
  const positions = await prisma.position.findMany()
  return positions
}
