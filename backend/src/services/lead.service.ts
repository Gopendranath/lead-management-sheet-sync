import { prisma } from "../lib/prisma.js";
import { ConflictError, NotFoundError } from "../lib/appError.js";
import { googleSheetsService } from "./googleSheets.service.js";
import type { CreateLeadInput, ListLeadsQuery, UpdateStatusInput } from "../validators/lead.validator.js";
import type { Prisma } from "@prisma/client";

export class LeadService {
  async create(input: CreateLeadInput) {
    // Check for duplicate email
    const existing = await prisma.lead.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new ConflictError("A lead with this email already exists");
    }

    // Create lead in database
    const lead = await prisma.lead.create({ data: input });

    // Sync to Google Sheets (non-blocking, graceful failure)
    try {
      const sheetRowId = await googleSheetsService.appendRow(lead);
      if (sheetRowId) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { sheetRowId },
        });
        lead.sheetRowId = sheetRowId;
      }
    } catch (error) {
      console.error("[Google Sheets] Failed to sync new lead:", error);
      // Don't crash — Sheets sync is best-effort
    }

    return lead;
  }

  async list(query: ListLeadsQuery) {
    const { page, limit, search, course, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (course) {
      where.course = { equals: course, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total, page, limit };
  }

  async updateStatus(id: string, input: UpdateStatusInput) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status: input.status },
    });

    // Sync status to Google Sheets (non-blocking, graceful failure)
    if (updatedLead.sheetRowId) {
      try {
        await googleSheetsService.updateRow(updatedLead.sheetRowId, {
          status: updatedLead.status,
        });
      } catch (error) {
        console.error("[Google Sheets] Failed to sync status update:", error);
      }
    }

    return updatedLead;
  }

  async getById(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    return lead;
  }
}

export const leadService = new LeadService();
