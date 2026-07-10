import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db.js'

export const donationsRouter = Router()

const createDonationSchema = z.object({
  donorName: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(80),
  donorEmail: z
    .string()
    .trim()
    .email('E-mail inválido.')
    .optional()
    .or(z.literal('')),
  amountCents: z
    .number()
    .int()
    .min(100, 'Valor mínimo: R$ 1,00.')
    .max(10000000, 'Valor máximo: R$ 100.000,00.'),
  message: z.string().trim().max(280).optional().or(z.literal('')),
})

donationsRouter.get('/', async (_req, res) => {
  const donations = await prisma.donation.findMany({
    where: { campaignId: 1 },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      donorName: true,
      amountCents: true,
      message: true,
      createdAt: true,
    },
  })

  res.json({ donations })
})

donationsRouter.post('/', async (req, res) => {
  const parsed = createDonationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Dados inválidos.',
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const { donorName, donorEmail, amountCents, message } = parsed.data

  const donation = await prisma.donation.create({
    data: {
      campaignId: 1,
      donorName,
      donorEmail: donorEmail || null,
      amountCents,
      message: message || null,
    },
    select: {
      id: true,
      donorName: true,
      amountCents: true,
      message: true,
      createdAt: true,
    },
  })

  res.status(201).json({ donation })
})
