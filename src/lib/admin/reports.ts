'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getAdminSession } from '@/lib/auth/next-auth';
import { prisma } from '@/lib/db';
import type { ReportStatus } from '@/lib/types';

export type ReportActionResult = { ok: true } | { ok: false; error?: string };

async function requireAdmin(): Promise<boolean> {
  return (await getAdminSession())?.user.role === 'ADMIN';
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
): Promise<ReportActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: 'Not authorised' };

  try {
    await prisma.contentReport.update({ where: { id }, data: { status } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { ok: false, error: 'That report no longer exists.' };
    }
    return { ok: false, error: 'Could not update the report. Please try again.' };
  }

  revalidatePath('/admin');
  return { ok: true };
}
