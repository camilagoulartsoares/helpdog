import { Router } from 'express'
import { prisma } from '../db.js'

export const campaignRouter = Router()

campaignRouter.get('/', async (_req, res) => {
  const campaign = await prisma.campaign.findUnique({ where: { id: 1 } })
  if (!campaign) {
    return res.status(404).json({ error: 'Campanha não encontrada.' })
  }

  const aggregate = await prisma.donation.aggregate({
    where: { campaignId: 1 },
    _sum: { amountCents: true },
    _count: { _all: true },
  })

  const raisedCents = aggregate._sum.amountCents ?? 0
  const donorsCount = aggregate._count._all
  const progressPercent = Math.min(
    100,
    Math.round((raisedCents / campaign.goalCents) * 100),
  )

  res.json({
    campaign: {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goalCents: campaign.goalCents,
      raisedCents,
      donorsCount,
      progressPercent,
    },
  })
})
