import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.campaign.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Ração para cães de rua',
      description:
        'Meta mensal para comprar ração e água para cães em situação de rua na nossa região.',
      goalCents: 500000, // R$ 5.000,00
    },
  })

  const count = await prisma.donation.count()
  if (count === 0) {
    await prisma.donation.createMany({
      data: [
        {
          campaignId: 1,
          donorName: 'Ana',
          amountCents: 2500,
          message: 'Todo doguinho merece comer bem 💛',
        },
        {
          campaignId: 1,
          donorName: 'Pedro',
          amountCents: 1000,
          message: 'Pequena ajuda, grande diferença.',
        },
        {
          campaignId: 1,
          donorName: 'Marina',
          amountCents: 5000,
          message: null,
        },
      ],
    })
  }

  console.log('Seed concluído: campanha e doações iniciais prontas.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
