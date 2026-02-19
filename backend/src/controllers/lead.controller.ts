import { Request, Response, NextFunction } from "express";
import { leadService } from "../services/lead.service.js";
import { sendSuccess, sendPaginated } from "../lib/response.js";
import type { ListLeadsQuery } from "../validators/lead.validator.js";

export class LeadController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.create(req.body);
      sendSuccess(res, lead, "Lead created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as ListLeadsQuery;
      const result = await leadService.list(query);
      sendPaginated(res, result.leads, result.page, result.limit, result.total);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.updateStatus(req.params.id, req.body);
      sendSuccess(res, lead, "Lead status updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.getById(req.params.id);
      sendSuccess(res, lead);
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();

